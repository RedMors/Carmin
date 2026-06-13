#!/bin/sh
# Doble clic: deja "Carmín.app" en tu Escritorio, con ícono propio.
# No instala nada ni mueve tus datos — la app solo abre Carmín desde esta carpeta.

REPO="$(cd "$(dirname "$0")" && pwd)"

# El Escritorio en macOS siempre vive en ~/Desktop a nivel de disco, aunque
# Finder lo muestre como "Escritorio" cuando el sistema está en español.
DESK="$HOME/Desktop"
mkdir -p "$DESK"

APP="$DESK/Carmín.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

# --- metadatos del bundle ---
cat > "$APP/Contents/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Carmín</string>
  <key>CFBundleDisplayName</key><string>Carmín</string>
  <key>CFBundleIdentifier</key><string>local.carmin.launcher</string>
  <key>CFBundleVersion</key><string>1.0</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleExecutable</key><string>carmin</string>
  <key>CFBundleIconFile</key><string>carmin</string>
  <key>LSMinimumSystemVersion</key><string>10.12</string>
  <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
EOF

# --- ejecutable: abre Carmín en una ventana de Terminal (para apagar con Ctrl+C) ---
cat > "$APP/Contents/MacOS/carmin" <<EOF
#!/bin/sh
open -a Terminal "$REPO/Abrir Carmín.command"
EOF
chmod +x "$APP/Contents/MacOS/carmin"

# --- ícono: convierte el PNG maestro a .icns con las herramientas de macOS ---
SRC="$REPO/assets/icon-1024.png"
if [ -f "$SRC" ] && command -v sips >/dev/null 2>&1 && command -v iconutil >/dev/null 2>&1; then
  ISET="$(mktemp -d)/carmin.iconset"
  mkdir -p "$ISET"
  for s in 16 32 128 256 512; do
    sips -z "$s" "$s"     "$SRC" --out "$ISET/icon_${s}x${s}.png"     >/dev/null 2>&1
    d=$((s * 2))
    sips -z "$d" "$d"     "$SRC" --out "$ISET/icon_${s}x${s}@2x.png"  >/dev/null 2>&1
  done
  iconutil -c icns "$ISET" -o "$APP/Contents/Resources/carmin.icns" >/dev/null 2>&1
  rm -rf "$(dirname "$ISET")"
fi

# Quita la cuarentena de Gatekeeper y refresca el ícono en Finder.
xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true
touch "$APP"

echo ""
if [ -f "$APP/Contents/Resources/carmin.icns" ]; then
  echo "  ✓ Listo: 'Carmín' está en tu Escritorio, con su ícono."
else
  echo "  ✓ Listo: 'Carmín' está en tu Escritorio (sin ícono: no encontré sips/iconutil)."
fi
echo "    Doble clic para abrir Carmín cuando quieras."
echo ""
echo "    La primera vez, si macOS pregunta: clic derecho → Abrir → Abrir."
echo "    (Ya puedes cerrar esta ventana.)"
echo ""
