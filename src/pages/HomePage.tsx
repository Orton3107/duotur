import { moduleMetas } from '../data/modules'
import { getLessons } from '../data/lessons'
import { LessonNode, type NodeState } from '../components/LessonNode'
import { useProgressStore } from '../store/useProgressStore'

export function HomePage() {
  const completedLessons = useProgressStore((s) => s.completedLessons)

  return (
    <div className="mx-auto max-w-md pb-10">
      {moduleMetas.map((mod) => {
        const lessons = getLessons(mod.id)
        const doneCount = lessons.filter((l) => completedLessons[`${mod.id}:${l.index}`]).length

        return (
          <section key={mod.id} className="mb-10">
            <div
              className="mx-4 mb-8 rounded-2xl px-5 py-4 text-white shadow-md"
              style={{ background: mod.color }}
            >
              <div className="text-2xl">{mod.emoji}</div>
              <h2 className="text-xl font-extrabold">{mod.title}</h2>
              <p className="text-sm opacity-90">{mod.subtitle}</p>
              <p className="mt-1 text-xs font-semibold opacity-80">
                {doneCount} / {lessons.length} уроков пройдено
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {lessons.map((lesson, i) => {
                const key = `${mod.id}:${lesson.index}`
                const prevKey = `${mod.id}:${lesson.index - 1}`
                const completed = Boolean(completedLessons[key])
                const unlocked = lesson.index === 0 || Boolean(completedLessons[prevKey])
                const state: NodeState = completed ? 'completed' : unlocked ? 'current' : 'locked'
                const offsetX = Math.round(Math.sin(i * 0.9) * 70)

                return (
                  <LessonNode
                    key={key}
                    moduleId={mod.id}
                    lessonIndex={lesson.index}
                    state={state}
                    stars={completedLessons[key]?.stars ?? 0}
                    color={mod.color}
                    colorDark={mod.colorDark}
                    offsetX={offsetX}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
