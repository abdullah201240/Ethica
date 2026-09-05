"use client"

import * as React from "react"
import Image from "next/image"
import {
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Award,
  QrCode,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles,
  FileCheck2,
  Eye,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/sonner"
import type { Protocol } from "@/lib/protocols-store"

interface CertificateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  protocol: Protocol | null
}

export function CertificateModal({
  open,
  onOpenChange,
  protocol,
}: CertificateModalProps) {
  const [viewMode, setViewMode] = React.useState<"digital" | "master">("digital")
  const [copiedHash, setCopiedHash] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)

  // Default fallback values if no protocol is selected
  const certId = protocol?.id || "ETH-2026-074"
  const certTitle = protocol?.title || "Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses"
  const certDepartment = protocol?.department || "Department of Behavioral Sciences & Nursing"
  const certBoard = protocol?.board || "Social, Behavioral & Community Research Board"
  const certRisk = protocol?.risk || "Exempt - Fast Track"
  const certIssuedDate = protocol?.submissionDate || "Aug 14, 2026"
  const certExpiryDate = "Aug 14, 2027"
  const certRef = `DIU-IRB-2026-${certId.replace(/[^0-9]/g, "").slice(-3) || "074"}`
  const certHash = "8f4b29c98a3e74d10fa4d1b82d90bc39e102948b813b2c1766a2e881fa2c92e1"
  const verifyUrl = `https://ethica.diu.edu.bd/verify/${certId}`

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certHash)
    setCopiedHash(true)
    toast.success("Cryptographic Hash Copied", {
      description: "SHA-256 digital signature hash copied to clipboard.",
    })
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl)
    setCopiedLink(true)
    toast.success("Verification URL Copied", {
      description: verifyUrl,
    })
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = "/images/certificate-master.webp"
    link.download = `Ethica_Clearance_Certificate_${certId}.webp`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Certificate Downloaded", {
      description: `Official clearance credential for protocol ${certId} downloaded successfully.`,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-[calc(100vw-1.5rem)] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#071321] shadow-2xl"
        showCloseButton={true}
      >
        {/* Modal Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/70 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#002752]/10 dark:bg-sky-500/10 text-primary dark:text-sky-300 flex items-center justify-center shrink-0">
              <Award className="size-5 text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base sm:text-lg font-black text-primary dark:text-white">
                  Institutional Ethical Clearance Certificate
                </DialogTitle>
                <Badge className="bg-[#198754] text-white text-micro font-bold">
                  Verified & Active
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground font-mono">
                Certificate Ref: <span className="font-bold text-foreground">{certRef}</span> • Protocol: <span className="font-bold text-primary dark:text-sky-300">{certId}</span>
              </DialogDescription>
            </div>
          </div>

          {/* Quick Actions & View Mode Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5 shadow-2xs">
              <Button
                type="button"
                variant={viewMode === "digital" ? "default" : "ghost"}
                size="xs"
                onClick={() => setViewMode("digital")}
                className={`h-7 px-2.5 text-xs font-bold rounded-md gap-1 ${
                  viewMode === "digital"
                    ? "bg-[#002752] text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <FileCheck2 className="size-3.5" />
                <span>Certificate</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === "master" ? "default" : "ghost"}
                size="xs"
                onClick={() => setViewMode("master")}
                className={`h-7 px-2.5 text-xs font-bold rounded-md gap-1 ${
                  viewMode === "master"
                    ? "bg-[#002752] text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Eye className="size-3.5" />
                <span>Engraved View</span>
              </Button>
            </div>

            {/* Print Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 px-2.5 text-xs font-bold rounded-md gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Print Certificate (A4 / Letter Format)"
            >
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </Button>

            {/* Direct Download Button */}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-3 text-xs font-bold rounded-md gap-1.5 bg-[#198754] hover:bg-[#157347] text-white shadow-xs"
              title="Download High-Resolution Certificate"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        {/* Certificate Scrollable Viewport */}
        <div className="p-4 sm:p-6 lg:p-8 max-h-[calc(100dvh-12rem)] overflow-y-auto bg-slate-100/60 dark:bg-slate-950/60">
          {viewMode === "master" ? (
            /* ── Archival Engraved Master View ── */
            <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl bg-slate-900 flex items-center justify-center p-2 sm:p-4">
              <Image
                src="/images/certificate-master.webp"
                alt="Official University Institutional Research Ethics Clearance Certificate with ornate gold embossed seal, QR code, and signatures"
                width={1376}
                height={768}
                priority
                quality={100}
                unoptimized
                className="w-full h-auto rounded-lg object-contain shadow-md select-text"
              />
            </div>
          ) : (
            /* ── High-Fidelity Official Digital Clearance Certificate ── */
            <div
              id="printable-certificate"
              className="relative w-full bg-white text-slate-900 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden p-6 sm:p-10 lg:p-14 select-text border-8 border-double border-[#002752]/20 print:border-none print:shadow-none print:p-8"
            >
              {/* Ornate Gold Inner Filigree Border */}
              <div className="absolute inset-3 sm:inset-4 border-2 border-[#E0C23C] pointer-events-none rounded-lg z-0" />
              <div className="absolute inset-4 sm:inset-5 border border-[#002752]/15 pointer-events-none rounded z-0" />

              {/* Decorative Corner Embellishments */}
              <div className="absolute top-6 left-6 text-[#E0C23C] pointer-events-none text-xl sm:text-2xl font-serif select-none z-0">
                ❖
              </div>
              <div className="absolute top-6 right-6 text-[#E0C23C] pointer-events-none text-xl sm:text-2xl font-serif select-none z-0">
                ❖
              </div>
              <div className="absolute bottom-6 left-6 text-[#E0C23C] pointer-events-none text-xl sm:text-2xl font-serif select-none z-0">
                ❖
              </div>
              <div className="absolute bottom-6 right-6 text-[#E0C23C] pointer-events-none text-xl sm:text-2xl font-serif select-none z-0">
                ❖
              </div>

              {/* Background Watermark Crest */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center opacity-[0.032] pointer-events-none select-none z-0"
              >
                <div className="size-96 rounded-full border-8 border-[#002752] flex items-center justify-center font-serif font-black text-9xl text-[#002752]">
                  DIU
                </div>
              </div>

              {/* Certificate Content Wrapper */}
              <div className="relative z-10 space-y-6 sm:space-y-8 text-center max-w-3xl mx-auto">
                {/* Institutional Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="size-12 sm:size-14 rounded-full bg-[#002752] text-white flex items-center justify-center font-serif font-black text-xl sm:text-2xl shadow-sm ring-4 ring-[#E0C23C]/30">
                      DIU
                    </div>
                  </div>
                  <div>
                    <h1 className="font-serif font-black text-lg sm:text-2xl md:text-3xl text-[#002752] tracking-wide uppercase">
                      Daffodil International University
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-[#198754] tracking-widest uppercase mt-0.5">
                      Institutional Review Board • Research Ethics Committee (IRB / REC)
                    </p>
                    <p className="text-[0.68rem] sm:text-xs text-slate-500 tracking-wider uppercase font-medium">
                      Established under the Private University Act • BMRC Ethics Charter Compliant • Ashulia, Dhaka
                    </p>
                  </div>
                </div>

                {/* Certificate Main Title with Gold Accent Bar */}
                <div className="space-y-2 pt-1">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-[#E0C23C]" />
                    <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#002752] uppercase">
                      Certificate of Ethical Clearance
                    </h2>
                    <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-[#E0C23C]" />
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-mono text-slate-600">
                    <span>Certificate No: <strong className="text-[#002752] font-bold">{certRef}</strong></span>
                    <span>•</span>
                    <span>Protocol ID: <strong className="text-[#002752] font-bold">{certId}</strong></span>
                  </div>
                </div>

                {/* Formal Declaration Paragraph */}
                <div className="space-y-3 sm:space-y-4 text-slate-700 text-xs sm:text-sm sm:leading-relaxed">
                  <p className="font-serif italic text-sm sm:text-base text-slate-600">
                    This is to formally certify that the research protocol detailed below has undergone comprehensive institutional review and deliberation, and has been granted full ethical clearance:
                  </p>

                  {/* Protocol Title Highlight Box */}
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-1">
                    <span className="text-[0.68rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block font-sans">
                      Approved Protocol Title
                    </span>
                    <h3 className="font-serif font-black text-sm sm:text-lg md:text-xl text-[#002752] leading-snug">
                      &ldquo;{certTitle}&rdquo;
                    </h3>
                  </div>

                  {/* Key Investigators & Board Coordinates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
                    <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-0.5">
                      <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Principal Investigator:
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                        Dr. Marcus Vance, MD, PhD
                      </strong>
                      <span className="text-[0.72rem] sm:text-xs text-slate-500 block">
                        {certDepartment}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-0.5">
                      <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Reviewing Chamber & Board:
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                        {certBoard}
                      </strong>
                      <span className="text-[0.72rem] sm:text-xs text-[#198754] font-semibold block">
                        Clearance Tier: {certRisk}
                      </span>
                    </div>
                  </div>

                  {/* Legal & Ethical Compliance Declaration */}
                  <p className="text-[0.72rem] sm:text-xs text-slate-600 leading-normal text-justify pt-2">
                    The Institutional Review Board of Daffodil International University confirms that this research protocol conforms to the ethical guidelines for biomedical and human subject research as stipulated in the <strong>Declaration of Helsinki</strong>, the <strong>Council for International Organizations of Medical Sciences (CIOMS)</strong>, and national research guidelines. Any modifications to the protocol or consent materials must be submitted to the committee prior to implementation.
                  </p>
                </div>

                {/* Validity Period Pill */}
                <div className="inline-flex items-center justify-center gap-6 px-4 py-2 rounded-full bg-[#198754]/10 border border-[#198754]/30 text-[#198754] text-xs font-mono font-bold">
                  <span>Effective Date: <strong>{certIssuedDate}</strong></span>
                  <span>•</span>
                  <span>Valid Until: <strong>{certExpiryDate}</strong></span>
                </div>

                {/* Signatures & Official Embossed Seal Footer */}
                <div className="pt-6 sm:pt-8 border-t border-slate-200 grid grid-cols-3 items-end gap-4 text-center">
                  {/* Left Signatory: Chairman */}
                  <div className="space-y-1">
                    <div className="h-10 sm:h-12 flex items-center justify-center font-serif italic text-lg sm:text-2xl text-[#002752] select-none font-bold">
                      S. M. Mahbub
                    </div>
                    <div className="w-full h-px bg-slate-300 mx-auto" />
                    <strong className="text-[0.72rem] sm:text-xs font-bold text-slate-900 block mt-1">
                      Prof. Dr. S. M. Mahbub
                    </strong>
                    <span className="text-[0.65rem] sm:text-[0.7rem] text-slate-500 block leading-tight">
                      Chairman, Institutional Review Board
                    </span>
                  </div>

                  {/* Center Official Gold Embossed Stamp */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="size-20 sm:size-24 rounded-full bg-gradient-to-tr from-[#E0C23C] via-[#f7e68d] to-[#c9a622] p-1 shadow-md flex items-center justify-center ring-4 ring-[#198754]/20 select-none">
                      <div className="size-full rounded-full border-2 border-dashed border-[#002752]/50 bg-gradient-to-b from-white to-[#fffbf0] flex flex-col items-center justify-center p-1 text-center">
                        <Sparkles className="size-3 text-[#c9a622]" />
                        <span className="text-[0.55rem] sm:text-[0.62rem] font-black uppercase text-[#002752] leading-none mt-0.5">
                          OFFICIAL
                        </span>
                        <span className="text-[0.48rem] sm:text-[0.55rem] font-bold text-[#198754] uppercase leading-none">
                          CLEARANCE
                        </span>
                        <span className="text-[0.42rem] sm:text-[0.5rem] font-mono font-bold text-slate-500 leading-none mt-0.5">
                          DIU • IRB
                        </span>
                      </div>
                    </div>
                    <span className="text-[0.6rem] font-mono text-slate-400 mt-1 font-semibold">
                      SEC-SEAL-2026
                    </span>
                  </div>

                  {/* Right Signatory: Secretariat Director */}
                  <div className="space-y-1">
                    <div className="h-10 sm:h-12 flex items-center justify-center font-serif italic text-lg sm:text-2xl text-[#002752] select-none font-bold">
                      Marcus Vance
                    </div>
                    <div className="w-full h-px bg-slate-300 mx-auto" />
                    <strong className="text-[0.72rem] sm:text-xs font-bold text-slate-900 block mt-1">
                      Dr. Marcus Vance, MD, PhD
                    </strong>
                    <span className="text-[0.65rem] sm:text-[0.7rem] text-slate-500 block leading-tight">
                      Director of Research Governance
                    </span>
                  </div>
                </div>

                {/* Scannable Verification & Tamper-proof Hash Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.68rem] text-slate-500 font-mono">
                  <div className="flex items-center gap-2 text-left">
                    <div className="size-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <QrCode className="size-5 text-[#002752]" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">Scan or verify online:</span>
                      <a
                        href={verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>{verifyUrl}</span>
                        <ExternalLink className="size-2.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 max-w-xs truncate">
                    <Lock className="size-3 text-emerald-600 shrink-0" />
                    <span className="truncate">SHA-256: {certHash}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071321]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-secondary shrink-0" />
            <span>Digital Ethical Clearance recognized by international grant councils and academic publishers.</span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-8 px-3 text-xs font-bold rounded-md gap-1.5"
            >
              {copiedLink ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              <span>{copiedLink ? "Link Copied" : "Copy Verification Link"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyHash}
              className="h-8 px-3 text-xs font-bold rounded-md gap-1.5"
            >
              {copiedHash ? <Check className="size-3.5 text-emerald-600" /> : <Lock className="size-3.5" />}
              <span>{copiedHash ? "Hash Copied" : "Copy Signature Hash"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
