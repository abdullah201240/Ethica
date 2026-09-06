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
  Sparkles,
} from "lucide-react"
import { useForm, useWatch, type Path } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentActions,
} from "@/components/ui/attachment"
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
import {
  step1PersonalDetailsSchema,
  step2AcademicProfileSchema,
  step3ExpertiseSchema,
  fullApplicationSchema,
  type FullApplicationInput,
} from "@/lib/schemas"

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
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FullApplicationInput>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      institution: "",
      degree: "" as FullApplicationInput["degree"],
      department: "",
      position: "" as FullApplicationInput["position"],
      yearsExperience: "" as FullApplicationInput["yearsExperience"],
      orcid: "",
      expertise: [],
      statement: "",
      cvFileName: "",
      agreeTerms: false,
    },
  })

  const formValues = useWatch({ control }) ?? {}
  const selectedExpertise = formValues.expertise || []

  const toggleExpertise = (area: string) => {
    const next = selectedExpertise.includes(area)
      ? selectedExpertise.filter((a) => a !== area)
      : [...selectedExpertise, area]
    setValue("expertise", next, { shouldValidate: true })
    if (next.length > 0) {
      clearErrors("expertise")
    } else {
      setError("expertise", { message: "Please select at least one area of expertise" })
    }
  }

  const handleDemoFill = () => {
    setValue("fullName", "Prof. Dr. Tariqul Islam", { shouldValidate: true })
    setValue("email", "tariqul.pharm@diu.edu.bd", { shouldValidate: true })
    setValue("phone", "+880 1712-345678", { shouldValidate: true })
    setValue("institution", "Daffodil International University", { shouldValidate: true })
    setValue("degree", "PhD / Doctorate", { shouldValidate: true })
    setValue("department", "Department of Pharmacy & Public Health", { shouldValidate: true })
    setValue("position", "Professor", { shouldValidate: true })
    setValue("yearsExperience", "13–20 years", { shouldValidate: true })
    setValue("orcid", "0000-0002-1825-0097", { shouldValidate: true })
    setValue("expertise", ["Biomedical & Clinical Research", "Public Health & Epidemiology"], { shouldValidate: true })
    setValue("statement", "Over 15 years of leading randomized control clinical trials and pharmacovigilance studies with deep commitment to human subject protection and Helsinki ethics compliance.", { shouldValidate: true })
    setValue("cvFileName", "Prof_Tariqul_Islam_CV.pdf", { shouldValidate: true })
    setValue("agreeTerms", true, { shouldValidate: true })
    clearErrors()
  }

  const handleNext = () => {
    if (currentStep === 1) {
      const res = step1PersonalDetailsSchema.safeParse({
        fullName: formValues.fullName,
        email: formValues.email,
        phone: formValues.phone,
        institution: formValues.institution,
      })
      if (!res.success) {
        for (const issue of res.error.issues) {
          setError(issue.path[0] as Path<FullApplicationInput>, { message: issue.message })
        }
        return
      }
    } else if (currentStep === 2) {
      const res = step2AcademicProfileSchema.safeParse({
        degree: formValues.degree,
        department: formValues.department,
        position: formValues.position,
        yearsExperience: formValues.yearsExperience,
        orcid: formValues.orcid,
      })
      if (!res.success) {
        for (const issue of res.error.issues) {
          setError(issue.path[0] as Path<FullApplicationInput>, { message: issue.message })
        }
        return
      }
    } else if (currentStep === 3) {
      const res = step3ExpertiseSchema.safeParse({
        expertise: selectedExpertise,
        statement: formValues.statement,
        cvFileName: formValues.cvFileName,
      })
      if (!res.success) {
        for (const issue of res.error.issues) {
          setError(issue.path[0] as Path<FullApplicationInput>, { message: issue.message })
        }
        return
      }
    }

    clearErrors()
    if (currentStep < 4) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    clearErrors()
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const onSubmit = () => {
    const fullRes = fullApplicationSchema.safeParse({
      ...formValues,
      expertise: selectedExpertise,
    })

    if (!fullRes.success) {
      for (const issue of fullRes.error.issues) {
        setError(issue.path[0] as Path<FullApplicationInput>, { message: issue.message })
      }
      if (issueHasField(fullRes.error.issues, ["fullName", "email", "phone", "institution"])) {
        setCurrentStep(1)
      } else if (issueHasField(fullRes.error.issues, ["degree", "department", "position", "yearsExperience", "orcid"])) {
        setCurrentStep(2)
      } else if (issueHasField(fullRes.error.issues, ["expertise", "statement"])) {
        setCurrentStep(3)
      }
      return
    }

    const data = fullRes.data
    const expYears = parseInt(data.yearsExperience.split("–")[0]?.replace(/\+/g, "") || "5", 10) || 5
    addReviewerApplication({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "+880 1700-000000",
      institution: data.institution,
      department: data.department,
      position: data.position || "Research Faculty",
      degree: data.degree || "PhD / Doctorate",
      yearsExperience: expYears,
      orcid: data.orcid || "0000-0000-0000-0000",
      expertise: selectedExpertise.length > 0 ? selectedExpertise : ["Biomedical & Clinical Research"],
      statement: data.statement,
      cvFileName: data.cvFileName || "Curriculum_Vitae.pdf",
    })
    setSubmitted(true)
  }

  function issueHasField(issues: readonly { path?: readonly PropertyKey[] }[], fields: string[]) {
    return issues.some((i) => i.path && fields.includes(String(i.path[0])))
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
                  <Star className="size-5 text-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black text-primary tracking-tight">
                Application Submitted!
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Thank you, <strong className="text-slate-800">{formValues.fullName || "Applicant"}</strong>. Your reviewer application has been received and logged in the Ethica ledger.
                <br />The IRB Secretariat will review your credentials and respond within <strong className="text-slate-800">5–7 working days</strong>.
              </p>
            </div>

            <div className="w-full p-6 rounded-xl bg-white border border-border/75 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Clock className="size-3.5 text-secondary" />
                What happens next
              </div>
              <ul className="space-y-3">
                {[
                  "Your credentials & publication record are independently verified by the IRB Secretariat",
                  "IRB Chair conducts final review of your application within 5–7 working days",
                  "A secure onboarding email is sent with your reviewer portal credentials",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 size-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-micro font-bold shrink-0">
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
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-[#002752]/30 bg-[#002752]/5 text-primary text-sm font-semibold hover:bg-[#002752]/10 transition-colors"
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-primary tracking-tight leading-tight">
            Apply to Join the<br />Ethics Review Board
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
            Qualified academics and subject-matter experts are invited to serve on the Daffodil International University
            Institutional Review Board. Applications are reviewed by the IRB Secretariat on a rolling basis.
          </p>

        {/* Quick Demo Autofill Banner */}
        <div className="w-full mb-8 p-3.5 sm:p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 font-medium">
            <Sparkles className="size-4.5 text-secondary shrink-0" />
            <span>Testing reviewer accreditation? Pre-populate a verified clinical investigator dossier:</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleDemoFill}
            className="h-8 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-[#198754] hover:bg-[#146c43] text-white transition-colors shrink-0 cursor-pointer shadow-none"
          >
            Autofill Demo Reviewer
          </Button>
        </div>
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
                      className={`hidden sm:block text-micro font-semibold whitespace-nowrap ${
                        active ? "text-primary" : done ? "text-secondary" : "text-slate-400"
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
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
                      {
                        label: "Full Name",
                        name: "fullName" as const,
                        placeholder: "Prof. Jane Smith",
                        required: true,
                        type: "text",
                        validate: (val: string) => {
                          const r = step1PersonalDetailsSchema.shape.fullName.safeParse(val)
                          return r.success ? true : r.error.issues[0]?.message
                        },
                      },
                      {
                        label: "Institutional Email",
                        name: "email" as const,
                        placeholder: "you@university.edu.bd",
                        required: true,
                        type: "email",
                        validate: (val: string) => {
                          const r = step1PersonalDetailsSchema.shape.email.safeParse(val)
                          return r.success ? true : r.error.issues[0]?.message
                        },
                      },
                      {
                        label: "Phone Number",
                        name: "phone" as const,
                        placeholder: "+880 1XXX-XXXXXX",
                        required: false,
                        type: "tel",
                        validate: (val: string) => {
                          const r = step1PersonalDetailsSchema.shape.phone.safeParse(val)
                          return r.success ? true : r.error.issues[0]?.message
                        },
                      },
                      {
                        label: "Current Institution",
                        name: "institution" as const,
                        placeholder: "Daffodil International University",
                        required: true,
                        type: "text",
                        validate: (val: string) => {
                          const r = step1PersonalDetailsSchema.shape.institution.safeParse(val)
                          return r.success ? true : r.error.issues[0]?.message
                        },
                      },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={field.name} className="block text-xs font-semibold text-slate-600">
                          {field.label}{field.required && <span className="text-rose-500 ml-0.5">*</span>}
                        </Label>
                        <Input
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          {...register(field.name, { validate: field.validate })}
                          aria-invalid={Boolean(errors[field.name])}
                          className={`w-full h-11 px-4 rounded-lg border ${
                            errors[field.name]
                              ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                              : "border-border/75 bg-slate-50"
                          } text-table-cell text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002752]/20 focus:border-[#002752]/40 transition-all`}
                        />
                        {errors[field.name] && (
                          <p className="text-xs text-rose-600 font-semibold mt-1">
                            {errors[field.name]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[#002752]/5 border border-[#002752]/10">
                    <Lock className="size-4 text-primary mt-0.5 shrink-0" />
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
                      label: "Highest Degree",
                      name: "degree" as const,
                      type: "select",
                      required: true,
                      options: ["PhD / Doctorate", "MD / MBBS", "Masters (Research)", "Professional Certification", "Other"],
                    },
                    {
                      label: "Department / Faculty",
                      name: "department" as const,
                      type: "input",
                      required: true,
                      placeholder: "e.g. Public Health & Epidemiology",
                      validate: (val: string) => {
                        const r = step2AcademicProfileSchema.shape.department.safeParse(val)
                        return r.success ? true : r.error.issues[0]?.message
                      },
                    },
                    {
                      label: "Academic Position",
                      name: "position" as const,
                      type: "select",
                      required: true,
                      options: ["Professor", "Associate Professor", "Assistant Professor", "Lecturer / Instructor", "Research Scientist", "Independent Expert", "Other"],
                    },
                    {
                      label: "Years of Research Experience",
                      name: "yearsExperience" as const,
                      type: "select",
                      required: true,
                      options: ["1–3 years", "4–7 years", "8–12 years", "13–20 years", "20+ years"],
                    },
                    {
                      label: "ORCID iD (optional)",
                      name: "orcid" as const,
                      type: "input",
                      required: false,
                      placeholder: "0000-0000-0000-0000",
                      validate: (val: string) => {
                        const r = step2AcademicProfileSchema.shape.orcid.safeParse(val)
                        return r.success ? true : r.error.issues[0]?.message
                      },
                    },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <Label htmlFor={field.name} className="block text-xs font-semibold text-slate-600">
                        {field.label}{field.required && <span className="text-rose-500 ml-0.5">*</span>}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          value={String(formValues[field.name] ?? "")}
                          onValueChange={(val) => {
                            setValue(field.name as Path<FullApplicationInput>, val ?? "", { shouldValidate: true })
                            clearErrors(field.name)
                          }}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={Boolean(errors[field.name])}
                            className={`w-full h-11 px-4 rounded-lg border ${
                              errors[field.name]
                                ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                                : "border-border/75 bg-slate-50"
                            } text-table-cell text-slate-700 focus-visible:ring-2 focus-visible:ring-[#002752]/20 focus-visible:border-[#002752]/40 transition-all cursor-pointer`}
                          >
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((o) => (
                              <SelectItem key={o} value={o} className="cursor-pointer">
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.name}
                          placeholder={(field as { placeholder?: string }).placeholder}
                          {...register(field.name, { validate: field.validate })}
                          aria-invalid={Boolean(errors[field.name])}
                          className={`w-full h-11 px-4 rounded-lg border ${
                            errors[field.name]
                              ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                              : "border-border/75 bg-slate-50"
                          } text-table-cell text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002752]/20 focus:border-[#002752]/40 transition-all`}
                        />
                      )}
                      {errors[field.name] && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">
                          {errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── STEP 3: Expertise & Experience ── */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-3">
                    <Label className="block text-xs font-semibold text-slate-600">
                      Areas of Expertise <span className="text-rose-500">*</span>
                      <span className="font-normal text-slate-400 ml-1">(select all that apply)</span>
                    </Label>
                    <div className="flex flex-wrap gap-2.5">
                      {EXPERTISE_AREAS.map((area) => {
                        const selected = selectedExpertise.includes(area)
                        return (
                          <Button
                            key={area}
                            type="button"
                            variant="outline"
                            onClick={() => toggleExpertise(area)}
                            className={`flex items-center gap-1.5 h-auto px-4 py-2 rounded-lg text-table-cell font-semibold border transition-all duration-150 cursor-pointer ${
                              selected
                                ? "bg-[#002752] text-white border-[#002752] hover:bg-[#001c3d] hover:text-white shadow-xs"
                                : "bg-slate-50 text-slate-600 border-border/75 hover:bg-slate-100 hover:border-slate-300"
                            }`}
                          >
                            {selected && <CheckCircle2 className="size-3.5" />}
                            {area}
                          </Button>
                        )
                      })}
                    </div>
                    {errors.expertise && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">
                        {errors.expertise.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="statement" className="block text-xs font-semibold text-slate-600">
                      Statement of Interest <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="statement"
                      rows={7}
                      {...register("statement", {
                        validate: (val) => {
                          const r = step3ExpertiseSchema.shape.statement.safeParse(val)
                          return r.success ? true : r.error.issues[0]?.message
                        },
                      })}
                      aria-invalid={Boolean(errors.statement)}
                      placeholder="Briefly describe your research ethics background, any prior IRB or ethics committee experience, and your motivation for joining the Ethica Review Board…"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.statement
                          ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                          : "border-border/75 bg-slate-50"
                      } text-table-cell text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002752]/20 focus:border-[#002752]/40 transition-all resize-none min-h-[160px]`}
                    />
                    {errors.statement ? (
                      <p className="text-xs text-rose-600 font-semibold mt-1">
                        {errors.statement.message}
                      </p>
                    ) : (
                      <p className="text-micro text-slate-400">Minimum 20 characters recommended</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="block text-xs font-semibold text-slate-600">
                      Curriculum Vitae (CV / Resume)
                    </Label>
                    <Attachment
                      state={formValues.cvFileName ? "done" : "idle"}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-dashed border-border"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AttachmentMedia className="size-10 rounded-lg bg-white border border-border/75 shadow-xs text-slate-400">
                        <Upload className="size-5" />
                      </AttachmentMedia>
                      <AttachmentContent className="min-w-0 flex-1">
                        <AttachmentTitle className="text-table-cell font-semibold text-slate-700 truncate">
                          {formValues.cvFileName || "Click to upload your CV"}
                        </AttachmentTitle>
                        <AttachmentDescription className="text-micro text-slate-400 mt-0.5">
                          PDF or DOCX · Max 5MB
                        </AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs font-bold border-slate-200 text-slate-700 pointer-events-none"
                        >
                          {formValues.cvFileName ? "Change File" : "Browse Files"}
                        </Button>
                      </AttachmentActions>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setValue("cvFileName", file.name, { shouldValidate: true })
                        }}
                      />
                    </Attachment>
                  </div>
                </>
              )}

              {/* ── STEP 4: Review & Submit ── */}
              {currentStep === 4 && (
                <>
                  <div className="w-full space-y-0 divide-y divide-border/60 rounded-xl border border-border/75 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50">
                      <span className="text-micro font-bold text-slate-400 uppercase tracking-widest">Application Summary</span>
                    </div>
                    {[
                      { label: "Full Name", value: formValues.fullName },
                      { label: "Email", value: formValues.email },
                      { label: "Phone", value: formValues.phone },
                      { label: "Institution", value: formValues.institution },
                      { label: "Degree", value: formValues.degree },
                      { label: "Department", value: formValues.department },
                      { label: "Position", value: formValues.position },
                      { label: "Experience", value: formValues.yearsExperience },
                      { label: "ORCID", value: formValues.orcid },
                      { label: "Expertise Areas", value: selectedExpertise.join(", ") || "None selected" },
                      { label: "CV File", value: formValues.cvFileName || "Not uploaded" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-6 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                        <span className="text-micro font-semibold text-slate-400 shrink-0 w-32">{label}</span>
                        <span className="text-table-cell text-slate-700 text-right break-words">
                          {value || <span className="text-slate-300 italic">Not provided</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="w-full p-5 rounded-xl bg-[#002752]/5 border border-[#002752]/15 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      By submitting this application, I confirm that all information provided is accurate and complete. I understand that the IRB Secretariat may verify my credentials independently. I agree to abide by the Daffodil International University Research Ethics Code of Conduct and maintain confidentiality of all protocols under review.
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="agreeTerms"
                          checked={Boolean(formValues.agreeTerms)}
                          onCheckedChange={(checked) => {
                            setValue("agreeTerms", Boolean(checked), { shouldValidate: true })
                            if (checked) clearErrors("agreeTerms")
                          }}
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor="agreeTerms"
                          className="text-table-cell font-semibold text-slate-700 cursor-pointer"
                        >
                          I agree to the above declaration and DIU IRB Reviewer Code of Conduct
                        </Label>
                      </div>
                      {errors.agreeTerms && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">
                          {errors.agreeTerms.message}
                        </p>
                      )}
                    </div>
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
                className="flex items-center gap-2 h-10 px-5 rounded-lg text-table-cell font-semibold text-slate-500 hover:text-slate-800 bg-white border border-border/75 hover:border-slate-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                  className="flex items-center gap-2 h-10 px-6 rounded-lg bg-[#002752] hover:bg-[#001c3d] text-white text-table-cell font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  Continue
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger render={
                    <Button
                      type="button"
                      disabled={!formValues.agreeTerms}
                      className="flex items-center gap-2 h-10 px-6 rounded-lg bg-gradient-to-r from-[#198754] to-emerald-500 hover:opacity-95 text-white text-table-cell font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <CheckCircle2 className="size-4" />
                      Submit Application
                    </Button>
                  } />
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base font-bold text-primary dark:text-white">
                        Confirm Reviewer Application Submission
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        You are about to formally submit your reviewer application for <strong className="text-foreground">{formValues.fullName || "Applicant"}</strong> to the Daffodil International University Institutional Review Board. Please verify that all entered credentials and declarations are accurate.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-xs font-semibold">Review Dossier</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSubmit(onSubmit)}
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
