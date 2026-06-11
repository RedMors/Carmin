#!/bin/zsh
# Doble clic para abrir Carmín. Deja la ventana abierta mientras lo usas.
cd "$(dirname "$0")"
exec python3 app.py
