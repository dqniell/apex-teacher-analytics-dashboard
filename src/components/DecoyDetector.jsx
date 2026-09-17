import React from 'react'
import { Card, RED, GREEN, ZoneText } from '../ui.jsx'
import Tex from '../Tex.jsx'

// Section 4 — card-level (not configuration-level) error detection.
export default function DecoyDetector({ data }) {
  const d = data.decoy_detector
  const worst = d.worst
  const maxWrong = Math.max(...data.card_stats.map((c) => c.wrong_placements))

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Headline callout */}
      <Card className="border-red-200 bg-red-50 p-6 lg:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
          Most misplaced card
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-2xl font-bold text-white tnum">
            {worst.card}
          </span>
          <div>
            <Tex tex={data.card_labels[worst.card]} className="text-sm text-red-900" />
            <p className="text-xs text-red-700">
              {worst.is_decoy ? (
                'distractor — belongs in no zone'
              ) : (
                <>belongs in <ZoneText label={data.zone_labels[worst.correct_zone]} /></>
              )}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-red-900">
          Misplaced{' '}
          <span className="font-bold tnum">{worst.wrong_placements.toLocaleString()}</span> times —{' '}
          <span className="font-bold tnum">{d.pct_more_than_worst_real}% more</span> than the
          worst real card (card {d.worst_real_card.card}).
        </p>
        <p className="mt-2 text-sm text-red-900">
          Most often dropped into{' '}
          <ZoneText label={data.zone_labels[worst.top_wrong_zone]} className="font-semibold" />{' '}
          (<span className="tnum">{worst.top_wrong_count}</span> times).
        </p>
        <p className="mt-3 text-xs text-red-700/80">
          Both distractors (6 &amp; 7) drive nearly all card-level error. Students treat
          "give it a home" as safer than leaving a card in the tray.
        </p>
      </Card>

      {/* Per-card error bars */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">Wrong placements per card</h3>
        <p className="mb-4 text-xs text-slate-400">
          How often each card was dropped somewhere it doesn't belong. Distractors in red.
        </p>
        <div className="space-y-2">
          {data.card_stats
            .slice()
            .sort((a, b) => b.wrong_placements - a.wrong_placements)
            .map((c) => (
              <div key={c.card} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold tnum ${
                    c.is_decoy ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {c.card}
                </span>
                <span className="hidden w-44 shrink-0 overflow-hidden text-xs text-slate-500 sm:block">
                  <Tex tex={data.card_labels[c.card]} />
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-slate-100">
                  <div
                    className="flex h-full items-center justify-end rounded pr-2 text-[11px] font-semibold text-white tnum"
                    style={{
                      width: `${Math.max(6, (c.wrong_placements / maxWrong) * 100)}%`,
                      background: c.is_decoy ? RED : '#94a3b8',
                    }}
                  >
                    {c.wrong_placements.toLocaleString()}
                  </div>
                </div>
                <span className="w-24 shrink-0 text-right text-xs text-slate-400">
                  {c.pct_correct != null ? (
                    <span style={{ color: c.pct_correct >= 90 ? GREEN : undefined }}>
                      {c.pct_correct}% right
                    </span>
                  ) : (
                    <span className="text-red-500">never correct</span>
                  )}
                </span>
              </div>
            ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Real cards (1–5) land correctly 93–97% of the time — the concept is mostly solid.
          The failure mode is distractor handling, not category confusion.
        </p>
      </Card>
      
    </div>
  )
}
