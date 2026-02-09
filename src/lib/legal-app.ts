/**
 * Legal User Dashboard mode.
 * When true, the app shows only legal-counsel views (Contracts, Compliance & Risk,
 * Talent Rights, Legal Workspace). Target: insurance legal counsel (e.g. Lloyd's of London).
 * Set NEXT_PUBLIC_LEGAL_APP=true in .env.local to enable.
 */
export function isLegalApp(): boolean {
  return process.env.NEXT_PUBLIC_LEGAL_APP === "true";
}
