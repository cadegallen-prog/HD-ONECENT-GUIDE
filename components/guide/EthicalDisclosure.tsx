import { ShieldAlert } from "lucide-react"

export function EthicalDisclosure() {
  return (
    <div className="bg-[var(--bg-elevated)] border-l-4 border-[var(--status-warning)] p-4 rounded-r-md my-8 not-prose shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-[var(--status-warning)] mt-0.5" />
        <div>
          <h3 className="font-bold text-[var(--text-primary)] mb-1 text-base">
            Ethical Use Statement
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This guide is for <strong>educational purposes only</strong>. PennyCentral does not
            encourage policy violations, employee confrontation, or misuse of retail systems. Always
            respect store employees and follow local store policies.
          </p>
        </div>
      </div>
    </div>
  )
}
