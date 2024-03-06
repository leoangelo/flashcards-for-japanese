<script setup lang="ts">
  import { ref } from 'vue'
  import { type SubCategorySettings } from '@/stores/settings-interfaces'  
  import { settingsStore } from '@/stores/settings'
  import { getAllCategories } from '@/services/game-engine'
  import Chevron from '@/components/chevron-component.vue'
  import Check from '@/components/check-component.vue'
  
  const store = settingsStore()

  const expandedFlags = new Map()
  for (const aCategory of getAllCategories()) {
    expandedFlags.set(aCategory, false)
  }
  const expandedFlagsRef = ref(expandedFlags)

  function toggleExpand(event: string) {
    const unwrapped = expandedFlagsRef.value
    unwrapped.set(event, !unwrapped.get(event))
  }

  function isCategorySelected(category: string): boolean {
    for (const aSub of subCategorySettings(store.subCategorySettings, category)) {
      if (!aSub.value) {
        return false
      }
    }
    return true
  }

  function setCategoryChecked(category: string, isChecked: boolean) {
    store.$patch((state) => {
      for (const aSub of subCategorySettings(state.subCategorySettings, category)) {
        aSub.value = isChecked
      }
      state.hasChanged = true
    })
  }

  function subCategorySettings(settings: SubCategorySettings[], categoryName: string) {
  return settings.filter((item) => {
    return item.parent == categoryName
  })
}

</script>

<template>
  <div class="mt-40 max-w-screen-sm">
    <div class="mb-10">
      <h1 class="text-2xl font-bold">Flashcards for Japanese</h1>
    </div>
    <div>
      <div v-for="category in getAllCategories()" :key="category">
        <div class="flex items-center">
          <Chevron :expanded="expandedFlagsRef.get(category)" @click="toggleExpand(category)" />
          <Check :checked="isCategorySelected(category)" />
          <span class="ml-1">{{ category }}</span>
        </div>
        <div v-if="expandedFlagsRef.get(category)">
          <div class="mt-2 mb-2">
            <button class="ml-8 py-2 px-4 rounded-full text-sm text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-900" @click="setCategoryChecked(category, true)">Select All</button>
            <button class="ml-2 py-2 px-4 rounded-full text-sm text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-900" @click="setCategoryChecked(category, false)">Unselect All</button>
          </div>
          <div v-for="subCategory in subCategorySettings(store.subCategorySettings, category)" :key="subCategory.name" class="ml-8">
            <input type="checkbox" v-model="subCategory.value" class="form-checkbox rounded" />
            <label class="ml-2">{{ subCategory.name }}</label>
          </div>
        </div>        
      </div>
    </div>
    <div class="mt-8 mb-16">
      <div class="flex justify-center">
        <RouterLink to="main" class="py-2 px-4 rounded-full text-lg text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-900">Start!</RouterLink>
      </div>
    </div>
  </div>  
</template>
