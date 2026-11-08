<script setup lang="ts">
// Investigación diaria de Yapper: qué buscó, qué encontró, el patrón y por qué hoy grabamos este tipo de video.
import { computed } from 'vue'
import Ayuda from '../components/Ayuda.vue'
import { useDatos } from '../datos'
import { aHtml, seccion } from '../md'

const { datos, hoy } = useDatos()
const lista = computed(() => datos.value?.investigaciones ?? [])
const deHoy = computed(() => lista.value.find(i => i.nombre.startsWith(hoy.value)))
const anteriores = computed(() => lista.value.filter(i => i !== deHoy.value))
// Antes del primer informe formal, lo más parecido es la sección de referencias de la última bitácora
const respaldo = computed(() => {
  for (const b of datos.value?.bitacoras ?? []) {
    const s = seccion(b.md, 'referencia', 'investigacion')
    if (s) return { nombre: b.nombre, agente: b.agente, md: s }
  }
  return null
})
const bloques = (md: string) => ([
  ['Qué buscó', seccion(md, 'que busque', 'busque')],
  ['Qué encontró', seccion(md, 'que encontre', 'encontre')],
  ['Patrón del día', seccion(md, 'patron')],
  ['Por qué hoy grabamos este tipo de video', seccion(md, 'por que hoy', 'grabamos')],
  ['Qué vamos a medir mañana', seccion(md, 'medir')],
] as const).filter(([, t]) => t)
</script>

<template>
  <template v-if="datos">
    <section class="panel">
      <header>
        <h2>Investigación de hoy <Ayuda titulo="Investigación" texto="Cada mañana a las 05:30 Yapper busca en la web reels y posts recientes sobre los dolores de nuestros segmentos, saca los ganchos que funcionan y decide qué tipo de video probamos hoy y por qué. Este es su informe." /></h2>
        <span class="meta">{{ deHoy ? deHoy.fecha.slice(5, 16).replace('T', ' ') : 'llega a las 05:30' }}</span>
      </header>
      <template v-if="deHoy">
        <div v-for="[t, md] in bloques(deHoy.md)" :key="t" class="bloque" :class="{ clave: t.startsWith('Por qué') }">
          <h3>{{ t }}</h3>
          <div class="md" v-html="aHtml(md)" />
        </div>
        <details v-if="!bloques(deHoy.md).length" class="pliegue" open><summary>Informe completo</summary><div class="md" v-html="aHtml(deHoy.md)" /></details>
      </template>
      <template v-else-if="respaldo">
        <p class="meta">Todavía no hay informe formal de hoy. Esto es lo que investigó el agente en su última corrida ({{ respaldo.nombre }}):</p>
        <div class="md" v-html="aHtml(respaldo.md)" />
      </template>
      <p v-else class="vacio">El primer informe de investigación llega mañana a las 05:30.</p>
    </section>

    <section class="panel">
      <header><h2>Informes anteriores</h2><span class="meta">{{ anteriores.length }}</span></header>
      <details v-for="i in anteriores" :key="i.nombre" class="pliegue">
        <summary><span>{{ i.nombre }}</span><span class="meta num">{{ i.fecha.slice(5, 16).replace('T', ' ') }}</span></summary>
        <div class="md" v-html="aHtml(i.md)" />
      </details>
      <p v-if="!anteriores.length" class="vacio">Aquí se van guardando, uno por día.</p>
    </section>
  </template>
</template>

<style scoped>
.bloque { padding: 12px 0; border-top: 1px solid var(--rule); }
.bloque:first-of-type { border-top: 0; padding-top: 0; }
.bloque h3 { font-size: var(--fs-body); font-weight: 600; margin-bottom: 4px; }
.bloque.clave { background: var(--hue-bg); border: 1px solid #243b66; border-radius: var(--radius-card); padding: 12px 14px; margin: 8px 0; }
.bloque.clave h3 { color: var(--hue); }
</style>
