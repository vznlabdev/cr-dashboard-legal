"use client"

import { BrandFont } from "@/types/creative"
import { cn } from "@/lib/utils"
import { Type } from "lucide-react"

interface FontPreviewProps {
  fonts: BrandFont[]
  className?: string
}

export function FontPreview({ fonts, className }: FontPreviewProps) {
  if (fonts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No fonts specified
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {fonts.map((font) => (
        <div
          key={font.id}
          className="p-4 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {font.type === "primary" ? "Primary Font" : "Secondary Font"}
            </span>
          </div>
          
          <h3
            className="text-2xl font-semibold mb-1"
            style={{ fontFamily: font.name }}
          >
            {font.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3">
            {font.usage}
          </p>
          
          <div
            className="text-lg"
            style={{ fontFamily: font.name }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
          
          <div
            className="text-sm text-muted-foreground mt-2"
            style={{ fontFamily: font.name }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
            <br />
            abcdefghijklmnopqrstuvwxyz
            <br />
            0123456789
          </div>
        </div>
      ))}
    </div>
  )
}

