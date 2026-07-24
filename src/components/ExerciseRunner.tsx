import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Exercise } from '../engine/types'
import { McqExerciseView } from './exercises/McqExerciseView'
import { WordBankExerciseView } from './exercises/WordBankExerciseView'
import { TypeExerciseView } from './exercises/TypeExerciseView'
import { useProgressStore } from '../store/useProgressStore'

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

interface ExerciseRunnerProps {
  exercises: Exercise[]
  backTo: string
  completeTitle: string
  onFinish: (mistakes: number) => { stars: number }
}

export function ExerciseRunner({ exercises, backTo, completeTitle, onFinish }: ExerciseRunnerProps) {
  const navigate = useNavigate()
  const hearts = useProgressStore((s) => s.hearts)
  const loseHeart = useProgressStore((s) => s.loseHeart)

  const [index, setIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{ stars: number } | null>(null)

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
      const r = onFinish(mistakes)
      setResult(r)
      setDone(true)
    }
  }

  if (done && result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-[#131f24]">
        <div className="text-6xl">{result.stars === 3 ? '🏆' : result.stars === 2 ? '🎉' : '👍'}</div>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">{completeTitle}</h1>
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
          onClick={() => navigate(backTo)}
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white dark:bg-[#131f24]">
      <div
        className="flex items-center gap-3 px-4 pb-3"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        <button onClick={() => navigate(backTo)} className="text-2xl text-gray-400" aria-label="Закрыть">
          ✕
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className="h-full rounded-full bg-duo-green transition-all" style={{ width: `${progressPct}%` }} />
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
