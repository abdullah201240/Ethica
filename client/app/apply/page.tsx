"use client"

import * as React from "react"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
  UserPlus,
  GraduationCap,
  Briefcase,
  BookOpen,
  Upload,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Star,
  Clock,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { addReviewerApplication } from "@/lib/reviewer-applications"

const EXPERTISE_AREAS = [
  "Biomedical & Clinical Research",
  "Social & Behavioral Sciences",
  "Public Health & Epidemiology",
  "AI / Data Science & Technology Ethics",
  "Genomics & Precision Medicine",
  "Environmental Health",
  "Pediatric Research",
  "Community & Participatory Research",
  "Mental Health & Psychiatry",
  "Nursing & Allied Health",
]

const STEPS = [
  { step: 1, label: "Personal Details", icon: UserPlus },
  { step: 2, label: "Academic Profile", icon: GraduationCap },
  { step: 3, label: "Expertise & Experience", icon: Briefcase },
  { step: 4, label: "Review & Submit", icon: BookOpen },
]

export default function ApplyAsReviewerPage() {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [submitted, setSubmitted] = React.useState(false)
  const [selectedExpertise, setSelectedExpertise] = React.useState<string[]>([])

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    degree: "",
    department: "",
    position: "",
    yearsExperience: "",
    orcid: "",
    statement: "",
    cvFileName: "",
    agreeTerms: false,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const toggleExpertise = (area: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const handleNext = () => { if (currentStep < 4) setCurrentStep((s) => s + 1) }
  const handleBack = () => { if (currentStep > 1) setCurrentStep((s) => s - 1) }
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const expYears = parseInt(form.yearsExperience.split("–")[0]?.replace(/\+/g, "") || "5", 10) || 5
    addReviewerApplication({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone || "+880 1700-000000",
      institution: form.institution,
      department: form.department,
      position: form.position || "Research Faculty",
      degree: form.degree || "PhD / Doctorate",
      yearsExperience: expYears,
      orcid: form.orcid || "0000-0000-0000-0000",
      expertise: selectedExpertise.length > 0 ? selectedExpertise : ["Biomedical & Clinical Research"],
      statement: form.statement,
      cvFileName: form.cvFileName || "Curriculum_Vitae.pdf",
    })
    setSubmitted(true)
  }

  // ── Success screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7F9]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-10 lg:px-16 xl:px-20 py-20">
          <div className="w-full text-center space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="size-28 rounded-full bg-gradient-to-br from-[#198754] to-emerald-400 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="size-14 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 size-9 rounded-full bg-[#E0C23C] flex items-center justify-center shadow">
                  <Star className="size-5 text-[#002752]" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black text-[#002752] tracking-tight">
                Application Submitted!
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Thank you, <strong className="text-slate-800">{form.fullName || "Applicant"}</strong>. Your reviewer application has been received and logged in the Ethica ledger.
                <br />The IRB Secretariat will review your credentials and respond within <strong className="text-slate-800">5–7 working days</strong>.
              </p>
            </div>

            <div className="w-full p-6 rounded-xl bg-white border border-border/75 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Clock className="size-3.5 text-[#198754]" />
                What happens next
              </div>
              <ul className="space-y-3">
                {[
                  "Your credentials & publication record are independently verified by the IRB Secretariat",
                  "IRB Chair conducts final review of your application within 5–7 working days",
                  "A secure onboarding email is sent with your reviewer portal credentials",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 size-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[11px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-[#002752] text-white text-sm font-semibold hover:bg-[#001c3d] transition-colors"
              >
                <ArrowLeft className="size-4" />
                Return to Home
              </Link>
              <Link
                href="/admin/applications"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-[#002752]/30 bg-[#002752]/5 text-[#002752] text-sm font-semibold hover:bg-[#002752]/10 transition-colors"
              >
                View in Admin Queue
                <ChevronRight className="size-4" />
              </Link>
              <Link
                href="/reviewer/login"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-border/75 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Reviewer Login
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Application form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9]">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-10 lg:px-16 xl:px-20 py-10">

        {/* ── Page hero header ────────────────────────────────────────────── */}
        <div className="w-full mb-10 space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#002752] tracking-tight leading-tight">
            Apply to Join the<br />Ethics Review Board
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Qualified academics and subject-matter experts are invited to serve on the Daffodil International University
            Institutional Review Board. Applications are reviewed by the IRB Secretariat on a rolling basis.
          </p>

        </div>

        {/* ── Step progress ────────────────────────────────────────────────── */}
        <div className="w-full mb-8">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done = currentStep > s.step
              const active = currentStep === s.step
              return (
                <React.Fragment key={s.step}>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                        done
                          ? "bg-[#198754] text-white shadow-sm"
                          : active
                            ? "bg-[#002752] text-white shadow-md ring-4 ring-[#002752]/10"
                            : "bg-white border border-border/75 text-slate-400"
                      }`}
                    >
                      {done ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                    </div>
                    <span
                      className={`hidden sm:block text-[11px] font-semibold whitespace-nowrap ${
                        active ? "text-[#002752]" : done ? "text-[#198754]" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 mb-5 transition-all ${
                        currentStep > s.step ? "bg-[#198754]" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* ── Form card ────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full bg-white rounded-2xl border border-border/75 shadow-sm overflow-hidden">

            {/* Card header */}
            <div className="w-full px-6 sm:px-10 py-6 border-b border-border/60 flex items-center gap-4 bg-slate-50/60">
              <div className="size-11 rounded-xl bg-gradient-to-br from-[#002752] to-[#003875] flex items-center justify-center text-white shadow-sm shrink-0">
                {React.createElement(STEPS[currentStep - 1].icon, { className: "size-5" })}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {STEPS[currentStep - 1].label}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Step {currentStep} of {STEPS.length} — fill in all required fields</p>
              </div>
            </div>

            {/* Card body */}
            <div className="w-full px-6 sm:px-10 py-8 space-y-6">

              {/* ── STEP 1: Personal Details ── */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {[
                      { label: "Full Name", name: "fullName", placeholder: "Prof. Jane Smith", required: true, type: "text" },
                      { label: "Institutional Email", name: "email", placeholder: "you@university.edu.bd", required: true, type: "email" },
                      { label: "Phone Number", name: "phone", placeholder: "+880 1XXX-XXXXXX", required: false, type: "tel" },
                      { label: "Current Institution", name: "institution", placeholder: "Daffodil International University", required: true, type: "text" },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-600">
                          {field.label}{field.required && <span className="text-rose-500 ml-0.5">*</span>}
                        </label>
                        <input
                          required={field.required}
                          type={field.type}
                          name={field.name}
                          value={(form as unknown as Record<string, string>)[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full h-11 px-4 rounded-lg border border-border/75 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002752]/20 focus:border-[#002752]/40 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[#002752]/5 border border-[#002752]/10">
                    <Lock className="size-4 text-[#002752] mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      All personal data is encrypted and processed in accordance with the DIU Data Protection Policy and Bangladesh Digital Security Act 2018. Your information is used solely for reviewer credential verification.
                    </p>
                  </div>
                </>
              )}

              {/* ── STEP 2: Academic Profile ── */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[
                    {
                      label: "Highest Degree", name: "degree", type: "select", required: true,
                      options: ["PhD / Doctorate", "MD / MBBS", "Masters (Research)", "Professional Certification", "Other"],
                    },
                    {
                      label: "Department / Faculty", name: "department", type: "input", required: true,
                      placeholder: "e.g. Public Health & Epidemiology",
                    },
                    {
                      label: "Academic Position", name: "position", type: "select", required: true,
                      options: ["Professor", "Associate Professor", "Assistant Professor", "Lecturer / Instructor", "Research Scientist", "Independent Expert", "Other"],
                    },
                    {
                      label: "Years of Research Experience", name: "yearsExperience", type: "select", required: true,
                      options: ["1–3 years", "4–7 years", "8–12 years", "13–20 years", "20+ years"],
                    },
                    {
                      label: "ORCID iD (optional)", name: "orcid", type: "input", required: false,
                      placeholder: "0000-0000-0000-0000",
                    },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-600">
                        {field.label}{field.required && <span className="text-rose-500 ml-0.5">*</span>}
                      </label>
                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          name={field.name}
                          value={String((form as Record<string, unknown>)[field.name] ?? "")}
                          onChange={handleChange}
                          className="w-full h-11 px-4 rounded-lg border border-border/75 bg-slate-50 text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#002752]/20 focus:border-[#002752]/40 transition-all"
                        >
                          <option value="">Select…</option>
                          {field.options?.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          required={field.required}
                          name={field.name}
                          value={String((form as Record<string, unknown>)[field.name] ?? "")}
                          onChange={handleChange}
                          placeholder={(field as { placeholder?: string }).placeholder}
                          className="w-full h-11 px-4 rounded-lg border border-border/75 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002752]/20 focus:border-[#002752]/40 transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── STEP 3: Expertise & Experience ── */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-600">
                      Areas of Expertise <span className="text-rose-500">*</span>
                      <span className="font-normal text-slate-400 ml-1">(select all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {EXPERTISE_AREAS.map((area) => {
                        const selected = selectedExpertise.includes(area)
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => toggleExpertise(area)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold border transition-all duration-150 cursor-pointer ${
                              selected
                                ? "bg-[#002752] text-white border-[#002752] shadow-sm"
                                : "bg-slate-50 text-slate-600 border-border/75 hover:bg-slate-100 hover:border-slate-300"
                            }`}
                          >
                            {selected && <CheckCircle2 className="size-3.5" />}
                            {area}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Statement of Interest <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      name="statement"
                      value={form.statement}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Briefly describe your research ethics background, any prior IRB or ethics committee experience, and your motivation for joining the Ethica Review Board…"
                      className="w-full px-4 py-3 rounded-lg border border-border/75 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002752]/20 focus:border-[#002752]/40 transition-all resize-none"
                    />
                    <p className="text-[10px] text-slate-400">Minimum 100 characters recommended</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Curriculum Vitae (CV / Resume)
                    </label>
                    <label className="flex items-center gap-4 px-5 py-4 rounded-lg border border-dashed border-border bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group w-full">
                      <Upload className="size-6 text-slate-400 group-hover:text-[#002752] transition-colors shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-600 group-hover:text-[#002752] transition-colors truncate">
                          {form.cvFileName || "Click to upload your CV"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">PDF or DOCX · Max 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setForm((p) => ({ ...p, cvFileName: file.name }))
                        }}
                      />
                    </label>
                  </div>
                </>
              )}

              {/* ── STEP 4: Review & Submit ── */}
              {currentStep === 4 && (
                <>
                  <div className="w-full space-y-0 divide-y divide-border/60 rounded-xl border border-border/75 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Summary</span>
                    </div>
                    {[
                      { label: "Full Name", value: form.fullName },
                      { label: "Email", value: form.email },
                      { label: "Phone", value: form.phone },
                      { label: "Institution", value: form.institution },
                      { label: "Degree", value: form.degree },
                      { label: "Department", value: form.department },
                      { label: "Position", value: form.position },
                      { label: "Experience", value: form.yearsExperience },
                      { label: "ORCID", value: form.orcid },
                      { label: "Expertise Areas", value: selectedExpertise.join(", ") || "None selected" },
                      { label: "CV File", value: form.cvFileName || "Not uploaded" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-6 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                        <span className="text-[11px] font-semibold text-slate-400 shrink-0 w-32">{label}</span>
                        <span className="text-[13px] text-slate-700 text-right break-words">
                          {value || <span className="text-slate-300 italic">Not provided</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="w-full p-5 rounded-xl bg-[#002752]/5 border border-[#002752]/15 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      By submitting this application, I confirm that all information provided is accurate and complete. I understand that the IRB Secretariat may verify my credentials independently. I agree to abide by the Daffodil International University Research Ethics Code of Conduct and maintain confidentiality of all protocols under review.
                    </p>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleChange}
                        required
                        className="size-4 rounded accent-[#002752]"
                      />
                      <span className="text-[13px] font-semibold text-slate-700">
                        I agree to the above declaration and DIU IRB Reviewer Code of Conduct
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* ── Card footer: navigation ── */}
            <div className="w-full px-6 sm:px-10 py-5 border-t border-border/60 bg-slate-50/60 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold text-slate-500 hover:text-slate-800 bg-white border border-border/75 hover:border-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>

              {/* Step dots */}
              <div className="flex items-center gap-1.5">
                {STEPS.map((s) => (
                  <span
                    key={s.step}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s.step === currentStep
                        ? "w-6 bg-[#002752]"
                        : s.step < currentStep
                          ? "w-1.5 bg-[#198754]"
                          : "w-1.5 bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 h-10 px-6 rounded-lg bg-[#002752] hover:bg-[#001c3d] text-white text-[13px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  Continue
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger render={
                    <Button
                      type="button"
                      disabled={!form.agreeTerms}
                      className="flex items-center gap-2 h-10 px-6 rounded-lg bg-gradient-to-r from-[#198754] to-emerald-500 hover:opacity-95 text-white text-[13px] font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <CheckCircle2 className="size-4" />
                      Submit Application
                    </Button>
                  } />
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                        Confirm Reviewer Application Submission
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        You are about to formally submit your reviewer application for <strong className="text-slate-900 dark:text-white">{form.fullName || "Applicant"}</strong> to the Daffodil International University Institutional Review Board. Please verify that all entered credentials and declarations are accurate.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-xs font-semibold">Review Dossier</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleSubmit()}
                        className="bg-[#198754] hover:bg-[#146c43] text-white text-xs font-bold"
                      >
                        Confirm & Submit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </form>

      </main>

      <Footer />
    </div>
  )
}
