import type { Word } from '../data/types'

export type ExerciseKind = 'mcq-tr-ru' | 'mcq-ru-tr' | 'word-bank' | 'type-tr'

export interface McqExercise {
  kind: 'mcq-tr-ru' | 'mcq-ru-tr'
  word: Word
  prompt: string
  options: string[]
  correctOption: string
}

export interface WordBankExercise {
  kind: 'word-bank'
  word: Word
  prompt: string
  tiles: string[]
  correctTiles: string[]
}

export interface TypeExercise {
  kind: 'type-tr'
  word: Word
  prompt: string
  answer: string
}

export type Exercise = McqExercise | WordBankExercise | TypeExercise
