# Trabajando con Carmín

Carmín es el gestor de proyectos local del usuario. Si está instalado en su
computadora, **puedes consultarlo y actualizarlo desde la terminal**. Todo lo
que el usuario hace en la UI, tú también puedes hacerlo — sin entrar a la web.

Cuando aparezca el comando `carmin` en el `PATH`, asume que está disponible.
Si no está, no pasa nada — sigue tu trabajo normal.

## Antes de empezar la sesión

Si el usuario te pide trabajar en un proyecto, primero consulta qué hay:

```bash
carmin proyectos                            # ver qué espacios/listas existen
carmin ls --proyecto Trip-App --abiertas    # tareas abiertas de un proyecto
carmin ls --vencidas                        # qué quedó atrasado
```

Eso te da el contexto que el usuario tiene en mente, sin que tenga que
explicártelo.

## Durante el trabajo

Cuando avanzas en algo concreto:

```bash
carmin status "PR quickwins" "EN CURSO"
carmin nota "PR quickwins" "Mergeé login y signin, faltan los otros 5."
carmin done "PR quickwins"
carmin nueva "Bug en stops/route" --proyecto Trip-App --prio alta
```

- La búsqueda por título es **substring case-insensitive**. Si "PR" coincide
  con varias, el CLI te muestra los IDs para que elijas con el ID exacto.
- Puedes usar el ID en vez del título: `carmin done 12`.

## Al terminar la sesión

**Esto es lo más importante.** Antes de despedirte, deja una nota corta en
cada tarea que tocaste. El usuario abrirá Carmín al día siguiente y verá tu
resumen sin tener que reconstruir contexto.

Estructura sugerida para las notas:
- **Qué hiciste** (1 oración)
- **Qué descubriste** que el usuario debería saber (opcional)
- **Qué quedó pendiente o sugerencia** (opcional)

Ejemplo bueno:
```bash
carmin nota "Wompi $15" "Agregué el guard en /trip/new. Encontré que también falta validarlo en /trip/edit — abrí una tarea nueva. Probado con $14: bloquea correctamente."
```

Ejemplo malo (no hagas esto):
```bash
carmin nota "Wompi $15" "Hecho ✓"   # demasiado vago, no aporta contexto
```

## Reglas

- **Verifica antes de marcar done.** Si no terminaste de verdad, usa
  `carmin status "..." "EN REVISIÓN"` o similar y explica en una nota dónde
  quedaste.
- **No inventes nombres de tareas o estados** — siempre usa `carmin ls` o
  `carmin estados` primero.
- **Las notas son cortas** (1-3 oraciones). No copies código completo; si
  hace falta, referencia el archivo: `src/foo.ts:42`.
- **No spamees notas.** Una nota al empezar una tarea grande es OK; una nota
  al final con el resumen es OK. Más de eso es ruido.
- **Si el usuario no usa Carmín en este proyecto**, no fuerces nada. El
  trabajo en código va primero; Carmín es un canal de comunicación opcional.

## Comandos disponibles

```
carmin                                       arranca y abre la app
carmin stop                                  apaga el servidor

carmin ls                                    todas las tareas
carmin ls --proyecto X --abiertas --hoy      filtros (también --vencidas)
carmin info "buscar"                         detalles + comentarios
carmin estados                               estados configurados
carmin proyectos                             espacios y listas

carmin nueva "Título" --proyecto X --prio alta --due 2026-06-15 --tag bug
carmin status "buscar" "EN CURSO"
carmin done "buscar"
carmin nota "buscar" "texto del comentario"
```

## El espíritu

Carmín es el **diario compartido** entre el usuario y tú. Cuando él abre
Carmín en la mañana, debería ver de un vistazo qué hiciste tú anoche, qué
queda pendiente y qué sugieres. Eso ahorra contexto en cada sesión nueva y
permite que ambos trabajen en paralelo sin pisarse.
