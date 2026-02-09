/**
 * Legal dashboard global search: searchable entities and search logic.
 * Entities: Contracts, Creators/Talent, Compliance alerts, Consent records, Jurisdictions.
 * Admin entities (Projects, Tasks, Assets, Brands, Team, Workflows) are excluded.
 */

import { SEARCH_CONTRACTS, SEARCH_CREATORS } from "@/lib/legal-mock-data"

export type LegalSearchEntityType =
  | "contract"
  | "creator"
  | "compliance_alert"
  | "consent_record"
  | "jurisdiction"

export interface LegalSearchResult {
  type: LegalSearchEntityType
  id: string
  href: string
  title: string
  subtitle?: string
  keywords: string[]
}

const MOCK_COMPLIANCE_ALERTS: { id: string; message: string; severity: string }[] = [
  { id: "alert-1", message: "TX jurisdiction sign-off missing for output bundle", severity: "High" },
  { id: "alert-2", message: "EU AI Act disclosure required for EU/UK distribution", severity: "Medium" },
  { id: "alert-3", message: "Contract CR-2024-100-DELTA expiring in 30 days", severity: "Medium" },
  { id: "alert-4", message: "NIL consent verification pending for new creator", severity: "Low" },
  { id: "alert-5", message: "California disclosure clause not found in creative", severity: "High" },
]

const MOCK_CONSENT_RECORDS: { id: string; entityName: string }[] = [
  { id: "CON-2025-033", entityName: "Talent consent — New media use" },
  { id: "ACLAR-NIL-001", entityName: "Michael Chen — NIL (CR-2024-00489)" },
  { id: "ACLAR-AI-002", entityName: "Samsung EU — AI Content" },
  { id: "CON-2025-028", entityName: "Brand A — Ad disclosure" },
]

const MOCK_JURISDICTIONS: { name: string; code?: string }[] = [
  { name: "California", code: "CA" },
  { name: "New York", code: "NY" },
  { name: "Texas", code: "TX" },
  { name: "European Union", code: "EU" },
  { name: "United Kingdom", code: "UK" },
  { name: "Canada", code: "CA" },
]

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase()
}

function matchesKeyword(keywords: string[], query: string): boolean {
  const nq = normalizeQuery(query)
  if (!nq) return false
  return keywords.some((k) => k.toLowerCase().includes(nq) || nq.split(/\s+/).every((w) => k.toLowerCase().includes(w)))
}

/**
 * Search across legal entities only. Returns results grouped by type.
 */
export function searchLegalEntities(query: string): LegalSearchResult[] {
  const nq = normalizeQuery(query)
  const results: LegalSearchResult[] = []

  if (!nq) return results

  // Contracts: by ID, name, creator, brand
  for (const c of SEARCH_CONTRACTS) {
    const keywords = [c.contractId, c.name, c.creator, c.brand]
    if (!matchesKeyword(keywords, nq)) continue
    results.push({
      type: "contract",
      id: c.contractId,
      href: `/contracts/${c.contractId}`,
      title: c.contractId,
      subtitle: c.name,
      keywords,
    })
  }

  // Creators/Talent: by name, Creator ID
  for (const c of SEARCH_CREATORS) {
    const keywords = [c.name, c.creatorId ?? "", c.id]
    if (!matchesKeyword(keywords, nq)) continue
    results.push({
      type: "creator",
      id: c.id,
      href: `/talent-rights/${c.id}`,
      title: c.name,
      subtitle: c.creatorId ? `Creator ID: ${c.creatorId}` : undefined,
      keywords,
    })
  }

  // Compliance alerts: by message, severity
  for (const a of MOCK_COMPLIANCE_ALERTS) {
    const keywords = [a.message, a.severity]
    if (!matchesKeyword(keywords, nq)) continue
    results.push({
      type: "compliance_alert",
      id: a.id,
      href: "/compliance",
      title: a.message,
      subtitle: a.severity,
      keywords,
    })
  }

  // Consent records: by ID, entity name
  for (const r of MOCK_CONSENT_RECORDS) {
    const keywords = [r.id, r.entityName]
    if (!matchesKeyword(keywords, nq)) continue
    results.push({
      type: "consent_record",
      id: r.id,
      href: "/compliance/aclar",
      title: r.id,
      subtitle: r.entityName,
      keywords,
    })
  }

  // Jurisdictions: by state/country name (and code)
  for (const j of MOCK_JURISDICTIONS) {
    const keywords = [j.name, j.code ?? ""]
    if (!matchesKeyword(keywords, nq)) continue
    results.push({
      type: "jurisdiction",
      id: j.code ?? j.name,
      href: "/compliance/jurisdictions",
      title: j.name,
      subtitle: j.code ? `Code: ${j.code}` : undefined,
      keywords,
    })
  }

  return results
}

export const LEGAL_SEARCH_ENTITY_LABELS: Record<LegalSearchEntityType, string> = {
  contract: "Contracts",
  creator: "Creators / Talent",
  compliance_alert: "Compliance alerts",
  consent_record: "Consent records",
  jurisdiction: "Jurisdictions",
}
