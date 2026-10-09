import React, { useState } from 'react'
import INDEX from '../index.json'
import { Card, CardTile, RichText, Tip, Toggle, checkLabel, intensityStyle, zoneLabel } from '../ui.jsx'

// In-depth: a screenshot-style replay of the card sort, with a heatmap overlay that
// can be filtered by check number, in simple (1 / 2–3 / 4+) or detailed groups.
export default function Replay({ data, view }) {
  const [grouping, setGrouping] = useState('simple') // 'simple' | 'detailed'
  const [bucket, setBucket] = useState('all')
  const groups = [{ key: 'all', label: 'All checks' }, ...INDEX.check_groups[grouping]]
  const key = groups.some((g) => g.key === bucket) ? bucket : 'all'
  const zones = data.zones
  const cards = data.cards
  const correctMap = {} // card -> zone
  Object.entries(data.correct_state).forEach(([dropNum, list]) =>
    list.forEach((c) => (correctMap[c] = `drop${dropNum}`)),
  )

  const heat = view.heatmap[key]

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
              <RichText text={data.zone_labels[z]} />
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

      {/* Heatmap overlay + check-number filter */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          Where each card actually landed{' '}
          <span className="text-slate-400">({heat.n_checks.toLocaleString()} checks)</span>
        </p>
        <Toggle
          label="Groups"
          value={grouping}
          onChange={setGrouping}
          options={[
            ['Simple', 'simple'],
            ['Detailed', 'detailed'],
          ]}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
        {groups.map((b) => (
          <button
            key={b.key}
            onClick={() => setBucket(b.key)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              key === b.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {b.key === 'all' ? b.label : checkLabel(b.label)}
          </button>
        ))}
      </div>

      <Heatmap data={data} view={heat} zones={zones} cards={cards} correctMap={correctMap} />

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <Legend swatch="bg-green-500" label="placed in the correct zone" />
        <Legend swatch="bg-red-500" label="misplaced (darker = more often)" />
        <span>Each row is out of the checks where that card was placed somewhere. Hover a cell for counts.</span>
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
                <RichText text={data.zone_labels[z]} />
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
                      <Tip
                        className="w-full"
                        tip={
                          <>
                            {total ? Math.round(frac * 100) : 0}% of checks that included card {c}{' '}
                            put it in <RichText text={zoneLabel(data, z)} /> ({n} of {total} checks,{' '}
                            {view.students_grid[c][z]} students).
                          </>
                        }
                      >
                        <div
                          className={`flex h-11 w-full flex-col items-center justify-center rounded-md tnum ${
                            isCorrect ? 'ring-2 ring-green-500' : ''
                          }`}
                          style={intensityStyle(frac, kind)}
                        >
                          <span className="text-sm font-semibold">{total ? Math.round(frac * 100) : 0}%</span>
                        </div>
                      </Tip>
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
