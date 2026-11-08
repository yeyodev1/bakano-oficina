<script setup lang="ts">
// Investigación: el modo continuo de Yapper (cada 3 h: tendencias de Ecuador, formatos en auge, cómo pegarla aquí),
// la lista viva de tendencias vigentes y el informe de cada día.
import { computed } from 'vue'
import Ayuda from '../components/Ayuda.vue'
import { falta, proxima, useDatos } from '../datos'
import { aHtml, seccion } from '../md'

const { datos, hoy, ahora } = useDatos()
const t = computed(() => datos.value?.tendencias)
const lista = computed(() => datos.value?.investigaciones ?? [])
const deHoy = computed(() => lista.value.find(i => i.nombre.startsWith(hoy.value)))
const anteriores = computed(() => lista.value.filter(i => i !== deHoy.value))
const proximaRonda = computed(() => t.value ? proxima(t.value.horas, new Date(ahora.value)) : null)
// Antes del primer informe formal, lo más parecido es la sección de referencias de la última bitácora
const respaldo = computed(() => {
  for (const b of datos.value?.bitacoras ?? []) {
    const s = seccion(b.md, 'referencia', 'investigacion')
    if (s) return { nombre: b.nombre, md: s }
  }
  return null
})
/** Las rondas del día (## Ronda HH:MM), de la más nueva a la más vieja. */
const rondas = computed(() => {
  const md = deHoy.value?.md ?? ''
  const partes = md.split(/\n(?=## Ronda )/).filter(p => p.startsWith('## Ronda'))
  return partes.map(p => ({ titulo: p.split('\n')[0]!.replace(/^## /, ''), md: p.split('\n').slice(1).join('\n') })).reverse()
})
const bloquesDia = (md: string) => ([
  ['Qué buscó', seccion(md, 'que busque', 'busque')],
  ['Qué encontró', seccion(md, 'que encontre', 'encontre')],
  ['Patrón del día', seccion(md, 'patron')],
  ['Por qué hoy grabamos este tipo de video', seccion(md, 'por que hoy', 'grabamos')],
  ['Qué vamos a medir mañana', seccion(md, 'medir')],
] as const).filter(([, s]) => s)
</script>

<template>
  <template v-if="datos && t">
    <section class="panel estado">
      <div class="fila">
        <span class="pill" :class="t.corriendo ? 'pos' : ''"><i v-if="t.corriendo" class="punto" />{{ t.corriendo ? `Investigando ahora · ${t.minutos} min` : 'Investigador en reposo' }}</span>
        <span class="meta">Rondas de hoy: <b class="num">{{ t.rondas_hoy }}</b> de 6 · última {{ t.ultima ? t.ultima.slice(5, 16).replace('T', ' ') : '—' }} · próxima {{ proximaRonda ? `en ${falta(proximaRonda, ahora)}` : '—' }}</span>
        <Ayuda titulo="Investigación continua" texto="Yapper investiga cada 3 horas (08:00, 11:00, 14:00, 17:00, 20:00 y 23:00): qué se habla hoy en Ecuador, qué formatos y ganchos están pegando en reels, qué funciona en nuestra cuenta y el calendario comercial próximo. Convierte cada hallazgo en una idea lista para Ecuador y avisa al grupo si aparece una oportunidad fuerte." />
      </div>
      <p class="meta">Horas de ronda: {{ t.horas.join(' · ') }}. Cada ronda deja ideas listas para pegarla en Ecuador y una señal para los agentes.</p>
    </section>

    <section class="panel vigentes">
      <header><h2>Tendencias vigentes <Ayuda titulo="Tendencias vigentes" texto="La lista viva de las 10 tendencias y formatos más aprovechables ahora mismo, con cómo pegarla en Ecuador y para qué agente. Se reescribe en cada ronda; lo que ya pasó se quita." /></h2><span class="meta">se reescribe cada ronda</span></header>
      <div v-if="t.vigentes" class="md" v-html="aHtml(t.vigentes)" />
      <p v-else class="vacio">La primera lista llega al terminar la primera ronda de investigación.</p>
    </section>

    <section class="panel">
      <header><h2>Rondas de hoy <Ayuda titulo="Rondas" texto="Cada ronda: qué se habla hoy en Ecuador, formatos y ganchos en auge (con enlaces), tres ideas listas para pegarla en Ecuador y una señal para los agentes." /></h2><span class="meta">{{ rondas.length }} de 6</span></header>
      <details v-for="(r, i) in rondas" :key="r.titulo" class="pliegue" :open="i === 0">
        <summary><span>{{ r.titulo }}</span><span class="meta">{{ i === 0 ? 'la más reciente' : '' }}</span></summary>
        <div class="md" v-html="aHtml(r.md)" />
      </details>
      <template v-if="!rondas.length && deHoy">
        <div v-for="[tt, md] in bloquesDia(deHoy.md)" :key="tt" class="bloque" :class="{ clave: tt.startsWith('Por qué') }"><h3>{{ tt }}</h3><div class="md" v-html="aHtml(md)" /></div>
      </template>
      <template v-else-if="!rondas.length && respaldo">
        <p class="meta">Todavía no hay rondas de hoy. Esto es lo que investigó el agente en su última corrida ({{ respaldo.nombre }}):</p>
        <div class="md" v-html="aHtml(respaldo.md)" />
      </template>
      <p v-else-if="!rondas.length" class="vacio">La primera ronda está en marcha o llega en la próxima hora de ronda.</p>
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
.estado .fila { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 6px; }
.vigentes { border-color: #243b66; background: var(--hue-bg); }
.bloque { padding: 12px 0; border-top: 1px solid var(--rule); }
.bloque:first-of-type { border-top: 0; padding-top: 0; }
.bloque h3 { font-size: var(--fs-body); font-weight: 600; margin-bottom: 4px; }
.bloque.clave { background: var(--hue-bg); border: 1px solid #243b66; border-radius: var(--radius-card); padding: 12px 14px; margin: 8px 0; }
.bloque.clave h3 { color: var(--hue); }
</style>
