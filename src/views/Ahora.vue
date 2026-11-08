<script setup lang="ts">
import { computed } from 'vue'
import AgenteCard from '../components/AgenteCard.vue'
import Escena from '../components/Escena.vue'
import Ayuda from '../components/Ayuda.vue'
import { INSTAGRAM, TELEGRAM, falta, nombreAgente, proxima, useDatos } from '../datos'

const { datos, cargando, ahora, publicadosHoy, guionesHoy } = useDatos()
const hallazgo = computed(() => {
  const d = datos.value; if (!d) return ''
  const activos = (['radar-10k', 'yapper'] as const).filter(k => d.agentes[k].corriendo).map(k => `${nombreAgente(k)} está ${d.agentes[k].fase}`)
  const siguiente = (['radar-10k', 'yapper'] as const).map(k => ({ k, d: proxima(d.agentes[k].proximas, new Date(ahora.value)) })).sort((a, b) => a.d.getTime() - b.d.getTime())[0]!
  const parte1 = activos.length ? activos.join(' y ') + '.' : `Los dos agentes descansan; el próximo es ${nombreAgente(siguiente.k)} en ${falta(siguiente.d, ahora.value)}.`
  const parte2 = publicadosHoy.value.length ? ` Hoy se publicaron ${publicadosHoy.value.length} reel${publicadosHoy.value.length > 1 ? 's' : ''}.` : ' Hoy todavía no se publica nada.'
  return parte1 + parte2
})
const agenda = computed(() => {
  const d = datos.value; if (!d) return []
  const n = new Date(ahora.value), hh = n.getHours() + n.getMinutes() / 60
  const filas = [
    { h: '05:30', v: 5.5, t: 'Yapper investiga y escribe los 4 guiones', a: d.agentes.yapper },
    { h: '07:00', v: 7, t: 'Latido del servidor en el grupo', a: null },
    { h: '09:00', v: 9, t: 'Radar produce y publica el reel de la mañana', a: d.agentes['radar-10k'] },
    { h: '19:00', v: 19, t: 'Radar produce y publica el reel de la noche', a: d.agentes['radar-10k'] },
  ]
  return filas.map(f => {
    const enCurso = !!f.a?.corriendo && Math.abs(f.v - hh) < 5
    return { ...f, estado: enCurso ? 'en curso' : f.v < hh ? 'hecho' : 'en ' + falta(proxima([f.h], n), ahora.value), clase: enCurso ? 'ahora' : f.v < hh ? 'hecho' : '' }
  })
})
</script>

