// Shared, minimal UI primitives. No gradients, no shadows beyond a hairline.
import React from 'react'
import Tex from './Tex.jsx'

export const GREEN = '#16a34a' // green-600  (success)
export const RED = '#dc2626'   // red-600    (high-frequency error)
export const SLATE = '#475569' // slate-600

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${className}`}>
      {children}
    </div>
  )
}

export function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

// Hover / keyboard-focus tooltip. `tip` may be any node (rich text included).
export function Tip({ tip, children, align = 'center', className = '' }) {
  const pos = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'left-0',
    right: 'right-0',
  }[align]
  return (
    <span tabIndex={0} className={`group relative inline-flex cursor-help outline-none ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none invisible absolute bottom-full z-30 mb-2 w-72 max-w-[80vw] ${pos} rounded-md bg-slate-900 px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100`}
      >
        {tip}
      </span>
    </span>
  )
}

// Small ⓘ marker that carries a definition tooltip.
export function Info({ tip, align }) {
  return (
    <Tip tip={tip} align={align} className="ml-1 align-middle">
      <span className="text-[11px] text-slate-400 hover:text-slate-600" aria-label="Definition">
        ⓘ
      </span>
    </Tip>
  )
}

// Segmented control: options = [[label, value], ...]
export function Toggle({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      {label && <span>{label}</span>}
      <div className="flex gap-1 rounded-md bg-slate-100 p-0.5">
        {options.map(([text, val]) => (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={`rounded px-2.5 py-1 transition ${
              value === val ? 'bg-white text-slate-700 shadow-sm' : 'hover:text-slate-600'
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

// Renders a "rich" string from the builder: prose stays in the UI font, and any
// math segment wrapped in \( \) is typeset with KaTeX. Handles cards, zones, and
// question prompts uniformly (prose-only, math-only, or mixed).
export function RichText({ text, className = '' }) {
  const s = String(text ?? '')
  if (!s) return null
  const parts = s.split(/(\\\(.*?\\\))/gs)
  return (
    <span className={className}>
      {parts.filter((p) => p !== '').map((p, i) => {
        const m = /^\\\((.*)\\\)$/s.exec(p)
        return m ? <Tex key={i} tex={m[1]} /> : <span key={i}>{p}</span>
      })}
    </span>
  )
}

// Back-compat alias — zones are rich strings too.
export const ZoneText = ({ label, className }) => <RichText text={label} className={className} />

// Zone id -> its label; the pseudo-zone "tray" means the card was left out.
export function zoneLabel(data, z) {
  if (!z || z === 'tray') return 'left out (the tray)'
  return data.zone_labels[z] ?? z
}

// A single draggable "card" rendered with its (rich) label.
export function CardTile({ id, label, tone = 'neutral', compact = false }) {
  const tones = {
    neutral: 'border-slate-300 bg-white text-slate-800',
    correct: 'border-green-300 bg-green-50 text-green-900',
    decoy: 'border-red-300 bg-red-50 text-red-900',
  }
  return (
    <div
      className={`flex items-center gap-2 rounded-md border ${tones[tone]} ${
        compact ? 'px-2 py-1' : 'px-3 py-2'
      }`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-900/5 text-[11px] font-bold text-slate-500 tnum">
        {id}
      </span>
      <RichText text={label} className={`${compact ? 'text-xs' : 'text-sm'} leading-tight`} />
    </div>
  )
}

// Green→red intensity background for a 0..1 fraction.
export function intensityStyle(frac, kind = 'value') {
  if (frac <= 0) return { background: '#f8fafc', color: '#cbd5e1' }
  const a = Math.min(1, Math.max(0.08, frac))
  const rgb = kind === 'error' ? '220,38,38' : '22,163,74'
  return {
    background: `rgba(${rgb},${a})`,
    color: a > 0.55 ? '#fff' : '#0f172a',
  }
}

export function pct(n, d) {
  if (!d) return 0
  return Math.round((1000 * n) / d) / 10
}

// 12.0 -> "12%", 7.14 -> "7.1%", null -> "—"
export function fmtPct(v) {
  if (v == null) return '—'
  return `${Number.isInteger(v) ? v : v.toFixed(1).replace(/\.0$/, '')}%`
}

// seconds -> "6m 12s" (or "—" when unknown)
export function fmtTime(s) {
  if (s == null || s < 0) return '—'
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return m ? `${m}m ${sec}s` : `${sec}s`
}

export const CHECK_DEF =
  'A check is one press of the “Check Me” button. Moving cards around is not a check.'

// Check-group label from the builder ("1", "2–3", "11+") -> "1st check", "Checks 2–3"
export function checkLabel(label) {
  if (label === '1') return '1st check'
  return /^\d+$/.test(label) ? `Check ${label}` : `Checks ${label}`
}
