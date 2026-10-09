import React from 'react'
import INDEX from '../index.json'
import { Card, CardTile, RichText, Tip, fmtPct, zoneLabel } from '../ui.jsx'

const D = INDEX.definitions

// Home, section 2: only the cards with a notable pattern, not the whole heatmap.
// "Notable" = a wrong placement made by >= NOTABLE_MIN of students, or a distractor
// used by > DECOY_HIGH of students (both thresholds come from the builder).
export default function Notable({ data, view }) {
  const items = view.notable
  if (!items.length) {
    return (
      <Card className="p-6 text-sm text-slate-500">
        Nothing stands out. No wrong placement was made by {D.notable_min * 100}% or more of
        students, and no distractor was used by more than {D.decoy_high * 100}% of them.
      </Card>
    )
  }
  return (
    <Card className="divide-y divide-slate-100">
      {items.map((n) => (
        <div
          key={`${n.kind}-${n.card}-${n.zone}`}
          className="grid items-center gap-4 p-4 sm:grid-cols-[minmax(0,14rem)_1fr_auto]"
        >
          <CardTile
            id={n.card}
            label={data.card_labels[n.card]}
            tone={n.kind === 'decoy' ? 'decoy' : 'neutral'}
            compact
          />
          <p className="text-sm text-slate-600">
            {n.kind === 'decoy' ? (
              <>
                <Badge>⚑ Popular distractor</Badge> Used at least once by{' '}
                <strong className="text-slate-900">{fmtPct(n.pct_students)} of students</strong>{' '}
                ({n.students}). It belongs in no zone. They placed it most often in{' '}
                <Zone data={data} z={n.zone} />.
              </>
            ) : (
              <>
                <strong className="text-slate-900">{fmtPct(n.pct_students)} of students</strong>{' '}
                ({n.students}) put it in <Zone data={data} z={n.zone} /> at least once. It belongs
                in <Zone data={data} z={n.correct_zone} />.
              </>
            )}
          </p>
          <Tip
            align="right"
            tip={
              n.kind === 'decoy' ? (
                <>
                  {fmtPct(n.top_zone_pct_checks)} of checks placed card {n.card} in{' '}
                  <RichText text={zoneLabel(data, n.zone)} />. Flagged because more than{' '}
                  {D.decoy_high * 100}% of students used it.
                </>
              ) : (
                <>
                  {fmtPct(n.pct_checks)} of checks placed card {n.card} in{' '}
                  <RichText text={zoneLabel(data, n.zone)} /> ({n.checks.toLocaleString()} checks,
                  blank boards excluded).
                </>
              )
            }
          >
            <span className="text-2xl font-bold text-slate-900 tnum">{fmtPct(n.pct_students)}</span>
          </Tip>
        </div>
      ))}
    </Card>
  )
}

function Zone({ data, z }) {
  return (
    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-800">
      <RichText text={zoneLabel(data, z)} />
    </span>
  )
}

function Badge({ children }) {
  return (
    <span className="mr-1 inline-block rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
      {children}
    </span>
  )
}
