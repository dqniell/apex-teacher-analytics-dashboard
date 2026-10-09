import React from 'react'
import INDEX from '../index.json'
import { fmtDate } from '../route.js'
import { Card, Info, fmtTime } from '../ui.jsx'
import { TimeTip } from './AtAGlance.jsx'

const D = INDEX.definitions
const MIN_IDLE_N = 5 // below this many move-logged students, idle time is not shown

// In-depth: time and engagement. Idle time is mostly for question authors.
export default function Timing({ view }) {
  const s = view.summary
  const since = fmtDate(D.moves_logged_from)
  const tiles = [
    {
      label: 'Avg time to complete',
      value: fmtTime(s.avg_time_to_complete_s),
      sub: `median ${fmtTime(s.median_time_to_complete_s)} · ${s.time_n} students`,
      tip: <TimeTip s={s} />,
    },
    {
      label: 'Avg active time on the question',
      value: fmtTime(s.avg_time_on_task_s),
      sub: 'all students, solved or not',
      tip: `From the first logged interaction to the last, leaving out pauses over ${D.session_gap_s / 60} min (counted as leaving).`,
    },
    {
      label: 'Avg idle time within the question',
      value: s.idle_n >= MIN_IDLE_N ? fmtTime(s.avg_idle_s) : '—',
      sub:
        s.idle_n >= MIN_IDLE_N
          ? `${s.idle_n} students with card moves logged`
          : `not enough students with card moves logged (${s.idle_n})`,
      tip: `Time spent in pauses of ${D.idle_gap_s / 60} min or more between interactions (card moves or checks), not counting pauses over ${D.session_gap_s / 60} min. It needs card moves, so it only covers students who worked after ${since}. Most useful to question authors.`,
    },
  ]
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.label} className="p-4">
            <p className="text-xs font-medium text-slate-500">
              {t.label}
              <Info tip={t.tip} />
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 tnum">{t.value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{t.sub}</p>
          </Card>
        ))}
      </div>
      {s.n_checks_only > 0 && (
        <p className="text-xs text-slate-400">
          {s.n_checks_only} of {s.n_students} students have no card moves logged for this question
          (Runestone started logging moves on {since}). Their timing starts at their first check.
          {s.started_no_check > 0 &&
            ` ${s.started_no_check} more students moved cards but never pressed Check Me.`}
        </p>
      )}
    </div>
  )
}
