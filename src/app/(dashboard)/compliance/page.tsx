"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePageTitle } from "@/hooks/usePageTitle"
import { ComplianceLayout } from "@/components/compliance/ComplianceLayout"
import { USLegislationMap } from "@/components/compliance/USLegislationMap"
import { WorldComplianceMap } from "@/components/compliance/WorldComplianceMap"
import { MetricStrip } from "@/components/compliance/MetricStrip"
import { cn } from "@/lib/utils"
import { Eye, ArrowRight, XCircle, AlertTriangle, ChevronRight, Globe, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts"
import { getComplianceOverview, getJurisdictions, getLegislationNews, getCountryJurisdictions, getGlobalLegislationNews } from "@/lib/compliance/api"
import type { ComplianceOverview, JurisdictionProfile, LegislationNewsItem, ComplianceAlert, CountryJurisdictionProfile, GlobalLegislationNewsItem } from "@/types/compliance"
import { Skeleton } from "@/components/ui/skeleton"

const riskClassColors: Record<string, string> = {
  Low: "#10b981",
  Moderate: "#f59e0b",
  Guarded: "#f97316",
  Elevated: "#ef4444",
  Severe: "#e11d48",
  Critical: "#1e293b",
}

const severityColors: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-slate-400",
}

const alertTypeBadgeColors: Record<string, string> = {
  non_compliant: "text-red-600 bg-red-500/10",
  missing_consent: "text-orange-600 bg-orange-500/10",
  jurisdiction_conflict: "text-amber-600 bg-amber-500/10",
  classification_uncertain: "text-slate-600 bg-slate-500/10",
  disclosure_missing: "text-orange-600 bg-orange-500/10",
  risk_threshold: "text-red-600 bg-red-500/10",
  legislation_change: "text-blue-600 bg-blue-500/10",
}

type MapView = "world" | "us"

