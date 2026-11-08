<script setup lang="ts">
// Plan de hoy: qué reel replicamos (el que mejor funcionó), por qué, qué cambia, los guiones y cómo grabarlos.
import { computed } from 'vue'
import Ayuda from '../components/Ayuda.vue'
import GuionCard from '../components/GuionCard.vue'
import { fmt, useDatos } from '../datos'
import { aHtml, seccion } from '../md'

const { datos, guionesHoy, hoy } = useDatos()
const reels = computed(() => datos.value?.metricas.reels ?? [])
const ratio = (r: { comments: number | null; saved: number | null; shares: number | null; views: number | null }) => r.views ? ((r.comments ?? 0) + (r.saved ?? 0) + (r.shares ?? 0)) / r.views : 0
const masVisto = computed(() => [...reels.value].sort((a, b) => (b.views ?? 0) - (a.views ?? 0))[0])
const masConversacion = computed(() => [...reels.value].filter(r => (r.views ?? 0) >= 100).sort((a, b) => ratio(b) - ratio(a))[0])
const bitYapper = computed(() => datos.value?.bitacoras.find(b => b.agente === 'yapper'))
const bitRadar = computed(() => datos.value?.bitacoras.find(b => b.agente === 'radar-10k'))
const diagnostico = computed(() => seccion(bitYapper.value?.md ?? '', 'diagnostico') || seccion(bitRadar.value?.md ?? '', 'diagnostico'))
const aprendi = computed(() => seccion(bitYapper.value?.md ?? '', 'aprendi') || seccion(bitRadar.value?.md ?? '', 'aprendi'))
const cambio = computed(() => seccion(bitYapper.value?.md ?? '', 'cambio', 'manana') || seccion(bitRadar.value?.md ?? '', 'cambio', 'manana'))
const deCamara = computed(() => guionesHoy.value.filter(g => /diego|denis/.test(g.nombre)))
const deIA = computed(() => guionesHoy.value.filter(g => /radar/.test(g.nombre)))
</script>

<template>
  <template v-if="datos">
    <section class="grid par">
      <article class="panel c6">
        <header><h2>Reel de referencia <Ayuda titulo="Reel de referencia" texto="El reel de la cuenta que más vistas tiene en los últimos días y el que más conversación generó por vista (comentarios + guardados + compartidos). Son los que vale la pena replicar cambiando una sola cosa." /></h2><span class="meta">últimos {{ reels.length }} reels</span></header>
        <div v-if="masVisto" class="ref">
          <p class="l">El más visto</p>
          <a :href="masVisto.permalink" target="_blank" rel="noopener" class="cap">{{ masVisto.caption || masVisto.permalink }}</a>
          <p class="nums num"><b>{{ fmt(masVisto.views) }}</b> vistas · {{ fmt(masVisto.likes) }} likes · {{ fmt(masVisto.comments) }} comentarios · {{ fmt(masVisto.saved) }} guardados · {{ fmt(masVisto.shares) }} compartidos</p>
        </div>
        <div v-if="masConversacion && masConversacion.permalink !== masVisto?.permalink" class="ref">
          <p class="l">El que más conversación generó por vista</p>
          <a :href="masConversacion.permalink" target="_blank" rel="noopener" class="cap">{{ masConversacion.caption || masConversacion.permalink }}</a>
          <p class="nums num"><b>{{ (ratio(masConversacion) * 100).toFixed(1) }} %</b> de interacción · {{ fmt(masConversacion.views) }} vistas · {{ fmt(masConversacion.comments) }} comentarios</p>
        </div>
        <p v-if="!reels.length" class="vacio">Sin datos de Instagram todavía.</p>
        <div class="botones">
          <a v-if="masVisto" class="btn chico primario" :href="masVisto.permalink" target="_blank" rel="noopener">Ver el reel a replicar</a>
          <RouterLink class="btn chico" to="/metricas">Todas las métricas</RouterLink>
        </div>
      </article>

      <article class="panel c6">
        <header><h2>Por qué y qué cambia hoy <Ayuda titulo="Diagnóstico" texto="Lo que el agente concluyó al medir: qué funcionó, qué no, y la única variable que cambia hoy (gancho, dolor, segmento, duración o cierre). Sale de su bitácora más reciente." /></h2><span class="meta" v-if="bitYapper">{{ bitYapper.nombre }}</span></header>
        <div v-if="diagnostico" class="md" v-html="aHtml(diagnostico)" />
        <div v-if="aprendi" class="md"><h4>Qué aprendimos</h4><div v-html="aHtml(aprendi)" /></div>
        <div v-if="cambio" class="md"><h4>Qué cambia</h4><div v-html="aHtml(cambio)" /></div>
        <p v-if="!diagnostico && !cambio" class="vacio">Aún no hay diagnóstico de hoy: Yapper lo escribe a las 05:30.</p>
      </article>
    </section>

    <section class="panel">
      <header><h2>Para grabar hoy: Diego y Denisse <Ayuda titulo="Guiones a cámara" texto="Un guion por persona. «Cómo grabarlo» abre el encuadre, cómo arrancar y qué enfatizar. Graba en una toma, mándalo al grupo de Telegram y Yapper lo publica a las 05:30 del día siguiente." /></h2><span class="meta">{{ deCamara.length }} de 2</span></header>
      <div class="fichas">
        <GuionCard v-for="g in deCamara" :key="g.nombre" :guion="g" />
        <p v-if="!deCamara.length" class="vacio" style="grid-column:1/-1">Todavía no hay guiones a cámara de hoy ({{ hoy }}).</p>
      </div>
    </section>

    <section class="panel">
      <header><h2>Reels con IA de hoy (Radar 10K) <Ayuda titulo="Reels con IA" texto="Los guiones que Radar produce solo: el de la mañana sale a las 09:00 y el de la noche a las 19:00. No hay que grabar nada." /></h2><span class="meta">{{ deIA.length }} de 2</span></header>
      <div class="fichas">
        <GuionCard v-for="g in deIA" :key="g.nombre" :guion="g" />
        <p v-if="!deIA.length" class="vacio" style="grid-column:1/-1">Todavía no hay guiones de reel con IA para hoy.</p>
      </div>
    </section>
  </template>
</template>

<style scoped>
.ref + .ref { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--rule); }
.ref .l { color: var(--muted); font-size: var(--fs-small); }
.ref .cap { display: block; font-weight: 500; margin-top: 2px; text-decoration: underline; text-underline-offset: 3px; }
.ref .nums { color: var(--muted); margin-top: 4px; }
.ref .nums b { color: var(--text); font-weight: 600; }
.botones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.fichas { display: grid; gap: var(--gap); grid-template-columns: 1fr; }
@media (min-width: 640px) { .fichas { grid-template-columns: repeat(2, 1fr); } }
</style>
