"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { PageContainer } from "@/components/layout/PageContainer"
import { MetricStrip } from "@/components/compliance/MetricStrip"
import {
  Search,
  ChevronRight,
  ExternalLink,
  Inbox,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PRIMARY_CREATOR } from "@/lib/legal-mock-data"
import { usePageTitle } from "@/hooks/usePageTitle"

// --- Types ---
type CreatorType = "Actor" | "Model" | "Voice" | "Athlete"
type RightsStatus = "Full" | "Partial" | "Pending"
type RiskLevel = "Low" | "Medium" | "High"

interface CreatorRow {
  id: string
  name: string
  type: CreatorType
  activeContracts: number
  rightsStatus: RightsStatus
  nilp: { n: boolean; i: boolean; l: boolean; p: boolean }
  aclarStatus: string
  lastVerified: string
  riskLevel: RiskLevel
  contracts: { id: string; contractId: string; title: string; brand: string; status: string }[]
  exclusivityConflicts: string[]
  jurisdictionCoverage: string[]
  aclarRecords: { id: string; type: string; status: string; expires?: string }[]
}

// --- Mock data: Michael Chen (Actor) primary + contract sample creators ---
const MOCK_CREATORS: CreatorRow[] = [
  {
    id: PRIMARY_CREATOR.id,
    name: PRIMARY_CREATOR.name,
    type: "Actor",
    activeContracts: 3,
    rightsStatus: "Full",
    nilp: { n: true, i: true, l: true, p: true },
    aclarStatus: "Verified",
    lastVerified: "2025-02-01",
    riskLevel: "Low",
    contracts: [
      { id: "c1", contractId: "CR-2024-245-NIKE", title: "Nike Summer Campaign 2025", brand: "Nike", status: "Active" },
      { id: "c2", contractId: "CR-2024-203-SAMSUNG", title: "Samsung Global Campaign", brand: "Samsung", status: "Active" },
      { id: "c3", contractId: "CR-2024-267-COKE", title: "Coca-Cola Holiday Spot", brand: "Coca-Cola", status: "Active" },
    ],
    exclusivityConflicts: [],
    jurisdictionCoverage: ["United States", "Canada", "UK"],
    aclarRecords: [
      { id: "aclar-1", type: "NIL", status: "Verified", expires: "2026-01-15" },
      { id: "aclar-2", type: "AI Content", status: "Verified", expires: "2025-12-01" },
    ],
  },
  {
    id: "cr-sarah-johnson",
    name: "Sarah Johnson",
    type: "Model",
    activeContracts: 2,
    rightsStatus: "Full",
    nilp: { n: true, i: true, l: true, p: true },
    aclarStatus: "Verified",
    lastVerified: "2025-01-28",
    riskLevel: "Low",
    contracts: [
      { id: "c4", contractId: "CR-2024-245-NIKE", title: "Nike Spring Campaign 2025", brand: "Nike", status: "Active" },
      { id: "c5", contractId: "CR-2024-203-SAMSUNG", title: "Samsung Global Campaign", brand: "Samsung", status: "Active" },
    ],
    exclusivityConflicts: [],
    jurisdictionCoverage: ["United States", "Global"],
    aclarRecords: [{ id: "aclar-3", type: "NIL", status: "Verified", expires: "2025-06-30" }],
  },
  {
    id: "cr-alex-chen",
    name: "Alex Chen",
    type: "Voice",
    activeContracts: 2,
    rightsStatus: "Partial",
    nilp: { n: true, i: true, l: true, p: false },
    aclarStatus: "Pending review",
    lastVerified: "2025-01-15",
    riskLevel: "Medium",
    contracts: [
      { id: "c6", contractId: "CR-2024-203-SAMSUNG", title: "Samsung Tech Launch", brand: "Samsung", status: "Active" },
      { id: "c7", contractId: "CR-2024-178-APPLE", title: "Apple Holiday 2024", brand: "Apple", status: "Expiring" },
    ],
    exclusivityConflicts: ["Category overlap: Consumer Electronics (Samsung vs Apple)"],
    jurisdictionCoverage: ["United States", "UK", "EU"],
    aclarRecords: [{ id: "aclar-4", type: "NIL", status: "Pending", expires: "2025-03-01" }],
  },
  {
    id: "cr-jordan-williams",
    name: "Jordan Williams",
    type: "Athlete",
    activeContracts: 2,
    rightsStatus: "Full",
    nilp: { n: true, i: true, l: true, p: true },
    aclarStatus: "Verified",
    lastVerified: "2025-02-05",
    riskLevel: "Low",
    contracts: [
      { id: "c8", contractId: "CR-2024-245-NIKE", title: "Nike Summer Campaign", brand: "Nike", status: "Active" },
      { id: "c9", contractId: "CR-2023-156-ADIDAS", title: "Adidas Summer Collection", brand: "Adidas", status: "Active" },
    ],
    exclusivityConflicts: ["Non-exclusive sportswear; competitors noted (Nike, Adidas)"],
    jurisdictionCoverage: ["United States", "Global"],
    aclarRecords: [{ id: "aclar-5", type: "NIL", status: "Verified", expires: "2025-08-31" }],
  },
  {
    id: "cr-sam-davis",
    name: "Sam Davis",
    type: "Actor",
    activeContracts: 1,
    rightsStatus: "Full",
    nilp: { n: true, i: true, l: true, p: true },
    aclarStatus: "Verified",
    lastVerified: "2024-12-20",
    riskLevel: "Low",
    contracts: [
      { id: "c10", contractId: "CR-2024-267-COKE", title: "Coca-Cola Holiday 2024", brand: "Coca-Cola", status: "Expired" },
    ],
    exclusivityConflicts: [],
    jurisdictionCoverage: ["United States", "Canada"],
    aclarRecords: [{ id: "aclar-6", type: "NIL", status: "Expired" }],
  },
  {
    id: "cr-morgan-lee",
    name: "Morgan Lee",
    type: "Model",
    activeContracts: 1,
    rightsStatus: "Partial",
    nilp: { n: true, i: true, l: true, p: false },
    aclarStatus: "Verified",
    lastVerified: "2025-01-10",
    riskLevel: "Medium",
    contracts: [
      { id: "c11", contractId: "CR-2024-189-TOYOTA", title: "Toyota Holiday 2024", brand: "Toyota", status: "Expired" },
    ],
    exclusivityConflicts: [],
    jurisdictionCoverage: ["United States"],
    aclarRecords: [{ id: "aclar-7", type: "NIL", status: "Verified", expires: "2025-03-15" }],
  },
]

