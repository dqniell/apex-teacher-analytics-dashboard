import { SectionHeader, RichText } from '../ui.jsx'
import Hero from '../components/Hero.jsx'
import WrongHeatmap from '../components/WrongHeatmap.jsx'
import TopIncorrect from '../components/TopIncorrect.jsx'
import DecoyDetector from '../components/DecoyDetector.jsx'
import Students from './Students.jsx'

// PAGE 2 + 3 — one activity, two tabs (Analysis / Students), with a breadcrumb up.
export default function QuestionDetail({ data, teacherId, teacherName, tab, onTab, onBack }) {
  const m = data.meta
  return (
    <div>
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-slate-800">
          ‹ {teacherName}
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">{m.section_title}</span>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-700">{m.title}</span>
      </nav>

      <header className="mt-2 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{m.title}</h1>
        {m.prompt && (
          <RichText text={m.prompt} className="mt-1 block max-w-3xl text-sm text-slate-500" />
        )}
      </header>

      {/* tabs */}
      <div className="mt-4 flex gap-1 border-b border-slate-200">
        {[
          ['analysis', 'Analysis'],
          ['students', 'Students'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => onTab(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === key
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'analysis' ? (
        <div className="mt-6 space-y-10">
          <p className="text-xs text-slate-400">Analysis across all sections ({m.instructors.split(', ').filter(Boolean).length} teachers).</p>
          <section>
            <SectionHeader title="The bottom line" subtitle="How the concept landed" />
            <Hero data={data} />
          </section>
          <section>
            <SectionHeader
              title="Wrong-placement heatmap"
              subtitle="Which limit got dropped in the wrong slot, and how often"
            />
            <WrongHeatmap data={data} />
          </section>
          <section>
            <SectionHeader
              title="Top incorrect answers"
              subtitle="The most common wrong arrangements, and the exact spot each card landed"
            />
            <TopIncorrect data={data} />
          </section>
          {data.decoy_detector && (
            <section>
              <SectionHeader
                title="Decoy & outlier detector"
                subtitle="Card-level mistakes — which single card causes the most trouble"
              />
              <DecoyDetector data={data} />
            </section>
          )}
        </div>
      ) : (
        <div className="mt-6">
          <SectionHeader
            title={`${teacherName} · students`}
            subtitle="Effort and time for this section"
          />
          <Students data={data} teacherId={teacherId} />
        </div>
      )}
    </div>
  )
}
