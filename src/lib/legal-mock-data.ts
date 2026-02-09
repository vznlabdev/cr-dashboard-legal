/**
 * Canonical legal dashboard mock data.
 * Single source of truth for contract IDs, primary creator, metrics, and sample data.
 * Use these exports across dashboard home, contracts, talent rights, review, approvals, and compliance.
 */

// ============ Canonical IDs ============

/** All contract references must use one of these IDs. */
export const CONTRACT_IDS = [
  "CR-2024-245-NIKE",
  "CR-2024-203-SAMSUNG",
  "CR-2024-267-COKE",
  "CR-2024-189-TOYOTA",
  "CR-2023-156-ADIDAS",
  "CR-2024-178-APPLE",
] as const

export type ContractId = (typeof CONTRACT_IDS)[number]

/** Primary creator for demo data. */
export const PRIMARY_CREATOR = {
  name: "Michael Chen",
  type: "Actor" as const,
  creatorId: "CR-2024-00489",
  id: "cr-michael-chen",
}

/** Compliance checklist item status for contract detail. */
export type ComplianceChecklistStatus = "ok" | "warn" | "fail"

/** Insurance: Lloyd's of London / Lloyd's Lab consistently. */
export const INSURANCE = {
  provider: "Lloyd's of London",
  labName: "Lloyd's Lab",
  policyPrefix: "LL-POL",
}

// ============ Dashboard metrics (consistent across home, compliance, contract details) ============

export const DASHBOARD_METRICS = {
  activeContracts: 243,
  complianceRate: 88.5,
  complianceRateFormatted: "88.5%",
  openIssuesTotal: 18,
  openIssuesBreakdown: "1 crit, 4 high, 8 med, 5 low",
  expiringSoon30d: 28,
}

// ============ Compliance alerts (dashboard home) ============

export const COMPLIANCE_ALERTS = [
  { id: "alt-1", severity: "critical" as const, type: "non_compliant", message: "Missing NIL consent for campaign hero", contractId: "CR-2024-245-NIKE", ts: "2025-02-09 09:15" },
  { id: "alt-2", severity: "high" as const, type: "disclosure_missing", message: "AI disclosure not present on asset", contractId: "CR-2024-203-SAMSUNG", ts: "2025-02-09 08:42" },
  { id: "alt-3", severity: "medium" as const, type: "jurisdiction_conflict", message: "CA vs NY consent scope mismatch", contractId: "CR-2024-267-COKE", ts: "2025-02-08 16:20" },
  { id: "alt-4", severity: "high" as const, type: "risk_threshold", message: "Risk score above 75 for model usage", contractId: "CR-2023-156-ADIDAS", ts: "2025-02-08 14:00" },
  { id: "alt-5", severity: "low" as const, type: "legislation_change", message: "New amendment in EU jurisdiction", contractId: "CR-2024-189-TOYOTA", ts: "2025-02-08 11:30" },
]

// ============ Contracts requiring attention (dashboard home) ============

export const CONTRACTS_REQUIRING_ATTENTION = [
  { id: "CR-2024-245-NIKE", name: "Nike Summer Campaign 2025", creator: PRIMARY_CREATOR.name, issueCount: 2, riskScore: 78, status: "review" as const },
  { id: "CR-2024-203-SAMSUNG", name: "Samsung Global Campaign", creator: "Sarah Johnson", issueCount: 1, riskScore: 72, status: "pending" as const },
  { id: "CR-2024-267-COKE", name: "Coca-Cola Holiday 2024", creator: "Sam Davis", issueCount: 3, riskScore: 65, status: "review" as const },
  { id: "CR-2023-156-ADIDAS", name: "Adidas Summer Collection", creator: PRIMARY_CREATOR.name, issueCount: 1, riskScore: 81, status: "blocked" as const },
  { id: "CR-2024-178-APPLE", name: "Apple Holiday 2024", creator: "Morgan Lee", issueCount: 1, riskScore: 44, status: "pending" as const },
]

// ============ Upcoming deadlines (dashboard home) ============

