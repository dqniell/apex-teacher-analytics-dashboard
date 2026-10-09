import React from 'react'
import INDEX from '../index.json'
import { fmtDate } from '../route.js'
import { Card, Info, fmtPct, fmtTime } from '../ui.jsx'

// Home, section 1: the five numbers an instructor needs before class, each with a
// definition on hover and the all-classes figure underneath for context.
export default function AtAGlance({ view, all, scope }) {
  const s = view.summary
  const a = all.summary
  const showAll = scope !== 'all'

  const tiles = [
    {
      label: 'Attempted',
      value: fmtPct(s.attempted_pct),
      sub: `${s.n_students} of ${s.class_size} students`,
      cmp: fmtPct(a.attempted_pct),
      tip: (
        <>
          Students who pressed Check Me at least once, out of everyone who appears in this
          class’s Runestone log.
          {s.started_no_check > 0 &&
            ` Another ${s.started_no_check} moved cards but never checked.`}
        </>
      ),
    },
    {
      label: 'Eventually solved',
      value: fmtPct(s.solved_pct),
      sub: `${s.solved} of ${s.n_students} who attempted`,
      cmp: fmtPct(a.solved_pct),
      tip: 'Students who got a correct check at some point, out of those who attempted.',
    },
    {
      label: 'Right on 1st check',
      value: fmtPct(s.first_check_pct),
      sub: `${s.first_check} of ${s.n_students} students`,
      cmp: fmtPct(a.first_check_pct),
      tip: 'Correct on their very first check. This is the best sign the idea landed before any trial and error.',
    },
    {
      label: 'Checks to solve',
      value: s.median_checks_to_solve ?? '—',
      sub: 'median, among students who solved',
      cmp: a.median_checks_to_solve ?? '—',
      tip: `Half of the students who solved it needed this many checks or fewer. Students averaged ${s.mean_checks} checks each (solved or not), ${s.blank_checks} of ${s.total_checks} checks were on a blank board.`,
    },
    {
      label: 'Avg time to complete',
      value: fmtTime(s.avg_time_to_complete_s),
      sub: s.time_basis === 'moves' ? 'first card move → solved' : 'first check → solved',
      cmp: fmtTime(a.avg_time_to_complete_s),
      tip: <TimeTip s={s} />,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {tiles.map((t) => (
        <Card key={t.label} className="flex flex-col p-4">
          <p className="text-xs font-medium text-slate-500">
            {t.label}
            <Info tip={t.tip} />
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 tnum">{t.value}</p>
          <p className="mt-0.5 mb-2 text-xs text-slate-400">{t.sub}</p>
          {showAll && (
            <p className="mt-auto border-t border-slate-100 pt-2 text-xs text-slate-400 tnum">
              All classes: <span className="text-slate-600">{t.cmp}</span>
            </p>
          )}
        </Card>
      ))}
    </div>
  )
}

export function TimeTip({ s }) {
  const since = fmtDate(INDEX.definitions.moves_logged_from)
  return (
    <>
      {s.time_basis === 'moves'
        ? 'Average active time from a student’s first card move to their first correct check.'
        : `Card moves were not logged before ${since} for most of this class, so this is the time from the first check to the first correct check. It leaves out time spent before the first check.`}{' '}
      Pauses over 30 min are treated as leaving and not counted. Median {fmtTime(s.median_time_to_complete_s)}
      , from {s.time_n} students who solved it.
    </>
  )
}
