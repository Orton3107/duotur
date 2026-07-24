import { useNavigate } from 'react-router-dom'
import { moduleMetas } from '../data/modules'
import { getModulePath } from '../data/lessons'
import { ModuleIllustration } from '../components/ModuleIllustration'
import { useProgressStore } from '../store/useProgressStore'

export function ModulesMenuPage() {
  const navigate = useNavigate()
  const completedLessons = useProgressStore((s) => s.completedLessons)

  return (
    <div className="mx-auto max-w-md px-4 py-4">
      <h1 className="mb-4 text-xl font-extrabold text-gray-800 dark:text-gray-100">Модули</h1>
      <div className="flex flex-col gap-4">
        {moduleMetas.map((mod) => {
          const path = getModulePath(mod.id)
          const total = path.filter((p) => p.type === 'lesson').length
          const done = path.filter((p) => p.type === 'lesson' && completedLessons[`${mod.id}:${p.lessonIndex}`]).length
          const pct = total === 0 ? 0 : Math.round((done / total) * 100)

          return (
            <button
              key={mod.id}
              onClick={() => navigate(`/module/${mod.id}`)}
              className="relative flex items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 text-left text-white shadow-md"
              style={{ background: mod.color }}
            >
              <ModuleIllustration moduleId={mod.id} className="absolute -right-4 -top-4 h-28 w-28 opacity-90" />
              <div className="relative z-10 flex-1">
                <h2 className="text-xl font-extrabold">{mod.title}</h2>
                <p className="text-sm opacity-90">{mod.subtitle}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 max-w-[140px] overflow-hidden rounded-full bg-black/15">
                    <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold opacity-90">
                    {done}/{total}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
