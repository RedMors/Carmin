#!/usr/bin/env python3
"""carmin — gestor local estilo ClickUp. CLI + lanzador de la app web.

Diseñado para que Claude (y cualquier agente de IA) pueda colaborar con el
usuario sin entrar a la UI: consulta tareas, deja notas, cambia estados,
crea cosas — todo desde la terminal.
"""

import datetime
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import webbrowser

BASE = os.path.dirname(os.path.abspath(__file__))
HOST = "127.0.0.1"
# Permitir CARMIN_PORT por si el usuario corre la app en otro puerto.
PORT = int(os.environ.get("CARMIN_PORT") or 4848)
URL = f"http://{HOST}:{PORT}"

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
VALID_PRIOS = {"urgente", "alta", "normal", "baja", ""}

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
    """Si el servidor no está, lo arranca en background y espera a que responda.

    Si falla, lee el stderr capturado y lo muestra para que el usuario pueda
    diagnosticar (puerto ocupado, DB corrupta, Python roto, etc.).
    """
    if _server_up():
        return
    print(f"{C['dim']}Arrancando Carmín en background…{C['reset']}", file=sys.stderr)
    log_path = os.path.join(tempfile.gettempdir(), f"carmin-{PORT}.log")
    log_fh = open(log_path, "w")
    subprocess.Popen(
        [sys.executable, os.path.join(BASE, "app.py"), "--no-browser", "--port", str(PORT)],
        stdout=log_fh, stderr=subprocess.STDOUT,
        start_new_session=True,
    )
    for _ in range(40):
        time.sleep(0.15)
        if _server_up():
            return
    # No arrancó: muestra el log para diagnóstico
    try:
        log_fh.flush()
        with open(log_path) as f:
            tail = f.read().strip()
    except OSError:
        tail = ""
    msg = "No pude arrancar el servidor."
    if tail:
        msg += f" Esto es lo que dijo:\n\n{tail}"
    else:
        msg += f" Revisa el log en {log_path}."
    _fail(msg)


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
    """Igual que _find_task: si hay varias coincidencias, las muestra y sale."""
    lists = [l for sp in s['spaces'] for l in sp['lists']]
    if not query:
        return lists[0] if lists else None
    if str(query).isdigit():
        for l in lists:
            if l['id'] == int(query):
                return l
        _fail(f"No hay lista con ID {query}")
    q = str(query).lower()
    # Match exacto primero — si "Mac" coincide exacto, no es ambiguo aunque haya "Mac local"
    exact = [l for l in lists if q == l['name'].lower()]
    if exact:
        return exact[0]
    matches = [l for l in lists if q in l['name'].lower()]
    if not matches:
        _fail(f"Lista no encontrada: '{query}'. Usa `carmin proyectos` para ver las disponibles.")
    if len(matches) == 1:
        return matches[0]
    print(f"{C['yellow']}!{C['reset']} '{query}' coincide con varias listas. Sé más específico o usa el ID:")
    for l in matches[:10]:
        print(f"  {l['id']:>4}  {l['name']}")
    sys.exit(1)


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
    fallback_kind = 'open'  # si una tarea tiene status_id huérfano

    def kind_of(t):
        return by_id.get(t['status_id'], {}).get('kind', fallback_kind)

    if only_open:
        tasks = [t for t in tasks if kind_of(t) != 'done']
    if today_only or overdue:
        today = datetime.date.today().isoformat()
        if today_only:
            tasks = [t for t in tasks if t['due'] == today]
        if overdue:
            tasks = [t for t in tasks
                     if t['due'] and t['due'] < today and kind_of(t) != 'done']

    if not tasks:
        print(f"{C['dim']}Sin tareas que coincidan.{C['reset']}")
        return

    lists_by_id = {l['id']: l for sp in s['spaces'] for l in sp['lists']}
    kind_color = {'open': C['dim'], 'active': C['blue'], 'done': C['green']}
    unknown_status = {'name': '?', 'kind': fallback_kind}
    print(f"{C['bold']}{'ID':>4}  {'ESTADO':<13}  {'TAREA':<52}  {'LISTA':<14}  {'FECHA':<10}{C['reset']}")
    print(f"{C['dim']}{'─' * 4}  {'─' * 13}  {'─' * 52}  {'─' * 14}  {'─' * 10}{C['reset']}")
    for t in sorted(tasks, key=lambda x: (kind_of(x) == 'done', x['id'])):
        st = by_id.get(t['status_id'], unknown_status)
        l = lists_by_id.get(t['list_id'])
        st_str = f"{kind_color.get(st['kind'], C['dim'])}{st['name'][:13]:<13}{C['reset']}"
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

    # Validar prioridad para evitar strings que la UI no sabe pintar.
    if prio and prio not in VALID_PRIOS:
        valid = ', '.join(p for p in VALID_PRIOS if p)
        _fail(f"Prioridad inválida '{prio}'. Usa una de: {valid}")
    # Validar fecha — la UI espera YYYY-MM-DD; otro formato rompe el chip silenciosamente.
    if due and not DATE_RE.match(due):
        _fail(f"Fecha inválida '{due}'. Formato esperado: YYYY-MM-DD (ej. 2026-06-15)")

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
    by_id = {st['id']: st for st in s['statuses']}
    print(f"{C['bold']}Espacios y listas:{C['reset']}")
    for sp in s['spaces']:
        print(f"  {sp.get('icon', '📁')} {C['bold']}{sp['name']}{C['reset']}")
        for l in sp['lists']:
            n_open = sum(1 for t in s['tasks']
                         if t['list_id'] == l['id']
                         and by_id.get(t['status_id'], {}).get('kind') != 'done')
            print(f"      · {l['name']:<20} {C['dim']}{n_open} abiertas{C['reset']}")


