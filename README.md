# Oficina Bakano

Panel en tiempo real de los agentes de video de Bakano (Radar 10K y Yapper), los que escriben guiones, producen y
publican reels en [@bakano.ec](https://www.instagram.com/bakano.ec/). En vivo: <https://agentes.bakano.ec>

Muestra qué hace cada agente ahora (paso a paso), el plan del día (qué reel replicar y por qué, los guiones y cómo
grabarlos), lo publicado, las métricas de Instagram y las bitácoras de los agentes. Mobile first; se refresca sola
cada 15 segundos.

## Cómo funciona

- Es una app estática (Vue 3 + TypeScript + Vite + vue-router). No tiene backend propio ni secretos.
- Lee `datos.json`, que un proceso del servidor de los agentes regenera cada 30 segundos con el estado de los procesos,
  las bitácoras, los guiones, lo publicado y las métricas de Instagram.
- En producción se sirve desde el mismo dominio que `datos.json`; en desarrollo (localhost) lee el `datos.json`
  público de agentes.bakano.ec.

## Desarrollo

```bash
npm install
npm run dev
```

## Despliegue

```bash
./deploy.sh
```

Construye y sube `dist/` por rsync a la carpeta pública del servidor (necesita la llave SSH del servidor). Los agentes,
sus prompts y sus claves viven en otro repositorio privado; aquí solo está la interfaz.

## Estructura

```
src/
  datos.ts          lectura y refresco de datos.json, tipos, utilidades de tiempo
  md.ts             markdown de guiones y bitácoras → HTML, y extracción de secciones (gancho, caption, cómo grabar)
  router.ts         secciones del sidebar
  App.vue           shell: sidebar (escritorio) / barra inferior (celular), estado en vivo
  components/       AgenteCard, GuionCard, Ayuda (i), Modal
  views/            Ahora, Hoy, Guiones, Publicado, Metricas, Bitacoras, Ayuda
```
