"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface RiskScoreCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: LucideIcon;
    trend?: ReactNode;
    colorClass?: string;
}

export function RiskScoreCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    colorClass = "bg-card",
}: RiskScoreCardProps) {
    return (
        <div
            className={`group p-5 rounded-xl border ${colorClass} transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] cursor-pointer`}
        >
            <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                {trend && <div className="transition-transform duration-300 group-hover:scale-110">{trend}</div>}
            </div>

            <div className="mt-4">
                <p className="text-sm text-muted-foreground transition-colors duration-200">{title}</p>
                <p className="text-3xl font-bold mt-1 transition-all duration-300 group-hover:tracking-wide">{value}</p>
                <p className="text-xs text-muted-foreground mt-1 transition-colors duration-200">{subtitle}</p>
            </div>
        </div>
    );
}
