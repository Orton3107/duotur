import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ModuleId } from '../data/types'
import { moduleMetas } from '../data/modules'
import { getModulePath } from '../data/lessons'
import { ModuleIllustration } from '../components/ModuleIllustration'
import { LessonNode, type NodeState } from '../components/LessonNode'
import { useProgressStore } from '../store/useProgressStore'

export function ModulePathPage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const completedLessons = useProgressStore((s) => s.completedLessons)

  const mod = moduleMetas.find((m) => m.id === moduleId)

  useEffect(() => {
    if (!mod) navigate('/', { replace: true })
  }, [mod, navigate])

  if (!mod) return null

  const path = getModulePath(mod.id as ModuleId)
  const doneLessons = path.filter((p) => p.type === 'lesson' && completedLessons[`${mod.id}:${p.lessonIndex}`]).length
  const totalLessons = path.filter((p) => p.type === 'lesson').length

  return (
    <div className="mx-auto max-w-md overflow-x-hidden pb-10">
      <div className="flex items-center gap-3 px-4 pt-3">
        <button
          onClick={() => navigate('/')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-500 dark:text-gray-300"
          aria-label="Назад к модулям"
        >
          ←
        </button>
        <h1 className="text-lg font-extrabold text-gray-800 dark:text-gray-100">{mod.title}</h1>
      </div>

      <div className="relative mx-4 mb-8 mt-3 overflow-hidden rounded-2xl px-5 py-4 text-white shadow-md" style={{ background: mod.color }}>
        <ModuleIllustration moduleId={mod.id} className="absolute -right-4 -top-4 h-28 w-28 opacity-90" />
        <div className="relative z-10">
          <p className="text-sm opacity-90">{mod.subtitle}</p>
          <p className="mt-1 text-xs font-semibold opacity-80">
            {doneLessons} / {totalLessons} уроков пройдено
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-x-hidden">
        {path.map((item, i) => {
          const key =
            item.type === 'lesson' ? `${mod.id}:${item.lessonIndex}` : `${mod.id}:review:${item.lessonIndex}`
          const prevItem = path[i - 1]
          const prevKey =
            prevItem &&
            (prevItem.type === 'lesson' ? `${mod.id}:${prevItem.lessonIndex}` : `${mod.id}:review:${prevItem.lessonIndex}`)
          const completed = Boolean(completedLessons[key])
          const unlocked = i === 0 || Boolean(prevKey && completedLessons[prevKey])
          const state: NodeState = completed ? 'completed' : unlocked ? 'current' : 'locked'
          const offsetX = Math.round(Math.sin(i * 0.9) * 55)
          const to =
            item.type === 'lesson'
              ? `/module/${mod.id}/lesson/${item.lessonIndex}`
              : `/module/${mod.id}/review/${item.lessonIndex}`

          return (
            <LessonNode
              key={key}
              to={to}
              kind={item.type}
              state={state}
              stars={completedLessons[key]?.stars ?? 0}
              color={mod.color}
              offsetX={offsetX}
              label={item.type === 'lesson' ? `Урок ${item.lessonIndex + 1}` : `Повторение`}
            />
          )
        })}
      </div>
    </div>
  )
}
