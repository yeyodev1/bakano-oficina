<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps<{ abierto: boolean; titulo: string }>()
const emit = defineEmits<{ cerrar: [] }>()
function tecla(e: KeyboardEvent) { if (e.key === 'Escape') emit('cerrar') }
onMounted(() => document.addEventListener('keydown', tecla))
onBeforeUnmount(() => { document.removeEventListener('keydown', tecla); document.body.style.overflow = '' })
watch(() => props.abierto, v => { document.body.style.overflow = v ? 'hidden' : '' })
</script>

<template>
  <Teleport to="body">
    <div v-if="abierto" class="fondo" @click.self="emit('cerrar')">
      <div class="hoja" role="dialog" aria-modal="true" :aria-label="titulo">
        <header>
          <h2>{{ titulo }}</h2>
          <button class="btn" type="button" @click="emit('cerrar')">Cerrar</button>
        </header>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.fondo { position: fixed; inset: 0; background: rgba(10, 10, 10, .5); display: grid; place-items: end center; z-index: 40; }
.hoja { background: var(--surface); width: 100%; max-width: 760px; max-height: 88vh; overflow: auto; border-radius: 12px 12px 0 0; padding: 16px 20px 32px; }
header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; position: sticky; top: -16px; background: var(--surface); padding: 4px 0 8px; }
h2 { font-size: var(--fs-section); font-weight: 600; }
@media (min-width: 640px) { .fondo { place-items: center; } .hoja { border-radius: 12px; padding-bottom: 20px; } }
</style>
