<script setup lang="ts">
import { settingsStore } from '@/stores/settings'
import progressStore from '@/stores/progress'
import { setupEngine } from '@/services/game-engine'
import { computed, ref, type Ref } from 'vue'
import router from '@/router';

const settings = settingsStore()
const progress = progressStore()
let allQuestions = setupEngine(settings.subCategorySettings)

const answerInput = ref('')
const result = ref('')
const displayResult = ref(false)
const displayMyAnswer = ref(true)
const displayNext = ref(false)
const displayScore = ref(false)

// element refs
const nextButtonRef: Ref = ref(null)
const answerInputRef: Ref = ref(null)

const isAnswerButtonDisabled = computed(() => {
  return answerInput.value == '' 
})

function answered() {
  if (answerInput.value != '') {
    evaluateAnswer()
  }
}

function dontKnow() {
  answerInput.value = ''
  evaluateAnswer()
}

function evaluateAnswer() {
  console.log(`you answered ${answerInput.value}`)
  console.log(`the correct answer is: ${allQuestions[progress.currQuestionIndex].eng}`)
  if (answerInput.value.toLowerCase() == allQuestions[progress.currQuestionIndex].eng) {
    // answer is correct
    result.value = `You got the correct answer!!!`
    progress.incrementCurrentScore()
  } else {
    result.value = `The correct answer is: ${allQuestions[progress.currQuestionIndex].eng}`    
    // answer is wrong
  }
  displayResult.value = true
  displayMyAnswer.value = false
  if (progress.currQuestionIndex + 1 < allQuestions.length) {
    displayNext.value = true
    setTimeout(() => {
      if (nextButtonRef.value) { 
        nextButtonRef.value.focus()
      }
    }, 0.1)
  } else {
    displayScore.value = true
  }
  utterAnswer(allQuestions[progress.currQuestionIndex].jp)
}

function utterAnswer(answer: string) {
  const allVoices = window.speechSynthesis.getVoices()
  const kyoko = allVoices.find((item) => {
    return item.name == 'Kyoko'
  })

  const msg = new SpeechSynthesisUtterance()
  msg.lang = 'ja-JP'
  if (kyoko != null) {
    msg.voice = kyoko
  }
  msg.rate = 0.5
  msg.text = answer
  window.speechSynthesis.speak(msg)
}

function next() {
  displayResult.value = false
  displayMyAnswer.value = true
  displayNext.value = false
  answerInput.value = ''
  progress.incrementQuestionIndex()
  setTimeout(() => {
    if (answerInputRef.value) {
      answerInputRef.value.focus()
    }
  }, 0.1)
}

function restartGame() {
  answerInput.value = ''
  displayResult.value = false
  displayMyAnswer.value = true
  displayNext.value = false
  displayScore.value = false
  allQuestions = setupEngine(settings.subCategorySettings)
  progress.reset()
}

function endGame() {
  progress.reset()
  router.go(-1)
}

</script>

<template>
  <div v-if="allQuestions.length > 0" class="mt-16">
    <div class="flex justify-center">
      <span class="text-zinc-500">{{ progress.currQuestionIndex + 1 }} / {{ allQuestions.length }}</span>
    </div>
    <div class="mt-8 flex justify-center">
      <span class="p-8 text-9xl rounded-sm border-2 border-slate-600">{{ allQuestions[progress.currQuestionIndex].jp }}</span>
    </div>
    <div v-if="displayMyAnswer" class="mt-16 flex justify-center">
      <input type="text" ref="answerInputRef" class="w-1/4 rounded-full border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" v-model="answerInput" @keyup.enter="answered">
      <button class="py-2 px-4 ml-4 rounded-full text-lg text-white bg-teal-700 hover:bg-teal-500 focus:bg-teal-900 disabled:bg-neutral-400" @click="answered" :disabled="isAnswerButtonDisabled">Answer</button>
      <button class="py-2 px-8 ml-4 rounded-full text-lg text-white bg-amber-400 hover:bg-amber-300 focus:bg-amber-600" @click="dontKnow">?</button>
    </div>
    <div v-if="displayResult" class="mt-16 flex justify-center">
      <span class="font-semibold">{{ result }}</span>
    </div>    
    <div v-if="displayNext" class="mt-8  flex justify-center">
      <button ref="nextButtonRef" class="py-2 px-4 rounded-full text-lg text-white bg-indigo-700 hover:bg-indigo-500 focus:bg-indigo-900" @click="next">Next</button>
    </div>
    <div v-if="displayScore" class="mt-8 flex justify-center">
      <span class="font-semibold text-xl">FINAL SCORE: {{ progress.currentScore }} / {{ allQuestions.length }}</span>
    </div>
    <div class="mt-36  flex justify-center">
      <button class="py-2 px-4 rounded-full text-lg text-white bg-red-700 hover:bg-red-500 focus:bg-red-900" @click="restartGame">Restart</button>
      <button class="ml-8 py-2 px-4 rounded-full text-lg text-white bg-red-700 hover:bg-red-500 focus:bg-red-900" @click="endGame">End Game</button>
    </div>
  </div>
  <div v-else class="mt-24 flex justify-center">
    <RouterLink to="/" class="py-2 px-4 rounded-full text-lg text-white bg-blue-700 hover:bg-blue-500 focus:bg-blue-900">Make Selections</RouterLink>
  </div>
</template>