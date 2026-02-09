"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { PageContainer } from "@/components/layout/PageContainer"
import {
  ArrowLeft,
  Download,
  FilePlus,
  Trash2,
  RefreshCw,
  Share2,
  Printer,
  FileText,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  FolderOpen,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getContractById } from "@/lib/legal-mock-data"
import { usePageTitle } from "@/hooks/usePageTitle"

// --- Collapsible section wrapper with smooth open/close ---
function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-border/40 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-muted/30 transition-colors">
            <span className="text-sm font-medium">{title}</span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 duration-200 overflow-hidden">
          <CardContent className="pt-0 px-4 pb-4 border-t border-border/40">
            <div className="pt-3 space-y-3 text-[12px]">{children}</div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const contract = getContractById(id)
  usePageTitle(contract.title)

  return (
    <PageContainer className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0 mt-0.5" asChild>
            <Link href="/contracts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold truncate">{contract.title}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px]">
                Active
              </Badge>
              <span className="text-[12px] font-mono text-muted-foreground">{contract.contractId}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => toast.success("Download started")}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download Contract
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => toast.info("Amendment by admin")}>
            <FilePlus className="mr-1.5 h-3.5 w-3.5" /> Create Amendment
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => toast.error("Contact admin")}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Terminate
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => toast.info("Renewal flow")}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Renew
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]">
            <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]">
            <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => toast.success("Export started")}>
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content — collapsible sections */}
        <div className="lg:col-span-2 space-y-3">
          <Section title="Parties & Representatives" defaultOpen>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Creator (Talent)</div>
                <p className="font-medium">{contract.parties.creator.name}</p>
                <p className="text-[11px] text-muted-foreground">{contract.parties.creator.type} · ID: {contract.parties.creator.creatorId}</p>
                <p className="text-[11px] mt-1">Status: {contract.parties.creator.talentRightsStatus}</p>
                <p className="text-[11px] mt-1">Agent: {contract.parties.creator.agent} — {contract.parties.creator.agentContact}</p>
                <p className="text-[11px]">Attorney: {contract.parties.creator.attorney} — {contract.parties.creator.attorneyContact}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Brand (Client)</div>
                <p className="font-medium">{contract.parties.brand.entity}</p>
                <p className="text-[11px] text-muted-foreground">Jurisdiction: {contract.parties.brand.jurisdiction}</p>
                <p className="text-[11px] mt-1">Signatory: {contract.parties.brand.signatory}</p>
                <p className="text-[11px]">{contract.parties.brand.email}</p>
              </div>
              <div className="sm:col-span-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Agency (Intermediary)</div>
                <p className="font-medium">{contract.parties.agency.entity}</p>
                <p className="text-[11px] text-muted-foreground">Role: {contract.parties.agency.role} · {contract.parties.agency.contact}</p>
              </div>
            </div>
          </Section>

          <Section title="Talent Rights Granted">
            <p className="text-[11px] text-muted-foreground mb-2">Grant type: <span className="font-medium text-foreground">{contract.talentRights.grantType}</span></p>
            <div className="space-y-3">
              {(["name", "image", "likeness", "persona"] as const).map((key) => {
                const r = contract.talentRights[key]
                if (!r || typeof r !== "object" || !("usage" in r)) return null
                const label = key.charAt(0).toUpperCase() + key.slice(1)
                return (
                  <div key={key} className="rounded-md border border-border/40 p-2.5">
                    <div className="text-[11px] font-medium mb-1">{label}</div>
                    <p className="text-[11px] text-muted-foreground">Usage: {r.usage.join(", ")}</p>
                    <p className="text-[11px] text-muted-foreground">Restrictions: {r.restrictions}</p>
                    {"approvalRequired" in r && <p className="text-[11px]">Approval required: {r.approvalRequired ? "Yes" : "No"}</p>}
                    {key === "likeness" && "aiGeneration" in r && (
                      <p className="text-[11px] mt-1">AI generation: {r.aiGeneration ? "Yes" : "No"} · Approved tools: {r.approvedTools?.join(", ")} · {r.limitations}</p>
                    )}
                    {key === "persona" && "traits" in r && r.traits && (
                      <p className="text-[11px]">Traits: {r.traits.join(", ")}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </Section>

          <Section title="Usage Rights & Restrictions">
            <div className="grid gap-2 text-[11px]">
              <p><span className="text-muted-foreground">Intended use:</span> {contract.usageRights.intendedUse}</p>
              <p><span className="text-muted-foreground">Territory:</span> {contract.usageRights.territory.join(", ")}</p>
              <p><span className="text-muted-foreground">Media channels:</span> {contract.usageRights.mediaChannels.join(", ")}</p>
              <p><span className="text-muted-foreground">Prohibited:</span> {contract.usageRights.prohibitedUses.join(", ")}</p>
              <p><span className="text-muted-foreground">Creation methods:</span> {contract.usageRights.creationMethods.join(", ")}</p>
              <p><span className="text-muted-foreground">Category:</span> {contract.usageRights.category}</p>
              <p><span className="text-muted-foreground">Exclusivity:</span> {contract.usageRights.exclusivity.isExclusive ? "Exclusive" : "Non-exclusive"}{contract.usageRights.exclusivity.competitors?.length ? ` · Competitors: ${contract.usageRights.exclusivity.competitors.join(", ")}` : ""}</p>
            </div>
          </Section>

          <Section title="Term & Renewal">
            <div className="grid gap-2 text-[11px]">
              <p><span className="text-muted-foreground">Effective:</span> {contract.term.effectiveDate} · <span className="text-muted-foreground">Expiration:</span> {contract.term.expirationDate}</p>
              <p><span className="text-muted-foreground">Duration:</span> {contract.term.duration} · <span className="text-muted-foreground">Days remaining:</span> <span className="font-mono">{contract.term.daysRemaining}</span></p>
              <p><span className="text-muted-foreground">Auto-renewal:</span> {contract.term.autoRenewal ? "Yes" : "No"}</p>
              <p><span className="text-muted-foreground">Renewal terms:</span> {contract.term.renewalTerms}</p>
              <p><span className="text-muted-foreground">Termination:</span> {contract.term.terminationRights}</p>
              <p><span className="text-muted-foreground">Post-termination:</span> {contract.term.postTermination}</p>
            </div>
          </Section>

          <Section title="Compensation & Payment">
            <div className="grid gap-2 text-[11px]">
              <p><span className="text-muted-foreground">Total:</span> <span className="font-mono font-medium">{contract.compensation.currency} {contract.compensation.totalFee.toLocaleString()}</span></p>
              <p><span className="text-muted-foreground">Breakdown:</span> Name {contract.compensation.breakdown.name.toLocaleString()} · Image {contract.compensation.breakdown.image.toLocaleString()} · Likeness {contract.compensation.breakdown.likeness.toLocaleString()} · Persona {contract.compensation.breakdown.persona.toLocaleString()}</p>
              <p><span className="text-muted-foreground">Terms:</span> {contract.compensation.paymentTerms} · {contract.compensation.paymentMethod} · {contract.compensation.paymentSchedule}</p>
              <p><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-600">{contract.compensation.paymentStatus}</Badge> · Paid {contract.compensation.paidAt} · Invoice {contract.compensation.invoiceNumber}</p>
              <p><span className="text-muted-foreground">Late payment:</span> {contract.compensation.latePaymentTerms}</p>
            </div>
          </Section>

          <Section title="Legal Provisions">
            <div className="grid gap-2 text-[11px]">
              <p><span className="text-muted-foreground">Representations:</span> {contract.legalProvisions.representations}</p>
              <p><span className="text-muted-foreground">Indemnification:</span> {contract.legalProvisions.indemnification}</p>
              <p><span className="text-muted-foreground">Limitation of liability:</span> {contract.legalProvisions.limitationOfLiability}</p>
              <p><span className="text-muted-foreground">IP ownership:</span> {contract.legalProvisions.ipOwnership}</p>
              <p><span className="text-muted-foreground">Approval rights:</span> {contract.legalProvisions.approvalRights}</p>
              <p><span className="text-muted-foreground">Confidentiality:</span> {contract.legalProvisions.confidentiality}</p>
              <p><span className="text-muted-foreground">Governing law:</span> {contract.legalProvisions.governingLaw}</p>
              <p><span className="text-muted-foreground">Dispute resolution:</span> {contract.legalProvisions.disputeResolution}</p>
            </div>
          </Section>

          <Section title="Compliance & Insurance">
            <div className="grid gap-2 text-[11px]">
              <p><span className="text-muted-foreground">Provider:</span> {contract.complianceInsurance.insuranceProvider} · Policy: {contract.complianceInsurance.policyNumber}</p>
              <p><span className="text-muted-foreground">Coverage:</span> {contract.complianceInsurance.coverageAmount} · {contract.complianceInsurance.effectiveDates}</p>
              <p><span className="text-muted-foreground">Status:</span> {contract.complianceInsurance.insuranceStatus}</p>
              <div className="mt-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Compliance checklist</div>
                <ul className="space-y-0.5">
                  {contract.complianceInsurance.complianceChecklist.map((c, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px]">
                      {c.status === "ok" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                      {c.status === "warn" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                      {c.status === "fail" && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                      {c.item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-2"><span className="text-muted-foreground">Risk assessment:</span> {contract.complianceInsurance.riskAssessment} · Last review: {contract.complianceInsurance.lastReviewDate}</p>
            </div>
          </Section>

          <Section title="Documents & Attachments">
            <ul className="space-y-2">
              {contract.documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between rounded-md border border-border/40 px-2.5 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium truncate">{doc.name}</p>
                      <p className="text-[11px] text-muted-foreground">{doc.type} · {doc.size} · {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-7 text-[11px]">View</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => toast.success("Download started")}>Download</Button>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="h-8 text-[12px] mt-2" onClick={() => toast.success("ZIP download started")}>
              Download All Documents (ZIP)
            </Button>
          </Section>

          <Section title="Project & Outputs">
            <div className="mb-3">
              <p className="text-[11px] font-medium">Linked project</p>
              <Link href={`/projects/${contract.project.id}`} className="text-[12px] text-primary hover:underline flex items-center gap-1">
                {contract.project.title} <ExternalLink className="h-3 w-3" />
              </Link>
              <p className="text-[11px] text-muted-foreground">Status: {contract.project.status}</p>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Outputs</div>
            <ul className="space-y-2">
              {contract.outputs.map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-md border border-border/40 px-2.5 py-2 text-[11px]">
                  <span>{o.type} · {o.creationMethod} · {o.approvalStatus} · Rights: {o.rightsUsed}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]">View</Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]">Provenance Certificate</Button>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Contract History & Amendments">
            <div className="space-y-1.5">
              {contract.history.map((h, i) => (
                <div key={i} className="flex gap-2 text-[11px]">
                  <span className="font-mono text-muted-foreground shrink-0 w-24">{h.date}</span>
                  <span className="font-medium">{h.event}</span>
                  <span className="text-muted-foreground">— {h.by}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Related: {contract.relatedContracts.join(", ")}</p>
          </Section>

          <Section title="Notes & Communications">
            <ul className="space-y-2">
              {contract.notes.map((n, i) => (
                <li key={i} className="rounded-md border border-border/40 p-2.5 text-[11px]">
                  <span className="font-mono text-muted-foreground">{n.date}</span> · <span className="font-medium">{n.author}</span>
                  <p className="mt-0.5">{n.text}</p>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="h-8 text-[12px]">Add Note</Button>
              <Button variant="ghost" size="sm" className="h-8 text-[12px]">View All Communications</Button>
            </div>
          </Section>
        </div>

        {/* Right sidebar — sticky */}
        <div className="lg:col-span-1 space-y-4">
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card className="border-border/40">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Contract Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 text-[11px] space-y-1.5">
                <p><span className="text-muted-foreground">ID:</span> <span className="font-mono">{contract.contractId}</span></p>
                <p><span className="text-muted-foreground">Status:</span> Active</p>
                <p><span className="text-muted-foreground">Parties:</span> {contract.parties.creator.name} · {contract.parties.brand.entity}</p>
                <p><span className="text-muted-foreground">Value:</span> {contract.compensation.currency} {contract.compensation.totalFee.toLocaleString()}</p>
                <p><span className="text-muted-foreground">Term:</span> {contract.term.effectiveDate} → {contract.term.expirationDate}</p>
                <p><span className="text-muted-foreground">Talent rights:</span> N·I·L·P Full</p>
                <p><span className="text-muted-foreground">Exclusivity:</span> Non-exclusive</p>
                <p><span className="text-muted-foreground">Legal:</span> Executed · Payment: {contract.compensation.paymentStatus} · Insurance: {contract.complianceInsurance.insuranceStatus}</p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-1.5">
                <Button variant="outline" size="sm" className="h-8 text-[11px] justify-start" onClick={() => toast.success("Download started")}><Download className="mr-2 h-3 w-3" /> Download Contract</Button>
                <Button variant="outline" size="sm" className="h-8 text-[11px] justify-start"><FilePlus className="mr-2 h-3 w-3" /> Create Amendment</Button>
                <Button variant="outline" size="sm" className="h-8 text-[11px] justify-start" asChild><Link href={`/projects/${contract.project.id}`}><FolderOpen className="mr-2 h-3 w-3" /> View Project</Link></Button>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Related Items</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0 text-[11px] space-y-1.5">
                <Link href={`/projects/${contract.project.id}`} className="text-primary hover:underline flex items-center gap-1">Project: {contract.project.title} <ExternalLink className="h-3 w-3" /></Link>
                <p>Outputs: {contract.outputs.length} linked</p>
                <p>Previous: {contract.relatedContracts[0]}</p>
                <p>Insurance: {contract.complianceInsurance.policyNumber}</p>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <ul className="space-y-0.5 text-[11px]">
                  {contract.complianceInsurance.complianceChecklist.map((c, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {c.status === "ok" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                      {c.status === "warn" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                      {c.status === "fail" && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                      {c.item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Key Dates</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <ul className="space-y-1 text-[11px]">
                  <li><span className="text-muted-foreground">Effective:</span> {contract.term.effectiveDate}</li>
                  <li><span className="text-muted-foreground">Expiration:</span> {contract.term.expirationDate}</li>
                  <li><span className="text-muted-foreground">Executed:</span> 2024-12-28</li>
                  <li><span className="text-muted-foreground">Paid:</span> {contract.compensation.paidAt}</li>
                  <li><span className="text-muted-foreground">Review:</span> {contract.complianceInsurance.lastReviewDate}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
