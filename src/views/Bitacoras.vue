<script setup lang="ts">
import { computed, ref } from 'vue'
import Ayuda from '../components/Ayuda.vue'
import { nombreAgente, useDatos } from '../datos'
import { aHtml } from '../md'

const { datos } = useDatos()
const filtro = ref<'todas' | 'radar-10k' | 'yapper' | 'telegram' | 'pruebas'>('todas')
const lista = computed(() => (datos.value?.bitacoras ?? []).filter(b => filtro.value === 'todas' || b.agente === filtro.value))
</script>

<template>
  <section v-if="datos" class="panel">
    <header>
      <h2>Bitácoras <Ayuda titulo="Bitácoras" texto="Cada corrida de un agente termina con una bitácora: métricas, qué publicó, qué aprendió y qué cambia mañana. Es su única memoria entre días, por eso conviene leerla si algo sorprende." /></h2>
      <span class="meta">{{ lista.length }}</span>
    </header>
    <div class="segmentos" role="tablist">
      <button v-for="v in (['todas', 'radar-10k', 'yapper', 'telegram', 'pruebas'] as const)" :key="v" type="button" role="tab" :aria-selected="filtro === v" :class="{ on: filtro === v }" @click="filtro = v">{{ v === 'todas' ? 'Todas' : v === 'pruebas' ? 'Pruebas' : v === 'telegram' ? 'Pedidos por Telegram' : nombreAgente(v) }}</button>
    </div>
    <details v-for="b in lista" :key="b.agente + b.nombre" class="pliegue">
      <summary><span><span class="pill">{{ nombreAgente(b.agente) }}</span> {{ b.nombre }}</span><span class="meta num">{{ b.fecha.slice(5, 16).replace('T', ' ') }}</span></summary>
      <div class="md" v-html="aHtml(b.md)" />
    </details>
    <p v-if="!lista.length" class="vacio">Sin bitácoras en esta vista.</p>
  </section>
</template>

<style scoped>
.segmentos { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 8px; }
.segmentos button { height: 32px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--control); background: var(--surface); white-space: nowrap; cursor: pointer; }
.segmentos button.on { background: var(--text); color: #fff; border-color: var(--text); }
</style>
