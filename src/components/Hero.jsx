import React from 'react'
import { Card, GREEN } from '../ui.jsx'

// Section 1 — the bottom line. One big success number + a confidence read.
export default function Hero({ data }) {
  const h = data.hero
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* PRIMARY: eventually correct */}
      <Card className="md:col-span-2 p-6">
        <p className="text-sm font-medium text-slate-500">
          Eventually solved it correctly
        </p>
        <div className="mt-1 flex items-end gap-3">
          <span className="text-6xl font-bold tracking-tight text-slate-900 tnum">
            {h.ever_correct_pct}%
          </span>
          <span className="mb-2 text-sm text-slate-500 tnum">
            {h.ever_correct} of {h.n_students} students
          </span>
        </div>

        {/* single thin progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full"
            style={{ width: `${h.ever_correct_pct}%`, background: GREEN }}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <Stat label="Right on 1st attempt" value={`${h.first_try_pct}%`} sub={`${h.first_try_correct}/${h.n_students}`} />
          <Stat label="Median attempts" value={h.median_attempts} sub="to reach it" />
          <Stat label="Mean attempts" value={h.mean_attempts} sub="per student" />
        </div>
        {/* <p className="mt-4 text-xs text-slate-400">
          Most students get there — but it takes them a while. The 1st-attempt rate is the
          honest measure of whether the concept landed before practice.
        </p> */}
      </Card>

      {/* SECONDARY: self-reported confidence */}
      {/* <Card className="p-6">
        <p className="text-sm font-medium text-slate-500">Felt confident</p>
        {h.confidence_pct == null ? (
          <NoConfidence />
        ) : (
          <ConfidenceGauge value={h.confidence_pct} />
        )}
      </Card> */}
    </div>
  )
}

function Stat({ label, value, sub }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-slate-900 tnum">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  )
}

function ConfidenceGauge({ value }) {
  return (
    <>
      <div className="mt-1 flex items-end gap-2">
        <span className="text-5xl font-bold tracking-tight text-slate-900 tnum">{value}%</span>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-400" style={{ width: `${value}%` }} />
      </div>
      <GrainOfSalt />
    </>
  )
}

function NoConfidence() {
  return (
    <>
      <div className="mt-2 flex h-[72px] items-center">
        <span className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-400">
          Not collected in this export
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100" />
      <GrainOfSalt extra="There is no self-report field in the DataShop logs for this question; wire one in to light this up." />
    </>
  )
}

function GrainOfSalt({ extra }) {
  return (
    <p className="mt-4 flex gap-2 text-xs text-slate-400">
      <span aria-hidden>⚠︎</span>
      <span>
        Self-reported — take with a grain of salt. Confidence and correctness often diverge.
        {extra ? ` ${extra}` : ''}
      </span>
    </p>
  )
}
