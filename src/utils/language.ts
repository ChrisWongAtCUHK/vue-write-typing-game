const STORAGE_KEY = 'writé:lang'

let current = 'en'
try {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'tr' || raw === 'en') current = raw
} catch (e) {}

const listeners = new Set()

export const getLanguage = () => current

export const setLanguage = (lang: string) => {
  if (lang !== 'en' && lang !== 'tr') return
  current = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch (e) {}
  listeners.forEach((fn: any) => fn(current))
}

export const subscribeLanguage = (fn: any) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

const LETTER_REGEX = /^[a-zA-ZçğıöşüÇĞİÖŞÜ]$/

export const isLetter = (ch: string) => LETTER_REGEX.test(ch)

const TR_LOWER_MAP: Record<string, string> = {
  İ: 'i',
  I: 'ı',
}

export const normalizeLetter = (ch: string) => {
  // Now TypeScript knows that any string lookup returns a string or undefined
  if (ch in TR_LOWER_MAP) {
    return TR_LOWER_MAP[ch]
  }
  return ch.toLowerCase()
}
