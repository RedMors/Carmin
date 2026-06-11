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
from urllib.parse import urlparse

BASE = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.join(BASE, "static")
DB_PATH = os.path.join(BASE, "data.db")
HOST = "127.0.0.1"  # solo accesible desde esta Mac (compartir en red llegará después)
DEFAULT_PORT = 4848

# Carpetas que nunca se escanean al buscar archivos .md
EXCLUDE_DIRS = {
    "node_modules", ".git", ".next", "dist", "build", "__pycache__",
    ".vercel", ".turbo", "coverage", ".cache", "vendor", ".expo", ".DS_Store",
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
  id       INTEGER PRIMARY KEY,
  space_id INTEGER NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  name     TEXT NOT NULL,
  pos      INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS tasks(
  id         INTEGER PRIMARY KEY,
  list_id    INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  descr      TEXT DEFAULT '',
  status_id  INTEGER REFERENCES statuses(id),
  priority   TEXT DEFAULT '',            -- urgente | alta | normal | baja | ''
  due        TEXT DEFAULT '',            -- YYYY-MM-DD
  tags       TEXT DEFAULT '[]',          -- JSON array
  created_at TEXT,
  updated_at TEXT,
  done_at    TEXT DEFAULT ''
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
"""


def init_db():
    con = db()
    with con:
        con.executescript(SCHEMA)
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

def get_state():
    con = db()
    try:
        settings = {r["key"]: r["value"] for r in con.execute("SELECT * FROM settings")}
        statuses = [dict(r) for r in con.execute("SELECT * FROM statuses ORDER BY pos,id")]
        spaces = [dict(r) for r in con.execute("SELECT * FROM spaces ORDER BY pos,id")]
        lists = [dict(r) for r in con.execute("SELECT * FROM lists ORDER BY pos,id")]
        for s in spaces:
            s["lists"] = [l for l in lists if l["space_id"] == s["id"]]
        tasks = []
        for r in con.execute("SELECT * FROM tasks ORDER BY id"):
            d = dict(r)
            try:
                d["tags"] = json.loads(d.get("tags") or "[]")
            except ValueError:
                d["tags"] = []
            tasks.append(d)
        comments = [dict(r) for r in con.execute("SELECT * FROM comments ORDER BY id")]
        folders = [dict(r) for r in con.execute("SELECT * FROM folders ORDER BY id")]
        return {
            "settings": settings, "statuses": statuses, "spaces": spaces,
            "tasks": tasks, "comments": comments, "folders": folders,
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
        t = now()
        con.execute(
            "INSERT INTO tasks(list_id,title,descr,status_id,priority,due,tags,created_at,updated_at)"
            " VALUES(?,?,?,?,?,?,?,?,?)",
            (list_id, title[:300], str(b.get("descr", ""))[:5000], status_id,
             str(b.get("priority", "")), str(b.get("due", "")),
             clean_tags(b.get("tags", [])), t, t))
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


# ---------------------------------------------------------------- servidor HTTP

MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".woff2": "font/woff2",
}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # silencio en consola

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
            if p == "/":
                return self._file("index.html")
            if p.startswith("/static/"):
                return self._file(p[len("/static/"):])
            if p == "/api/state":
                return self._send(200, get_state())
            if p == "/api/md":
                return self._send(200, get_md_overview())
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
        return s.connect_ex((HOST, port)) == 0


def main():
    port = DEFAULT_PORT
    open_browser = "--no-browser" not in sys.argv
    if "--port" in sys.argv:
        try:
            port = int(sys.argv[sys.argv.index("--port") + 1])
        except (IndexError, ValueError):
            pass

    url = "http://%s:%d" % (HOST, port)
    if port_in_use(port):
        print("Carmín ya está corriendo → abriendo %s" % url)
        if open_browser:
            webbrowser.open(url)
        return

    init_db()
    server = ThreadingHTTPServer((HOST, port), Handler)
    server.daemon_threads = True
    print("")
    print("  ● Carmín está listo")
    print("  → %s" % url)
    print("  (deja esta ventana abierta; Ctrl+C para apagar)")
    print("")
    if open_browser:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Carmín apagado. ¡Hasta luego!")


if __name__ == "__main__":
    main()
