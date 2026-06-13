# ● Carmín

**Tu gestor de proyectos local, estilo ClickUp — gratis, privado y sin instalar nada.**

Carmín corre 100% en tu computadora. Tus tareas nunca salen de tu disco.
Además de gestionar tareas, **vigila las carpetas de tus proyectos** y te muestra
qué archivos `.md` se actualizaron y qué pendientes (`- [ ]`) siguen sin hacer.

> 🇬🇧 *Carmín is a local-first, zero-dependency ClickUp-style project manager.
> It also watches your projects' markdown files to surface recent changes and
> unchecked todos. Spanish-first UI; English translation welcome!*

## Cómo abrirlo

**Opción 1 — doble clic:** abre `Abrir Carmín.command`.

**Opción 2 — terminal:**

```bash
python3 app.py
```

Se abre solo en tu navegador en `http://127.0.0.1:4848`. Para apagarlo: `Ctrl+C`.

## Qué incluye

- ✅ **Espacios → Listas → Tareas**, como ClickUp
- ✅ Vistas **Lista, Tablero (Kanban con drag & drop), Calendario, Tabla, Panel, Grafo y Documento** — activa solo las que uses
- ✅ **Listas como tipos**: una lista no solo guarda tareas, también contactos, viajes o gastos. Dale un icono, un nombre de ítem y columnas propias (tu mini-base de datos personal)
- ✅ **Relaciones entre tareas**: vincula qué *bloquea* a qué, qué está *relacionado* o es *duplicado*, y míralo todo en la **vista de grafo**
- ✅ **Adjuntos**: pega (⌘V) o arrastra imágenes y archivos a una tarea; o **elige un archivo de tu PC** y ábrelo en su app nativa sin copiarlo
- ✅ **Documento** por lista: una página Markdown tipo Notion con imágenes pegadas/arrastradas
- ✅ **Inicio**: tu día de un vistazo (vencidas, para hoy, urgentes)
- ✅ **Proyectos**: vigila carpetas con archivos `.md` — qué cambió, qué checkbox sigue pendiente, y el estado git (cambios sin commit / commits sin subir)
- ✅ **Metas**: objetivos medibles por proyecto con progreso (vista Panel)
- ✅ **Conectores en vivo**: trae datos de Supabase, una API o GitHub a una lista (solo lectura)
- ✅ Convierte un `- [ ]` de tus notas en tarea con un clic
- ✅ Estados personalizables (nombre, color, orden)
- ✅ Prioridades, fechas límite, etiquetas y comentarios
- ✅ Tema **Dark Crimson** y tema **Blanco**, con color de acento editable
- ✅ Fuente [Satoshi](https://www.fontshare.com/fonts/satoshi)

## Stack

- **Python 3.9+** (el que ya trae macOS) — servidor con la librería estándar, cero dependencias
- **SQLite** — tus datos viven en `data.db`, junto a la app
- **HTML/CSS/JS puro** — sin frameworks, sin `npm install`

## Para Claude (y otros agentes de IA)

Carmín tiene una segunda cara: el comando `carmin` es también un CLI. Eso significa que **Claude puede actualizar tu tablero mientras trabaja**, sin que tú tengas que ir a la UI:

```bash
carmin ls --proyecto Trip-App --abiertas    # qué hay pendiente
carmin status "PR quickwins" "EN CURSO"     # marcar empezada
carmin nota "PR quickwins" "Mergeé login y signin, faltan los otros 5 archivos."
carmin done "PR quickwins"                  # marcar terminada
carmin nueva "Bug en stops/route" --proyecto Trip-App --prio alta
```

Cuando instalas Carmín, agrega esta línea al final de tu `~/.claude/CLAUDE.md`:

> Si el comando `carmin` está disponible, antes de empezar a trabajar ejecuta `carmin proyectos` y `carmin ls --abiertas`. Al terminar, deja una nota corta (`carmin nota`) en cada tarea que tocaste. Instrucciones completas en `~/carmin/CLAUDE.md`.

A partir de ahí, cada sesión de Claude consulta tu tablero, marca progreso y deja notas para que en la mañana siguiente veas exactamente qué pasó — sin tener que reconstruir contexto. Es el "diario compartido" entre tú y la IA.

El archivo `CLAUDE.md` dentro de este repo contiene la guía completa: cuándo dejar notas, qué reglas seguir, cómo evitar marcar como hecho lo que no terminó.

## Compartir tu tablero (modo invitado)

Por defecto Carmín solo escucha en `127.0.0.1` — nadie más puede verlo. Cuando
quieras mostrarle tu tablero a alguien (sin darle acceso a tu computadora):

```bash
carmin share
```

Esto:
1. Pone Carmín a escuchar en tu red **a través de [Tailscale](https://tailscale.com)**
   (VPN privada gratis — instálala en ambas computadoras).
2. Genera dos links con token:
   - **Dueño** (tú): control total.
   - **Invitado**: solo lectura + puede dejar comentarios/sugerencias. No puede
     crear, editar ni borrar nada.
3. Le pasas el link de invitado a la otra persona. Abre el tablero en su
   navegador, ve cómo va tu proyecto y te deja notas — sin instalar nada ni
   tener acceso a tus archivos.

Tus datos siguen viviendo solo en tu máquina; el invitado los ve a través de la
conexión cifrada de Tailscale mientras tú tengas Carmín abierto.

### Seguridad

- Los tokens viven en `~/carmin/credentials.json` (en `.gitignore`, permisos `600`),
  nunca se suben al repo ni se exponen al navegador.
- En modo compartir, cada petición a la API exige un token válido (401 sin él).
- Los invitados solo pueden leer y comentar (el servidor bloquea cualquier
  escritura con 403, no solo se ocultan los botones).
- Las fuentes externas no pueden apuntar a hosts internos de tu red ni a
  endpoints de metadata cloud (protección contra SSRF).

## Hoja de ruta

- [x] Modo invitado: compartir en red local (solo lectura + comentarios)
- [x] Relaciones entre tareas + vista de grafo
- [x] Listas como tipos (campos custom como esquema)
- [x] Adjuntos: imágenes pegadas/arrastradas y archivos locales
- [x] Vista Documento (Markdown por lista)
- [ ] Exportar / importar datos
- [ ] Subtareas
- [ ] English UI

## Licencia

MIT — úsalo, modifícalo y compártelo libremente.
