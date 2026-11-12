<script setup lang="ts">
// Ficha de un guion: para quién, el gancho, el porqué, y botones para leerlo, ver cómo grabarlo y copiarlo.
import { computed, ref } from 'vue'
import Modal from './Modal.vue'
import { type Guion, TELEGRAM } from '../datos'
import { aHtml, campos, caption, comoGrabar, gancho, porQue } from '../md'

const props = defineProps<{ guion: Guion; completo?: boolean }>()
const modal = ref<'' | 'guion' | 'grabar'>('')
const copiado = ref(false)
const c = computed(() => campos(props.guion.md))
const quien = computed(() => {
  const n = props.guion.nombre
  if (/radar/.test(n)) return { etiqueta: /noche/.test(n) ? 'Reel con IA · noche 19:00' : /manana/.test(n) ? 'Reel con IA · mañana 09:00' : 'Reel con IA', graba: '' }
  if (/diego/.test(n)) return { etiqueta: 'A cámara · Diego · automatizaciones', graba: 'Diego' }
  if (/denise|denisse/.test(n)) return { etiqueta: 'A cámara · Denisse · lógica de negocio', graba: 'Denisse' }
  if (/variante/.test(n)) return { etiqueta: 'Variante · reel de prueba', graba: '' }
  if (/oportunidad/.test(n)) return { etiqueta: 'Reel con IA · oportunidad', graba: '' }
  if (/telegram/.test(n)) return { etiqueta: 'Pedido por Telegram', graba: '' }
  return { etiqueta: 'Guion', graba: '' }
})
const titulo = computed(() => gancho(props.guion.md) || props.guion.nombre.replace(/^\d{4}-\d\d-\d\d-/, '').replace(/-/g, ' '))
const grabar = computed(() => comoGrabar(props.guion.md))
const razon = computed(() => porQue(props.guion.md) || c.value['dolor'] || '')
async function copiar() {
  try { await navigator.clipboard.writeText(props.guion.md); copiado.value = true; setTimeout(() => (copiado.value = false), 2000) } catch { /* sin portapapeles */ }
}
</script>

<template>
  <article class="ficha">
    <div class="arriba">
      <span class="pill">{{ quien.etiqueta }}</span>
      <span class="meta num">{{ guion.fecha.slice(5, 16).replace('T', ' ') }}</span>
    </div>
    <h3>«{{ titulo }}»</h3>
    <dl>
      <template v-if="c['segmento']"><dt>Para quién</dt><dd>{{ c['segmento'] }}</dd></template>
      <template v-if="c['dolor']"><dt>Dolor</dt><dd>{{ c['dolor'] }}</dd></template>
      <template v-if="razon && razon !== c['dolor']"><dt>Por qué este guion</dt><dd>{{ razon.replace(/[#*]/g, '').slice(0, 260) }}</dd></template>
      <template v-if="caption(guion.md)"><dt>Caption</dt><dd>{{ caption(guion.md).slice(0, 200) }}</dd></template>
    </dl>
    <div class="botones">
      <button class="btn chico primario" type="button" @click="modal = 'guion'">Leer el guion</button>
      <button v-if="quien.graba" class="btn chico" type="button" @click="modal = 'grabar'">Cómo grabarlo</button>
      <button class="btn chico" type="button" @click="copiar">{{ copiado ? 'Copiado' : 'Copiar' }}</button>
    </div>

    <Modal :abierto="modal === 'guion'" :titulo="guion.nombre" @cerrar="modal = ''">
      <div class="md" v-html="aHtml(guion.md)" />
    </Modal>
    <Modal :abierto="modal === 'grabar'" :titulo="`Cómo grabar este guion · ${quien.graba}`" @cerrar="modal = ''">
      <div class="md grabar">
        <p class="paso"><b>1. Tu primera frase, tal cual, mirando a la lente.</b> Sin «hola», sin presentarte: la primera frase ya es el gancho.</p>
        <blockquote class="cita">«{{ titulo }}»</blockquote>
        <p v-if="c['enfatizar'] || c['palabra_a_enfatizar'] || c['enfasis']" class="paso"><b>2. Enfatiza:</b> {{ c['enfatizar'] ?? c['palabra_a_enfatizar'] ?? c['enfasis'] }}</p>
        <p v-else class="paso"><b>2. Enfatiza</b> la palabra que nombra el dolor en cada frase: baja la voz justo antes y súbela en esa palabra.</p>
        <p class="paso"><b>3. Ritmo:</b> {{ c['duracion'] ?? '30 a 45 segundos' }}, una sola toma, pausa de medio segundo después del gancho y antes de la pregunta final.</p>
        <p class="paso"><b>4. Cierra con la pregunta del caption, dicha tal cual,</b> y quédate 1 segundo en silencio mirando a la cámara:</p>
        <blockquote v-if="caption(guion.md)" class="cita">{{ caption(guion.md).split('\n')[0] }}</blockquote>
        <h4>Encuadre y luz</h4>
        <ul>
          <li>Celular vertical a la altura de los ojos, la cara a unos 40 cm (formato «yapping»: cerca y conversando).</li>
          <li>Luz de frente (ventana o aro). Nada de luz detrás. Fondo simple, sin logos de clientes.</li>
          <li v-if="c['encuadre']">{{ c['encuadre'] }}</li>
          <li>Texto en pantalla sugerido: el gancho como título durante los primeros 2 segundos.</li>
        </ul>
        <h4>Antes de grabar</h4>
        <ul>
          <li>Léelo 3 veces en voz alta; en la tercera ya no leas, cuéntalo.</li>
          <li>Haz 2 tomas completas y quédate con la que tenga más energía, no con la más perfecta.</li>
          <li>El error más común: leer la pantalla y saludar. Si te trabas, repite desde el inicio.</li>
        </ul>
        <h4>Cuando esté listo</h4>
        <p>Mándalo al grupo de Telegram (hasta 20 MB) o déjalo en el servidor. Yapper lo publica a las 05:30 del día siguiente con este caption; si lo quieres ya, dile al bot «publícalo ya».</p>
        <a class="btn chico primario" :href="TELEGRAM.grupo" target="_blank" rel="noopener">Abrir el grupo de Telegram</a>
        <template v-if="grabar"><h4>Lo que pide este guion en particular</h4><div v-html="aHtml(grabar)" /></template>
      </div>
    </Modal>
  </article>
</template>

<style scoped>
.ficha { border: 1px solid var(--border); border-radius: var(--radius-card); padding: 14px 16px; background: var(--surface); display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.arriba { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
h3 { font-size: 15px; line-height: 21px; font-weight: 600; }
dl { display: flex; flex-wrap: wrap; gap: 4px 10px; margin: 0; }
dt { flex: 0 0 110px; color: var(--muted); font-size: var(--fs-small); line-height: 20px; white-space: nowrap; }
dd { flex: 1 1 calc(100% - 120px); min-width: 0; margin: 0; overflow-wrap: anywhere; }
.botones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; padding-top: 6px; }
.grabar .paso { margin: 8px 0; }
.cita { font-size: 16px; line-height: 24px; font-weight: 600; color: var(--text); border-left: 3px solid var(--hue); margin: 8px 0 12px; padding-left: 12px; }
</style>
