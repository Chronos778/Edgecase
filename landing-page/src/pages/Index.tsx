import { Globe } from "@/components/ui/globe";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import usePrefersReducedMotion from "@/hooks/use-prefers-reduced-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Building2,
  Calculator,
  Clock,
  Compass,
  Eye,
  FileCheck,
  Globe2,
  Inbox,
  LoaderCircle,
  Lock,
  MessageSquare,
  PieChart,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

const appUrl = "http://localhost:3000";

type IconItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const processSteps = [
  { id: 1, label: "Risk detected" },
  { id: 2, label: "Analyzed" },
  { id: 3, label: "Protected" },
];

const whyPillars: IconItem[] = [
  {
    icon: Shield,
    title: "Built for resilience",
    description: "Protect your operations from hidden vulnerabilities.",
  },
  {
    icon: Globe2,
    title: "Global visibility",
    description: "Monitor supply chains across continents in real-time.",
  },
  {
    icon: Sparkles,
    title: "Continuous improvement",
    description: "Learn from every event-build stronger supply chains.",
  },
];

const featureMatrix: (IconItem & { track: string })[] = [
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description:
      "Continuous surveillance of your supply chain with instant alerts for disruptions and anomalies.",
    track: "Monitoring",
  },
  {
    icon: Brain,
    title: "Risk Intelligence",
    description:
      "AI-powered analysis identifies hidden vulnerabilities before they become critical issues.",
    track: "Intelligence",
  },
  {
    icon: Globe2,
    title: "Network Mapping",
    description:
      "Visual representation of supplier relationships and dependency chains across global operations.",
    track: "Network",
  },
  {
    icon: PieChart,
    title: "Performance Analytics",
    description:
      "Comprehensive metrics and KPIs to optimize efficiency and reduce operational costs.",
    track: "Analytics",
  },
  {
    icon: Zap,
    title: "Predictive Insights",
    description:
      "Machine learning models forecast potential disruptions weeks before they occur.",
    track: "Forecasting",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and compliance standards protect your sensitive supply chain data.",
    track: "Security",
  },
  {
    icon: FileCheck,
    title: "Compliance Monitoring",
    description:
      "Automated tracking of regulatory requirements and certification standards across your supply network.",
    track: "Compliance",
  },
  {
    icon: Calculator,
    title: "Cost Optimization",
    description:
      "Intelligent cost analysis and optimization recommendations to maximize profitability and efficiency.",
    track: "Finance",
  },
  {
    icon: Building2,
    title: "Supplier Intelligence",
    description:
      "Comprehensive supplier profiling and performance tracking to ensure reliable partnerships.",
    track: "Suppliers",
  },
];

const trustPoints: IconItem[] = [
  {
    icon: Shield,
    title: "Your data stays protected-always.",
    description:
      "Enterprise-grade encryption and strict security practices keep your supply chain information safe.",
  },
  {
    icon: Target,
    title: "Insights you can rely on.",
    description:
      "Carefully trained AI models focus on accuracy and relevance-not noise.",
  },
  {
    icon: Clock,
    title: "Timely insights, right when you need them.",
    description:
      "Fast, responsive analysis helps teams act early instead of reacting late.",
  },
];

const scaroTimelineData = [
  {
    id: 1,
    title: "Data Protection",
    date: "Always",
    content:
      "Enterprise-grade encryption and strict security practices keep your supply chain information safe and compliant.",
    category: "Security",
    icon: Shield,
    relatedIds: [2, 6],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Real-Time Monitoring",
    date: "24/7",
    content:
      "Continuous surveillance of your supply chain with instant alerts for disruptions and anomalies across global operations.",
    category: "Monitoring",
    icon: Eye,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "AI Intelligence",
    date: "Live",
    content:
      "Carefully trained AI models focus on accuracy and relevance-identifying risks before they become critical issues.",
    category: "Intelligence",
    icon: Brain,
    relatedIds: [2, 4, 5],
    status: "in-progress" as const,
    energy: 90,
  },
  {
    id: 4,
    title: "Risk Analysis",
    date: "Instant",
    content:
      "Advanced risk assessment algorithms analyze patterns and predict potential supply chain vulnerabilities.",
    category: "Analysis",
    icon: AlertTriangle,
    relatedIds: [2, 3, 5],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 5,
    title: "Global Networks",
    date: "Worldwide",
    content:
      "Visual representation of supplier relationships and dependency chains across continents and regions.",
    category: "Network",
    icon: Globe2,
    relatedIds: [3, 4, 6],
    status: "completed" as const,
    energy: 80,
  },
  {
    id: 6,
    title: "Team Insights",
    date: "On-Demand",
    content:
      "Fast, responsive analysis helps teams act early instead of reacting late to supply chain disruptions.",
    category: "Insights",
    icon: Users,
    relatedIds: [1, 5, 7],
    status: "completed" as const,
    energy: 75,
  },
  {
    id: 7,
    title: "Performance Metrics",
    date: "Real-Time",
    content:
      "Comprehensive analytics and KPIs help optimize efficiency and reduce operational costs across your supply chain.",
    category: "Analytics",
    icon: PieChart,
    relatedIds: [6],
    status: "pending" as const,
    energy: 70,
  },
];

