"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderOpen,
  FilePlus,
  SlidersHorizontal,
  Bookmark,
} from "lucide-react"
import { PageContainer } from "@/components/layout/PageContainer"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { MOCK_CONTRACTS, type ContractCardData, type CardStatus } from "@/lib/legal-mock-data"
import { usePageTitle } from "@/hooks/usePageTitle"

const statusConfig: Record<CardStatus, { label: string; className: string; icon: string }> = {
  active: { label: "Active", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", icon: "🟢" },
  expiring: { label: "Expiring Soon", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30", icon: "⚠️" },
  expired: { label: "Expired", className: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30", icon: "⭕" },
}

function ContractCard({ contract }: { contract: ContractCardData }) {
  const [open, setOpen] = useState(false)
  const config = statusConfig[contract.status]

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-border/40 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left">
            <CardHeader className="py-3 px-4 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn("text-[10px] font-medium", config.className)}>
                  {config.icon} {config.label}
                </Badge>
                {contract.status === "expiring" && contract.daysRemaining != null && (
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                    {contract.daysRemaining} days left
                  </span>
                )}
                <span className="text-[12px] font-medium text-foreground flex-1 min-w-0">{contract.title}</span>
                <span className="text-[11px] font-mono text-muted-foreground">{contract.contractId}</span>
                <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-90")} />
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span><span className="text-foreground/80">Parties:</span> {contract.creator} · {contract.brand}</span>
                <span><span className="text-foreground/80">Type:</span> {contract.agreementType}</span>
                <span><span className="text-foreground/80">Value:</span> {contract.currency} {contract.value.toLocaleString()} ({contract.paymentStatus})</span>
                <span><span className="text-foreground/80">Term:</span> {contract.effectiveDate} → {contract.expirationDate}</span>
              </div>
            </CardContent>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 px-4 pb-4 border-t border-border/40 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Parties</div>
                <p className="font-mono text-[11px]">Creator: {contract.creator} · Brand: {contract.brand}{contract.agency ? ` · Agency: ${contract.agency}` : ""}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Contract Type</div>
                <p>{contract.agreementType} · {contract.exclusivity}{contract.projectTitle ? ` · Project: ${contract.projectTitle}` : ""}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Talent Rights Granted (N·I·L·P)</div>
                <p className="font-mono text-[11px]">
                  {contract.nilp.name ? "✓" : "—"} Name · {contract.nilp.image ? "✓" : "—"} Image · {contract.nilp.likeness ? "✓" : "—"} Likeness · {contract.nilp.persona ? "✓" : "—"} Persona
                </p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Financial</div>
                <p className="font-mono">{contract.currency} {contract.value.toLocaleString()} · {contract.paymentStatus}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Term</div>
                <p className="font-mono text-[11px]">Effective: {contract.effectiveDate} · Expires: {contract.expirationDate}{contract.daysRemaining != null ? ` · ${contract.daysRemaining} days remaining` : ""} · {contract.territory.join(", ")}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Usage Rights</div>
                <p className="text-[11px]">{contract.mediaChannels.join(", ")} · {contract.creationMethod} · {contract.exclusivity}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Legal Status</div>
                <p className="text-[11px]">Executed: {contract.executionDate ?? "—"} · Reviewer: {contract.reviewer ?? "—"} · Insurance: {contract.insuranceStatus} · Compliance: {contract.complianceStatus}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Documents</div>
                <p className="font-mono text-[11px]">{contract.documentCount} file(s)</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
              <Button variant="outline" size="sm" className="h-7 text-[11px]" asChild>
                <Link href={`/contracts/${contract.contractId}`}>
                  <FileText className="h-3 w-3 mr-1" /> View Full Contract
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toast.success("Download started")}>
                <Download className="h-3 w-3 mr-1" /> Download All
              </Button>
              {contract.projectId && (
                <Button variant="outline" size="sm" className="h-7 text-[11px]" asChild>
                  <Link href={`/projects/${contract.projectId}`}>
                    <FolderOpen className="h-3 w-3 mr-1" /> View Project
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toast.info("Amendment flow by admin")}>
                <FilePlus className="h-3 w-3 mr-1" /> Create Amendment
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export default function ContractsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  function filterList(list: ContractCardData[]) {
    if (search.trim()) {
      const q = search.toLowerCase()
      return list.filter(
        (c) =>
          c.contractId.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.creator.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q)
      )
    }
    return list
  }

  const activeList = filterList(MOCK_CONTRACTS.filter((c) => c.status === "active"))
  const expiringList = filterList(MOCK_CONTRACTS.filter((c) => c.status === "expiring"))
  const expiredList = filterList(MOCK_CONTRACTS.filter((c) => c.status === "expired"))
  const allList = filterList(MOCK_CONTRACTS)

  const handleExport = () => toast.success("Export started")
  usePageTitle("Contracts")

  function ContractList({ list }: { list: ContractCardData[] }) {
    return (
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {list.length === 0 ? (
          <p className="text-[12px] text-muted-foreground py-8 text-center">No contracts match the current filters.</p>
        ) : (
          list.map((contract) => <ContractCard key={contract.id} contract={contract} />)
        )}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <PageContainer className="space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Contracts & Agreements</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              All talent rights contracts, usage agreements, and amendments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <Button variant="outline" size="sm" className="pointer-events-none opacity-60" disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    New Contract
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Contracts are created by admin</TooltipContent>
            </Tooltip>
            <Button size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats bar — 4 pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-md border border-border/40 bg-background px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">Total Contracts</span>
            <span className="ml-2 text-sm font-semibold font-mono">487</span>
          </div>
          <div className="rounded-md border border-border/40 bg-background px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">Active</span>
            <span className="ml-2 text-sm font-semibold font-mono">243</span>
          </div>
          <div className="rounded-md border border-border/40 bg-background px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">Expiring Soon (&lt;30 days)</span>
            <span className="ml-2 text-sm font-semibold font-mono">28</span>
          </div>
          <div className="rounded-md border border-border/40 bg-background px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">Executed This Year</span>
            <span className="ml-2 text-sm font-semibold font-mono">156</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border border-border/40 bg-muted/30 h-9 p-0.5">
            <TabsTrigger value="active" className="text-[12px] data-[state=active]:bg-background">Active (243)</TabsTrigger>
            <TabsTrigger value="expiring" className="text-[12px] data-[state=active]:bg-background">Expiring Soon (28)</TabsTrigger>
            <TabsTrigger value="expired" className="text-[12px] data-[state=active]:bg-background">Expired (216)</TabsTrigger>
            <TabsTrigger value="all" className="text-[12px] data-[state=active]:bg-background">All (487)</TabsTrigger>
          </TabsList>

          {/* Search & filter bar */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by contract ID, creator, brand, project..."
                className="pl-8 h-8 text-[12px] border-border/40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[120px] h-8 text-[12px] border-border/40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px] h-8 text-[12px] border-border/40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="nilp">NILP Rights</SelectItem>
                <SelectItem value="endorsement">Endorsement</SelectItem>
                <SelectItem value="usage">Usage Rights</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[120px] h-8 text-[12px] border-border/40">
                <SelectValue placeholder="Creator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="jordan">Jordan Williams</SelectItem>
                <SelectItem value="alex">Alex Chen</SelectItem>
                <SelectItem value="sam">Sam Davis</SelectItem>
                <SelectItem value="morgan">Morgan Lee</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[110px] h-8 text-[12px] border-border/40">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="nike">Nike</SelectItem>
                <SelectItem value="samsung">Samsung</SelectItem>
                <SelectItem value="coca-cola">Coca-Cola</SelectItem>
                <SelectItem value="toyota">Toyota</SelectItem>
                <SelectItem value="adidas">Adidas</SelectItem>
                <SelectItem value="apple">Apple</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[120px] h-8 text-[12px] border-border/40">
                <SelectValue placeholder="Territory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="global">Global</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[130px] h-8 text-[12px] border-border/40">
                <SelectValue placeholder="Value range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="0-25k">0 – 25k</SelectItem>
                <SelectItem value="25k-50k">25k – 50k</SelectItem>
                <SelectItem value="50k-100k">50k – 100k</SelectItem>
                <SelectItem value="100k+">100k+</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-8 text-[12px]">
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
              Advanced Filters
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-[12px]">
              <Bookmark className="mr-1.5 h-3.5 w-3.5" />
              Save Filter
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-[12px]" onClick={handleExport}>
              Export Results
            </Button>
          </div>

          <TabsContent value="active" className="mt-4">
            <ContractList list={activeList} />
          </TabsContent>
          <TabsContent value="expiring" className="mt-4">
            <ContractList list={expiringList} />
          </TabsContent>
          <TabsContent value="expired" className="mt-4">
            <ContractList list={expiredList} />
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <ContractList list={allList} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </TooltipProvider>
  )
}
