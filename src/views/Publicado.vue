<script setup lang="ts">
import Ayuda from '../components/Ayuda.vue'
import { TELEGRAM, nombreAgente, useDatos } from '../datos'

const { datos } = useDatos()
</script>

<template>
  <section v-if="datos" class="grid par">
    <article class="panel c6">
      <header><h2>Publicado por los agentes <Ayuda titulo="Publicado" texto="Cada reel que un agente subió a @bakano.ec, con la fecha y el enlace. Los marcados «prueba» son reels de prueba del laboratorio: solo los ven no seguidores y Instagram los gradúa si rinden." /></h2><span class="meta">{{ datos.publicados.length }} en total</span></header>
      <ul class="filas">
        <li v-for="p in datos.publicados" :key="p.url + p.fecha">
          <span><span class="n">{{ nombreAgente(p.agente) }}</span><span class="m"> · {{ p.fecha }}</span><br><a :href="p.url" target="_blank" rel="noopener">{{ p.url.replace('https://www.instagram.com/', '') }}</a></span>
          <span class="d"><span v-if="p.tipo === 'prueba'" class="pill warn" style="margin-right:6px">prueba</span><a class="btn chico" :href="p.url" target="_blank" rel="noopener">Ver reel</a></span>
        </li>
        <li v-if="!datos.publicados.length" class="vacio">Nada publicado por los agentes todavía.</li>
      </ul>
    </article>
    <article class="panel c6">
      <header><h2>Videos en espera <Ayuda titulo="Videos en espera" texto="Los videos grabados que llegaron por Telegram o por scp y aún no se publican. Yapper publica uno por día a las 05:30, el más antiguo primero. Si quieres uno ya, dile al bot «publícalo ya»." /></h2><span class="meta">{{ datos.listos.length }}</span></header>
      <ul class="filas">
        <li v-for="v in datos.listos" :key="v.nombre"><span><span class="n">{{ v.nombre }}</span><br><span class="m num">{{ v.mb }} MB · {{ v.fecha.slice(5, 16).replace('T', ' ') }}</span></span><span class="d"><span class="pill">en espera</span></span></li>
        <li v-if="!datos.listos.length" class="vacio">Cola vacía. Manda un video al grupo de Telegram y aparece aquí.</li>
      </ul>
      <div class="botones">
        <a class="btn chico primario" :href="TELEGRAM.grupo" target="_blank" rel="noopener">Mandar un video al grupo</a>
        <a class="btn chico" :href="TELEGRAM.bot" target="_blank" rel="noopener">Hablar con el bot</a>
      </div>
    </article>
  </section>
</template>

<style scoped>
.botones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
</style>
