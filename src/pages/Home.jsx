import React from 'react'
import { href } from '../route.js'
import { SectionHeader } from '../ui.jsx'
import AtAGlance from '../components/AtAGlance.jsx'
import Notable from '../components/Notable.jsx'
import TopIncorrect from '../components/TopIncorrect.jsx'
import ClassOverview from '../components/ClassOverview.jsx'

// Home: the instant, act-on-it-before-class view for one class and one question.
// Everything deeper lives on the in-depth page.
export default function Home({ data, view, all, scope, scopeInfo, sections, summary }) {
  const details = href({ page: 'details', scope, q: data.meta.id })
  return (
    <>
      <section>
        <SectionHeader
          title="At a glance"
          subtitle={`${scopeInfo.label} · hover ⓘ for how each number is counted`}
        />
        {view.summary.n_students < 10 && (
          <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Only {view.summary.n_students} student{view.summary.n_students === 1 ? '' : 's'} in this
            class attempted this question, so one student can swing a percentage a lot.
          </p>
        )}
        <AtAGlance view={view} all={all} scope={scope} />
      </section>

      <section>
        <SectionHeader
          title="What to watch for"
          subtitle="Only the cards with a notable pattern: common wrong spots and popular distractors"
        />
        <Notable data={data} view={view} />
      </section>

      <section>
        <SectionHeader
          title="Top 5 incorrect answers"
          subtitle="The most common wrong arrangements, shown on the board"
        />
        <TopIncorrect data={data} view={view} />
      </section>

      <a
        href={details}
        className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400"
      >
        <p className="font-semibold text-slate-900">In-depth analysis →</p>
        <p className="mt-1 text-sm text-slate-500">
          Checks needed to solve, every card’s accuracy and distractor flags, where cards landed by
          check number, timing and idle time, and the student roster.
        </p>
      </a>

      <section>
        <SectionHeader
          title="All card sorts for this class"
          subtitle="In book order. Click a question to switch to it."
        />
        <ClassOverview sections={sections} summary={summary} scope={scope} current={data.meta.id} />
      </section>
    </>
  )
}