const pendingVerificationItems = [
  { id: "pv1", creator: "Alex Chen", issue: "Missing consent for AI Content use", contractId: "CR-2024-203-SAMSUNG", priority: "High" },
  { id: "pv2", creator: "Morgan Lee", issue: "Incomplete ACLAR record for new campaign", contractId: "CR-2024-189-TOYOTA", priority: "Medium" },
  { id: "pv3", creator: PRIMARY_CREATOR.name, issue: "Unverified likeness for streaming series", contractId: "CR-2024-267-COKE", priority: "Medium" },
]

const expiringConsents = [
  { id: "ec1", creator: "Alex Chen", type: "NIL", expiresIn: 22, contractId: "CR-2024-178-APPLE", recommendation: "Renew before campaign launch" },
  { id: "ec2", creator: "Morgan Lee", type: "NIL", expiresIn: 34, contractId: "CR-2024-189-TOYOTA", recommendation: "Coordinate with Toyota renewal" },
  { id: "ec3", creator: "Sarah Johnson", type: "NIL", expiresIn: 141, contractId: "CR-2024-245-NIKE", recommendation: "Schedule renewal 60 days before expiry" },
]

function NilpBadges({ nilp }: { nilp: CreatorRow["nilp"] }) {
  return (
    <span className="inline-flex gap-0.5 font-mono text-[11px]">
      <span className={nilp.n ? "text-foreground" : "text-muted-foreground/50"}>N</span>
      <span className="text-muted-foreground">·</span>
      <span className={nilp.i ? "text-foreground" : "text-muted-foreground/50"}>I</span>
      <span className="text-muted-foreground">·</span>
      <span className={nilp.l ? "text-foreground" : "text-muted-foreground/50"}>L</span>
      <span className="text-muted-foreground">·</span>
      <span className={nilp.p ? "text-foreground" : "text-muted-foreground/50"}>P</span>
    </span>
  )
}

