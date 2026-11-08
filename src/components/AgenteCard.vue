<script setup lang="ts">
import { computed, ref } from 'vue'
import Ayuda from './Ayuda.vue'
import Modal from './Modal.vue'
import { type Agente, INFO, falta, nombreAgente, proxima } from '../datos'
import { aHtml } from '../md'

const props = defineProps<{ clave: 'radar-10k' | 'yapper'; agente: Agente; ahora: number }>()
const verBitacora = ref(false)
const n = computed(() => props.agente.pasos.length)
const pct = computed(() => props.agente.corriendo ? Math.round(((props.agente.paso + 0.5) / n.value) * 100) : 0)
const indeterminado = computed(() => /render|publica|voz/.test(props.agente.fase.toLowerCase()))
const prox = computed(() => proxima(props.agente.proximas, new Date(props.ahora)))
const minutosARonda = computed(() => { const d = new Date(props.ahora); const m = d.getMinutes(); return m < 7 ? 7 - m : 67 - m })
const QUE_PASO: Record<string, string> = {
  Memoria: 'Lee sus bitácoras de los últimos 7 días para no repetirse.',
  Medir: 'Consulta Instagram: vistas de ayer y métricas de cada reel.',
  Guion: 'Toma el guion del turno que dejó Yapper (o escribe uno si falta).',
  Voz: 'Genera la voz con ElevenLabs y mide el segundo de cada palabra.',
  Dibujo: 'Dibuja plano por plano lo que dice la voz.',
  Revisión: 'Mira el video en movimiento y corrige lo que falla.',
  Render: 'Exporta el video final en 1080×1920.',
  Publicar: 'Lo sube a @bakano.ec con su caption.',
  Informe: 'Escribe la bitácora y avisa por Telegram y correo.',
  Diagnóstico: 'Decide qué variable cambia hoy (gancho, dolor, segmento).',
  Guiones: 'Escribe los cuatro guiones del día.',
  Comunidad: 'Responde los comentarios de los reels recientes.',
}
</script>

<template>
  <article class="panel tarjeta">
    <div class="cab">
      <svg class="avatar" viewBox="0 0 56 56" aria-hidden="true">
        <rect x="10" y="8" width="36" height="30" rx="9" fill="#e9ecff" :stroke="clave === 'radar-10k' ? '#2a2d4a' : '#6b6b6b'" stroke-width="2" />
        <rect x="20" y="18" width="5" height="7" rx="1.5" :fill="clave === 'radar-10k' ? '#1b1d33' : '#6b6b6b'" />
        <rect x="31" y="18" width="5" height="7" rx="1.5" :fill="clave === 'radar-10k' ? '#1b1d33' : '#6b6b6b'" />
        <rect v-if="agente.corriendo" x="23" y="29" width="10" height="3" rx="1.5" :fill="clave === 'radar-10k' ? '#1b1d33' : '#6b6b6b'" />
        <path v-else d="M23 31 q5 -3 10 0" :stroke="clave === 'radar-10k' ? '#1b1d33' : '#6b6b6b'" stroke-width="2" fill="none" />
        <rect x="18" y="40" width="20" height="12" rx="4" :fill="clave === 'radar-10k' ? '#5b9bff' : '#8a8a8a'" />
        <template v-if="clave === 'radar-10k'"><line x1="28" y1="8" x2="28" y2="2" stroke="#1b1d33" stroke-width="2" /><circle cx="28" cy="2" r="2" :fill="agente.corriendo ? '#5b9bff' : '#1b1d33'" /></template>
        <rect v-else x="44" y="24" width="5" height="10" rx="2.5" fill="#6b6b6b" />
      </svg>
      <div>
        <h2>
          {{ nombreAgente(clave) }}
          <span class="pill" :class="agente.corriendo ? 'pos' : agente.vigila ? 'vig' : ''"><i v-if="agente.corriendo || agente.vigila" class="punto" :class="{ lento: !agente.corriendo }" />{{ agente.corriendo ? 'Trabajando' : agente.vigila ? 'Vigilando' : 'En reposo' }}</span>
          <Ayuda :titulo="nombreAgente(clave)" :texto="INFO[clave].que" />
        </h2>
        <p class="que">{{ INFO[clave].que }}</p>
      </div>
    </div>

    <p class="fase">
      <template v-if="agente.corriendo">{{ agente.fase.charAt(0).toUpperCase() + agente.fase.slice(1) }}</template>
      <template v-else-if="agente.vigila">Radar encendido: próxima ronda de tendencias en {{ minutosARonda }} min · reels a las {{ agente.proximas.join(' y ') }}</template>
      <template v-else>Próxima corrida a las {{ agente.proximas.join(' y ') }}</template>
      <small v-if="agente.corriendo">Paso {{ agente.paso + 1 }} de {{ n }} · lleva {{ agente.minutos }} min<template v-if="agente.detalle"> · proyecto «{{ agente.detalle.replace(/^\d{4}-\d\d-\d\d-/, '').replace(/-/g, ' ') }}»</template></small>
      <small v-else-if="agente.vigila">{{ agente.vigila.rondas_hoy }} rondas hoy · última {{ agente.vigila.ultima ? agente.vigila.ultima.slice(11, 16) : '—' }} · próximo reel en {{ falta(prox, ahora) }}</small>
      <small v-else>Faltan {{ falta(prox, ahora) }}<template v-if="agente.ultima_bitacora"> · última corrida {{ agente.ultima_bitacora.fecha.slice(5, 16).replace('T', ' ') }}</template></small>
    </p>

    <div class="barra" :class="{ ind: agente.corriendo && indeterminado }" role="progressbar" :aria-valuenow="pct" aria-valuemin="0" aria-valuemax="100">
      <i :style="{ width: pct + '%' }" />
    </div>
    <ol class="pasos">
      <li v-for="(p, i) in agente.pasos" :key="p" :class="agente.corriendo ? (i < agente.paso ? 'hecho' : i === agente.paso ? 'actual' : '') : ''" :title="QUE_PASO[p]">
        <span>{{ p }}</span>
      </li>
    </ol>
    <p class="meta pista" v-if="agente.corriendo">{{ QUE_PASO[agente.pasos[agente.paso] ?? ''] }}</p>

    <div class="pie">
      <button v-if="agente.ultima_bitacora" class="btn chico" type="button" @click="verBitacora = true">Leer su última bitácora</button>
      <span v-else class="meta">Aún no tiene bitácora.</span>
    </div>

    <Modal :abierto="verBitacora" :titulo="`Bitácora ${agente.ultima_bitacora?.nombre ?? ''}`" @cerrar="verBitacora = false">
      <div class="md" v-html="aHtml(agente.ultima_bitacora?.texto ?? '')" />
    </Modal>
  </article>
