import { type Translation } from './translations-interfaces'
import Katakana from './translations-katakana'
import Hiragana from './translations-hiragana'

function allTranslations(): Translation[] {
  const combined = Katakana.concat(Hiragana)
  return combined
}

export { 
  allTranslations
}