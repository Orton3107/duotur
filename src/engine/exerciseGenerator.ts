import type { Word } from '../data/types'
import type { Lesson } from '../data/lessons'
import type { Exercise, McqExercise, WordBankExercise, TypeExercise } from './types'
import { pickN, shuffle } from './random'

const MCQ_OPTION_COUNT = 4

function buildMcq(word: Word, pool: Word[], direction: 'tr-ru' | 'ru-tr'): McqExercise {
  const distractors = pickN(
    pool.filter((w) => w.id !== word.id),
    MCQ_OPTION_COUNT - 1,
  )
  if (direction === 'tr-ru') {
    const options = shuffle([word.ru, ...distractors.map((d) => d.ru)])
    return { kind: 'mcq-tr-ru', word, prompt: word.tr, options, correctOption: word.ru }
  }
  const options = shuffle([word.tr, ...distractors.map((d) => d.tr)])
  return { kind: 'mcq-ru-tr', word, prompt: word.ru, options, correctOption: word.tr }
}

function buildWordBank(word: Word, pool: Word[]): WordBankExercise {
  const isPhrase = word.tr.includes(' ')
  let correctTiles: string[]
  let decoyTiles: string[]

  if (isPhrase) {
    correctTiles = word.tr.split(' ')
    const decoySource = pool.filter((w) => w.id !== word.id && !w.tr.includes(' '))
    decoyTiles = pickN(decoySource, Math.min(2, decoySource.length)).map((w) => w.tr)
  } else {
    correctTiles = word.tr.split('')
    const alphabet = 'abcdefgğhıijklmnoöprsştuüvyz'.split('')
    const decoySource = alphabet.filter((c) => !correctTiles.includes(c))
    decoyTiles = pickN(decoySource, Math.min(3, decoySource.length))
  }

  return {
    kind: 'word-bank',
    word,
    prompt: word.ru,
    tiles: shuffle([...correctTiles, ...decoyTiles]),
    correctTiles,
  }
}

function buildTypeTr(word: Word): TypeExercise {
  return { kind: 'type-tr', word, prompt: word.ru, answer: word.tr }
}

/**
 * Builds the exercise sequence for a lesson: every word first appears as an easy
 * recognition MCQ, then again as a harder production exercise, interleaved and shuffled.
 */
export function generateLessonExercises(lesson: Lesson, wordPool: Word[]): Exercise[] {
  const easyPass = lesson.words.map((word) => buildMcq(word, wordPool, 'tr-ru'))

  const hardPass = lesson.words.map((word) => {
    const roll = Math.random()
    if (roll < 0.34) return buildMcq(word, wordPool, 'ru-tr')
    if (roll < 0.67) return buildWordBank(word, wordPool)
    return buildTypeTr(word)
  })

  return interleave(shuffle(easyPass), shuffle(hardPass))
}

function interleave<T>(a: T[], b: T[]): T[] {
  const result: T[] = []
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (i < a.length) result.push(a[i])
    if (i < b.length) result.push(b[i])
  }
  return result
}
