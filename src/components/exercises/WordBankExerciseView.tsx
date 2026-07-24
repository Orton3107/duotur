import { useMemo, useState } from 'react'
import type { WordBankExercise } from '../../engine/types'

interface Props {
  exercise: WordBankExercise
  onSubmit: (correct: boolean) => void
}

interface Tile {
  id: number
  text: string
}

export function WordBankExerciseView({ exercise, onSubmit }: Props) {
  const isPhrase = exercise.word.tr.includes(' ')
  const bankTiles = useMemo<Tile[]>(() => exercise.tiles.map((text, id) => ({ id, text })), [exercise])

  const [bank, setBank] = useState<Tile[]>(bankTiles)
  const [answer, setAnswer] = useState<Tile[]>([])
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)

  function moveToAnswer(tile: Tile) {
    if (checked) return
    setBank((b) => b.filter((t) => t.id !== tile.id))
    setAnswer((a) => [...a, tile])
  }

  function moveToBank(tile: Tile) {
    if (checked) return
    setAnswer((a) => a.filter((t) => t.id !== tile.id))
    setBank((b) => [...b, tile])
  }

  function check() {
    if (answer.length === 0 || checked) return
    const built = answer.map((t) => t.text)
    const correct = built.join(isPhrase ? ' ' : '') === exercise.correctTiles.join(isPhrase ? ' ' : '')
    setChecked(true)
    setWasCorrect(correct)
    onSubmit(correct)
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-400">
        {isPhrase ? 'Собери фразу по-турецки' : 'Собери слово по буквам'}
      </p>
      <h1 className="mb-6 text-2xl font-extrabold text-gray-800 dark:text-gray-100">{exercise.prompt}</h1>

      <div className="mb-6 flex min-h-14 flex-wrap items-center gap-2 border-b-2 border-dashed border-gray-300 pb-3 dark:border-gray-700">
        {answer.map((tile) => (
          <button
            key={tile.id}
            onClick={() => moveToBank(tile)}
            disabled={checked}
            className={`rounded-xl border-2 px-3 py-2 text-lg font-bold ${
              checked
                ? wasCorrect
                  ? 'border-duo-green bg-duo-green/10 text-duo-green-dark'
                  : 'border-duo-red bg-duo-red/10 text-duo-red-dark'
                : 'border-gray-200 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            }`}
          >
            {tile.text}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {bank.map((tile) => (
          <button
            key={tile.id}
            onClick={() => moveToAnswer(tile)}
            disabled={checked}
            className="rounded-xl border-2 border-gray-200 bg-white px-3 py-2 text-lg font-bold text-gray-700 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            {tile.text}
          </button>
        ))}
      </div>

      {!checked && (
        <div className="mt-auto pt-6">
          <button
            onClick={check}
            disabled={answer.length === 0}
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
