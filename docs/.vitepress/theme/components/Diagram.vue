<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ caption?: string }>()

const zoomed = ref(false)

function toggle() {
  zoomed.value = !zoomed.value
  document.body.classList.toggle('ab-diagram-lock', zoomed.value)
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && zoomed.value) toggle()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.classList.remove('ab-diagram-lock')
})
</script>

<template>
  <figure class="ab-diagram" :class="{ 'is-zoomed': zoomed }">
    <div class="ab-diagram__frame" @click="toggle">
      <div class="ab-diagram__canvas">
        <slot />
      </div>
      <button class="ab-diagram__btn" type="button" @click.stop="toggle">
        {{ zoomed ? '缩小' : '放大' }}
      </button>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>
