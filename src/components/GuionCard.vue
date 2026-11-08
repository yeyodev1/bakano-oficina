<script setup lang="ts">
// Ficha de un guion: para quién, el gancho, el porqué, y botones para leerlo, ver cómo grabarlo y copiarlo.
import { computed, ref } from 'vue'
import Modal from './Modal.vue'
import { type Guion } from '../datos'
import { aHtml, campos, caption, comoGrabar, gancho, porQue } from '../md'

const props = defineProps<{ guion: Guion; completo?: boolean }>()
const modal = ref<'' | 'guion' | 'grabar'>('')
const copiado = ref(false)
const c = computed(() => campos(props.guion.md))
const quien = computed(() => {
  const n = props.guion.nombre
  if (/radar/.test(n)) return { etiqueta: /noche/.test(n) ? 'Reel con IA · noche 19:00' : /manana/.test(n) ? 'Reel con IA · mañana 09:00' : 'Reel con IA', graba: '' }
  if (/diego/.test(n)) return { etiqueta: 'A cámara · Diego', graba: 'Diego' }
  if (/denise|denisse/.test(n)) return { etiqueta: 'A cámara · Denisse', graba: 'Denisse' }
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
    <Modal :abierto="modal === 'grabar'" :titulo="`Cómo grabar: ${quien.graba}`" @cerrar="modal = ''">
      <div class="md">
        <h4>Lo básico, siempre</h4>
        <ul>
          <li>Celular vertical, cámara a la altura de los ojos, la cara a unos 40 cm: formato «yapping», cerca y conversando.</li>
          <li>Luz de frente (ventana o aro). Nada de luz detrás.</li>
          <li>Una sola toma de 30 a 45 segundos. Si te trabas, repite desde el inicio; no edites a medias.</li>
          <li>La primera frase ya es el gancho: sin «hola», sin presentarte. Mira a la lente.</li>
          <li>Termina con la pregunta del caption, dicha tal cual, y quédate 1 segundo en silencio.</li>
          <li>Mándalo al grupo de Telegram o déjalo en el servidor: Yapper lo publica a las 05:30 del día siguiente.</li>
        </ul>
        <h4>Lo que pide este guion</h4>
        <div v-if="grabar" v-html="aHtml(grabar)" />
        <p v-else class="meta">Este guion no trae bloque de grabación; sigue lo básico y lee el guion completo.</p>
      </div>
    </Modal>
  </article>
</template>

<style scoped>
.ficha { border: 1px solid var(--border); border-radius: var(--radius-card); padding: 14px 16px; background: var(--surface); display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.arriba { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
h3 { font-size: 15px; line-height: 21px; font-weight: 600; }
dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 10px; margin: 0; }
dt { color: var(--muted); font-size: var(--fs-small); line-height: 20px; white-space: nowrap; }
dd { margin: 0; overflow-wrap: anywhere; }
.botones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; padding-top: 6px; }
</style>
