#!/usr/bin/env python3
# Carmín — tu gestor de proyectos local, estilo ClickUp.
# Cero dependencias: solo Python 3.9+ (ya viene en tu Mac). Datos en SQLite junto a este archivo.
# Uso:  python3 app.py [--port 4848] [--no-browser]

import json
import os
import re
import socket
import sqlite3
import subprocess
import sys
import threading
import webbrowser
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import urllib.error
import urllib.request
from urllib.parse import urlparse

BASE = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.join(BASE, "static")
DB_PATH = os.path.join(BASE, "data.db")
CREDS_PATH = os.path.join(BASE, "credentials.json")
HOST = "127.0.0.1"          # binding por defecto: solo esta Mac
DEFAULT_PORT = 4848

# Modo compartir: cuando está activo, el server escucha en la red (para Tailscale)
# y EXIGE un token en cada request a /api/*. Se activa con --share / CARMIN_SHARE=1.
SHARE_MODE = ("--share" in sys.argv) or (os.environ.get("CARMIN_SHARE") == "1")

# Carpetas que nunca se escanean al buscar archivos .md
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

EXCLUDE_DIRS = {
    "node_modules", ".git", ".next", "dist", "build", "__pycache__",
    ".vercel", ".turbo", "coverage", ".cache", "vendor", ".expo", ".DS_Store",
    "test-results", "playwright-report", "out", "tmp",
}


def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


SCHEMA = """
CREATE TABLE IF NOT EXISTS settings(
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS statuses(
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  color TEXT NOT NULL,
  kind  TEXT NOT NULL DEFAULT 'open',   -- open | active | done
  pos   INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS spaces(
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📁',
  pos  INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lists(
  id            INTEGER PRIMARY KEY,
  space_id      INTEGER NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  pos           INTEGER NOT NULL DEFAULT 0,
  custom_fields TEXT NOT NULL DEFAULT '[]', -- JSON: [{id,name,type,options?,width?}]
  source_id     INTEGER REFERENCES sources(id) ON DELETE SET NULL,
  source_path   TEXT NOT NULL DEFAULT '',   -- ej: "trip_posts?visibility=eq.public&limit=50"
  source_mapping TEXT NOT NULL DEFAULT '{}' -- JSON: {title:'name', status:'stage', due:'closeDate'}
);
CREATE TABLE IF NOT EXISTS sources(
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,             -- "Akatrek prod"
  type        TEXT NOT NULL,             -- 'supabase' | 'http' | 'github'
  config      TEXT NOT NULL DEFAULT '{}',-- JSON: {url, headers, cred_ref}
  created_at  TEXT
);
CREATE TABLE IF NOT EXISTS tasks(
  id            INTEGER PRIMARY KEY,
  list_id       INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  descr         TEXT DEFAULT '',
  status_id     INTEGER REFERENCES statuses(id),
  priority      TEXT DEFAULT '',           -- urgente | alta | normal | baja | ''
  due           TEXT DEFAULT '',           -- YYYY-MM-DD
  tags          TEXT DEFAULT '[]',         -- JSON array
  custom_values TEXT NOT NULL DEFAULT '{}',-- JSON: {field_id: value}
  created_at    TEXT,
  updated_at    TEXT,
  done_at       TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS comments(
  id         INTEGER PRIMARY KEY,
  task_id    INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author     TEXT,
  text       TEXT NOT NULL,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS folders(
  id   INTEGER PRIMARY KEY,
  name TEXT,
  path TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS goals(
  id         INTEGER PRIMARY KEY,
  space_id   INTEGER NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'number',  -- number | currency | percent
  target     REAL NOT NULL DEFAULT 0,
  current    REAL NOT NULL DEFAULT 0,
  unit       TEXT NOT NULL DEFAULT '',         -- 'usuarios', 'reservas', etc
  deadline   TEXT NOT NULL DEFAULT '',         -- YYYY-MM-DD
  notes      TEXT NOT NULL DEFAULT '',
  pos        INTEGER NOT NULL DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);
"""

# Migraciones suaves: ALTER TABLE para DBs viejas que no tenían las columnas.
# Cada paso es idempotente: si la columna ya existe, sqlite lanza error pero
# lo ignoramos. Mantiene el upgrade path sin pedirle nada al usuario.
SOFT_MIGRATIONS = [
    "ALTER TABLE lists ADD COLUMN custom_fields TEXT NOT NULL DEFAULT '[]'",
    "ALTER TABLE tasks ADD COLUMN custom_values TEXT NOT NULL DEFAULT '{}'",
    "ALTER TABLE lists ADD COLUMN source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL",
    "ALTER TABLE lists ADD COLUMN source_path TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE lists ADD COLUMN source_mapping TEXT NOT NULL DEFAULT '{}'",
]


def init_db():
    con = db()
    with con:
        con.executescript(SCHEMA)
        for sql in SOFT_MIGRATIONS:
            try:
                con.execute(sql)
            except sqlite3.OperationalError:
                pass  # la columna ya existe
        if con.execute("SELECT COUNT(*) c FROM statuses").fetchone()["c"] == 0:
            seed(con)
    con.close()


