<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { secciones } from './router'
import { TELEGRAM, useDatos } from './datos'

const { datos, error, cargando, segundosDesdeCarga, ultimaCarga } = useDatos()
const ruta = useRoute()
const actual = computed(() => secciones.find(s => s.name === ruta.name) ?? secciones[0])
const menu = ref(false)
const estado = computed(() => {
  if (cargando.value) return { clase: 'gris', texto: 'cargando…' }
  if (error.value) return { clase: 'rojo', texto: `sin conexión (${error.value})` }
  if (datos.value && !datos.value.bot) return { clase: 'rojo', texto: 'bot de Telegram caído' }
  return { clase: 'verde', texto: `en vivo · hace ${segundosDesdeCarga.value ?? 0} s` }
})
</script>

<template>
  <div class="app">
    <aside class="lateral" :class="{ abierto: menu }">
      <div class="marca">
        <span class="logo">B<i /></span>
        <div><b>Oficina Bakano</b><small>@bakano.ec · agentes de video</small></div>
      </div>
      <nav aria-label="Secciones">
        <RouterLink v-for="s in secciones" :key="s.name" :to="s.path" class="item" :title="s.que" @click="menu = false">
          <span class="ico" aria-hidden="true">{{ s.icono }}</span>
          <span>{{ s.titulo }}</span>
        </RouterLink>
      </nav>
      <div class="abajo">
        <a class="btn" :href="TELEGRAM.grupo" target="_blank" rel="noopener">Abrir el grupo de Telegram</a>
        <a class="btn" :href="TELEGRAM.bot" target="_blank" rel="noopener">Pedir un reel al bot</a>
        <p class="meta">Horario de Ecuador. Esta página se actualiza sola cada 15 segundos.</p>
      </div>
    </aside>
    <div v-if="menu" class="velo" @click="menu = false" />

    <div class="cuerpo">
      <header class="barra">
        <button class="hamb" type="button" aria-label="Abrir menú" @click="menu = !menu"><span /><span /><span /></button>
        <h1>{{ actual.titulo }}</h1>
        <span class="meta sub">{{ actual.que }}</span>
        <span class="sp" />
        <span class="vivo" :class="estado.clase"><i />{{ estado.texto }}</span>
      </header>
      <main>
        <div v-if="error && !datos" class="aviso rojo">No llego al servidor de los agentes ({{ error }}). Reintento solo cada 15 segundos.</div>
        <div v-else-if="error && datos" class="aviso">Perdí la conexión hace un momento; muestro los últimos datos ({{ ultimaCarga?.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }) }}). Reintento solo.</div>
        <RouterView />
      </main>
      <nav class="movil" aria-label="Secciones">
        <RouterLink v-for="s in secciones.slice(0, 5)" :key="s.name" :to="s.path"><span aria-hidden="true">{{ s.icono }}</span>{{ s.titulo.split(' ')[0] }}</RouterLink>
        <button type="button" @click="menu = true"><span aria-hidden="true">⋯</span>Más</button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.app { min-height: 100svh; }
.lateral { position: fixed; inset: 0 auto 0 0; width: var(--sidebar); background: var(--ground); border-right: 1px solid var(--border); padding: 16px 12px; display: flex; flex-direction: column; gap: 16px; transform: translateX(-100%); transition: transform .2s; z-index: 30; }
.lateral.abierto { transform: none; background: var(--surface); }
.velo { position: fixed; inset: 0; background: rgba(10, 10, 10, .4); z-index: 25; }
.marca { display: flex; gap: 10px; align-items: center; padding: 4px 8px; }
.logo { width: 30px; height: 30px; border-radius: 8px; background: var(--text); color: #fff; display: grid; place-items: center; font-weight: 700; position: relative; flex: none; }
.logo i { position: absolute; right: 5px; bottom: 6px; width: 6px; height: 6px; border-radius: 50%; background: var(--hue); }
.marca b { display: block; font-weight: 600; line-height: 18px; }
.marca small { color: var(--muted); font-size: var(--fs-small); }
nav .item { display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 8px; text-decoration: none; color: var(--muted); }
nav .item:hover { background: var(--active); color: var(--text); }
nav .item.router-link-exact-active { background: var(--active); color: var(--text); font-weight: 500; }
.ico { width: 18px; text-align: center; font-size: 13px; }
.abajo { margin-top: auto; display: grid; gap: 8px; }
.abajo .btn { justify-content: center; }
.cuerpo { display: flex; flex-direction: column; min-height: 100svh; }
.barra { height: var(--barra); display: flex; align-items: center; gap: 10px; padding: 0 16px; background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 5; }
.barra h1 { font-size: 16px; font-weight: 600; white-space: nowrap; }
.barra .sub { display: none; }
.sp { flex: 1; }
.hamb { width: 36px; height: 36px; border: 0; background: none; display: grid; place-content: center; gap: 4px; cursor: pointer; margin-left: -8px; }
.hamb span { display: block; width: 18px; height: 2px; background: var(--text); }
.vivo { display: inline-flex; align-items: center; gap: 6px; font-size: var(--fs-small); color: var(--muted); white-space: nowrap; }
.vivo i { width: 8px; height: 8px; border-radius: 50%; background: var(--control); }
.vivo.verde i { background: var(--positive); animation: pulso 1.4s infinite; }
.vivo.rojo i { background: var(--negative); }
main { padding: 16px 16px calc(var(--nav-movil) + 16px); max-width: 1120px; width: 100%; margin: 0 auto; }
.movil { position: fixed; bottom: 0; left: 0; right: 0; height: var(--nav-movil); background: var(--surface); border-top: 1px solid var(--border); display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); z-index: 20; padding-bottom: env(safe-area-inset-bottom); }
.movil a, .movil button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font-size: 11px; color: var(--muted); text-decoration: none; border: 0; background: none; }
.movil a span, .movil button span { font-size: 15px; line-height: 16px; }
.movil a.router-link-exact-active { color: var(--text); font-weight: 600; }
@media (min-width: 900px) {
  .lateral { transform: none; }
  .velo, .hamb, .movil { display: none; }
  .cuerpo { margin-left: var(--sidebar); }
  .barra { padding: 0 var(--pad); }
  .barra .sub { display: inline; }
  main { padding: var(--pad); }
}
</style>
