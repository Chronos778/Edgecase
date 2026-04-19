"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import {
  LayoutDashboard,
  Network,
  AlertTriangle,
  CloudRain,
  Ban,
  Settings,
  Moon,
  Sun,
  Radar,
  MessageSquare,
  Database,
  BarChart3,
  Info,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/graph", label: "Supply Chain Graph", icon: Network },
  { href: "/dashboard/risks", label: "Risk Analysis", icon: AlertTriangle },
  { href: "/dashboard/analyze", label: "Dataset Analysis", icon: BarChart3 },
  { href: "/dashboard/scraping", label: "Scraping Control", icon: Radar },
  { href: "/dashboard/query", label: "Ask AI", icon: MessageSquare },
  { href: "/dashboard/weather", label: "Weather Impact", icon: CloudRain },
  { href: "/dashboard/simulator", label: "Shock Simulator", icon: Zap },
  { href: "/dashboard/report", label: "Exec. Briefing", icon: BarChart3 },
  { href: "/dashboard/restrictions", label: "Trade Restrictions", icon: Ban },
  { href: "/dashboard/debug", label: "Data Browser", icon: Database },
  { href: "/dashboard/about", label: "About", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-64 h-screen bg-background border-r border-border flex flex-col print:hidden">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Image
            src="/scaro-logo.png"
            alt="SCARO Logo"
            width={48}
            height={48}
            className="object-contain"
            unoptimized
          />
          <div>
            <h1 className="text-lg text-foreground" style={{ fontWeight: 800 }}>
              SCARO
            </h1>
            <p
              className="text-xs text-muted-foreground"
              style={{ fontWeight: 600 }}
            >
              Supply Chain Risk
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-out animate-fade-in stagger-${index + 1} ${isActive
                ? "bg-[#6AAF98]/10 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent hover:translate-x-1"
                }`}
              style={isActive ? { color: "#6AAF98" } : undefined}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
              />
              <span className="text-sm" style={{ fontWeight: 600 }}>
                {item.label}
              </span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#6AAF98" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {/* Theme Toggle - only render after mount to prevent hydration mismatch */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:translate-x-1"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
            ) : (
              <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
            )
          ) : (
            <Sun className="w-5 h-5" />
          )}
          <span className="text-sm" style={{ fontWeight: 600 }}>
            {mounted
              ? theme === "dark"
                ? "Light Mode"
                : "Dark Mode"
              : "Toggle Theme"}
          </span>
        </button>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:translate-x-1"
        >
          <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-sm" style={{ fontWeight: 600 }}>
            Settings
          </span>
        </Link>
      </div>
    </aside>
  );
}
