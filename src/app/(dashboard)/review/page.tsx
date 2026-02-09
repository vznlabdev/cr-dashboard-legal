"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Filter,
  Download,
  CircleAlert,
  CircleDot,
  CircleCheck,
  FileText,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Send,
  AlertTriangle,
  Inbox,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { usePageTitle } from "@/hooks/usePageTitle"
import { CREATOR_NAME_TO_ID } from "@/lib/legal-mock-data"

type Priority = "high" | "medium" | "low"
type ItemType = "Contract" | "Amendment" | "Output" | "Renewal"
type ReviewStatus = "Pending" | "In Review" | "Approved" | "Rejected"

interface ReviewItem {
  id: string
  priority: Priority
  itemType: ItemType
  referenceId: string
  name: string
  creator: string
  brand: string
  submittedDate: string
  assignedTo: string
  status: ReviewStatus
  dueDate: string
  contractId?: string
  parties?: string
  keyTerms?: string
  complianceChecklist: { label: string; done: boolean }[]
  talentRightsStatus: string
  jurisdictionRequirements: string[]
  riskAssessment: string
  documentCount: number
  history: { date: string; actor: string; action: string; comment?: string }[]
}

const MOCK_ITEMS: ReviewItem[] = [
  {
    id: "r1",
    priority: "high",
    itemType: "Contract",
    referenceId: "CR-2024-245-NIKE",
    name: "Nike Summer Campaign 2025",
    creator: "Michael Chen",
    brand: "Nike",
    submittedDate: "2025-02-05",
    assignedTo: "Sarah Legal",
    status: "In Review",
    dueDate: "2025-02-12",
    contractId: "CR-2024-245-NIKE",
    parties: "Nike, Inc. · Talent Partners LLC",
    keyTerms: "NILP full grant, US + Canada, 6 months, $15K",
    complianceChecklist: [
      { label: "NIL consent on file", done: true },
      { label: "AI disclosure clause", done: true },
      { label: "Jurisdiction coverage verified", done: false },
    ],
    talentRightsStatus: "Verified (N·I·L·P)",
    jurisdictionRequirements: ["NY", "CA", "TX"],
    riskAssessment: "Low — standard NILP terms.",
    documentCount: 4,
    history: [
      { date: "2025-02-05", actor: "System", action: "Submitted for legal review" },
      { date: "2025-02-06", actor: "Sarah Legal", action: "Review started", comment: "Checking jurisdiction coverage." },
    ],
  },
  {
    id: "r2",
    priority: "high",
    itemType: "Amendment",
    referenceId: "CR-2024-203-SAMSUNG-AM1",
    name: "Samsung — Territory extension",
    creator: "Sarah Johnson",
    brand: "Samsung",
    submittedDate: "2025-02-04",
    assignedTo: "Unassigned",
    status: "Pending",
    dueDate: "2025-02-11",
    contractId: "CR-2024-203-SAMSUNG",
    parties: "Samsung Electronics · Creative Studios Inc.",
    keyTerms: "Add EU/UK to territory; no change to fee.",
    complianceChecklist: [
      { label: "Original contract compliant", done: true },
      { label: "EU AI Act disclosure", done: false },
    ],
    talentRightsStatus: "NIL verified; AI Content consent pending EU",
    jurisdictionRequirements: ["EU", "UK"],
    riskAssessment: "Medium — new jurisdictions require disclosure updates.",
    documentCount: 2,
    history: [{ date: "2025-02-04", actor: "System", action: "Amendment submitted" }],
  },
  {
    id: "r3",
    priority: "medium",
    itemType: "Output",
    referenceId: "OUT-2025-0892",
    name: "Coca-Cola Holiday Spot — Final Cut",
    creator: "Michael Chen",
    brand: "Coca-Cola",
    submittedDate: "2025-02-03",
    assignedTo: "James Counsel",
    status: "Approved",
    dueDate: "2025-02-10",
    contractId: "CR-2024-267-COKE",
    parties: "Coca-Cola Company · Talent Partners",
    keyTerms: "Video output under CR-2024-0891; US broadcast.",
    complianceChecklist: [
      { label: "Asset tagged AI-generated", done: true },
      { label: "NIL consent matches talent", done: true },
      { label: "NY disclosure applied", done: true },
    ],
    talentRightsStatus: "Verified",
    jurisdictionRequirements: ["NY"],
    riskAssessment: "Low",
    documentCount: 1,
    history: [
      { date: "2025-02-03", actor: "System", action: "Output submitted" },
      { date: "2025-02-07", actor: "James Counsel", action: "Approved", comment: "Clear." },
    ],
  },
  {
    id: "r4",
    priority: "low",
    itemType: "Renewal",
    referenceId: "CR-2024-0722-REN",
    name: "Toyota Brand Refresh — Renewal",
    creator: "Jordan Williams",
    brand: "Toyota",
    submittedDate: "2025-02-02",
    assignedTo: "Sarah Legal",
    status: "Rejected",
    dueDate: "2025-02-09",
    contractId: "CR-2024-189-TOYOTA",
    parties: "Toyota Motor Corp · Agency",
    keyTerms: "12-month renewal; terms unchanged.",
    complianceChecklist: [
      { label: "Current contract in good standing", done: false },
      { label: "Outstanding compliance issues", done: false },
    ],
    talentRightsStatus: "Expired consent on file",
    jurisdictionRequirements: ["CA", "IL"],
    riskAssessment: "High — resolve compliance before renewal.",
    documentCount: 3,
    history: [
      { date: "2025-02-02", actor: "System", action: "Renewal submitted" },
      { date: "2025-02-08", actor: "Sarah Legal", action: "Rejected", comment: "Address compliance items first." },
    ],
  },
  {
    id: "r5",
    priority: "medium",
    itemType: "Contract",
    referenceId: "CR-2025-0018",
    name: "Samsung Brand Endorsement",
    creator: "Alex Chen",
    brand: "Samsung",
    submittedDate: "2025-02-06",
    assignedTo: "Unassigned",
    status: "Pending",
    dueDate: "2025-02-14",
    contractId: "CR-2025-0018",
    parties: "Samsung Electronics · Alex Chen",
    keyTerms: "N·I·L; Consumer Electronics category; 6 months.",
    complianceChecklist: [
      { label: "NIL consent on file", done: true },
      { label: "Category exclusivity check", done: false },
    ],
    talentRightsStatus: "Pending verification",
    jurisdictionRequirements: ["US", "Global"],
    riskAssessment: "Medium — category overlap review needed.",
    documentCount: 5,
    history: [{ date: "2025-02-06", actor: "System", action: "Submitted for legal review" }],
  },
  {
    id: "r6",
    priority: "high",
    itemType: "Output",
    referenceId: "OUT-2025-0101",
    name: "Nike — Social assets batch",
    creator: "Michael Chen",
    brand: "Nike",
    submittedDate: "2025-02-07",
    assignedTo: "James Counsel",
    status: "Pending",
    dueDate: "2025-02-13",
    contractId: "CR-2024-245-NIKE",
    parties: "Nike · Talent",
    keyTerms: "Social only; AI-generated imagery.",
    complianceChecklist: [
      { label: "AI disclosure on assets", done: false },
      { label: "Platform policy (Meta/TikTok)", done: false },
    ],
    talentRightsStatus: "Verified",
    jurisdictionRequirements: ["NY", "CA"],
    riskAssessment: "Medium — add disclosure tags before approval.",
    documentCount: 8,
    history: [{ date: "2025-02-07", actor: "System", action: "Output batch submitted" }],
  },
]