<template>
  <div v-if="cargando && !datos" class="grid par">
    <div class="panel c6"><span class="esqueleto" style="width:40%;height:20px" /><br><br><span class="esqueleto" style="width:90%;height:14px" /><br><br><span class="esqueleto" style="width:100%;height:6px" /></div>
    <div class="panel c6"><span class="esqueleto" style="width:40%;height:20px" /><br><br><span class="esqueleto" style="width:90%;height:14px" /><br><br><span class="esqueleto" style="width:100%;height:6px" /></div>
  </div>
  <template v-else-if="datos">
    <p class="hallazgo">{{ hallazgo }} <Ayuda titulo="Qué es esto" texto="Un resumen en una frase de lo que pasa ahora mismo. Debajo, cada agente con su paso actual. Todo se refresca solo cada 15 segundos." /></p>
    <div v-if="datos.pausa" class="aviso">PAUSA activa: los agentes miden y escriben, pero no publican. Se quita escribiendo /reanudar al bot en el grupo.</div>
    <Escena :datos="datos" :ahora="ahora" />
    <p class="meta pie-escena">La oficina en vivo: cada robot hace lo mismo que su agente. Debajo, el detalle paso a paso.</p>

    <section class="grid par" aria-label="Agentes">
      <AgenteCard class="c6" clave="radar-10k" :agente="datos.agentes['radar-10k']" :ahora="ahora" />
      <AgenteCard class="c6" clave="yapper" :agente="datos.agentes.yapper" :ahora="ahora" />
    </section>

    <section class="grid">
      <article class="panel c4">
        <header><h2>Agenda de hoy <Ayuda titulo="Agenda" texto="Las horas fijas a las que corren los agentes, en hora de Ecuador. Tachado = ya pasó; azul = corriendo ahora." /></h2></header>
        <ul class="agenda">
          <li v-for="f in agenda" :key="f.h" :class="f.clase"><span class="t num">{{ f.h }}</span><span class="n">{{ f.t }}</span><span class="s">{{ f.estado }}</span></li>
        </ul>
        <div class="botones">
          <a class="btn chico" :href="TELEGRAM.grupo" target="_blank" rel="noopener">Grupo de Telegram</a>
          <a class="btn chico" :href="INSTAGRAM" target="_blank" rel="noopener">@bakano.ec</a>
        </div>
      </article>
      <article class="panel c8">
        <header><h2>Actividad <Ayuda titulo="Actividad" texto="Cada cosa que pasa en el servidor, con su hora: guion escrito, voz generada, render terminado, reel publicado. Lo más nuevo arriba." /></h2><span class="meta">{{ Math.min(12, datos.actividad.length) }} de {{ datos.actividad.length }}</span></header>
        <ul class="feed">
          <li v-for="(e, i) in datos.actividad.slice(0, 12)" :key="i">
            <span class="ico">{{ e.texto.split(' ')[0] }}</span>
            <span v-html="e.texto.split(' ').slice(1).join(' ').replace(/(https?:\/\/\S+)/, '<a href=&quot;$1&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;>$1</a>')" />
            <span class="t num">{{ e.hora }}</span>
          </li>
          <li v-if="!datos.actividad.length" class="vacio">Sin actividad todavía.</li>
        </ul>
      </article>
    </section>

    <section class="grid par">
      <article class="panel c6">
        <header><h2>Publicado hoy <Ayuda titulo="Publicado hoy" texto="Los reels que los agentes subieron hoy a @bakano.ec. Toca el enlace para verlo en Instagram." /></h2><RouterLink class="meta" to="/publicado">ver todo</RouterLink></header>
        <ul class="filas">
          <li v-for="p in publicadosHoy" :key="p.url"><span><span class="n">{{ nombreAgente(p.agente) }}</span><br><a :href="p.url" target="_blank" rel="noopener">{{ p.url.replace('https://www.instagram.com/', '') }}</a></span><span class="d"><a class="btn chico" :href="p.url" target="_blank" rel="noopener">Ver reel</a></span></li>
          <li v-if="!publicadosHoy.length" class="vacio">Todavía nada hoy. El primero aparece aquí con su enlace.</li>
        </ul>
      </article>
      <article class="panel c6">
        <header><h2>Guiones de hoy <Ayuda titulo="Guiones de hoy" texto="Yapper escribe 4 guiones a las 05:30: dos para los reels con IA y dos para grabar a cámara (Diego y Denisse). Aquí ves cuántos hay; en «Plan de hoy» los lees y ves cómo grabarlos." /></h2><RouterLink class="meta" to="/hoy">ver el plan</RouterLink></header>
        <ul class="filas">
          <li v-for="g in guionesHoy" :key="g.nombre"><span class="n">{{ g.nombre.replace(/^\d{4}-\d\d-\d\d-/, '').replace(/-/g, ' ') }}</span><span class="d meta num">{{ g.fecha.slice(11, 16) }}</span></li>
          <li v-if="!guionesHoy.length" class="vacio">Aún no hay guiones de hoy.</li>
        </ul>
      </article>
    </section>
  </template>
</template>

<style scoped>
.hallazgo { font-size: 16px; line-height: 24px; margin-bottom: var(--gap); }
.pie-escena { margin: 6px 0 var(--gap); text-align: center; }
.agenda li { display: grid; grid-template-columns: 48px minmax(0, 1fr) auto; gap: 10px; align-items: center; min-height: 40px; padding: 6px 0; border-top: 1px solid var(--rule); }
.agenda li:first-child { border-top: 0; }
.agenda .t { color: var(--muted); }
.agenda .s { font-size: var(--fs-small); color: var(--muted); white-space: nowrap; }
.agenda li.ahora .n, .agenda li.ahora .s { color: var(--hue); font-weight: 500; }
.agenda li.hecho .n { color: var(--muted); text-decoration: line-through; }
.botones { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.feed li { display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; gap: 10px; align-items: start; padding: 8px 0; border-top: 1px solid var(--rule); }
.feed li:first-child { border-top: 0; }
.feed .ico { font-size: 16px; line-height: 20px; text-align: center; }
.feed .t { color: var(--muted); font-size: var(--fs-small); white-space: nowrap; line-height: 20px; }
.feed :deep(a) { word-break: break-all; }
</style>