const stateBlocks = [
  {
    label: "Loading",
    detail: "Ingesting market advisories from distributed feeds.",
    tone: "loading",
    icon: LoaderCircle,
  },
  {
    label: "Error",
    detail: "One external connector needs authentication refresh.",
    tone: "error",
    icon: AlertTriangle,
  },
  {
    label: "Empty",
    detail: "No unresolved incidents in your active watchlist.",
    tone: "empty",
    icon: Inbox,
  },
] as const;

const revealDelayClasses = [
  "reveal-delay-0",
  "reveal-delay-1",
  "reveal-delay-2",
  "reveal-delay-3",
  "reveal-delay-4",
  "reveal-delay-5",
  "reveal-delay-6",
  "reveal-delay-7",
  "reveal-delay-8",
  "reveal-delay-9",
  "reveal-delay-10",
  "reveal-delay-11",
] as const;

const getRevealDelayClass = (index: number) =>
  revealDelayClasses[Math.min(index, revealDelayClasses.length - 1)];

const Index = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <main className="dispatch-page">
      <div className="dispatch-atmosphere" aria-hidden="true">
        <div className="dispatch-grid" />
        <div className="dispatch-orb dispatch-orb-a" />
        <div className="dispatch-orb dispatch-orb-b" />
      </div>

      <header className="dispatch-nav reveal reveal-delay-1">
        <a href="#top" className="dispatch-logo" aria-label="SCARO home">
          <img src="/logo.png" alt="SCARO Logo" className="dispatch-logo-image" />
          <span className="dispatch-logo-text">SCARO</span>
        </a>

        <nav className="dispatch-menu" aria-label="Primary">
          <a href="#features" className="dispatch-menu-link">
            Features
          </a>
          <a href="#why" className="dispatch-menu-link">
            Why SCARO
          </a>
          <a href="#security" className="dispatch-menu-link">
            Security
          </a>
        </nav>

        <div className="dispatch-menu-actions">
          <a href={appUrl} className="dispatch-button dispatch-button-quiet">
            Log in
          </a>
          <a href={appUrl} className="dispatch-button dispatch-button-solid">
            Get Started
          </a>
        </div>
      </header>

      <section id="top" className="hero-shell">
        <div className="hero-copy">
          <p className="hero-kicker reveal reveal-delay-2">
            Adaptive Risk Command
          </p>
          <h1 id="hero-heading" className="hero-title reveal reveal-delay-3">
            A smarter way to protect
            <span>your supply chain.</span>
          </h1>
          <p className="hero-subtitle reveal reveal-delay-4">
            SCARO - Your intelligent companion for supply chain clarity. Detect risks before they become crises.
          </p>

          <div className="hero-actions reveal reveal-delay-5">
            <a href={appUrl} className="dispatch-button dispatch-button-solid dispatch-button-large">
              Start analyzing
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a href={appUrl} className="dispatch-button dispatch-button-outline dispatch-button-large">
              See how it works
            </a>
          </div>

          <p className="hero-meta reveal reveal-delay-6">
            No credit card required · Enterprise-ready security
          </p>
        </div>

        <div className="hero-visual reveal reveal-delay-4">
          <div className="globe-stage">
            <Globe
              className="globe-canvas"
              config={{
                width: 600,
                height: 600,
                onRender: () => {},
                devicePixelRatio: 2,
                phi: 0,
                theta: 0.32,
                dark: 0,
                diffuse: 0.45,
                mapSamples: 15000,
                mapBrightness: 1.15,
                baseColor: [0.22, 0.43, 0.4],
                markerColor: [0.87, 0.36, 0.15],
                glowColor: [0.96, 0.88, 0.75],
                markers: [
                  { location: [14.5995, 120.9842], size: 0.03 },
                  { location: [19.076, 72.8777], size: 0.1 },
                  { location: [23.8103, 90.4125], size: 0.05 },
                  { location: [30.0444, 31.2357], size: 0.07 },
                  { location: [39.9042, 116.4074], size: 0.08 },
                  { location: [-23.5505, -46.6333], size: 0.1 },
                  { location: [19.4326, -99.1332], size: 0.1 },
                  { location: [40.7128, -74.006], size: 0.1 },
                  { location: [34.6937, 135.5022], size: 0.05 },
                  { location: [41.0082, 28.9784], size: 0.06 },
                  { location: [51.5074, -0.1278], size: 0.08 },
                  { location: [35.6762, 139.6503], size: 0.09 },
                  { location: [-33.8688, 151.2093], size: 0.07 },
                  { location: [55.7558, 37.6176], size: 0.06 },
                ],
              }}
            />
            <span className="globe-pill globe-pill-top">Global community</span>
            <span className="globe-pill globe-pill-right">Shared clarity</span>
            <span className="globe-pill globe-pill-bottom">One gentle step</span>
          </div>
        </div>
      </section>

      <section className="status-strip" aria-label="SCARO system states">
        {stateBlocks.map((state, index) => {
          const Icon = state.icon;
          return (
            <article
              key={state.label}
              className={`status-block status-block-${state.tone} reveal ${getRevealDelayClass(index + 7)}`}
              role="status"
              aria-live="polite"
            >
              <div className="status-icon-wrap">
                <Icon className={`size-4 ${state.tone === "loading" ? "spin" : ""}`} aria-hidden="true" />
              </div>
              <div>
                <p className="status-label">{state.label}</p>
                <p className="status-detail">{state.detail}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section id="why" className="dispatch-section section-why">
        <div className="section-heading">
          <p className="section-kicker">Mission</p>
          <h2>Why SCARO exists</h2>
          <p>
            In supply chains that demand constant attention, we&apos;ve created clarity and confidence through
            intelligent monitoring.
          </p>
        </div>

        <div className="why-layout">
          <div className="why-pillars">
            {whyPillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article key={pillar.title} className="why-pillar reveal">
                  <div className="why-pillar-icon">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                  </div>
                </article>
              );
            })}

            <div className="process-rail" aria-label="From risk to protection">
              <div className="process-line" aria-hidden="true" />
              {processSteps.map((step) => (
                <div key={step.id} className="process-step">
                  <div className="process-step-badge">{step.id}</div>
                  <p>{step.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="why-story reveal reveal-delay-3">
            <Compass className="size-8" aria-hidden="true" />
            <p>
              We built this space to help you find clarity-one gentle step at a time. Not another tool that demands
              more. A companion that gives you room to breathe.
            </p>
            <div className="why-story-foot">
              <span className="signal-dot" aria-hidden="true" />
              <span>Join thousands finding their calm</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="dispatch-section section-features">
        <div className="section-heading">
          <p className="section-kicker">Capabilities</p>
          <h2>Intelligent Risk Detection</h2>
          <p>
            Advanced capabilities that uncover hidden vulnerabilities and protect your supply chain with powerful tools
            designed to monitor and optimize your global operations.
          </p>
        </div>

        <div className="feature-matrix" role="table" aria-label="SCARO capability matrix">
          <div className="feature-matrix-header" role="row">
            <span role="columnheader">Module</span>
            <span role="columnheader">What it does</span>
            <span role="columnheader">Track</span>
          </div>

          {featureMatrix.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                role="row"
                className={`feature-row reveal ${getRevealDelayClass(index + 2)}`}
              >
                <div role="cell" className="feature-row-icon">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div role="cell" className="feature-row-main">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <p role="cell" className="feature-row-track">
                  {feature.track}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="security" className="dispatch-section section-security">
        <div className="section-heading">
          <p className="section-kicker">Reliability</p>
          <h2>Built for Supply Chain Teams</h2>
          <p>Reliability and clarity when stakes are high. Explore our ecosystem below.</p>
        </div>

        <div className="timeline-shell reveal">
          {!prefersReducedMotion && <RadialOrbitalTimeline timelineData={scaroTimelineData} />}
          {prefersReducedMotion && (
            <div className="reduced-motion-note">
              Interactive visualization disabled to honor your motion preferences.
            </div>
          )}
        </div>

        <div className="trust-grid">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <article key={point.title} className={`trust-item reveal ${getRevealDelayClass(index + 3)}`}>
                <div className="trust-icon-wrap">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            );
          })}
        </div>

        <p className="section-footnote">Because trust is built through clarity-not complexity.</p>
      </section>

      <section className="dispatch-section section-cta">
        <div className="cta-panel reveal">
          <h2>Ready to Strengthen Your Supply Chain?</h2>
          <p>
            Join forward-thinking organizations using SCARO to detect risks before they become crises.
          </p>
          <div className="cta-actions">
            <a href={appUrl} className="dispatch-button dispatch-button-solid dispatch-button-large">
              <Rocket className="size-4" aria-hidden="true" />
              Start Free Trial
            </a>
            <a href={appUrl} className="dispatch-button dispatch-button-outline dispatch-button-large">
              <MessageSquare className="size-4" aria-hidden="true" />
              Schedule Demo
            </a>
          </div>
          <p className="cta-meta">No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </section>

      <footer className="dispatch-footer">
        <a href="#top" className="dispatch-logo" aria-label="SCARO home">
          <img src="/logo.png" alt="SCARO Logo" className="dispatch-logo-image" />
          <span className="dispatch-logo-text">SCARO</span>
        </a>

        <nav className="dispatch-footer-links" aria-label="Footer links">
          <a href="#">Documentation</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </nav>

        <p>© 2026 SCARO. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default Index;
