import React, { useState } from 'react'
import { Card, CardTile, intensityStyle } from '../ui.jsx'

const BUCKETS = [
  { key: 'all', label: 'All attempts' },
  { key: '1', label: 'Attempt 1' },
  { key: '2-3', label: 'Attempts 2–3' },
  { key: '4+', label: 'Attempts 4+' },
]

// Section 2 — a screenshot-style replay of the card sort, with a heatmap overlay
// that can be filtered by attempt number.
export default function Replay({ data }) {
  const [bucket, setBucket] = useState('all')
  const zones = data.zones
  const cards = data.cards
  const correctMap = {} // card -> zone
  Object.entries(data.correct_state).forEach(([dropNum, list]) =>
    list.forEach((c) => (correctMap[c] = `drop${dropNum}`)),
  )

  const view = data.heatmap[bucket]

  return (
    <Card className="p-6">
      {/* The actual question prompt, verbatim from the source */}
      {data.meta.prompt && (
        <p className="mb-4 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-600">
          “{data.meta.prompt}”
        </p>
      )}

      {/* The interface mockup: the answer key as it appears in the activity */}
      <p className="mb-3 text-sm font-medium text-slate-500">The activity (correct arrangement)</p>
      <div className="grid gap-3 md:grid-cols-3">
        {zones.map((z) => (
          <div key={z} className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {data.zone_labels[z]}
            </p>
            <div className="space-y-2">
              {(data.correct_state[z.replace('drop', '')] || []).map((c) => (
                <CardTile key={c} id={c} label={data.card_labels[c]} tone="correct" compact />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* The decoy tray — cards that belong nowhere */}
      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-600">
          Distractors — should stay in the tray (no zone)
        </p>
        <div className="flex flex-wrap gap-2">
          {data.decoys.map((c) => (
            <CardTile key={c} id={c} label={data.card_labels[c]} tone="decoy" compact />
          ))}
        </div>
      </div>

      {/* Heatmap overlay + attempt filter */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          Where each card actually landed{' '}
          <span className="text-slate-400">({view.n_submissions.toLocaleString()} placements)</span>
        </p>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {BUCKETS.map((b) => (
            <button
              key={b.key}
              onClick={() => setBucket(b.key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                bucket === b.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <Heatmap data={data} view={view} zones={zones} cards={cards} correctMap={correctMap} />

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <Legend swatch="bg-green-500" label="placed in the correct zone" />
        <Legend swatch="bg-red-500" label="misplaced (darker = more students)" />
        <span>Each row sums to 100% of the times that card was placed.</span>
      </div>
    </Card>
  )
}

function Heatmap({ data, view, zones, cards, correctMap }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-sm">
        <thead>
          <tr>
            <th className="w-1/3 text-left text-xs font-medium text-slate-400">Card</th>
            {zones.map((z) => (
              <th key={z} className="px-2 text-center text-xs font-medium text-slate-400">
                {data.zone_labels[z]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cards.map((c) => {
            const total = view.totals[c] || 0
            const isDecoy = data.decoys.includes(c)
            return (
              <tr key={c}>
                <td className="py-1 pr-2">
                  <CardTile
                    id={c}
                    label={data.card_labels[c]}
                    tone={isDecoy ? 'decoy' : 'neutral'}
                    compact
                  />
                </td>
                {zones.map((z) => {
                  const n = view.grid[c][z] || 0
                  const frac = total ? n / total : 0
                  const isCorrect = !isDecoy && correctMap[c] === z
                  const kind = isCorrect ? 'value' : 'error'
                  return (
                    <td key={z} className="p-0">
                      <div
                        className={`flex h-11 flex-col items-center justify-center rounded-md tnum ${
                          isCorrect ? 'ring-2 ring-green-500' : ''
                        }`}
                        style={intensityStyle(frac, kind)}
                        title={`${n} placements`}
                      >
                        <span className="text-sm font-semibold">{total ? Math.round((frac * 100)) : 0}%</span>
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Legend({ swatch, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-3 w-3 rounded-sm ${swatch}`} />
      {label}
    </span>
  )
}
