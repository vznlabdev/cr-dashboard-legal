"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  ListChecks,
  Inbox,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePageTitle } from "@/hooks/usePageTitle"

type ApprovalType = "Contract" | "Amendment" | "Output" | "Renewal" | "Consent"
type Decision = "Approved" | "Rejected" | "Pending"

interface ApprovalRecord {
  id: string
  date: string
  type: ApprovalType
  reference: string
  name: string
  reviewer: string
  decision: Decision
  notes: string
  decisionRationale?: string
  conditions?: string[]
  linkedContractId?: string
  complianceImpact?: string
}

const MOCK_APPROVALS: ApprovalRecord[] = [
  {
    id: "a1",
    date: "2025-02-08",
    type: "Contract",
    reference: "CR-2024-245-NIKE",
    name: "Nike Summer Campaign 2025",
    reviewer: "Sarah Legal",
    decision: "Approved",
    notes: "Standard NILP terms.",
    decisionRationale: "Terms align with approved NILP template. Jurisdictions (US, Canada) verified. No material changes from prior drafts.",
    conditions: ["Usage limited to approved media list", "AI disclosure must appear in final creative"],
    linkedContractId: "CR-2024-245-NIKE",
    complianceImpact: "Low. NIL consent on file; AI disclosure clause included. NY/CA/TX coverage confirmed.",
  },
  {
    id: "a2",
    date: "2025-02-07",
    type: "Amendment",
    reference: "CR-2024-203-SAMSUNG-AM1",
    name: "Samsung — Territory extension",
    reviewer: "Sarah Legal",
    decision: "Approved",
    notes: "EU/UK add-on; fee unchanged.",
    decisionRationale: "Amendment adds EU/UK territory only. Fee and other terms unchanged. EU AI Act disclosure language added.",
    conditions: ["EU AI Act disclosure to be included in localized creatives"],
    linkedContractId: "CR-2024-203-SAMSUNG",
    complianceImpact: "Medium. EU AI Act disclosure required for EU/UK distribution. Evidence to be retained.",
  },
  {
    id: "a3",
    date: "2025-02-06",
    type: "Output",
    reference: "OUT-2025-089",
    name: "Q1 Social Bundle — Brand A",
    reviewer: "James Counsel",
    decision: "Rejected",
    notes: "Missing jurisdiction sign-off.",
    decisionRationale: "Output package references TX distribution but jurisdiction sign-off for TX is not on file. Cannot approve until TX consent is obtained.",
    linkedContractId: "CR-2024-267-COKE",
    complianceImpact: "High. TX consent missing. Approval would create compliance gap.",
  },
  {
    id: "a4",
    date: "2025-02-05",
    type: "Renewal",
    reference: "REN-2025-012",
    name: "Annual renewal — Partner Co",
    reviewer: "Sarah Legal",
    decision: "Pending",
    notes: "Awaiting final pricing.",
    decisionRationale: undefined,
    conditions: undefined,
    linkedContractId: "CR-2024-189-TOYOTA",
    complianceImpact: "Low. Prior contract compliant; renewal terms under review.",
  },
  {
    id: "a5",
    date: "2025-02-04",
    type: "Consent",
    reference: "CON-2025-033",
    name: "Talent consent — New media use",
    reviewer: "James Counsel",
    decision: "Approved",
    notes: "Explicit consent on file.",
    decisionRationale: "Signed consent covers the proposed media use. No additional conditions.",
    linkedContractId: "CR-2024-245-NIKE",
    complianceImpact: "Low. Consent documentation complete.",
  },
  {
    id: "a6",
    date: "2025-02-03",
    type: "Contract",
    reference: "CR-2024-178-APPLE",
    name: "Apple Holiday 2024",
    reviewer: "Sarah Legal",
    decision: "Rejected",
    notes: "Indemnity scope too broad.",
    decisionRationale: "Indemnity clause extends beyond standard. Requested revision to align with approved template; resubmission expected.",
    linkedContractId: "CR-2024-178-APPLE",
    complianceImpact: "Medium. Contract terms must be revised before execution.",
  },
  {
    id: "a7",
    date: "2025-02-02",
    type: "Amendment",
    reference: "CR-2024-203-SAMSUNG-AM2",
    name: "Samsung — Fee adjustment",
    reviewer: "James Counsel",
    decision: "Approved",
    notes: "Fee increase within policy.",
    decisionRationale: "Fee increase within approved band. No change to rights or term.",
    conditions: undefined,
    linkedContractId: "CR-2024-203-SAMSUNG",
    complianceImpact: "None. Financial amendment only.",
  },
  {
    id: "a8",
    date: "2025-02-01",
    type: "Output",
    reference: "OUT-2025-076",
    name: "Website hero — Brand B",
    reviewer: "Sarah Legal",
    decision: "Pending",
    notes: "In review.",
    linkedContractId: "CR-2024-203-SAMSUNG",
    complianceImpact: "Under review.",
  },
]

