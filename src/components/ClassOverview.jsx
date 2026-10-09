import React from 'react'
import { href } from '../route.js'
import { Card, Info, fmtPct, fmtTime } from '../ui.jsx'

// Home, section 4: every card sort this class did, in book order, one row each.
export default function ClassOverview({ sections, summary, scope, current }) {
  const anyChecksBasis = sections.some((s) =>
    s.questions.some((q) => summary[q.id].time_basis === 'checks'),
  )
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-400">
            <th className="px-4 py-2">Question</th>
            <Th tip="Students who pressed Check Me at least once, out of the class roster.">
              Attempted
            </Th>
            <Th tip="Got a correct check at some point, out of those who attempted.">Solved</Th>
            <Th tip="Correct on their very first check.">1st check</Th>
            <Th tip="Average active time to the first correct check.">Avg time</Th>
            <Th tip="Cards with a notable pattern (see “What to watch for”)." align="right">
              Watch
            </Th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <React.Fragment key={s.slug}>
              <tr>
                <td colSpan={6} className="bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-500">
                  {s.title}
                </td>
              </tr>
              {s.questions.map((q) => {
                const r = summary[q.id]
                const isCur = q.id === current
                return (
                  <tr
                    key={q.id}
                    className={`border-t border-slate-100 ${isCur ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-4 py-2">
                      <a
                        href={href({ page: 'home', scope, q: q.id })}
                        className="font-medium text-slate-800 hover:underline"
                      >
                        {q.title}
                      </a>
                    </td>
                    <Td>
                      {fmtPct(r.attempted_pct)}{' '}
                      <span className="text-xs text-slate-400">({r.n_students})</span>
                    </Td>
                    <Td>{fmtPct(r.solved_pct)}</Td>
                    <Td>{fmtPct(r.first_check_pct)}</Td>
                    <Td>
                      {fmtTime(r.avg_time_to_complete_s)}
                      {r.time_basis === 'checks' && <span className="text-slate-400">†</span>}
                    </Td>
                    <Td align="right">
                      {r.n_notable ? (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                          {r.n_notable}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </Td>
                  </tr>
                )
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {anyChecksBasis && (
        <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
          † Timed from the first check, because card moves were not logged yet for most of these
          students.
        </p>
      )}
    </Card>
  )
}

function Th({ children, tip, align = 'left' }) {
  return (
    <th className={`px-3 py-2 whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}>
      {children}
      <Info tip={tip} align={align === 'right' ? 'right' : 'center'} />
    </th>
  )
}

function Td({ children, align = 'left' }) {
  return <td className={`px-3 py-2 whitespace-nowrap text-slate-700 tnum ${align === 'right' ? 'text-right' : 'text-left'}`}>{children}</td>
}
