import type { ModuleMeta, Word } from './types'
import { travelWords } from './words/travel'
import { workWords } from './words/work'
import { familyWords } from './words/family'
import { relationshipsWords } from './words/relationships'
import { friendsWords } from './words/friends'

export const moduleMetas: ModuleMeta[] = [
  {
    id: 'travel',
    title: 'Путешествия',
    subtitle: 'Аэропорт, отель, дорога',
    color: '#1cb0f6',
    colorDark: '#1899d6',
    emoji: '✈️',
  },
  {
    id: 'work',
    title: 'Работа',
    subtitle: 'Офис, коллеги, задачи',
    color: '#ce82ff',
    colorDark: '#a568cc',
    emoji: '💼',
  },
  {
    id: 'family',
    title: 'Семья',
    subtitle: 'Родные и близкие',
    color: '#ffc800',
    colorDark: '#e6b400',
    emoji: '👨‍👩‍👧',
  },
  {
    id: 'relationships',
    title: 'Отношения',
    subtitle: 'Чувства и любовь',
    color: '#ff4b4b',
    colorDark: '#ea2b2b',
    emoji: '❤️',
  },
  {
    id: 'friends',
    title: 'Друзья',
    subtitle: 'Общение и встречи',
    color: '#58cc02',
    colorDark: '#58a700',
    emoji: '🤝',
  },
]

export const wordsByModule: Record<string, Word[]> = {
  travel: travelWords,
  work: workWords,
  family: familyWords,
  relationships: relationshipsWords,
  friends: friendsWords,
}

export const totalWordCount = Object.values(wordsByModule).reduce((sum, w) => sum + w.length, 0)
