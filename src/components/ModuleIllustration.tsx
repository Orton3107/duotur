import type { ReactNode } from 'react'
import type { ModuleId } from '../data/types'

interface Props {
  moduleId: ModuleId
  className?: string
}

/** Simple flat-style decorative scenes per topic — no external assets, just inline SVG shapes. */
export function ModuleIllustration({ moduleId, className }: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      {ILLUSTRATIONS[moduleId]}
    </svg>
  )
}

const ILLUSTRATIONS: Record<ModuleId, ReactNode> = {
  travel: (
    <g>
      <circle cx="94" cy="24" r="14" fill="#fff" opacity="0.35" />
      <path d="M18 78 q18-14 36 0 q18-14 36 0" stroke="#fff" strokeWidth="4" fill="none" opacity="0.35" />
      <g transform="translate(60 62) rotate(-25)">
        <path
          d="M-34 0 L-6 -7 L20 -7 Q30 -7 34 0 Q30 7 20 7 L-6 7 Z"
          fill="#fff"
        />
        <path d="M-4 -7 L10 -22 L18 -22 L10 -7 Z" fill="#fff" />
        <path d="M-4 7 L10 22 L18 22 L10 7 Z" fill="#fff" />
        <circle cx="-20" cy="0" r="3" fill="currentColor" opacity="0.4" />
      </g>
    </g>
  ),
  work: (
    <g>
      <rect x="26" y="46" width="68" height="42" rx="4" fill="#fff" opacity="0.95" />
      <rect x="26" y="46" width="68" height="10" rx="4" fill="#fff" />
      <rect x="36" y="62" width="20" height="4" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="36" y="70" width="34" height="4" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="36" y="78" width="26" height="4" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="48" y="30" width="24" height="18" rx="3" fill="#fff" opacity="0.5" />
    </g>
  ),
  family: (
    <g>
      <path d="M60 26 L98 56 L88 56 L88 92 L32 92 L32 56 L22 56 Z" fill="#fff" opacity="0.95" />
      <rect x="52" y="68" width="16" height="24" fill="currentColor" opacity="0.25" />
      <path d="M60 40 l4 -5 h-3 l3 -5 h-8 l3 5 h-3 z" fill="#fff" opacity="0.6" />
    </g>
  ),
  relationships: (
    <g>
      <path
        d="M46 42 C34 30 14 40 14 58 C14 76 46 94 46 94 C46 94 78 76 78 58 C78 40 58 30 46 42 Z"
        fill="#fff"
        opacity="0.9"
        transform="translate(-6 -6) scale(0.9)"
      />
      <path
        d="M74 34 C66 26 52 32 52 44 C52 56 74 68 74 68 C74 68 96 56 96 44 C96 32 82 26 74 34 Z"
        fill="#fff"
        opacity="0.6"
      />
    </g>
  ),
  friends: (
    <g>
      <circle cx="38" cy="42" r="12" fill="#fff" opacity="0.95" />
      <path d="M18 92 q0-26 20-26 q20 0 20 26 Z" fill="#fff" opacity="0.95" />
      <circle cx="82" cy="38" r="14" fill="#fff" opacity="0.7" />
      <path d="M58 94 q0-30 24-30 q24 0 24 30 Z" fill="#fff" opacity="0.7" />
    </g>
  ),
}