</template>

<style scoped>
.pill.vig { background: var(--hue-bg); color: var(--hue); }
.punto.lento { background: var(--hue); animation-duration: 2.4s; }
.tarjeta { display: flex; flex-direction: column; }
.cab { display: flex; gap: 14px; align-items: flex-start; }
.cab > div { flex: 1 1 auto; min-width: 0; }
.avatar { width: 56px; height: 56px; }
h2 { flex-wrap: wrap; }
.que { color: var(--muted); margin-top: 2px; }
.fase { margin-top: 14px; font-size: 16px; line-height: 22px; font-weight: 500; }
.fase small { display: block; color: var(--muted); font-size: var(--fs-small); line-height: 18px; margin-top: 2px; font-weight: 400; }
.barra { margin-top: 12px; height: 6px; background: var(--raised); border-radius: 3px; overflow: hidden; }
.barra i { display: block; height: 100%; background: var(--hue); border-radius: 3px; transition: width .6s cubic-bezier(.22, 1, .36, 1); }
.barra.ind i { width: 30%; animation: ind 1.4s ease-in-out infinite; }
@keyframes ind { 0% { margin-left: -30%; } 100% { margin-left: 100%; } }
.pasos { display: flex; flex-wrap: wrap; gap: 6px 10px; margin-top: 10px; font-size: var(--fs-small); line-height: 18px; padding: 0; list-style: none; }
.pasos li { flex: 0 0 calc(33.333% - 7px); }
.pasos li { display: flex; align-items: center; gap: 6px; color: var(--muted); white-space: nowrap; overflow: hidden; }
.pasos li span { overflow: hidden; text-overflow: ellipsis; }
.pasos li::before { content: ""; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--control); flex: none; }
.pasos li.hecho { color: var(--text); } .pasos li.hecho::before { background: var(--text); border-color: var(--text); }
.pasos li.actual { color: var(--hue); font-weight: 500; } .pasos li.actual::before { background: var(--hue); border-color: var(--hue); animation: pulso 1.2s infinite; }
.pista { margin-top: 8px; }
.pie { margin-top: auto; padding-top: 14px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
@media (min-width: 900px) { .pasos li { flex-basis: calc(20% - 8px); } }
</style>
