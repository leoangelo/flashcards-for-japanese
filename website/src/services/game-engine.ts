import { type Translation } from '@/data/translations-interfaces'
import { type SubCategorySettings } from '@/stores/settings-interfaces'
import { allTranslations } from '@/data/translations'
import { shuffle, map, filter, uniq } from 'lodash'

function setupEngine(settings: SubCategorySettings[]) {
  const subCategories = enabledSubCategories(settings)
  const filteredItems = playableQuestions().filter((item) => {
    for (const aSubCategory of subCategories) {
      if (item.category == aSubCategory.parent && item.subcategory == aSubCategory.name) {
        return true
      }
    }
  })
  return shuffle(filteredItems)
}

function enabledSubCategories(settings: SubCategorySettings[]) {
  return filter(settings, (item) => {
    return item.value
  })
}

function playableQuestions(): Translation[] {
  return allTranslations().filter((item) => {
    return !item.exclude
  })
}

function getAllCategories() : string[] {
  return uniq(map(playableQuestions(), 'category'))
}

function getAllSubCategories(category: string): string[] {
  return uniq(map(filter(playableQuestions(), ((item)=> {
    return item.category == category
  })), 'subcategory'))
}

export {
  setupEngine,
  getAllCategories,
  getAllSubCategories
}