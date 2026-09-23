import React, { useState } from 'react'
import { SectionHeader } from './ui.jsx'
import Hero from './components/Hero.jsx'
import Replay from './components/Replay.jsx'
import TopFive from './components/TopFive.jsx'
import TopIncorrect from './components/TopIncorrect.jsx'
import DecoyDetector from './components/DecoyDetector.jsx'

// Auto-discover every problem JSON the builder emits. Adding a problem = adding a
// file in src/data/ ; no code change needed here.
const modules = import.meta.glob('./data/*.json', { eager: true })
const PROBLEMS = Object.values(modules)
  .map((m) => m.default ?? m)
  .filter((d) => d && d.meta)
  .sort((a, b) => a.meta.title.localeCompare(b.meta.title))

export default function App() {
  const [id, setId] = useState(PROBLEMS[0]?.meta.id)
  const data = PROBLEMS.find((p) => p.meta.id === id) ?? PROBLEMS[0]

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-slate-500">
        No problem data found. Run <code>python apex/dashboard_data.py</code> to generate it.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Header data={data} problems={PROBLEMS} id={id} onPick={setId} />

      <main className="mt-8 space-y-12">
        <section>
          <SectionHeader n={1} title="The bottom line" subtitle="What to know before class starts" />
          <Hero data={data} />
        </section>

        <section>
          <SectionHeader
            n={2}
            title="Top 5 incorrect answers"
            subtitle="The most common wrong arrangements and the exact spot each card landed"
          />
          <TopIncorrect data={data} />
        </section>

        <section>
          <SectionHeader
            n={3}
            title="Card sort replay"
            subtitle="The activity as students saw it, with a heatmap of where cards actually landed"
          />
          <Replay data={data} />
        </section>

        {/* <section>
          <SectionHeader
            n={3}
            title="Common combinations"
            subtitle="The paths to the right answer, and the exact wrong arrangements"
          />
          <TopFive data={data} />
        </section>

        <section>
          <SectionHeader
            n={4}
            title="Decoy & outlier detector"
            subtitle="Card-level mistakes — which single card causes the most trouble"
          />
          <DecoyDetector data={data} />
        </section> */}
      </main>

      {/* <Footer data={data} /> */}
    </div>
  )
}

function Header({ data, problems, id, onPick }) {
  const m = data.meta
  return (
    <header className="border-b border-slate-200 pb-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Card sort · {m.type}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{m.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {problems.length > 1 && (
            <select
              value={id}
              onChange={(e) => onPick(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              {problems.map((p) => (
                <option key={p.meta.id} value={p.meta.id}>
                  {p.meta.title}
                </option>
              ))}
            </select>
          )}
          <a
            href={m.direct_link}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Open question ↗
          </a>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">
        <span className="font-semibold text-slate-700 tnum">{data.hero.n_students}</span> students ·{' '}
        <span className="tnum">{data.totals.total_submissions.toLocaleString()}</span> total submissions ·{' '}
        {m.instructors.split(', ').filter(Boolean).length} sections
      </p>
    </header>
  )
}

function Footer({ data }) {
  return (
    <footer className="mt-12 border-t border-slate-200 pt-4 text-xs text-slate-400">
      <p>
        Data computed from the DataShop logs by{' '}
        <code className="text-slate-500">apex/dashboard_data.py</code> →{' '}
        <code className="text-slate-500">src/data/{data.meta.id}.json</code>. Answer key, cards,
        zones, and decoys are all auto-derived from the data.
      </p>
      {data.meta.labels_verified ? (
        <p className="mt-1">
          Card &amp; zone text transcribed from the question source (
          <code className="text-slate-500">apex/apex.xml</code>) and rendered with KaTeX.
        </p>
      ) : !data.meta.has_labels ? (
        <p className="mt-1">
          ⚠︎ No labels file found — cards/zones show raw IDs. Add{' '}
          <code className="text-slate-500">dashboard/labels/{data.meta.id}.json</code> with LaTeX
          and re-run the builder.
        </p>
      ) : (
        <p className="mt-1">
          ⚠︎ Card <em>labels</em> are unverified placeholders. Confirm the expressions in{' '}
          <code className="text-slate-500">dashboard/labels/{data.meta.id}.json</code> against the
          question source, set <code className="text-slate-500">"verified": true</code>, and re-run.
        </p>
      )}
    </footer>
  )
}
