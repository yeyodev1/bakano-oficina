<script setup lang="ts">
import { computed } from 'vue'
import Ayuda from '../components/Ayuda.vue'
import { fmt, useDatos } from '../datos'

const { datos, publicadosHoy, guionesHoy } = useDatos()
const ayer = computed(() => datos.value?.metricas.ayer ?? {})
const reels = computed(() => datos.value?.metricas.reels ?? [])
const pct = (a: number | null, b: number | null) => (a && b) ? ((a / b) * 100).toFixed(1) + ' %' : '—'
</script>

<template>
  <template v-if="datos">
    <section class="kpis" aria-label="Números">
      <div class="kpi"><div class="l">Vistas ayer <Ayuda titulo="Vistas ayer" texto="Vistas totales de la cuenta @bakano.ec el día de ayer, según Instagram. La meta es pasar de 10.000 diez días seguidos." /></div><div class="v num">{{ fmt(ayer.views) }}</div></div>
      <div class="kpi"><div class="l">Alcance ayer <Ayuda titulo="Alcance" texto="Cuántas cuentas distintas vieron algo de @bakano.ec ayer." /></div><div class="v num">{{ fmt(ayer.reach) }}</div></div>
      <div class="kpi"><div class="l">Reels publicados hoy</div><div class="v num" :class="{ cero: !publicadosHoy.length }">{{ publicadosHoy.length }}</div></div>
      <div class="kpi"><div class="l">Guiones de hoy</div><div class="v num" :class="{ cero: !guionesHoy.length }">{{ guionesHoy.length }}</div></div>
      <div class="kpi"><div class="l">Videos en espera</div><div class="v num" :class="{ cero: !datos.listos.length }">{{ datos.listos.length }}</div></div>
      <div class="kpi"><div class="l">Racha hacia la meta <Ayuda titulo="Racha" texto="Días seguidos con 10.000 vistas o más. La meta del plan es llegar a 10. Se reinicia si un día baja." /></div><div class="v num">{{ datos.racha }}<small>de 10 días</small></div><div class="racha" aria-hidden="true"><i v-for="i in 10" :key="i" :class="{ on: i <= datos.racha }" /></div></div>
    </section>

    <section class="panel">
      <header><h2>Últimos reels de la cuenta <Ayuda titulo="Reels de la cuenta" texto="Los últimos reels de @bakano.ec con sus números de Instagram (se actualizan cada 10 minutos). Interacción = comentarios + guardados + compartidos sobre vistas: por encima de 1 % es señal de comunidad real." /></h2><span class="meta">Instagram · cada 10 min</span></header>
      <table v-if="reels.length" class="num">
        <thead><tr><th>Reel</th><th>Vistas</th><th class="solo-ancho">Alcance</th><th>Likes</th><th>Com.</th><th class="solo-ancho">Guard.</th><th class="solo-ancho">Comp.</th><th>Interacción</th></tr></thead>
        <tbody>
          <tr v-for="r in reels" :key="r.permalink">
            <td><a :href="r.permalink" target="_blank" rel="noopener">{{ (r.caption || r.permalink).slice(0, 80) }}</a><span class="m">{{ (r.timestamp || '').slice(0, 10) }}</span></td>
            <td>{{ fmt(r.views) }}</td><td class="solo-ancho">{{ fmt(r.reach) }}</td><td>{{ fmt(r.likes) }}</td><td>{{ fmt(r.comments) }}</td><td class="solo-ancho">{{ fmt(r.saved) }}</td><td class="solo-ancho">{{ fmt(r.shares) }}</td>
            <td>{{ pct((r.comments ?? 0) + (r.saved ?? 0) + (r.shares ?? 0), r.views) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="vacio">Sin datos de Instagram todavía.</p>
    </section>
    <p class="meta pie">Servidor: disco {{ datos.vps.disco }} usado · carga {{ datos.vps.carga }} · RAM {{ datos.vps.ram }}</p>
  </template>
</template>

<style scoped>
.racha { display: flex; gap: 3px; margin-top: 10px; }
.racha i { flex: 1; height: 8px; border-radius: 2px; background: var(--raised); }
.racha i.on { background: var(--hue); }
.pie { margin-top: var(--gap); text-align: center; }
</style>
