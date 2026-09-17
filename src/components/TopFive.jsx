import React from 'react'
import { Card, GREEN, RED } from '../ui.jsx'

// Section 3 — common paths to success + the most common exact wrong configs.
export default function TopFive({ data }) {
  const correctMap = {}
  Object.entries(data.correct_state).forEach(([d, list]) =>
    list.forEach((c) => (correctMap[c] = `drop${d}`)),
  )
  const maxPath = Math.max(...data.paths_to_success.map((p) => p.students))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* CORRECT — there is exactly one right answer, so show the path to it */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN }} />
          <h3 className="text-sm font-semibold text-slate-900">Paths to success</h3>
        </div>

        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-xs font-medium text-green-700">The one correct configuration</p>
          <ConfigRow
            state={data.correct_state}
            zones={data.zones}
            zoneLabels={data.zone_labels}
            correctMap={correctMap}
          />
        </div>

        <p className="mb-2 text-xs font-medium text-slate-500">How many tries it took</p>
        <div className="space-y-1.5">
          {data.paths_to_success.map((p) => (
            <div key={p.label} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-xs text-slate-500">{p.label}</span>
              <div className="h-5 flex-1 overflow-hidden rounded bg-slate-100">
                <div
                  className="flex h-full items-center justify-end rounded pr-1.5 text-[11px] font-semibold text-white tnum"
                  style={{
                    width: `${Math.max(8, (p.students / maxPath) * 100)}%`,
                    background: p.label === '1st try' ? GREEN : '#94a3b8',
                  }}
                >
                  {p.students}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Only the 1st-try group cleared it before any feedback. The long tail is students
          converging through trial and error.
        </p>
      </Card>

      {/* INCORRECT — the exact wrong arrangements, ranked by how many students built them */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: RED }} />
          <h3 className="text-sm font-semibold text-slate-900">Top 5 incorrect configurations</h3>
        </div>
        <div className="space-y-2.5">
          {data.top_incorrect.map((combo, i) => (
            <div key={combo.config} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900 tnum">{combo.students} students</span>{' '}
                  built this
                </p>
                <span className="text-xs text-slate-400 tnum">
                  median attempt #{combo.median_attempt}
                </span>
              </div>
              <ConfigRow
                state={combo.state}
                zones={data.zones}
                zoneLabels={data.zone_labels}
                correctMap={correctMap}
                compact
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Red badges mark the card that makes each arrangement wrong — almost always a
          distractor (6 or 7) dragged into a zone it doesn't belong in.
        </p>
      </Card>
    </div>
  )
}

// Renders a configuration as zone columns with card-number badges,
// red where a card is in the wrong place. Works for any number of zones.
function ConfigRow({ state, zones, zoneLabels, correctMap, compact }) {
  const nums = zones.map((z) => z.replace('drop', ''))
  return (
    <div
      className={`mt-2 grid gap-2 ${compact ? '' : 'mt-3'}`}
      style={{ gridTemplateColumns: `repeat(${nums.length}, minmax(0, 1fr))` }}
    >
      {nums.map((z) => (
        <div key={z} className="rounded-md bg-slate-50 p-2">
          <p className="mb-1 truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {zoneLabels[`drop${z}`]}
          </p>
          <div className="flex flex-wrap gap-1">
            {(state[z] || []).length === 0 ? (
              <span className="text-xs text-slate-300">—</span>
            ) : (
              (state[z] || []).map((c) => {
                const wrong = correctMap[c] !== `drop${z}`
                return (
                  <span
                    key={c}
                    className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold tnum ${
                      wrong ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {c}
                  </span>
                )
              })
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
