import { useState } from 'react'
import { fmtTime } from '../ui.jsx'

// PAGE 3 — Student-by-student engagement for the selected teacher's class.
// (Off-tab/distraction time is intentionally omitted — the logs don't capture it.)
export default function Students({ data, teacherId }) {
  const [sort, setSort] = useState({ key: 'attempts', dir: 'desc' })

  const rows = data.students.filter((s) => s.inst === teacherId)
  const sorted = [...rows].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1
    const av = a[sort.key] ?? -1
    const bv = b[sort.key] ?? -1
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })

  const head = (key, label, align = 'left') => (
    <th
      onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }))}
      className={`cursor-pointer select-none px-3 py-2 text-${align} font-medium text-slate-500 hover:text-slate-700`}
    >
      {label}
      {sort.key === key && <span className="ml-1 text-slate-400">{sort.dir === 'desc' ? '↓' : '↑'}</span>}
    </th>
  )

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700 tnum">{rows.length}</span> students
        </p>
        <p className="text-xs text-slate-400">click a column to sort</p>
      </div>

      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs">
          <tr>
            {head('id', 'Student')}
            {head('status', 'Status')}
            {head('attempts', 'Attempts', 'right')}
            {head('checks_to_correct', 'Solved on', 'right')}
            {head('time_s', 'Time on task', 'right')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr key={s.id + i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
              <td className="px-3 py-2 font-mono text-xs text-slate-600">{s.id}</td>
              <td className="px-3 py-2">
                {s.status === 'solved' ? (
                  <span className="inline-flex items-center gap-1 text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> Solved
                  </span>
                ) : (
                  <span className="text-slate-400">Gave up</span>
                )}
              </td>
              <td className="px-3 py-2 text-right tnum text-slate-700">{s.attempts}</td>
              <td className="px-3 py-2 text-right tnum text-slate-500">
                {s.checks_to_correct ? `attempt ${s.checks_to_correct}` : '—'}
              </td>
              <td className="px-3 py-2 text-right tnum text-slate-700">{fmtTime(s.time_s)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
        Time on task is inferred from log timestamps (idle gaps over 30 min excluded), so it's an
        estimate, not a stopwatch. Off-tab / distraction time isn't captured by the activity yet.
      </p>
    </div>
  )
}
