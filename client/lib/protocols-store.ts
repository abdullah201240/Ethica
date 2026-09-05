export interface ProtocolReviewerEvaluation {
  recommendation: "Clearance Approved" | "Revisions Required" | "Ethics Rejection"
  scientificMeritRating?: number
  safeguardsRating?: number
  consentRating?: number
  deliberationRemarks: string
  evaluatedAt: string
  reviewerName: string
  reviewerId: string
}

export interface Protocol {
  id: string
  title: string
  department: string
  board: string
  status: "Under Committee Review" | "Clearance Granted" | "Revision Requested" | "Expedited Triage" | "Rejected"
  statusColor: "amber" | "emerald" | "rose" | "blue"
  risk: "Minimal Risk" | "Exempt - Fast Track" | "Greater Than Minimal"
  riskColor: "blue" | "emerald" | "purple"
  submissionDate: string
  daysInReview: number
  hasCertificate: boolean
  piName?: string
  piEmail?: string
  piInstitution?: string
  assignedReviewerId?: string
  assignedReviewerName?: string
  assignedReviewerEmail?: string
  assignmentStatus?: "Unassigned" | "Pending Acceptance" | "Accepted" | "Declined" | "Review Completed"
  assignmentDate?: string
  reviewerDeclineReason?: string
  reviewerEvaluation?: ProtocolReviewerEvaluation
  feeAmountBdt?: number
  paymentMethod?: string
  senderNumber?: string
  transactionId?: string
  abstract?: string
  studyType?: string
  durationMonths?: number
  studyLocation?: string
  coInvestigators?: string
  targetSampleSize?: number
  vulnerablePopulations?: string[]
  consentType?: string
  dataConfidentiality?: string
  proposalDocumentName?: string
  consentDocumentName?: string
  dataToolsDocumentName?: string
  investigatorCvName?: string
  feeTier?: string
  isExpedited?: boolean
  committeeRemarks?: string
  certificateSealHash?: string
  certificateIssueDate?: string
  certificateExpiryDate?: string
  reviewStep?: number // 1: Registered, 2: Payment Verified, 3: Triage, 4: Deliberation, 5: Granted/Resolved
}

