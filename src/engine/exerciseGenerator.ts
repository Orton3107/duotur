import type { Word } from '../data/types'
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
 * Builds the exercise sequence for a set of words, each word repeated across several
 * "passes" so a beginner sees it more than once: first an easy recognition MCQ, then
 * (for new-content lessons) the reverse-direction MCQ, then a production exercise
 * (word-bank or typing). Review sessions use fewer passes since the words aren't new.
 */
export function generateExercises(words: Word[], wordPool: Word[], passes: 2 | 3 = 3): Exercise[] {
  const recognitionPass = words.map((word) => buildMcq(word, wordPool, 'tr-ru'))
  const reversePass = words.map((word) => buildMcq(word, wordPool, 'ru-tr'))
  const productionPass = words.map((word) => (Math.random() < 0.5 ? buildWordBank(word, wordPool) : buildTypeTr(word)))

  const allPasses: Exercise[][] =
    passes === 3 ? [recognitionPass, reversePass, productionPass] : [recognitionPass, productionPass]
  return interleaveMany(allPasses.map(shuffle))
}

function interleaveMany<T>(lists: T[][]): T[] {
  const result: T[] = []
  const max = Math.max(...lists.map((l) => l.length))
  for (let i = 0; i < max; i++) {
    for (const list of lists) {
      if (i < list.length) result.push(list[i])
    }
  }
  return result
}