function DecisionBadge({ decision }: { decision: Decision }) {
  const config = {
    Approved: { icon: CheckCircle2, label: "Approved", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", symbol: "✅" },
    Rejected: { icon: XCircle, label: "Rejected", className: "bg-destructive/15 text-destructive border-destructive/30", symbol: "❌" },
    Pending: { icon: Clock, label: "Pending", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30", symbol: "⏳" },
  }
  const c = config[decision]
  return (
    <Badge variant="outline" className={cn("text-xs font-medium gap-1", c.className)}>
      <span>{c.symbol}</span>
      <span>{c.label}</span>
    </Badge>
  )
}

export default function ApprovalsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")

  const filtered = useMemo(() => {
    if (activeTab === "all") return MOCK_APPROVALS
    return MOCK_APPROVALS.filter((a) => a.decision.toLowerCase() === activeTab)
  }, [activeTab])

  const counts = { approved: 342, pending: 18, rejected: 12, thisMonth: 28 }
  usePageTitle("Approvals")

  return (
    <PageContainer className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground mt-1">Legal approval history and pending decisions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold mt-1">{counts.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1">{counts.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
            <p className="text-2xl font-bold mt-1">{counts.rejected}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <p className="text-2xl font-bold mt-1">{counts.thisMonth}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <div className="overflow-x-auto min-w-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Inbox className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-foreground">No approvals in this category</p>
                  <p className="text-xs text-muted-foreground mt-1">Switch to another tab to see more.</p>
                </div>
              ) : (
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-9" />
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        className={cn(
                          "cursor-pointer hover:bg-muted/50",
                          expandedId === row.id && "bg-muted/50"
                        )}
                        onClick={() => setExpandedId((id) => (id === row.id ? null : row.id))}
                      >
                        <TableCell className="w-9 py-2">
                          {expandedId === row.id ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm whitespace-nowrap">{row.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {row.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{row.reference}</TableCell>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-muted-foreground">{row.reviewer}</TableCell>
                        <TableCell>
                          <DecisionBadge decision={row.decision} />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                          {row.notes}
                        </TableCell>
                      </TableRow>
                      {expandedId === row.id && (
                        <TableRow key={`${row.id}-expanded`} className="bg-muted/30 hover:bg-muted/30">
                          <TableCell colSpan={8} className="p-0">
                            <div className="px-4 py-4 space-y-4 text-sm border-t border-border/50">
                              {row.decisionRationale && (
                                <div className="flex gap-3">
                                  <div className="flex items-start gap-2 text-muted-foreground shrink-0 mt-0.5">
                                    <ListChecks className="h-4 w-4" />
                                    <span className="font-medium text-foreground min-w-[120px]">Decision rationale</span>
                                  </div>
                                  <p className="text-muted-foreground">{row.decisionRationale}</p>
                                </div>
                              )}
                              {row.conditions && row.conditions.length > 0 && (
                                <div className="flex gap-3">
                                  <div className="flex items-start gap-2 text-muted-foreground shrink-0 mt-0.5">
                                    <ListChecks className="h-4 w-4" />
                                    <span className="font-medium text-foreground min-w-[120px]">Conditions</span>
                                  </div>
                                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                    {row.conditions.map((c, i) => (
                                      <li key={i}>{c}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {row.linkedContractId && (
                                <div className="flex gap-3">
                                  <div className="flex items-start gap-2 text-muted-foreground shrink-0 mt-0.5">
                                    <FileText className="h-4 w-4" />
                                    <span className="font-medium text-foreground min-w-[120px]">Linked contract</span>
                                  </div>
                                  <Link
                                    href={`/contracts/${row.linkedContractId}`}
                                    className="font-mono text-primary hover:underline"
                                  >
                                    {row.linkedContractId}
                                  </Link>
                                </div>
                              )}
                              {row.complianceImpact !== undefined && (
                                <div className="flex gap-3">
                                  <div className="flex items-start gap-2 text-muted-foreground shrink-0 mt-0.5">
                                    <Shield className="h-4 w-4" />
                                    <span className="font-medium text-foreground min-w-[120px]">Compliance impact</span>
                                  </div>
                                  <p className="text-muted-foreground">{row.complianceImpact}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