export const UPCOMING_DEADLINES = [
  { date: "2025-02-15", description: "Contract expiration — Nike Summer 2025", contractId: "CR-2024-245-NIKE" as ContractId | null },
  { date: "2025-02-20", description: "Filing deadline — Q1 compliance report", contractId: null },
  { date: "2025-02-22", description: "Review due — Samsung Global Campaign", contractId: "CR-2024-203-SAMSUNG" as ContractId | null },
  { date: "2025-02-28", description: "Contract expiration — Coca-Cola Holiday 2024", contractId: "CR-2024-267-COKE" as ContractId | null },
  { date: "2025-03-05", description: "Renewal window opens — Apple Holiday", contractId: "CR-2024-178-APPLE" as ContractId | null },
]

// ============ Jurisdiction updates (dashboard home) ============

export const JURISDICTION_UPDATES = [
  { category: "New Law" as const, headline: "EU AI Act enforcement begins", code: "EU", date: "2025-02-07" },
  { category: "Amendment" as const, headline: "California likeness disclosure rules updated", code: "CA", date: "2025-02-05" },
  { category: "Enforcement" as const, headline: "UK ASA guidance on synthetic media", code: "UK", date: "2025-02-03" },
]

// ============ Trend chart (dashboard home) ============

export const TREND_CHART_DATA = [
  { month: "Mar", complianceRate: 82, avgRiskScore: 58 },
  { month: "Apr", complianceRate: 83, avgRiskScore: 56 },
  { month: "May", complianceRate: 84, avgRiskScore: 55 },
  { month: "Jun", complianceRate: 83.5, avgRiskScore: 54 },
  { month: "Jul", complianceRate: 85, avgRiskScore: 52 },
  { month: "Aug", complianceRate: 86, avgRiskScore: 51 },
  { month: "Sep", complianceRate: 85.5, avgRiskScore: 50 },
  { month: "Oct", complianceRate: 86.5, avgRiskScore: 49 },
  { month: "Nov", complianceRate: 87, avgRiskScore: 48 },
  { month: "Dec", complianceRate: 87.5, avgRiskScore: 47 },
  { month: "Jan", complianceRate: 88, avgRiskScore: 46 },
  { month: "Feb", complianceRate: 88.5, avgRiskScore: 45 },
]

// ============ Contract cards (contracts list page) ============

export type CardStatus = "active" | "expiring" | "expired"

export interface ContractCardData {
  id: string
  contractId: string
  title: string
  status: CardStatus
  daysRemaining: number | null
  creator: string
  brand: string
  agency?: string
  agreementType: string
  exclusivity: string
  projectId?: string
  projectTitle?: string
  nilp: { name: boolean; image: boolean; likeness: boolean; persona: boolean }
  value: number
  currency: string
  paymentStatus: "paid" | "pending" | "overdue"
  effectiveDate: string
  expirationDate: string
  territory: string[]
  mediaChannels: string[]
  creationMethod: string
  executionDate: string | null
  reviewer: string | null
  insuranceStatus: string
  complianceStatus: string
  documentCount: number
}

