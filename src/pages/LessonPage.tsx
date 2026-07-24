import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ModuleId } from '../data/types'
import { getLesson } from '../data/lessons'
import { wordsByModule, moduleMetas } from '../data/modules'
import { generateExercises } from '../engine/exerciseGenerator'
import { useProgressStore } from '../store/useProgressStore'
import { ExerciseRunner } from '../components/ExerciseRunner'

export function LessonPage() {
  const { moduleId, lessonIndex } = useParams<{ moduleId: string; lessonIndex: string }>()
  const navigate = useNavigate()
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult)

  const lesson = getLesson(moduleId as ModuleId, Number(lessonIndex))
  const moduleMeta = moduleMetas.find((m) => m.id === moduleId)

  const exercises = useMemo(() => {
    if (!lesson) return []
    return generateExercises(lesson.words, wordsByModule[lesson.moduleId], 3)
  }, [lesson])

  useEffect(() => {
    if (!lesson || !moduleMeta) navigate('/', { replace: true })
  }, [lesson, moduleMeta, navigate])

  if (!lesson || !moduleMeta) return null

  return (
    <ExerciseRunner
      exercises={exercises}
      backTo={`/module/${moduleMeta.id}`}
      completeTitle="Урок пройден!"
      onFinish={(mistakes) => recordLessonResult(lesson.moduleId, lesson.index, mistakes)}
    />
  )
}
