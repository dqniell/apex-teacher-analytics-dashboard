import React from 'react'
import INDEX from '../index.json'
import { Card, CardTile, Info, RichText, Tip, fmtPct, zoneLabel } from '../ui.jsx'

const D = INDEX.definitions

// In-depth: one row per card — how often it was placed right, how many students
// got it wrong at least once, and where it went most often when wrong.
// Distractors carry the >50% (instructor) / <10% (author) usage flags.
export default function CardTable({ data, view }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-400">
            <th className="px-4 py-2">Card</th>
            <th className="px-3 py-2">Belongs in</th>
            <th className="px-3 py-2 whitespace-nowrap">
              Right
              <Info tip="Share of non-blank checks where this card was in the right place. For a distractor, “right” means it stayed in the tray." />
            </th>
            <th className="px-3 py-2 whitespace-nowrap">
              Students wrong
              <Info tip="Students who put this card in a wrong place (or left it out) on at least one check. For a distractor: students who used it at all." />
            </th>
            <th className="px-3 py-2">Most common wrong spot</th>
            <th className="px-3 py-2">Flag</th>
          </tr>
        </thead>
        <tbody>
          {view.card_stats.map((c) => {
            const w = c.wrong[0]
            return (
              <tr key={c.card} className="border-t border-slate-100 align-middle">
                <td className="px-4 py-2">
                  <CardTile
                    id={c.card}
                    label={data.card_labels[c.card]}
                    tone={c.is_decoy ? 'decoy' : 'neutral'}
                    compact
                  />
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {c.is_decoy ? (
                    <span className="text-red-700">Nowhere (distractor)</span>
                  ) : (
                    <RichText text={zoneLabel(data, c.correct_zone)} />
                  )}
                </td>
                <td className="px-3 py-2 text-slate-700 tnum">{fmtPct(c.pct_checks_correct)}</td>
                <td className="px-3 py-2 text-slate-700 tnum whitespace-nowrap">
                  {fmtPct(c.pct_students_wrong)}{' '}
                  <span className="text-xs text-slate-400">({c.students_wrong})</span>
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {w ? (
                    <Tip
                      tip={`${w.students} students (${fmtPct(w.pct_students)}) did this at least once; ${w.checks} checks in all.`}
                    >
                      <span>
                        <RichText text={zoneLabel(data, w.zone)} />{' '}
                        <span className="text-slate-400 tnum">· {fmtPct(w.pct_checks)} of checks</span>
                      </span>
                    </Tip>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <Flag flag={c.decoy_flag} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
        Distractor flags: used by more than {D.decoy_high * 100}% of students → worth raising in
        class; used by fewer than {D.decoy_low * 100}% → may not be a plausible distractor (for
        question authors). These thresholds are a starting point, pending a literature review.
      </p>
    </Card>
  )
}

function Flag({ flag }) {
  if (flag === 'instructor')
    return (
      <span className="whitespace-nowrap rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
        ⚑ Popular (&gt;{D.decoy_high * 100}%)
      </span>
    )
  if (flag === 'author')
    return (
      <span className="whitespace-nowrap rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
        ✎ Rarely used (&lt;{D.decoy_low * 100}%)
      </span>
    )
  return <span className="text-slate-300">—</span>
}