export const MOCK_CONTRACTS: ContractCardData[] = [
  {
    id: "c1",
    contractId: "CR-2024-245-NIKE",
    title: "Nike Summer Campaign 2025",
    status: "active",
    daysRemaining: 141,
    creator: PRIMARY_CREATOR.name,
    brand: "Nike",
    agency: "Talent Partners LLC",
    agreementType: "NILP Rights Agreement",
    exclusivity: "Non-exclusive",
    projectId: "task-245",
    projectTitle: "Q1 2025 Campaign",
    nilp: { name: true, image: true, likeness: true, persona: true },
    value: 15000,
    currency: "USD",
    paymentStatus: "paid",
    effectiveDate: "2025-01-01",
    expirationDate: "2025-06-30",
    territory: ["United States"],
    mediaChannels: ["TV", "Digital", "Social", "Print"],
    creationMethod: "Human + AI-enhanced",
    executionDate: "2024-12-28",
    reviewer: "Sarah Legal",
    insuranceStatus: "Covered",
    complianceStatus: "Compliant",
    documentCount: 3,
  },
  {
    id: "c2",
    contractId: "CR-2024-203-SAMSUNG",
    title: "Samsung Global Campaign",
    status: "expiring",
    daysRemaining: 12,
    creator: "Sarah Johnson",
    brand: "Samsung",
    agreementType: "Brand Endorsement",
    exclusivity: "Category exclusive (Consumer Electronics)",
    projectId: "task-118",
    projectTitle: "Tech Launch 2025",
    nilp: { name: true, image: true, likeness: true, persona: false },
    value: 85000,
    currency: "USD",
    paymentStatus: "paid",
    effectiveDate: "2024-08-01",
    expirationDate: "2025-02-28",
    territory: ["United States", "Canada", "UK"],
    mediaChannels: ["Digital", "Social", "Events"],
    creationMethod: "Human-made",
    executionDate: "2024-07-25",
    reviewer: "Sarah Legal",
    insuranceStatus: "Covered",
    complianceStatus: "Under review",
    documentCount: 4,
  },
  {
    id: "c3",
    contractId: "CR-2024-267-COKE",
    title: "Coca-Cola Holiday 2024",
    status: "expired",
    daysRemaining: null,
    creator: "Sam Davis",
    brand: "Coca-Cola",
    agreementType: "Usage Rights",
    exclusivity: "Non-exclusive",
    projectId: "task-891",
    projectTitle: "Holiday Campaign 2024",
    nilp: { name: true, image: true, likeness: true, persona: true },
    value: 42000,
    currency: "USD",
    paymentStatus: "paid",
    effectiveDate: "2024-10-01",
    expirationDate: "2024-12-31",
    territory: ["United States", "Canada"],
    mediaChannels: ["TV", "Digital", "Social", "Print", "OOH"],
    creationMethod: "AI-enhanced",
    executionDate: "2024-09-20",
    reviewer: "James Counsel",
    insuranceStatus: "Covered",
    complianceStatus: "Compliant",
    documentCount: 5,
  },
  {
    id: "c4",
    contractId: "CR-2024-189-TOYOTA",
    title: "Toyota Holiday 2024",
    status: "expired",
    daysRemaining: null,
    creator: "Morgan Lee",
    brand: "Toyota",
    agency: "Auto Talent Agency",
    agreementType: "NILP Rights Agreement",
    exclusivity: "Non-exclusive (Auto category)",
    projectId: "task-722",
    projectTitle: "Holiday Promo",
    nilp: { name: true, image: true, likeness: true, persona: false },
    value: 28000,
    currency: "USD",
    paymentStatus: "paid",
    effectiveDate: "2024-09-15",
    expirationDate: "2024-12-15",
    territory: ["United States"],
    mediaChannels: ["TV", "Digital", "Social"],
    creationMethod: "Human-made",
    executionDate: "2024-09-10",
    reviewer: "James Counsel",
    insuranceStatus: "Covered",
    complianceStatus: "Compliant",
    documentCount: 3,
  },
  {
    id: "c5",
    contractId: "CR-2023-156-ADIDAS",
    title: "Adidas Summer Collection",
    status: "active",
    daysRemaining: 202,
    creator: PRIMARY_CREATOR.name,
    brand: "Adidas",
    agreementType: "NILP Rights Agreement",
    exclusivity: "Exclusive (Sportswear)",
    projectId: "task-007",
    projectTitle: "Summer 2025",
    nilp: { name: true, image: true, likeness: true, persona: true },
    value: 95000,
    currency: "USD",
    paymentStatus: "pending",
    effectiveDate: "2025-01-15",
    expirationDate: "2025-08-31",
    territory: ["Global"],
    mediaChannels: ["TV", "Digital", "Social", "Print", "Retail"],
    creationMethod: "Human + AI-enhanced",
    executionDate: "2025-01-10",
    reviewer: "Sarah Legal",
    insuranceStatus: "Covered",
    complianceStatus: "Compliant",
    documentCount: 4,
  },
  {
    id: "c6",
    contractId: "CR-2024-178-APPLE",
    title: "Apple Holiday 2024",
    status: "expiring",
    daysRemaining: 22,
    creator: "Sarah Johnson",
    brand: "Apple",
    agreementType: "Brand Endorsement",
    exclusivity: "Category exclusive",
    projectId: "task-655",
    projectTitle: "Holiday 2024",
    nilp: { name: true, image: true, likeness: true, persona: true },
    value: 120000,
    currency: "USD",
    paymentStatus: "paid",
    effectiveDate: "2024-03-01",
    expirationDate: "2025-03-01",
    territory: ["United States", "UK", "EU"],
    mediaChannels: ["Digital", "Social", "Retail"],
    creationMethod: "Human-made",
    executionDate: "2024-02-25",
    reviewer: "James Counsel",
    insuranceStatus: "Covered",
    complianceStatus: "Compliant",
    documentCount: 6,
  },
]

