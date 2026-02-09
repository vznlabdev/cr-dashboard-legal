"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Redirects to home without any toast. Used for routes that are not available
 * in Legal view so users are sent to dashboard instead of seeing an error.
 */
export function RedirectHome() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/")
  }, [router])
  return null
}
