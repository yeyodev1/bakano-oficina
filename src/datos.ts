// Estado en vivo: lee datos.json (lo escribe oficina.py en el VPS cada 30 s) y lo refresca cada 15 s.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export interface Bitacora { agente: string; nombre: string; fecha: string; md: string; texto?: string }
export interface Agente {
  corriendo: boolean; minutos: number; paso: number; fase: string; pasos: string[]
  ultima_bitacora: { nombre: string; fecha: string; texto: string } | null; proximas: string[]; detalle: string
}
export interface Reel { permalink: string; timestamp: string; views: number | null; reach: number | null; likes: number | null; comments: number | null; saved: number | null; shares: number | null; caption: string }
export interface Guion { nombre: string; fecha: string; md: string }
export interface Datos {
  ahora: string; pausa: boolean; turno: string
  agentes: Record<'radar-10k' | 'yapper', Agente>
  bot: boolean; vps: { disco: string; carga: string; ram: string }
  tendencias: { corriendo: boolean; minutos: number; ultima: string | null; rondas_hoy: number; vigentes: string; horas: string[] }
  metricas: { ayer: { views?: number; reach?: number }; reels: Reel[] }
  racha: number; publicados: { agente: string; fecha: string; url: string }[]
  guiones: Guion[]; investigaciones: Guion[]; listos: { nombre: string; mb: number; fecha: string }[]
  bitacoras: Bitacora[]; actividad: { hora: string; texto: string }[]
  horarios: { yapper: string; radar: string[]; latido: string }
}

// En producción datos.json vive en el mismo dominio; en desarrollo (localhost) se lee del servidor público.
const URL = /bakano\.ec$/.test(location.hostname) ? '/datos.json' : 'https://agentes.bakano.ec/datos.json'
const datos = ref<Datos | null>(null)
const error = ref('')
const cargando = ref(true)
const ultimaCarga = ref<Date | null>(null)
const ahora = ref(Date.now())
let temporizador: number | undefined
let reloj: number | undefined
let usuarios = 0

async function cargar() {
  try {
    const r = await fetch(`${URL}?t=${Date.now()}`, { cache: 'no-store' })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    datos.value = await r.json()
    ultimaCarga.value = new Date()
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    cargando.value = false
  }
}

export function useDatos() {
  onMounted(() => {
    if (usuarios++ === 0) {
      cargar()
      temporizador = window.setInterval(cargar, 15_000)
      reloj = window.setInterval(() => (ahora.value = Date.now()), 1_000)
    }
  })
  onBeforeUnmount(() => {
    if (--usuarios === 0) { clearInterval(temporizador); clearInterval(reloj) }
  })
  const hoy = computed(() => datos.value?.ahora.slice(0, 10) ?? new Date().toISOString().slice(0, 10))
  const publicadosHoy = computed(() => datos.value?.publicados.filter(p => p.fecha === hoy.value) ?? [])
  const guionesHoy = computed(() => datos.value?.guiones.filter(g => g.nombre.startsWith(hoy.value)) ?? [])
  const segundosDesdeCarga = computed(() => ultimaCarga.value ? Math.round((ahora.value - ultimaCarga.value.getTime()) / 1000) : null)
  return { datos, error, cargando, ultimaCarga, ahora, hoy, publicadosHoy, guionesHoy, segundosDesdeCarga, recargar: cargar }
}

// Utilidades de tiempo (hora de Ecuador: el servidor ya la manda así y el navegador de Diego está en Ecuador)
export function proxima(horas: readonly string[], desde = new Date()): Date {
  for (const h of horas) {
    const [H, M] = h.split(':').map(Number)
    const d = new Date(desde); d.setHours(H!, M!, 0, 0)
    if (d > desde) return d
  }
  const [H, M] = horas[0]!.split(':').map(Number)
  const d = new Date(desde); d.setDate(d.getDate() + 1); d.setHours(H!, M!, 0, 0)
  return d
}
export function falta(d: Date, desde = Date.now()): string {
  const s = Math.max(0, Math.round((d.getTime() - desde) / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60)
  return h ? `${h} h ${m} min` : `${m} min`
}
export const fmt = (n: number | null | undefined) => n == null ? '—' : n.toLocaleString('es-EC')
export const nombreAgente = (k: string) => k === 'radar-10k' ? 'Radar 10K' : k === 'yapper' ? 'Yapper' : k
export const INFO = {
  'radar-10k': { que: 'Reels con IA, sin cara. Produce y publica a las 09:00 y a las 19:00 con el guion que deja Yapper.' },
  yapper: { que: 'A las 05:30 investiga, escribe los cuatro guiones del día (dos para Radar, uno para Diego y uno para Denisse) y publica el video grabado que haya en espera.' },
} as const
export const TELEGRAM = { grupo: 'https://t.me/+msK_Z1jzdrFjOTJh', bot: 'https://t.me/MakerVideosBakano_bot' }
export const INSTAGRAM = 'https://www.instagram.com/bakano.ec/'
