<template>
  <main v-if="!celebrationStarted" class="waiting-page">
    <div class="waiting-confetti" aria-hidden="true">
      <i v-for="piece in confetti" :key="piece.id" :style="piece.style"></i>
    </div>
    <div class="waiting-content">
      <p class="eyebrow">A little birthday surprise is on the way <span>✦</span></p>
      <h1>Counting down<br><em>to Lawrencia &amp; Laura.</em></h1>
      <p class="waiting-note">Their special day is almost here. Come back when the countdown reaches zero.</p>
      <div class="waiting-timer" aria-label="Countdown to the birthday celebration">
        <div v-for="unit in countdownUnits" :key="unit.label">
          <strong>{{ unit.value }}</strong>
          <span>{{ unit.label }}</span>
        </div>
      </div>
      <p class="waiting-signoff">A birthday wish in advance, with love <span>♥</span></p>
    </div>
  </main>

  <main v-else class="birthday-page celebration-started" @pointerdown="startBackgroundMusic" @keydown="startBackgroundMusic">
    <audio ref="backgroundAudio" autoplay loop preload="auto" aria-hidden="true">
      <source src="/Happy%20Birthday%20R%26B%20Instrumental.mp3" type="audio/mpeg">
    </audio>
    <div class="arrival-balloons" aria-hidden="true">
      <i></i><i></i><i></i><i></i><i></i>
    </div>
    <div class="confetti" aria-hidden="true">
      <i v-for="piece in confetti" :key="piece.id" :style="piece.style"></i>
    </div>

    <section class="hero-shell">
      <nav class="topbar" aria-label="Page navigation">
        <a class="brand" href="#top"><span>02</span> birthday club</a>
        <div class="topbar-actions">
          <a class="date-chip" href="#wishes">August 25 <span>2026</span></a>
        </div>
      </nav>

      <div id="top" class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">A very special delivery <span>✦</span></p>
          <h1>Lawrencia<br><em>&amp; Laura.</em></h1>
          <p class="intro">Happy birthday, Lawrencia and Laura! I hope today brings you both plenty of laughs, good food, and all the love you deserve. You two make every moment more fun.</p>
          <a class="wish-link" href="#wishes">Open your wishes <span>↓</span></a>
        </div>

        <div class="cake-stage" :class="{ 'is-lit': candlesLit, 'is-wishing': isWishing }" aria-label="Birthday cake illustration">
          <div class="sparkle sparkle-one">✦</div>
          <div class="sparkle sparkle-two">✧</div>
          <span class="balloon balloon-one" :class="{ 'is-popped': candlesLit }" aria-hidden="true"></span>
          <span class="balloon balloon-two" :class="{ 'is-popped': candlesLit }" aria-hidden="true"></span>
          <span class="balloon balloon-three" :class="{ 'is-popped': candlesLit }" aria-hidden="true"></span>
          <div class="cake-plate"></div>
          <div class="cake cake-trigger" role="button" tabindex="0" aria-label="Tap the cake to make a birthday wish" @click="makeWish" @keydown.enter="makeWish" @keydown.space.prevent="makeWish">
            <div class="candle candle-left"><b></b></div>
            <div class="candle candle-right"><b></b></div>
            <div class="icing"></div>
            <div class="cake-body"><span>L</span><span>+</span><span>L</span></div>
          </div>
          <button class="pop-button" type="button" :disabled="isWishing || messageRevealed" @click="makeWish">
            {{ messageRevealed ? 'Birthday magic!' : isWishing ? 'Popping...' : 'Pop the balloons' }} <strong>✦</strong>
          </button>
        </div>
      </div>
    </section>

    <section class="celebration-strip" aria-label="Birthday countdown">
      <div class="strip-label"><span class="live-dot"></span> Lawrencia + Laura's celebration</div>
      <div class="countdown">
        <div v-for="unit in countdownUnits" :key="unit.label" class="countdown-unit">
          <strong>{{ unit.value }}</strong><span>{{ unit.label }}</span>
        </div>
      </div>
      <p>Make today wonderfully unforgettable.</p>
    </section>

    <section id="wishes" class="wishes-section" :class="{ 'is-revealed': messageRevealed }" aria-live="polite">
      <div class="section-heading">
        <p class="eyebrow">For the birthday sisters</p>
        <h2>Lawrencia &amp; Laura,<br><em>keep shining.</em></h2>
      </div>
      <div v-if="!messageRevealed" class="locked-message">
        <span class="lock-spark">✦</span>
        <p>Your birthday wishes are waiting.</p>
        <small>Light the candles above to open them.</small>
      </div>
      <div v-else class="wish-grid">
        <article v-for="(wish, index) in wishes" :key="wish.title" class="wish-card" :class="`wish-card-${index + 1}`">
          <span class="card-number">0{{ index + 1 }}</span>
          <div class="wish-icon">{{ wish.icon }}</div>
          <h3>{{ wish.title }}</h3>
          <p>{{ wish.text }}</p>
        </article>
      </div>
    </section>

    <section class="memories-section" aria-labelledby="memories-title">
      <div class="memories-heading">
        <div>
          <p class="eyebrow">The good times folder</p>
          <h2 id="memories-title">A few of our<br><em>favorite moments.</em></h2>
        </div>
        <p class="memory-count">{{ memories.length }} little memories</p>
      </div>
      <div class="memory-carousel" @touchstart="startSwipe" @touchend="finishSwipe">
        <button class="carousel-arrow carousel-prev" type="button" aria-label="Previous memory" @click="showPreviousMemory">←</button>
        <div :key="currentMemory.src" class="memory-slide" :class="[`memory-slide-${activeMemoryIndex + 1}`, { 'is-photo': currentMemory.type === 'image', 'is-last-video': activeMemoryIndex === memories.length - 1 }]">
          <img v-if="currentMemory.type === 'image'" :src="currentMemory.src" :alt="currentMemory.alt" @click="selectedMemory = currentMemory">
          <video v-else controls autoplay muted loop playsinline :poster="currentMemory.poster">
            <source :src="currentMemory.src" type="video/mp4">
          </video>
        </div>
        <button class="carousel-arrow carousel-next" type="button" aria-label="Next memory" @click="showNextMemory">→</button>
      </div>
      <div class="carousel-dots" aria-label="Choose a memory">
        <button v-for="(memory, index) in memories" :key="memory.src" type="button" :class="{ 'is-active': index === activeMemoryIndex }" :aria-label="`Show memory ${index + 1}: ${memory.label}`" @click="activeMemoryIndex = index"></button>
      </div>
      <div v-if="selectedMemory" class="photo-lightbox" role="dialog" aria-modal="true" aria-label="Expanded birthday memory" @click.self="selectedMemory = null">
        <button class="close-lightbox" type="button" aria-label="Close photo" @click="selectedMemory = null">×</button>
        <img :src="selectedMemory.src" :alt="selectedMemory.alt">
      </div>
    </section>

    <footer class="footer-note">Made with a little extra sparkle for two unforgettable souls <span>♥</span></footer>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const route = useRoute()
