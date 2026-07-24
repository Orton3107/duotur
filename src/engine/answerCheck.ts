/** Normalizes Turkish text for typing-exercise comparison: locale-aware casefold, trim, collapse whitespace, strip trailing punctuation. */
export function normalizeTr(input: string): string {
  return input
    .trim()
    .toLocaleLowerCase('tr')
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ')
}

export function isCorrectAnswer(input: string, answer: string): boolean {
  return normalizeTr(input) === normalizeTr(answer)
}
