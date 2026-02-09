// ==============================================
// Compliance Dashboard Types
// ==============================================

// --- Consent & Attribution (ACLAR) ---

export type ConsentType = "NIL" | "AI_CONTENT" | "AD_DISCLOSURE"

export type ConsentStatus = "verified" | "pending" | "expired" | "revoked"

export interface AuditTrailEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface ConsentRecord {
  id: string
  type: ConsentType
  entityName: string
  entityType: "individual" | "brand" | "organization"
  status: ConsentStatus
  jurisdiction: string
  hash: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  projectId?: string
  projectName?: string
  linkedAssetIds: string[]
  /** Contract IDs that reference this consent (legal view). */
  linkedContractIds?: string[]
  /** For this entity: how many active contracts are covered by this consent vs total. */
  contractCoverage?: { covered: number; total: number }
  auditTrail: AuditTrailEntry[]
  documents?: string[]
  verifiedBy?: string
  verifiedAt?: string
  /** Legal counsel review notes. */
  legalNotes?: string
}

// --- Asset Classification (KYA) ---

export type AssetOrigin = "HUMAN" | "AI" | "HYBRID"

export type ClassificationStatus = "classified" | "pending" | "flagged" | "rejected"

export interface AssetProfile {
  id: string
  assetId: string
  name: string
  origin: AssetOrigin
  intendedUse: string
  audience: string
  jurisdictions: string[]
  classificationConfidence: number // 0-100
  status: ClassificationStatus
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  projectId?: string
  projectName?: string
  taskId?: string
  linkedConsentIds: string[]
  provenanceScoreId?: string
  createdAt: string
  updatedAt: string
  contentType: "Image" | "Video" | "Audio" | "Text" | "AR/VR"
  aiTool?: string
  modelUsed?: string
  alerts: ComplianceAlert[]
}

export interface ComplianceAlert {
  id: string
  type: "non_compliant" | "missing_consent" | "jurisdiction_conflict" | "classification_uncertain" | "disclosure_missing" | "risk_threshold" | "legislation_change"
  severity: "critical" | "high" | "medium" | "low"
  message: string
  assetId?: string
  modelId?: string
  contractId?: string
  projectId?: string
  projectName?: string
  jurisdiction?: string
  timestamp: string
  dismissed: boolean
}

// --- Provenance Scoring ---

export interface ProvenanceScore {
  id: string
  assetId: string
  assetName: string
  lineageFidelity: number // 0-100
  consentCompliance: number // 0-100
  regulatoryCompatibility: number // 0-100
  metadataQuality: number // 0-100
  compositeScore: number // 0-100
  explanation: string
  remediations: string[]
  history: { date: string; score: number }[]
  calculatedAt: string
}

// --- Model Risk Score (MRS) ---

export type RiskClass = "Low" | "Moderate" | "Guarded" | "Elevated" | "Severe" | "Critical"

export type RiskFactorCategory = "CONSENT" | "PROVENANCE" | "REGULATORY" | "TECHNICAL" | "OPERATIONAL"

export type RiskFactorStatus = "PASS" | "WARNING" | "FAIL"

export interface RiskFactor {
  id: string
  name: string
  category: RiskFactorCategory
  weight: number
  scoreImpact: number // negative = hurts score, positive = helps
  status: RiskFactorStatus
  detail: string
  remediationAction: string
  estimatedImprovement: number // positive number: how much score would improve if fixed
}

export interface ScoreChange {
  date: string
  oldScore: number
  newScore: number
  reason: string
  triggeredBy: string
}

export interface ModelRiskScore {
  id: string
  modelId: string
  modelName: string
  baseScore: number
  nyAdjustment: number
  finalMRS: number
  riskClass: RiskClass
  premiumMultiplier: number
  deductiblePct: number | null // null for N/A
  maxCapacityPct: number // 0 for decline
  riskFactors: RiskFactor[]
  scoreHistory: ScoreChange[]
  jurisdictionImpacts: JurisdictionImpact[]
  calculatedAt: string
  /** Contract IDs of contracts that use this AI model/tool (legal view). */
  affectedContractIds?: string[]
}

export interface JurisdictionImpact {
  jurisdiction: string
  lawType: string
  complianceStatus: "compliant" | "non_compliant" | "partial"
  scorePenalty: number
  multiplierImpact: number
}

export interface RemediationItem {
  action: string
  estimatedImprovement: number
  effort: "Low" | "Medium" | "High"
  priority: number
}

// --- MRS-to-Insurance Mapping ---

export interface MRSInsuranceMapping {
  mrsRange: [number, number]
  riskClass: RiskClass
  premiumMultiplier: number
  deductiblePct: number | null
  maxCapacityPct: number
}

// --- Evidence ---

export type EvidenceCategoryKey =
  | "identity_posture"
  | "application_url"
  | "data_classification"
  | "action_taken"
  | "policy_decision"
  | "prompt_metadata"
  | "model_versioning"
  | "trace_logs"

export type EvidenceStatus = "captured" | "partial" | "missing"

export interface EvidenceCategoryData {
  status: EvidenceStatus
  data: Record<string, string | number | boolean | null>
  capturedAt?: string
}

export type LegalRelevance = "Litigation Ready" | "Needs More Evidence" | "Insufficient"

export interface EvidenceRecord {
  id: string
  incidentId: string
  assetId?: string
  modelId?: string
  assetName?: string
  modelName?: string
  type: string
  status: "open" | "resolved" | "escalated"
  date: string
  categories: Record<EvidenceCategoryKey, EvidenceCategoryData>
  completeness: number // 0-8 count of captured categories
  completenessPercent: number // 0-100
  projectId?: string
  projectName?: string
  timeline: EvidenceTimelineEvent[]
  /** Legal view: litigation readiness. */
  legalRelevance?: LegalRelevance
  /** Contract this incident relates to (link to /contracts/[id]). */
  linkedContractId?: string
  /** When true, evidence is locked from modification/deletion (demo). */
  legalHold?: boolean
  /** Counsel analysis / legal assessment. */
  legalAssessment?: string
}