const candlesLit = ref(false)
const isWishing = ref(false)
const messageRevealed = ref(false)
const now = ref(0)
let countdownInterval
let revealTimer

const confetti = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  style: {
    '--x': `${(index * 47) % 100}%`,
    '--delay': `${(index % 8) * -0.7}s`,
    '--duration': `${5 + (index % 5)}s`,
    '--color': ['#ef6b5e', '#f3c969', '#3e9e8f', '#ee9b73'][index % 4]
  }
}))

const wishes = [
  { icon: '✺', title: 'More magic', text: 'May this next chapter surprise you with brave dreams, soft landings, and the kind of joy that stays.' },
  { icon: '♡', title: 'Double joy', text: 'Here is to the inside jokes, the big hugs, and every memory that is better because you have each other.' },
  { icon: '✦', title: 'Big dreams', text: 'Take up space, chase the impossible, and remember how much light you bring everywhere you go.' }
]

const memories = [
  { type: 'image', src: '/LL2.jpeg', alt: 'Lawrencia and Laura smiling together', label: 'Together is the best place' },
  { type: 'image', src: '/LL3.jpeg', alt: 'A birthday memory with Lawrencia and Laura', label: 'Good energy only' },
  { type: 'video', src: '/LL1.mp4', poster: '/LL2.jpeg', label: 'A moment worth replaying' },
  { type: 'image', src: '/LL4.jpeg', alt: 'A joyful memory with the birthday sisters', label: 'Main character energy' },
  { type: 'video', src: '/LL5.mp4', poster: '/LL4.jpeg', label: 'The laughs say it all' }
]

const selectedMemory = ref(null)
const activeMemoryIndex = ref(0)
const swipeStartX = ref(0)
const backgroundAudio = ref(null)
let musicStarted = false
const currentMemory = computed(() => memories[activeMemoryIndex.value])

const countdownUnits = computed(() => {
  const birthday = new Date('2026-08-25T00:00:00-04:00')
  const difference = now.value === 0 ? 0 : Math.max(0, birthday.getTime() - now.value)
  return [
    ['days', Math.floor(difference / 86400000)],
    ['hours', Math.floor((difference / 3600000) % 24)],
    ['mins', Math.floor((difference / 60000) % 60)],
    ['secs', Math.floor((difference / 1000) % 60)]
  ].map(([label, value]) => ({ label, value: String(value).padStart(2, '0') }))
})

const celebrationStarted = computed(() => {
  const birthday = new Date('2026-08-25T00:00:00-04:00')
  return route.query.celebrate === '1' || (now.value !== 0 && now.value >= birthday.getTime())
})

function makeWish() {
  if (isWishing.value || messageRevealed.value) return

  startBackgroundMusic()
  isWishing.value = true
  candlesLit.value = true
  revealTimer = window.setTimeout(() => {
    isWishing.value = false
    messageRevealed.value = true
  }, 1200)
}

function startBackgroundMusic() {
  if (musicStarted || !celebrationStarted.value || !backgroundAudio.value) return

  musicStarted = true
  backgroundAudio.value.volume = 0.28
  backgroundAudio.value.play().catch(() => { musicStarted = false })
}

function showPreviousMemory() {
  activeMemoryIndex.value = (activeMemoryIndex.value - 1 + memories.length) % memories.length
}

function showNextMemory() {
  activeMemoryIndex.value = (activeMemoryIndex.value + 1) % memories.length
}

function startSwipe(event) {
  swipeStartX.value = event.changedTouches[0].clientX
}

function finishSwipe(event) {
  const distance = event.changedTouches[0].clientX - swipeStartX.value
  if (Math.abs(distance) < 45) return
  if (distance < 0) showNextMemory()
  else showPreviousMemory()
}

onMounted(() => {
  now.value = Date.now()
  countdownInterval = window.setInterval(() => { now.value = Date.now() }, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(countdownInterval)
  window.clearTimeout(revealTimer)
  backgroundAudio.value?.pause()
})
</script>