def seed(con):
    """Datos iniciales: estados estilo ClickUp + los pendientes reales de Alexis."""
    statuses = [
        ("PENDIENTE", "#8B97A6", "open", 0),
        ("EN CURSO", "#4E9CF5", "active", 1),
        ("EN REVISIÓN", "#A78BFA", "active", 2),
        ("COMPLETADO", "#34C77B", "done", 3),
    ]
    con.executemany("INSERT INTO statuses(name,color,kind,pos) VALUES(?,?,?,?)", statuses)
    sid = {r["name"]: r["id"] for r in con.execute("SELECT id,name FROM statuses")}

    con.execute("INSERT INTO spaces(name,icon,pos) VALUES('Akatrek','🏔',0)")
    ak = con.execute("SELECT last_insert_rowid() i").fetchone()["i"]
    con.execute("INSERT INTO lists(space_id,name,pos) VALUES(?, 'Trip-App', 0)", (ak,))
    l_trip = con.execute("SELECT last_insert_rowid() i").fetchone()["i"]

    con.execute("INSERT INTO spaces(name,icon,pos) VALUES('Mi Setup','🤖',1)")
    ms = con.execute("SELECT last_insert_rowid() i").fetchone()["i"]
    con.execute("INSERT INTO lists(space_id,name,pos) VALUES(?, 'Mac local', 0)", (ms,))
    l_mac = con.execute("SELECT last_insert_rowid() i").fetchone()["i"]

    t = now()
    tasks = [
        (l_trip, "Terminar los 7 archivos WIP (login, hiking, tours, lugares, stops, robots)",
         sid["EN CURSO"], "alta", "", '["web"]'),
        (l_trip, "Abrir PR de fix/trip-form-quickwins → main y mergear",
         sid["PENDIENTE"], "urgente", "", '["web","deploy"]'),
        (l_trip, "Verificar en producción el guard de Wompi $15 tras el merge",
         sid["PENDIENTE"], "normal", "", '["pagos"]'),
        (l_trip, "Revisar dashboard de Sentry cuando haya errores reales",
         sid["PENDIENTE"], "baja", "", '["monitoreo"]'),
        (l_mac, "Regenerar API keys expuestas (Gemini y OpenRouter)",
         sid["PENDIENTE"], "urgente", "", '["seguridad"]'),
        (l_mac, "Probar Carmín y anotar ideas de mejora",
         sid["EN CURSO"], "normal", "", '["carmin"]'),
    ]
    for list_id, title, st, prio, due, tags in tasks:
        con.execute(
            "INSERT INTO tasks(list_id,title,status_id,priority,due,tags,created_at,updated_at)"
            " VALUES(?,?,?,?,?,?,?,?)",
            (list_id, title, st, prio, due, tags, t, t),
        )

    trip = os.path.expanduser("~/Trip-App")
    if os.path.isdir(trip):
        con.execute("INSERT INTO folders(name,path) VALUES('Trip-App', ?)", (trip,))

    settings = {
        "theme": "dark",
        "accent": "#E0314F",
        "user_name": "Alexis",
        "views": '["lista","tablero","calendario"]',
    }
    con.executemany("INSERT INTO settings(key,value) VALUES(?,?)", settings.items())


# ---------------------------------------------------------------- estado

def _json_or(v, default):
    try:
        return json.loads(v) if v else default
    except (ValueError, TypeError):
        return default


def get_state():
    con = db()
    try:
        settings = {r["key"]: r["value"] for r in con.execute("SELECT * FROM settings")}
        statuses = [dict(r) for r in con.execute("SELECT * FROM statuses ORDER BY pos,id")]
        spaces = [dict(r) for r in con.execute("SELECT * FROM spaces ORDER BY pos,id")]
        lists = []
        for r in con.execute("SELECT * FROM lists ORDER BY pos,id"):
            d = dict(r)
            d["custom_fields"] = _json_or(d.get("custom_fields"), [])
            d["source_mapping"] = _json_or(d.get("source_mapping"), {})
            lists.append(d)
        for s in spaces:
            s["lists"] = [l for l in lists if l["space_id"] == s["id"]]
        sources_list = []
        for r in con.execute("SELECT * FROM sources ORDER BY id"):
            d = dict(r)
            cfg = _json_or(d.get("config"), {})
            # NO enviamos al cliente las llaves reales — solo el cred_ref (nombre)
            cfg.pop("__resolved_headers__", None)
            d["config"] = cfg
            sources_list.append(d)
        tasks = []
        for r in con.execute("SELECT * FROM tasks ORDER BY id"):
            d = dict(r)
            d["tags"] = _json_or(d.get("tags"), [])
            d["custom_values"] = _json_or(d.get("custom_values"), {})
            tasks.append(d)
        comments = [dict(r) for r in con.execute("SELECT * FROM comments ORDER BY id")]
        folders = [dict(r) for r in con.execute("SELECT * FROM folders ORDER BY id")]
        goals = [dict(r) for r in con.execute("SELECT * FROM goals ORDER BY pos,id")]
        return {
            "settings": settings, "statuses": statuses, "spaces": spaces,
            "tasks": tasks, "comments": comments, "folders": folders,
            "sources": sources_list, "goals": goals,
        }
    finally:
        con.close()


# ---------------------------------------------------------------- carpetas md

def scan_md_files(base, max_files=400):
    out = []
    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]
        for fn in files:
            if fn.lower().endswith(".md"):
                fp = os.path.join(root, fn)
                try:
                    st = os.stat(fp)
                except OSError:
                    continue
                out.append({"rel": os.path.relpath(fp, base), "path": fp,
                            "mtime": int(st.st_mtime), "size": st.st_size})
                if len(out) >= max_files:
                    out.sort(key=lambda x: -x["mtime"])
                    return out
    out.sort(key=lambda x: -x["mtime"])
    return out


CHECKBOX = re.compile(r"^\s*[-*]\s*\[\s\]\s+(.+)")


def extract_todos(files, max_per_folder=80, files_to_read=40):
    todos = []
    for f in files[:files_to_read]:
        try:
            with open(f["path"], "r", encoding="utf-8", errors="ignore") as fh:
                for i, line in enumerate(fh, 1):
                    if i > 5000:
                        break
                    m = CHECKBOX.match(line)
                    if m:
                        todos.append({"rel": f["rel"], "line": i,
                                      "text": m.group(1).strip()[:300]})
                        if len(todos) >= max_per_folder:
                            return todos
        except OSError:
            continue
    return todos