export interface EvidenceTimelineEvent {
  id: string
  timestamp: string
  category: EvidenceCategoryKey | "general"
  action: string
  actor: string
  detail: string
}

// --- Jurisdictions ---

export type LawCategory =
  | "AI_AD_DISCLOSURE"
  | "NIL_RIGHTS"
  | "RIGHT_OF_PUBLICITY"
  | "DEEPFAKE"
  | "BIOMETRIC_LIKENESS"

export type LegislationStatus = "ENACTED" | "PROPOSED" | "IN_COMMITTEE" | "NONE"

export type EnforcementIntensity = "Very High" | "High" | "Medium" | "Low" | "None"

export type JurisdictionContractComplianceStatus = "compliant" | "non_compliant" | "needs_attention"

export interface JurisdictionContractAffected {
  contractId: string
  complianceStatus: JurisdictionContractComplianceStatus
}

export interface JurisdictionProfile {
  state: string
  stateCode: string
  lawCategories: LawCategory[]
  aiAdPenalty: string
  nilPenalty: string
  deepfakePenalty: string
  enforcementIntensity: EnforcementIntensity
  multiplier: number
  legislationStatus: LegislationStatus
  effectiveDate?: string
  statuteReference?: string
  summary?: string
  /** Legal: number of active contracts that distribute to this jurisdiction. */
  activeContractExposure?: number
  /** Legal: contracts that distribute here with compliance status. */
  contractsAffected?: JurisdictionContractAffected[]
  /** Legal: auto-generated advisory text. */
  legalAdvisory?: string
  /** Legal: sum of potential penalties for non-compliant contracts (e.g. "Up to $127,000"). */
  penaltyExposure?: string
}

export type LegislationNewsCategory = "NEW_LAW" | "AMENDMENT" | "PROPOSED" | "ENFORCEMENT_ACTION"

export interface LegislationNewsItem {
  id: string
  headline: string
  state: string
  stateCode: string
  date: string
  category: LegislationNewsCategory
  summary: string
  sourceUrl: string
}

// --- Dashboard Overview ---

export interface ComplianceOverview {
  totalAssetsMonitored: number
  flaggedCount: number
  avgProvenanceScore: number
  avgMRS: number
  highestRiskModel: { name: string; mrs: number; riskClass: RiskClass }
  /** Legal view: contracts monitored count (may equal or derive from assets). */
  contractsMonitored?: number
  /** Legal view: count of contracts with flagged / non-compliant items. */
  flaggedContracts?: number
  /** Legal view: same as avgProvenanceScore, labeled as Avg Compliance Score. */
  avgComplianceScore?: number
  /** Legal view: highest-risk item name (contract or model). */
  highestRisk?: string
  riskDistribution: { riskClass: RiskClass; count: number; color: string }[]
  topRiskModels: {
    id: string
    name: string
    mrs: number
    riskClass: RiskClass
    topRiskFactor: string
  }[]
  /** Legal view: risk items linked to contracts; link to /contracts/[contractId]. */
  topRiskItems?: {
    id: string
    label: string
    contractId: string
    mrs?: number
    riskClass?: RiskClass
    topRiskFactor?: string
  }[]
  alerts: ComplianceAlert[]
  legislationSummary: {
    enacted: number
    pending: number
    none: number
  }
  trendData: { month: string; score: number; mrs: number }[]
  /** Legal view: compliance counts by brand. */
  contractComplianceSummary?: { brand: string; compliant: number; flagged: number }[]
}

// --- Country / Global Jurisdictions ---

export interface CountryJurisdictionProfile {
  countryCode: string // ISO 3166-1 alpha-2 (e.g. "DE", "JP")
  countryName: string
  region: "Europe" | "Asia-Pacific" | "Middle East" | "Americas" | "Africa"
  lawCategories: LawCategory[]
  aiAdPenalty: string
  nilPenalty: string
  deepfakePenalty: string
  enforcementIntensity: EnforcementIntensity
  multiplier: number
  legislationStatus: LegislationStatus
  effectiveDate?: string
  statuteReference?: string
  summary?: string
  /** Legal: number of active contracts that distribute to this jurisdiction. */
  activeContractExposure?: number
  /** Legal: contracts that distribute here with compliance status. */
  contractsAffected?: JurisdictionContractAffected[]
  /** Legal: auto-generated advisory text. */
  legalAdvisory?: string
  /** Legal: sum of potential penalties for non-compliant contracts. */
  penaltyExposure?: string
}

export interface GlobalLegislationNewsItem {
  id: string
  headline: string
  countryName: string
  countryCode: string
  region: CountryJurisdictionProfile["region"]
  date: string
  category: LegislationNewsCategory
  summary: string
  sourceUrl: string
}

// --- Filters ---

export interface ComplianceFilters {
  projectId?: string
  taskGroupId?: string
  workflowType?: "AI" | "HUMAN" | "HYBRID" | "ALL"
  jurisdiction?: string[]
  riskClass?: RiskClass[]
  dateRange?: { start: string; end: string }
  search?: string
}

// --- Premium Calculation ---

export interface PremiumCalculation {
  policyLimit: number
  baseRate: number
  jurisdiction: string
  jurisdictionMultiplier: number
  mrs: number
  riskMultiplier: number
  riskClass: RiskClass
  premium: number
  deductible: number | null
  maxCapacity: number
}
