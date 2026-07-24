import { useState } from 'react'
import type { McqExercise } from '../../engine/types'

interface Props {
  exercise: McqExercise
  onSubmit: (correct: boolean) => void
}

export function McqExerciseView({ exercise, onSubmit }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  const isRecognition = exercise.kind === 'mcq-tr-ru'

  function check() {
    if (!selected || checked) return
    setChecked(true)
    onSubmit(selected === exercise.correctOption)
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">
        {isRecognition ? 'Выбери перевод' : 'Выбери турецкое слово'}
      </p>
      <h1 className="mb-6 text-2xl font-extrabold text-gray-800 dark:text-gray-100">{exercise.prompt}</h1>

      <div className="grid grid-cols-1 gap-3">
        {exercise.options.map((option) => {
          const isSelected = selected === option
          const isCorrectOpt = checked && option === exercise.correctOption
          const isWrongSelected = checked && isSelected && option !== exercise.correctOption
          return (
            <button
              key={option}
              disabled={checked}
              onClick={() => setSelected(option)}
              className={`rounded-2xl border-2 px-4 py-3.5 text-left text-lg font-bold transition-colors ${
                isCorrectOpt
                  ? 'border-duo-green bg-duo-green/10 text-duo-green-dark'
                  : isWrongSelected
                    ? 'border-duo-red bg-duo-red/10 text-duo-red-dark'
                    : isSelected
                      ? 'border-duo-blue bg-duo-blue/10 text-duo-blue-dark'
                      : 'border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {!checked && (
        <div className="mt-auto pt-6">
          <button
            onClick={check}
            disabled={!selected}
            className="btn-3d w-full rounded-2xl bg-duo-green py-3.5 text-lg font-extrabold text-white disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-700"
            style={{ ['--btn-shadow' as any]: '#58a700' }}
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  )
}
