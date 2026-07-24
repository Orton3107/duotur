import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ModuleId } from '../data/types'
import { getLesson } from '../data/lessons'
import { wordsByModule, moduleMetas } from '../data/modules'
import { generateLessonExercises } from '../engine/exerciseGenerator'
import { McqExerciseView } from '../components/exercises/McqExerciseView'
import { WordBankExerciseView } from '../components/exercises/WordBankExerciseView'
import { TypeExerciseView } from '../components/exercises/TypeExerciseView'
import { useProgressStore } from '../store/useProgressStore'
import type { Exercise } from '../engine/types'

function renderExercise(exercise: Exercise, key: number, onSubmit: (correct: boolean) => void) {
  switch (exercise.kind) {
    case 'mcq-tr-ru':
    case 'mcq-ru-tr':
      return <McqExerciseView key={key} exercise={exercise} onSubmit={onSubmit} />
    case 'word-bank':
      return <WordBankExerciseView key={key} exercise={exercise} onSubmit={onSubmit} />
    case 'type-tr':
      return <TypeExerciseView key={key} exercise={exercise} onSubmit={onSubmit} />
  }
}

export function LessonPage() {
  const { moduleId, lessonIndex } = useParams<{ moduleId: string; lessonIndex: string }>()
  const navigate = useNavigate()
  const hearts = useProgressStore((s) => s.hearts)
  const loseHeart = useProgressStore((s) => s.loseHeart)
  const recordLessonResult = useProgressStore((s) => s.recordLessonResult)

  const lesson = getLesson(moduleId as ModuleId, Number(lessonIndex))
  const moduleMeta = moduleMetas.find((m) => m.id === moduleId)

  const exercises = useMemo(() => {
    if (!lesson) return []
    return generateLessonExercises(lesson, wordsByModule[lesson.moduleId])
  }, [lesson])

  const [index, setIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{ stars: number; xpGained: boolean } | null>(null)

  useEffect(() => {
    if (!lesson || !moduleMeta) navigate('/', { replace: true })
  }, [lesson, moduleMeta, navigate])

  if (!lesson || !moduleMeta) return null

  const current = exercises[index]

  function handleSubmit(correct: boolean) {
    if (!correct) {
      setMistakes((m) => m + 1)
      loseHeart()
    }
    setFeedback(correct ? 'correct' : 'wrong')
  }

  function handleContinue() {
    setFeedback(null)
    if (index + 1 < exercises.length) {
      setIndex((i) => i + 1)
    } else {
      const r = recordLessonResult(lesson!.moduleId, lesson!.index, mistakes)
      setResult({ stars: r.stars, xpGained: true })
      setDone(true)
    }
  }

  if (done && result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-[#131f24]">
        <div className="text-6xl">{result.stars === 3 ? '🏆' : result.stars === 2 ? '🎉' : '👍'}</div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Урок пройден!</h1>
        <div className="flex gap-1 text-3xl">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < result.stars ? 'text-duo-yellow' : 'text-gray-300 dark:text-gray-700'}>
              ★
            </span>
          ))}
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Ошибок: {mistakes} из {exercises.length}
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-3d mt-4 w-full max-w-xs rounded-2xl bg-duo-green py-3.5 text-lg font-extrabold text-white"
          style={{ ['--btn-shadow' as any]: '#58a700' }}
        >
          Продолжить
        </button>
      </div>
    )
  }

  const progressPct = Math.round((index / exercises.length) * 100)

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#131f24]">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate('/')} className="text-2xl text-gray-400" aria-label="Закрыть урок">
          ✕
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-duo-green transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="flex items-center gap-1 font-bold text-duo-red">❤️ {hearts}</span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4">{renderExercise(current, index, handleSubmit)}</div>

      {feedback && (
        <div
          className={`fixed inset-x-0 bottom-0 flex items-center justify-between gap-4 px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] ${
            feedback === 'correct' ? 'bg-duo-green/15' : 'bg-duo-red/15'
          }`}
        >
          <p className={`text-lg font-extrabold ${feedback === 'correct' ? 'text-duo-green-dark' : 'text-duo-red-dark'}`}>
            {feedback === 'correct' ? 'Отлично! ✓' : 'Не совсем так'}
          </p>
          <button
            onClick={handleContinue}
            className={`btn-3d rounded-2xl px-8 py-3 text-lg font-extrabold text-white ${
              feedback === 'correct' ? 'bg-duo-green' : 'bg-duo-red'
            }`}
            style={{ ['--btn-shadow' as any]: feedback === 'correct' ? '#58a700' : '#ea2b2b' }}
          >
            Дальше
          </button>
        </div>
      )}
    </div>
  )
}
