"use client"

import { cn } from "@/lib/utils"

interface WorkloadBarProps {
  current: number
  max: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function WorkloadBar({
  current,
  max,
  showLabel = true,
  size = "md",
  className,
}: WorkloadBarProps) {
  const percentage = Math.min((current / max) * 100, 100)
  
  const getLoadColor = (pct: number) => {
    if (pct >= 90) return "bg-red-500"
    if (pct >= 70) return "bg-amber-500"
    if (pct >= 50) return "bg-yellow-500"
    return "bg-emerald-500"
  }

  const getLoadLabel = (pct: number) => {
    if (pct >= 90) return "Overloaded"
    if (pct >= 70) return "High"
    if (pct >= 50) return "Moderate"
    if (pct > 0) return "Light"
    return "Available"
  }

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {getLoadLabel(percentage)}
          </span>
          <span className="font-medium tabular-nums">
            {current}/{max}
          </span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-muted/50", sizeClasses[size])}>
        <div
          className={cn(
            "rounded-full transition-all duration-300",
            sizeClasses[size],
            getLoadColor(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Compact version for inline use
interface WorkloadIndicatorProps {
  current: number
  max: number
  className?: string
}

export function WorkloadIndicator({ current, max, className }: WorkloadIndicatorProps) {
  const percentage = Math.min((current / max) * 100, 100)
  
  const getLoadColor = (pct: number) => {
    if (pct >= 90) return "text-red-500"
    if (pct >= 70) return "text-amber-500"
    if (pct >= 50) return "text-yellow-500"
    return "text-emerald-500"
  }

  return (
    <span className={cn("text-xs font-medium tabular-nums", getLoadColor(percentage), className)}>
      {current}/{max}
    </span>
  )
}