def _fmt_goal_value(v, kind, unit):
    if kind == 'currency':
        return f"${v:,.0f}"
    if kind == 'percent':
        return f"{v:g}%"
    s = f"{v:,.0f}" if float(v).is_integer() else f"{v:,.2f}"
    return f"{s} {unit}".strip()


def _find_space(s, query):
    spaces = s['spaces']
    if str(query).isdigit():
        for sp in spaces:
            if sp['id'] == int(query):
                return sp
    q = str(query).lower()
    matches = [sp for sp in spaces if q in sp['name'].lower()]
    if not matches:
        names = ', '.join(sp['name'] for sp in spaces)
        _fail(f"Espacio no encontrado: '{query}'. Disponibles: {names}")
    return matches[0]


def _find_goal(s, query):
    goals = s.get('goals', [])
    if not goals:
        _fail("No hay metas todavía. Crea una con `carmin meta`.")
    if str(query).isdigit():
        for g in goals:
            if g['id'] == int(query):
                return g
    q = str(query).lower()
    matches = [g for g in goals if q in g['name'].lower()]
    if not matches:
        _fail(f"Ninguna meta coincide con '{query}'")
    if len(matches) == 1:
        return matches[0]
    print(f"{C['yellow']}!{C['reset']} '{query}' coincide con varias metas:")
    for g in matches[:10]:
        print(f"  {g['id']:>4}  {g['name']}")
    sys.exit(1)


def cmd_metas(_args):
    _ensure_server()
    s = _state()
    goals = s.get('goals', [])
    if not goals:
        print(f"{C['dim']}Sin metas. Crea una: carmin meta \"Revenue Q3\" --espacio Akatrek --target 5000 --kind currency{C['reset']}")
        return
    space_name = {sp['id']: sp['name'] for sp in s['spaces']}
    print(f"{C['bold']}Metas:{C['reset']}")
    for g in goals:
        pct = (g['current'] / g['target'] * 100) if g['target'] else 0
        bar_len = 24
        filled = max(0, min(bar_len, round(pct / 100 * bar_len)))
        color = C['green'] if pct >= 100 else (C['blue'] if pct >= 50 else C['yellow'])
        bar = color + '█' * filled + C['dim'] + '░' * (bar_len - filled) + C['reset']
        cur = _fmt_goal_value(g['current'], g['kind'], g['unit'])
        tgt = _fmt_goal_value(g['target'], g['kind'], g['unit'])
        due = f" · vence {g['deadline']}" if g['deadline'] else ""
        print(f"  {C['bold']}#{g['id']} {g['name']}{C['reset']}  {C['dim']}({space_name.get(g['space_id'], '?')}){C['reset']}")
        print(f"    {bar} {color}{pct:.0f}%{C['reset']}  {cur} / {tgt}{C['dim']}{due}{C['reset']}")


def cmd_meta(args):
    if not args or args[0].startswith('--'):
        _fail('Uso: carmin meta "Nombre" --espacio Akatrek --target 5000 [--actual 0] [--kind currency|number|percent] [--unit USD] [--due 2026-09-30]')
    _ensure_server()
    name = args[0]
    s = _state()
    space_q = _arg_value(args[1:], '--espacio') or _arg_value(args[1:], '--space')
    if isinstance(space_q, list):
        space_q = space_q[0]
    sp = _find_space(s, space_q) if space_q else (s['spaces'][0] if s['spaces'] else None)
    if not sp:
        _fail("No hay espacios. Crea uno desde la app primero.")
    target = _arg_value(args[1:], '--target') or _arg_value(args[1:], '--meta') or '0'
    actual = _arg_value(args[1:], '--actual') or _arg_value(args[1:], '--current') or '0'
    kind = _arg_value(args[1:], '--kind') or 'number'
    unit = _arg_value(args[1:], '--unit') or ''
    due = _arg_value(args[1:], '--due') or _arg_value(args[1:], '--deadline') or ''
    if due and not DATE_RE.match(due):
        _fail(f"Fecha inválida '{due}'. Formato: YYYY-MM-DD")
    r = _api("POST", "/api/goal", {
        "action": "create", "space_id": sp['id'], "name": name,
        "kind": kind, "target": target, "current": actual, "unit": unit, "deadline": due,
    })
    _ok(f"Meta #{r['id']} creada en {sp['name']}: {name}")


def cmd_meta_set(args):
    if len(args) < 2:
        _fail('Uso: carmin meta-set "buscar meta" <valor>   (actualiza el valor actual)')
    _ensure_server()
    s = _state()
    g = _find_goal(s, args[0])
    try:
        val = float(args[1])
    except ValueError:
        _fail(f"'{args[1]}' no es un número")
    _api("POST", "/api/goal", {"action": "update", "id": g['id'], "current": val})
    pct = (val / g['target'] * 100) if g['target'] else 0
    _ok(f"#{g['id']} {g['name']} → {_fmt_goal_value(val, g['kind'], g['unit'])} ({pct:.0f}% de la meta)")


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

{C['dim']}Metas del proyecto:{C['reset']}
  carmin metas                                       ver progreso de todas
  carmin meta "Revenue Q3" --espacio Akatrek --target 5000 --kind currency --unit USD --due 2026-09-30
  carmin meta-set "Revenue Q3" 1250                  actualizar el valor actual

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
    'metas': cmd_metas, 'goals': cmd_metas,
    'meta': cmd_meta, 'goal': cmd_meta,
    'meta-set': cmd_meta_set, 'meta-update': cmd_meta_set, 'avance': cmd_meta_set,
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
