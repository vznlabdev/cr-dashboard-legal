"use client"

import { use, notFound } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/PageContainer"
import { LinearBreadcrumb } from "@/components/navigation/LinearBreadcrumb"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  ExternalLink,
  MapPin,
  Shield,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PRIMARY_CREATOR } from "@/lib/legal-mock-data"
import { usePageTitle } from "@/hooks/usePageTitle"

// --- Mock: Michael Chen legal profile (id cr-michael-chen or michael-chen) ---
const MICHAEL_CHEN_PROFILE = {
  id: PRIMARY_CREATOR.id,
  creatorId: PRIMARY_CREATOR.creatorId,
  name: PRIMARY_CREATOR.name,
  type: PRIMARY_CREATOR.type,
  rightsStatus: "Full" as const,
  personal: {
    legalName: "Michael Chen",
    type: "Actor",
    agent: "Talent Partners LLC",
    agentEmail: "agent@talentpartners.com",
    agentPhone: "+1 (555) 201-4200",
    attorney: "Davis & Associates",
    attorneyEmail: "legal@davislegal.com",
  },
  nilpSummary: {
    name: "verified" as const,
    image: "verified" as const,
    likeness: "verified" as const,
    persona: "verified" as const,
  },
  nilpDetails: {
    name: { granted: "All active contracts", restrictions: "Attribution required", approvalRequired: false },
    image: { granted: "Nike, Samsung, Coca-Cola, Adidas, Apple", restrictions: "Approved assets only per contract", approvalRequired: true },
    likeness: { granted: "Nike, Samsung, Coca-Cola, Toyota, Adidas, Apple", restrictions: "AI-generated use requires prior approval", approvalRequired: true },
    persona: { granted: "Nike, Coca-Cola, Adidas", restrictions: "Brand voice alignment", approvalRequired: true },
  },
  activeContracts: [
    { contractId: "CR-2024-245-NIKE", brand: "Nike", type: "NILP Rights Agreement", rights: "N·I·L·P", term: "2025-01-01 → 2025-06-30", value: "15,000 USD", exclusivity: "Non-exclusive", compliance: "Compliant" },
    { contractId: "CR-2024-203-SAMSUNG", brand: "Samsung", type: "Brand Endorsement", rights: "N·I·L", term: "2024-08-01 → 2025-02-28", value: "85,000 USD", exclusivity: "Category (Consumer Electronics)", compliance: "Under review" },
    { contractId: "CR-2024-267-COKE", brand: "Coca-Cola", type: "Usage Rights", rights: "N·I·L·P", term: "2024-10-01 → 2024-12-31", value: "42,000 USD", exclusivity: "Non-exclusive", compliance: "Compliant" },
    { contractId: "CR-2024-189-TOYOTA", brand: "Toyota", type: "NILP Rights Agreement", rights: "N·I·L", term: "2024-09-15 → 2024-12-15", value: "28,000 USD", exclusivity: "Non-exclusive", compliance: "Compliant" },
    { contractId: "CR-2023-156-ADIDAS", brand: "Adidas", type: "NILP Rights Agreement", rights: "N·I·L·P", term: "2025-01-15 → 2025-08-31", value: "95,000 USD", exclusivity: "Exclusive (Sportswear)", compliance: "Compliant" },
    { contractId: "CR-2024-178-APPLE", brand: "Apple", type: "Brand Endorsement", rights: "N·I·L·P", term: "2024-03-01 → 2025-03-01", value: "120,000 USD", exclusivity: "Category exclusive", compliance: "Compliant" },
  ],
  exclusivityMap: {
    categories: [
      { category: "Sportswear", brand: "Adidas", exclusive: true, note: "Exclusive" },
      { category: "Consumer Electronics", brand: "Samsung", exclusive: true, note: "Category exclusive" },
      { category: "Consumer Electronics", brand: "Apple", exclusive: true, note: "Category exclusive — potential conflict with Samsung" },
      { category: "Beverages", brand: "Coca-Cola", exclusive: false },
      { category: "Automotive", brand: "Toyota", exclusive: false },
      { category: "Sports Apparel", brand: "Nike", exclusive: false },
    ],
    territories: [
      { territory: "United States", brands: ["Nike", "Samsung", "Coca-Cola", "Toyota", "Adidas", "Apple"] },
      { territory: "Global", brands: ["Samsung", "Adidas", "Apple"] },
    ],
    conflicts: ["Consumer Electronics: Samsung and Apple both have category exclusivity; ensure campaign scopes do not overlap."],
  },
  aclarRecords: [
    { id: "aclar-mc-001", type: "NIL", status: "Verified", jurisdiction: "US", hash: "0x7a3f...2c1d", linkedContracts: ["CR-2024-245-NIKE", "CR-2023-156-ADIDAS"], expires: "2026-01-15" },
    { id: "aclar-mc-002", type: "AI Content", status: "Verified", jurisdiction: "US", hash: "0x9b2e...4f8a", linkedContracts: ["CR-2024-203-SAMSUNG"], expires: "2025-12-01" },
    { id: "aclar-mc-003", type: "NIL", status: "Verified", jurisdiction: "UK", hash: "0x1c5d...7e9b", linkedContracts: ["CR-2024-178-APPLE"], expires: "2025-03-01" },
  ],
  complianceHistory: [
    { date: "2025-02-01", event: "Full rights verification", detail: "All N·I·L·P components verified across active contracts" },
    { date: "2025-01-15", event: "ACLAR record updated", detail: "AI Content consent renewed for Samsung campaign" },
    { date: "2025-01-05", event: "Compliance review", detail: "No issues; Apple contract in good standing" },
    { date: "2024-12-20", event: "Consent change", detail: "Coca-Cola contract expired; consent archived" },
    { date: "2024-12-01", event: "Exclusivity check", detail: "Sportswear exclusivity (Adidas) confirmed; Nike non-exclusive" },
  ],
  riskAssessment: {
    level: "Medium" as const,
    factors: [
      "Multiple category exclusivities (Consumer Electronics: Samsung + Apple) — monitor campaign scope",
      "Six active or recent contracts — high volume of rights to track",
      "AI Content consent in use — ensure all outputs disclosed and approved",
    ],
    lastAssessed: "2025-02-01",
  },
}

