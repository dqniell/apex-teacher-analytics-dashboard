import { useState } from 'react'
import { Card, ZoneText, RichText, Toggle, fmtPct } from '../ui.jsx'

// Top incorrect answers, each shown on the actual card-sort board so a teacher can
// see exactly what went wrong: a card in the wrong spot, or a card left unplaced.
// Blank boards are excluded. The ranking rule is spelled out on the page; with
// `toggle` the reader can switch between ranking by students and by checks.
const RULES = {
  students:
    'Ranked by how many students checked each wrong arrangement at least once. Ties go to the one checked more often, then to the one students reached earlier.',
  checks:
    'Ranked by how many times each wrong arrangement was checked, counting repeats by the same student. Ties go to the one more students checked.',
}

export default function TopIncorrect({ data, view, toggle = false }) {
  const [metric, setMetric] = useState('students') // 'students' | 'checks'

  const correctMap = {} // card -> the zone it belongs in
  Object.entries(data.correct_state).forEach(([d, list]) =>
    list.forEach((c) => (correctMap[c] = `drop${d}`)),
  )
  const list = view.top_incorrect[metric]
  const other = metric === 'checks' ? 'students' : 'checks'

  return (
    <Card className="p-6">
      {/* toolbar: ranking rule + optional ranking-metric toggle */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-xs text-slate-500">
          {RULES[metric]} Correct and blank boards are left out.
        </p>
        {toggle && (
          <Toggle
            label="Rank by"
            value={metric}
            onChange={setMetric}
            options={[
              ['Students', 'students'],
              ['Checks', 'checks'],
            ]}
          />
        )}
      </div>

      {/* answer key, for reference */}
      <p className="mb-2 text-xs text-slate-500">
        <span className="text-green-600">✓</span> Correct answer
      </p>
      <Board state={data.correct_state} data={data} correctMap={correctMap} reference />

      {/* legend */}
      <div className="mt-5 mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <Legend className="border-slate-200 bg-white" label="correctly placed" />
        <Legend className="border-red-200 bg-red-50" label="wrong spot" />
        <Legend className="border-dashed border-slate-300 bg-white" label="not placed" />
      </div>

      {/* the wrong arrangements */}
      {list.length === 0 && <p className="text-sm text-slate-400">No incorrect checks.</p>}
      <div className="space-y-6">
        {list.map((combo, i) => (
          <div key={combo.config}>
            <div className="mb-2 flex flex-wrap items-baseline gap-2 text-sm">
              <span className="w-5 text-slate-400 tnum">#{i + 1}</span>
              <span className="font-semibold text-slate-800 tnum">{combo[metric]}</span>
              <span className="text-slate-500">{metric}</span>
              {metric === 'students' && (
                <span className="text-slate-500 tnum">({fmtPct(combo.pct_students)} of students who attempted)</span>
              )}
              <span className="text-xs text-slate-400 tnum">
                · {combo[other]} {other} · typically on check #{combo.median_check}
              </span>
            </div>
            <Board state={combo.state} data={data} correctMap={correctMap} />
          </div>
        ))}
      </div>
    </Card>
  )
}

// One card-sort board: a column per zone. Every card shows its expression.
// On a wrong board, misplaced cards are red and any card that belongs in a zone
// but was never placed shows as a faded "not placed" ghost.
function Board({ state, data, correctMap, reference }) {
  const zones = data.zones
  const placedAnywhere = new Set(Object.values(state).flat())

  return (
    <div
      className="grid gap-3 overflow-x-auto"
      style={{ gridTemplateColumns: `repeat(${zones.length}, minmax(7rem, 1fr))` }}
    >
      {zones.map((z) => {
        const num = z.replace('drop', '')
        const placed = state[num] || []
        const missing = reference
          ? []
          : (data.correct_state[num] || []).filter((c) => !placedAnywhere.has(c))

        return (
          <div key={z} className="rounded-md border border-slate-200 p-2.5">
            <p className="mb-2 min-h-[2.5em] text-[11px] leading-tight text-slate-400">
              <ZoneText label={data.zone_labels[z]} />
            </p>
            <div className="space-y-1.5">
              {placed.length === 0 && missing.length === 0 && (
                <span className="text-xs text-slate-300">—</span>
              )}
              {placed.map((c) => (
                <Chip
                  key={c}
                  id={c}
                  tex={data.card_labels[c]}
                  tone={reference || correctMap[c] === z ? 'ok' : 'wrong'}
                />
              ))}
              {missing.map((c) => (
                <Chip key={`m${c}`} id={c} tex={data.card_labels[c]} tone="missing" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Chip({ id, tex, tone }) {
  const box = {
    ok: 'border-slate-200 text-slate-700',
    wrong: 'border-red-200 bg-red-50 text-red-700',
    missing: 'border-dashed border-slate-300 text-slate-400',
  }
  const badge = {
    ok: 'bg-slate-100 text-slate-500',
    wrong: 'bg-red-100 text-red-600',
    missing: 'bg-slate-100 text-slate-400',
  }
  return (
    <div className={`flex items-center gap-1.5 rounded border px-1.5 py-1 ${box[tone]}`}>
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-semibold tnum ${badge[tone]}`}
      >
        {id}
      </span>
      <RichText text={tex} className="text-xs" />
    </div>
  )
}

function Legend({ className, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded border ${className}`} />
      {label}
    </span>
  )
}
