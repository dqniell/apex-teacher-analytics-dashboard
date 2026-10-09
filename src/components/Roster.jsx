import React, { useState } from 'react'
import { Card, fmtTime } from '../ui.jsx'

const COLS = [
  ['id', 'Student'],
  ['status', 'Status'],
  ['checks', 'Checks'],
  ['checks_to_solve', 'Checks to solve'],
  ['time_to_complete_s', 'Time to complete'],
  ['time_on_task_s', 'Active time'],
  ['idle_s', 'Idle time'],
]

// In-depth: pseudonymous per-student roster, sortable by any column.
export default function Roster({ view }) {
  const [sort, setSort] = useState({ key: 'status', dir: 1 })
  const rows = [...view.students].sort((a, b) => {
    const x = a[sort.key]
    const y = b[sort.key]
    if (x == null && y == null) return 0
    if (x == null) return 1 // unknowns always last
    if (y == null) return -1
    return (x > y ? 1 : x < y ? -1 : 0) * sort.dir
  })
  const click = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }))

  return (
    <Card className="max-h-[32rem] overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white">
          <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-400">
            {COLS.map(([key, label]) => (
              <th key={key} className="px-3 py-2 whitespace-nowrap">
                <button onClick={() => click(key)} className="hover:text-slate-700">
                  {label}
                  {sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <tr key={`${s.id}-${i}`} className="border-t border-slate-100 text-slate-700 tnum">
              <td className="px-3 py-1.5 font-mono text-xs text-slate-500">{s.id}</td>
              <td className="px-3 py-1.5">
                {s.status === 'solved' ? (
                  <span className="text-green-700">✓ Solved</span>
                ) : (
                  <span className="text-slate-500">✗ Not solved</span>
                )}
              </td>
              <td className="px-3 py-1.5">{s.checks}</td>
              <td className="px-3 py-1.5">{s.checks_to_solve ?? '—'}</td>
              <td className="px-3 py-1.5">
                {fmtTime(s.time_to_complete_s ?? s.time_from_first_check_s)}
                {s.status === 'solved' && s.time_to_complete_s == null && (
                  <span className="text-slate-400" title="Timed from the first check (no card moves logged)">
                    †
                  </span>
                )}
              </td>
              <td className="px-3 py-1.5">{fmtTime(s.time_on_task_s)}</td>
              <td className="px-3 py-1.5">{fmtTime(s.idle_s)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