function getCreatorById(id: string) {
  const normalized = id.toLowerCase().replace(/\s+/g, "-")
  if (normalized === "cr-michael-chen" || normalized === "michael-chen") return MICHAEL_CHEN_PROFILE
  return null
}

function NilpStatusIcon({ status }: { status: "verified" | "pending" | "none" }) {
  if (status === "verified") return <CheckCircle2 className="h-5 w-5 text-emerald-500" title="Verified" />
  if (status === "pending") return <Clock className="h-5 w-5 text-amber-500" title="Pending" />
  return <Circle className="h-5 w-5 text-muted-foreground/50" title="Not Granted" />
}

export default function TalentRightsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const creator = getCreatorById(id)
  usePageTitle(creator ? creator.name : "Talent Rights")

  if (!creator) {
    notFound()
  }

  return (
    <PageContainer className="space-y-6">
      <LinearBreadcrumb
        backHref="/talent-rights"
        segments={[
          { label: "Talent Rights", href: "/talent-rights" },
          { label: creator.name },
        ]}
      />

      {/* 1. Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{creator.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="secondary" className="text-[11px]">{creator.type}</Badge>
            <span className="text-[12px] font-mono text-muted-foreground">{creator.creatorId}</span>
            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px]">
              {creator.rightsStatus} rights
            </Badge>
          </div>
        </div>
      </div>

      {/* 2. Personal Information */}
      <Card className="border-border/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="grid gap-2 text-[12px] sm:grid-cols-2">
            <p><span className="text-muted-foreground">Name:</span> {creator.personal.legalName}</p>
            <p><span className="text-muted-foreground">Type:</span> {creator.personal.type}</p>
            <p><span className="text-muted-foreground">Agent:</span> {creator.personal.agent} — {creator.personal.agentEmail} · {creator.personal.agentPhone}</p>
            <p><span className="text-muted-foreground">Attorney:</span> {creator.personal.attorney} — {creator.personal.attorneyEmail}</p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Talent Rights Summary — N·I·L·P grid */}
      <Card className="border-border/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Talent Rights Summary (N·I·L·P)</CardTitle>
          <p className="text-[11px] text-muted-foreground">Per-component status across all contracts</p>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {(["name", "image", "likeness", "persona"] as const).map((key) => (
              <div key={key} className="rounded-md border border-border/40 p-3 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{key}</div>
                <NilpStatusIcon status={creator.nilpSummary[key]} />
                <p className="text-[11px] mt-1 capitalize">{creator.nilpSummary[key]}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-[11px] border-t border-border/40 pt-3">
            {(["name", "image", "likeness", "persona"] as const).map((key) => {
              const d = creator.nilpDetails[key]
              return (
                <div key={key} className="rounded-md bg-muted/30 px-3 py-2">
                  <span className="font-medium capitalize">{key}:</span> Granted in {d.granted}. Restrictions: {d.restrictions}. Approval required: {d.approvalRequired ? "Yes" : "No"}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. Active Contracts Table */}
      <Card className="border-border/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Active Contracts</CardTitle>
          <p className="text-[11px] text-muted-foreground">Current talent rights agreements — click to view full contract</p>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-muted-foreground text-left border-b border-border/40">
                  <th className="px-3 py-2 font-medium">Contract ID</th>
                  <th className="px-3 py-2 font-medium">Brand</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Talent Rights</th>
                  <th className="px-3 py-2 font-medium">Term</th>
                  <th className="px-3 py-2 font-medium">Value</th>
                  <th className="px-3 py-2 font-medium">Exclusivity</th>
                  <th className="px-3 py-2 font-medium">Compliance</th>
                  <th className="px-3 py-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {creator.activeContracts.map((row) => (
                  <tr key={row.contractId} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono">
                      <Link href={`/contracts/${row.contractId}`} className="text-primary hover:underline">{row.contractId}</Link>
                    </td>
                    <td className="px-3 py-2">{row.brand}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.type}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{row.rights}</td>
                    <td className="px-3 py-2 text-[11px]">{row.term}</td>
                    <td className="px-3 py-2 font-mono">{row.value}</td>
                    <td className="px-3 py-2 text-[11px]">{row.exclusivity}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={cn("text-[10px]", row.compliance === "Compliant" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600")}>
                        {row.compliance}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                        <Link href={`/contracts/${row.contractId}`}><ExternalLink className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Exclusivity Map */}
      <Card className="border-border/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4" /> Exclusivity Map</CardTitle>
          <p className="text-[11px] text-muted-foreground">Categories and territories by brand; potential conflicts flagged</p>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">By category</div>
              <ul className="space-y-1.5 text-[12px]">
                {creator.exclusivityMap.categories.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="font-medium w-32">{c.category}</span>
                    <span>{c.brand}</span>
                    {c.exclusive && <Badge variant="secondary" className="text-[9px]">Exclusive</Badge>}
                    {c.note && <span className="text-muted-foreground text-[11px]">{c.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">By territory</div>
              <ul className="space-y-1.5 text-[12px]">
                {creator.exclusivityMap.territories.map((t, i) => (
                  <li key={i}>
                    <span className="font-medium">{t.territory}:</span> {t.brands.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {creator.exclusivityMap.conflicts.length > 0 && (
            <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">Potential conflicts</div>
              <ul className="text-[11px] text-amber-800 dark:text-amber-200 list-disc list-inside">
                {creator.exclusivityMap.conflicts.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 6. Consent Records (ACLAR) */}
      <Card className="border-border/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Consent Records (ACLAR)</CardTitle>
          <p className="text-[11px] text-muted-foreground">All ACLAR records for this talent</p>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-muted-foreground text-left border-b border-border/40">
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Jurisdiction</th>
                  <th className="px-3 py-2 font-medium">Hash</th>
                  <th className="px-3 py-2 font-medium">Linked contracts</th>
                  <th className="px-3 py-2 font-medium">Expires</th>
                </tr>
              </thead>
              <tbody>
                {creator.aclarRecords.map((r) => (
                  <tr key={r.id} className="border-b border-border/20">
                    <td className="px-3 py-2 font-mono text-[11px]">{r.id}</td>
                    <td className="px-3 py-2">{r.type}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 text-[10px]">{r.status}</Badge>
                    </td>
                    <td className="px-3 py-2">{r.jurisdiction}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{r.hash}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{r.linkedContracts.join(", ")}</td>
                    <td className="px-3 py-2 text-[11px]">{r.expires ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 7. Compliance History */}
      <Card className="border-border/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm">Compliance History</CardTitle>
          <p className="text-[11px] text-muted-foreground">Verifications, issues, resolutions, consent changes</p>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <ul className="space-y-2">
            {creator.complianceHistory.map((h, i) => (
              <li key={i} className="flex gap-3 text-[12px] border-b border-border/20 pb-2 last:border-0">
                <span className="font-mono text-muted-foreground shrink-0 w-24">{h.date}</span>
                <span className="font-medium">{h.event}</span>
                <span className="text-muted-foreground">— {h.detail}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 8. Risk Assessment */}
      <Card className="border-border/40">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" /> Risk Assessment</CardTitle>
          <p className="text-[11px] text-muted-foreground">Last assessed: {creator.riskAssessment.lastAssessed}</p>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={cn("text-[11px]", creator.riskAssessment.level === "Low" && "bg-emerald-500/15", creator.riskAssessment.level === "Medium" && "bg-amber-500/15", creator.riskAssessment.level === "High" && "bg-red-500/15")}>
              {creator.riskAssessment.level} risk
            </Badge>
          </div>
          <ul className="space-y-1 text-[11px] text-muted-foreground">
            {creator.riskAssessment.factors.map((f, i) => (
              <li key={i} className="flex gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
