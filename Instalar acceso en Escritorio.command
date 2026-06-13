#!/bin/sh
# Doble clic: crea un acceso directo a Carmín en tu Escritorio.
# No instala nada ni mueve tus datos — solo deja un "Carmín.command" que,
# al hacerle doble clic, arranca la app desde esta carpeta.

REPO="$(cd "$(dirname "$0")" && pwd)"

# El Escritorio en macOS siempre vive en ~/Desktop a nivel de disco, aunque
# Finder lo muestre como "Escritorio" cuando el sistema está en español.
DESK="$HOME/Desktop"
mkdir -p "$DESK"

LAUNCHER="$DESK/Carmín.command"

cat > "$LAUNCHER" <<EOF
#!/bin/sh
# Abre Carmín. Deja esta ventana abierta mientras lo usas (Ctrl+C para apagar).
# Generado por "Instalar acceso en Escritorio" — apunta a la carpeta de Carmín.
cd "$REPO" || { echo "No encuentro la carpeta de Carmín ($REPO)."; read _ 2>/dev/null; exit 1; }
if ! command -v python3 >/dev/null 2>&1; then
  echo "No encuentro python3. Instálalo desde https://www.python.org/downloads/ y reintenta."
  read _ 2>/dev/null
  exit 1
fi
echo "● Abriendo Carmín…  (deja esta ventana abierta; Ctrl+C para apagar)"
exec python3 app.py
EOF

chmod +x "$LAUNCHER"
# Quita la marca de cuarentena para que macOS no lo bloquee al abrirlo.
xattr -d com.apple.quarantine "$LAUNCHER" 2>/dev/null || true

echo ""
echo "  ✓ Listo: tienes 'Carmín.command' en tu Escritorio."
echo "    Doble clic ahí cada vez que quieras abrir Carmín."
echo ""
echo "    Si la primera vez macOS pregunta, elige Terminal / Abrir."
echo "    (Ya puedes cerrar esta ventana.)"
echo ""
