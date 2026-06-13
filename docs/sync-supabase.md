# Sync con Supabase — diseño

> Estado: **propuesta** (sin construir). Sirve para discutir y aprobar antes de codear.
> Objetivo: que 2-3 personas colaboren en el mismo tablero de forma **asíncrona**
> (sin que la máquina de nadie tenga que estar encendida), manteniendo Carmín local-first.

## Idea en una frase

Cada quien corre su **Carmín local**; un proyecto de **Supabase** es el "punto de
encuentro" que sincroniza los cambios. Supabase es solo el cartero — tus datos
siguen viviendo en tu disco.

Esto es distinto a `carmin share` (Tailscale), que sirve para colaboración **en vivo**
pero exige que tu máquina esté encendida y tú seas el servidor.

## El problema central: los IDs

Hoy las tablas usan enteros autoincrementales locales. La tarea `5` de tu máquina y
la `5` de tu socio chocarían. La solución:

- Cada fila sincronizable gana un **`uid` (UUID global)** al crearse.
- El entero local se queda para FKs internas; el `uid` es la **llave de sync**.
- No hay que migrar PKs: solo agregar columna y generarla en cada `create`.

Tablas sincronizables: `spaces`, `lists`, `statuses`, `tasks`, `comments`, `goals`,
`task_links`, `docs`. (`attachments` binarios → Fase 3. `sources`/`folders`/`settings`
son locales de cada quien, **no** sincronizan.)

## Modelo de sincronización (sin CRDT)

CRDT/P2P se descartó: es el negocio entero de Anytype, meses de trabajo y bugs de
sistemas distribuidos. Para 2-3 personas, **last-write-wins (LWW)** por timestamp es
suficiente.

Cada fila lleva: `uid`, `updated_at`, `deleted` (tombstone / borrado suave), `board_id`.

- **Bajar (pull):** traigo de Supabase las filas con `updated_at > última_sync` del
  board → para cada una, si `remoto.updated_at > local.updated_at`, la aplico
  (insert/update por `uid`). `deleted=true` → borro localmente.
- **Subir (push):** mando las filas locales modificadas desde la última sync
  (`upsert` por `uid`). Para reducir el clock-skew, al subir uso el reloj del
  servidor de Supabase como `updated_at` autoritativo.
- **Conflicto:** gana la edición más reciente. Riesgo de perder una edición
  simultánea: bajo y aceptable para equipos chicos.

```
cada N segundos (o botón "Sincronizar"):
   pull(board, last_pull)   # aplica remoto → local (LWW)
   push(board, last_push)   # sube local → remoto (LWW)
   guarda last_pull/last_push
```

## Esquema en Supabase

Tablas espejo (una por tabla local sincronizable), con columnas comunes:

```sql
create table sync_tasks (
  uid         uuid primary key,
  board_id    uuid not null,
  updated_at  timestamptz not null default now(),
  deleted     boolean not null default false,
  payload     jsonb not null,         -- el cuerpo de la tarea (title, status, due, ...)
  device_id   text                    -- quién hizo el último cambio (debug/auditoría)
);
create index on sync_tasks (board_id, updated_at);
```

Usar `payload jsonb` mantiene el esquema flexible (los `custom_fields` ya son JSON).
`board_members(board_id, member_token_hash, role)` define quién entra a cada board y con qué rol.

## Seguridad

- **RLS (Row Level Security)** por `board_id`: solo miembros del board leen/escriben sus filas.
- Reutilizamos el **conector Supabase que Carmín ya tiene** (REST/PostgREST + key en `credentials.json`, fuera del repo).
- Roles reflejan los de `carmin share`: `owner` / `editor` / `guest` aplicados también del lado servidor (RLS + policies por acción).

## Adjuntos (Fase 3)

Los binarios no van en la tabla: van a **Supabase Storage**. Se sincroniza la
metadata (nombre, mime, ruta en Storage) como cualquier fila; el archivo se sube/baja
bajo demanda. Las imágenes de documentos ya usan URLs `/api/attachment?id=N` con el
token del visor inyectado al render — habría que mapear esas URLs a las de Storage.

## Fases

| Fase | Qué | Esfuerzo |
|---|---|---|
| **0 — Prep** | `uid`+`updated_at`+`deleted` en tablas locales; toda escritura los actualiza | ~½ día |
| **1 — MVP** | Tablas espejo + motor pull/push (tareas, listas, estados, comentarios, metas, relaciones, doc). Botón "Sincronizar" manual | ~2-3 días |
| **2 — Pulido** | Sync automático en segundo plano + borrados/conflictos visibles | ~1-2 días |
| **3 — Adjuntos** | Binarios vía Supabase Storage | ~1-2 días |
| **4 — Tiempo real** (opcional) | Supabase Realtime para ver cambios al instante | después |

Un **Fase 1+2 sólido es ~1 semana**. Recomendación: construirlo **solo cuando haya
alguien real que vaya a colaborar**. Mientras tanto, el rol **editor** por Tailscale
(ya implementado) cubre la mayoría de los casos.

## Decisiones pendientes (antes de codear)

1. **Confianza:** ¿token compartido por board (simple, sirve para 2-3) o cuentas
   reales de Supabase Auth (más robusto)?
2. **Alcance:** ¿sincronizar todo, o que el dueño elija qué espacios se comparten?
3. **Proyecto:** ¿usar el Supabase de Akatrek o uno aparte para Carmín? (recomiendo aparte).

## Alternativa considerada (y por qué no)

- **Carmín como cliente delgado de un Supabase único** (sin SQLite local para boards
  compartidos): más simple de sincronizar, pero rompe la identidad local-first y la
  privacidad. Descartada.
