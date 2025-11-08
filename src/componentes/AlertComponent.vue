<!-- src/componentes/AlertComponent.vue -->
<template>
  <div
    v-if="visible"
    class="alert alert-dismissible fade show text-center"
    :class="`alert-${variant}`"
    role="alert"
  >
    <strong>{{ message }}</strong>
    <button
      type="button"
      class="btn-close"
      @click="close"
      aria-label="Close"
    ></button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, required: true },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
  },
  autoClose: { type: Number, default: 2000 }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
let autoCloseTimer = null

// Sincroniza con el prop
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) startAutoClose()
})

// Iniciar el temporizador al montar si es visible
onMounted(() => {
  if (visible.value) startAutoClose()
})

const startAutoClose = () => {
  if (props.autoClose) {
    if (autoCloseTimer) clearTimeout(autoCloseTimer)
    autoCloseTimer = setTimeout(() => {
      close()
    }, props.autoClose)
  }
}

const close = () => {
  visible.value = false
  emit('update:modelValue', false)
}

onBeforeUnmount(() => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer)
})
</script>