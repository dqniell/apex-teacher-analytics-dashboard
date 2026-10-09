import React, { useEffect, useState } from 'react'
import INDEX from './index.json'
import { CHECK_DEF, RichText } from './ui.jsx'
import { fmtDate, href, readRoute } from './route.js'
import Home from './pages/Home.jsx'
import InDepth from './pages/InDepth.jsx'

// Every question JSON the builder emits, loaded only when it is opened (the index
// alone drives the menus). Adding a question = adding a file in src/data/.
const LOADERS = Object.fromEntries(
  Object.entries(import.meta.glob('./data/*.json')).map(([path, load]) => [
    path.replace(/^.*\/(.+)\.json$/, '$1'),
    load,
  ]),
)
const CACHE = {}

function useQuestion(id) {
  const [, rerender] = useState(0)
  useEffect(() => {
    if (!id || CACHE[id] || !LOADERS[id]) return
    LOADERS[id]().then((m) => {
      CACHE[id] = m.default ?? m
      rerender((n) => n + 1)
    })
  }, [id])
  return CACHE[id]
}

function useRoute() {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const on = () => {
      setRoute(readRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

// Questions this class actually did, in book order.
function questionsFor(scope) {
  const done = INDEX.summary[scope] ?? {}
  return INDEX.sections
    .map((s) => ({ ...s, questions: s.questions.filter((q) => done[q.id] && LOADERS[q.id]) }))
    .filter((s) => s.questions.length)
}

export default function App() {
  const route = useRoute()
  const scope = INDEX.scopes.some((s) => s.id === route.scope) ? route.scope : INDEX.scopes[0].id
  const sections = questionsFor(scope)
  const flat = sections.flatMap((s) => s.questions)
  const qid = flat.some((q) => q.id === route.q) ? route.q : flat[0]?.id
  const data = useQuestion(qid)

  const go = (next) => {
    window.location.hash = href({ page: route.page, scope, q: qid, ...next })
  }

  if (qid && !data) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-sm text-slate-400">Loading…</div>
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-slate-500">
        No question data found. Run <code>python pipelines/apex/build_dashboard.py</code> to
        generate it.
      </div>
    )
  }

  const scopeInfo = INDEX.scopes.find((s) => s.id === scope)
  const props = { data, view: data.views[scope], all: data.views.all, scope, scopeInfo, go }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Header
        data={data}
        scope={scope}
        qid={qid}
        sections={sections}
        page={route.page}
        go={go}
      />
      <main className="mt-8 space-y-12">
        {route.page === 'details' ? (
          <InDepth {...props} />
        ) : (
          <Home {...props} sections={sections} summary={INDEX.summary[scope]} />
        )}
      </main>
      <footer className="mt-16 border-t border-slate-200 pt-4 text-xs text-slate-400">
        Built from Runestone DataShop logs by{' '}
        <code className="text-slate-500">pipelines/apex/build_dashboard.py</code>. Student IDs
        are pseudonymous. Card moves were only logged from{' '}
        {fmtDate(INDEX.definitions.moves_logged_from)}, so earlier timing starts at the first
        check.
      </footer>
    </div>
  )
}

function Header({ data, scope, qid, sections, page, go }) {
  const m = data.meta
  return (
    <header className="border-b border-slate-200 pb-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          APEX Calculus · card sorts
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Picker label="Class" value={scope} onChange={(v) => go({ scope: v })}>
            {INDEX.scopes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Picker>
          <Picker label="Question" value={qid} onChange={(v) => go({ q: v })}>
            {sections.map((s) => (
              <optgroup key={s.slug} label={s.title}>
                {s.questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </Picker>
        </div>
      </div>

      {page === 'details' && (
        <a
          href={href({ page: 'home', scope, q: qid })}
          className="mt-4 inline-block text-sm text-slate-500 hover:text-slate-800"
        >
          ← Back to summary
        </a>
      )}

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{m.section_title}</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {m.title}
            {page === 'details' && (
              <span className="ml-2 text-base font-medium text-slate-400">· in-depth analysis</span>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {m.direct_link && (
            <a
              href={m.direct_link}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Open question ↗
            </a>
          )}
          {page === 'home' && (
            <a
              href={href({ page: 'details', scope, q: qid })}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              In-depth analysis →
            </a>
          )}
        </div>
      </div>
      {m.prompt && (
        <p className="mt-3 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-600">
          <RichText text={m.prompt} />
        </p>
      )}
      <p className="mt-3 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600">
        {CHECK_DEF} Every count on this page is for the selected class only, unless it says
        “all classes.”
      </p>
    </header>
  )
}

function Picker({ label, value, onChange, children }) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-slate-400">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[19rem] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        {children}
      </select>
    </label>
  )
}
