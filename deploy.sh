#!/usr/bin/env bash
# Construye la oficina y la sube al VPS, a la carpeta pública que sirve nginx en https://agentes.bakano.ec.
# Requiere acceso SSH al servidor (llave) y que el servidor tenga TABLERO_DIR en /root/agentes-para-videos-bakano/.env.
set -euo pipefail
cd "$(dirname "$0")"
SERVIDOR=${SERVIDOR:-root@179.66.137.188}
npm run build
DIR=$(ssh "$SERVIDOR" 'grep ^TABLERO_DIR= /root/agentes-para-videos-bakano/.env | cut -d= -f2-')
[[ -n $DIR ]] || { echo "el servidor no tiene TABLERO_DIR"; exit 1; }
# datos.json lo escribe el servidor; no se toca
rsync -az --delete --exclude datos.json dist/ "$SERVIDOR:/var/www/html/$DIR/"
echo "desplegado en https://agentes.bakano.ec"
