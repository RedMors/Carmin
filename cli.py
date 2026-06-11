#!/usr/bin/env python3
"""carmin — gestor local estilo ClickUp. CLI + lanzador de la app web.

Diseñado para que Claude (y cualquier agente de IA) pueda colaborar con el
usuario sin entrar a la UI: consulta tareas, deja notas, cambia estados,
crea cosas — todo desde la terminal.
"""

import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser

BASE = os.path.dirname(os.path.abspath(__file__))
HOST = "127.0.0.1"
PORT = 4848
URL = f"http://{HOST}:{PORT}"

C = {
    'reset': '\033[0m', 'dim': '\033[2m', 'bold': '\033[1m',
    'red': '\033[91m', 'green': '\033[92m', 'yellow': '\033[93m',
    'blue': '\033[94m', 'magenta': '\033[95m', 'cyan': '\033[96m',
}


def _fail(msg):
    print(f"{C['red']}✗{C['reset']} {msg}", file=sys.stderr)
    sys.exit(1)


def _ok(msg):
    print(f"{C['green']}✓{C['reset']} {msg}")


def _server_up():
    try:
        urllib.request.urlopen(f"{URL}/api/state", timeout=0.4)
        return True
    except (urllib.error.URLError, ConnectionRefusedError, TimeoutError, OSError):
        return False


