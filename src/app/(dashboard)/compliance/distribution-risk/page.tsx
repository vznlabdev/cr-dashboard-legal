"use client"

import { useMemo, useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ComplianceLayout } from "@/components/compliance/ComplianceLayout"
import { usePageTitle } from "@/hooks/usePageTitle"
import { useData } from "@/contexts/data-context"
import { calculateAssetDistributionRisk, type AssetDistributionRiskResult } from "@/lib/distribution-compliance"
import type { ProjectDistribution } from "@/types"
import type { Asset } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MapPin, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const US_STATES_IN_SCOPE = ["CA", "NY", "TX"] as const
const INTL_MARKETS = ["EU", "UK"] as const
const MARKET_LABELS: Record<string, string> = {
  CA: "California",
  NY: "New York",
  TX: "Texas",
  EU: "European Union",
  UK: "United Kingdom",
}

/** Legal: contract → project mapping. Contracts drive the filter; data comes from linked project. */
const CONTRACTS: { contractId: string; name: string; projectId: string }[] = [
  { contractId: "CR-2024-245-NIKE", name: "Nike Summer Campaign", projectId: "1" },
  { contractId: "CR-2024-203-SAMSUNG", name: "Samsung Product Launch", projectId: "2" },
  { contractId: "CR-2024-189-TOYOTA", name: "Toyota Brand Refresh", projectId: "3" },
  { contractId: "CR-2024-267-COKE", name: "Coca-Cola Holiday Spot", projectId: "4" },
  { contractId: "CR-2023-156-ADIDAS", name: "Adidas NILP Agreement", projectId: "5" },
]

const PENALTY_ESTIMATES: Record<string, number> = {
  CA: 2500,
  NY: 1000,
  TX: 1500,
  EU: 10000,
  UK: 5000,
}

function getUsStatesFromDistribution(distribution: ProjectDistribution): string[] {
  if (distribution.us_states?.includes("ALL")) return [...US_STATES_IN_SCOPE]
  return (distribution.us_states ?? []).filter((s) => US_STATES_IN_SCOPE.includes(s as typeof US_STATES_IN_SCOPE[number]))
}

function getIntlFromDistribution(distribution: ProjectDistribution): string[] {
  return (distribution.countries ?? []).filter((c) => INTL_MARKETS.includes(c as typeof INTL_MARKETS[number]))
}

function assetToRiskInput(asset: Asset): { contentType?: string; creatorIds?: string[]; talentRightsVerified?: boolean; platformCompliance?: Record<string, boolean> } {
  const aiMethod = (asset as { aiMethod?: string }).aiMethod
  return {
    contentType: aiMethod === "AI Generative" ? "ai_generated" : undefined,
    creatorIds: asset.creatorIds ?? [],
    talentRightsVerified: (asset as { talentRightsVerified?: boolean }).talentRightsVerified ?? false,
    platformCompliance: (asset as { platformCompliance?: Record<string, boolean> }).platformCompliance,
  }
}

type StateRiskLevel = "green" | "yellow" | "red"

function getStateRiskLevel(marketIssuesByState: Map<string, { count: number; hasHigh: boolean }>, state: string): StateRiskLevel {
  const info = marketIssuesByState.get(state)
  if (!info || info.count === 0) return "green"
  if (info.hasHigh || info.count >= 2) return "red"
  return "yellow"
}

