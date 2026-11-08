import { createRouter, createWebHistory } from 'vue-router'

export const secciones = [
  { path: '/', name: 'ahora', titulo: 'Ahora', icono: '●', que: 'Qué está haciendo cada agente en este momento, paso a paso.' },
  { path: '/hoy', name: 'hoy', titulo: 'Plan de hoy', icono: '◎', que: 'Qué reel replicamos hoy, por qué, los guiones y cómo grabarlos.' },
  { path: '/guiones', name: 'guiones', titulo: 'Guiones', icono: '≡', que: 'Todos los guiones escritos por los agentes, con el porqué de cada uno.' },
  { path: '/publicado', name: 'publicado', titulo: 'Publicado', icono: '↗', que: 'Los reels que publicaron los agentes y los videos en espera.' },
  { path: '/metricas', name: 'metricas', titulo: 'Métricas', icono: '▮', que: 'Vistas, alcance, racha hacia la meta y los últimos reels de la cuenta.' },
  { path: '/bitacoras', name: 'bitacoras', titulo: 'Bitácoras', icono: '✎', que: 'La memoria de cada agente: qué midió, qué decidió y qué cambia mañana.' },
  { path: '/ayuda', name: 'ayuda', titulo: 'Ayuda', icono: '?', que: 'Qué significa cada cosa, horarios, comandos de Telegram y reglas.' },
] as const

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'ahora', component: () => import('./views/Ahora.vue') },
    { path: '/hoy', name: 'hoy', component: () => import('./views/Hoy.vue') },
    { path: '/guiones', name: 'guiones', component: () => import('./views/Guiones.vue') },
    { path: '/publicado', name: 'publicado', component: () => import('./views/Publicado.vue') },
    { path: '/metricas', name: 'metricas', component: () => import('./views/Metricas.vue') },
    { path: '/bitacoras', name: 'bitacoras', component: () => import('./views/Bitacoras.vue') },
    { path: '/ayuda', name: 'ayuda', component: () => import('./views/Ayuda.vue') },
    { path: '/:resto(.*)', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
