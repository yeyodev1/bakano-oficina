// Markdown de guiones y bitácoras: a HTML, y extracción de secciones y campos para mostrarlos como fichas.
import { marked } from 'marked'

export function aHtml(md: string): string {
  try {
    const html = marked.parse(md ?? '', { async: false }) as string
    // los títulos del markdown no compiten con los de la página
    return html.replace(/<h([1-2])/g, '<h4').replace(/<\/h[1-2]>/g, '</h4>').replace(/<h3/g, '<h4').replace(/<\/h3>/g, '</h4>')
      .replace(/<a /g, '<a target="_blank" rel="noopener" ')
  } catch {
    return `<pre>${escapar(md)}</pre>`
  }
}
export const escapar = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] ?? c))

/** Texto de la sección cuyo título contiene alguna de las palabras (sin tildes, sin mayúsculas). */
export function seccion(md: string, ...palabras: string[]): string {
  const lineas = md.split('\n')
  const clave = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  let dentro = false, nivel = 0
  const out: string[] = []
  for (const l of lineas) {
    const m = /^(#{1,4})\s+(.*)/.exec(l)
    if (m) {
      if (dentro && m[1]!.length <= nivel) break
      if (!dentro && palabras.some(p => clave(m[2]!).includes(clave(p)))) { dentro = true; nivel = m[1]!.length; continue }
    }
    if (dentro) out.push(l)
  }
  return out.join('\n').trim()
}

/** Campos tipo `**Segmento:** webs` o `- Dolor: ...` → { segmento: 'webs', dolor: '...' } */
export function campos(md: string): Record<string, string> {
  const r: Record<string, string> = {}
  for (const l of md.split('\n')) {
    const m = /^\s*[-*]?\s*\*{0,2}([A-Za-zÁÉÍÓÚáéíóúñÑ ()/]{3,28}?)\*{0,2}\s*:\*{0,2}\s*(.{3,})$/.exec(l)
    if (!m) continue
    const k = m[1]!.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim().replace(/\s+/g, '_')
    if (!(k in r)) r[k] = m[2]!.replace(/\*\*/g, '').trim()
  }
  return r
}

/** El gancho elegido del guion: la primera frase entre comillas angulares o el campo gancho/hook. */
export function gancho(md: string): string {
  const c = campos(md)
  const m = /«([^»]{8,160})»/.exec(md)
  return (c['gancho'] ?? c['hook'] ?? c['gancho_elegido'] ?? m?.[1] ?? '').replace(/^«|»$/g, '')
}

/** La pregunta o caption final del guion. */
export function caption(md: string): string {
  const s = seccion(md, 'caption', 'pie', 'texto del post')
  if (s) return s.replace(/[`*]/g, '').trim()
  const c = campos(md)
  return c['caption'] ?? c['pregunta_final'] ?? c['pregunta'] ?? ''
}

/** Lo que el guion dice sobre cómo grabarlo (encuadre, arranque, énfasis). */
export function comoGrabar(md: string): string {
  return seccion(md, 'grabar', 'grabacion', 'para grabar', 'encuadre', 'produccion')
}

export function porQue(md: string): string {
  return seccion(md, 'por que', 'porque', 'justificacion') || (campos(md)['por_que'] ?? campos(md)['porque'] ?? '')
}
