export type PartOfSpeech = 'n' | 'v' | 'adj' | 'adv' | 'phr' | 'pron' | 'num'

export interface Word {
  /** Unique within its module, e.g. "travel-014" */
  id: string
  /** Turkish */
  tr: string
  /** Russian translation */
  ru: string
  pos: PartOfSpeech
}

export type ModuleId = 'travel' | 'work' | 'family' | 'relationships' | 'friends'

export interface ModuleMeta {
  id: ModuleId
  title: string
  subtitle: string
  color: string
  colorDark: string
  emoji: string
}
