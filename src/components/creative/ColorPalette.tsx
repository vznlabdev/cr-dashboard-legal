"use client"

import { BrandColor } from "@/types/creative"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ColorPaletteProps {
  colors: BrandColor[]
  showLabels?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ColorPalette({
  colors,
  showLabels = true,
  size = "md",
  className,
}: ColorPaletteProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const copyToClipboard = (color: BrandColor) => {
    navigator.clipboard.writeText(color.hex)
    setCopiedId(color.id)
    toast.success(`Copied ${color.hex}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Group colors by type
  const primaryColors = colors.filter((c) => c.type === "primary")
  const secondaryColors = colors.filter((c) => c.type === "secondary")
  const accentColors = colors.filter((c) => c.type === "accent")

  const renderColorGroup = (groupColors: BrandColor[], title: string) => {
    if (groupColors.length === 0) return null

    return (
      <div className="space-y-2">
        {showLabels && (
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </h4>
        )}
        <div className="flex flex-wrap gap-3">
          {groupColors.map((color) => (
            <div key={color.id} className="group">
              <button
                onClick={() => copyToClipboard(color)}
                className={cn(
                  sizeClasses[size],
                  "relative rounded-lg border border-border shadow-sm transition-all",
                  "hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                style={{ backgroundColor: color.hex }}
                title={`${color.name} - ${color.hex}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                  {copiedId === color.id ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Copy className="h-4 w-4 text-white" />
                  )}
                </div>
              </button>
              {showLabels && (
                <div className="mt-1.5 text-center">
                  <p className="text-xs font-medium truncate max-w-[60px]">
                    {color.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {color.hex}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {renderColorGroup(primaryColors, "Primary")}
      {renderColorGroup(secondaryColors, "Secondary")}
      {renderColorGroup(accentColors, "Accent")}
    </div>
  )
}

// Compact version for inline use
interface ColorSwatchesProps {
  colors: BrandColor[]
  max?: number
  className?: string
}

export function ColorSwatches({ colors, max = 5, className }: ColorSwatchesProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {colors.slice(0, max).map((color) => (
        <div
          key={color.id}
          className="h-5 w-5 rounded-full border border-border shadow-sm"
          style={{ backgroundColor: color.hex }}
          title={`${color.name} - ${color.hex}`}
        />
      ))}
      {colors.length > max && (
        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
          <span className="text-[10px] text-muted-foreground">+{colors.length - max}</span>
        </div>
      )}
    </div>
  )
}

