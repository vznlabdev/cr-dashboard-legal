"use client"

import { useEffect, useRef } from "react"

const BASE_TITLE = "Legal Dashboard"

/**
 * Sets document.title for the current page. Only updates when title changes
 * to avoid flicker from restore-on-unmount (e.g. under Strict Mode).
 */
export function usePageTitle(title: string) {
  const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE
  const prevTitle = useRef<string | null>(null)

  useEffect(() => {
    if (prevTitle.current === fullTitle) return
    prevTitle.current = fullTitle
    document.title = fullTitle
    return () => {
      prevTitle.current = null
    }
  }, [fullTitle])
}
