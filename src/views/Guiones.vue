<script setup lang="ts">
import { computed, ref } from 'vue'
import Ayuda from '../components/Ayuda.vue'
import GuionCard from '../components/GuionCard.vue'
import { useDatos } from '../datos'

const { datos } = useDatos()
const filtro = ref<'todos' | 'radar' | 'diego' | 'denis' | 'telegram'>('todos')
const lista = computed(() => (datos.value?.guiones ?? []).filter(g => filtro.value === 'todos' || g.nombre.includes(filtro.value)))
const opciones = [['todos', 'Todos'], ['radar', 'Reels con IA'], ['diego', 'Diego'], ['denis', 'Denisse'], ['telegram', 'Pedidos por Telegram']] as const
</script>

<template>
  <section v-if="datos" class="panel">
    <header>
      <h2>Guiones <Ayuda titulo="Guiones" texto="Todos los guiones que escribieron los agentes, del más nuevo al más viejo. Cada ficha dice para quién es, el gancho, el porqué y el caption. «Leer el guion» lo abre completo." /></h2>
      <span class="meta">{{ lista.length }} guiones</span>
    </header>
    <div class="segmentos" role="tablist">
      <button v-for="[v, t] in opciones" :key="v" type="button" role="tab" :aria-selected="filtro === v" :class="{ on: filtro === v }" @click="filtro = v">{{ t }}</button>
    </div>
    <div class="fichas">
      <GuionCard v-for="g in lista" :key="g.nombre" :guion="g" />
      <p v-if="!lista.length" class="vacio" style="flex-basis:100%">No hay guiones en esta vista.</p>
    </div>
  </section>
</template>

<style scoped>
.segmentos { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 12px; }
.segmentos button { height: 32px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--control); background: var(--surface); white-space: nowrap; cursor: pointer; }
.segmentos button.on { background: #ffffff; color: #0a0a0a; border-color: #ffffff; }
.fichas { display: flex; flex-wrap: wrap; gap: var(--gap); }
.fichas > * { flex: 1 1 100%; min-width: 0; }
@media (min-width: 640px) { .fichas > * { flex: 0 0 calc(50% - var(--gap) / 2); } }
@media (min-width: 1100px) { .fichas > * { flex: 0 0 calc((100% - 2 * var(--gap)) / 3); } }
</style>
