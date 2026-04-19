"""
Ollama Client

Integration with Ollama for LLM inference using Qwen3.
"""

import asyncio
from typing import Optional, AsyncGenerator

import ollama

from config import settings


class OllamaClient:
    """
    Ollama client for LLM inference.
    
    Uses Qwen3 model for supply chain analysis.
    """
    
    SYSTEM_PROMPT = """You are SCARO, an AI assistant specialized in supply chain risk analysis.
Your role is to:
1. Analyze supply chain disruptions and their potential impacts
2. Identify overconfidence risks when supply chains appear stable but are fragile
3. Explain ripple effects when trade restrictions or disruptions occur
4. Provide actionable recommendations for risk mitigation

Be concise, factual, and data-driven in your responses.
When discussing risks, use clear severity levels: Low, Medium, High, Critical.
Always cite specific events, countries, or commodities when relevant."""
    
    def __init__(self):
        self.model = settings.ollama_model
        self.base_url = settings.ollama_base_url
    
    async def generate(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2000,
    ) -> str:
        """
        Generate a response from the LLM.
        
        Args:
            prompt: User prompt
            system: Optional system prompt override
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text
        """
        try:
            response = ollama.generate(
                model=self.model,
                prompt=prompt,
                system=system or self.SYSTEM_PROMPT,
                options={
                    "temperature": temperature,
                    "num_predict": max_tokens,
                },
            )
            return response.get("response", "")
        except Exception as e:
            print(f"Ollama error: {e}")
            return f"Error generating response: {e}"
    
    async def generate_stream(
        self,
        prompt: str,
        system: Optional[str] = None,
        temperature: float = 0.7,
    ) -> AsyncGenerator[str, None]:
        """
        Stream a response from the LLM.
        
        Yields:
            Text chunks
        """
        try:
            stream = ollama.generate(
                model=self.model,
                prompt=prompt,
                system=system or self.SYSTEM_PROMPT,
                stream=True,
                options={"temperature": temperature},
            )
            
            for chunk in stream:
                if "response" in chunk:
                    yield chunk["response"]
        except Exception as e:
            yield f"Error: {e}"
    
    async def chat(
        self,
        messages: list[dict],
        temperature: float = 0.7,
    ) -> str:
        """
        Chat with conversation history.
        
        Args:
            messages: List of {"role": "user/assistant", "content": "..."}
            temperature: Sampling temperature
            
        Returns:
            Assistant response
        """
        try:
            # Add system message
            full_messages = [
                {"role": "system", "content": self.SYSTEM_PROMPT},
                *messages,
            ]
            
            response = ollama.chat(
                model=self.model,
                messages=full_messages,
                options={"temperature": temperature},
            )
            return response.get("message", {}).get("content", "")
        except Exception as e:
            print(f"Ollama chat error: {e}")
            return f"Error: {e}"
    
    async def analyze_risk(self, event_description: str) -> dict:
        """
        Analyze a supply chain event for risk.
        
        Returns structured risk analysis.
        """
        prompt = f"""Analyze the following supply chain event for risk:

Event: {event_description}

Provide a structured analysis with:
1. Risk Level (Low/Medium/High/Critical)
2. Affected Sectors
3. Geographic Impact
4. Potential Ripple Effects
5. Recommended Actions

Be concise and specific."""

        response = await self.generate(prompt, temperature=0.3)
        
        # Parse response into structured format
        return {
            "analysis": response,
            "event": event_description,
        }
    
    async def explain_ripple_effect(
        self,
        source_event: str,
        affected_countries: list[str],
        affected_commodities: list[str],
    ) -> str:
        """
        Generate explanation of ripple effects.
        
        Args:
            source_event: The triggering event
            affected_countries: List of affected countries
            affected_commodities: List of affected commodities
            
        Returns:
            Natural language explanation
        """
        prompt = f"""Explain the ripple effect of the following supply chain disruption:

Event: {source_event}
Affected Countries: {', '.join(affected_countries)}
Affected Commodities: {', '.join(affected_commodities)}

Describe:
1. How this disruption propagates through the supply chain
2. Which industries are most vulnerable
3. Expected timeline of impact
4. Mitigation strategies

Be concise but comprehensive."""

        return await self.generate(prompt, temperature=0.5)
    
    async def detect_overconfidence(
        self,
        stability_score: float,
        fragility_score: float,
        time_since_incident_days: int,
    ) -> dict:
        """
        Analyze for overconfidence risk.
        
        Args:
            stability_score: Recent stability metric (0-1)
            fragility_score: Structural fragility metric (0-1)
            time_since_incident_days: Days since last disruption
            
        Returns:
            Overconfidence analysis
        """
        prompt = f"""Analyze for overconfidence risk in a supply chain with:

- Stability Score: {stability_score:.2f} (recent performance, 1=stable)
- Fragility Score: {fragility_score:.2f} (structural risk, 1=fragile)
- Days Since Last Incident: {time_since_incident_days}

Determine:
1. Is there an overconfidence risk? (Yes/No)
2. Confidence Gap (difference between perceived and actual risk)
3. Warning Signs
4. Recommendations

High stability + High fragility = Overconfidence Risk"""

        response = await self.generate(prompt, temperature=0.3)
        
        # Determine if overconfidence risk exists
        is_overconfident = stability_score > 0.7 and fragility_score > 0.6
        
        return {
            "is_overconfident": is_overconfident,
            "stability_score": stability_score,
            "fragility_score": fragility_score,
            "confidence_gap": stability_score - (1 - fragility_score),
            "analysis": response,
        }


# Global instance
ollama_client = OllamaClient()
