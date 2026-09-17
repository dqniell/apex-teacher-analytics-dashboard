import { useState } from 'react'
import { Card, ZoneText, RichText } from '../ui.jsx'

// Wrong-placement heatmap. Rows = limits (the cards), columns = drop slots.
// A cell shows how often that limit was dropped in that slot — ONLY when that
// placement is wrong. The correct home for a limit is left blank. Darker red = more,
// so a teacher can instantly spot the problem limit. A toggle counts either every
// placement (events) or distinct students.
export default function WrongHeatmap({ data }) {
  const [mode, setMode] = useState('students') // 'students' | 'events'
  const all = data.heatmap.all
  const grid = mode === 'students' && all.students_grid ? all.students_grid : all.grid
  const zones = data.zones
  const cards = data.cards

  const correctMap = {}
  Object.entries(data.correct_state).forEach(([d, l]) =>
    l.forEach((c) => (correctMap[c] = `drop${d}`)),
  )

  // true per-limit total: distinct students (or total placements) that ever misplaced it
  const stat = {}
  data.card_stats.forEach((s) => (stat[s.card] = s))

  let maxWrong = 0
  const rows = cards.map((c) => {
    const cells = zones.map((z) => {
      const n = grid[c]?.[z] || 0
      const wrong = correctMap[c] !== z // decoys have no correct home -> always wrong
      if (wrong && n > maxWrong) maxWrong = n
      return { z, n, wrong }
    })
    const total =
      mode === 'students'
        ? stat[c]?.wrong_students ?? 0
        : stat[c]?.wrong_placements ?? cells.reduce((s, x) => s + (x.wrong ? x.n : 0), 0)
    return { card: c, cells, total, isDecoy: data.decoys.includes(c) }
  })
  const worstTotal = Math.max(...rows.map((r) => r.total), 1)

  return (
    <Card className="p-6">
      {/* count-mode toggle */}
      <div className="mb-3 flex items-center justify-end gap-2 text-xs text-slate-400">
        <span>Count</span>
        <div className="flex gap-1 rounded-md bg-slate-100 p-0.5">
          {[
            ['Students', 'students'],
            ['Placements', 'events'],
          ].map(([label, val]) => (
            <button
              key={val}
              onClick={() => setMode(val)}
              className={`rounded px-2.5 py-1 transition ${
                mode === val ? 'bg-white text-slate-700' : 'hover:text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="w-[34%] min-w-[200px]" />
              {zones.map((z, i) => (
                <th key={z} className="px-2 pb-3 text-center align-bottom">
                  <div className="text-sm font-semibold text-slate-700">Drop {i + 1}</div>
                  <div className="mx-auto mt-1 text-xs leading-snug text-slate-500">
                    <ZoneText label={data.zone_labels[z]} />
                  </div>
                </th>
              ))}
              <th className="px-2 pb-2 text-center text-[11px] font-medium align-bottom text-slate-400">
                Total<br />wrong
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.card}>
                {/* row header: the card itself */}
                <td className="py-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-semibold text-slate-500 tnum">
                      {r.card}
                    </span>
                    <span className="rounded bg-slate-50 px-2 py-1">
                      <RichText text={data.card_labels[r.card]} className="text-sm text-slate-700" />
                    </span>
                  </div>
                </td>

                {r.cells.map((cell) => (
                  <td key={cell.z} className="p-0">
                    <div
                      className="flex h-12 items-center justify-center rounded-md text-sm font-semibold tnum"
                      style={cellStyle(cell, maxWrong)}
                      title={cell.wrong
                        ? `Limit ${r.card} placed in Drop here ${cell.n} time(s) — wrong`
                        : 'correct home'}
                    >
                      {cell.wrong ? (cell.n > 0 ? cell.n : '') : '✓'}
                    </div>
                  </td>
                ))}

                {/* row total */}
                <td className="p-0">
                  <div
                    className={`flex h-12 items-center justify-center rounded-md text-sm tnum ${
                      r.total === worstTotal && r.total > 0
                        ? 'bg-red-600 font-bold text-white'
                        : 'font-semibold text-slate-600'
                    }`}
                  >
                    {r.total}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {mode === 'students' ? (
          <>Each cell = the number of <strong>distinct students</strong> who dropped that limit in
            that slot, </>
        ) : (
          <>Each cell = the <strong>total number of placements</strong> (every submission counts) of
            that limit in that slot, </>
        )}
        counted <strong>only when it's the wrong slot</strong>. Darker red = more. ✓ marks each
        limit's correct home. The red <strong>Total</strong> flags the limit that tripped students
        up the most.
      </p>
    </Card>
  )
}

function cellStyle(cell, maxWrong) {
  if (!cell.wrong) return { background: '#f8fafc', color: '#cbd5e1' } // correct home
  if (cell.n === 0) return { background: '#fff', color: '#e2e8f0' }
  const a = Math.max(0.12, cell.n / maxWrong)
  return { background: `rgba(220,38,38,${a})`, color: a > 0.55 ? '#fff' : '#7f1d1d' }
}