// ============ Contract detail (single contract for /contracts/[id]) ============

export function getContractById(id: string) {
  const normalized = id.toUpperCase().replace(/\s/g, "-")
  const contractId = CONTRACT_IDS.find((c) => c === normalized || id === c) ?? "CR-2024-245-NIKE"
  return getContractDetail(contractId)
}

function getContractDetail(contractId: string) {
  const card = MOCK_CONTRACTS.find((c) => c.contractId === contractId)
  const creatorName = card?.creator ?? PRIMARY_CREATOR.name
  const base = {
    contractId,
    title: card?.title ?? `${contractId} - NILP Rights Agreement`,
    status: "active" as const,
    daysRemaining: card?.daysRemaining ?? 141,
    parties: {
      creator: {
        name: creatorName,
        type: "Individual Talent",
        creatorId: PRIMARY_CREATOR.creatorId,
        talentRightsStatus: "Active",
        agent: "Talent Partners LLC",
        agentContact: "agent@talentpartners.com",
        attorney: "Davis & Associates",
        attorneyContact: "legal@davislegal.com",
      },
      brand: {
        entity: "Nike, Inc.",
        jurisdiction: "Oregon, USA",
        signatory: "Jane Smith (Brand Legal)",
        email: "legal@nike.com",
      },
      agency: {
        entity: "Talent Partners LLC",
        role: "Talent Representative",
        contact: "rep@talentpartners.com",
      },
    },
    talentRights: {
      grantType: "Full",
      name: { usage: ["Campaign credits", "Social media", "Press releases", "Promotional materials"], restrictions: "Attribution required in all materials", approvalRequired: false },
      image: { usage: ["TV commercial", "Digital ads", "Social media", "Print"], restrictions: "Professional headshot and previous campaign footage only", approvalRequired: true },
      likeness: { usage: ["All approved media"], restrictions: "All AI-generated outputs require prior approval", approvalRequired: true, aiGeneration: true, approvedTools: ["ChatGPT", "Midjourney"], limitations: "No deepfakes; approval within 5 business days" },
      persona: { usage: ["Brand voice", "Messaging"], restrictions: "Must align with Nike Just Do It brand values", approvalRequired: true, traits: ["Athletic", "Motivational", "Determined"] },
    },
    usageRights: {
      intendedUse: "Advertising and promotional materials only",
      territory: ["United States"],
      mediaChannels: ["TV", "Digital", "Social", "Print"],
      prohibitedUses: ["Political", "Tobacco", "Adult content"],
      creationMethods: ["Human-made", "AI-enhanced"],
      category: "Sports Apparel",
      exclusivity: { isExclusive: false, competitors: ["Adidas", "Under Armour", "Puma"], blockedCategories: [] },
    },
    term: {
      effectiveDate: "2025-01-01",
      expirationDate: "2025-06-30",
      duration: "6 months",
      daysRemaining: 141,
      autoRenewal: false,
      renewalTerms: "Option to extend for additional 6 months upon mutual agreement",
      terminationRights: "30-day notice required for early termination with pro-rated refund",
      postTermination: "Talent retains moral rights; brand ceases use of NILP within 30 days",
    },
    compensation: {
      totalFee: 15000,
      currency: "USD",
      breakdown: { name: 2000, image: 5000, likeness: 4000, persona: 4000 },
      paymentTerms: "Net 30 from contract execution",
      paymentMethod: "Wire transfer",
      paymentSchedule: "Single payment upon execution",
      paymentStatus: "paid" as const,
      paidAt: "2025-01-05",
      invoiceNumber: "INV-2025-0105-245",
      latePaymentTerms: "1.5% per month on overdue balance",
    },
    legalProvisions: {
      representations: "Talent represents authority to grant rights; Brand represents authority to use.",
      indemnification: "Mutual indemnification for breach of representations.",
      limitationOfLiability: "Cap at total compensation for indirect damages.",
      ipOwnership: "Brand owns outputs; Talent retains moral rights and pre-existing IP.",
      approvalRights: "Talent retains approval rights for all final outputs.",
      confidentiality: "Both parties keep terms confidential.",
      governingLaw: "State of Oregon",
      disputeResolution: "Mediation then binding arbitration in Portland, OR",
    },
    complianceInsurance: {
      insuranceProvider: INSURANCE.provider,
      policyNumber: `${INSURANCE.policyPrefix}-2025-001`,
      coverageAmount: "USD 500,000",
      effectiveDates: "2025-01-01 to 2025-12-31",
      insuranceStatus: "Active",
      complianceChecklist: [
        { item: "NILP consent documented", status: "ok" satisfies ComplianceChecklistStatus },
        { item: "Territory cleared", status: "ok" satisfies ComplianceChecklistStatus },
        { item: "Payment received", status: "ok" satisfies ComplianceChecklistStatus },
        { item: "AI disclosure on outputs", status: "warn" satisfies ComplianceChecklistStatus },
        { item: "Renewal reminder scheduled", status: "ok" satisfies ComplianceChecklistStatus },
      ] as { item: string; status: ComplianceChecklistStatus }[],
      riskAssessment: "Low",
      lastReviewDate: "2025-01-15",
    },
    documents: [
      { id: "d1", name: "Nike_NILP_Agreement_MichaelChen_Signed.pdf", type: "Executed contract", size: "2.1 MB", date: "2024-12-28" },
      { id: "d2", name: "Nike_Campaign_Brief.pdf", type: "Brief", size: "1.5 MB", date: "2024-12-27" },
      { id: "d3", name: "Invoice_INV-2025-0105-245.pdf", type: "Invoice", size: "245 KB", date: "2025-01-05" },
    ],
    project: { id: "task-245", title: "Q1 2025 Campaign", status: "In progress" },
    outputs: [
      { id: "o1", type: "Hero image", creationMethod: "AI-enhanced", approvalStatus: "Approved", rightsUsed: "Image, Likeness" },
      { id: "o2", type: "Social video", creationMethod: "Human-made", approvalStatus: "Pending", rightsUsed: "Name, Image, Persona" },
    ],
    history: [
      { date: "2024-12-27", event: "Drafted", by: "Admin User" },
      { date: "2024-12-27", event: "Sent for review", by: "Admin User" },
      { date: "2024-12-27", event: "Viewed", by: PRIMARY_CREATOR.name },
      { date: "2024-12-28", event: "Signed", by: PRIMARY_CREATOR.name },
      { date: "2024-12-28", event: "Executed", by: "Admin User" },
      { date: "2025-01-05", event: "Payment received", by: "Admin User" },
    ],
    relatedContracts: ["CR-2023-180-NIKE (Previous)"],
    notes: [
      { date: "2025-01-10", author: "Legal Team", text: "All clear for campaign launch. AI disclosure to be added to hero asset." },
      { date: "2024-12-28", author: creatorName, text: "Signed. Please confirm receipt." },
    ],
  }
  return base
}

// ============ Search: contracts and creators (for legal-search.ts) ============

export const SEARCH_CONTRACTS = MOCK_CONTRACTS.map((c) => ({
  contractId: c.contractId,
  name: c.title,
  creator: c.creator,
  brand: c.brand,
}))

export const SEARCH_CREATORS = [
  { id: PRIMARY_CREATOR.id, name: PRIMARY_CREATOR.name, creatorId: PRIMARY_CREATOR.creatorId },
  { id: "cr-sarah-johnson", name: "Sarah Johnson", creatorId: "CR-2024-00490" },
  { id: "cr-jordan-williams", name: "Jordan Williams", creatorId: "CR-2024-00491" },
  { id: "cr-morgan-lee", name: "Morgan Lee", creatorId: "CR-2024-00492" },
  { id: "cr-sam-davis", name: "Sam Davis", creatorId: "CR-2024-00493" },
]

/** Map creator name to talent-rights detail id for linking. */
export const CREATOR_NAME_TO_ID: Record<string, string> = Object.fromEntries(
  SEARCH_CREATORS.map((c) => [c.name, c.id])
)
