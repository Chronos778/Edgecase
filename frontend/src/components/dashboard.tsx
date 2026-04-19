"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Globe,
    Package,
    Activity,
    RefreshCcw,
    Circle,
    Wifi,
    WifiOff,
    Database,
    Server,
    Brain,
} from "lucide-react";
import { RiskScoreCard } from "./risk-score-card";
import { AlertsPanel } from "./alerts-panel";
import { RiskChart } from "./risk-chart";
import { RemindersWidget } from "./dashboard/RemindersWidget";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Mock data for initial development
const mockDashboardData = {
    risk: {
        overall_risk_score: 0.42,
        overconfidence_alerts: 3,
        high_risk_vendors: 7,
        affected_countries: 12,
        active_events: 24,
    },
    recent_events: [
        {
            id: "1",
            title: "Semiconductor shortage affecting Taiwan production",
            category: "commodity",
            severity: "high",
            country: "TWN",
            created_at: new Date().toISOString(),
        },
        {
            id: "2",
            title: "Port congestion at Shanghai continues",
            category: "logistics",
            severity: "medium",
            country: "CHN",
            created_at: new Date().toISOString(),
        },
        {
            id: "3",
            title: "New US export controls on AI chips",
            category: "trade_restriction",
            severity: "critical",
            country: "USA",
            created_at: new Date().toISOString(),
        },
    ],
    scraping_status: { status: "idle", jobs_pending: 0 },
};

interface ServiceStatus {
    name: string;
    status: "online" | "offline" | "checking";
    icon: typeof Server;
}

