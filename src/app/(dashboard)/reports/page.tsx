"use client"

import { PageContainer } from "@/components/layout/PageContainer"
import { usePageTitle } from "@/hooks/usePageTitle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  FolderOpen,
  CalendarClock,
  Download,
  Eye,
  Plus,
  BarChart3,
} from "lucide-react"
import { toast } from "sonner"

interface ReportTemplate {
  id: string
  title: string
  description: string
  lastGenerated: string | null
  icon: typeof FileText
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "compliance-summary",
    title: "Compliance Summary Report",
    description: "Portfolio-wide compliance status, risk distribution, open issues.",
    lastGenerated: "2025-02-03",
    icon: Shield,
  },
  {
    id: "contract-portfolio",
    title: "Contract Portfolio Report",
    description: "All active contracts with key terms, values, expiration dates.",
    lastGenerated: "2025-02-01",
    icon: FileText,
  },
  {
    id: "talent-rights-audit",
    title: "Talent Rights Audit",
    description: "All creators, consent status, verification gaps.",
    lastGenerated: "2025-01-28",
    icon: Users,
  },
  {
    id: "jurisdiction-exposure",
    title: "Jurisdiction Exposure Report",
    description: "Penalty exposure by jurisdiction with affected contracts.",
    lastGenerated: "2025-02-05",
    icon: MapPin,
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment Report",
    description: "MRS scores, remediation priorities, insurance recommendations.",
    lastGenerated: null,
    icon: AlertTriangle,
  },
  {
    id: "evidence-package",
    title: "Evidence Package",
    description: "Compiled evidence for a specific incident.",
    lastGenerated: "2025-01-15",
    icon: FolderOpen,
  },
  {
    id: "renewal-pipeline",
    title: "Renewal Pipeline Report",
    description: "Contracts expiring in 30/60/90 days with renewal recommendations.",
    lastGenerated: "2025-02-07",
    icon: CalendarClock,
  },
]

interface ExportRecord {
  id: string
  date: string
  reportType: string
  generatedBy: string
  format: "PDF" | "CSV" | "XLSX"
}

const MOCK_EXPORT_HISTORY: ExportRecord[] = [
  { id: "e1", date: "2025-02-07", reportType: "Renewal Pipeline Report", generatedBy: "Sarah Legal", format: "PDF" },
  { id: "e2", date: "2025-02-05", reportType: "Jurisdiction Exposure Report", generatedBy: "James Counsel", format: "XLSX" },
  { id: "e3", date: "2025-02-03", reportType: "Compliance Summary Report", generatedBy: "Sarah Legal", format: "PDF" },
  { id: "e4", date: "2025-02-01", reportType: "Contract Portfolio Report", generatedBy: "Sarah Legal", format: "CSV" },
  { id: "e5", date: "2025-01-28", reportType: "Talent Rights Audit", generatedBy: "James Counsel", format: "XLSX" },
  { id: "e6", date: "2025-01-15", reportType: "Evidence Package", generatedBy: "Sarah Legal", format: "PDF" },
]

interface ScheduledReport {
  id: string
  name: string
  schedule: string
}

const MOCK_SCHEDULED: ScheduledReport[] = [
  { id: "s1", name: "Weekly Compliance Digest", schedule: "Every Monday" },
  { id: "s2", name: "Monthly Portfolio Summary", schedule: "1st of month" },
]

function FormatBadge({ format }: { format: ExportRecord["format"] }) {
  const variant = format === "PDF" ? "default" : format === "XLSX" ? "secondary" : "outline"
  return <Badge variant={variant}>{format}</Badge>
}

export default function ReportsPage() {
  usePageTitle("Reports & Export")
  function handleGenerate(id: string, title: string) {
    toast.success(`Generating "${title}"…`)
  }

  function handleDownload(id: string, reportType: string) {
    toast.success(`Downloading ${reportType}`)
  }

  function handleView(id: string, reportType: string) {
    toast.info(`Opening ${reportType}`)
  }

  function handleAddSchedule() {
    toast.success("Add schedule dialog would open here")
  }

  return (
    <PageContainer className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Export</h1>
        <p className="text-muted-foreground mt-1">
          Generate legal reports, compliance summaries, and audit packages.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Report templates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {REPORT_TEMPLATES.map((t) => {
            const Icon = t.icon
            return (
              <Card key={t.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{t.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {t.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto pt-0 flex flex-col gap-3">
                  {t.lastGenerated ? (
                    <p className="text-xs text-muted-foreground">
                      Last generated: {t.lastGenerated}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Not generated yet</p>
                  )}
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleGenerate(t.id, t.title)}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Generate
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Export history</h2>
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Report type</TableHead>
                  <TableHead>Generated by</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="w-[180px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_EXPORT_HISTORY.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-sm">{row.date}</TableCell>
                    <TableCell>{row.reportType}</TableCell>
                    <TableCell className="text-muted-foreground">{row.generatedBy}</TableCell>
                    <TableCell>
                      <FormatBadge format={row.format} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(row.id, row.reportType)}
                        >
                          <Download className="h-3.5 w-3" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(row.id, row.reportType)}
                        >
                          <Eye className="h-3.5 w-3" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Scheduled reports</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {MOCK_SCHEDULED.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.schedule}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleAddSchedule}
            >
              <Plus className="h-4 w-4" />
              Add schedule
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  )
}
