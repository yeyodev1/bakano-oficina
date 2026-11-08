<script setup lang="ts">
// Botón ⓘ con una explicación corta. Funciona con el dedo (toca para abrir/cerrar) y con teclado.
// El globo se posiciona fijo y se recoloca para no salirse nunca de la pantalla.
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{ texto: string; titulo?: string }>()
const abierto = ref(false)
const raiz = ref<HTMLElement | null>(null)
const boton = ref<HTMLElement | null>(null)
const estilo = ref<Record<string, string>>({})

function colocar() {
  const b = boton.value?.getBoundingClientRect()
  if (!b) return
  const margen = 12
  const ancho = Math.min(320, window.innerWidth - margen * 2)
  let left = b.left
  if (left + ancho > window.innerWidth - margen) left = window.innerWidth - margen - ancho
  if (left < margen) left = margen
  const abajo = window.innerHeight - b.bottom > 160
  estilo.value = { left: `${left}px`, width: `${ancho}px`, ...(abajo ? { top: `${b.bottom + 6}px` } : { bottom: `${window.innerHeight - b.top + 6}px` }) }
}
async function alternar() {
  abierto.value = !abierto.value
  if (abierto.value) { await nextTick(); colocar() }
}
function fuera(e: MouseEvent) { if (raiz.value && !raiz.value.contains(e.target as Node)) abierto.value = false }
function cerrar() { abierto.value = false }
onMounted(() => { document.addEventListener('click', fuera); window.addEventListener('scroll', cerrar, true); window.addEventListener('resize', cerrar) })
onBeforeUnmount(() => { document.removeEventListener('click', fuera); window.removeEventListener('scroll', cerrar, true); window.removeEventListener('resize', cerrar) })
</script>

<template>
  <span ref="raiz" class="ayuda">
    <button ref="boton" type="button" class="i" :aria-expanded="abierto" :aria-label="`Qué es: ${titulo ?? 'este bloque'}`" @click.stop="alternar">i</button>
    <Teleport to="body">
      <Transition name="globo">
        <span v-if="abierto" class="globo" role="note" :style="estilo" @click.stop>
          <b v-if="titulo">{{ titulo }}</b>
          {{ texto }}
        </span>
      </Transition>
    </Teleport>
  </span>
</template>

<style>
/* sin scoped: el globo vive en <body> por el Teleport */
.ayuda { position: relative; display: inline-flex; vertical-align: middle; }
.ayuda .i { width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--control); background: var(--surface); color: var(--muted); font-size: 11px; font-weight: 600; cursor: pointer; display: grid; place-items: center; padding: 0; line-height: 1; transition: background .15s, color .15s; }
.ayuda .i:hover, .ayuda .i[aria-expanded="true"] { background: #fff; color: #0a0a0a; border-color: #fff; }
.globo { position: fixed; z-index: 60; background: #fff; color: #0a0a0a; padding: 10px 12px; border-radius: 8px; font-size: 12px; line-height: 17px; font-weight: 400; box-shadow: 0 8px 24px rgba(0, 0, 0, .35); transform-origin: top left; }
.globo b { display: block; margin-bottom: 2px; font-weight: 600; }
.globo-enter-active { transition: opacity .16s ease, transform .18s cubic-bezier(.22, 1, .36, 1); }
.globo-leave-active { transition: opacity .12s ease, transform .12s ease-in; }
.globo-enter-from, .globo-leave-to { opacity: 0; transform: translateY(-4px) scale(.98); }
</style>
