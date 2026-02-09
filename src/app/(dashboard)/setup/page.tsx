"use client"

import { RedirectHome } from "@/components/redirect-home"
import { SetupCard } from "@/components/setup"
import { PageContainer } from "@/components/layout/PageContainer"
import { Button } from "@/components/ui/button"
import { useSetup } from "@/lib/contexts/setup-context"
import { isLegalApp } from "@/lib/legal-app"
import { usePageTitle } from "@/hooks/usePageTitle"
import { X } from "lucide-react"

export default function SetupPage() {
  const legalApp = isLegalApp()

  if (legalApp) {
    return <RedirectHome />
  }

  return <SetupPageContent />
}

function SetupPageContent() {
  usePageTitle("Setup")
  const { setupState, progress, progressPercentage, completeTask, dismissSetup } = useSetup()

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Setup</h1>
          <p className="text-muted-foreground mt-1">
            Complete the steps below to get your workspace ready. You can dismiss and come back later.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {progress} complete
          </span>
          <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={dismissSetup} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 mr-1" />
            Dismiss
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {setupState.categories.map((category) => (
          <SetupCard
            key={category.id}
            category={category}
            onTaskToggle={completeTask}
          />
        ))}
      </div>
    </PageContainer>
  )
}
