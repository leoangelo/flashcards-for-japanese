import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('progress', () => {
  const currentScore = ref(0)
  const currQuestionIndex = ref(0)
  function incrementCurrentScore() {
    currentScore.value++
  }
  function incrementQuestionIndex() {
    currQuestionIndex.value++
  }
  function reset() {
    currentScore.value = 0
    currQuestionIndex.value = 0
  }
  return {
    currentScore,
    currQuestionIndex,
    incrementCurrentScore,
    incrementQuestionIndex,
    reset
  }
})