def git_info(path):
    def run(*args):
        try:
            r = subprocess.run(["git", "-C", path] + list(args),
                               capture_output=True, text=True, timeout=5)
            return r.stdout.strip() if r.returncode == 0 else None
        except Exception:
            return None

    if run("rev-parse", "--is-inside-work-tree") != "true":
        return None
    branch = run("rev-parse", "--abbrev-ref", "HEAD") or "?"
    porcelain = run("status", "--porcelain")
    changes = len([l for l in porcelain.splitlines() if l.strip()]) if porcelain is not None else 0
    ahead_raw = run("rev-list", "--count", "@{u}..HEAD")
    ahead = int(ahead_raw) if ahead_raw and ahead_raw.isdigit() else None
    return {"branch": branch, "changes": changes, "ahead": ahead}


def get_md_overview():
    con = db()
    try:
        folders = [dict(r) for r in con.execute("SELECT * FROM folders ORDER BY id")]
    finally:
        con.close()
    out = []
    for f in folders:
        base = os.path.expanduser(f["path"])
        item = {"id": f["id"], "name": f["name"] or os.path.basename(base),
                "path": base, "exists": os.path.isdir(base),
                "git": None, "recent": [], "todos": [], "md_count": 0}
        if item["exists"]:
            files = scan_md_files(base)
            item["md_count"] = len(files)
            item["recent"] = [{"rel": x["rel"], "mtime": x["mtime"]} for x in files[:10]]
            item["todos"] = extract_todos(files)
            item["git"] = git_info(base)
        out.append(item)
    return {"folders": out, "scanned_at": now()}


# ---------------------------------------------------------------- conectores externos

