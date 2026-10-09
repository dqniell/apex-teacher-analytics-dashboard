import React, { useState } from 'react'
import { Card, Tip, Toggle, checkLabel, fmtPct, pct } from '../ui.jsx'

// In-depth: how many checks students needed before their first correct one, in
// simple (1 / 2–3 / 4+) or detailed groups, plus those who never solved it.
export default function ChecksToSolve({ view }) {
  const [grouping, setGrouping] = useState('simple')
  const s = view.summary
  const rows = [
    ...view.checks_to_solve[grouping].map((g) => ({ ...g, tone: 'solved' })),
    { key: 'none', label: 'Not solved', students: s.not_solved, tone: 'none' },
  ]
  const max = Math.max(1, ...rows.map((r) => r.students))

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {s.n_students} students attempted · bars show the check on which each student first got it
          right.
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
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.key} className="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-3 text-sm">
            <span className="text-slate-600">
              {r.tone === 'none' ? r.label : checkLabel(r.label)}
            </span>
            <Tip
              className="w-full"
              tip={
                r.tone === 'none'
                  ? `${r.students} students (${fmtPct(pct(r.students, s.n_students))}) checked but never got it right.`
                  : `${r.students} students (${fmtPct(pct(r.students, s.n_students))} of those who attempted) first got it right ${r.key === '1' ? 'on their 1st check' : `on check ${r.label}`}.`
              }
            >
              <div className="h-5 w-full rounded bg-slate-50">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${(100 * r.students) / max}%`,
                    minWidth: r.students ? 4 : 0,
                    background: r.tone === 'none' ? '#94a3b8' : '#16a34a',
                  }}
                />
              </div>
            </Tip>
            <span className="text-right text-slate-700 tnum">
              {r.students}{' '}
              <span className="text-xs text-slate-400">({fmtPct(pct(r.students, s.n_students))})</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