def _ensure_server():
    """Si el servidor no está, lo arranca en background y espera a que responda."""
    if _server_up():
        return
    print(f"{C['dim']}Arrancando Carmín en background…{C['reset']}", file=sys.stderr)
    subprocess.Popen(
        [sys.executable, os.path.join(BASE, "app.py"), "--no-browser"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        start_new_session=True,
    )
    for _ in range(40):
        time.sleep(0.15)
        if _server_up():
            return
    _fail("No pude arrancar el servidor. Prueba `carmin open` y mira el error.")


def _api(method, path, body=None):
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(
        f"{URL}{path}", data=data, method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        r = urllib.request.urlopen(req, timeout=4)
        return json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read() or b"{}")
        except Exception:
            body = {}
        _fail(body.get('error', f"HTTP {e.code}"))
    except urllib.error.URLError:
        _fail("No me puedo conectar a Carmín. Prueba `carmin open`.")


def _state():
    return _api("GET", "/api/state")


# ------------------------------------------------------------------ búsquedas

def _find_task(s, query):
    """Tarea por ID (numérico) o por substring del título."""
    tasks = s['tasks']
    if str(query).isdigit():
        for t in tasks:
            if t['id'] == int(query):
                return t
        _fail(f"No hay tarea con ID {query}")
    q = str(query).lower()
    matches = [t for t in tasks if q in t['title'].lower()]
    if not matches:
        _fail(f"Ninguna tarea coincide con '{query}'")
    if len(matches) == 1:
        return matches[0]
    # Preferir abiertas si hay coincidencia única entre las abiertas
    by_id = {st['id']: st for st in s['statuses']}
    open_matches = [t for t in matches if by_id[t['status_id']]['kind'] != 'done']
    if len(open_matches) == 1:
        return open_matches[0]
    print(f"{C['yellow']}!{C['reset']} '{query}' coincide con varias tareas. Usa más palabras o el ID:")
    for t in matches[:10]:
        st = by_id.get(t['status_id'], {}).get('name', '?')
        print(f"  {t['id']:>4}  [{st}]  {t['title']}")
    sys.exit(1)


def _find_status(s, query):
    statuses = s['statuses']
    if str(query).isdigit():
        for st in statuses:
            if st['id'] == int(query):
                return st
        _fail(f"No hay estado con ID {query}")
    q = str(query).lower()
    matches = [st for st in statuses if q in st['name'].lower()]
    if not matches:
        names = ', '.join(st['name'] for st in statuses)
        _fail(f"Estado no encontrado: '{query}'. Disponibles: {names}")
    return matches[0]


def _find_list(s, query):
    lists = [l for sp in s['spaces'] for l in sp['lists']]
    if not query:
        return lists[0] if lists else None
    if str(query).isdigit():
        for l in lists:
            if l['id'] == int(query):
                return l
    q = str(query).lower()
    matches = [l for l in lists if q in l['name'].lower()]
    if not matches:
        _fail(f"Lista no encontrada: '{query}'. Usa `carmin ls` para ver las disponibles.")
    return matches[0]


# ------------------------------------------------------------------ argumentos

def _arg_value(args, key):
    """Devuelve el valor de --key. Si se repite (ej. --tag), devuelve lista."""
    out = []
    i = 0
    while i < len(args):
        if args[i] == key and i + 1 < len(args):
            out.append(args[i + 1])
            i += 2
        else:
            i += 1
    if not out:
        return None
    return out if len(out) > 1 else out[0]


def _has_flag(args, *flags):
    return any(f in args for f in flags)


# ------------------------------------------------------------------ comandos

def cmd_open(_args):
    _ensure_server()
    webbrowser.open(URL)
    print(f"  ● Carmín → {URL}")


def cmd_stop(_args):
    if not _server_up():
        print("Carmín ya está apagado.")
        return
    try:
        out = subprocess.run(
            ['lsof', f'-iTCP:{PORT}', '-sTCP:LISTEN', '-Pn', '-t'],
            capture_output=True, text=True, timeout=2,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        _fail("No tengo `lsof` para encontrar el proceso. Apágalo a mano.")
    pids = [int(p) for p in out.stdout.split() if p.strip().isdigit()]
    if not pids:
        _fail(f"No encuentro el proceso que escucha en :{PORT}.")
    for pid in pids:
        try:
            os.kill(pid, 15)
        except ProcessLookupError:
            pass
    _ok("Carmín apagado.")


def cmd_ls(args):
    _ensure_server()
    s = _state()
    project = _arg_value(args, '--proyecto') or _arg_value(args, '--lista')
    only_open = _has_flag(args, '--abiertas', '-a')
    today_only = _has_flag(args, '--hoy')
    overdue = _has_flag(args, '--vencidas')

    tasks = s['tasks']
    if project:
        list_obj = _find_list(s, project if isinstance(project, str) else project[0])
        tasks = [t for t in tasks if t['list_id'] == list_obj['id']]

    by_id = {st['id']: st for st in s['statuses']}
    if only_open:
        tasks = [t for t in tasks if by_id[t['status_id']]['kind'] != 'done']
    if today_only:
        import datetime
        today = datetime.date.today().isoformat()
        tasks = [t for t in tasks if t['due'] == today]
    if overdue:
        import datetime
        today = datetime.date.today().isoformat()
        tasks = [t for t in tasks
                 if t['due'] and t['due'] < today and by_id[t['status_id']]['kind'] != 'done']

    if not tasks:
        print(f"{C['dim']}Sin tareas que coincidan.{C['reset']}")
        return

    lists_by_id = {l['id']: l for sp in s['spaces'] for l in sp['lists']}
    kind_color = {'open': C['dim'], 'active': C['blue'], 'done': C['green']}
    print(f"{C['bold']}{'ID':>4}  {'ESTADO':<13}  {'TAREA':<52}  {'LISTA':<14}  {'FECHA':<10}{C['reset']}")
    print(f"{C['dim']}{'─' * 4}  {'─' * 13}  {'─' * 52}  {'─' * 14}  {'─' * 10}{C['reset']}")
    for t in sorted(tasks, key=lambda x: (by_id[x['status_id']]['kind'] == 'done', x['id'])):
        st = by_id[t['status_id']]
        l = lists_by_id.get(t['list_id'])
        st_str = f"{kind_color[st['kind']]}{st['name'][:13]:<13}{C['reset']}"
        title = t['title'][:52]
        if st['kind'] == 'done':
            title = f"{C['dim']}{title}{C['reset']}"
        list_str = (l['name'][:14] if l else '')
        prio_marks = {'urgente': f"{C['red']}!{C['reset']}", 'alta': f"{C['yellow']}↑{C['reset']}"}
        mark = prio_marks.get(t['priority'], ' ')
        print(f"{t['id']:>4}{mark} {st_str}  {title:<52}  {list_str:<14}  {t['due'] or '':<10}")


def cmd_info(args):
    if not args:
        _fail("Uso: carmin info \"buscar tarea\"")
    _ensure_server()
    s = _state()
    t = _find_task(s, args[0])
    st = next((x for x in s['statuses'] if x['id'] == t['status_id']), None)
    l = next((x for sp in s['spaces'] for x in sp['lists'] if x['id'] == t['list_id']), None)
    cmts = [c for c in s['comments'] if c['task_id'] == t['id']]
    print(f"\n  {C['bold']}#{t['id']}  {t['title']}{C['reset']}")
    print(f"  Estado:    {st['name'] if st else '?'}")
    print(f"  Lista:     {l['name'] if l else '?'}")
    print(f"  Prioridad: {t['priority'] or '—'}")
    print(f"  Fecha:     {t['due'] or '—'}")
    print(f"  Tags:      {', '.join(t['tags']) if t['tags'] else '—'}")
    print(f"  Creada:    {t.get('created_at', '')[:16]}")
    if t.get('done_at'):
        print(f"  Hecha:     {t['done_at'][:16]}")
    if t['descr']:
        print(f"\n  {C['dim']}Descripción:{C['reset']}\n  {t['descr']}")
    if cmts:
        print(f"\n  {C['dim']}Comentarios:{C['reset']}")
        for c in cmts:
            print(f"  · [{c.get('author') or '?'} · {c['created_at'][:16]}] {c['text']}")
    print()


def cmd_nueva(args):
    if not args or args[0].startswith('--'):
        _fail('Uso: carmin nueva "título" [--proyecto X] [--prio alta] [--due YYYY-MM-DD] [--tag X]')
    _ensure_server()
    title = args[0]
    s = _state()
    proj = _arg_value(args[1:], '--proyecto') or _arg_value(args[1:], '--lista')
    prio = _arg_value(args[1:], '--prio') or _arg_value(args[1:], '--prioridad') or ''
    due = _arg_value(args[1:], '--due') or _arg_value(args[1:], '--fecha') or ''
    tag_raw = _arg_value(args[1:], '--tag') or _arg_value(args[1:], '--etiqueta')
    tags = tag_raw if isinstance(tag_raw, list) else ([tag_raw] if tag_raw else [])

    if isinstance(proj, list):
        proj = proj[0]
    list_obj = _find_list(s, proj)
    if not list_obj:
        _fail("No hay listas todavía. Crea un espacio desde la app primero.")

    r = _api("POST", "/api/task", {
        "action": "create", "title": title, "list_id": list_obj['id'],
        "priority": prio, "due": due, "tags": tags,
    })
    _ok(f"#{r['id']} creada en {list_obj['name']}: {title}")


def cmd_done(args):
    if not args:
        _fail('Uso: carmin done "buscar tarea"')
    _ensure_server()
    s = _state()
    t = _find_task(s, args[0])
    done_st = next((st for st in s['statuses'] if st['kind'] == 'done'), None)
    if not done_st:
        _fail("No hay un estado tipo 'hecho' configurado en Carmín.")
    _api("POST", "/api/task", {"action": "update", "id": t['id'], "status_id": done_st['id']})
    _ok(f"#{t['id']} {t['title']} → {done_st['name']}")


def cmd_status(args):
    if len(args) < 2:
        _fail('Uso: carmin status "buscar tarea" "nombre estado"')
    _ensure_server()
    s = _state()
    t = _find_task(s, args[0])
    st = _find_status(s, args[1])
    _api("POST", "/api/task", {"action": "update", "id": t['id'], "status_id": st['id']})
    _ok(f"#{t['id']} {t['title']} → {st['name']}")


def cmd_nota(args):
    if len(args) < 2:
        _fail('Uso: carmin nota "buscar tarea" "texto del comentario"')
    _ensure_server()
    s = _state()
    t = _find_task(s, args[0])
    _api("POST", "/api/comment", {"action": "create", "task_id": t['id'], "text": args[1]})
    _ok(f"Nota agregada a #{t['id']}: {t['title']}")


def cmd_estados(_args):
    _ensure_server()
    s = _state()
    print(f"{C['bold']}Estados configurados:{C['reset']}")
    for st in s['statuses']:
        print(f"  · {st['name']:<14} {C['dim']}({st['kind']}){C['reset']}")


def cmd_proyectos(_args):
    _ensure_server()
    s = _state()
    print(f"{C['bold']}Espacios y listas:{C['reset']}")
    for sp in s['spaces']:
        print(f"  {sp.get('icon', '📁')} {C['bold']}{sp['name']}{C['reset']}")
        for l in sp['lists']:
            n_open = sum(1 for t in s['tasks']
                         if t['list_id'] == l['id']
                         and next(st for st in s['statuses'] if st['id'] == t['status_id'])['kind'] != 'done')
            print(f"      · {l['name']:<20} {C['dim']}{n_open} abiertas{C['reset']}")


def cmd_ayuda(_args):
    print(f"""
{C['bold']}● Carmín{C['reset']} — gestor local estilo ClickUp

{C['dim']}Abrir la app:{C['reset']}
  carmin                          arranca y abre en el navegador
  carmin stop                     apaga el servidor

{C['dim']}Ver:{C['reset']}
  carmin ls                                todas las tareas
  carmin ls --proyecto Trip-App            de una lista
  carmin ls --abiertas --hoy               filtros (también --vencidas)
  carmin info "buscar"                     detalles de una tarea
  carmin estados                           estados configurados
  carmin proyectos                         espacios y listas

{C['dim']}Crear y actualizar:{C['reset']}
  carmin nueva "Revisar PR" --proyecto Trip-App --prio alta --due 2026-06-15
  carmin status "PR quickwins" "EN CURSO"
  carmin done "PR quickwins"
  carmin nota "PR quickwins" "Mergeé a main, falta verificar en prod"

{C['dim']}Para Claude:{C['reset']} ver CLAUDE.md en este directorio
""")


COMMANDS = {
    'open': cmd_open, '': cmd_open,
    'stop': cmd_stop,
    'ls': cmd_ls, 'list': cmd_ls,
    'info': cmd_info,
    'nueva': cmd_nueva, 'new': cmd_nueva, 'add': cmd_nueva,
    'done': cmd_done, 'hecha': cmd_done,
    'status': cmd_status, 'estado': cmd_status,
    'nota': cmd_nota, 'note': cmd_nota, 'comment': cmd_nota,
    'estados': cmd_estados,
    'proyectos': cmd_proyectos, 'projects': cmd_proyectos,
    'ayuda': cmd_ayuda, 'help': cmd_ayuda, '-h': cmd_ayuda, '--help': cmd_ayuda,
}


def main():
    args = sys.argv[1:]
    cmd = (args[0] if args else '').lower()
    rest = args[1:]
    # Si el primer "arg" parece flag del server (ej. --port), abre la app
    if cmd.startswith('--'):
        cmd_open(args)
        return
    handler = COMMANDS.get(cmd)
    if not handler:
        print(f"{C['red']}Comando no reconocido: {cmd}{C['reset']}", file=sys.stderr)
        print(f"Usa `carmin ayuda` para ver los comandos disponibles.", file=sys.stderr)
        sys.exit(1)
    handler(rest)


if __name__ == '__main__':
    main()