def _load_creds():
    """Lee ~/carmin/credentials.json. Vacío si no existe. Nunca se sube al cliente."""
    try:
        with open(CREDS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def _save_creds(creds):
    with open(CREDS_PATH, "w", encoding="utf-8") as f:
        json.dump(creds, f, indent=2)
    try:
        os.chmod(CREDS_PATH, 0o600)  # solo dueño puede leer
    except OSError:
        pass


def get_share_tokens(create=False):
    """Devuelve {'owner': '...', 'guest': '...'} desde credentials.json __share__.
    Si create=True y no existen, los genera y guarda."""
    import secrets
    creds = _load_creds()
    share = creds.get("__share__") or {}
    if create and (not share.get("owner") or not share.get("guest")):
        share = {"owner": secrets.token_urlsafe(18), "guest": secrets.token_urlsafe(18)}
        creds["__share__"] = share
        _save_creds(creds)
    return share


def role_for_token(token):
    """owner | guest | None. En modo local (sin share) todo es owner."""
    if not SHARE_MODE:
        return "owner"
    if not token:
        return None
    share = get_share_tokens()
    if token == share.get("owner"):
        return "owner"
    if token == share.get("guest"):
        return "guest"
    return None


def _expand_vars(s, creds_for_ref):
    """Reemplaza ${KEY} con el valor de creds_for_ref[KEY]. Si no existe, deja la marca."""
    if not isinstance(s, str):
        return s
    out = s
    for k, v in (creds_for_ref or {}).items():
        out = out.replace("${" + k + "}", str(v))
    return out


def _assert_safe_url(url):
    """Bloquea schemes peligrosos y hosts internos (SSRF).
    - file://, ftp://, gopher:// → rechazados (urllib los soporta por defecto).
    - 169.254.0.0/16 (metadata de AWS/GCP/Azure) → SIEMPRE bloqueado.
    - rangos privados/loopback → bloqueados en modo compartir (en local se permiten
      por si conectas un Supabase/servicio en localhost durante desarrollo)."""
    import ipaddress
    try:
        p = urlparse(url)
    except Exception:
        raise ApiError("URL inválida")
    if p.scheme not in ("http", "https"):
        raise ApiError(f"Solo URLs http/https están permitidas. Recibí scheme '{p.scheme}'.")
    host = p.hostname
    if not host:
        raise ApiError("URL inválida (sin host)")
    # Resolver todas las IPs del host y validarlas.
    try:
        infos = socket.getaddrinfo(host, None)
        ips = {info[4][0] for info in infos}
    except socket.gaierror:
        raise ApiError(f"No pude resolver el host: {host}")
    for ip_str in ips:
        try:
            ip = ipaddress.ip_address(ip_str)
        except ValueError:
            continue
        if ip.is_link_local:  # 169.254.x — metadata de cloud, SIEMPRE peligroso
            raise ApiError("Destino bloqueado (rango link-local / metadata).")
        if SHARE_MODE and (ip.is_private or ip.is_loopback or ip.is_reserved):
            raise ApiError("En modo compartir no se permite conectar a hosts internos de tu red.")


def _fetch_source(source, path, max_rows=100):
    """Hace la request HTTP a la fuente externa. Devuelve lista de dicts.

    source.config debe tener:
      - url (base)        ej. "https://xxx.supabase.co/rest/v1"
      - headers (dict)    ej. {"apikey":"${anon_key}","Authorization":"Bearer ${anon_key}"}
      - cred_ref (str)    nombre del bloque en credentials.json
    path es el sufijo: "trip_posts?visibility=eq.public&limit=20"
    """
    cfg = source["config"] if isinstance(source.get("config"), dict) else _json_or(source.get("config"), {})
    cred_ref = cfg.get("cred_ref") or ""
    creds = _load_creds().get(cred_ref, {}) if cred_ref else {}
    base = _expand_vars(cfg.get("url") or "", creds)
    headers = {k: _expand_vars(v, creds) for k, v in (cfg.get("headers") or {}).items()}
    if not base:
        raise ApiError("La fuente no tiene URL configurada")
    if source["type"] == "supabase":
        # Defaults útiles para Supabase REST
        headers.setdefault("Accept", "application/json")
        # Forzar límite si el path no lo trae
        if "limit=" not in (path or ""):
            sep = "&" if "?" in (path or "") else "?"
            path = (path or "") + f"{sep}limit={max_rows}"
    elif source["type"] == "github":
        # Defaults para la API REST de GitHub
        headers.setdefault("Accept", "application/vnd.github+json")
        headers.setdefault("X-GitHub-Api-Version", "2022-11-28")
        headers.setdefault("User-Agent", "Carmin")
        if "per_page=" not in (path or ""):
            sep = "&" if "?" in (path or "") else "?"
            path = (path or "") + f"{sep}per_page={max_rows}"
    sep = "" if base.endswith("/") or (path or "").startswith("/") else "/"
    url = base + sep + (path or "")
    _assert_safe_url(url)  # rechaza file://, gopher://, etc.
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            raw = r.read()
            data = json.loads(raw) if raw else []
    except urllib.error.HTTPError as e:
        try:
            msg = json.loads(e.read() or b"{}")
            txt = msg.get("message") or msg.get("error") or f"HTTP {e.code}"
        except Exception:
            txt = f"HTTP {e.code}"
        raise ApiError(f"La fuente respondió error: {txt}")
    except urllib.error.URLError as e:
        raise ApiError(f"No pude conectar a la fuente: {getattr(e, 'reason', e)}")
    if not isinstance(data, list):
        # Algunas APIs devuelven {data: [...]} o {items: [...]}
        for k in ("data", "items", "results", "rows"):
            if isinstance(data, dict) and isinstance(data.get(k), list):
                data = data[k]
                break
        else:
            data = []
    return data[:max_rows]


def _apply_mapping(rows, mapping):
    """Aplica el mapeo de campos a cada fila. mapping = {'title': 'name', ...}.
    Devuelve filas con keys estandarizadas: title, status, due, descr, url, tags.
    """
    out = []
    for r in rows:
        if not isinstance(r, dict):
            continue
        item = {"_raw": r}
        for ours, theirs in (mapping or {}).items():
            if not isinstance(theirs, str):
                continue
            # Soporte de path con puntos: "author.name"
            val = r
            for part in theirs.split("."):
                if isinstance(val, dict) and part in val:
                    val = val[part]
                else:
                    val = None
                    break
            item[ours] = val
        # Fallback: si no se mapeó title, intentar campos comunes
        if not item.get("title"):
            for k in ("title", "name", "subject", "heading"):
                if isinstance(r.get(k), str):
                    item["title"] = r[k]
                    break
        out.append(item)
    return out


def get_source_rows(list_id):
    """Lee la lista y trae sus tareas remotas mapeadas (read-only)."""
    con = db()
    try:
        row = con.execute("""
            SELECT l.id, l.name, l.source_id, l.source_path, l.source_mapping,
                   s.type AS source_type, s.name AS source_name, s.config AS source_config
            FROM lists l LEFT JOIN sources s ON s.id = l.source_id
            WHERE l.id=?
        """, (list_id,)).fetchone()
    finally:
        con.close()
    if not row or not row["source_id"]:
        raise ApiError("Esa lista no está conectada a una fuente")
    source = {
        "id": row["source_id"],
        "type": row["source_type"],
        "name": row["source_name"],
        "config": _json_or(row["source_config"], {}),
    }
    mapping = _json_or(row["source_mapping"], {})
    rows = _fetch_source(source, row["source_path"] or "")
    return {
        "list_id": list_id,
        "list_name": row["name"],
        "source_name": source["name"],
        "source_type": source["type"],
        "rows": _apply_mapping(rows, mapping),
        "fetched_at": now(),
    }


# ---------------------------------------------------------------- API de escritura

class ApiError(Exception):
    pass


def first_status_id(con):
    r = con.execute("SELECT id FROM statuses ORDER BY pos,id LIMIT 1").fetchone()
    if not r:
        raise ApiError("No hay estados definidos")
    return r["id"]


def status_kind(con, status_id):
    r = con.execute("SELECT kind FROM statuses WHERE id=?", (status_id,)).fetchone()
    return r["kind"] if r else "open"


def clean_tags(value):
    if isinstance(value, list):
        return json.dumps([str(t).strip()[:40] for t in value if str(t).strip()])
    return "[]"


def api_post(path, b):
    action = b.get("action", "")
    con = db()
    try:
        with con:
            if path == "/api/task":
                return _task(con, action, b)
            if path == "/api/space":
                return _space(con, action, b)
            if path == "/api/list":
                return _list(con, action, b)
            if path == "/api/status":
                return _status(con, action, b)
            if path == "/api/comment":
                return _comment(con, action, b)
            if path == "/api/folder":
                return _folder(con, action, b)
            if path == "/api/setting":
                con.execute("INSERT INTO settings(key,value) VALUES(?,?)"
                            " ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                            (str(b.get("key", "")), str(b.get("value", ""))))
                return {"ok": True}
            if path == "/api/source":
                return _source(con, action, b)
            if path == "/api/goal":
                return _goal(con, action, b)
            if path == "/api/creds":
                return _creds(action, b)
            raise ApiError("Ruta desconocida: %s" % path)
    finally:
        con.close()


def _task(con, action, b):
    if action == "create":
        title = str(b.get("title", "")).strip()
        if not title:
            raise ApiError("La tarea necesita un nombre")
        list_id = b.get("list_id")
        if not con.execute("SELECT 1 FROM lists WHERE id=?", (list_id,)).fetchone():
            raise ApiError("Esa lista no existe")
        status_id = b.get("status_id") or first_status_id(con)
        custom_vals = b.get("custom_values")
        if not isinstance(custom_vals, dict):
            custom_vals = {}
        t = now()
        con.execute(
            "INSERT INTO tasks(list_id,title,descr,status_id,priority,due,tags,custom_values,created_at,updated_at)"
            " VALUES(?,?,?,?,?,?,?,?,?,?)",
            (list_id, title[:300], str(b.get("descr", ""))[:5000], status_id,
             str(b.get("priority", "")), str(b.get("due", "")),
             clean_tags(b.get("tags", [])), json.dumps(custom_vals), t, t))
        return {"ok": True, "id": con.execute("SELECT last_insert_rowid() i").fetchone()["i"]}

    task_id = b.get("id")
    row = con.execute("SELECT * FROM tasks WHERE id=?", (task_id,)).fetchone()
    if not row:
        raise ApiError("Esa tarea ya no existe")

    if action == "update":
        allowed = {"title", "descr", "status_id", "priority", "due", "tags", "list_id"}
        sets, vals = ["updated_at=?"], [now()]
        for k in allowed:
            if k in b:
                v = b[k]
                if k == "tags":
                    v = clean_tags(v)
                if k == "title":
                    v = str(v).strip()[:300]
                    if not v:
                        raise ApiError("La tarea necesita un nombre")
                sets.append("%s=?" % k)
                vals.append(v)
        # Campos custom: merge parcial — solo actualiza las keys enviadas.
        if "custom_values" in b and isinstance(b["custom_values"], dict):
            current = _json_or(row["custom_values"], {})
            for k, v in b["custom_values"].items():
                if v is None or v == "":
                    current.pop(str(k), None)
                else:
                    current[str(k)] = v
            sets.append("custom_values=?")
            vals.append(json.dumps(current))
        if "status_id" in b:
            new_kind = status_kind(con, b["status_id"])
            old_kind = status_kind(con, row["status_id"])
            if new_kind == "done" and old_kind != "done":
                sets.append("done_at=?")
                vals.append(now())
            elif new_kind != "done" and old_kind == "done":
                sets.append("done_at=?")
                vals.append("")
        vals.append(task_id)
        con.execute("UPDATE tasks SET %s WHERE id=?" % ",".join(sets), vals)
        return {"ok": True}

    if action == "delete":
        con.execute("DELETE FROM tasks WHERE id=?", (task_id,))
        return {"ok": True}
    raise ApiError("Acción desconocida")


def _space(con, action, b):
    if action == "create":
        name = str(b.get("name", "")).strip()
        if not name:
            raise ApiError("El espacio necesita un nombre")
        pos = con.execute("SELECT COALESCE(MAX(pos)+1,0) p FROM spaces").fetchone()["p"]
        con.execute("INSERT INTO spaces(name,icon,pos) VALUES(?,?,?)",
                    (name[:60], str(b.get("icon", "📁"))[:8], pos))
        return {"ok": True, "id": con.execute("SELECT last_insert_rowid() i").fetchone()["i"]}
    if action == "update":
        if "name" in b:
            con.execute("UPDATE spaces SET name=? WHERE id=?",
                        (str(b["name"]).strip()[:60], b.get("id")))
        if "icon" in b:
            con.execute("UPDATE spaces SET icon=? WHERE id=?",
                        (str(b["icon"])[:8], b.get("id")))
        return {"ok": True}
    if action == "delete":
        con.execute("DELETE FROM spaces WHERE id=?", (b.get("id"),))
        return {"ok": True}
    raise ApiError("Acción desconocida")


VALID_FIELD_TYPES = {"text", "number", "date", "url", "checkbox", "dropdown", "currency"}


def _clean_field(f, existing_ids):
    """Normaliza un field definition. Garantiza id único, tipo válido y nombre."""
    name = str(f.get("name", "")).strip()[:40]
    if not name:
        raise ApiError("Cada campo necesita un nombre")
    ftype = str(f.get("type", "text")).strip().lower()
    if ftype not in VALID_FIELD_TYPES:
        raise ApiError(f"Tipo de campo inválido: {ftype}")
    fid = str(f.get("id") or "").strip()
    if not fid:
        # genera ID estable a partir del nombre + sufijo si choca
        import re as _re
        base = _re.sub(r"[^a-z0-9_]+", "_", name.lower()).strip("_") or "field"
        fid, n = base, 1
        while fid in existing_ids:
            n += 1
            fid = f"{base}_{n}"
    out = {"id": fid, "name": name, "type": ftype}
    if ftype == "dropdown":
        opts = f.get("options") or []
        if not isinstance(opts, list):
            opts = []
        out["options"] = [{"label": str(o.get("label", "")).strip()[:30],
                           "color": str(o.get("color", "#8B97A6"))[:9]}
                          for o in opts if isinstance(o, dict) and o.get("label")]
    if "width" in f:
        try:
            out["width"] = max(60, min(400, int(f["width"])))
        except (TypeError, ValueError):
            pass
    return out


def _list(con, action, b):
    if action == "create":
        name = str(b.get("name", "")).strip()
        if not name:
            raise ApiError("La lista necesita un nombre")
        if not con.execute("SELECT 1 FROM spaces WHERE id=?", (b.get("space_id"),)).fetchone():
            raise ApiError("Ese espacio no existe")
        pos = con.execute("SELECT COALESCE(MAX(pos)+1,0) p FROM lists WHERE space_id=?",
                          (b.get("space_id"),)).fetchone()["p"]
        con.execute("INSERT INTO lists(space_id,name,pos) VALUES(?,?,?)",
                    (b.get("space_id"), name[:60], pos))
        return {"ok": True, "id": con.execute("SELECT last_insert_rowid() i").fetchone()["i"]}
    if action == "update":
        con.execute("UPDATE lists SET name=? WHERE id=?",
                    (str(b.get("name", "")).strip()[:60], b.get("id")))
        return {"ok": True}
    if action == "set_fields":
        list_id = b.get("id")
        if not con.execute("SELECT 1 FROM lists WHERE id=?", (list_id,)).fetchone():
            raise ApiError("Esa lista no existe")
        raw = b.get("custom_fields") or []
        if not isinstance(raw, list):
            raise ApiError("custom_fields debe ser una lista")
        cleaned, ids = [], set()
        for f in raw:
            if not isinstance(f, dict):
                continue
            cf = _clean_field(f, ids)
            ids.add(cf["id"])
            cleaned.append(cf)
        con.execute("UPDATE lists SET custom_fields=? WHERE id=?",
                    (json.dumps(cleaned), list_id))
        return {"ok": True, "custom_fields": cleaned}
    if action == "delete":
        con.execute("DELETE FROM lists WHERE id=?", (b.get("id"),))
        return {"ok": True}
    raise ApiError("Acción desconocida")


def _status(con, action, b):
    if action == "create":
        name = str(b.get("name", "")).strip()
        if not name:
            raise ApiError("El estado necesita un nombre")
        pos = con.execute("SELECT COALESCE(MAX(pos)+1,0) p FROM statuses").fetchone()["p"]
        con.execute("INSERT INTO statuses(name,color,kind,pos) VALUES(?,?,?,?)",
                    (name[:40].upper(), str(b.get("color", "#8B97A6")),
                     b.get("kind", "open"), pos))
        return {"ok": True}
    if action == "update":
        sets, vals = [], []
        for k in ("name", "color", "kind"):
            if k in b:
                v = str(b[k]).strip()
                if k == "name":
                    v = v[:40].upper()
                sets.append("%s=?" % k)
                vals.append(v)
        if sets:
            vals.append(b.get("id"))
            con.execute("UPDATE statuses SET %s WHERE id=?" % ",".join(sets), vals)
        return {"ok": True}
    if action == "delete":
        rows = con.execute("SELECT id FROM statuses ORDER BY pos,id").fetchall()
        if len(rows) <= 1:
            raise ApiError("Debe quedar al menos un estado")
        sid = b.get("id")
        fallback = next(r["id"] for r in rows if r["id"] != sid)
        con.execute("UPDATE tasks SET status_id=? WHERE status_id=?", (fallback, sid))
        con.execute("DELETE FROM statuses WHERE id=?", (sid,))
        return {"ok": True}
    if action == "move":
        rows = con.execute("SELECT id,pos FROM statuses ORDER BY pos,id").fetchall()
        idx = next((i for i, r in enumerate(rows) if r["id"] == b.get("id")), None)
        j = (idx if idx is not None else 0) + int(b.get("dir", 0))
        if idx is None or j < 0 or j >= len(rows):
            return {"ok": True}
        a, c = rows[idx], rows[j]
        con.execute("UPDATE statuses SET pos=? WHERE id=?", (c["pos"], a["id"]))
        con.execute("UPDATE statuses SET pos=? WHERE id=?", (a["pos"], c["id"]))
        return {"ok": True}
    raise ApiError("Acción desconocida")


def _comment(con, action, b):
    if action == "create":
        text = str(b.get("text", "")).strip()
        if not text:
            raise ApiError("El comentario está vacío")
        author = con.execute("SELECT value FROM settings WHERE key='user_name'").fetchone()
        con.execute("INSERT INTO comments(task_id,author,text,created_at) VALUES(?,?,?,?)",
                    (b.get("task_id"), author["value"] if author else "Yo",
                     text[:2000], now()))
        return {"ok": True}
    if action == "delete":
        con.execute("DELETE FROM comments WHERE id=?", (b.get("id"),))
        return {"ok": True}
    raise ApiError("Acción desconocida")


def _folder(con, action, b):
    if action == "create":
        path = os.path.abspath(os.path.expanduser(str(b.get("path", "")).strip()))
        if not os.path.isdir(path):
            raise ApiError("No encuentro esa carpeta: %s" % path)
        name = str(b.get("name", "")).strip() or os.path.basename(path)
        con.execute("INSERT INTO folders(name,path) VALUES(?,?)", (name[:60], path))
        return {"ok": True}
    if action == "delete":
        con.execute("DELETE FROM folders WHERE id=?", (b.get("id"),))
        return {"ok": True}
    raise ApiError("Acción desconocida")


VALID_GOAL_KINDS = {"number", "currency", "percent"}


def _goal(con, action, b):
    if action == "create":
        name = str(b.get("name", "")).strip()
        if not name:
            raise ApiError("La meta necesita un nombre")
        space_id = b.get("space_id")
        if not con.execute("SELECT 1 FROM spaces WHERE id=?", (space_id,)).fetchone():
            raise ApiError("Ese espacio no existe")
        kind = str(b.get("kind", "number")).lower()
        if kind not in VALID_GOAL_KINDS:
            kind = "number"
        try:
            target = float(b.get("target") or 0)
            current = float(b.get("current") or 0)
        except (TypeError, ValueError):
            raise ApiError("target y current deben ser números")
        due = str(b.get("deadline", ""))
        if due and not DATE_RE.match(due):
            raise ApiError("deadline inválido (formato YYYY-MM-DD)")
        pos = con.execute("SELECT COALESCE(MAX(pos)+1,0) p FROM goals WHERE space_id=?",
                          (space_id,)).fetchone()["p"]
        t = now()
        con.execute(
            "INSERT INTO goals(space_id,name,kind,target,current,unit,deadline,notes,pos,created_at,updated_at)"
            " VALUES(?,?,?,?,?,?,?,?,?,?,?)",
            (space_id, name[:80], kind, target, current,
             str(b.get("unit", ""))[:20], due, str(b.get("notes", ""))[:500], pos, t, t))
        return {"ok": True, "id": con.execute("SELECT last_insert_rowid() i").fetchone()["i"]}

    gid = b.get("id")
    row = con.execute("SELECT * FROM goals WHERE id=?", (gid,)).fetchone()
    if not row:
        raise ApiError("Esa meta ya no existe")

    if action == "update":
        sets, vals = ["updated_at=?"], [now()]
        for k in ("name", "kind", "unit", "notes", "deadline"):
            if k in b:
                v = str(b[k])
                if k == "name":
                    v = v.strip()[:80]
                    if not v:
                        raise ApiError("La meta necesita un nombre")
                if k == "kind" and v.lower() not in VALID_GOAL_KINDS:
                    continue
                if k == "deadline" and v and not DATE_RE.match(v):
                    raise ApiError("deadline inválido (YYYY-MM-DD)")
                sets.append("%s=?" % k)
                vals.append(v[:500] if k == "notes" else v)
        for k in ("target", "current"):
            if k in b:
                try:
                    sets.append("%s=?" % k)
                    vals.append(float(b[k]))
                except (TypeError, ValueError):
                    raise ApiError(f"{k} debe ser un número")
        vals.append(gid)
        con.execute("UPDATE goals SET %s WHERE id=?" % ",".join(sets), vals)
        return {"ok": True}

    if action == "delete":
        con.execute("DELETE FROM goals WHERE id=?", (gid,))
        return {"ok": True}
    raise ApiError("Acción desconocida")


VALID_SOURCE_TYPES = {"supabase", "http", "github"}


def _validate_source_config(cfg):
    """Valida el config de una fuente antes de persistirla."""
    if not isinstance(cfg, dict):
        raise ApiError("config debe ser un objeto")
    url = cfg.get("url")
    if url:
        _assert_safe_url(str(url))  # rechaza file://, ftp://, etc. desde el momento de crear


def _source(con, action, b):
    if action == "create":
        name = str(b.get("name", "")).strip()
        if not name:
            raise ApiError("La fuente necesita un nombre")
        stype = str(b.get("type", "")).strip().lower()
        if stype not in VALID_SOURCE_TYPES:
            raise ApiError(f"Tipo de fuente inválido: {stype}")
        cfg = b.get("config") or {}
        _validate_source_config(cfg)
        con.execute(
            "INSERT INTO sources(name,type,config,created_at) VALUES(?,?,?,?)",
            (name[:60], stype, json.dumps(cfg), now()),
        )
        return {"ok": True, "id": con.execute("SELECT last_insert_rowid() i").fetchone()["i"]}
    if action == "update":
        sets, vals = [], []
        if "name" in b:
            sets.append("name=?"); vals.append(str(b["name"]).strip()[:60])
        if "config" in b:
            cfg = b["config"]
            _validate_source_config(cfg)
            sets.append("config=?"); vals.append(json.dumps(cfg))
        if not sets:
            return {"ok": True}
        vals.append(b.get("id"))
        con.execute("UPDATE sources SET " + ",".join(sets) + " WHERE id=?", vals)
        return {"ok": True}
    if action == "delete":
        # Antes de borrar: revisar si cred_ref de esta fuente lo usa alguien más.
        # Si no, borrar también el bloque de credentials.json.
        sid = b.get("id")
        row = con.execute("SELECT config FROM sources WHERE id=?", (sid,)).fetchone()
        cred_ref_to_clean = None
        if row:
            cfg = _json_or(row["config"], {})
            cred_ref = cfg.get("cred_ref")
            if cred_ref:
                other = con.execute(
                    "SELECT 1 FROM sources WHERE id<>? AND config LIKE ? LIMIT 1",
                    (sid, f'%"cred_ref":"{cred_ref}"%'),
                ).fetchone()
                if not other:
                    cred_ref_to_clean = cred_ref
        con.execute("DELETE FROM sources WHERE id=?", (sid,))
        if cred_ref_to_clean:
            creds = _load_creds()
            if cred_ref_to_clean in creds:
                del creds[cred_ref_to_clean]
                _save_creds(creds)
        return {"ok": True}
    if action == "connect_list":
        # Conecta una lista existente a una fuente.
        list_id = b.get("list_id")
        source_id = b.get("source_id")
        if not con.execute("SELECT 1 FROM lists WHERE id=?", (list_id,)).fetchone():
            raise ApiError("Esa lista no existe")
        if source_id and not con.execute("SELECT 1 FROM sources WHERE id=?", (source_id,)).fetchone():
            raise ApiError("Esa fuente no existe")
        mapping = b.get("mapping") or {}
        con.execute(
            "UPDATE lists SET source_id=?, source_path=?, source_mapping=? WHERE id=?",
            (source_id or None, str(b.get("path", ""))[:500], json.dumps(mapping), list_id),
        )
        return {"ok": True}
    raise ApiError("Acción desconocida")


def _creds(action, b):
    """Gestión de credenciales locales. NUNCA devuelven los valores reales al cliente,
    solo los nombres (cred_ref) y qué claves tiene cada uno."""
    creds = _load_creds()
    if action == "list":
        # __share__ guarda los tokens de compartir — nunca se expone al cliente.
        return {"creds": {ref: list(vals.keys()) for ref, vals in creds.items()
                          if ref != "__share__" and isinstance(vals, dict)}}
    if action == "set":
        ref = str(b.get("ref", "")).strip()
        values = b.get("values") or {}
        if not ref or not re.match(r"^[a-zA-Z0-9_]+$", ref):
            raise ApiError("ref inválido (usa solo letras, números y guión bajo)")
        if not isinstance(values, dict):
            raise ApiError("values debe ser un objeto")
        creds[ref] = {str(k): str(v) for k, v in values.items() if v}
        _save_creds(creds)
        return {"ok": True}
    if action == "delete":
        ref = str(b.get("ref", "")).strip()
        if ref in creds:
            del creds[ref]
            _save_creds(creds)
        return {"ok": True}
    raise ApiError("Acción desconocida")


# ---------------------------------------------------------------- servidor HTTP

MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".woff2": "font/woff2",
}


# Acciones de escritura que un invitado SÍ puede hacer (solo comentar/sugerir).
GUEST_WRITE_ALLOWED = {("/api/comment", "create")}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # silencio en consola

    def _token(self):
        # Token desde header X-Carmin-Token o query ?token=
        h = self.headers.get("X-Carmin-Token")
        if h:
            return h.strip()
        from urllib.parse import parse_qs
        return (parse_qs(urlparse(self.path).query).get("token") or [""])[0]

    def _role(self):
        return role_for_token(self._token())

    def _send(self, code, body, ctype="application/json"):
        data = body if isinstance(body, bytes) else json.dumps(body).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _file(self, rel):
        fp = os.path.normpath(os.path.join(STATIC, rel))
        if not fp.startswith(STATIC) or not os.path.isfile(fp):
            return self._send(404, {"error": "no encontrado"})
        ext = os.path.splitext(fp)[1].lower()
        with open(fp, "rb") as f:
            self._send(200, f.read(), MIME.get(ext, "application/octet-stream"))

    def do_GET(self):
        p = urlparse(self.path).path
        try:
            # Estáticos (HTML/CSS/JS) no llevan datos → sin token. La app pide token aparte.
            if p == "/":
                return self._file("index.html")
            if p.startswith("/static/"):
                return self._file(p[len("/static/"):])
            # /api/* exige token válido cuando el modo compartir está activo.
            if SHARE_MODE and not self._role():
                return self._send(401, {"error": "token requerido o inválido"})
            if p == "/api/state":
                st = get_state()
                st["viewer"] = {"role": self._role() or "owner", "share": SHARE_MODE}
                return self._send(200, st)
            if p == "/api/md":
                return self._send(200, get_md_overview())
            if p == "/api/source/fetch":
                from urllib.parse import parse_qs
                qs = parse_qs(urlparse(self.path).query)
                list_id_raw = (qs.get("list_id") or [""])[0]
                if not list_id_raw.isdigit():
                    return self._send(400, {"error": "list_id requerido"})
                try:
                    return self._send(200, get_source_rows(int(list_id_raw)))
                except ApiError as e:
                    return self._send(400, {"error": str(e)})
            if p == "/api/creds":
                # Listar refs (sin valores) — útil para la UI
                return self._send(200, _creds("list", {}))
            self._send(404, {"error": "no encontrado"})
        except BrokenPipeError:
            pass
        except Exception as e:
            self._send(500, {"error": str(e)})

    def do_POST(self):
        p = urlparse(self.path).path
        try:
            n = int(self.headers.get("Content-Length") or 0)
            body = json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return self._send(400, {"error": "JSON inválido"})
        # Control de acceso para escritura cuando se está compartiendo.
        if SHARE_MODE:
            role = self._role()
            if not role:
                return self._send(401, {"error": "token requerido o inválido"})
            if role == "guest" and (p, body.get("action")) not in GUEST_WRITE_ALLOWED:
                return self._send(403, {"error": "Modo invitado: solo lectura. Puedes comentar, no editar."})
        try:
            out = api_post(p, body)
            self._send(200, out if out is not None else {"ok": True})
        except ApiError as e:
            self._send(400, {"error": str(e)})
        except BrokenPipeError:
            pass
        except Exception as e:
            self._send(500, {"error": str(e)})


def port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("127.0.0.1", port)) == 0


