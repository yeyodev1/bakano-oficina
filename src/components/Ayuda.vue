<script setup lang="ts">
// Botón ⓘ con una explicación corta. Funciona con el dedo (toca para abrir/cerrar) y con teclado.
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ texto: string; titulo?: string }>()
const abierto = ref(false)
const raiz = ref<HTMLElement | null>(null)
function fuera(e: MouseEvent) { if (raiz.value && !raiz.value.contains(e.target as Node)) abierto.value = false }
onMounted(() => document.addEventListener('click', fuera))
onBeforeUnmount(() => document.removeEventListener('click', fuera))
</script>

<template>
  <span ref="raiz" class="ayuda">
    <button type="button" class="i" :aria-expanded="abierto" :aria-label="`Qué es: ${titulo ?? 'este bloque'}`" @click.stop="abierto = !abierto">i</button>
    <span v-if="abierto" class="globo" role="note">
      <b v-if="titulo">{{ titulo }}</b>
      {{ texto }}
    </span>
  </span>
</template>

<style scoped>
.ayuda { position: relative; display: inline-flex; vertical-align: middle; }
.i { width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--control); background: var(--surface); color: var(--muted); font-size: 11px; font-weight: 600; cursor: pointer; display: grid; place-items: center; padding: 0; line-height: 1; }
.i:hover, .i[aria-expanded="true"] { background: var(--text); color: #fff; border-color: var(--text); }
.globo { position: absolute; top: 26px; left: 0; z-index: 20; width: min(300px, 78vw); background: var(--text); color: #fff; padding: 10px 12px; border-radius: 8px; font-size: var(--fs-small); line-height: 17px; font-weight: 400; box-shadow: 0 8px 24px rgba(0, 0, 0, .18); }
.globo b { display: block; margin-bottom: 2px; font-weight: 600; }
</style>
