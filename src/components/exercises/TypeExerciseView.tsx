import { useRef, useState } from 'react'
import type { TypeExercise } from '../../engine/types'
import { isCorrectAnswer } from '../../engine/answerCheck'

interface Props {
  exercise: TypeExercise
  onSubmit: (correct: boolean) => void
}

const SPECIAL_CHARS = ['ı', 'İ', 'ğ', 'ü', 'ş', 'ö', 'ç']

export function TypeExerciseView({ exercise, onSubmit }: Props) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function insertChar(char: string) {
    if (checked) return
    setValue((v) => v + char)
    inputRef.current?.focus()
  }

  function check() {
    if (!value.trim() || checked) return
    const correct = isCorrectAnswer(value, exercise.answer)
    setChecked(true)
    setWasCorrect(correct)
    onSubmit(correct)
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">Напиши по-турецки</p>
      <h1 className="mb-6 text-2xl font-extrabold text-gray-800 dark:text-gray-100">{exercise.prompt}</h1>

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && check()}
        disabled={checked}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Turkish cevap..."
        className={`w-full rounded-2xl border-2 px-4 py-3.5 text-lg font-bold outline-none dark:bg-gray-800 dark:text-gray-100 ${
          checked
            ? wasCorrect
              ? 'border-duo-green bg-duo-green/10'
              : 'border-duo-red bg-duo-red/10'
            : 'border-gray-300 focus:border-duo-blue dark:border-gray-600'
        }`}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {SPECIAL_CHARS.map((char) => (
          <button
            key={char}
            onClick={() => insertChar(char)}
            disabled={checked}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-base font-bold text-gray-600 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300"
          >
            {char}
          </button>
        ))}
      </div>

      {checked && !wasCorrect && (
        <p className="mt-3 text-sm font-bold text-duo-red-dark">Правильный ответ: {exercise.answer}</p>
      )}

      {!checked && (
        <div className="mt-auto pt-6">
          <button
            onClick={check}
            disabled={!value.trim()}
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