const PRIORITY_ICON: Record<Priority, React.ReactNode> = {
  high: <span title="High"><CircleAlert className="h-4 w-4 text-red-500" /></span>,
  medium: <span title="Medium"><CircleDot className="h-4 w-4 text-amber-500" /></span>,
  low: <span title="Low"><CircleCheck className="h-4 w-4 text-emerald-500" /></span>,
}

const STATUS_STYLE: Record<ReviewStatus, string> = {
  Pending: "bg-slate-500/10 text-slate-700",
  "In Review": "bg-amber-500/10 text-amber-700",
  Approved: "bg-emerald-500/10 text-emerald-700",
  Rejected: "bg-red-500/10 text-red-700",
}

type SortKey = "priority" | "dueDate" | "submittedDate"

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export default function LegalReviewQueuePage() {
  const [tab, setTab] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("dueDate")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [newNote, setNewNote] = useState("")

  const stats = useMemo(() => {
    const pending = MOCK_ITEMS.filter((i) => i.status === "Pending").length
    const inReview = MOCK_ITEMS.filter((i) => i.status === "In Review").length
    const approvedToday = MOCK_ITEMS.filter((i) => i.status === "Approved").length
    const rejected = MOCK_ITEMS.filter((i) => i.status === "Rejected").length
    return { pending: 24, inReview: 8, approvedToday: 12, rejected: 2 }
  }, [])

  const tabCounts = useMemo(() => {
    const all = MOCK_ITEMS.length
    const contracts = MOCK_ITEMS.filter((i) => i.itemType === "Contract").length
    const amendments = MOCK_ITEMS.filter((i) => i.itemType === "Amendment").length
    const outputs = MOCK_ITEMS.filter((i) => i.itemType === "Output").length
    const renewals = MOCK_ITEMS.filter((i) => i.itemType === "Renewal").length
    return { all: 34, contracts: 15, amendments: 6, outputs: 8, renewals: 5 }
  }, [])

  const filteredItems = useMemo(() => {
    let list = [...MOCK_ITEMS]
    if (tab === "contracts") list = list.filter((i) => i.itemType === "Contract")
    else if (tab === "amendments") list = list.filter((i) => i.itemType === "Amendment")
    else if (tab === "outputs") list = list.filter((i) => i.itemType === "Output")
    else if (tab === "renewals") list = list.filter((i) => i.itemType === "Renewal")
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === "priority") cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      else if (sortKey === "dueDate") cmp = a.dueDate.localeCompare(b.dueDate)
      else if (sortKey === "submittedDate") cmp = a.submittedDate.localeCompare(b.submittedDate)
      return sortDir === "asc" ? cmp : -cmp
    })
    return list
  }, [tab, sortKey, sortDir])

  function openDetail(item: ReviewItem) {
    setSelectedItem(item)
    setSheetOpen(true)
    setNewNote("")
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else setSortKey(key)
  }

  function handleApprove() {
    toast.success("Marked as Approved")
    setSheetOpen(false)
  }
  function handleReject() {
    toast.error("Marked as Rejected")
    setSheetOpen(false)
  }
  function handleRequestChanges() {
    toast.info("Request changes sent")
  }
  function handleEscalate() {
    toast.info("Escalated")
  }
  function handleAddNote() {
    if (!newNote.trim()) return
    toast.success("Note added")
    setNewNote("")
  }

  usePageTitle("Legal Review Queue")

  return (
    <PageContainer className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Legal Review Queue</h1>
          <p className="text-muted-foreground mt-1">Contracts and assets pending legal review</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[12px]">
            <Filter className="h-3.5 w-3.5 mr-1" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => toast.success("Export started")}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/40">
          <CardContent className="pt-4 pb-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pending Review</div>
            <div className="text-2xl font-semibold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-4 pb-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">In Review</div>
            <div className="text-2xl font-semibold">{stats.inReview}</div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-4 pb-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Approved Today</div>
            <div className="text-2xl font-semibold text-emerald-600">{stats.approvedToday}</div>
          </CardContent>
        </Card>
        <Card className="border-border/40">
          <CardContent className="pt-4 pb-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Rejected</div>
            <div className="text-2xl font-semibold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="h-9 border border-border/40 bg-muted/30 p-0.5">
          <TabsTrigger value="all" className="text-[12px] px-3 data-[state=active]:bg-background">
            All ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="contracts" className="text-[12px] px-3 data-[state=active]:bg-background">
            Contracts ({tabCounts.contracts})
          </TabsTrigger>
          <TabsTrigger value="amendments" className="text-[12px] px-3 data-[state=active]:bg-background">
            Amendments ({tabCounts.amendments})
          </TabsTrigger>
          <TabsTrigger value="outputs" className="text-[12px] px-3 data-[state=active]:bg-background">
            Outputs ({tabCounts.outputs})
          </TabsTrigger>
          <TabsTrigger value="renewals" className="text-[12px] px-3 data-[state=active]:bg-background">
            Renewals ({tabCounts.renewals})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-0">
          <Card className="border-border/40">
            <div className="overflow-x-auto min-w-0">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <Inbox className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium text-foreground">No items match the current filter</p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different tab or clear filters.</p>
                </div>
              ) : (
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="border-b border-border/40">
                    <TableHead
                      className="w-[44px] text-[11px] font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={() => toggleSort("priority")}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        Priority
                        {sortKey === "priority" && (sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                      </span>
                    </TableHead>
                    <TableHead className="text-[11px] font-medium text-muted-foreground">Item Type</TableHead>
                    <TableHead className="text-[11px] font-medium text-muted-foreground">Reference ID</TableHead>
                    <TableHead className="text-[11px] font-medium text-muted-foreground">Name</TableHead>
                    <TableHead className="text-[11px] font-medium text-muted-foreground">Creator</TableHead>
                    <TableHead className="text-[11px] font-medium text-muted-foreground">Brand</TableHead>
                    <TableHead
                      className="text-[11px] font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={() => toggleSort("submittedDate")}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        Submitted
                        {sortKey === "submittedDate" && (sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                      </span>
                    </TableHead>
                    <TableHead className="text-[11px] font-medium text-muted-foreground">Assigned To</TableHead>
                    <TableHead className="text-[11px] font-medium text-muted-foreground">Status</TableHead>
                    <TableHead
                      className="text-[11px] font-medium text-muted-foreground cursor-pointer select-none"
                      onClick={() => toggleSort("dueDate")}
                    >
                      <span className="inline-flex items-center gap-0.5">
                        Due Date
                        {sortKey === "dueDate" && (sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-border/20 hover:bg-muted/30 cursor-pointer"
                      onClick={() => openDetail(item)}
                    >
                      <TableCell className="py-2">{PRIORITY_ICON[item.priority]}</TableCell>
                      <TableCell className="py-2 text-[12px]">{item.itemType}</TableCell>
                      <TableCell className="py-2 font-mono text-[11px]">
                        {item.contractId ? (
                          <Link href={`/contracts/${item.contractId}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                            {item.referenceId}
                          </Link>
                        ) : (
                          item.referenceId
                        )}
                      </TableCell>
                      <TableCell className="py-2 text-[12px] font-medium">{item.name}</TableCell>
                      <TableCell className="py-2 text-[12px] text-muted-foreground">
                        {CREATOR_NAME_TO_ID[item.creator] ? (
                          <Link href={`/talent-rights/${CREATOR_NAME_TO_ID[item.creator]}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                            {item.creator}
                          </Link>
                        ) : (
                          item.creator
                        )}
                      </TableCell>
                      <TableCell className="py-2 text-[12px]">{item.brand}</TableCell>
                      <TableCell className="py-2 font-mono text-[11px] text-muted-foreground">{item.submittedDate}</TableCell>
                      <TableCell className="py-2 text-[12px] text-muted-foreground">{item.assignedTo}</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLE[item.status])}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 font-mono text-[11px] text-muted-foreground">{item.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base">{selectedItem?.referenceId} — {selectedItem?.name}</SheetTitle>
            <SheetDescription>{selectedItem?.itemType} · {selectedItem?.brand}</SheetDescription>
          </SheetHeader>
          {selectedItem && (
            <div className="space-y-5 pb-8">
              {/* Item summary */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Item summary</h4>
                <div className="rounded-md border border-border/40 p-3 text-[12px] space-y-1">
                  <p><span className="text-muted-foreground">Type:</span> {selectedItem.itemType}</p>
                  <p><span className="text-muted-foreground">Parties:</span> {selectedItem.parties}</p>
                  <p><span className="text-muted-foreground">Key terms:</span> {selectedItem.keyTerms}</p>
                </div>
              </div>

              {/* Compliance checklist */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Compliance checklist</h4>
                <ul className="space-y-1.5 text-[12px]">
                  {selectedItem.complianceChecklist.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {c.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <CircleDot className="h-4 w-4 text-amber-500 shrink-0" />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Talent rights */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Talent rights verification</h4>
                <p className="text-[12px]">{selectedItem.talentRightsStatus}</p>
              </div>

              {/* Jurisdiction requirements */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Jurisdiction requirements</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedItem.jurisdictionRequirements.map((j) => (
                    <Badge key={j} variant="secondary" className="text-[10px]">{j}</Badge>
                  ))}
                </div>
              </div>

              {/* Risk assessment */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Risk assessment</h4>
                <p className="text-[12px] flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  {selectedItem.riskAssessment}
                </p>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Documents</h4>
                <p className="text-[12px] text-muted-foreground">{selectedItem.documentCount} document(s) attached.</p>
                <Button variant="outline" size="sm" className="h-7 text-[11px] mt-1">
                  <FileText className="h-3.5 w-3.5 mr-1" /> View documents
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
                <Button size="sm" className="h-8 text-[11px] bg-emerald-600 hover:bg-emerald-700" onClick={handleApprove}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="h-8 text-[11px]" onClick={handleReject}>
                  Reject
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={handleRequestChanges}>
                  Request Changes
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={handleEscalate}>
                  Escalate
                </Button>
              </div>

              {/* Add note */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Add note</h4>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a review note or comment..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[60px] text-[12px] resize-none"
                  />
                  <Button size="sm" className="h-8 shrink-0" onClick={handleAddNote}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Review history */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> Review history
                </h4>
                <ul className="space-y-2 text-[11px] border-l-2 border-border/40 pl-3">
                  {selectedItem.history.map((h, i) => (
                    <li key={i}>
                      <span className="font-mono text-muted-foreground">{h.date}</span>
                      <span className="font-medium ml-2">{h.action}</span>
                      <span className="text-muted-foreground ml-1">by {h.actor}</span>
                      {h.comment && <p className="text-muted-foreground mt-0.5 pl-0">{h.comment}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  )
}