function DistributionRiskContent() {
  usePageTitle("Distribution Risk")
  const searchParams = useSearchParams()
  const contractIdFromUrl = searchParams.get("contract") ?? undefined
  const { projects, getProjectById, getProjectAssets } = useData()

  const [portfolioView, setPortfolioView] = useState<boolean>(false)
  const [selectedContractId, setSelectedContractId] = useState<string>("")

  const contractOptions = useMemo(
    () => CONTRACTS.filter((c) => getProjectById(c.projectId)),
    [getProjectById]
  )

  useEffect(() => {
    if (contractIdFromUrl && CONTRACTS.some((c) => c.contractId === contractIdFromUrl)) {
      setSelectedContractId(contractIdFromUrl)
    } else if (!selectedContractId && contractOptions.length > 0) {
      setSelectedContractId(contractOptions[0].contractId)
    }
  }, [contractIdFromUrl, contractOptions, selectedContractId])

  const selectedContract = selectedContractId ? CONTRACTS.find((c) => c.contractId === selectedContractId) : undefined
  const projectIdForContract = selectedContract?.projectId

  const projectsInScope = useMemo(() => {
    if (portfolioView) {
      return contractOptions
        .map((c) => getProjectById(c.projectId))
        .filter((p): p is NonNullable<typeof p> => p != null && p.distribution != null)
    }
    const p = projectIdForContract ? getProjectById(projectIdForContract) : undefined
    return p && p.distribution ? [p] : []
  }, [portfolioView, contractOptions, projectIdForContract, getProjectById])

  const assetsWithContract = useMemo(() => {
    const out: { asset: Asset; projectId: string; contractId: string; contractName: string }[] = []
    for (const proj of projectsInScope) {
      const contract = CONTRACTS.find((c) => c.projectId === proj.id)
      if (!contract) continue
      const assets = getProjectAssets(proj.id)
      for (const asset of assets) {
        out.push({ asset, projectId: proj.id, contractId: contract.contractId, contractName: contract.name })
      }
    }
    return out
  }, [projectsInScope, getProjectAssets])

  const distribution = useMemo(() => {
    if (projectsInScope.length === 0) return null
    if (projectsInScope.length === 1) return projectsInScope[0].distribution ?? null
    const usStates = new Set<string>()
    const countries = new Set<string>()
    let primary_use = projectsInScope[0].distribution!.primary_use
    const platforms = new Set<string>()
    let start_date = projectsInScope[0].distribution!.start_date
    let end_date = projectsInScope[0].distribution!.end_date
    for (const p of projectsInScope) {
      const d = p.distribution!
      if (d.us_states?.includes("ALL")) US_STATES_IN_SCOPE.forEach((s) => usStates.add(s))
      else d.us_states?.forEach((s) => usStates.add(s))
      d.countries?.forEach((c) => countries.add(c))
      d.platforms?.forEach((pl) => platforms.add(pl))
    }
    return {
      primary_use,
      us_states: Array.from(usStates),
      countries: Array.from(countries),
      platforms: Array.from(platforms),
      start_date,
      end_date,
    } as ProjectDistribution
  }, [projectsInScope])

  const assets = useMemo(() => assetsWithContract.map((x) => x.asset), [assetsWithContract])

  const assetRisksWithContract = useMemo(() => {
    const map = new Map<string, { result: AssetDistributionRiskResult; contractId: string; contractName: string }>()
    for (const { asset, projectId, contractId, contractName } of assetsWithContract) {
      const project = getProjectById(projectId)
      const dist = project?.distribution ?? null
      if (!dist) continue
      const input = assetToRiskInput(asset)
      const result = calculateAssetDistributionRisk(input, dist)
      map.set(asset.id, { result, contractId, contractName })
    }
    return map
  }, [assetsWithContract, getProjectById])

  const summary = useMemo(() => {
    let highRiskAssets = 0
    const marketsWithIssuesSet = new Set<string>()
    let totalPenaltyExposure = 0
    for (const [, { result }] of assetRisksWithContract) {
      if (result.status === "blocked" || result.status === "needs_review") highRiskAssets++
      for (const m of result.marketIssues) {
        marketsWithIssuesSet.add(m.market)
      }
      totalPenaltyExposure += result.totalPenaltyExposure
    }
    return {
      totalContracts: portfolioView ? projectsInScope.length : 1,
      highRiskAssets,
      marketsWithIssues: marketsWithIssuesSet.size,
      totalPenaltyExposure,
    }
  }, [assetRisksWithContract, portfolioView, projectsInScope.length])

  const penaltyByJurisdiction = useMemo(() => {
    const map = new Map<string, number>()
    for (const [, { result }] of assetRisksWithContract) {
      for (const mi of result.marketIssues) {
        const amt = PENALTY_ESTIMATES[mi.market] ?? 0
        map.set(mi.market, (map.get(mi.market) ?? 0) + amt)
      }
    }
    return map
  }, [assetRisksWithContract])

  const usStatesInDistribution = distribution ? getUsStatesFromDistribution(distribution) : []
  const intlInDistribution = distribution ? getIntlFromDistribution(distribution) : []

  const marketIssuesByState = useMemo(() => {
    const map = new Map<string, { count: number; hasHigh: boolean }>()
    for (const state of US_STATES_IN_SCOPE) {
      map.set(state, { count: 0, hasHigh: false })
    }
    for (const [, { result }] of assetRisksWithContract) {
      for (const mi of result.marketIssues) {
        if (!US_STATES_IN_SCOPE.includes(mi.market as typeof US_STATES_IN_SCOPE[number])) continue
        const cur = map.get(mi.market) ?? { count: 0, hasHigh: false }
        map.set(mi.market, {
          count: cur.count + 1,
          hasHigh: cur.hasHigh || mi.riskLevel === "high" || mi.riskLevel === "blocked",
        })
      }
    }
    return map
  }, [assetRisksWithContract])

  const assetsByState = useMemo(() => {
    const map = new Map<string, { asset: Asset; result: AssetDistributionRiskResult }[]>()
    for (const state of US_STATES_IN_SCOPE) {
      map.set(state, [])
    }
    for (const { asset, result } of assetsWithContract.map((a) => ({ asset: a.asset, result: assetRisksWithContract.get(a.asset.id)?.result })).filter((x): x is { asset: Asset; result: AssetDistributionRiskResult } => x.result != null)) {
      for (const mi of result.marketIssues) {
        if (!US_STATES_IN_SCOPE.includes(mi.market as typeof US_STATES_IN_SCOPE[number])) continue
        const list = map.get(mi.market) ?? []
        list.push({ asset, result })
        map.set(mi.market, list)
      }
    }
    return map
  }, [assetsWithContract, assetRisksWithContract])

  const internationalRows = useMemo(() => {
    return intlInDistribution.map((country) => {
      let riskLevel: string = "Low"
      const issues: string[] = []
      let affectedCount = 0
      for (const { asset } of assetsWithContract) {
        const entry = assetRisksWithContract.get(asset.id)
        if (!entry) continue
        const mi = entry.result.marketIssues.find((m) => m.market === country)
        if (!mi) continue
        affectedCount++
        if (mi.riskLevel === "high" || mi.riskLevel === "blocked") riskLevel = "High"
        else if (mi.riskLevel === "medium" && riskLevel !== "High") riskLevel = "Medium"
        if (mi.needed) issues.push(mi.needed)
      }
      const uniqueIssues = Array.from(new Set(issues))
      return {
        country,
        riskLevel,
        issues: uniqueIssues.join("; ") || "—",
        affectedAssets: affectedCount,
      }
    })
  }, [intlInDistribution, assetsWithContract, assetRisksWithContract])

  const assetRiskRows = useMemo(() => {
    return assetsWithContract
      .map(({ asset, contractId, contractName }) => {
        const entry = assetRisksWithContract.get(asset.id)
        if (!entry) return null
        const { result } = entry
        const hasIssues = result.marketIssues.length > 0
        if (!hasIssues) return null
        const markets = result.marketIssues.map((m) => m.market).join(", ")
        const topIssue = result.marketIssues[0]?.needed ?? "—"
        return {
          asset,
          result,
          contractId,
          contractName,
          markets,
          status: result.status,
          topIssue,
        }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)
  }, [assetsWithContract, assetRisksWithContract])

  const [clickedState, setClickedState] = useState<string | null>(null)

  if (!distribution && !portfolioView) {
    return (
      <ComplianceLayout title="Distribution Risk">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Contract</span>
            <Select value={selectedContractId} onValueChange={setSelectedContractId}>
              <SelectTrigger className="w-[320px]">
                <SelectValue placeholder="Select contract" />
              </SelectTrigger>
              <SelectContent>
                {contractOptions.map((c) => (
                  <SelectItem key={c.contractId} value={c.contractId}>
                    {c.contractId} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={portfolioView} onChange={(e) => setPortfolioView(e.target.checked)} className="rounded border-border" />
              Portfolio View (all contracts)
            </label>
          </div>
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No distribution configured for this contract. Set distribution in project settings to see risk analysis.
            </CardContent>
          </Card>
        </div>
      </ComplianceLayout>
    )
  }

  return (
    <ComplianceLayout title="Distribution Risk">
      <div className="flex flex-col gap-6">
        {/* Contract filter + Portfolio View toggle */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Contract</span>
          <Select value={selectedContractId} onValueChange={setSelectedContractId} disabled={portfolioView}>
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select contract" />
            </SelectTrigger>
            <SelectContent>
              {contractOptions.map((c) => (
                <SelectItem key={c.contractId} value={c.contractId}>
                  {c.contractId} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={portfolioView} onChange={(e) => setPortfolioView(e.target.checked)} className="rounded border-border" />
            Portfolio View (aggregate across all active contracts)
          </label>
        </div>

        {/* Total penalty exposure + breakdown by jurisdiction */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">Penalty Exposure</CardTitle>
            <p className="text-sm text-muted-foreground">Total and by jurisdiction for current scope.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">${summary.totalPenaltyExposure.toLocaleString()}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {Array.from(penaltyByJurisdiction.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([market, amount]) => (
                  <div key={market}>
                    <span className="text-muted-foreground">{MARKET_LABELS[market] ?? market}:</span>{" "}
                    <span className="font-mono font-medium">${amount.toLocaleString()}</span>
                  </div>
                ))}
              {penaltyByJurisdiction.size === 0 && (
                <span className="text-muted-foreground">No penalty exposure in current scope.</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{portfolioView ? "Contracts in Scope" : "Contract"}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{portfolioView ? summary.totalContracts : "1"}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Risk Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{summary.highRiskAssets}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Markets with Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">{summary.marketsWithIssues}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Penalty Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold">${summary.totalPenaltyExposure.toLocaleString()}</span>
            </CardContent>
          </Card>
        </div>

        {/* US states */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              US Markets
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Green: no issues. Yellow: disclosure needed. Red: multiple or high-severity violations. Click a state to see affected assets.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {usStatesInDistribution.length === 0 ? (
                <span className="text-sm text-muted-foreground">No US states in distribution.</span>
              ) : (
                usStatesInDistribution.map((state) => {
                  const level = getStateRiskLevel(marketIssuesByState, state)
                  return (
                    <button
                      key={state}
                      type="button"
                      onClick={() => setClickedState(clickedState === state ? null : state)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                        level === "green" && "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
                        level === "yellow" && "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100",
                        level === "red" && "border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
                      )}
                    >
                      {state} – {MARKET_LABELS[state] ?? state}
                    </button>
                  )
                })
              )}
            </div>
            {clickedState && assetsByState.get(clickedState) && (
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="mb-2 text-sm font-medium">Assets with issues in {clickedState}</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {(assetsByState.get(clickedState) ?? []).map(({ asset }) => (
                    <li key={asset.id}>
                      <Link
                        href={`/creative/assets/${asset.id}`}
                        className="text-primary hover:underline"
                      >
                        {asset.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* International markets table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">International Markets</CardTitle>
            <p className="text-sm text-muted-foreground">Risk by country for the selected contract{portfolioView ? "s" : ""}.</p>
          </CardHeader>
          <CardContent>
            {internationalRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No international markets in distribution.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead className="text-right">Affected Assets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {internationalRows.map((row) => (
                    <TableRow key={row.country}>
                      <TableCell className="font-medium">{MARKET_LABELS[row.country] ?? row.country}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            row.riskLevel === "High" && "bg-red-500/10 text-red-700",
                            row.riskLevel === "Medium" && "bg-amber-500/10 text-amber-700",
                            row.riskLevel === "Low" && "bg-emerald-500/10 text-emerald-700"
                          )}
                        >
                          {row.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{row.issues}</TableCell>
                      <TableCell className="text-right">{row.affectedAssets}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Asset risk table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Asset Risk</CardTitle>
            <p className="text-sm text-muted-foreground">Assets with distribution compliance issues.</p>
          </CardHeader>
          <CardContent>
            {assetRiskRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assets with issues for this {portfolioView ? "portfolio" : "contract"}.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Contract Exposure</TableHead>
                    <TableHead>Markets</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Top Issue</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetRiskRows.map(({ asset, result, contractId, contractName, markets, status, topIssue }) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>
                        <Link href={`/contracts/${contractId}`} className="font-mono text-sm text-primary hover:underline">
                          {contractId}
                        </Link>
                        <span className="ml-1 text-xs text-muted-foreground truncate block">{contractName}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{markets}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            status === "blocked" && "bg-red-500/10 text-red-700",
                            status === "needs_review" && "bg-amber-500/10 text-amber-700",
                            status === "clear" && "bg-emerald-500/10 text-emerald-700"
                          )}
                        >
                          {status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{topIssue}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/creative/assets/${asset.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ComplianceLayout>
  )
}

export default function DistributionRiskPage() {
  return (
    <Suspense
      fallback={
        <ComplianceLayout title="Distribution Risk">
          <div className="space-y-3">
            <Skeleton className="h-12 w-48 rounded-md" />
            <Skeleton className="h-64 rounded-md" />
            <Skeleton className="h-32 rounded-md" />
          </div>
        </ComplianceLayout>
      }
    >
      <DistributionRiskContent />
    </Suspense>
  )
}
