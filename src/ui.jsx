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

export function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
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

// seconds -> "6m 12s" (or "—" when unknown)
export function fmtTime(s) {
  if (!s || s <= 0) return '—'
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return m ? `${m}m ${sec}s` : `${sec}s`
}