export default function TalentRightsHubPage() {
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>("cr-michael-chen")

  const filteredCreators = search.trim()
    ? MOCK_CREATORS.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.type.toLowerCase().includes(search.toLowerCase())
      )
    : MOCK_CREATORS

  usePageTitle("Talent Rights")

  return (
    <PageContainer className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Talent Rights</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Talent rights verification, contract coverage, and consent tracking
        </p>
      </div>

      {/* Stats */}
      <MetricStrip
        metrics={[
          { label: "Active Creators", value: 47 },
          { label: "Verified Rights", value: 189 },
          { label: "Pending Verification", value: 12 },
          { label: "Expiring Consents", value: 8 },
        ]}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="border border-border/40 bg-muted/30 h-9 p-0.5">
          <TabsTrigger value="all" className="text-[12px] data-[state=active]:bg-background">All Creators</TabsTrigger>
          <TabsTrigger value="contracts" className="text-[12px] data-[state=active]:bg-background">Active Contracts</TabsTrigger>
          <TabsTrigger value="pending" className="text-[12px] data-[state=active]:bg-background">Pending Verification</TabsTrigger>
          <TabsTrigger value="expiring" className="text-[12px] data-[state=active]:bg-background">Expiring Consents</TabsTrigger>
        </TabsList>

        {/* Search for All Creators */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search creators..."
              className="pl-8 h-8 text-[12px] border-border/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* All Creators tab */}
        <TabsContent value="all" className="space-y-0">
          <Card className="border-border/40 overflow-hidden">
            <div className="overflow-x-auto min-w-0">
              {filteredCreators.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Inbox className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-foreground">No creators match your search</p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>
                </div>
              ) : (
              <table className="w-full text-[12px] min-w-[800px]">
                <thead>
                  <tr className="text-muted-foreground text-left border-b border-border/40 bg-muted/30">
                    <th className="w-8 px-2 py-2"></th>
                    <th className="px-3 py-2 font-medium">Creator Name</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium text-center">Active Contracts</th>
                    <th className="px-3 py-2 font-medium">Talent Rights Status</th>
                    <th className="px-3 py-2 font-medium">Verified (N·I·L·P)</th>
                    <th className="px-3 py-2 font-medium">Consent (ACLAR)</th>
                    <th className="px-3 py-2 font-medium">Last Verified</th>
                    <th className="px-3 py-2 font-medium">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCreators.map((creator) => (
                    <Collapsible
                      key={creator.id}
                      open={expandedId === creator.id}
                      onOpenChange={(open) => setExpandedId(open ? creator.id : null)}
                    >
                      <tr className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                        <td className="w-8 px-2 py-2">
                          <CollapsibleTrigger asChild>
                            <button className="p-0.5 rounded hover:bg-muted/50">
                              <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", expandedId === creator.id && "rotate-90")} />
                            </button>
                          </CollapsibleTrigger>
                        </td>
                        <td className="px-3 py-2 font-medium">
                          <Link href={`/talent-rights/${creator.id}`} className="text-primary hover:underline">{creator.name}</Link>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{creator.type}</td>
                        <td className="px-3 py-2 text-center font-mono">{creator.activeContracts}</td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className={cn("text-[10px]", creator.rightsStatus === "Full" && "bg-emerald-500/15 text-emerald-600", creator.rightsStatus === "Partial" && "bg-amber-500/15 text-amber-600", creator.rightsStatus === "Pending" && "bg-slate-500/15 text-slate-600")}>
                            {creator.rightsStatus}
                          </Badge>
                        </td>
                        <td className="px-3 py-2"><NilpBadges nilp={creator.nilp} /></td>
                        <td className="px-3 py-2 text-[11px]">{creator.aclarStatus}</td>
                        <td className="px-3 py-2 font-mono text-[11px]">{creator.lastVerified}</td>
                        <td className="px-3 py-2">
                          <Badge variant="outline" className={cn("text-[10px]", creator.riskLevel === "Low" && "bg-emerald-500/15", creator.riskLevel === "Medium" && "bg-amber-500/15", creator.riskLevel === "High" && "bg-red-500/15")}>
                            {creator.riskLevel}
                          </Badge>
                        </td>
                      </tr>
                      <CollapsibleContent asChild>
                        <tr>
                          <td colSpan={9} className="p-0 bg-muted/20">
                            <div className="px-4 py-3 space-y-3 text-[11px] border-t border-border/20">
                              <div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Active contracts</div>
                                <ul className="space-y-0.5">
                                  {creator.contracts.map((c) => (
                                    <li key={c.id} className="flex items-center gap-2">
                                      <Link href={`/contracts/${c.contractId}`} className="text-primary hover:underline font-mono">{c.contractId}</Link>
                                      <span>{c.title}</span>
                                      <span className="text-muted-foreground">· {c.brand}</span>
                                      <Badge variant="secondary" className="text-[9px]">{c.status}</Badge>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {creator.exclusivityConflicts.length > 0 && (
                                <div>
                                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Exclusivity conflicts</div>
                                  <ul className="list-disc list-inside text-amber-600 dark:text-amber-400">
                                    {creator.exclusivityConflicts.map((x, i) => (
                                      <li key={i}>{x}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Jurisdiction coverage</div>
                                <p>{creator.jurisdictionCoverage.join(", ")}</p>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">ACLAR consent records</div>
                                <ul className="space-y-0.5">
                                  {creator.aclarRecords.map((r) => (
                                    <li key={r.id} className="flex items-center gap-2">
                                      <span className="font-mono">{r.id}</span>
                                      <span>{r.type}</span>
                                      <Badge variant="outline" className="text-[9px]">{r.status}</Badge>
                                      {r.expires && <span className="text-muted-foreground">Expires: {r.expires}</span>}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Active Contracts tab — grouped by creator */}
        <TabsContent value="contracts" className="space-y-4">
          {MOCK_CREATORS.filter((c) => c.contracts.some((x) => x.status === "Active")).map((creator) => (
            <Card key={creator.id} className="border-border/40">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm"><Link href={`/talent-rights/${creator.id}`} className="text-primary hover:underline">{creator.name}</Link> · {creator.type}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <ul className="space-y-2">
                  {creator.contracts.filter((c) => c.status === "Active").map((contract) => (
                    <li key={contract.id} className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2 text-[12px]">
                      <div>
                        <Link href={`/contracts/${contract.contractId}`} className="font-mono text-primary hover:underline">{contract.contractId}</Link>
                        <span className="ml-2">{contract.title}</span>
                        <span className="text-muted-foreground ml-2">· {contract.brand}</span>
                      </div>
                      <NilpBadges nilp={creator.nilp} />
                      <Button variant="ghost" size="sm" className="h-7 text-[11px]" asChild>
                        <Link href={`/contracts/${contract.contractId}`}>View contract <ExternalLink className="h-3 w-3 ml-1" /></Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Pending Verification tab */}
        <TabsContent value="pending" className="space-y-3">
          <Card className="border-border/40">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">Items needing legal review</CardTitle>
              <p className="text-[11px] text-muted-foreground">Missing consents, unverified rights, incomplete ACLAR records</p>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <ul className="space-y-2">
                {pendingVerificationItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2">
                    <div className="text-[12px]">
                      <span className="font-medium">{item.creator}</span>
                      <span className="text-muted-foreground"> · {item.issue}</span>
                      <span className="font-mono text-[11px] text-muted-foreground ml-2">{item.contractId}</span>
                    </div>
                    <Badge variant={item.priority === "High" ? "destructive" : "secondary"} className="text-[10px]">{item.priority}</Badge>
                    <Button variant="outline" size="sm" className="h-7 text-[11px]" asChild>
                      <Link href={`/contracts/${item.contractId}`}>Review</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expiring Consents tab */}
        <TabsContent value="expiring" className="space-y-3">
          <Card className="border-border/40">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm">Consents expiring within 30 / 60 / 90 days</CardTitle>
              <p className="text-[11px] text-muted-foreground">Renewal recommendations</p>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <ul className="space-y-2">
                {expiringConsents.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2">
                    <div className="text-[12px]">
                      <span className="font-medium">{item.creator}</span>
                      <span className="text-muted-foreground"> · {item.type}</span>
                      <span className="font-mono text-[11px] ml-2">{item.contractId}</span>
                      <span className={item.expiresIn <= 30 ? "text-amber-600 dark:text-amber-400 font-medium ml-2" : "text-muted-foreground ml-2"}>
                        {item.expiresIn} days
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground max-w-xs truncate">{item.recommendation}</p>
                    <Button variant="outline" size="sm" className="h-7 text-[11px]" asChild>
                      <Link href={`/contracts/${item.contractId}`}>View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
