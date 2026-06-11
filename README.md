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
- ✅ Vistas **Lista, Tablero (Kanban con drag & drop) y Calendario** — activa solo las que uses
- ✅ **Inicio**: tu día de un vistazo (vencidas, para hoy, urgentes)
- ✅ **Proyectos**: vigila carpetas con archivos `.md` — qué cambió, qué checkbox sigue pendiente, y el estado git (cambios sin commit / commits sin subir)
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

## Privacidad y seguridad

Carmín solo escucha en `127.0.0.1` (tu propia máquina). Nadie más puede verlo,
ni siquiera en tu misma red WiFi. Compartir con invitados llegará en una
versión futura, como opción explícita.

## Hoja de ruta

- [ ] Modo invitado: compartir en red local (solo lectura + comentarios)
- [ ] Exportar / importar datos
- [ ] Subtareas
- [ ] English UI

## Licencia

MIT — úsalo, modifícalo y compártelo libremente.
