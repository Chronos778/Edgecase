# api.py - Consolidated API with all modules merged
import json
import os
import re
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
import requests
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from chronos import Chronos2Pipeline

# ============================================================================
# CHRONOS FORECASTING
# ============================================================================

pipeline = Chronos2Pipeline.from_pretrained(
    "amazon/chronos-2",
    device_map="cuda"  # change to cuda if available
)


def chronos_forecast(series, horizon, freq="h"):
    df = pd.DataFrame({"target": series.dropna().values})
    df["timestamp"] = pd.date_range(
        start="2023-01-01", periods=len(df), freq=freq
    )
    df["id"] = "signal"

    train_df = df.iloc[:-horizon]

    forecast_df = pipeline.predict_df(
        train_df,
        prediction_length=horizon,
        quantile_levels=[0.1, 0.5, 0.9],
        id_column="id",
        timestamp_column="timestamp",
        target="target"
    )

    actual = df.iloc[-horizon:]["target"].values

    return forecast_df, actual


# ============================================================================
# RISK METRICS
# ============================================================================

def stability_score(actual):
    cv = np.std(actual) / (np.mean(actual) + 1e-6)
    return float(max(0, 1 - cv))


def fragility_score(actual):
    rolling_std = pd.Series(actual).rolling(10).std()
    spike_ratio = rolling_std.max() / (rolling_std.mean() + 1e-6)
    return float(min(1, spike_ratio / 5))


def overconfidence_score(actual, lower, upper):
    outside_ci = ((actual < lower) | (actual > upper)).mean()
    ci_width = (upper - lower).mean() / (np.mean(actual) + 1e-6)
    return float(min(1, outside_ci * (1 / ci_width)))


def risk_score(stability, fragility, overconfidence):
    score = (
        0.4 * fragility +
        0.4 * overconfidence +
        0.2 * (1 - stability)
    )
    return float(min(1, score))


def risk_level(score):
    if score < 0.3:
        return "LOW"
    elif score < 0.6:
        return "MEDIUM"
    else:
        return "HIGH"


# ============================================================================
# GEMINI MAPPER
# ============================================================================

MODEL_NAME = "gemini-2.5-flash"
API_BASE = "https://generativelanguage.googleapis.com/v1beta"


def map_columns_with_gemini(columns: List[str], sample_rows: Dict[str, List[Any]]):
    """Call Gemini via REST (no google client SDK) and return parsed JSON."""

    prompt = f"""
You are a supply chain risk analyst.

Given column names and small samples, classify each column into:
- stability
- fragility
- overconfidence
- not_relevant

Also specify:
- whether the column should be forecasted (true/false)

Rules:
- Only numeric, time-varying columns can be forecasted
- Identifiers, IDs, categories are not forecastable
- Output STRICT JSON, no explanations outside JSON

Columns and samples:
{json.dumps(sample_rows, indent=2)}
"""

    api_key = "AIzaSyAqiR9t5Tp9vw-sX8JnGoEiJfaOQjtnpZc"
    if not api_key:
        raise RuntimeError("Missing GOOGLE_API_KEY environment variable for Gemini.")

    url = f"{API_BASE}/models/{MODEL_NAME}:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    try:
        resp = requests.post(url, json=payload, timeout=30)
    except requests.RequestException as exc:
        raise RuntimeError(f"Gemini request failed: {exc}") from exc

    if not resp.ok:
        raise RuntimeError(f"Gemini HTTP error {resp.status_code}: {resp.text[:200]}")

    data = resp.json()

    if "error" in data:
        message = data.get("error", {}).get("message", "Unknown error")
        raise RuntimeError(f"Gemini API error: {message}")

    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError(f"Unexpected Gemini response shape: {data}") from exc

    parsed = _extract_json(text)
    if parsed is None:
        snippet = (text or "")[:200].replace("\n", " ")
        raise RuntimeError(f"Gemini response was not valid JSON: '{snippet}'")
    return parsed


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None

    cleaned = text.strip()

    fence_pattern = re.compile(r"^```[a-zA-Z0-9]*\s*(.*?)\s*```$", re.DOTALL)
    fenced = fence_pattern.match(cleaned)
    if fenced:
        cleaned = fenced.group(1).strip()

    brace_match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not brace_match:
        return None

    candidate = brace_match.group(0)
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        return None


# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(title="Supply Chain Risk Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze_supply_chain(file: UploadFile):
    df = pd.read_csv(file.file)

    # Take small samples for Gemini
    sample_rows = {
        col: df[col].dropna().head(5).tolist()
        for col in df.columns
    }

    # Gemini semantic mapping
    column_map = map_columns_with_gemini(
        columns=df.columns.tolist(),
        sample_rows=sample_rows
    )

    results = {}
    skipped = {}
    MIN_POINTS = 20

    for col, meta in column_map.items():
        if not meta.get("forecastable", False):
            skipped[col] = "Marked non-forecastable by Gemini"
            continue

        series = df[col].dropna()
        if len(series) < MIN_POINTS:
            skipped[col] = f"Too few points (<{MIN_POINTS}) for forecasting"
            continue

        forecast_df, actual = chronos_forecast(
            series=series,
            horizon=max(4, min(72, max(1, len(series)//4)))
        )

        lower = forecast_df["0.1"].values[:len(actual)]
        upper = forecast_df["0.9"].values[:len(actual)]

        stability = stability_score(actual)
        fragility = fragility_score(actual)
        overconf = overconfidence_score(actual, lower, upper)

        risk = risk_score(stability, fragility, overconf)

        results[col] = {
            "mapped_classification": meta.get("classification", "unknown"),
            "stability": round(stability, 3),
            "fragility": round(fragility, 3),
            "overconfidence": round(overconf, 3),
            "risk_score": round(risk, 3),
            "risk_level": risk_level(risk)
        }

    return {
        "status": "success",
        "signals_analyzed": list(results.keys()),
        "results": results,
        "skipped": skipped,
        "debug": {
            "columns_received": df.columns.tolist(),
            "column_map": column_map,
            "row_counts": {c: int(df[c].dropna().shape[0]) for c in df.columns},
            "min_points": MIN_POINTS,
        },
    }