def tailscale_ip():
    """IP de Tailscale (100.x.y.z) si está disponible. None si no."""
    try:
        out = subprocess.run(["tailscale", "ip", "-4"], capture_output=True, text=True, timeout=3)
        ip = out.stdout.strip().splitlines()[0] if out.stdout.strip() else ""
        return ip if ip.startswith("100.") else None
    except Exception:
        return None


def main():
    port = DEFAULT_PORT
    open_browser = "--no-browser" not in sys.argv
    if "--port" in sys.argv:
        try:
            port = int(sys.argv[sys.argv.index("--port") + 1])
        except (IndexError, ValueError):
            pass

    bind = "0.0.0.0" if SHARE_MODE else HOST  # en share escuchamos en la red (Tailscale)
    url = "http://%s:%d" % (HOST, port)
    if port_in_use(port):
        print("Carmín ya está corriendo → abriendo %s" % url)
        if open_browser:
            webbrowser.open(url)
        return

    init_db()
    server = ThreadingHTTPServer((bind, port), Handler)
    server.daemon_threads = True
    print("")
    print("  ● Carmín está listo")
    print("  → %s" % url)
    if SHARE_MODE:
        tokens = get_share_tokens(create=True)
        tsip = tailscale_ip()
        host_for_share = tsip or "<IP-de-tu-red>"
        print("")
        print("  \033[1mMODO COMPARTIR ACTIVO\033[0m (escuchando en la red)")
        print("  Tú (control total):")
        print("    http://%s:%d/?token=%s" % (host_for_share, port, tokens["owner"]))
        print("  Invitado (solo lectura + comentarios) — comparte este link:")
        print("    http://%s:%d/?token=%s" % (host_for_share, port, tokens["guest"]))
        if not tsip:
            print("")
            print("  \033[33m! No detecté Tailscale.\033[0m Instálalo en ambas computadoras")
            print("    (https://tailscale.com/download) y vuelve a correr `carmin share`.")
    print("  (deja esta ventana abierta; Ctrl+C para apagar)")
    print("")
    if open_browser and not SHARE_MODE:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Carmín apagado. ¡Hasta luego!")


if __name__ == "__main__":
    main()
