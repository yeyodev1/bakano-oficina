<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps<{ abierto: boolean; titulo: string }>()
const emit = defineEmits<{ cerrar: [] }>()
function tecla(e: KeyboardEvent) { if (e.key === 'Escape' && props.abierto) emit('cerrar') }
onMounted(() => document.addEventListener('keydown', tecla))
onBeforeUnmount(() => { document.removeEventListener('keydown', tecla); document.body.style.overflow = '' })
watch(() => props.abierto, v => { document.body.style.overflow = v ? 'hidden' : '' })
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="abierto" class="fondo" @click.self="emit('cerrar')">
        <div class="hoja" role="dialog" aria-modal="true" :aria-label="titulo">
          <header>
            <h2>{{ titulo }}</h2>
            <button class="btn" type="button" @click="emit('cerrar')">Cerrar</button>
          </header>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fondo { position: fixed; inset: 0; background: rgba(0, 0, 0, .6); display: flex; align-items: flex-end; justify-content: center; z-index: 40; }
.hoja { background: var(--surface); width: 100%; max-width: 760px; max-height: 88vh; overflow: auto; border-radius: 12px 12px 0 0; padding: 16px 20px 32px; border: 1px solid var(--border); }
header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; position: sticky; top: -16px; background: var(--surface); padding: 4px 0 8px; }
h2 { font-size: var(--fs-section); font-weight: 600; }
/* entrada y salida: el fondo se funde, la hoja sube desde abajo (en pantalla grande, aparece desde el centro) */
.modal-enter-active { transition: opacity .22s ease; }
.modal-leave-active { transition: opacity .18s ease; }
.modal-enter-active .hoja { transition: transform .26s cubic-bezier(.22, 1, .36, 1), opacity .22s ease; }
.modal-leave-active .hoja { transition: transform .18s ease-in, opacity .18s ease-in; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .hoja, .modal-leave-to .hoja { transform: translateY(24px); opacity: 0; }
@media (min-width: 640px) {
  .fondo { align-items: center; }
  .hoja { border-radius: 12px; padding-bottom: 20px; }
  .modal-enter-from .hoja, .modal-leave-to .hoja { transform: translateY(12px) scale(.98); }
}
@media (prefers-reduced-motion: reduce) { .modal-enter-active, .modal-leave-active, .modal-enter-active .hoja, .modal-leave-active .hoja { transition: none; } }
</style>
