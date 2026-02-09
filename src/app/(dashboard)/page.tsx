"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Download, ChevronRight, Calendar, FileText } from "lucide-react"
import { PageContainer } from "@/components/layout/PageContainer"
import { MetricStrip } from "@/components/compliance/MetricStrip"
import { useChartTheme } from "@/components/cr/themed-chart-wrapper"
import { isLegalApp } from "@/lib/legal-app"
import { useSetup } from "@/lib/contexts/setup-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  COMPLIANCE_ALERTS,
  CONTRACTS_REQUIRING_ATTENTION,
  UPCOMING_DEADLINES,
  JURISDICTION_UPDATES,
  TREND_CHART_DATA,
  DASHBOARD_METRICS,
  CREATOR_NAME_TO_ID,
} from "@/lib/legal-mock-data"
import { usePageTitle } from "@/hooks/usePageTitle"

const severityStyles: Record<string, string> = {
  critical: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  low: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
}

const alertTypeLabels: Record<string, string> = {
  non_compliant: "Non-compliant",
  disclosure_missing: "Disclosure",
  jurisdiction_conflict: "Jurisdiction",
  risk_threshold: "Risk",
  legislation_change: "Legislation",
}

const categoryStyles: Record<string, string> = {
  "New Law": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Amendment: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Proposed: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Enforcement: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
}

const statusStyles: Record<string, string> = {
  review: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  pending: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  blocked: "bg-red-500/15 text-red-600 dark:text-red-400",
}

