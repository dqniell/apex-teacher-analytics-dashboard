import { fmtTime } from '../ui.jsx'

// PAGE 1 — Command Center. The book laid out by section; each card-sort question
// is a box that doubles as a completion meter for the selected teacher's class.
export default function CommandCenter({ index, teacherId, onPickTeacher, onOpen }) {
  const teacher = index.teachers.find((t) => t.id === teacherId) ?? index.teachers[0]

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Card Sort · Command Center</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{teacher.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-semibold text-slate-700 tnum">{teacher.n_students}</span> students ·{' '}
            {teacher.sections.length} sections
          </p>
        </div>
        <label className="text-sm text-slate-500">
          Section&nbsp;
          <select
            value={teacher.id}
            onChange={(e) => onPickTeacher(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
          >
            {index.teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.n_students})
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="mt-8 space-y-8">
        {teacher.sections.map((sec) => (
          <section key={sec.slug}>
            <h2 className="mb-3 text-sm font-semibold text-slate-700">{sec.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sec.questions.map((q) => (
                <QuestionBox key={q.id} q={q} onOpen={() => onOpen(q.id, teacher.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function QuestionBox({ q, onOpen }) {
  const done = q.completion_pct
  return (
    <button
      onClick={onOpen}
      className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-slate-800">{q.title}</span>
        <span className="text-slate-300 transition group-hover:text-slate-500">→</span>
      </div>

      <div className="mt-3 flex items-baseline justify-between text-xs text-slate-500">
        <span>
          <span className="font-semibold text-slate-700 tnum">{q.completed}</span> / {q.class_size}{' '}
          completed
        </span>
        <span className="tnum">{done}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-400 group-hover:bg-slate-500"
          style={{ width: `${done}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span>⌀ {fmtTime(q.avg_time_s)}</span>
        <span>·</span>
        <span>{q.correct_pct}% correct</span>
      </div>
    </button>
  )
}
