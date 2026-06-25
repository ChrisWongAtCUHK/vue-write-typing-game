<script setup lang="ts">
import { ref } from 'vue'
import type ActiveWord from '@/types/activeWord.ts'
import type Particle from '@/types/particle.ts'
import GameScreen from './components/GameScreen.vue'
import type FloatingText from './types/floatingText.ts'
import type WaveBanner from './types/waveBanner.ts'

const MAX_HEALTH = 3

const level = ref<string>('')
const currentState = ref<string>('level')
// TODO: test data
const activeWords = ref<Array<ActiveWord>>([
  { id: 1, text: 'soup', kind: 'bombclear', x: 50.4193662278893, y: 24 },
  { id: 2, text: 'bug', kind: 'normal', x: 14.951919388628298, y: 52 },
])

const particles = ref<Array<Particle>>([
  {
    id: 0,
    x: 48.39617401951048,
    y: 46.23999999999982,
    color: '#f472b6',
    pieces: [
      {
        id: '0-0',
        dx: 51.16372846458143,
        dy: 20.269376458773667,
        rot: 43.80464641287251,
      },
      {
        id: '0-1',
        dx: 39.406676731416,
        dy: 29.96098193646582,
        rot: 329.32194829621983,
      },
      {
        id: '0-2',
        dx: 47.40436340223764,
        dy: 86.50270708277088,
        rot: 242.64219337601355,
      },
      {
        id: '0-3',
        dx: -10.486661699197423,
        dy: 64.044601737537,
        rot: 306.92513325830976,
      },
      {
        id: '0-4',
        dx: -37.406430164830404,
        dy: 74.72796233455519,
        rot: 188.64976108845897,
      },
      {
        id: '0-5',
        dx: -71.82074570948265,
        dy: 57.24955791429314,
        rot: 280.8202697995783,
      },
      {
        id: '0-6',
        dx: -50.49921735047635,
        dy: 14.306997536151417,
        rot: 14.027989198807834,
      },
      {
        id: '0-7',
        dx: -92.30880877361531,
        dy: -36.99615257673278,
        rot: 70.88619359018081,
      },
      {
        id: '0-8',
        dx: -54.05685963780775,
        dy: -59.34606515316711,
        rot: 139.88651328323098,
      },
      {
        id: '0-9',
        dx: -21.842218335830445,
        dy: -45.858953418580356,
        rot: 286.56767467585667,
      },
      {
        id: '0-10',
        dx: 10.468422877490408,
        dy: -84.25229193186988,
        rot: 213.73298085761343,
      },
      {
        id: '0-11',
        dx: 25.43262034833654,
        dy: -45.28308290541538,
        rot: 119.66544248836837,
      },
      {
        id: '0-12',
        dx: 51.85252741269423,
        dy: -58.878920671241254,
        rot: 329.0893142100557,
      },
      {
        id: '0-13',
        dx: 41.01212323953566,
        dy: -14.252466405625885,
        rot: 179.88063458814773,
      },
    ],
  },
])

const typingWord = ref<string>('')
const matchedWordId = ref<number | null>(null)
const errorPulse = ref<number>(0)
const healthFlash = ref<number>(0)
const bombPulse = ref<number>(0)

const floatingTexts = ref<Array<FloatingText>>([])
const waveBanner = ref<WaveBanner | null>(null)
const health = ref<number>(MAX_HEALTH)
const slowActive = ref<boolean>(false)

const resetRunState = () => {}

const startGame = (chosenLevel: string) => {
  resetRunState()
  level.value = chosenLevel
  currentState.value = 'game'
}

const backToLevel = () => {
  level.value = ''
  resetRunState()
  currentState.value = 'level'
}
</script>

<template>
  <GameScreen
    :active-words="activeWords"
    :typing-word="typingWord"
    :matched-word-id="matchedWordId"
    :error-pulse="errorPulse"
    :health-flash="healthFlash"
    :bomb-pulse="bombPulse"
    :particles="particles"
    :floating-texts="floatingTexts"
    :wave-banner="waveBanner"
    :health="health"
    :on-restart="backToLevel"
    :slow-active="slowActive"
  />
</template>

<style scoped></style>
