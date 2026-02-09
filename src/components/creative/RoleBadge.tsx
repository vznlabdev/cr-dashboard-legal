"use client"

import { cn } from "@/lib/utils"
import { WorkflowRole, WORKFLOW_ROLE_CONFIG } from "@/types/creative"

interface RoleBadgeProps {
  role: WorkflowRole
  size?: "sm" | "md" | "lg"
  showDescription?: boolean
  className?: string
}

export function RoleBadge({
  role,
  size = "md",
  showDescription = false,
  className,
}: RoleBadgeProps) {
  const config = WORKFLOW_ROLE_CONFIG[role]

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  }

  return (
    <div className={cn("inline-flex flex-col", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full font-medium border",
          config.bgColor,
          config.color,
          config.borderColor,
          sizeClasses[size]
        )}
      >
        {config.label}
      </span>
      {showDescription && (
        <span className="text-xs text-muted-foreground mt-1">
          {config.description}
        </span>
      )}
    </div>
  )
}

