import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sampleReviewWords } from '../data/lessons'
import { wordsByModule, moduleMetas } from '../data/modules'
import { generateExercises } from '../engine/exerciseGenerator'
import { useProgressStore } from '../store/useProgressStore'
import { ExerciseRunner } from '../components/ExerciseRunner'

export function ReviewPage() {
  const { moduleId, lessonIndex } = useParams<{ moduleId: string; lessonIndex: string }>()
  const navigate = useNavigate()
  const recordReviewResult = useProgressStore((s) => s.recordReviewResult)

  const moduleMeta = moduleMetas.find((m) => m.id === moduleId)
  const lessonIdx = Number(lessonIndex)

  const reviewWords = useMemo(() => {
    if (!moduleMeta) return []
    return sampleReviewWords(moduleMeta.id, lessonIdx)
  }, [moduleMeta, lessonIdx])

  const exercises = useMemo(() => {
    if (!moduleMeta || reviewWords.length === 0) return []
    return generateExercises(reviewWords, wordsByModule[moduleMeta.id], 2)
  }, [moduleMeta, reviewWords])

  useEffect(() => {
    if (!moduleMeta || reviewWords.length === 0) navigate('/', { replace: true })
  }, [moduleMeta, reviewWords, navigate])

  if (!moduleMeta || reviewWords.length === 0) return null

  return (
    <ExerciseRunner
      exercises={exercises}
      backTo={`/module/${moduleMeta.id}`}
      completeTitle="Повторение пройдено!"
      onFinish={(mistakes) => recordReviewResult(moduleMeta.id, lessonIdx, mistakes)}
    />
  )
}