export default function ComplianceDashboardPage() {
  const [overview, setOverview] = useState<ComplianceOverview | null>(null)
  const [jurisdictions, setJurisdictions] = useState<JurisdictionProfile[]>([])
  const [countryJurisdictions, setCountryJurisdictions] = useState<CountryJurisdictionProfile[]>([])
  const [news, setNews] = useState<LegislationNewsItem[]>([])
  const [globalNews, setGlobalNews] = useState<GlobalLegislationNewsItem[]>([])
  const [mapView, setMapView] = useState<MapView>("world")
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [stateDetailOpen, setStateDetailOpen] = useState(false)
  const [countryDetailOpen, setCountryDetailOpen] = useState(false)
  const [alertPage, setAlertPage] = useState(0)
  const alertsPerPage = 20

  useEffect(() => {
    getComplianceOverview().then(setOverview)
    getJurisdictions().then(setJurisdictions)
    getCountryJurisdictions().then(setCountryJurisdictions)
    getLegislationNews({ limit: 10 }).then(setNews)
    getGlobalLegislationNews({ limit: 10 }).then(setGlobalNews)
  }, [])

  const selectedProfile = useMemo(
    () => jurisdictions.find((j) => j.stateCode === selectedState),
    [jurisdictions, selectedState]
  )

  const selectedCountryProfile = useMemo(
    () => countryJurisdictions.find((j) => j.countryCode === selectedCountry),
    [countryJurisdictions, selectedCountry]
  )

  usePageTitle("Compliance")

  function handleStateClick(code: string) {
    setSelectedState(code)
    setStateDetailOpen(true)
  }

  function handleCountryClick(code: string) {
    setSelectedCountry(code)
    setCountryDetailOpen(true)
  }

  function setMapViewAndCloseSheets(view: MapView) {
    setMapView(view)
    setStateDetailOpen(false)
    setCountryDetailOpen(false)
    setSelectedState(null)
    setSelectedCountry(null)
  }

  if (!overview) {
    return (
      <ComplianceLayout title="Compliance Dashboards">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-md" />
          ))}
        </div>
      </ComplianceLayout>
    )
  }

  const paginatedAlerts = overview.alerts.slice(alertPage * alertsPerPage, (alertPage + 1) * alertsPerPage)
  const totalAlertPages = Math.ceil(overview.alerts.length / alertsPerPage)

  return (
    <ComplianceLayout title="Compliance Dashboards">

      {/* Map View Toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-0.5 w-fit">
        <button
          type="button"
          onClick={() => setMapViewAndCloseSheets("world")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
            mapView === "world"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          World
        </button>
        <button
          type="button"
          onClick={() => setMapViewAndCloseSheets("us")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
            mapView === "us"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Flag className="h-3.5 w-3.5" />
          United States
        </button>
      </div>

      {/* AI Content Legislation Map — Hero Element */}
      {mapView === "world" ? (
        <WorldComplianceMap
          jurisdictions={countryJurisdictions}
          onCountryClick={handleCountryClick}
          selectedCountry={selectedCountry}
          height={420}
        />
      ) : (
        <USLegislationMap
          jurisdictions={jurisdictions}
          onStateClick={handleStateClick}
          selectedState={selectedState}
          height={420}
        />
      )}

      {/* Legislation ticker */}
      <div className="w-full overflow-hidden rounded-md border border-border/40 bg-muted/30">
        <div className="flex animate-marquee whitespace-nowrap py-1.5 px-3">
          {mapView === "world"
            ? globalNews.concat(globalNews).map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href="/compliance/jurisdictions"
                className="inline-flex items-center gap-2 mr-8 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-mono font-medium text-foreground/80">{item.countryCode}</span>
                <span className="truncate max-w-[300px]">{item.headline}</span>
                <span className="text-muted-foreground/60">{item.date}</span>
              </Link>
            ))
            : news.concat(news).map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href="/compliance/jurisdictions"
                className="inline-flex items-center gap-2 mr-8 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-mono font-medium text-foreground/80">{item.stateCode}</span>
                <span className="truncate max-w-[300px]">{item.headline}</span>
                <span className="text-muted-foreground/60">{item.date}</span>
              </Link>
            ))
          }
        </div>
      </div>

      {/* Metric Strip — legal counsel labels */}
      <MetricStrip
        metrics={[
          { label: "Contracts Monitored", value: overview.contractsMonitored ?? overview.totalAssetsMonitored, trend: "up", trendValue: "+12" },
          { label: "Flagged Contracts", value: overview.flaggedContracts ?? overview.flaggedCount, trend: (overview.flaggedContracts ?? overview.flaggedCount) > 5 ? "down" : "neutral" },
          { label: "Avg Compliance Score", value: overview.avgComplianceScore ?? overview.avgProvenanceScore, trend: "up", trendValue: "+3" },
          { label: "Avg MRS", value: overview.avgMRS, trend: "down", trendValue: "-2" },
          { label: "Highest Risk", value: overview.highestRisk ?? overview.highestRiskModel.name.split(" ")[0] },
        ]}
      />

      {/* Two-Column Row: Risk Distribution + Top Risk Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Distribution */}
        <div className="rounded-md border border-border/40 p-3">
          <div className="text-[13px] font-medium mb-2">Risk Distribution</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={overview.riskDistribution} layout="vertical" barSize={14}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="riskClass"
                width={70}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #64748b)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-background, #fff)",
                  border: "1px solid var(--color-border, #e2e8f0)",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [`${value} assets`, "Count"]}
              />
              <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                {overview.riskDistribution.map((entry) => (
                  <Cell key={entry.riskClass} fill={riskClassColors[entry.riskClass] || "#64748b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {overview.riskDistribution.map((d) => (
              <span key={d.riskClass} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.riskClass}: {d.count}
              </span>
            ))}
          </div>
        </div>

        {/* Top Risk Items — linked to contracts */}
        <div className="rounded-md border border-border/40 p-3">
          <div className="text-[13px] font-medium mb-2">Top Risk Items</div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-muted-foreground text-left">
                  <th className="pb-1.5 font-medium pr-3">Item</th>
                  <th className="pb-1.5 font-medium pr-3 text-right">MRS</th>
                  <th className="pb-1.5 font-medium pr-3">Risk Class</th>
                  <th className="pb-1.5 font-medium">Top Risk Factor</th>
                </tr>
              </thead>
              <tbody>
                {(overview.topRiskItems ?? overview.topRiskModels.map((m) => ({ id: m.id, label: m.name, contractId: "", mrs: m.mrs, riskClass: m.riskClass, topRiskFactor: m.topRiskFactor }))).map((item) => (
                  <tr key={item.id} className="border-t border-border/20 hover:bg-muted/30 transition-colors">
                    <td className="py-1.5 pr-3">
                      {"contractId" in item && item.contractId ? (
                        <Link href={`/contracts/${item.contractId}`} className="text-foreground hover:underline">
                          {item.label}
                        </Link>
                      ) : (
                        <Link href={`/compliance/scoring?model=${item.id}`} className="text-foreground hover:underline">
                          {item.label}
                        </Link>
                      )}
                    </td>
                    <td className="py-1.5 pr-3 text-right font-mono font-medium">{"mrs" in item ? item.mrs : (item as { mrs: number }).mrs}</td>
                    <td className="py-1.5 pr-3">
                      <span
                        className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                          color: riskClassColors[(item as { riskClass?: string }).riskClass ?? ""],
                          backgroundColor: `${riskClassColors[(item as { riskClass?: string }).riskClass ?? ""] || "#64748b"}15`,
                        }}
                      >
                        {(item as { riskClass?: string }).riskClass ?? "—"}
                      </span>
                    </td>
                    <td className="py-1.5 text-muted-foreground truncate max-w-[180px]">{(item as { topRiskFactor?: string }).topRiskFactor ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contract Compliance Summary — by brand */}
      {overview.contractComplianceSummary && overview.contractComplianceSummary.length > 0 && (
        <div className="rounded-md border border-border/40 p-3">
          <div className="text-[13px] font-medium mb-2">Contract Compliance Summary</div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] max-w-[400px]">
              <thead>
                <tr className="text-muted-foreground text-left border-b border-border/20">
                  <th className="pb-1.5 font-medium pr-4">Brand</th>
                  <th className="pb-1.5 font-medium pr-3 text-right">Compliant</th>
                  <th className="pb-1.5 font-medium text-right">Flagged</th>
                </tr>
              </thead>
              <tbody>
                {overview.contractComplianceSummary.map((row) => (
                  <tr key={row.brand} className="border-t border-border/20">
                    <td className="py-1.5 pr-4 font-medium">{row.brand}</td>
                    <td className="py-1.5 pr-3 text-right font-mono text-emerald-600">{row.compliant}</td>
                    <td className="py-1.5 text-right font-mono text-amber-600">{row.flagged}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trend data chart — Compliance score & MRS over time */}
      {overview.trendData && overview.trendData.length > 0 && (
        <div className="rounded-md border border-border/40 p-3">
          <div className="text-[13px] font-medium mb-2">Compliance & MRS Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={overview.trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={28} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: "6px", fontSize: "11px" }}
                formatter={(value: number) => [value, ""]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value) => (value === "score" ? "Compliance Score" : "MRS")} />
              <Line type="monotone" dataKey="score" name="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="mrs" name="mrs" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alerts Table */}
      <div className="rounded-md border border-border/40">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
          <span className="text-[13px] font-medium">Compliance Alerts</span>
          <span className="text-[11px] text-muted-foreground">
            {alertPage * alertsPerPage + 1}-{Math.min((alertPage + 1) * alertsPerPage, overview.alerts.length)} of {overview.alerts.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-muted-foreground text-left border-b border-border/20">
                <th className="px-3 py-1.5 font-medium w-[130px]">Timestamp</th>
                <th className="px-3 py-1.5 font-medium">Project</th>
                <th className="px-3 py-1.5 font-medium">Asset / Model</th>
                <th className="px-3 py-1.5 font-medium">Type</th>
                <th className="px-3 py-1.5 font-medium w-[28px]">Sev</th>
                <th className="px-3 py-1.5 font-medium w-[36px]">Jur</th>
                <th className="px-3 py-1.5 font-medium">Linked Contract</th>
                <th className="px-3 py-1.5 font-medium w-[60px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </tbody>
          </table>
        </div>
        {totalAlertPages > 1 && (
          <div className="flex items-center justify-end gap-1 px-3 py-1.5 border-t border-border/20">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px]"
              disabled={alertPage === 0}
              onClick={() => setAlertPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[11px]"
              disabled={alertPage >= totalAlertPages - 1}
              onClick={() => setAlertPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* State Detail Sheet */}
      <Sheet open={stateDetailOpen} onOpenChange={setStateDetailOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[400px] p-0">
          <SheetHeader className="px-4 py-3 border-b border-border/40">
            <SheetTitle className="text-base font-semibold">
              {selectedProfile?.state} ({selectedProfile?.stateCode})
            </SheetTitle>
          </SheetHeader>
          {selectedProfile && (
            <div className="px-4 py-3 space-y-4 overflow-y-auto h-[calc(100vh-60px)]">
              {/* Legislation status */}
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                  selectedProfile.legislationStatus === "ENACTED" ? "text-orange-600 bg-orange-500/10" :
                    selectedProfile.legislationStatus === "PROPOSED" ? "text-yellow-600 bg-yellow-500/10" :
                      "text-slate-500 bg-slate-500/10"
                )}>
                  {selectedProfile.legislationStatus}
                </span>
                {selectedProfile.effectiveDate && (
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    Effective: {selectedProfile.effectiveDate}
                  </span>
                )}
              </div>

              {/* Law categories */}
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Law Categories</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.lawCategories.map((cat) => (
                    <span key={cat} className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
                      {cat.replace(/_/g, " ")}
                    </span>
                  ))}
                  {selectedProfile.lawCategories.length === 0 && (
                    <span className="text-[11px] text-muted-foreground">No AI content-specific legislation</span>
                  )}
                </div>
              </div>

              {/* Penalties */}
              <div className="space-y-2">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Penalties</div>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">AI Ad Disclosure</span><span className="font-mono">{selectedProfile.aiAdPenalty}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">NIL</span><span className="font-mono">{selectedProfile.nilPenalty}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Deepfake</span><span className="font-mono">{selectedProfile.deepfakePenalty}</span></div>
                </div>
              </div>

              {/* Enforcement & Multiplier */}
              <div className="flex gap-4">
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Enforcement</div>
                  <span className="text-[12px] font-medium">{selectedProfile.enforcementIntensity}</span>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Multiplier</div>
                  <span className="text-lg font-mono font-semibold">{selectedProfile.multiplier}x</span>
                </div>
              </div>

              {/* Statute reference */}
              {selectedProfile.statuteReference && (
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Statute</div>
                  <span className="text-[12px] font-mono">{selectedProfile.statuteReference}</span>
                </div>
              )}

              {/* Summary */}
              {selectedProfile.summary && (
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Summary</div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{selectedProfile.summary}</p>
                </div>
              )}

              <Link
                href="/compliance/jurisdictions"
                className="inline-flex items-center gap-1 text-[12px] text-foreground hover:underline mt-2"
              >
                View full details on Jurisdictions page
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Country Detail Sheet */}
      <Sheet open={countryDetailOpen} onOpenChange={setCountryDetailOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[400px] p-0">
          <SheetHeader className="px-4 py-3 border-b border-border/40">
            <SheetTitle className="text-base font-semibold">
              {selectedCountryProfile?.countryName} ({selectedCountryProfile?.countryCode})
            </SheetTitle>
          </SheetHeader>
          {selectedCountryProfile && (
            <div className="px-4 py-3 space-y-4 overflow-y-auto h-[calc(100vh-60px)]">
              {/* Region */}
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Region</div>
                <span className="text-[12px] font-medium">{selectedCountryProfile.region}</span>
              </div>

              {/* Legislation status */}
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                  selectedCountryProfile.legislationStatus === "ENACTED" ? "text-orange-600 bg-orange-500/10" :
                    selectedCountryProfile.legislationStatus === "PROPOSED" ? "text-yellow-600 bg-yellow-500/10" :
                      "text-slate-500 bg-slate-500/10"
                )}>
                  {selectedCountryProfile.legislationStatus}
                </span>
                {selectedCountryProfile.effectiveDate && (
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    Effective: {selectedCountryProfile.effectiveDate}
                  </span>
                )}
              </div>

              {/* Law categories */}
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Law Categories</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCountryProfile.lawCategories.map((cat) => (
                    <span key={cat} className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
                      {cat.replace(/_/g, " ")}
                    </span>
                  ))}
                  {selectedCountryProfile.lawCategories.length === 0 && (
                    <span className="text-[11px] text-muted-foreground">No AI content-specific legislation</span>
                  )}
                </div>
              </div>

              {/* Penalties */}
              <div className="space-y-2">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Penalties</div>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">AI Ad Disclosure</span><span className="font-mono text-right max-w-[200px]">{selectedCountryProfile.aiAdPenalty}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">NIL</span><span className="font-mono text-right max-w-[200px]">{selectedCountryProfile.nilPenalty}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Deepfake</span><span className="font-mono text-right max-w-[200px]">{selectedCountryProfile.deepfakePenalty}</span></div>
                </div>
              </div>

              {/* Enforcement & Multiplier */}
              <div className="flex gap-4">
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Enforcement</div>
                  <span className="text-[12px] font-medium">{selectedCountryProfile.enforcementIntensity}</span>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Multiplier</div>
                  <span className="text-lg font-mono font-semibold">{selectedCountryProfile.multiplier}x</span>
                </div>
              </div>

              {/* Statute reference */}
              {selectedCountryProfile.statuteReference && (
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Statute</div>
                  <span className="text-[12px] font-mono">{selectedCountryProfile.statuteReference}</span>
                </div>
              )}

              {/* Summary */}
              {selectedCountryProfile.summary && (
                <div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Summary</div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{selectedCountryProfile.summary}</p>
                </div>
              )}

              <Link
                href="/compliance/jurisdictions"
                className="inline-flex items-center gap-1 text-[12px] text-foreground hover:underline mt-2"
              >
                View full details on Jurisdictions page
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ComplianceLayout>
  )
}

function AlertRow({ alert }: { alert: ComplianceAlert }) {
  const ts = new Date(alert.timestamp)
  const timeStr = `${ts.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`

  return (
    <tr className="border-b border-border/10 hover:bg-muted/30 transition-colors h-8">
      <td className="px-3 py-1 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{timeStr}</td>
      <td className="px-3 py-1">
        {alert.projectName ? (
          <Link href={`/projects/${alert.projectId}`} className="text-foreground hover:underline truncate block max-w-[140px]">
            {alert.projectName}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 py-1 truncate max-w-[160px]">
        {alert.assetId || alert.modelId || "—"}
      </td>
      <td className="px-3 py-1">
        <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium", alertTypeBadgeColors[alert.type] || "text-slate-600 bg-slate-500/10")}>
          {alert.type.replace(/_/g, " ")}
        </span>
      </td>
      <td className="px-3 py-1">
        <span className={cn("inline-block h-2 w-2 rounded-full", severityColors[alert.severity])} title={alert.severity} />
      </td>
      <td className="px-3 py-1 font-mono text-[11px] text-muted-foreground">{alert.jurisdiction || "—"}</td>
      <td className="px-3 py-1">
        {alert.contractId ? (
          <Link href={`/contracts/${alert.contractId}`} className="font-mono text-[11px] text-primary hover:underline">
            {alert.contractId}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 py-1 text-right">
        <div className="flex items-center justify-end gap-0.5">
          <button className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="View">
            <Eye className="h-3.5 w-3.5" />
          </button>
          {alert.contractId && (
            <Link href={`/contracts/${alert.contractId}`} className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors" title="Go to contract">
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </td>
    </tr>
  )
}
