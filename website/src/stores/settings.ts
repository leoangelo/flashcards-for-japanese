import { ref, type Ref } from 'vue'
import { defineStore, type StoreDefinition } from 'pinia'
import { getAllCategories, getAllSubCategories } from '@/services/game-engine'
import type { SubCategorySettings } from './settings-interfaces'

const settingsStore: StoreDefinition = defineStore('settings', () => {
  const subCategorySettings: Ref<SubCategorySettings[]> = ref(buildSubCategorySettings())
  return {
    subCategorySettings
  }
})

function buildSubCategorySettings(): SubCategorySettings[] {
  const settings = []
  for (const aCategory of getAllCategories()) {
    const subcats = getAllSubCategories(aCategory)
    for (const aSubCat of subcats) {
      settings.push({
        name: aSubCat,
        parent: aCategory,
        value: false
      })
    }
  }
  return settings
}

export {
  settingsStore
}