function LegalDashboardHome() {
  const chartTheme = useChartTheme()
  usePageTitle("Legal Dashboard")

  const handleExportLegalPackage = () => {
    toast.success("Legal package export started")
  }

  return (
    <PageContainer className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Legal Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Contract compliance, risk monitoring, and talent rights oversight
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleExportLegalPackage}>
          <Download className="mr-2 h-4 w-4" />
          Export Legal Package
        </Button>
      </div>

      {/* Stats row — MetricStrip pattern */}
      <MetricStrip
        metrics={[
          { label: "Active Contracts", value: DASHBOARD_METRICS.activeContracts, trend: "up", trendValue: "+12 this month" },
          { label: "Compliance Rate", value: DASHBOARD_METRICS.complianceRateFormatted, trend: "up", trendValue: "+2.3%" },
          { label: `Open Issues (${DASHBOARD_METRICS.openIssuesBreakdown})`, value: DASHBOARD_METRICS.openIssuesTotal },
          { label: "Expiring Soon (30d)", value: DASHBOARD_METRICS.expiringSoon30d },
        ]}
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — wider: 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          {/* Compliance Alerts */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Compliance Alerts</CardTitle>
              <CardDescription className="text-[12px]">Most recent alerts</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="divide-y divide-border/40">
                {COMPLIANCE_ALERTS.map((alert) => (
                  <li key={alert.id}>
                    <Link
                      href={`/contracts/${alert.contractId}`}
                      className="flex flex-wrap items-center gap-2 py-2 px-0 hover:bg-muted/30 rounded-md -mx-1 px-1 transition-colors"
                    >
                      <Badge variant="outline" className={cn("text-[10px] font-medium", severityStyles[alert.severity])}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {alertTypeLabels[alert.type] ?? alert.type}
                      </Badge>
                      <span className="text-[12px] text-foreground flex-1 min-w-0">{alert.message}</span>
                      <span className="text-[11px] text-muted-foreground font-mono shrink-0">{alert.contractId}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{alert.ts}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/compliance"
                className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline mt-2"
              >
                View All Alerts
                <ChevronRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          {/* Contracts Requiring Attention */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Contracts Requiring Attention</CardTitle>
              <CardDescription className="text-[12px]">Open compliance issues</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto rounded-md border border-border/40 min-w-0">
                <table className="w-full text-[12px] min-w-[600px]">
                  <thead>
                    <tr className="text-muted-foreground text-left border-b border-border/40">
                      <th className="px-3 py-1.5 font-medium">Contract ID</th>
                      <th className="px-3 py-1.5 font-medium">Name</th>
                      <th className="px-3 py-1.5 font-medium">Creator</th>
                      <th className="px-3 py-1.5 font-medium text-right">Issues</th>
                      <th className="px-3 py-1.5 font-medium text-right">Risk</th>
                      <th className="px-3 py-1.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONTRACTS_REQUIRING_ATTENTION.map((row) => (
                      <tr key={row.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-1.5 font-mono">
                          <Link href={`/contracts/${row.id}`} className="text-foreground hover:underline">
                            {row.id}
                          </Link>
                        </td>
                        <td className="px-3 py-1.5">{row.name}</td>
                        <td className="px-3 py-1.5 text-muted-foreground">
                          {CREATOR_NAME_TO_ID[row.creator] ? (
                            <Link href={`/talent-rights/${CREATOR_NAME_TO_ID[row.creator]}`} className="text-primary hover:underline">
                              {row.creator}
                            </Link>
                          ) : (
                            row.creator
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono">{row.issueCount}</td>
                        <td className="px-3 py-1.5 text-right font-mono">{row.riskScore}</td>
                        <td className="px-3 py-1.5">
                          <Badge variant="outline" className={cn("text-[10px]", statusStyles[row.status])}>
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                href="/contracts"
                className="inline-flex items-center gap-1 text-[12px] text-primary hover:underline mt-2"
              >
                View All
                <ChevronRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right — narrower: 1/3 */}
        <div className="space-y-4">
          {/* Upcoming Deadlines */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {UPCOMING_DEADLINES.map((d, i) => (
                  <li key={i} className="flex flex-col gap-0.5 py-1.5 border-b border-border/20 last:border-0">
                    <span className="text-[11px] text-muted-foreground font-mono">{d.date}</span>
                    <span className="text-[12px] text-foreground">
                      {d.contractId ? (
                        <Link href={`/contracts/${d.contractId}`} className="hover:underline">
                          {d.description}
                        </Link>
                      ) : (
                        d.description
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Jurisdiction Updates */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Jurisdiction Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {JURISDICTION_UPDATES.map((item, i) => (
                  <li key={i} className="py-1.5 border-b border-border/20 last:border-0">
                    <Badge variant="secondary" className={cn("text-[10px] mb-1", categoryStyles[item.category])}>
                      {item.category}
                    </Badge>
                    <p className="text-[12px] text-foreground font-medium">{item.headline}</p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      {item.code} · {item.date}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trend chart */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Compliance & Risk Trend</CardTitle>
          <CardDescription className="text-[12px]">Monthly compliance rate and average risk score (12 months)</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_CHART_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} opacity={0.3} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: chartTheme.textColor, fontSize: 12 }}
                  stroke={chartTheme.gridColor}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: chartTheme.textColor, fontSize: 12 }}
                  stroke={chartTheme.gridColor}
                  domain={[0, 100]}
                  label={{ value: "Compliance %", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: chartTheme.textColor } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: chartTheme.textColor, fontSize: 12 }}
                  stroke={chartTheme.gridColor}
                  domain={[0, 100]}
                  label={{ value: "Avg Risk", angle: 90, position: "insideRight", style: { fontSize: 11, fill: chartTheme.textColor } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    border: `1px solid ${chartTheme.tooltipBorder}`,
                    borderRadius: "8px",
                    color: chartTheme.tooltipText,
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: chartTheme.tooltipText }}
                  formatter={(value: number, name: string) => [name === "complianceRate" ? `${value}%` : value, name === "complianceRate" ? "Compliance Rate" : "Avg Risk Score"]}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value) => (value === "complianceRate" ? "Compliance Rate" : "Avg Risk Score")} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="complianceRate"
                  name="complianceRate"
                  stroke={chartTheme.chart1}
                  strokeWidth={2}
                  dot={{ fill: chartTheme.chart1 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgRiskScore"
                  name="avgRiskScore"
                  stroke={chartTheme.chart2}
                  strokeWidth={2}
                  dot={{ fill: chartTheme.chart2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { isSetupComplete, isDismissed } = useSetup()
  const [isRedirecting, setIsRedirecting] = useState(true)

  useEffect(() => {
    if (isLegalApp()) {
      setIsRedirecting(false)
      return
    }
    if (!isSetupComplete && !isDismissed) {
      router.push("/setup")
    } else {
      router.push("/inbox")
    }
  }, [isSetupComplete, isDismissed, router])

  if (isLegalApp() && !isRedirecting) {
    return <LegalDashboardHome />
  }

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
