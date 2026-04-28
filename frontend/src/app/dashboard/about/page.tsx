"use client";

import { Info, Code, Users, Cpu, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12 animate-fade-in">

            {/* Header */}
            <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Info className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">About Edgecase</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Supply Chain Analyser for Risk and Overconfidence
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                    <Cpu className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">AI-Powered Intelligence</h3>
                    <p className="text-sm text-muted-foreground">
                        Utilizing advanced LLMs to scrape, analyze, and interpret global supply chain disruptions in real-time.
                    </p>
                </div>
                <div className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                    <ShieldCheck className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Risk Quantification</h3>
                    <p className="text-sm text-muted-foreground">
                        Converting qualitative news into specific quantitative risk scores and financial exposure estimates.
                    </p>
                </div>
                <div className="p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                    <Code className="w-8 h-8 text-purple-500 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Modern Architecture</h3>
                    <p className="text-sm text-muted-foreground">
                        Built with Next.js, Python FastAPI, and vector databases for high-speed retrieval and analysis.
                    </p>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gradient-to-br from-primary/5 via-muted/50 to-background rounded-3xl p-8 border text-center space-y-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
                        <Users className="w-6 h-6" />
                        Built by Team <span className="text-primary">Localbros:3000</span>
                    </h2>
                    <p className="text-muted-foreground">
                        Developed with passion for the Hackathon.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
                    <div className="p-4 bg-background rounded-xl border shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            DP
                        </div>
                        <p className="font-bold">David Porathur</p>
                        <p className="text-xs text-primary font-medium mt-1">Team Lead</p>
                    </div>

                    <div className="p-4 bg-background rounded-xl border shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                            SC
                        </div>
                        <p className="font-bold">Swar Churi</p>
                        <p className="text-xs text-muted-foreground mt-1">Developer</p>
                    </div>

                    <div className="p-4 bg-background rounded-xl border shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            SB
                        </div>
                        <p className="font-bold">Sai Balkwade</p>
                        <p className="text-xs text-muted-foreground mt-1">Developer</p>
                    </div>

                    <div className="p-4 bg-background rounded-xl border shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            SG
                        </div>
                        <p className="font-bold">Sherwin Gonsalves</p>
                        <p className="text-xs text-muted-foreground mt-1">Developer</p>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-8 border-t">
                <p>&copy; {new Date().getFullYear()} Edgecase Project. All rights reserved.</p>
            </div>
        </div>
    );
}
