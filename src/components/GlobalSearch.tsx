"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText, User, AlertTriangle, FileCheck, MapPin } from "lucide-react"
import { searchLegalEntities, LEGAL_SEARCH_ENTITY_LABELS, type LegalSearchResult, type LegalSearchEntityType } from "@/lib/legal-search"
import { cn } from "@/lib/utils"

const ENTITY_ICONS: Record<LegalSearchEntityType, typeof FileText> = {
  contract: FileText,
  creator: User,
  compliance_alert: AlertTriangle,
  consent_record: FileCheck,
  jurisdiction: MapPin,
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim() ? searchLegalEntities(query) : []
  const byType = results.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {} as Record<LegalSearchEntityType, LegalSearchResult[]>)

  const typeOrder: LegalSearchEntityType[] = [
    "contract",
    "creator",
    "compliance_alert",
    "consent_record",
    "jurisdiction",
  ]

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery("")
      focusInput()
    }
  }, [open, focusInput])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(true)
      }
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl p-0 gap-0 overflow-hidden"
        showCloseButton={true}
        onPointerDownOutside={() => onOpenChange(false)}
      >
        <DialogTitle className="sr-only">Search legal dashboard</DialogTitle>
        <div className="relative border-b border-border px-3 py-2">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search contracts, creators, compliance, consent, jurisdictions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
            autoComplete="off"
          />
        </div>
        <ScrollArea className="max-h-[min(60vh,400px)]">
          {query.trim() === "" ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Type to search contracts, creators, compliance alerts, consent records, and jurisdictions.
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <div className="py-2">
              {typeOrder.map((type) => {
                const items = byType[type]
                if (!items?.length) return null
                const Icon = ENTITY_ICONS[type]
                const label = LEGAL_SEARCH_ENTITY_LABELS[type]
                return (
                  <div key={type} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    {items.map((item) => (
                      <Link
                        key={`${item.type}-${item.id}`}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/50 focus:bg-accent/50 focus:outline-none",
                          "border-l-2 border-transparent hover:border-primary/50 focus:border-primary/50"
                        )}
                        onClick={() => onOpenChange(false)}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
