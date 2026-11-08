<script setup lang="ts">
import { INSTAGRAM, TELEGRAM } from '../datos'
</script>

<template>
  <section class="grid">
    <article class="panel c6">
      <header><h2>Qué es esta oficina</h2></header>
      <p>Dos agentes de inteligencia artificial trabajan solos en un servidor para la cuenta <a :href="INSTAGRAM" target="_blank" rel="noopener">@bakano.ec</a>. Esta página muestra, en tiempo real, qué hace cada uno, qué publicó y qué toca grabar. Se actualiza sola cada 15 segundos.</p>
      <dl>
        <dt>Radar 10K</dt><dd>Produce reels con IA, sin cara: dibuja lo que dice la voz. Publica a las 09:00 y a las 19:00.</dd>
        <dt>Yapper</dt><dd>A las 05:30 investiga, escribe los cuatro guiones del día (dos para Radar, uno para Diego, uno para Denisse) y publica el video grabado que haya en espera.</dd>
        <dt>Meta</dt><dd>10.000 vistas diarias durante 10 días seguidos, con conversación real: comentarios, guardados, compartidos y mensajes.</dd>
      </dl>
    </article>
    <article class="panel c6">
      <header><h2>Horario del día (Ecuador)</h2></header>
      <ul class="horas">
        <li><b class="num">cada 3 h</b><span>Yapper investiga tendencias (Ecuador y nicho) y deja ideas listas; avisa si hay una oportunidad fuerte</span></li>
        <li><b class="num">05:30</b><span>Yapper: informe al grupo y los 4 guiones del día</span></li>
        <li><b class="num">07:00</b><span>Latido del servidor en el grupo (sigue vivo, disco, pausa)</span></li>
        <li><b class="num">09:00</b><span>Radar: reel de la mañana publicado</span></li>
        <li><b class="num">19:00</b><span>Radar: reel de la noche publicado</span></li>
        <li><b class="num">Lunes</b><span>Revisión del acceso a Instagram</span></li>
      </ul>
    </article>
    <article class="panel c6">
      <header><h2>Qué hacen tú y Denisse</h2></header>
      <ol class="pasos">
        <li>Lee el guion a cámara del día (en «Plan de hoy»).</li>
        <li>Toca «Cómo grabarlo»: encuadre, arranque, palabra a enfatizar.</li>
        <li>Graba en una toma de 30 a 45 segundos, cámara cerca, luz de frente.</li>
        <li>Manda el video al grupo de Telegram (hasta 20 MB) o por scp al servidor.</li>
        <li>Yapper lo publica a las 05:30 del día siguiente con su caption. Si lo quieres ya, dile al bot «publícalo ya».</li>
        <li>Responde los mensajes directos que lleguen: esa conversación es humana.</li>
      </ol>
    </article>
    <article class="panel c6">
      <header><h2>Comandos del bot de Telegram</h2></header>
      <dl>
        <dt>/estado</dt><dd>Qué corre, en qué paso va, qué se publicó hoy y las vistas. Responde al instante.</dd>
        <dt>/pendientes</dt><dd>Guiones sin grabar y videos sin publicar.</dd>
        <dt>/grupo</dt><dd>Para qué es el grupo y qué llega a qué hora.</dd>
        <dt>/pausa · /reanudar</dt><dd>Frenar o soltar las publicaciones automáticas.</dd>
        <dt>«hazme un video sobre …»</dt><dd>Pide un reel: el bot escribe, produce, te lo muestra y lo publica.</dd>
        <dt>Mandar un video</dt><dd>Se guarda en la cola y Yapper lo publica.</dd>
      </dl>
      <div class="botones">
        <a class="btn primario" :href="TELEGRAM.grupo" target="_blank" rel="noopener">Abrir el grupo</a>
        <a class="btn" :href="TELEGRAM.bot" target="_blank" rel="noopener">Abrir el bot</a>
      </div>
    </article>
    <article class="panel c12">
      <header><h2>Las reglas que siguen los agentes para que un reel funcione</h2><span class="meta">del reel de referencia de Robert McKeaveney</span></header>
      <ol class="reglas">
        <li><b>El tiempo de visualización manda.</b> Un reel solo se hace viral si lo ven hasta el final. Cada frase se gana la siguiente.</li>
        <li><b>Gancho, desarrollo, pago.</b> El gancho mete una pregunta en la cabeza; el final la responde.</li>
        <li><b>Si funciona, se repite.</b> Cambia una o dos piezas y vuelve a salir un mes después.</li>
        <li><b>Varias versiones.</b> Hasta cinco ganchos por idea; se produce el mejor y los otros quedan de reserva.</li>
        <li><b>Formato prestado, contenido propio.</b> La estructura de un reel viral con el dolor de nuestro segmento.</li>
        <li><b>Las tres E.</b> Entretiene, enseña o emociona. Si solo vende, no sale.</li>
        <li><b>Las rachas pesan.</b> Tres reels flojos seguidos achican la audiencia del siguiente; tres buenos la agrandan.</li>
      </ol>
    </article>
  </section>
</template>

<style scoped>
p + dl, dl { margin-top: 10px; }
dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 8px 12px; }
dt { font-weight: 600; white-space: nowrap; }
dd { margin: 0; }
.horas li { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 10px; padding: 8px 0; border-top: 1px solid var(--rule); }
.horas li:first-child { border-top: 0; }
.horas b { font-weight: 500; }
.pasos, .reglas { padding-left: 20px; display: grid; gap: 8px; }
.botones { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
@media (max-width: 480px) { dl { grid-template-columns: 1fr; gap: 2px 0; } dd { margin-bottom: 8px; } }
</style>
