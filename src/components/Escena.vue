<script setup lang="ts">
// La oficina como escena: dos robots en sus escritorios que teclean, hablan o duermen según lo que hace cada agente.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { type Agente, type Datos, falta, fmt, proxima } from '../datos'

const props = defineProps<{ datos: Datos; ahora: number }>()
const caja = ref<HTMLElement | null>(null)
const escala = ref(1)
function medir() { if (caja.value) escala.value = Math.min(1, caja.value.clientWidth / 1140) }
onMounted(() => { medir(); window.addEventListener('resize', medir) })
onBeforeUnmount(() => window.removeEventListener('resize', medir))

function pantalla(k: 'radar-10k' | 'yapper', a: Agente) {
  const nombre = k === 'radar-10k' ? 'RADAR 10K' : 'YAPPER'
  if (!a.corriendo) return { titulo: `${nombre} · en reposo`, tipo: 'reposo', texto: `próxima ${a.proximas.join(' · ')}`, sub: `en ${falta(proxima(a.proximas, new Date(props.ahora)), props.ahora)}` }
  const f = a.fase.toLowerCase(), pct = Math.round(((a.paso + 0.5) / a.pasos.length) * 100)
  const titulo = `${nombre} · paso ${a.paso + 1}/${a.pasos.length} · ${pct}%`
  if (/voz/.test(f)) return { titulo, tipo: 'voz', texto: 'generando voz…', sub: 'ElevenLabs' }
  if (/dibuj|plano/.test(f)) return { titulo, tipo: 'dibujo', texto: 'dibujando planos', sub: a.detalle }
  if (/render/.test(f)) return { titulo, tipo: 'barra', texto: 'RENDER 1080×1920', sub: `ffmpeg · ${a.minutos} min` }
  if (/publica/.test(f)) return { titulo, tipo: 'barra', texto: 'subiendo a Instagram', sub: '@bakano.ec' }
  if (/informe|bitácora/.test(f)) return { titulo, tipo: 'texto', texto: 'escribiendo informe', sub: 'telegram + correo' }
  if (/guion/.test(f)) return { titulo, tipo: 'texto', texto: 'escribiendo guion', sub: 'fórmula 100K' }
  if (/revis/.test(f)) return { titulo, tipo: 'barra', texto: 'revisando en movimiento', sub: 'frase a frase' }
  return { titulo, tipo: 'texto', texto: a.fase, sub: '' }
}
const r = computed(() => props.datos.agentes['radar-10k'])
const y = computed(() => props.datos.agentes.yapper)
const pr = computed(() => pantalla('radar-10k', r.value))
const py = computed(() => pantalla('yapper', y.value))
const hora = computed(() => new Date(props.ahora).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false }))
const hoy = computed(() => props.datos.ahora.slice(0, 10))
const pubHoy = computed(() => props.datos.publicados.filter(p => p.fecha === hoy.value).length)
const guionesHoy = computed(() => props.datos.guiones.filter(g => g.nombre.startsWith(hoy.value)))
const agenda = computed(() => {
  const n = new Date(props.ahora), hh = n.getHours() + n.getMinutes() / 60
  return [
    { h: '05:30', v: 5.5, t: 'Yapper: guiones', a: y.value }, { h: '07:00', v: 7, t: 'latido', a: null },
    { h: '09:00', v: 9, t: 'Radar: reel mañana', a: r.value }, { h: '19:00', v: 19, t: 'Radar: reel noche', a: r.value },
  ].map(f => ({ ...f, clase: f.a?.corriendo && Math.abs(f.v - hh) < 5 ? 'ahora' : f.v < hh ? 'hecho' : '' }))
})
const globo = (a: Agente) => a.corriendo
  ? { t: a.fase.charAt(0).toUpperCase() + a.fase.slice(1), s: `hace ${a.minutos} min${a.detalle ? ' · ' + a.detalle.replace(/^\d{4}-\d\d-\d\d-/, '').replace(/-/g, ' ') : ''}` }
  : a.vigila
    ? { t: 'Radar encendido.', s: `Escaneo tendencias cada hora (${a.vigila.rondas_hoy} rondas hoy). Reels a las ${a.proximas.join(' y ')}.` }
    : { t: 'Descansando.', s: `Vuelvo a las ${a.proximas.join(' y ')}.` }
