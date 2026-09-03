import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { InteractivePreview } from "@/components/landing/interactive-preview"
import { EthicsCheckerWidget } from "@/components/landing/ethics-checker-widget"
import { WorkflowSteps } from "@/components/landing/workflow-steps"
import { RolePerspectives } from "@/components/landing/role-perspectives"
import { CertificateShowcase } from "@/components/landing/certificate-showcase"
import { ImpactMetrics } from "@/components/landing/impact-metrics"
import { FaqSection } from "@/components/landing/faq-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Institutional Top Navbar */}
      <Navbar />

      {/* Main Landing Flow */}
      <main className="flex-1">
        {/* 1. Hero Banner */}
        <HeroSection />

        {/* 2. Interactive Protocol Inspector / Simulator */}
        <InteractivePreview />

        {/* 3. Instant Ethics Determination / Pre-Screening Checker */}
        <EthicsCheckerWidget />

        {/* 4. 5-Stage Institutional Governance Workflow */}
        <WorkflowSteps />

        {/* 5. Role Perspectives (Researchers, Screening Officers, Reviewers) */}
        <RolePerspectives />

        {/* 6. Digital Ethical Clearance Certificate Showcase */}
        <CertificateShowcase />

        {/* 7. Institutional Impact & Velocity Metrics */}
        <ImpactMetrics />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Institutional Footer */}
      <Footer />
    </div>
  )
}
