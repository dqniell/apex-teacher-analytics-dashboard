import React from 'react'
import { SectionHeader } from '../ui.jsx'
import ChecksToSolve from '../components/ChecksToSolve.jsx'
import CardTable from '../components/CardTable.jsx'
import TopIncorrect from '../components/TopIncorrect.jsx'
import Replay from '../components/Replay.jsx'
import Timing from '../components/Timing.jsx'
import Roster from '../components/Roster.jsx'

// In-depth analysis for one class and one question: the full breakdowns behind
// the home page, plus the author-facing measures (distractor flags, idle time).
export default function InDepth({ data, view, scopeInfo }) {
  return (
    <>
      <section>
        <SectionHeader
          title="Checks needed to solve"
          subtitle={`${scopeInfo.label} · the check on which each student first got it right`}
        />
        <ChecksToSolve view={view} />
      </section>

      <section>
        <SectionHeader
          title="Card by card"
          subtitle="How often each card was placed right, and where it went when it wasn’t"
        />
        <CardTable data={data} view={view} />
      </section>

      <section>
        <SectionHeader
          title="Top 5 incorrect answers"
          subtitle="Rank by students or by total checks"
        />
        <TopIncorrect data={data} view={view} toggle />
      </section>

      <section>
        <SectionHeader
          title="Where cards landed"
          subtitle="The activity as students saw it, with a heatmap you can filter by check number"
        />
        <Replay data={data} view={view} />
      </section>

      <section>
        <SectionHeader
          title="Time and engagement"
          subtitle="Idle time is mainly for question authors"
        />
        <Timing view={view} />
      </section>

      <section>
        <SectionHeader
          title="Students"
          subtitle={`${view.students.length} pseudonymous students who checked at least once · click a column to sort`}
        />
        <Roster view={view} />
      </section>
    </>
  )
}