</script>

<template>
  <div ref="caja" class="caja" :style="{ height: 560 * escala + 'px' }">
    <div class="oficina" :style="{ transform: `scale(${escala})` }" aria-hidden="true">
      <div class="ventana"><i class="luna" /></div>
      <div class="reloj"><div class="px t">{{ hora }}</div><div class="d">hora de Ecuador</div></div>

      <div class="tv">
        <div class="kpi"><b>{{ fmt(datos.metricas.ayer.views) }}</b><span>vistas ayer</span></div>
        <div class="kpi"><b>{{ fmt(datos.metricas.ayer.reach) }}</b><span>alcance</span></div>
        <div class="kpi"><b>{{ pubHoy }}</b><span>reels hoy</span></div>
        <div class="racha"><i v-for="i in 10" :key="i" :class="{ on: i <= datos.racha }" /><small>racha {{ datos.racha }}/10 días ≥10k</small></div>
      </div>

      <div class="pizarra"><h4>Agenda de hoy</h4><ul><li v-for="f in agenda" :key="f.h" :class="f.clase">{{ f.h }} {{ f.t }}</li></ul></div>

      <div class="corcho">
        <h4>GUIONES DE HOY</h4>
        <div v-for="g in guionesHoy.slice(0, 4)" :key="g.nombre" class="nota"><b>{{ g.nombre.replace(hoy + '-', '') }}</b>{{ (g.md.match(/«([^»]{8,70})»/) || [])[1] || g.md.replace(/[#*]/g, '').split('\n').filter(x => x.trim()).slice(1, 3).join(' ').slice(0, 70) }}</div>
        <div v-if="!guionesHoy.length" class="vacio">Yapper los deja aquí a las 05:30.</div>
      </div>

      <div class="zocalo" />
      <div class="planta" style="left:350px"><i class="h" /><i class="m" /></div>
      <div class="planta" style="left:1080px"><i class="h" /><i class="m" /></div>
      <div class="ig">◎<small>Instagram @bakano.ec</small></div>

      <div v-for="(a, k) in { radar: r, yapper: y }" :key="k" class="puesto" :class="k">
        <div class="letrero" :class="{ on: a.corriendo }"><i />{{ k === 'radar' ? 'RADAR 10K · reels con IA' : 'YAPPER · guiones a cámara' }}</div>
        <div class="silla" />
        <div class="monitor">
          <div class="scr">
            <div class="ttl">{{ (k === 'radar' ? pr : py).titulo }}</div>
            <template v-if="(k === 'radar' ? pr : py).tipo === 'reposo' && a.vigila">RADAR ACTIVO · escaneando<div class="barrido"><i /></div><span class="dim">última ronda {{ a.vigila.ultima ? a.vigila.ultima.slice(11, 16) : '—' }} · {{ a.vigila.rondas_hoy }} hoy</span></template>
            <template v-else-if="(k === 'radar' ? pr : py).tipo === 'reposo'">{{ (k === 'radar' ? pr : py).texto }}<br><b class="px grande">{{ a.proximas.join(' · ') }}</b><br><span class="dim">{{ (k === 'radar' ? pr : py).sub }}</span></template>
            <template v-else-if="(k === 'radar' ? pr : py).tipo === 'voz'">{{ (k === 'radar' ? pr : py).texto }}<div class="onda"><i v-for="i in 14" :key="i" /></div></template>
            <template v-else-if="(k === 'radar' ? pr : py).tipo === 'dibujo'">{{ (k === 'radar' ? pr : py).texto }}<span class="curs" /><div class="pincel"><i /><i /><i /></div></template>
            <template v-else-if="(k === 'radar' ? pr : py).tipo === 'barra'">{{ (k === 'radar' ? pr : py).texto }}<div class="barra ind"><i /></div><span class="dim">{{ (k === 'radar' ? pr : py).sub }}</span></template>
            <template v-else>{{ (k === 'radar' ? pr : py).texto }}<span class="curs" /><br><span class="dim">{{ (k === 'radar' ? pr : py).sub }}</span></template>
          </div>
        </div>
        <div class="robot" :class="[a.corriendo ? 'on ' + (/voz/.test(a.fase.toLowerCase()) ? 'habla' : 'teclea') : a.vigila ? 'on vigila' : 'duerme']">
          <i v-if="k === 'radar'" class="ant" />
          <div class="cab"><i class="ojo i" /><i class="ojo d" /><i class="boca" /></div>
          <i v-if="k === 'yapper'" class="mic" />
          <i class="cue" /><i class="brazo i" /><i class="brazo d" />
        </div>
        <div class="mesa" />
        <div class="globo"><b>{{ globo(a).t }}</b><small>{{ globo(a).s }}</small></div>
        <div v-if="!a.corriendo && !a.vigila" class="zzz"><span>z</span><span>z</span><span>z</span></div>
        <div v-if="!a.corriendo && a.vigila" class="radarp"><i /><i /><i /></div>
        <div v-if="a.corriendo && /publica/.test(a.fase.toLowerCase())" class="avion">✈️</div>
        <div class="pasos"><b v-for="(p, i) in a.pasos" :key="p" :title="p" :class="a.corriendo ? (i < a.paso ? 'd' : i === a.paso ? 'a' : '') : ''" /></div>
      </div>
      <div v-if="datos.pausa" class="cinta"><b>PAUSA · no publican</b></div>
    </div>
  </div>
</template>

<style scoped>
.caja { overflow: hidden; border-radius: var(--radius-card); border: 1px solid var(--border); background: #1b1d33; position: relative; }
.oficina { width: 1140px; height: 560px; position: relative; transform-origin: 0 0; background: linear-gradient(#1b1d33 0 62%, #2b2140 62% 100%); font-family: var(--font); color: #f1f1f4; }
.oficina::before { content: ""; position: absolute; left: 0; right: 0; top: 62%; height: 38%; background: repeating-linear-gradient(90deg, transparent 0 56px, rgba(255, 255, 255, .04) 56px 58px), repeating-linear-gradient(0deg, transparent 0 28px, rgba(0, 0, 0, .12) 28px 30px); }
.px { font-family: ui-monospace, Menlo, monospace; letter-spacing: .5px; }
.zocalo { position: absolute; left: 0; right: 0; top: calc(62% - 8px); height: 8px; background: #3a3f6b; }
.ventana { position: absolute; left: 40px; top: 34px; width: 150px; height: 110px; background: linear-gradient(#0b1b3a, #1b3b6b 60%, #f29a4a); border: 6px solid #3a3f6b; border-radius: 6px; }
.ventana::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 48%, #3a3f6b 48% 52%, transparent 52%), linear-gradient(transparent 48%, #3a3f6b 48% 52%, transparent 52%); }
.luna { position: absolute; left: 18px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: #fff6c7; box-shadow: 0 0 12px #fff6c7; }
.planta { position: absolute; bottom: 8px; width: 46px; height: 120px; }
.planta .m { position: absolute; bottom: 0; left: 8px; width: 30px; height: 28px; background: #b55a3c; border-radius: 4px 4px 8px 8px; }
.planta .h { position: absolute; bottom: 22px; left: -2px; width: 50px; height: 90px; background: radial-gradient(circle at 30% 70%, #2fae5f 0 14px, transparent 15px), radial-gradient(circle at 70% 60%, #27944f 0 16px, transparent 17px), radial-gradient(circle at 50% 30%, #39c86f 0 16px, transparent 17px); }
.reloj { position: absolute; left: 50%; top: 20px; transform: translateX(-50%); width: 260px; text-align: center; }
.reloj .t { font-size: 30px; color: #fff; font-weight: 700; }
.reloj .d { font-size: 11px; color: #a7a9c4; }
.tv { position: absolute; left: 390px; top: 80px; width: 360px; height: 150px; background: #06070d; border: 8px solid #2a2d4a; border-radius: 10px; padding: 8px 12px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; align-items: center; }
.tv::before { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(transparent 0 3px, rgba(255, 255, 255, .025) 3px 4px); pointer-events: none; }
.kpi { text-align: center; }
.kpi b { display: block; font-size: 26px; line-height: 1; color: #7ef0b0; text-shadow: 0 0 8px rgba(126, 240, 176, .6); font-variant-numeric: tabular-nums; }
.kpi span { font-size: 9px; color: #8f93b8; text-transform: uppercase; letter-spacing: 1px; }
.racha { grid-column: 1 / -1; display: flex; gap: 5px; justify-content: center; align-items: center; }
.racha i { width: 22px; height: 8px; border-radius: 2px; background: #222640; border: 1px solid #33375a; }
.racha i.on { background: #ffd34d; box-shadow: 0 0 8px #ffd34d; }
.racha small { font-size: 9px; color: #8f93b8; margin-left: 6px; }
.pizarra { position: absolute; left: 800px; top: 50px; width: 300px; height: 180px; background: #17422f; border: 10px solid #7b5230; border-radius: 4px; padding: 8px 12px; color: #eafff3; }
.pizarra h4 { margin: 0 0 4px; font-size: 13px; color: #ffe9a8; text-transform: uppercase; letter-spacing: 1px; }
.pizarra ul { margin: 0; padding: 0; list-style: none; font-size: 13px; line-height: 1.6; }
.pizarra li.hecho { text-decoration: line-through; opacity: .6; }
.pizarra li.ahora { color: #ffd34d; }
.pizarra li.ahora::after { content: " ◀"; animation: blink 1s infinite; }
.corcho { position: absolute; left: 40px; top: 170px; width: 300px; height: 160px; background: #b98a56; border: 8px solid #7b5230; border-radius: 4px; padding: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-content: flex-start; }
.corcho h4 { position: absolute; top: -30px; left: 0; margin: 0; font-size: 11px; color: #a7a9c4; }
.nota { width: 82px; height: 62px; background: #fff39a; color: #333; font-size: 9px; line-height: 1.15; padding: 10px 6px 4px; border-radius: 2px; box-shadow: 2px 3px 6px rgba(0, 0, 0, .35); transform: rotate(-2deg); position: relative; overflow: hidden; }
.nota:nth-child(2n) { background: #b7f0ff; transform: rotate(2deg); }
.nota:nth-child(3n) { background: #ffc9e0; }
.nota::before { content: ""; position: absolute; top: 3px; left: 50%; width: 8px; height: 8px; border-radius: 50%; background: #e8334a; transform: translateX(-50%); }
.nota b { display: block; font-size: 8px; color: #555; }
.vacio { font-size: 11px; color: #4a3521; font-style: italic; }
.ig { position: absolute; left: 560px; top: 250px; width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7); display: grid; place-items: center; font-weight: 900; font-size: 26px; color: #fff; }
.ig small { position: absolute; top: 60px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #a7a9c4; white-space: nowrap; }
.puesto { position: absolute; top: 290px; width: 400px; height: 250px; }
.puesto.radar { left: 70px; } .puesto.yapper { left: 680px; }
.letrero { position: absolute; top: -6px; left: 0; background: #0b0c15; border: 2px solid #2c2f4d; border-radius: 8px; padding: 4px 10px; font-size: 11px; color: #fff; display: flex; gap: 8px; align-items: center; }
.letrero i { width: 8px; height: 8px; border-radius: 50%; background: #555; }
.letrero.on i { background: #49e58a; box-shadow: 0 0 8px #49e58a; animation: blink 1.2s infinite; }
.mesa { position: absolute; left: 40px; bottom: 30px; width: 320px; height: 70px; background: linear-gradient(#8a5a3c, #6b442c); border-radius: 8px 8px 4px 4px; box-shadow: 0 10px 0 #3a2415; }
.mesa::before, .mesa::after { content: ""; position: absolute; bottom: -50px; width: 14px; height: 50px; background: #4a2f1d; }
.mesa::before { left: 16px; } .mesa::after { right: 16px; }
.monitor { position: absolute; left: 30px; bottom: 100px; width: 200px; height: 120px; background: #07080f; border: 7px solid #30345a; border-radius: 8px; overflow: hidden; }
.monitor::after { content: ""; position: absolute; left: 50%; bottom: -26px; width: 40px; height: 20px; background: #30345a; transform: translateX(-50%); }
.scr { position: absolute; inset: 0; padding: 8px; font-size: 10px; color: #9ef7c3; font-family: ui-monospace, Menlo, monospace; line-height: 1.5; }
.scr .ttl { color: #fff; font-size: 9px; opacity: .7; margin-bottom: 4px; }
.scr .grande { font-size: 14px; color: #fff; }
.scr .dim { color: #5f6388; }
.barra { height: 10px; background: #1b1e36; border: 1px solid #3a3f6b; border-radius: 3px; overflow: hidden; margin-top: 6px; }
.barra i { display: block; height: 100%; width: 35%; background: #49e58a; animation: ind 1.3s ease-in-out infinite; }
@keyframes ind { 0% { margin-left: -35%; } 100% { margin-left: 100%; } }
.curs::after { content: "▌"; animation: blink .8s infinite; }
.onda { display: flex; gap: 3px; align-items: flex-end; height: 30px; margin-top: 6px; }
.onda i { width: 6px; background: #ff6fb5; animation: onda .7s ease-in-out infinite; }
.onda i:nth-child(2n) { animation-delay: .15s; } .onda i:nth-child(3n) { animation-delay: .3s; }
@keyframes onda { 0%, 100% { height: 6px; } 50% { height: 28px; } }
.pincel { position: absolute; right: 8px; bottom: 8px; width: 60px; height: 40px; }
.pincel i { position: absolute; border-radius: 50%; animation: pop 1.6s infinite; }
.pincel i:nth-child(1) { left: 0; top: 16px; width: 18px; height: 18px; background: #ffc247; }
.pincel i:nth-child(2) { left: 22px; top: 4px; width: 22px; height: 22px; background: #6fb3ff; animation-delay: .3s; }
.pincel i:nth-child(3) { left: 40px; top: 20px; width: 16px; height: 16px; background: #ff4d6d; animation-delay: .6s; }
@keyframes pop { 0%, 100% { transform: scale(.6); opacity: .5; } 50% { transform: scale(1.1); opacity: 1; } }
.zzz { position: absolute; left: 300px; top: 70px; font-family: ui-monospace, monospace; color: #a7a9c4; font-size: 14px; }
.zzz span { display: inline-block; animation: zz 2.4s infinite; }
.zzz span:nth-child(2) { animation-delay: .8s; } .zzz span:nth-child(3) { animation-delay: 1.6s; }
@keyframes zz { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(10px, -24px); } }
.robot { position: absolute; left: 235px; bottom: 40px; width: 70px; height: 110px; z-index: 2; }
.cab { position: absolute; left: 10px; top: 0; width: 50px; height: 44px; background: #e9ecff; border-radius: 12px; border: 3px solid #2a2d4a; overflow: hidden; }
.ojo { position: absolute; top: 14px; width: 10px; height: 12px; background: #1b1d33; border-radius: 3px; animation: parp 4s infinite; }
.ojo.i { left: 10px; } .ojo.d { left: 28px; }
@keyframes parp { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
.boca { position: absolute; left: 19px; top: 30px; width: 12px; height: 4px; background: #1b1d33; border-radius: 2px; }
.habla .boca { animation: hab .3s infinite alternate; }
@keyframes hab { to { height: 9px; border-radius: 4px; } }
.ant { position: absolute; left: 32px; top: -10px; width: 4px; height: 12px; background: #2a2d4a; }
.ant::after { content: ""; position: absolute; left: -4px; top: -8px; width: 12px; height: 12px; border-radius: 50%; background: #ff4d6d; }
.on .ant::after { animation: blink 1s infinite; box-shadow: 0 0 8px #ff4d6d; }
.mic { position: absolute; left: 52px; top: 36px; width: 10px; height: 18px; background: #777; border-radius: 5px; border: 2px solid #2a2d4a; }
.cue { position: absolute; left: 18px; top: 46px; width: 34px; height: 40px; border-radius: 10px 10px 4px 4px; border: 3px solid #2a2d4a; }
.radar .cue { background: #49e58a; } .yapper .cue { background: #6fb3ff; }
.brazo { position: absolute; top: 60px; width: 26px; height: 8px; background: #e9ecff; border: 3px solid #2a2d4a; border-radius: 6px; }
.brazo.i { left: -6px; transform: rotate(25deg); } .brazo.d { left: 52px; transform: rotate(-25deg); }
.teclea .brazo.i { animation: tec .18s infinite alternate; } .teclea .brazo.d { animation: tec .18s .09s infinite alternate; }
@keyframes tec { to { transform: translateY(4px) rotate(20deg); } }
.duerme .cab { transform: rotate(-12deg) translateY(4px); } .duerme .ojo { height: 3px; top: 20px; animation: none; }
.silla { position: absolute; left: 205px; bottom: 12px; width: 130px; height: 60px; background: #2a2d4a; border-radius: 10px 10px 4px 4px; }
.globo { position: absolute; left: 300px; top: 30px; max-width: 170px; background: #fff; color: #1b1d33; border-radius: 12px; padding: 8px 10px; font-size: 12px; line-height: 1.25; z-index: 3; }
.globo::after { content: ""; position: absolute; left: 10px; bottom: -9px; border: 9px solid transparent; border-top-color: #fff; border-bottom: 0; }
.globo b { font-weight: 700; } .globo small { display: block; font-weight: 400; color: #666; font-size: 10.5px; margin-top: 2px; }
.pasos { position: absolute; left: 40px; bottom: -8px; width: 320px; display: flex; gap: 3px; }
.pasos b { flex: 1; height: 7px; border-radius: 2px; background: #1b1e36; border: 1px solid #33375a; }
.pasos b.d { background: #49e58a; } .pasos b.a { background: #ffc247; animation: blink .9s infinite; }
.avion { position: absolute; left: 330px; bottom: 170px; font-size: 26px; animation: vuela 2.2s ease-in-out infinite; }
@keyframes vuela { 0% { transform: translate(0, 0) rotate(-10deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(220px, -120px) rotate(10deg); opacity: 0; } }
.cinta { position: absolute; inset: 0; background: repeating-linear-gradient(45deg, rgba(255, 194, 71, .08) 0 20px, transparent 20px 40px); display: grid; place-items: center; pointer-events: none; }
.cinta b { background: #ffc247; color: #000; padding: 8px 16px; font-family: ui-monospace, monospace; transform: rotate(-6deg); font-size: 14px; }
@keyframes blink { 50% { opacity: .25; } }
.vigila .ojo { animation: mira 5s infinite; }
@keyframes mira { 0%, 40%, 100% { transform: translateX(0); } 50%, 80% { transform: translateX(3px); } 92% { transform: scaleY(.1); } }
.radarp { position: absolute; left: 258px; top: 86px; width: 24px; height: 24px; }
.radarp i { position: absolute; inset: 0; border: 2px solid #49e58a; border-radius: 50%; opacity: 0; animation: ping 2.4s infinite; }
.radarp i:nth-child(2) { animation-delay: .8s; } .radarp i:nth-child(3) { animation-delay: 1.6s; }
@keyframes ping { 0% { transform: scale(.3); opacity: .9; } 100% { transform: scale(2.2); opacity: 0; } }
.barrido { position: relative; height: 30px; margin: 6px 0; background: radial-gradient(circle at 50% 100%, rgba(73, 229, 138, .15), transparent 70%); overflow: hidden; }
.barrido i { position: absolute; left: 50%; bottom: 0; width: 60px; height: 60px; margin-left: -60px; transform-origin: 100% 100%; background: conic-gradient(from 270deg, rgba(73, 229, 138, .6), transparent 60deg); animation: barre 2s linear infinite; }
@keyframes barre { to { transform: rotate(360deg); } }
</style>
