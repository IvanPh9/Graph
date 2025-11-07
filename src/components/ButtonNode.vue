<script setup>
import { startMoving } from "@/composables/useButtons.js"
import { handleButtonClick } from "@/composables/useLines.js"
const props = defineProps({
  button: Object
})
</script>

<template>
  <button
      class="absolute rounded-full border-3 border-gray-800"
      v-if="props.button.isShowed"
      @mousedown="e => startMoving(e, props.button)"
      @mousemove="props.button.hovered = true"
      @mouseleave="props.button.hovered = false"
      @click="e => handleButtonClick(e, props.button)"
      :style="{
      left: props.button.position.x + 'px',
      top: props.button.position.y + 'px',
      transform: 'translate(-50%, -50%)',
      width: props.button.computedSize + 'px',
      height: props.button.computedSize + 'px',
      backgroundColor: props.button.color
    }">
  </button>
</template>