export const initialProtocols: Protocol[] = [
  {
    id: "ETH-2026-089",
    title: "Longitudinal AI-Assisted Clinical Biomarker Analysis in Type 2 Diabetes",
    department: "Public Health & Clinical Epidemiology",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Aug 28, 2026",
    daysInReview: 6,
    hasCertificate: false,
    piName: "Dr. Elena Rostova",
    piEmail: "elena.rostova@diu.edu.bd",
    assignedReviewerId: "REV-DIU-001",
    assignedReviewerName: "Prof. Charles Montgomery",
    assignedReviewerEmail: "charles.montgomery@diu.edu.bd",
    assignmentStatus: "Pending Acceptance",
    assignmentDate: "Sep 04, 2026",
    feeAmountBdt: 7500,
    feeTier: "faculty",
    isExpedited: false,
    paymentMethod: "bkash",
    senderNumber: "01711998877",
    transactionId: "9K2M4L7P01",
    abstract: "Prospective evaluation of machine learning biomarker classification models for early microvascular complication prediction in diabetic cohorts. De-identified serum data collected from 800 outpatient participants across Dhaka division.",
    studyType: "Clinical Trial (Interventional)",
    durationMonths: 18,
    studyLocation: "DIU Health Sciences Research Complex & Ashulia Clinical Hospital",
    coInvestigators: "Dr. Farzana Choudhury (icddr,b), Prof. Charles Montgomery (DIU)",
    targetSampleSize: 800,
    vulnerablePopulations: ["Elderly / Geriatric Patients"],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "End-to-end AES-256 encrypted database with anonymized patient identifiers and SHA-256 salted hashes.",
    proposalDocumentName: "Biomarker_Surveillance_Protocol_v2.pdf",
    consentDocumentName: "Informed_Consent_Bilingual_Approved.pdf",
    dataToolsDocumentName: "Clinical_Case_Report_Form_CRF.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 4,
    committeeRemarks: "Initial triage completed. Peer review assigned to Biomedical Reviewer Panel B. Primary deliberation in progress.",
  },
  {
    id: "ETH-2026-074",
    title: "Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses",
    department: "Behavioral Sciences & Nursing",
    board: "Social & Behavioral Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "Aug 14, 2026",
    daysInReview: 3,
    hasCertificate: true,
    feeAmountBdt: 3500,
    feeTier: "student",
    isExpedited: true,
    paymentMethod: "nagad",
    senderNumber: "01822334455",
    transactionId: "NG88219432",
    abstract: "Observational study evaluating perceived cognitive burden, shift scheduling, and clinical error triage across 250 registered nurses practicing in rural telemedicine call centers.",
    studyType: "Social & Behavioral Survey",
    durationMonths: 6,
    studyLocation: "DIU Telehealth Operation Center & Regional Nurse Guilds",
    coInvestigators: "Dr. Tanvir Hasan (DIU), Nusrat Jahan (BSMMU)",
    targetSampleSize: 250,
    vulnerablePopulations: [],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Surveys conducted via pseudonymized digital questionnaires with aggregated reporting standards.",
    proposalDocumentName: "Nurse_Cognitive_Load_Protocol.pdf",
    consentDocumentName: "Informed_Consent_Telemedicine.pdf",
    dataToolsDocumentName: "NASA_TLX_Standard_Questionnaire.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Ethical clearance approved without reservations. Fast-track exemption verified by Board Secretariat.",
    certificateSealHash: "8f92a47e19b02356c9a34e007821ef9a128f7734bbd82910c4412efb6680a34e",
    certificateIssueDate: "Aug 17, 2026",
    certificateExpiryDate: "Aug 17, 2027",
  },
  {
    id: "ETH-2026-061",
    title: "Anonymized Genomic Sequence Sharing Protocol for Regional Oncology Consortium",
    department: "Genomics & Precision Medicine",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Jul 19, 2026",
    daysInReview: 11,
    hasCertificate: true,
    feeAmountBdt: 20000,
    feeTier: "clinical",
    isExpedited: false,
    paymentMethod: "bank_transfer",
    senderNumber: "DIU-CHALLAN-9921",
    transactionId: "CHALLAN-DIU-9921",
    abstract: "Multi-center observational genomics repository analyzing somatic sequencing profiles of breast and colorectal neoplasms in South Asian cohorts. Anonymization verified by bio-computational ethics protocols.",
    studyType: "Genomic & Precision Medicine",
    durationMonths: 24,
    studyLocation: "National Institute of Cancer Research & Hospital & DIU Genomics Lab",
    coInvestigators: "Prof. Charles Montgomery (DIU), Dr. K. M. Rahman (BSMMU)",
    targetSampleSize: 1200,
    vulnerablePopulations: ["Cancer Patients in Active Therapy"],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Cryptographic hash blinding of FASTQ sequence reads. Hardware security module (HSM) key derivation.",
    proposalDocumentName: "Genomic_Consortium_Governance_v3.pdf",
    consentDocumentName: "Genetic_Research_Consent_Form.pdf",
    dataToolsDocumentName: "Specimen_Tracking_Instrument.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Full committee convened Jul 28, 2026. Unanimous clearance granted following genomic de-identification audit.",
    certificateSealHash: "c1048b99218df73a4b0811e57199c0827361ad28e7193f44109827361928e571",
    certificateIssueDate: "Jul 30, 2026",
    certificateExpiryDate: "Jul 30, 2027",
  },
  {
    id: "ETH-2026-042",
    title: "Digital Privacy and Consent Architecture in IoT Wearable Health Monitors",
    department: "Computer Science & Ethics",
    board: "AI & Data Ethics Board",
    status: "Revision Requested",
    statusColor: "rose",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Jul 05, 2026",
    daysInReview: 14,
    hasCertificate: false,
    feeAmountBdt: 7500,
    feeTier: "faculty",
    isExpedited: false,
    paymentMethod: "bkash",
    senderNumber: "01711998877",
    transactionId: "BK77341902",
    abstract: "Evaluation of real-time photoplethysmography sensor streaming from commercial smartwatches to cloud-based neural networks. Explores patient opt-in transparency and granular revocable consent mechanisms.",
    studyType: "AI & Healthcare Data Analytics",
    durationMonths: 12,
    studyLocation: "DIU Smart Health IoT Laboratory",
    coInvestigators: "Dr. Shamim Reza (DIU CSE), Engr. Nadia Sultana",
    targetSampleSize: 400,
    vulnerablePopulations: [],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Transport Layer Security (TLS 1.3) with localized tokenization before transmission.",
    proposalDocumentName: "IoT_Health_Privacy_Framework.pdf",
    consentDocumentName: "Dynamic_Digital_Consent_Spec.pdf",
    dataToolsDocumentName: "App_UI_Telemetric_Log.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 4,
    committeeRemarks: "Revision Required: The committee requests clarification on emergency access override protocols and third-party cloud hosting compliance with Bangladesh Digital Security Act.",
  },
  {
    id: "ETH-2026-092",
    title: "Randomized Controlled Trial of Pediatric Cognitive Behavioral Teletherapy",
    department: "Pediatrics & Behavioral Health",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Sep 01, 2026",
    daysInReview: 4,
    hasCertificate: false,
    piName: "Dr. Elena Rostova",
    piEmail: "elena.rostova@diu.edu.bd",
    assignedReviewerId: "REV-2026-077",
    assignedReviewerName: "Dr. Sabrina Akhter",
    assignedReviewerEmail: "sabrina.akhter@dmc.gov.bd",
    assignmentStatus: "Accepted",
    assignmentDate: "Sep 02, 2026",
    feeAmountBdt: 20000,
    feeTier: "clinical",
    isExpedited: false,
    paymentMethod: "rocket",
    senderNumber: "01999887766",
    transactionId: "RC10948291",
    abstract: "Two-arm double-blind randomized clinical trial assessing the psychological outcomes of 12-week tele-delivered CBT versus standard clinic care in adolescents experiencing generalized anxiety.",
    studyType: "Clinical Trial (Interventional)",
    durationMonths: 24,
    studyLocation: "Dhaka Shishu Hospital & DIU Behavioral Health Clinic",
    coInvestigators: "Dr. Mahmuda Begum (DSH), Prof. Charles Montgomery (DIU)",
    targetSampleSize: 300,
    vulnerablePopulations: ["Minors (Ages 12-17)"],
    consentType: "Assent Form (Pediatric / Minors)",
    dataConfidentiality: "All consultation recordings deleted within 48h following blinded clinical rating. Encrypted patient IDs.",
    proposalDocumentName: "Pediatric_CBT_RCT_Protocol.pdf",
    consentDocumentName: "Pediatric_Assent_and_Parent_Consent.pdf",
    dataToolsDocumentName: "GAD7_Adolescent_Psychometric_Scale.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 4,
    committeeRemarks: "Dr. Sabrina Akhter accepted review assignment. Deliberation in progress.",
  },
  {
    id: "ETH-2026-085",
    title: "Occupational Ergonomics and Musculoskeletal Disorders Among Remote Tech Workers",
    department: "Occupational Health & Ergonomics",
    board: "Social & Behavioral Board",
    status: "Under Committee Review",
    statusColor: "amber",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Aug 22, 2026",
    daysInReview: 5,
    hasCertificate: false,
    piName: "Dr. Elena Rostova",
    piEmail: "elena.rostova@diu.edu.bd",
    assignedReviewerId: "REV-2026-074",
    assignedReviewerName: "Dr. Mahmudul Hasan",
    assignedReviewerEmail: "m.hasan@nimh.gov.bd",
    assignmentStatus: "Declined",
    assignmentDate: "Aug 29, 2026",
    reviewerDeclineReason: "Excess clinical, surgical, or administrative institutional workload",
    feeAmountBdt: 7500,
    feeTier: "faculty",
    isExpedited: true,
    paymentMethod: "bkash",
    senderNumber: "01711998877",
    transactionId: "BK99281726",
    abstract: "National cross-sectional survey examining posture, monitor setups, and reported repetitive strain injuries among 600 software engineers working remotely across Dhaka and Chittagong.",
    studyType: "Social & Behavioral Survey",
    durationMonths: 6,
    studyLocation: "DIU Department of Public Health Online Research Portal",
    coInvestigators: "Dr. Arifur Rahman (DIU), Dr. Salma Khatun",
    targetSampleSize: 600,
    vulnerablePopulations: [],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Strictly non-identifiable aggregated survey data. Zero employer disclosure.",
    proposalDocumentName: "Remote_Ergonomics_Study_v1.pdf",
    consentDocumentName: "Informed_Consent_Survey_Online.pdf",
    dataToolsDocumentName: "Nordic_Musculoskeletal_Questionnaire.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 4,
    committeeRemarks: "Dr. Mahmudul Hasan declined review request (Excess clinical workload). Secretariat reassignment required.",
  },

  {
    id: "ETH-2026-055",
    title: "Cross-Sectional Investigation into Maternal Nutritional Biomarkers in Rural Cohorts",
    department: "Nutrition & Food Engineering",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Jun 30, 2026",
    daysInReview: 7,
    hasCertificate: true,
    feeAmountBdt: 7500,
    feeTier: "faculty",
    isExpedited: false,
    paymentMethod: "bank_transfer",
    senderNumber: "CHALLAN-2026-55",
    transactionId: "CHALLAN-2026-55",
    abstract: "Community-based nutritional assessment measuring serum micronutrient levels (zinc, ferritin, folate) among 350 rural pregnant women attending ante-natal checkups.",
    studyType: "Epidemiological / Observational",
    durationMonths: 12,
    studyLocation: "Savar Upazila Health Complex & DIU Community Outposts",
    coInvestigators: "Dr. Rehana Parvin (icddr,b), Dr. Farzana Choudhury",
    targetSampleSize: 350,
    vulnerablePopulations: ["Pregnant Women"],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Phlebotomy samples barcoded with zero identifiable demographic markers on tubes.",
    proposalDocumentName: "Maternal_Nutrition_Assessment.pdf",
    consentDocumentName: "Maternal_Informed_Consent_Bangla.pdf",
    dataToolsDocumentName: "Dietary_Recall_Questionnaire.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Full ethics approval granted. Monitoring committee report scheduled for Dec 2026.",
    certificateSealHash: "5e91a003f29b4781bc093410ea9921b4401827ecba91823719bca00192837461",
    certificateIssueDate: "Jul 07, 2026",
    certificateExpiryDate: "Jul 07, 2027",
  },
  {
    id: "ETH-2026-038",
    title: "Generative AI Code Assistance and Academic Integrity Perceptions Among Students",
    department: "Software Engineering & Pedagogy",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "May 18, 2026",
    daysInReview: 2,
    hasCertificate: true,
    feeAmountBdt: 3500,
    feeTier: "student",
    isExpedited: true,
    paymentMethod: "nagad",
    senderNumber: "01755123456",
    transactionId: "NG48192038",
    abstract: "Mixed-methods pedagogy research examining perception, ethical comprehension, and learning retention among 500 undergraduate engineering students using LLM programming copilots.",
    studyType: "Social & Behavioral Survey",
    durationMonths: 6,
    studyLocation: "DIU Ashulia Academic Campus Classrooms",
    coInvestigators: "Dr. Syed Akhter Hossain (DIU), Engr. Tamim Iqbal",
    targetSampleSize: 500,
    vulnerablePopulations: ["University Students"],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Anonymous intake survey. Results de-coupled from academic grades.",
    proposalDocumentName: "GenAI_Pedagogy_Protocol.pdf",
    consentDocumentName: "Student_Survey_Consent.pdf",
    dataToolsDocumentName: "AI_Attitude_Survey_Instrument.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Exempt status confirmed under Educational Practices Category 1.",
    certificateSealHash: "7b019482ca910283e5410982bca88192038471629ab019283746501928374610",
    certificateIssueDate: "May 20, 2026",
    certificateExpiryDate: "May 20, 2027",
  },
  {
    id: "ETH-2026-029",
    title: "Microbiome Alterations in Patients Undergoing Early-Stage Chemotherapy",
    department: "Biomedical Engineering & Oncology",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Apr 25, 2026",
    daysInReview: 16,
    hasCertificate: true,
    feeAmountBdt: 20000,
    feeTier: "clinical",
    isExpedited: false,
    paymentMethod: "card",
    senderNumber: "CARD-DIU-029",
    transactionId: "CARD-DIU-029",
    abstract: "Prospective 16S rRNA gene sequencing study following gut microbiome taxonomy shifts across 100 cancer patients receiving cytotoxic regimen.",
    studyType: "Clinical Trial (Interventional)",
    durationMonths: 18,
    studyLocation: "Dhaka Medical College Hospital Oncology Ward",
    coInvestigators: "Dr. K. M. Rahman (DMCH), Prof. Charles Montgomery (DIU)",
    targetSampleSize: 100,
    vulnerablePopulations: ["Oncology Patients"],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Full double-coded biospecimen tracking with secure offline cold-storage logs.",
    proposalDocumentName: "Microbiome_Chemotherapy_Study.pdf",
    consentDocumentName: "Clinical_Trial_Consent_Biomedical.pdf",
    dataToolsDocumentName: "Gastrointestinal_Symptom_Scale.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Cleared by Biomedical IRB after independent safety board signoff.",
    certificateSealHash: "3a91827461098273645019283746192837465019283746501928374650192837",
    certificateIssueDate: "May 11, 2026",
    certificateExpiryDate: "May 11, 2027",
  },
  {
    id: "ETH-2026-021",
    title: "Perceived Fairness of Automated Healthcare Resource Allocation Algorithms",
    department: "Public Health Informatics",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Apr 04, 2026",
    daysInReview: 6,
    hasCertificate: true,
    feeAmountBdt: 7500,
    feeTier: "faculty",
    isExpedited: false,
    paymentMethod: "bkash",
    senderNumber: "01711998877",
    transactionId: "BK29183021",
    abstract: "Factorial vignette survey evaluating ethical perceptions of triage algorithms used during intensive care bed allocation during epidemic outbreaks.",
    studyType: "AI & Healthcare Data Analytics",
    durationMonths: 8,
    studyLocation: "DIU Department of Public Health Informatics",
    coInvestigators: "Dr. Farzana Choudhury (icddr,b)",
    targetSampleSize: 450,
    vulnerablePopulations: [],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Fully anonymized responses collected via cryptographic web survey platform.",
    proposalDocumentName: "AI_Triage_Ethics_Protocol.pdf",
    consentDocumentName: "Online_Participant_Consent.pdf",
    dataToolsDocumentName: "Vignette_Evaluation_Scale.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Ethical clearance granted. AI model deliberation rubric verified.",
    certificateSealHash: "4c01928374650192837465019283746501928374650192837465019283746501",
    certificateIssueDate: "Apr 10, 2026",
    certificateExpiryDate: "Apr 10, 2027",
  },
  {
    id: "ETH-2026-015",
    title: "Bioimpedance Sensor Calibration for Non-Invasive Cardiovascular Screening",
    department: "Electrical Engineering & Health Devices",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Mar 12, 2026",
    daysInReview: 8,
    hasCertificate: true,
    feeAmountBdt: 7500,
    feeTier: "faculty",
    isExpedited: false,
    paymentMethod: "rocket",
    senderNumber: "01811223344",
    transactionId: "RC88192015",
    abstract: "Pilot validation testing of skin-contact micro-impedance electrodes against standard sphygmomanometer blood pressure readings in 150 adult volunteers.",
    studyType: "Clinical Trial (Interventional)",
    durationMonths: 10,
    studyLocation: "DIU Biomedical Sensor Prototyping Laboratory",
    coInvestigators: "Prof. Charles Montgomery (DIU)",
    targetSampleSize: 150,
    vulnerablePopulations: [],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Measurements logged via localized offline oscilloscope analyzers with zero network broadcast.",
    proposalDocumentName: "Bioimpedance_Sensor_Validation.pdf",
    consentDocumentName: "Device_Testing_Consent_Form.pdf",
    dataToolsDocumentName: "Calibration_Measurement_Log.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Cleared following verification of non-invasive electric isolation barriers.",
    certificateSealHash: "9a01928374650192837465019283746501928374650192837465019283746501",
    certificateIssueDate: "Mar 20, 2026",
    certificateExpiryDate: "Mar 20, 2027",
  },
  {
    id: "ETH-2026-008",
    title: "Ethical Implications of Autonomous Vehicle Collision Triage Models",
    department: "Robotics & Moral Philosophy",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "Feb 19, 2026",
    daysInReview: 3,
    hasCertificate: true,
    feeAmountBdt: 3500,
    feeTier: "student",
    isExpedited: true,
    paymentMethod: "bkash",
    senderNumber: "01711998877",
    transactionId: "BK18293008",
    abstract: "Philosophical and empirical survey comparing utilitarian versus deontological responses to hypothetical autonomous vehicle crash dilemmas across 700 urban respondents.",
    studyType: "Social & Behavioral Survey",
    durationMonths: 6,
    studyLocation: "DIU Robotics Innovation Center",
    coInvestigators: "Dr. Shamim Reza (DIU)",
    targetSampleSize: 700,
    vulnerablePopulations: [],
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality: "Strictly anonymous web-based hypothetical simulations.",
    proposalDocumentName: "AV_Ethics_Crash_Simulations.pdf",
    consentDocumentName: "Simulation_Participant_Waiver.pdf",
    dataToolsDocumentName: "Trolley_Problem_Survey_V2.pdf",
    investigatorCvName: "Dr_Elena_Rostova_Biosketch.pdf",
    reviewStep: 5,
    committeeRemarks: "Exemption granted under Minimal Risk Virtual Simulations Category.",
    certificateSealHash: "2e01928374650192837465019283746501928374650192837465019283746501",
    certificateIssueDate: "Feb 22, 2026",
    certificateExpiryDate: "Feb 22, 2027",
  },
]