function SystemStatusBar() {
    const [mounted, setMounted] = useState(false);
    const [services, setServices] = useState<ServiceStatus[]>([
        { name: "Backend", status: "checking", icon: Server },
        { name: "Database", status: "checking", icon: Database },
        { name: "Ollama", status: "checking", icon: Brain },
    ]);

    useEffect(() => {
        setMounted(true);

        // Check backend status
        const checkServices = async () => {
            const newServices: ServiceStatus[] = [];

            // Backend API
            try {
                const res = await fetch(`${API_BASE}/health`, { method: "GET" });
                newServices.push({
                    name: "Backend",
                    status: res.ok ? "online" : "offline",
                    icon: Server,
                });
            } catch {
                newServices.push({ name: "Backend", status: "offline", icon: Server });
            }

            // Check scheduler/database via debug stats
            try {
                const res = await fetch(`${API_BASE}/api/debug/stats`);
                newServices.push({
                    name: "Database",
                    status: res.ok ? "online" : "offline",
                    icon: Database,
                });
            } catch {
                newServices.push({ name: "Database", status: "offline", icon: Database });
            }

            // Ollama
            try {
                const res = await fetch("http://localhost:11434/api/tags", { method: "GET" });
                newServices.push({
                    name: "Ollama",
                    status: res.ok ? "online" : "offline",
                    icon: Brain,
                });
            } catch {
                newServices.push({ name: "Ollama", status: "offline", icon: Brain });
            }

            setServices(newServices);
        };

        checkServices();
        const interval = setInterval(checkServices, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-muted/50 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Circle className="w-3 h-3" />
                    Checking system status...
                </div>
            </div>
        );
    }

    const allOnline = services.every(s => s.status === "online");
    const allOffline = services.every(s => s.status === "offline");

    return (
        <div className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm ${allOnline
            ? "bg-green-500/10 border border-green-500/30"
            : allOffline
                ? "bg-red-500/10 border border-red-500/30"
                : "bg-amber-500/10 border border-amber-500/30"
            }`}>
            <div className="flex items-center gap-2">
                {allOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                ) : allOffline ? (
                    <WifiOff className="w-4 h-4 text-red-500" />
                ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className={`font-medium ${allOnline ? "text-green-600 dark:text-green-400" :
                    allOffline ? "text-red-600 dark:text-red-400" :
                        "text-amber-600 dark:text-amber-400"
                    }`}>
                    {allOnline ? "All Systems Online" : allOffline ? "System Offline" : "Partial Connectivity"}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {services.map((service) => (
                    <div key={service.name} className="flex items-center gap-1.5">
                        <service.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{service.name}</span>
                        <span
                            className={`w-2 h-2 rounded-full ${service.status === "online"
                                ? "bg-green-500"
                                : service.status === "offline"
                                    ? "bg-red-500"
                                    : "bg-gray-400 animate-pulse"
                                }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Dashboard() {
    const [lastUpdated, setLastUpdated] = useState<string>("");

    // Set time on client only to avoid hydration mismatch
    useEffect(() => {
        setLastUpdated(new Date().toLocaleTimeString());
        const interval = setInterval(() => {
            setLastUpdated(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            try {
                const response = await fetch(`${API_BASE}/api/dashboard/summary`);
                if (!response.ok) throw new Error("API not available");
                return response.json();
            } catch {
                // Return mock data if API is not running
                return mockDashboardData;
            }
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });

    const summary = data || mockDashboardData;
    const riskLevel = getRiskLevel(summary.risk.overall_risk_score);

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* System Status Bar */}
            <SystemStatusBar />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Supply Chain Dashboard</h1>
                    <p className="text-muted-foreground">
                        Real-time risk monitoring and analysis
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                    <RefreshCcw className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-180 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Risk Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="animate-fade-in stagger-1">
                    <RiskScoreCard
                        title="Overall Risk Score"
                        value={`${(summary.risk.overall_risk_score * 100).toFixed(0)}%`}
                        subtitle={`Risk Level: ${riskLevel.label}`}
                        icon={Activity}
                        trend={
                            summary.risk.overall_risk_score > 0.5 ? (
                                <TrendingUp className="w-4 h-4 text-red-500 animate-pulse" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                            )
                        }
                        colorClass={riskLevel.colorClass}
                    />
                </div>

                <div className="animate-fade-in stagger-2">
                    <RiskScoreCard
                        title="Overconfidence Alerts"
                        value={summary.risk.overconfidence_alerts}
                        subtitle="Stability ≠ Security"
                        icon={AlertTriangle}
                        colorClass={
                            summary.risk.overconfidence_alerts > 0
                                ? "bg-amber-500/10 border-amber-500/30"
                                : "bg-green-500/10 border-green-500/30"
                        }
                    />
                </div>

                <div className="animate-fade-in stagger-3">
                    <RiskScoreCard
                        title="High Risk Vendors"
                        value={summary.risk.high_risk_vendors}
                        subtitle={`${summary.risk.affected_countries} countries affected`}
                        icon={Package}
                        colorClass="bg-orange-500/10 border-orange-500/30"
                    />
                </div>

                <div className="animate-fade-in stagger-4">
                    <RiskScoreCard
                        title="Active Events"
                        value={summary.risk.active_events}
                        subtitle="Monitoring worldwide"
                        icon={Globe}
                        colorClass="bg-blue-500/10 border-blue-500/30"
                    />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Risk Chart + Smart Reminders */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <RiskChart />
                    <div className="animate-fade-in">
                        <RemindersWidget />
                    </div>
                </div>

                {/* Right Column: Alerts Panel */}
                <div className="lg:col-span-1">
                    <AlertsPanel events={summary.recent_events} />
                </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground transition-all duration-300 hover:bg-muted animate-fade-in">
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${summary.scraping_status.status === "running"
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-400"
                            }`}
                    />
                    <span className="transition-colors duration-200">Scraping: {summary.scraping_status.status}</span>
                </div>
                <div className="text-border">|</div>
                <div className="transition-all duration-200">Last updated: {lastUpdated || "--:--:--"}</div>
            </div>
        </div>
    );
}

function getRiskLevel(score: number): { label: string; colorClass: string } {
    if (score >= 0.8) return { label: "Critical", colorClass: "bg-red-500/10 border-red-500/30" };
    if (score >= 0.6) return { label: "High", colorClass: "bg-orange-500/10 border-orange-500/30" };
    if (score >= 0.4) return { label: "Medium", colorClass: "bg-amber-500/10 border-amber-500/30" };
    return { label: "Low", colorClass: "bg-green-500/10 border-green-500/30" };
}