let cachedProtocols: Protocol[] = [...initialProtocols]

export function getStoredProtocols(): Protocol[] {
  return cachedProtocols
}

export function getProtocolById(id: string): Protocol | undefined {
  return cachedProtocols.find((p) => p.id.toLowerCase() === id.toLowerCase())
}

export function saveStoredProtocols(protocols: Protocol[]): void {
  cachedProtocols = protocols
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:protocols-updated"))
  }
}

export function subscribeProtocols(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  window.addEventListener("ethica:protocols-updated", callback)
  return () => {
    window.removeEventListener("ethica:protocols-updated", callback)
  }
}

export function updateProtocol(id: string, updates: Partial<Protocol>): Protocol | undefined {
  let updated: Protocol | undefined
  cachedProtocols = cachedProtocols.map((p) => {
    if (p.id.toLowerCase() === id.toLowerCase()) {
      updated = { ...p, ...updates }
      if (updates.assignmentStatus === "Pending Acceptance" && updates.reviewerDeclineReason === undefined) {
        delete updated.reviewerDeclineReason
      }
      return updated
    }
    return p
  })

  if (updated) {
    saveStoredProtocols(cachedProtocols)
    if (typeof window !== "undefined") {
      fetch(`/api/protocols/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).catch(() => {
        // Fallback: cachedProtocols retains updates
      })
    }
  }

  return updated
}

export function addProtocol(
  newProtocol: Omit<Protocol, "id" | "submissionDate" | "daysInReview" | "hasCertificate"> & {
    id?: string
    hasCertificate?: boolean
    daysInReview?: number
  }
): Protocol {
  const current = getStoredProtocols()
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const id = newProtocol.id || `ETH-2026-${randomSuffix}`
  const now = new Date()
  const submissionDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  const protocol: Protocol = {
    ...newProtocol,
    id,
    submissionDate,
    piName: newProtocol.piName || "Dr. Elena Rostova",
    piEmail: newProtocol.piEmail || "elena.rostova@diu.edu.bd",
    piInstitution: newProtocol.piInstitution || "Daffodil International University",
    daysInReview: newProtocol.daysInReview ?? 0,
    hasCertificate: newProtocol.hasCertificate ?? false,
    reviewStep: newProtocol.reviewStep ?? (newProtocol.status === "Clearance Granted" ? 5 : 4),
  }

  const updated = [protocol, ...current]
  saveStoredProtocols(updated)

  // Asynchronously synchronize with server API (Zero LocalStorage)
  if (typeof window !== "undefined") {
    fetch("/api/protocols", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(protocol),
    }).catch(() => {
      // Resilient fallback: preserved in cachedProtocols
    })
  }

  return protocol
}

export async function syncProtocolsFromServer(): Promise<Protocol[]> {
  try {
    const res = await fetch("/api/protocols")
    if (res.ok) {
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        cachedProtocols = json.data
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ethica:protocols-updated"))
        }
        return json.data
      }
    }
  } catch {
    // Fallback gracefully to in-memory cachedProtocols
  }
  return cachedProtocols
}

export function assignReviewerToProtocol(
  protocolId: string,
  reviewer: { id: string; name: string; email: string }
): Protocol | undefined {
  const now = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
  return updateProtocol(protocolId, {
    assignedReviewerId: reviewer.id,
    assignedReviewerName: reviewer.name,
    assignedReviewerEmail: reviewer.email,
    assignmentStatus: "Pending Acceptance",
    assignmentDate: now,
    reviewerDeclineReason: undefined,
    reviewStep: 4,
    committeeRemarks: `Review request dispatched to ${reviewer.name}. Awaiting reviewer acceptance.`,
  })
}

export function respondToReviewAssignment(
  protocolId: string,
  response: "Accepted" | "Declined",
  reason?: string
): Protocol | undefined {
  const protocol = getProtocolById(protocolId)
  if (!protocol) return undefined

  if (response === "Accepted") {
    return updateProtocol(protocolId, {
      assignmentStatus: "Accepted",
      reviewStep: 4,
      committeeRemarks: `${protocol.assignedReviewerName || "Reviewer"} accepted review assignment. Deliberation in progress.`,
    })
  } else {
    return updateProtocol(protocolId, {
      assignmentStatus: "Declined",
      reviewerDeclineReason: reason || "Declined due to scheduling or conflict of interest.",
      committeeRemarks: `${protocol.assignedReviewerName || "Reviewer"} declined review request (${reason || "Unavailable"}). Secretariat reassignment required.`,
    })
  }
}

export function submitReviewerEvaluation(
  protocolId: string,
  evaluation: ProtocolReviewerEvaluation
): Protocol | undefined {
  const isApproved = evaluation.recommendation === "Clearance Approved"
  const isRevision = evaluation.recommendation === "Revisions Required"

  return updateProtocol(protocolId, {
    assignmentStatus: "Review Completed",
    reviewerEvaluation: evaluation,
    status: isApproved ? "Clearance Granted" : isRevision ? "Revision Requested" : "Rejected",
    statusColor: isApproved ? "emerald" : isRevision ? "rose" : "rose",
    hasCertificate: isApproved ? true : false,
    reviewStep: isApproved ? 5 : 4,
    committeeRemarks: `Formal determination submitted by ${evaluation.reviewerName}: ${evaluation.deliberationRemarks} (${evaluation.recommendation})`,
  })
}

