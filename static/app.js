/* Carmín — lógica de la interfaz. Sin frameworks: JS puro. */

/* ---------------------------------------------------------- iconos */
const I = {
  home: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
  all: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  folder: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  list: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
  board: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="18" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="12" rx="1.5"/></svg>',
  cal: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  gear: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/></svg>',
  flag: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 21V4a1 1 0 0 1 1-1h11.6a.5.5 0 0 1 .4.8L15 8.5l3 4.7a.5.5 0 0 1-.42.8H7v7Z"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  chevron: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  comment: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.7A8 8 0 1 1 21 12Z"/></svg>',
  file: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/></svg>',
  branch: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-5 3.5-9 5"/></svg>',
  sun: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M4.3 4.3l1.4 1.4M18.3 18.3l1.4 1.4M2.5 12h2M19.5 12h2M4.3 19.7l1.4-1.4M18.3 5.7l1.4-1.4"/></svg>',
  moon: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>',
  dots: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6"/></svg>',
  chart: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/></svg>',
  edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  graph: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.6 7.8 10.4 16M16.4 7.8 13.6 16M8 6h8"/></svg>',
  sidebar: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>',
};

/* ---------------------------------------------------------- estado global */
let S = null;            // estado del servidor
let MDdata = null;       // resumen de carpetas md
let mdLoading = false;
let route = { type: 'inicio', listId: null, tab: 'lista' };
let openTaskId = null;
let q = '';              // búsqueda
let calY, calM;          // calendario

const PRIOS = [['urgente', 'Urgente'], ['alta', 'Alta'], ['normal', 'Normal'], ['baja', 'Baja'], ['', 'Sin prioridad']];
const PRIO_ORDER = { urgente: 0, alta: 1, normal: 2, baja: 3, '': 4 };
const SWATCHES = ['#E0314F', '#EC4899', '#8B5CF6', '#4E9CF5', '#34C77B', '#F5A524'];

/* ---------------------------------------------------------- utilidades */
const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function relTime(unix) {
  const s = Math.max(0, Date.now() / 1000 - unix);
  if (s < 90) return 'hace 1 min';
  if (s < 3600) return 'hace ' + Math.round(s / 60) + ' min';
  if (s < 86400 * 2) return 'hace ' + Math.round(s / 3600) + ' h';
  if (s < 86400 * 14) return 'hace ' + Math.round(s / 86400) + ' días';
  return new Date(unix * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
function fmtDue(due) {
  const [y, m, d] = due.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
function toast(msg, kind) {
  const t = document.createElement('div');
  t.className = 'toast' + (kind === 'err' ? ' err' : '');
  t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 2600);
}

/* ---------------------------------------------------------- token / modo compartir */
// Si llegamos con ?token= (link de invitación), lo guardamos y limpiamos la URL.
(function bootstrapToken() {
  const u = new URL(location.href);
  const t = u.searchParams.get('token');
  if (t) {
    localStorage.setItem('carmin_token', t);
    u.searchParams.delete('token');
    history.replaceState(null, '', u.pathname + u.search);
  }
})();
function authToken() { return localStorage.getItem('carmin_token') || ''; }
function withToken(headers) {
  const t = authToken();
  return t ? { ...headers, 'X-Carmin-Token': t } : (headers || {});
}
let IS_GUEST = false; // se setea tras loadState según S.viewer.role

/* ---------------------------------------------------------- API */
async function api(path, body) {
  const r = await fetch(path, { method: 'POST', headers: withToken({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { toast(data.error || 'Algo salió mal', 'err'); throw new Error(data.error || 'api'); }
  return data;
}
async function loadState() {
  const r = await fetch('/api/state', { headers: withToken({}) });
  if (r.status === 401) { showTokenGate(); throw new Error('token'); }
  S = await r.json();
  IS_GUEST = !!(S.viewer && S.viewer.role === 'guest');
  document.body.classList.toggle('guest-mode', IS_GUEST);
  applyTheme();
}
async function loadMD(force) {
  if (MDdata && !force) return MDdata;
  mdLoading = true;
  try { MDdata = await (await fetch('/api/md', { headers: withToken({}) })).json(); }
  finally { mdLoading = false; }
  return MDdata;
}
function showTokenGate() {
  document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;font-family:var(--font);color:var(--text)">
    <div style="max-width:380px;padding:32px">
      <div style="font-size:40px;margin-bottom:12px">🔒</div>
      <h1 style="font-size:22px;font-weight:900;margin-bottom:8px">Necesitas una invitación</h1>
      <p style="color:var(--muted);line-height:1.5">Este tablero de Carmín está compartido en modo privado. Pídele al dueño el link con tu token de acceso.</p>
    </div></div>`;
}
async function refresh() { await loadState(); render(); }

/* ---------------------------------------------------------- helpers de datos */
const statuses = () => S.statuses;
const statusById = (id) => S.statuses.find(s => s.id === id) || S.statuses[0];
const listById = (id) => { for (const sp of S.spaces) { const l = sp.lists.find(x => x.id === id); if (l) return l; } return null; };
const spaceOfList = (id) => S.spaces.find(sp => sp.lists.some(l => l.id === id));
const itemNoun = (l) => (l && l.item_noun && l.item_noun.trim()) ? l.item_noun.trim() : 'tarea';
const routeNoun = () => route.type === 'list' ? itemNoun(listById(route.listId)) : 'tarea';
const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
const taskById = (id) => S.tasks.find(t => t.id === id);
const commentsOf = (id) => S.comments.filter(c => c.task_id === id);
const attachmentsOf = (id) => (S.attachments || []).filter(a => a.task_id === id);
const linksOf = (id) => (S.links || []).filter(l => l.src_id === id || l.dst_id === id);
const isDone = (t) => statusById(t.status_id).kind === 'done';
const enabledViews = () => { try { const v = JSON.parse(S.settings.views || '[]'); return v.length ? v : ['lista']; } catch (e) { return ['lista', 'tablero', 'calendario']; } };

function currentTasks() {
  let ts = S.tasks;
  if (route.type === 'list') ts = ts.filter(t => t.list_id === route.listId);
  if (q) {
    const k = q.toLowerCase();
    ts = ts.filter(t => (t.title + ' ' + t.descr + ' ' + t.tags.join(' ')).toLowerCase().includes(k));
  }
  return ts;
}
function sortTasks(ts) {
  return [...ts].sort((a, b) =>
    (PRIO_ORDER[a.priority] ?? 4) - (PRIO_ORDER[b.priority] ?? 4) ||
    (a.due || '9999').localeCompare(b.due || '9999') || a.id - b.id);
}

/* ---------------------------------------------------------- tema */
function applyTheme() {
  document.documentElement.dataset.theme = S.settings.theme || 'dark';
  document.documentElement.style.setProperty('--accent', S.settings.accent || '#E0314F');
}
async function setTheme(t) {
  // Aplica visual primero (sin parpadeo), luego guarda en el servidor.
  S.settings.theme = t;
  applyTheme();
  refreshSettingsActive();
  await api('/api/setting', { key: 'theme', value: t });
}
async function setAccent(c) {
  S.settings.accent = c;
  applyTheme();
  refreshSettingsActive();
  await api('/api/setting', { key: 'accent', value: c });
}
function quickTheme() {
  setTheme((S.settings.theme || 'dark') === 'dark' ? 'light' : 'dark');
  renderSidebar(); // actualiza el icono sol/luna del footer
}
// Actualiza los marcadores "active" en el modal sin redibujar
function refreshSettingsActive() {
  const theme = S.settings.theme || 'dark';
  const accent = (S.settings.accent || '#E0314F').toLowerCase();
  document.querySelectorAll('.theme-card').forEach(el => {
    el.classList.toggle('active', el.dataset.theme === theme);
  });
  document.querySelectorAll('.swatch').forEach(el => {
    el.classList.toggle('active', (el.dataset.color || '').toLowerCase() === accent);
  });
}

/* ---------------------------------------------------------- navegación */
function nav(type, listId) {
  route = { type, listId: listId || null, tab: enabledViews()[0] || 'lista' };
  q = '';
  render();
}
function setTab(tab) { route.tab = tab; render(); }
function searchInput(el) { q = el.value; renderMain(); }

const expKey = 'carmin_expanded';
function expandedSet() { try { return new Set(JSON.parse(localStorage.getItem(expKey) || '[]')); } catch (e) { return new Set(); } }
function toggleSpace(id) {
  const s = expandedSet();
  s.has(id) ? s.delete(id) : s.add(id);
  localStorage.setItem(expKey, JSON.stringify([...s]));
  renderSidebar();
}

/* ---------------------------------------------------------- render raíz */
function render() { renderSidebar(); renderTopbar(); renderMain(); if (openTaskId) renderPanel(); }

function renderSidebar() {
  const exp = expandedSet();
  const name = S.settings.user_name || 'Yo';
  let html = `
    <div class="logo"><span class="dot"></span> Carmín</div>
    ${IS_GUEST
      ? `<div class="guest-banner">👁 Invitado · solo lectura</div>`
      : `<button class="create-btn" onclick="createMenu(event)">${I.plus} Crear <span class="caret">${I.chevron}</span></button>`}
    <button class="nav-item ${route.type === 'inicio' ? 'active' : ''}" onclick="nav('inicio')">${I.home} Inicio</button>
    <button class="nav-item ${route.type === 'all' ? 'active' : ''}" onclick="nav('all')">${I.all} Todas las tareas</button>
    <button class="nav-item ${route.type === 'md' ? 'active' : ''}" onclick="nav('md')">${I.folder} Proyectos</button>
    <div class="nav-section">Espacios ${IS_GUEST ? '' : `<button onclick="addSpacePrompt()" title="Nuevo espacio">${I.plus}</button>`}</div>`;
  for (const sp of S.spaces) {
    const open = exp.has(sp.id);
    html += `
      <div class="space-row">
        <button class="nav-item" onclick="toggleSpace(${sp.id})">
          <span style="display:inline-flex;transition:transform .15s;transform:rotate(${open ? 90 : 0}deg)">${I.chevron}</span>
          <span class="space-icon">${esc(sp.icon || '📁')}</span> ${esc(sp.name)}
        </button>
        <button class="icon-btn" style="width:30px;height:30px" onclick="spaceMenu(event,${sp.id})">${I.dots}</button>
      </div>`;
    if (open) {
      for (const l of sp.lists) {
        const connected = !!l.source_id;
        const n = connected ? '' : (S.tasks.filter(t => t.list_id === l.id && !isDone(t)).length || '');
        html += `<button class="nav-item list-item ${route.type === 'list' && route.listId === l.id ? 'active' : ''}" onclick="nav('list',${l.id})">
          ${l.icon ? esc(l.icon) + ' ' : ''}${esc(l.name)}${connected ? ' <span class="list-connected-badge">⚡</span>' : ''} <span class="spacer"></span><span class="faint" style="font-size:11.5px">${n}</span></button>`;
      }
      html += `<button class="nav-item list-item faint" style="font-size:12.5px" onclick="addListPrompt(${sp.id})">${I.plus} Nueva lista</button>`;
    }
  }
  html += `
    <div class="sidebar-foot">
      <div class="who"><span class="avatar">${esc(name[0] || 'Y').toUpperCase()}</span> ${esc(name)}</div>
      <button class="icon-btn" onclick="quickTheme()" title="Cambiar tema">${(S.settings.theme || 'dark') === 'dark' ? I.sun : I.moon}</button>
      <button class="icon-btn" onclick="openSettings()" title="Ajustes">${I.gear}</button>
    </div>`;
  $('#sidebar').innerHTML = html;
}

function renderTopbar() {
  let crumb = '';
  if (route.type === 'inicio') crumb = 'Inicio';
  else if (route.type === 'all') crumb = 'Todas las tareas';
  else if (route.type === 'md') crumb = 'Proyectos';
  else if (route.type === 'space-panel') {
    const sp = S.spaces.find(s => s.id === route.spaceId);
    crumb = sp ? `${esc(sp.icon || '📁')} ${esc(sp.name)} <span class="sep">/</span> Panel` : 'Panel';
  }
  else if (route.type === 'list') {
    const l = listById(route.listId), sp = l && spaceOfList(l.id);
    const ln = l ? `${l.icon ? esc(l.icon) + ' ' : ''}${esc(l.name)}` : 'Lista';
    crumb = l && sp
      ? `${esc(sp.icon || '📁')} ${esc(sp.name)} <span class="sep">/</span> ${ln}`
      : ln;
  }
  const tabsViews = enabledViews();
  // En listas conectadas a fuentes externas, los tabs Lista/Tablero/Calendario/Tabla
  // no aplican: los datos son read-only y tienen su propia vista. Ocultamos los tabs.
  const isConnected = route.type === 'list' && listById(route.listId)?.source_id;
  const showTabs = (route.type === 'list' || route.type === 'all') && !isConnected;
  const tabIcons = { lista: I.list, tablero: I.board, calendario: I.cal, tabla: I.all, panel: I.chart, grafo: I.graph, documento: I.file };
  const tabNames = { lista: 'Lista', tablero: 'Tablero', calendario: 'Calendario', tabla: 'Tabla', panel: 'Panel', grafo: 'Grafo', documento: 'Documento' };

  const noun = route.type === 'list' ? itemNoun(listById(route.listId)) : 'tarea';
  const showConfig = route.type === 'list' && !isConnected && !IS_GUEST;
  let html = `<div class="topbar-row">
    <button class="icon-btn topbar-toggle" onclick="toggleSidebar()" title="Mostrar/ocultar panel lateral">${I.sidebar}</button>
    <div class="crumb">${crumb}</div>
    <div class="top-spacer"></div>
    ${showTabs ? `<div class="search">${I.search}<input placeholder="Buscar tareas…" value="${esc(q)}" oninput="searchInput(this)"></div>` : ''}
    ${showConfig ? `<button class="btn btn-soft" onclick="openCustomFieldsEditor(${route.listId})" title="Configurar tipo y columnas de esta lista">${I.gear} Configurar</button>` : ''}
    <button class="btn btn-primary" onclick="newTaskModal()">${I.plus} Crear ${esc(noun)}</button>
  </div>`;
  if (showTabs) {
    html += `<div class="topbar-row" style="min-height:auto">
      <div class="tabs">
        ${tabsViews.map(v =>
          `<button class="tab ${route.tab === v ? 'active' : ''}" onclick="setTab('${v}')">${tabIcons[v]} ${tabNames[v]}</button>`).join('')}
        <button class="tab tab-add" onclick="openAddViewMenu(event)" title="Agregar vista">${I.plus} Vista</button>
      </div>
    </div>`;
  }
  const tb = $('#topbar');
  tb.className = showTabs ? '' : 'no-tabs';
  tb.innerHTML = html;
}

function renderMain() {
  if (route.type === 'inicio') return viewInicio();
  if (route.type === 'space-panel') return viewPanel();
  if (route.type === 'md') return viewMD();
  // Lista conectada a fuente externa → render distinto, read-only.
  if (route.type === 'list') {
    const l = listById(route.listId);
    if (l && l.source_id) return viewSourceList(l);
  }
  if (route.tab === 'tablero') return viewBoard();
  if (route.tab === 'calendario') return viewCalendar();
  if (route.tab === 'tabla') return viewTable();
  if (route.tab === 'panel') return viewPanel();
  if (route.tab === 'grafo') return viewGraph();
  if (route.tab === 'documento') return viewDocumento();
  return viewList();
}

/* ---------------------------------------------------------- metas (goals) */
function goalsForRoute() {
  const all = S.goals || [];
  if (route.type === 'space-panel') return all.filter(g => g.space_id === route.spaceId);
  if (route.type === 'list') {
    const sp = spaceOfList(route.listId);
    return sp ? all.filter(g => g.space_id === sp.id) : [];
  }
  return all; // vista "all" → todas
}
function panelSpace() {
  if (route.type === 'space-panel') return S.spaces.find(s => s.id === route.spaceId);
  if (route.type === 'list') return spaceOfList(route.listId);
  return null;
}
function fmtGoalValue(v, kind, unit) {
  if (kind === 'currency') return '$' + Number(v).toLocaleString('es-ES', { maximumFractionDigits: 0 });
  if (kind === 'percent') return (+v) + '%';
  const n = Number(v);
  const s = Number.isInteger(n) ? n.toLocaleString('es-ES') : n.toLocaleString('es-ES', { maximumFractionDigits: 2 });
  return unit ? `${s} ${unit}` : s;
}
function goalStatus(g) {
  const pct = g.target ? (g.current / g.target * 100) : 0;
  if (pct >= 100) return { key: 'done', label: '✓ Cumplida', color: '#34C77B', pct: 100 };
  const today = todayStr();
  if (g.deadline) {
    if (g.deadline < today) return { key: 'overdue', label: 'Vencida', color: '#E5484D', pct };
    // progreso esperado según tiempo transcurrido
    const created = (g.created_at || '').slice(0, 10) || today;
    const totalDays = daysBetween(created, g.deadline);
    const elapsed = daysBetween(created, today);
    const expectedPct = totalDays > 0 ? Math.min(100, elapsed / totalDays * 100) : 0;
    if (pct >= expectedPct - 5) return { key: 'ontrack', label: 'En camino', color: '#34C77B', pct };
    return { key: 'behind', label: 'Atrasada', color: '#F5A524', pct };
  }
  return { key: 'progress', label: 'En progreso', color: '#4E9CF5', pct };
}
function daysBetween(a, b) {
  const da = new Date(a + 'T00:00:00'), db = new Date(b + 'T00:00:00');
  return Math.max(0, Math.round((db - da) / 86400000));
}

function viewPanel() {
  const goals = goalsForRoute();
  const sp = panelSpace();
  let html = `<div class="panel-head">
    <div>
      <div class="view-title">Panel${sp ? ' · ' + esc(sp.name) : ''}</div>
      <div class="view-sub">Las metas de tu proyecto y qué tan cerca estás de cada una.</div>
    </div>
    <button class="btn btn-primary" onclick="newGoalModal(${sp ? sp.id : 'null'})">${I.plus} Nueva meta</button>
  </div>`;
  if (!goals.length) {
    html += emptyState('🎯', 'Aún no hay metas en este proyecto',
      'Define una: revenue, usuarios, reservas, lo que estés persiguiendo. Claude puede actualizarlas mientras trabajan.');
    $('#main').innerHTML = html;
    return;
  }
  html += '<div class="goals-grid">';
  for (const g of goals) {
    const st = goalStatus(g);
    const pctShown = Math.round(st.pct);
    html += `<div class="goal-card" onclick="editGoalModal(${g.id})">
      <div class="goal-top">
        <div class="goal-name">${esc(g.name)}</div>
        <span class="goal-status" style="background:color-mix(in srgb, ${st.color} 16%, transparent);color:${st.color}">${st.label}</span>
      </div>
      <div class="goal-numbers">
        <span class="goal-current" style="color:${st.color}">${esc(fmtGoalValue(g.current, g.kind, g.unit))}</span>
        <span class="goal-target">/ ${esc(fmtGoalValue(g.target, g.kind, g.unit))}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${Math.min(100, st.pct)}%;background:${st.color}"></div></div>
      <div class="goal-foot">
        <span style="font-weight:800;color:${st.color}">${pctShown}%</span>
        ${g.deadline ? `<span class="faint">vence ${fmtDue(g.deadline)}</span>` : '<span class="faint">sin fecha</span>'}
      </div>
      ${g.notes ? `<div class="goal-notes faint">${esc(g.notes)}</div>` : ''}
    </div>`;
  }
  html += '</div>';
  $('#main').innerHTML = html;
}

function newGoalModal(spaceId) {
  const spaces = S.spaces;
  if (!spaces.length) { toast('Crea primero un espacio', 'err'); return; }
  const sel = spaceId || (route.type === 'list' ? (spaceOfList(route.listId) || {}).id : spaces[0].id) || spaces[0].id;
  showModal(`
    <h2>Nueva meta</h2>
    <div class="sec"><input type="text" id="g-name" placeholder="Ej: Revenue Q3, Usuarios registrados…"></div>
    <div class="sec" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div><h4>Proyecto</h4>
        <select id="g-space" class="cf-input">${spaces.map(s => `<option value="${s.id}" ${s.id === sel ? 'selected' : ''}>${esc(s.icon || '')} ${esc(s.name)}</option>`).join('')}</select>
      </div>
      <div><h4>Tipo</h4>
        <select id="g-kind" class="cf-input" onchange="document.getElementById('g-unit').style.display=this.value==='number'?'block':'none'">
          <option value="number">Número (usuarios, reservas…)</option>
          <option value="currency">Dinero ($)</option>
          <option value="percent">Porcentaje (%)</option>
        </select>
      </div>
    </div>
    <div class="sec" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div><h4>Meta (objetivo)</h4><input type="number" step="any" id="g-target" placeholder="5000"></div>
      <div><h4>Actual</h4><input type="number" step="any" id="g-current" value="0"></div>
      <div><h4 id="g-unit-label">Unidad</h4><input type="text" id="g-unit" placeholder="usuarios"></div>
    </div>
    <div class="sec"><h4>Fecha límite (opcional)</h4><input type="date" id="g-due" class="cf-input"></div>
    <div class="sec"><h4>Nota (opcional)</h4><input type="text" id="g-notes" placeholder="Contexto o cómo se mide"></div>
    <div style="display:flex;justify-content:flex-end;gap:10px">
      <button class="btn btn-soft" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="createGoal()">${I.plus} Crear meta</button>
    </div>`);
  setTimeout(() => $('#g-name')?.focus(), 60);
}
async function createGoal() {
  const name = $('#g-name').value.trim();
  if (!name) { toast('Ponle un nombre a la meta', 'err'); return; }
  await api('/api/goal', {
    action: 'create', space_id: Number($('#g-space').value), name,
    kind: $('#g-kind').value, target: $('#g-target').value || 0,
    current: $('#g-current').value || 0, unit: $('#g-unit').value.trim(),
    deadline: $('#g-due').value, notes: $('#g-notes').value.trim(),
  });
  closeModal();
  toast('Meta creada ✓');
  await refresh();
}

function editGoalModal(goalId) {
  const g = (S.goals || []).find(x => x.id === goalId);
  if (!g) return;
  showModal(`
    <h2>Editar meta</h2>
    <div class="sec"><input type="text" id="g-name" value="${esc(g.name)}"></div>
    <div class="sec" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div><h4>Meta</h4><input type="number" step="any" id="g-target" value="${g.target}"></div>
      <div><h4>Actual</h4><input type="number" step="any" id="g-current" value="${g.current}"></div>
      <div><h4>Unidad</h4><input type="text" id="g-unit" value="${esc(g.unit)}"></div>
    </div>
    <div class="sec" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div><h4>Tipo</h4>
        <select id="g-kind" class="cf-input">
          ${['number', 'currency', 'percent'].map(k => `<option value="${k}" ${g.kind === k ? 'selected' : ''}>${k === 'number' ? 'Número' : k === 'currency' ? 'Dinero' : 'Porcentaje'}</option>`).join('')}
        </select>
      </div>
      <div><h4>Fecha límite</h4><input type="date" id="g-due" class="cf-input" value="${esc(g.deadline)}"></div>
    </div>
    <div class="sec"><h4>Nota</h4><input type="text" id="g-notes" value="${esc(g.notes || '')}"></div>
    <div style="display:flex;justify-content:space-between;gap:10px">
      <button class="btn btn-danger" onclick="deleteGoal(${g.id})">${I.trash} Eliminar</button>
      <div style="display:flex;gap:10px">
        <button class="btn btn-soft" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="saveGoal(${g.id})">Guardar</button>
      </div>
    </div>`);
}
async function saveGoal(id) {
  const name = $('#g-name').value.trim();
  if (!name) { toast('La meta necesita un nombre', 'err'); return; }
  await api('/api/goal', {
    action: 'update', id, name, kind: $('#g-kind').value,
    target: $('#g-target').value || 0, current: $('#g-current').value || 0,
    unit: $('#g-unit').value.trim(), deadline: $('#g-due').value, notes: $('#g-notes').value.trim(),
  });
  closeModal();
  toast('Meta actualizada ✓');
  await refresh();
}
async function deleteGoal(id) {
  if (!await uiConfirm({ title: '¿Eliminar esta meta?', message: 'Esto no se puede deshacer.', okText: 'Eliminar', danger: true })) return;
  await api('/api/goal', { action: 'delete', id });
  closeModal();
  toast('Meta eliminada');
  await refresh();
}

/* ---------------------------------------------------------- vista: lista conectada (read-only) */
const _srcCache = {}; // { list_id: { rows, error, fetchedAt } }
async function fetchSourceList(listId, force) {
  const cached = _srcCache[listId];
  if (!force && cached && Date.now() - cached.fetchedAt < 30000) return cached;
  try {
    const r = await fetch('/api/source/fetch?list_id=' + listId, { headers: withToken({}) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'error');
    _srcCache[listId] = { rows: d.rows || [], source_name: d.source_name, source_type: d.source_type, fetchedAt: Date.now() };
  } catch (e) {
    _srcCache[listId] = { error: e.message || 'No se pudo cargar', fetchedAt: Date.now() };
  }
  return _srcCache[listId];
}

function viewSourceList(l) {
  const data = _srcCache[l.id];
  if (!data) {
    $('#main').innerHTML = `<div class="src-banner">${srcBadge(null)} Cargando datos…</div>` +
      '<div class="skeleton" style="margin:20px 0"></div>'.repeat(5);
    fetchSourceList(l.id).then(() => { if (listById(route.listId) === l) viewSourceList(l); });
    return;
  }
  let html = `<div class="src-banner">
    ${srcBadge(data.source_type)} <strong>${esc(data.source_name || 'Fuente externa')}</strong>
    <span class="faint">· solo lectura · actualizado ${esc(new Date(data.fetchedAt).toLocaleTimeString('es-ES'))}</span>
    <span class="spacer"></span>
    <button class="btn btn-soft" onclick="reloadSource(${l.id})">${I.refresh} Refrescar</button>
    <button class="btn btn-soft" onclick="editSourceConnection(${l.id})">${I.edit} Editar</button>
  </div>`;
  if (data.error) {
    html += emptyState('⚠️', 'No pude leer la fuente', esc(data.error));
    $('#main').innerHTML = html;
    return;
  }
  if (!data.rows.length) {
    html += emptyState('📭', 'La fuente no devolvió filas', 'Revisa el query o el mapeo.');
    $('#main').innerHTML = html;
    return;
  }
  // Tabla simple con columnas según mapeo
  html += `<div class="src-table">
    <div class="src-head">
      <span>#</span>
      <span>Título</span>
      <span>Estado</span>
      <span>Resto</span>
    </div>`;
  data.rows.forEach((r, i) => {
    const extras = Object.entries(r._raw || {}).filter(([k]) => !['id', 'title', 'name', 'status', 'stage'].includes(k)).slice(0, 4);
    html += `<div class="src-row" onclick="openSourceRow(${l.id},${i})">
      <span class="faint">${i + 1}</span>
      <span class="src-title">${esc(r.title || '(sin título)')}</span>
      <span>${r.status ? `<span class="chip">${esc(String(r.status))}</span>` : '<span class="placeholder">—</span>'}</span>
      <span class="src-extras faint">${extras.map(([k, v]) => `<span><strong>${esc(k)}:</strong> ${esc(String(v).slice(0, 40))}</span>`).join(' · ')}</span>
    </div>`;
  });
  html += '</div>';
  $('#main').innerHTML = html;
}

function srcBadge(type) {
  const colors = { supabase: '#3ECF8E', http: '#4E9CF5', github: '#A78BFA' };
  const c = colors[type] || '#8B97A6';
  const label = type === 'supabase' ? 'Supabase' : (type === 'http' ? 'HTTP' : (type === 'github' ? 'GitHub' : 'Externa'));
  return `<span class="src-badge" style="background:color-mix(in srgb, ${c} 18%, transparent);color:${c}">⚡ ${label}</span>`;
}

async function reloadSource(listId) {
  delete _srcCache[listId];
  const l = listById(listId);
  if (l) viewSourceList(l);
  await fetchSourceList(listId, true);
  if (listById(route.listId)?.id === listId) viewSourceList(listById(listId));
}

function openSourceRow(listId, idx) {
  const data = _srcCache[listId];
  const r = data?.rows[idx];
  if (!r) return;
  const raw = r._raw || {};
  const fields = Object.entries(raw).map(([k, v]) =>
    `<div class="tp-row"><span class="tp-label">${esc(k)}</span><div class="tp-value" style="word-break:break-all">${
      typeof v === 'object' ? `<pre style="margin:0;font-size:11px;color:var(--muted)">${esc(JSON.stringify(v, null, 2))}</pre>` : esc(String(v))
    }</div></div>`).join('');
  showModal(`
    <h2>${esc(r.title || 'Fila')}</h2>
    <div class="faint" style="font-size:12px;margin-bottom:var(--space-3)">Solo lectura — los cambios se hacen en la fuente original.</div>
    <div>${fields}</div>
    <div style="display:flex;justify-content:flex-end;margin-top:var(--space-4)">
      <button class="btn btn-primary" onclick="closeModal()">Cerrar</button>
    </div>`);
}

function editSourceConnection(listId) {
  const l = listById(listId);
  if (!l || !l.source_id) { toast('Esta lista no está conectada', 'err'); return; }
  const source = (S.sources || []).find(s => s.id === l.source_id);
  const mapping = l.source_mapping || {};
  showModal(`
    <h2>Editar conexión</h2>
    <div class="faint" style="font-size:13px;margin-bottom:var(--space-4)">
      Lista <strong>${esc(l.name)}</strong> conectada a <strong>${esc(source ? source.name : '?')}</strong> (${esc(source ? source.type : '?')}).
      Cambia el query o el mapeo sin perder la conexión.
    </div>
    <div class="sec">
      <h4>Query / Path</h4>
      <input type="text" id="es-path" value="${esc(l.source_path || '')}">
      <div class="faint" style="font-size:12px;margin-top:4px">${source && source.type === 'supabase' ? 'Sintaxis PostgREST. Ej: <code>trip_posts?visibility=eq.public&limit=20</code>' : 'Path adicional o query string.'}</div>
    </div>
    <div class="sec">
      <h4>Mapeo de campos</h4>
      <div style="display:grid;grid-template-columns:90px 1fr;gap:8px;align-items:center">
        <span class="faint" style="font-size:12px">Título</span>
        <input type="text" id="es-map-title" value="${esc(mapping.title || 'title')}">
        <span class="faint" style="font-size:12px">Estado</span>
        <input type="text" id="es-map-status" value="${esc(mapping.status || 'status')}">
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <button class="btn btn-danger" onclick="disconnectSource(${listId})" title="Quitar la conexión, dejar lista vacía">${I.x} Desconectar</button>
      <div style="display:flex;gap:10px">
        <button class="btn btn-soft" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="saveSourceEdit(${listId})">Guardar cambios</button>
      </div>
    </div>`);
}

async function saveSourceEdit(listId) {
  const path = $('#es-path').value.trim();
  const mapping = {
    title: $('#es-map-title').value.trim() || 'title',
    status: $('#es-map-status').value.trim() || 'status',
  };
  const l = listById(listId);
  if (!l) return;
  await api('/api/source', { action: 'connect_list', list_id: listId, source_id: l.source_id, path, mapping });
  closeModal();
  delete _srcCache[listId];
  toast('Conexión actualizada ✓');
  await refresh();
}

async function disconnectSource(listId) {
  if (!await uiConfirm({ title: '¿Desconectar fuente?', message: 'La fuente queda guardada, pero esta lista vuelve a ser local y vacía.', okText: 'Desconectar', danger: true })) return;
  await api('/api/source', { action: 'connect_list', list_id: listId, source_id: null, path: '', mapping: {} });
  closeModal();
  delete _srcCache[listId];
  toast('Lista desconectada');
  await refresh();
}

/* ---------------------------------------------------------- helpers de campos custom */
function customFieldsForRoute() {
  // Campos visibles para la ruta actual. Lista → los de esa lista. All → vacío (heterogéneo).
  if (route.type !== 'list') return [];
  const l = listById(route.listId);
  return (l && Array.isArray(l.custom_fields)) ? l.custom_fields : [];
}
function renderCustomCell(field, value) {
  const v = value;
  if (v === undefined || v === null || v === '') return `<span class="placeholder">—</span>`;
  switch (field.type) {
    case 'checkbox':
      return v ? `<span class="cf-bool cf-true">✓</span>` : `<span class="cf-bool cf-false">·</span>`;
    case 'dropdown': {
      const opt = (field.options || []).find(o => o.label === v);
      const color = opt ? opt.color : '#8B97A6';
      return `<span class="chip" style="background:color-mix(in srgb, ${color} 18%, transparent);color:${color};font-weight:800">${esc(String(v))}</span>`;
    }
    case 'number':
    case 'currency': {
      const n = Number(v);
      if (Number.isNaN(n)) return `<span class="placeholder">—</span>`;
      return `<span>${field.type === 'currency' ? '$' : ''}${n.toLocaleString('es-ES')}</span>`;
    }
    case 'date':
      return `<span class="chip">${esc(String(v))}</span>`;
    case 'url':
      return `<a href="${esc(String(v))}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="cf-url">${esc(shortenUrl(String(v)))}</a>`;
    default:
      return esc(String(v));
  }
}
function shortenUrl(u) {
  try { const x = new URL(u); return x.host + (x.pathname === '/' ? '' : x.pathname); } catch (e) { return u.length > 30 ? u.slice(0, 30) + '…' : u; }
}
function renderCustomEditor(field, value, onChange) {
  // Devuelve HTML para editar el valor en el panel de tarea
  const safeVal = (value === undefined || value === null) ? '' : value;
  const fid = field.id;
  switch (field.type) {
    case 'checkbox':
      return `<input type="checkbox" ${safeVal ? 'checked' : ''} ${onChange('this.checked')} style="width:18px;height:18px;accent-color:var(--accent);cursor:pointer">`;
    case 'dropdown': {
      const opts = (field.options || []).map(o =>
        `<option value="${esc(o.label)}" ${o.label === safeVal ? 'selected' : ''}>${esc(o.label)}</option>`).join('');
      return `<select ${onChange('this.value')} class="cf-input">
        <option value="">—</option>${opts}
      </select>`;
    }
    case 'number':
    case 'currency':
      return `<input type="number" step="any" value="${esc(safeVal === '' ? '' : String(safeVal))}" ${onChange('this.value ? Number(this.value) : ""')} class="cf-input">`;
    case 'date':
      return `<input type="date" value="${esc(String(safeVal))}" ${onChange('this.value')} class="cf-input">`;
    case 'url':
      return `<input type="url" value="${esc(String(safeVal))}" placeholder="https://…" ${onChange('this.value')} class="cf-input">`;
    default:
      return `<input type="text" value="${esc(String(safeVal))}" ${onChange('this.value')} class="cf-input">`;
  }
}

/* ---------------------------------------------------------- piezas de tarea */
function prioFlag(t, withLabel) {
  if (!t.priority) return `<span class="flag empty" title="Sin prioridad">${I.flag}</span>`;
  return `<span class="flag ${t.priority}" title="Prioridad: ${t.priority}">${I.flag}${withLabel ? ' ' + t.priority : ''}</span>`;
}
function dueCell(t) {
  if (!t.due) return `<span class="placeholder">— Vacío —</span>`;
  return boardDueChip(t);
}
function boardDueChip(t) {
  if (!t.due) return '';
  const today = todayStr();
  const cls = isDone(t) ? '' : (t.due < today ? ' due-late' : (t.due === today ? ' due-today' : ''));
  const label = t.due === today ? 'Hoy' : fmtDue(t.due);
  return `<span class="chip${cls}">${label}</span>`;
}
function tagChips(t) { return t.tags.map(tg => `<span class="chip tag">${esc(tg)}</span>`).join(''); }
function commentChip(t) {
  const n = commentsOf(t.id).length;
  return n ? `<span class="chip">${I.comment}${n}</span>` : '';
}
function listChip(t) {
  if (route.type === 'list') return '';
  const l = listById(t.list_id);
  return l ? `<span class="chip">${esc(l.name)}</span>` : '';
}
function statusDot(st) {
  const kind = st.kind;
  const cls = kind === 'done' ? 'full' : '';
  return `<span class="status-dot ${cls}" style="color:${st.color}" title="${esc(st.name)}"></span>`;
}

/* Fila compacta para Inicio (sin grid de columnas) */
function homeTaskRow(t) {
  const st = statusById(t.status_id);
  const l = listById(t.list_id);
  return `<div class="home-row ${isDone(t) ? 'done' : ''}" onclick="openTask(${t.id})">
    <span onclick="event.stopPropagation();statusMenu(event,${t.id})">${statusDot(st)}</span>
    <span class="home-title">${esc(t.title)}</span>
    <span class="home-meta">${l ? `<span class="chip">${esc(l.name)}</span>` : ''}${boardDueChip(t)}${prioFlag(t)}</span>
  </div>`;
}

/* ---------------------------------------------------------- vista: lista (tabla) */
function viewList() {
  const ts = currentTasks();
  if (!ts.length && q) { $('#main').innerHTML = emptyState('🔍', 'Nada coincide con tu búsqueda', 'Prueba con otras palabras'); return; }

  // Mostrar columna "Lista" solo en vistas que mezclan listas (all)
  const showListCol = route.type !== 'list';
  let html = `<div class="list-table ${showListCol ? 'with-list' : ''}">
    <div class="col-head-row">
      <span></span>
      <span>Nombre</span>
      ${showListCol ? '<span>Lista</span>' : ''}
      <span>Fecha límite</span>
      <span>Prioridad</span>
      <span>Estado</span>
      <span class="center" title="Comentarios">${I.comment}</span>
    </div>`;
  for (const st of statuses()) {
    const group = sortTasks(ts.filter(t => t.status_id === st.id));
    html += `<div class="group">
      <div class="group-bar" style="border-top-color:${st.color}">
        <span class="pill" style="background:${st.color}">${esc(st.name)}</span>
        <span class="group-count">${group.length}</span>
        <span class="group-actions">
          <button class="icon-btn" style="width:24px;height:24px" onclick="quickAddFocus(${st.id})" title="Añadir aquí">${I.plus}</button>
        </span>
      </div>
      ${group.map(t => taskTableRow(t, showListCol)).join('')}
      ${quickAddRow(st.id, showListCol)}
    </div>`;
  }
  html += '</div>';
  $('#main').innerHTML = html;
}

function taskTableRow(t, showListCol) {
  const st = statusById(t.status_id);
  const l = listById(t.list_id);
  const cmts = commentsOf(t.id).length;
  return `<div class="task-row ${isDone(t) ? 'done' : ''}" onclick="openTask(${t.id})">
    <span onclick="event.stopPropagation();statusMenu(event,${t.id})">${statusDot(st)}</span>
    <span class="task-title">${esc(t.title)} <span class="tags">${tagChips(t)}</span></span>
    ${showListCol ? `<span class="task-cell">${l ? esc(l.name) : ''}</span>` : ''}
    <span class="task-cell">${dueCell(t)}</span>
    <span class="task-cell" onclick="event.stopPropagation();prioMenu(event,${t.id})">${prioFlag(t, true)}</span>
    <span class="task-cell"><span class="status-pill" style="background:${st.color}">${esc(st.name)}</span></span>
    <span class="task-cell center">${cmts ? `<span class="chip">${I.comment}${cmts}</span>` : `<span class="placeholder">${I.comment}</span>`}</span>
  </div>`;
}

function quickAddRow(statusId, showListCol) {
  const listId = route.type === 'list' ? route.listId : (S.spaces[0] && S.spaces[0].lists[0] ? S.spaces[0].lists[0].id : null);
  if (!listId) return '';
  const noun = route.type === 'list' ? itemNoun(listById(route.listId)) : 'tarea';
  return `<div class="quick-add-row" data-status="${statusId}">${I.plus}
    <input placeholder="+ Añadir ${esc(noun)}" onkeydown="qaKey(event,${listId},${statusId})"></div>`;
}

/* ---------------------------------------------------------- vista: tabla (spreadsheet) */
function viewTable() {
  const ts = currentTasks();
  if (!ts.length && q) { $('#main').innerHTML = emptyState('🔍', 'Nada coincide con tu búsqueda', 'Prueba con otras palabras'); return; }
  const fields = customFieldsForRoute();
  const showListCol = route.type !== 'list';
  // Botón para abrir editor de columnas (solo en vista de una lista)
  const editCols = route.type === 'list'
    ? `<button class="btn btn-soft" style="margin-bottom:12px" onclick="openCustomFieldsEditor(${route.listId})">${I.edit} Columnas (${fields.length})</button>`
    : '';

  // Construir grid columns dinámicamente
  const widthFor = (f) => (f.width || 130) + 'px';
  const customColsWidth = fields.map(widthFor).join(' ');
  const gridCols = `24px minmax(180px,1fr) ${showListCol ? '120px ' : ''}110px 100px 120px 44px ${customColsWidth}`;

  let html = `${editCols}<div class="table-view" style="--cols:${gridCols}">
    <div class="tv-head">
      <span></span>
      <span>Nombre</span>
      ${showListCol ? '<span>Lista</span>' : ''}
      <span>Fecha</span>
      <span>Prio.</span>
      <span>Estado</span>
      <span class="center" title="Comentarios">${I.comment}</span>
      ${fields.map(f => `<span title="${esc(f.name)}">${esc(f.name)}</span>`).join('')}
    </div>`;
  for (const t of sortTasks(ts)) {
    html += taskTableV(t, showListCol, fields);
  }
  // Quick add al final, en la primera columna (sin importar status)
  if (route.type === 'list') {
    html += `<div class="tv-row tv-add">
      <span></span>
      <input placeholder="+ Añadir ${esc(itemNoun(listById(route.listId)))}" onkeydown="qaKey(event,${route.listId},null)">
    </div>`;
  }
  html += '</div>';
  $('#main').innerHTML = html;
}

function taskTableV(t, showListCol, fields) {
  const st = statusById(t.status_id);
  const l = listById(t.list_id);
  const cmts = commentsOf(t.id).length;
  const cv = t.custom_values || {};
  return `<div class="tv-row ${isDone(t) ? 'done' : ''}" onclick="openTask(${t.id})">
    <span onclick="event.stopPropagation();statusMenu(event,${t.id})">${statusDot(st)}</span>
    <span class="tv-cell tv-title">${esc(t.title)} ${tagChips(t)}</span>
    ${showListCol ? `<span class="tv-cell">${l ? esc(l.name) : ''}</span>` : ''}
    <span class="tv-cell">${dueCell(t)}</span>
    <span class="tv-cell" onclick="event.stopPropagation();prioMenu(event,${t.id})">${prioFlag(t, true)}</span>
    <span class="tv-cell"><span class="status-pill" style="background:${st.color}">${esc(st.name)}</span></span>
    <span class="tv-cell center">${cmts ? `<span class="chip">${I.comment}${cmts}</span>` : `<span class="placeholder">${I.comment}</span>`}</span>
    ${fields.map(f => `<span class="tv-cell">${renderCustomCell(f, cv[f.id])}</span>`).join('')}
  </div>`;
}
function quickAddFocus(statusId) {
  const row = document.querySelector(`.quick-add-row[data-status="${statusId}"] input`);
  if (row) row.focus();
}
async function qaKey(ev, listId, statusId) {
  if (ev.key !== 'Enter') return;
  const v = ev.target.value.trim();
  if (!v) return;
  ev.target.value = '';
  await api('/api/task', { action: 'create', title: v, list_id: listId, status_id: statusId });
  toast('Tarea creada ✓');
  await refresh();
}

/* ---------------------------------------------------------- vista: tablero */
function viewBoard() {
  const ts = currentTasks();
  let html = '<div class="board">';
  for (const st of statuses()) {
    const group = sortTasks(ts.filter(t => t.status_id === st.id));
    html += `<div class="col" data-status="${st.id}" ondragover="allowDrop(event)" ondragleave="this.classList.remove('dragover')" ondrop="boardDrop(event,${st.id})">
      <div class="col-head"><span class="status-pill" style="background:${st.color}">${esc(st.name)}</span>
      <span class="group-count">${group.length}</span></div>
      ${group.map(t => `
        <div class="card ${isDone(t) ? 'done' : ''}" draggable="true" ondragstart="dragStart(event,${t.id})" ondragend="dragEnd(event)" onclick="openTask(${t.id})">
          <div class="card-title">${esc(t.title)}</div>
          <div class="card-meta">${listChip(t)}${tagChips(t)}${commentChip(t)}${boardDueChip(t)}${prioFlag(t)}</div>
        </div>`).join('')}
      ${quickAddRow(st.id)}
    </div>`;
  }
  html += '</div>';
  $('#main').innerHTML = html;
}
function dragStart(ev, id) { ev.dataTransfer.setData('text/plain', String(id)); ev.target.classList.add('dragging'); }
function dragEnd(ev) { ev.target.classList.remove('dragging'); }
function allowDrop(ev) { ev.preventDefault(); ev.currentTarget.classList.add('dragover'); }
async function boardDrop(ev, statusId) {
  ev.preventDefault();
  ev.currentTarget.classList.remove('dragover');
  const id = Number(ev.dataTransfer.getData('text/plain'));
  if (!id) return;
  await api('/api/task', { action: 'update', id, status_id: statusId });
  await refresh();
}

/* ---------------------------------------------------------- vista: calendario */
function viewCalendar() {
  if (calY == null) { const d = new Date(); calY = d.getFullYear(); calM = d.getMonth(); }
  const first = new Date(calY, calM, 1);
  const start = (first.getDay() + 6) % 7; // lunes = 0
  const titleRaw = first.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const title = titleRaw.charAt(0).toUpperCase() + titleRaw.slice(1);
  const ts = currentTasks().filter(t => t.due);
  const byDay = {};
  ts.forEach(t => (byDay[t.due] = byDay[t.due] || []).push(t));
  const today = todayStr();

  let html = `<div class="cal-head">
    <span class="cal-title">${title}</span>
    <button class="btn btn-soft" onclick="calMove(-1)">←</button>
    <button class="btn btn-soft" onclick="calMove(0)">Hoy</button>
    <button class="btn btn-soft" onclick="calMove(1)">→</button>
  </div><div class="cal-grid">`;
  for (const d of ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']) html += `<div class="cal-dow">${d}</div>`;
  const cells = 42;
  for (let i = 0; i < cells; i++) {
    const date = new Date(calY, calM, i - start + 1);
    const iso = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    const other = date.getMonth() !== calM;
    const items = sortTasks(byDay[iso] || []);
    html += `<div class="cal-day ${other ? 'other' : ''} ${iso === today ? 'today' : ''}">
      <span class="num">${date.getDate()}</span>
      ${items.slice(0, 3).map(t => `<span class="cal-task" style="background:${statusById(t.status_id).color}" onclick="openTask(${t.id})">${esc(t.title)}</span>`).join('')}
      ${items.length > 3 ? `<span class="cal-more">+${items.length - 3} más</span>` : ''}
    </div>`;
  }
  html += '</div>';
  $('#main').innerHTML = html;
}
function calMove(n) {
  if (n === 0) { const d = new Date(); calY = d.getFullYear(); calM = d.getMonth(); }
  else { calM += n; if (calM < 0) { calM = 11; calY--; } if (calM > 11) { calM = 0; calY++; } }
  renderMain();
}

/* ---------------------------------------------------------- vista: grafo de relaciones */
const _graph = { pos: {}, key: null, drag: null };
const GRAPH_W = 1000, GRAPH_H = 680;
const LINK_COLOR = { relates: '#4E9CF5', blocks: '#E5484D', duplicates: '#A78BFA' };

function graphScopeTaskIds() {
  // Tareas del ámbito actual (sin filtro de búsqueda).
  if (route.type === 'list') return new Set(S.tasks.filter(t => t.list_id === route.listId).map(t => t.id));
  return new Set(S.tasks.map(t => t.id));
}

function viewGraph() {
  const scope = graphScopeTaskIds();
  const edges = [];
  const ids = new Set();
  for (const l of (S.links || [])) {
    if (scope.has(l.src_id) || scope.has(l.dst_id)) {
      edges.push(l); ids.add(l.src_id); ids.add(l.dst_id);
    }
  }
  const nodes = [...ids].map(id => taskById(id)).filter(Boolean);
  if (!edges.length) {
    $('#main').innerHTML = emptyState('🕸️', 'Aún no hay relaciones que mostrar',
      'Abre una tarea y usa “Vincular tarea” para conectar qué bloquea a qué. El grafo dibuja esas conexiones.');
    return;
  }
  // Layout: recalcular solo si cambió el conjunto de nodos
  const key = nodes.map(n => n.id).sort((a, b) => a - b).join(',') + '|' + edges.length;
  if (_graph.key !== key) { graphLayout(nodes, edges); _graph.key = key; }
  const legend = `<div class="graph-legend">
    ${Object.entries(LINK_COLOR).map(([k, c]) =>
      `<div class="lg-row"><span class="lg-line" style="border-top-color:${c}"></span>${esc(LINK_KINDS[k].label)}</div>`).join('')}
  </div>`;
  $('#main').innerHTML = `<div class="graph-wrap">${legend}<svg viewBox="0 0 ${GRAPH_W} ${GRAPH_H}" id="graph-svg" preserveAspectRatio="xMidYMid meet"></svg></div>`;
  renderGraphSVG(nodes, edges);
  wireGraphDrag(nodes, edges);
}

function graphLayout(nodes, edges) {
  // Fuerza dirigida sencilla: repulsión + resortes en enlaces + gravedad al centro.
  const cx = GRAPH_W / 2, cy = GRAPH_H / 2;
  const pos = {};
  nodes.forEach((n, i) => {
    // semilla determinista en círculo (evita saltos entre renders)
    const a = (i / nodes.length) * Math.PI * 2;
    pos[n.id] = { x: cx + Math.cos(a) * 200 + (n.id % 7) * 6, y: cy + Math.sin(a) * 200 + (n.id % 5) * 6, vx: 0, vy: 0 };
  });
  const k = Math.min(160, 520 / Math.sqrt(nodes.length + 1));
  for (let iter = 0; iter < 240; iter++) {
    // repulsión O(n^2)
    for (let i = 0; i < nodes.length; i++) {
      const a = pos[nodes[i].id];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = pos[nodes[j].id];
        let dx = a.x - b.x, dy = a.y - b.y;
        let d2 = dx * dx + dy * dy || 0.01;
        const f = (k * k) / d2;
        const d = Math.sqrt(d2);
        const ux = dx / d, uy = dy / d;
        a.vx += ux * f; a.vy += uy * f;
        b.vx -= ux * f; b.vy -= uy * f;
      }
    }
    // resortes en enlaces
    for (const e of edges) {
      const a = pos[e.src_id], b = pos[e.dst_id];
      if (!a || !b) continue;
      let dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = (d - k) * 0.06;
      const ux = dx / d, uy = dy / d;
      a.vx += ux * f; a.vy += uy * f;
      b.vx -= ux * f; b.vy -= uy * f;
    }
    // gravedad + integración + damping
    const damp = 0.85;
    for (const n of nodes) {
      const p = pos[n.id];
      p.vx += (cx - p.x) * 0.008;
      p.vy += (cy - p.y) * 0.008;
      p.x += p.vx * 0.5; p.y += p.vy * 0.5;
      p.vx *= damp; p.vy *= damp;
      p.x = Math.max(40, Math.min(GRAPH_W - 40, p.x));
      p.y = Math.max(40, Math.min(GRAPH_H - 40, p.y));
    }
  }
  nodes.forEach(n => { _graph.pos[n.id] = { x: pos[n.id].x, y: pos[n.id].y }; });
}

function renderGraphSVG(nodes, edges) {
  const svg = $('#graph-svg');
  if (!svg) return;
  const P = _graph.pos;
  // Grado de cada nodo, precomputado una vez (este render corre en cada pointermove al arrastrar).
  const deg = {};
  for (const e of edges) { deg[e.src_id] = (deg[e.src_id] || 0) + 1; deg[e.dst_id] = (deg[e.dst_id] || 0) + 1; }
  const nodeR = (id) => 14 + Math.min(10, (deg[id] || 0) * 2);
  // enlaces (con definiciones de flechas por tipo)
  let edgeHtml = `<defs>${Object.entries(LINK_COLOR).map(([k, c]) =>
    `<marker id="arrow-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${c}"/></marker>`).join('')}</defs>`;
  for (const e of edges) {
    const a = P[e.src_id], b = P[e.dst_id];
    if (!a || !b) continue;
    const c = LINK_COLOR[e.kind] || '#8B97A6';
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const rB = nodeR(e.dst_id);
    const ex = b.x - (dx / d) * (rB + 8), ey = b.y - (dy / d) * (rB + 8);
    const directed = e.kind !== 'relates';
    edgeHtml += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"
      stroke="${c}" stroke-width="1.8" stroke-opacity="0.6" ${directed ? `marker-end="url(#arrow-${e.kind})"` : ''}></line>`;
  }
  // nodos
  let nodeHtml = '';
  for (const n of nodes) {
    const p = P[n.id]; if (!p) continue;
    const st = statusById(n.status_id);
    const r = nodeR(n.id);
    const label = n.title.length > 22 ? n.title.slice(0, 21) + '…' : n.title;
    nodeHtml += `<g class="graph-node" id="g-node-${n.id}" data-id="${n.id}" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})">
      <circle r="${r}" fill="${st.color}" fill-opacity="${isDone(n) ? 0.35 : 0.9}" stroke="var(--bg2)" stroke-width="2"></circle>
      <text y="${r + 15}" text-anchor="middle" font-size="12" fill="var(--text)">${esc(label)}</text>
    </g>`;
  }
  svg.innerHTML = edgeHtml + nodeHtml;
}

function wireGraphDrag(nodes, edges) {
  const svg = $('#graph-svg');
  if (!svg) return;
  const pt = (ev) => {
    const r = svg.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / r.width * GRAPH_W, y: (ev.clientY - r.top) / r.height * GRAPH_H };
  };
  let moved = false;
  svg.addEventListener('pointerdown', (ev) => {
    const g = ev.target.closest('.graph-node');
    if (!g) return;
    _graph.drag = { id: Number(g.dataset.id) };
    moved = false;
    try { svg.setPointerCapture(ev.pointerId); } catch (e) {}
  });
  svg.addEventListener('pointermove', (ev) => {
    if (!_graph.drag) return;
    const m = pt(ev);
    _graph.pos[_graph.drag.id] = { x: m.x, y: m.y };
    moved = true;
    renderGraphSVG(nodes, edges);
  });
  svg.addEventListener('pointerup', () => {
    const d = _graph.drag;
    _graph.drag = null;
    if (d && !moved) openTask(d.id);  // click sin arrastrar → abre la tarea
  });
}

/* ---------------------------------------------------------- vista: documento (markdown) */
function mdSafeUrl(u, isImg) {
  // u ya viene escapado (esc) cuando llega desde mdToHtml.
  u = String(u).trim();
  // Imágenes de adjuntos: usa SIEMPRE el token del visor actual (no el persistido).
  // Evita fugar el token del dueño guardado en el doc y arregla el 401 del invitado.
  const m = u.match(/^\/api\/attachment\b.*?[?&]id=(\d+)/);
  if (m) return esc(attUrl(Number(m[1])));
  // Solo esquemas seguros; bloquea javascript:, data:, vbscript:, file:
  if (/^(https?:|mailto:|\/|#|\.)/i.test(u)) return u;
  return '#';
}
function mdToHtml(md) {
  if (!md || !md.trim()) {
    return `<p class="md-empty faint">Documento vacío. Pulsa <strong>Editar</strong> y escribe en Markdown:
      <code># título</code>, <code>**negrita**</code>, listas con <code>-</code>, <code>[enlaces](url)</code>,
      y pega o arrastra imágenes directamente.</p>`;
  }
  const inline = (s) => esc(s)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) => `<img class="md-img" src="${mdSafeUrl(u, true)}" alt="${a}">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${mdSafeUrl(u)}" target="_blank" rel="noopener">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
  const lines = md.split('\n');
  const out = [];
  let inUl = false, inCode = false, code = [], para = [];
  const flushPara = () => { if (para.length) { out.push('<p>' + para.join('<br>') + '</p>'); para = []; } };
  const closeUl = () => { if (inUl) { out.push('</ul>'); inUl = false; } };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (line.trim().startsWith('```')) {
      if (inCode) { out.push('<pre class="md-pre">' + esc(code.join('\n')) + '</pre>'); code = []; inCode = false; }
      else { flushPara(); closeUl(); inCode = true; }
      continue;
    }
    if (inCode) { code.push(raw); continue; }
    if (!line.trim()) { flushPara(); closeUl(); continue; }
    let m;
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
      flushPara(); closeUl();
      out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
    } else if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushPara(); closeUl(); out.push('<hr>');
    } else if ((m = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.*)$/))) {
      flushPara();
      if (!inUl) { out.push('<ul class="md-todo">'); inUl = true; }
      out.push(`<li>${m[1].toLowerCase() === 'x' ? '☑' : '☐'} ${inline(m[2])}</li>`);
    } else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      flushPara();
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push(`<li>${inline(m[1])}</li>`);
    } else if ((m = line.match(/^\s*>\s+(.*)$/))) {
      flushPara(); closeUl(); out.push(`<blockquote>${inline(m[1])}</blockquote>`);
    } else {
      closeUl(); para.push(inline(line));
    }
  }
  if (inCode) out.push('<pre class="md-pre">' + esc(code.join('\n')) + '</pre>');
  flushPara(); closeUl();
  return out.join('\n');
}

const docContent = (listId) => (S.docs && S.docs[String(listId)]) || '';
let _docMode = 'view';   // 'view' | 'edit'
let _docSaveTimer = null;

function viewDocumento() {
  if (route.type !== 'list') {
    $('#main').innerHTML = emptyState('📄', 'El documento es por lista',
      'Abre una lista para escribir su documento. Es tu página tipo Notion para notas, specs o bitácora.');
    return;
  }
  const listId = route.listId;
  const content = docContent(listId);
  if (!content && _docMode === 'view') _docMode = 'edit'; // vacío → directo a editar
  const editing = _docMode === 'edit' && !IS_GUEST;
  const toggle = IS_GUEST ? '' : `<div class="doc-toggle">
    <button class="doc-tab ${editing ? '' : 'on'}" onclick="docSetMode('view')">${I.file} Vista</button>
    <button class="doc-tab ${editing ? 'on' : ''}" onclick="docSetMode('edit')">${I.edit} Editar</button>
  </div>`;
  let body;
  if (editing) {
    body = `<textarea id="doc-editor" class="doc-editor" placeholder="# Mi documento

Escribe en Markdown. Pega (⌘V) o arrastra imágenes aquí." oninput="docOnInput(${listId})" onblur="docSave(${listId})">${esc(content)}</textarea>`;
  } else {
    body = `<div class="doc-render">${mdToHtml(content)}</div>`;
  }
  $('#main').innerHTML = `<div class="doc-wrap">
    <div class="doc-head">
      <div class="view-title" style="margin:0">📄 ${esc(listById(listId)?.name || 'Documento')}</div>
      ${toggle}
    </div>
    ${body}
  </div>`;
  if (editing) {
    const ed = $('#doc-editor');
    wireDocPasteDrop(ed, listId);
    ed.focus();
  }
}
function docSetMode(m) { _docMode = m; renderMain(); }
function docOnInput(listId) {
  const ed = $('#doc-editor');
  if (!ed) return;
  S.docs = S.docs || {};
  S.docs[String(listId)] = ed.value;            // optimista
  clearTimeout(_docSaveTimer);
  _docSaveTimer = setTimeout(() => docSave(listId), 700);
}
async function docSave(listId) {
  const ed = $('#doc-editor');
  const content = ed ? ed.value : docContent(listId);
  clearTimeout(_docSaveTimer);
  try {
    await api('/api/doc', { action: 'save', list_id: listId, content });
    S.docs = S.docs || {}; S.docs[String(listId)] = content;
  } catch (e) {}
}
function docInsertAtCursor(ed, text) {
  const s = ed.selectionStart, e = ed.selectionEnd;
  ed.value = ed.value.slice(0, s) + text + ed.value.slice(e);
  ed.selectionStart = ed.selectionEnd = s + text.length;
}
async function docUploadImage(listId, file, ed) {
  if (!file.type.startsWith('image/')) { toast('Solo imágenes se incrustan; usa los adjuntos de la tarea para otros archivos', 'err'); return; }
  try {
    const dataUrl = await fileToDataURL(file);
    const r = await api('/api/attachment', { action: 'upload', list_id: listId, name: file.name, mime: file.type, data: String(dataUrl) });
    // URL sin token: el token del visor se añade al renderizar (mdSafeUrl). No persistir credenciales.
    const md = `\n![${file.name}](/api/attachment?id=${r.id})\n`;
    if (ed) { docInsertAtCursor(ed, md); docOnInput(listId); }
    toast('Imagen insertada ✓');
  } catch (e) {}
}
function wireDocPasteDrop(ed, listId) {
  ed.addEventListener('paste', async (e) => {
    const items = (e.clipboardData && e.clipboardData.items) || [];
    for (const it of items) {
      if (it.kind === 'file') { const f = it.getAsFile(); if (f && f.type.startsWith('image/')) { e.preventDefault(); await docUploadImage(listId, f, ed); } }
    }
  });
  ['dragover', 'dragenter'].forEach(ev => ed.addEventListener(ev, (e) => {
    if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) { e.preventDefault(); ed.classList.add('drag-over'); }
  }));
  ['dragleave', 'drop'].forEach(ev => ed.addEventListener(ev, () => ed.classList.remove('drag-over')));
  ed.addEventListener('drop', async (e) => {
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) { e.preventDefault(); for (const f of files) await docUploadImage(listId, f, ed); }
  });
}

/* ---------------------------------------------------------- vista: inicio */
function viewInicio() {
  const name = S.settings.user_name || '';
  const h = new Date().getHours();
  const saludo = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  const fechaRaw = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const fecha = fechaRaw.charAt(0).toUpperCase() + fechaRaw.slice(1);
  const today = todayStr();
  const open = S.tasks.filter(t => !isDone(t));
  const hoy = open.filter(t => t.due === today);
  const vencidas = open.filter(t => t.due && t.due < today);
  const week = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const done7 = S.tasks.filter(t => isDone(t) && (t.done_at || '') >= week);
  const miDia = sortTasks([...vencidas, ...hoy, ...open.filter(t => !t.due && t.priority === 'urgente')]);

  let html = `<div class="hero"><h1>${saludo}, ${esc(name)} <span style="color:var(--accent-text)">●</span></h1><p>${fecha}</p></div>
  <div class="stats">
    <div class="stat"><div class="n">${open.length}</div><div class="l">Tareas abiertas</div></div>
    <div class="stat accent"><div class="n">${hoy.length}</div><div class="l">Para hoy</div></div>
    <div class="stat ${vencidas.length ? 'warn' : ''}"><div class="n">${vencidas.length}</div><div class="l">Vencidas</div></div>
    <div class="stat"><div class="n">${done7.length}</div><div class="l">Completadas (7 días)</div></div>
  </div>
  <div class="home-grid">
    <div class="panel-card">
      <h3><span class="left">⚡ Tu día</span></h3>
      ${miDia.length ? miDia.slice(0, 8).map(homeTaskRow).join('') : emptyState('🎉', 'Día despejado', 'Nada vencido ni urgente para hoy')}
    </div>
    <div>
      ${homeGoalsCard()}
      <div class="panel-card" style="margin-bottom:var(--space-6)">
        <h3><span class="left">${I.folder} Tus proyectos</span><button class="icon-btn" style="width:28px;height:28px" onclick="refreshMD()" title="Re-escanear">${I.refresh}</button></h3>
        <div id="home-md">${mdSkeleton()}</div>
      </div>
      <div class="panel-card">
        <h3><span class="left">📝 Pendientes en tus .md</span></h3>
        <div id="home-todos">${mdSkeleton()}</div>
      </div>
    </div>
  </div>`;
  $('#main').innerHTML = html;
  fillHomeMD();
}
function homeGoalsCard() {
  const goals = S.goals || [];
  if (!goals.length) return '';
  const spaceName = {};
  S.spaces.forEach(sp => { spaceName[sp.id] = sp.name; });
  return `<div class="panel-card" style="margin-bottom:var(--space-6)">
    <h3><span class="left">${I.chart} Metas</span></h3>
    ${goals.slice(0, 5).map(g => {
      const st = goalStatus(g);
      return `<div class="home-goal" onclick="editGoalModal(${g.id})" style="cursor:pointer">
        <div class="home-goal-top">
          <span class="home-goal-name">${esc(g.name)} <span class="faint" style="font-weight:500">· ${esc(spaceName[g.space_id] || '')}</span></span>
          <span class="home-goal-val" style="color:${st.color}">${Math.round(st.pct)}%</span>
        </div>
        <div class="home-goal-bar"><div class="home-goal-bar-fill" style="width:${Math.min(100, st.pct)}%;background:${st.color}"></div></div>
      </div>`;
    }).join('')}
  </div>`;
}
function mdSkeleton() { return '<div class="skeleton"></div><div class="skeleton" style="width:75%"></div><div class="skeleton" style="width:60%"></div>'; }

async function fillHomeMD() {
  try { await loadMD(); } catch (e) { return; }
  if (route.type !== 'inicio') return;
  const elMd = $('#home-md'), elTodos = $('#home-todos');
  if (!elMd) return;
  if (!MDdata.folders.length) {
    elMd.innerHTML = emptyState('📂', 'Sin proyectos vigilados', 'Agrega una carpeta en la vista Proyectos');
    elTodos.innerHTML = `<div class="empty"><div class="hint">Los checkboxes "- [ ]" de tus archivos .md aparecerán aquí</div></div>`;
    return;
  }
  elMd.innerHTML = MDdata.folders.map((f, fi) => `
    <div style="margin-bottom:var(--space-3)">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <strong>${esc(f.name)}</strong>${gitBadges(f)}
      </div>
      ${f.recent.slice(0, 3).map(r => `<div class="file-row">${I.file}<span class="rel">${esc(r.rel)}</span><span class="ago">${relTime(r.mtime)}</span></div>`).join('')}
    </div>`).join('');
  const todos = [];
  MDdata.folders.forEach((f, fi) => f.todos.forEach((td, ti) => todos.push({ f, fi, td, ti })));
  elTodos.innerHTML = todos.length ? todos.slice(0, 8).map(x => todoRow(x.fi, x.ti)).join('')
    : `<div class="empty"><div class="hint">Sin checkboxes pendientes en tus .md ✓</div></div>`;
}
function gitBadges(f) {
  if (!f.exists) return `<span class="badge crit">carpeta no encontrada</span>`;
  if (!f.git) return `<span class="badge">sin git</span>`;
  let b = `<span class="badge git">${I.branch}${esc(f.git.branch)}</span>`;
  if (f.git.changes) b += `<span class="badge warn">${f.git.changes} sin commit</span>`;
  if (f.git.ahead) b += `<span class="badge warn">${f.git.ahead} sin subir</span>`;
  if (!f.git.changes && !f.git.ahead) b += `<span class="badge ok">✓ al día</span>`;
  return b;
}
function todoRow(fi, ti) {
  const f = MDdata.folders[fi], td = f.todos[ti];
  return `<div class="todo-row">
    <span class="txt" title="${esc(td.text)}">${esc(td.text)}</span>
    <span class="src">${esc(f.name)}/${esc(td.rel)}:${td.line}</span>
    <button class="to-task" onclick="convertTodo(${fi},${ti})">+ tarea</button>
  </div>`;
}
async function convertTodo(fi, ti) {
  const f = MDdata.folders[fi], td = f.todos[ti];
  const listId = S.spaces[0] && S.spaces[0].lists[0] ? S.spaces[0].lists[0].id : null;
  if (!listId) { toast('Primero crea un espacio con una lista', 'err'); return; }
  await api('/api/task', {
    action: 'create', title: td.text, list_id: listId, tags: ['md'],
    descr: 'Encontrado en ' + f.name + '/' + td.rel + ' (línea ' + td.line + ')',
  });
  toast('Convertido en tarea ✓');
  await refresh();
}
async function refreshMD() {
  MDdata = null;
  if (route.type === 'inicio') { $('#home-md').innerHTML = mdSkeleton(); $('#home-todos').innerHTML = mdSkeleton(); await fillHomeMD(); }
  else if (route.type === 'md') { renderMain(); }
}

/* ---------------------------------------------------------- vista: proyectos md */
function viewMD() {
  $('#main').innerHTML = `
    <div class="view-title">Proyectos</div>
    <div class="view-sub">Carmín vigila los archivos .md de estas carpetas: qué cambió y qué sigue pendiente.</div>
    <div id="md-list">${mdSkeleton()}${mdSkeleton()}</div>
    <div class="add-folder">
      <input id="folder-input" placeholder="Ruta de la carpeta, ej: ~/Trip-App" onkeydown="if(event.key==='Enter')addFolderRow()">
      <button class="btn btn-primary" onclick="addFolderRow()">${I.plus} Vigilar carpeta</button>
    </div>`;
  fillMDView();
}
async function fillMDView() {
  try { await loadMD(); } catch (e) { return; }
  if (route.type !== 'md') return;
  const el = $('#md-list');
  if (!el) return;
  if (!MDdata.folders.length) {
    el.innerHTML = emptyState('📂', 'Aún no vigilas ninguna carpeta', 'Escribe abajo la ruta de un proyecto (ej: ~/Trip-App)');
    return;
  }
  el.innerHTML = MDdata.folders.map((f, fi) => `
    <div class="folder-card">
      <div class="folder-head">
        <span style="font-size:20px">📂</span>
        <div style="flex:1;min-width:0">
          <div class="name">${esc(f.name)}</div>
          <div class="path">${esc(f.path)}</div>
        </div>
        <button class="icon-btn btn-danger" onclick="removeFolder(${f.id})" title="Dejar de vigilar">${I.trash}</button>
      </div>
      <div class="badges">${gitBadges(f)}<span class="badge">${f.md_count} archivos .md</span></div>
      ${f.exists ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
          <div style="min-width:0">
            <div class="tp-section" style="margin-bottom:8px">Actualizado recientemente</div>
            ${f.recent.length ? f.recent.map(r => `<div class="file-row">${I.file}<span class="rel" title="${esc(r.rel)}">${esc(r.rel)}</span><span class="ago">${relTime(r.mtime)}</span></div>`).join('') : '<div class="faint">Sin archivos .md</div>'}
          </div>
          <div style="min-width:0">
            <div class="tp-section" style="margin-bottom:8px">Pendientes encontrados (${f.todos.length})</div>
            ${f.todos.length ? f.todos.slice(0, 12).map((td, ti) => todoRow(fi, ti)).join('') : '<div class="faint">Sin checkboxes "- [ ]" pendientes ✓</div>'}
          </div>
        </div>` : ''}
    </div>`).join('');
}
async function addFolderRow() {
  const inp = $('#folder-input');
  const v = inp.value.trim();
  if (!v) return;
  await api('/api/folder', { action: 'create', path: v });
  inp.value = '';
  toast('Carpeta agregada ✓');
  MDdata = null;
  await refresh();
}
async function removeFolder(id) {
  if (!await uiConfirm({ title: '¿Dejar de vigilar esta carpeta?', message: 'No borra nada de tu disco, solo deja de mostrarla en Carmín.', okText: 'Dejar de vigilar', danger: true })) return;
  await api('/api/folder', { action: 'delete', id });
  MDdata = null;
  await refresh();
}

function emptyState(icon, title, hint) {
  return `<div class="empty"><div class="big">${icon}</div><div style="font-weight:900">${title}</div><div class="hint">${hint || ''}</div></div>`;
}

/* ---------------------------------------------------------- adjuntos: imágenes y archivos */
function attUrl(id, dl) {
  const t = authToken();
  return `/api/attachment?id=${id}${dl ? '&dl=1' : ''}${t ? '&token=' + encodeURIComponent(t) : ''}`;
}
function humanSize(n) {
  if (!n) return '';
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB';
  return (n / 1048576).toFixed(1) + ' MB';
}
const _EXT_ICON = {
  pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗', csv: '📗',
  ppt: '📙', pptx: '📙', zip: '🗜', rar: '🗜', txt: '📄', md: '📝',
  mp4: '🎬', mov: '🎬', mp3: '🎵', wav: '🎵', fig: '🎨', sketch: '🎨',
  js: '📜', ts: '📜', py: '🐍', json: '⚙️', html: '🌐', css: '🎨',
};
function fileIcon(ext, isDir) {
  if (isDir) return '📁';
  return _EXT_ICON[(ext || '').toLowerCase()] || '📎';
}
const isImageMime = (m) => (m || '').startsWith('image/');

function renderAttachmentsSection(t) {
  if (IS_GUEST) {
    const atts = attachmentsOf(t.id);
    if (!atts.length) return '';
  }
  const atts = attachmentsOf(t.id);
  const imgs = atts.filter(a => isImageMime(a.mime));
  const files = atts.filter(a => !isImageMime(a.mime));
  let body = '';
  if (imgs.length) {
    body += `<div class="att-grid">${imgs.map(a => `
      <div class="att-img" title="${esc(a.name)}">
        <img src="${attUrl(a.id)}" alt="${esc(a.name)}" loading="lazy" onclick="openLightbox(${a.id})">
        ${IS_GUEST ? '' : `<button class="att-del" title="Quitar" onclick="event.stopPropagation();deleteAttachment(${a.id})">${I.x}</button>`}
      </div>`).join('')}</div>`;
  }
  if (files.length) {
    body += `<div class="att-files">${files.map(a => {
      const local = a.kind === 'local';
      const ext = (a.name.split('.').pop() || '').toLowerCase();
      return `<div class="att-file ${local ? 'att-local' : ''}">
        <span class="att-ic">${fileIcon(ext, a.mime === 'inode/directory')}</span>
        <span class="att-name" title="${esc(a.name)}">${esc(a.name)}</span>
        <span class="att-meta faint">${local ? 'en tu PC' : humanSize(a.size)}</span>
        <span class="att-acts">
          ${local
            ? `<button class="att-open" title="Abrir en tu Mac" onclick="openLocalAtt(${a.id},false)">Abrir</button>
               <button class="att-open" title="Mostrar en Finder" onclick="openLocalAtt(${a.id},true)">📂</button>`
            : `<a class="att-open" href="${attUrl(a.id, true)}" title="Descargar">↓</a>`}
          ${IS_GUEST ? '' : `<button class="icon-btn btn-danger" style="width:26px;height:26px" onclick="deleteAttachment(${a.id})">${I.x}</button>`}
        </span>
      </div>`;
    }).join('')}</div>`;
  }
  if (!atts.length) body = `<div class="att-empty faint">Pega una imagen (⌘V), arrastra archivos aquí, o usa los botones.</div>`;
  const tools = IS_GUEST ? '' : `<div class="att-tools">
      <button class="btn btn-soft" onclick="triggerUpload(${t.id})">${I.plus} Subir archivo</button>
      <button class="btn btn-soft" onclick="openFileBrowser(${t.id})">${I.folder} Elegir de mi PC</button>
    </div>`;
  return `<div class="tp-attach" data-task="${t.id}">
    <div class="tp-section" style="margin-bottom:8px">Adjuntos (${atts.length})</div>
    ${body}
    ${tools}
  </div>`;
}

function triggerUpload(taskId) {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.multiple = true;
  inp.onchange = async () => {
    for (const f of inp.files) await uploadFile(taskId, f);
  };
  inp.click();
}

function fileToDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
async function uploadFile(taskId, file) {
  if (file.size > 25 * 1024 * 1024) { toast(`"${file.name}" supera 25 MB`, 'err'); return; }
  try {
    const dataUrl = await fileToDataURL(file);
    await api('/api/attachment', {
      action: 'upload', task_id: taskId, name: file.name,
      mime: file.type || '', data: String(dataUrl),
    });
    toast('Adjunto agregado ✓');
    await refresh();
  } catch (e) { /* toast ya mostrado por api() */ }
}
async function deleteAttachment(id) {
  await api('/api/attachment', { action: 'delete', id });
  await refresh();
}
async function openLocalAtt(id, reveal) {
  // El servidor resuelve la ruta por el id del adjunto; el cliente nunca maneja rutas del disco.
  try {
    await api('/api/open', { path_id: id, reveal: !!reveal });
  } catch (e) {}
}

/* lightbox para imágenes */
function openLightbox(id) {
  const wrap = document.createElement('div');
  wrap.className = 'lightbox';
  wrap.onclick = () => wrap.remove();
  wrap.innerHTML = `<img src="${attUrl(id)}"><button class="lb-close">${I.x}</button>`;
  document.body.appendChild(wrap);
}

/* pegar / arrastrar sobre el panel de tarea */
function wirePanelDropPaste(panel, taskId) {
  panel.addEventListener('paste', async (e) => {
    const items = (e.clipboardData && e.clipboardData.items) || [];
    let handled = false;
    for (const it of items) {
      if (it.kind === 'file') {
        const f = it.getAsFile();
        if (f) { handled = true; await uploadFile(taskId, f); }
      }
    }
    if (handled) e.preventDefault();
  });
  ['dragenter', 'dragover'].forEach(ev => panel.addEventListener(ev, (e) => {
    if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) {
      e.preventDefault(); panel.classList.add('drag-over');
    }
  }));
  ['dragleave', 'drop'].forEach(ev => panel.addEventListener(ev, (e) => {
    if (ev === 'dragleave' && panel.contains(e.relatedTarget)) return;
    panel.classList.remove('drag-over');
  }));
  panel.addEventListener('drop', async (e) => {
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length) {
      e.preventDefault();
      for (const f of files) await uploadFile(taskId, f);
    }
  });
}

/* ---------------------------------------------------------- explorador de archivos local */
let _fb = { taskId: null, data: null, loading: false };
function openFileBrowser(taskId) {
  _fb = { taskId, data: null, loading: true };
  showModal(`
    <h2>Elegir de mi PC</h2>
    <div class="faint" style="font-size:13px;margin-bottom:var(--space-3)">
      Navega tu disco y elige un archivo o carpeta para trabajar desde ahí. Carmín guarda una
      <strong>referencia</strong> (no copia el archivo) y puede abrirlo en su app nativa.
    </div>
    <div id="fb-body">${mdSkeleton()}${mdSkeleton()}</div>
    <div style="display:flex;justify-content:flex-end;margin-top:var(--space-3)">
      <button class="btn btn-soft" onclick="closeModal()">Cerrar</button>
    </div>`);
  fbNav('');
}
async function fbNav(path) {
  _fb.loading = true;
  try {
    const r = await fetch('/api/browse?path=' + encodeURIComponent(path || ''), { headers: withToken({}) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'error');
    _fb.data = d;
  } catch (e) {
    const el = $('#fb-body');
    if (el) el.innerHTML = emptyState('⚠️', 'No pude leer esa carpeta', esc(e.message || ''));
    return;
  }
  renderFileBrowser();
}
function fbUp() { if (_fb.data && _fb.data.parent) fbNav(_fb.data.parent); }
function renderFileBrowser() {
  const el = $('#fb-body');
  if (!el || !_fb.data) return;
  const d = _fb.data;
  const crumbs = (d.path || '').split('/').filter(Boolean);
  const shortcuts = (d.shortcuts || []).map((s, i) =>
    `<button class="fb-chip ${s.path === d.path ? 'on' : ''}" onclick="fbNav(_fb.data.shortcuts[${i}].path)">${esc(s.label)}</button>`).join('');
  const rows = (d.entries || []).map((e, i) => `
    <div class="fb-row" ondblclick="fbActivate(${i})">
      <span class="fb-ic">${fileIcon(e.ext, e.is_dir)}</span>
      <span class="fb-name" title="${esc(e.name)}">${esc(e.name)}</span>
      <span class="fb-meta faint">${e.is_dir ? '' : humanSize(e.size)}</span>
      ${e.is_dir
        ? `<button class="fb-act" onclick="fbNav(_fb.data.entries[${i}].path)">Abrir ▸</button>
           <button class="fb-pick" onclick="fbPick(${i})">Elegir carpeta</button>`
        : `<button class="fb-pick" onclick="fbPick(${i})">Elegir</button>`}
    </div>`).join('');
  el.innerHTML = `
    <div class="fb-shortcuts">${shortcuts}</div>
    <div class="fb-pathbar">
      <button class="fb-up" onclick="fbUp()" ${d.parent ? '' : 'disabled'} title="Subir un nivel">↑</button>
      <span class="fb-path">/${crumbs.map(esc).join(' <span class="faint">/</span> ')}</span>
    </div>
    <div class="fb-list">${rows || '<div class="faint" style="padding:16px;text-align:center">Carpeta vacía</div>'}</div>`;
}
function fbActivate(i) {
  const e = _fb.data.entries[i];
  if (!e) return;
  if (e.is_dir) fbNav(e.path); else fbPick(i);
}
async function fbPick(i) {
  const e = _fb.data.entries[i];
  if (!e) return;
  await api('/api/attachment', { action: 'link_local', task_id: _fb.taskId, path: e.path });
  closeModal();
  toast('Archivo vinculado ✓');
  await refresh();
}

/* ---------------------------------------------------------- relaciones entre tareas */
const LINK_KINDS = {
  relates: { label: 'Relacionada con', icon: '🔗', verb: 'relacionar con' },
  blocks: { label: 'Bloquea a', icon: '⛔', verb: 'que bloquee a' },
  blocked_by: { label: 'Bloqueada por', icon: '⏳', verb: '' },
  duplicates: { label: 'Duplica a', icon: '⧉', verb: 'duplicar a' },
};
function relationsForTask(taskId) {
  // Devuelve [{linkId, kind(display), otherId}] normalizando dirección.
  const out = [];
  for (const l of linksOf(taskId)) {
    if (l.src_id === taskId) {
      out.push({ linkId: l.id, kind: l.kind, otherId: l.dst_id });
    } else {
      // soy el destino → invierto el sentido para mostrar
      const inv = l.kind === 'blocks' ? 'blocked_by' : l.kind;
      out.push({ linkId: l.id, kind: inv, otherId: l.src_id });
    }
  }
  return out;
}
function renderRelationsSection(t) {
  const rels = relationsForTask(t.id);
  if (IS_GUEST && !rels.length) return '';
  const byKind = {};
  rels.forEach(r => (byKind[r.kind] = byKind[r.kind] || []).push(r));
  let body = '';
  ['blocks', 'blocked_by', 'relates', 'duplicates'].forEach(k => {
    const items = byKind[k];
    if (!items || !items.length) return;
    const meta = LINK_KINDS[k];
    body += `<div class="rel-group">
      <div class="rel-kind">${meta.icon} ${meta.label}</div>
      ${items.map(r => {
        const ot = taskById(r.otherId);
        if (!ot) return '';
        const st = statusById(ot.status_id);
        return `<div class="rel-item" onclick="openTask(${ot.id})">
          <span class="status-dot" style="color:${st.color}"></span>
          <span class="rel-title ${isDone(ot) ? 'done' : ''}">${esc(ot.title)}</span>
          ${IS_GUEST ? '' : `<button class="icon-btn btn-danger" style="width:24px;height:24px" onclick="event.stopPropagation();deleteLink(${r.linkId})">${I.x}</button>`}
        </div>`;
      }).join('')}
    </div>`;
  });
  if (!rels.length) body = `<div class="faint" style="font-size:12.5px">Sin relaciones. Conecta esta tarea con otras: qué la bloquea, qué se relaciona.</div>`;
  const addBtn = IS_GUEST ? '' : `<button class="btn btn-soft" style="margin-top:8px" onclick="openLinkModal(${t.id})">${I.plus} Vincular tarea</button>`;
  return `<div class="tp-rel">
    <div class="tp-section" style="margin-bottom:8px">Relaciones (${rels.length})</div>
    ${body}
    ${addBtn}
  </div>`;
}

let _linkDraft = { taskId: null, kind: 'relates' };
function openLinkModal(taskId) {
  _linkDraft = { taskId, kind: 'relates' };
  showModal(`
    <h2>Vincular tarea</h2>
    <div class="sec">
      <h4>Tipo de relación</h4>
      <div class="link-kinds">
        ${['relates', 'blocks', 'duplicates'].map(k =>
          `<button class="link-kind ${k === 'relates' ? 'on' : ''}" data-kind="${k}" onclick="lkPickKind('${k}')">${LINK_KINDS[k].icon} ${LINK_KINDS[k].label}</button>`).join('')}
      </div>
    </div>
    <div class="sec">
      <h4>¿Con cuál tarea?</h4>
      <input type="text" id="lk-search" placeholder="Busca por título…" oninput="lkSearch(this.value)" autocomplete="off">
      <div id="lk-results" class="lk-results"></div>
    </div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-soft" onclick="closeModal()">Cerrar</button></div>`);
  setTimeout(() => { $('#lk-search')?.focus(); lkSearch(''); }, 60);
}
function lkPickKind(k) {
  _linkDraft.kind = k;
  document.querySelectorAll('.link-kind').forEach(el => el.classList.toggle('on', el.dataset.kind === k));
}
function lkSearch(q) {
  const el = $('#lk-results');
  if (!el) return;
  const k = (q || '').toLowerCase().trim();
  const existing = new Set(linksOf(_linkDraft.taskId).flatMap(l => [l.src_id, l.dst_id]));
  let cands = S.tasks.filter(t => t.id !== _linkDraft.taskId && !existing.has(t.id));
  if (k) cands = cands.filter(t => t.title.toLowerCase().includes(k));
  cands = sortTasks(cands).slice(0, 8);
  if (!cands.length) { el.innerHTML = `<div class="faint" style="padding:10px">Nada coincide.</div>`; return; }
  el.innerHTML = cands.map(t => {
    const st = statusById(t.status_id);
    const l = listById(t.list_id);
    return `<button class="lk-row" onclick="createLink(${t.id})">
      <span class="status-dot" style="color:${st.color}"></span>
      <span class="lk-row-title">${esc(t.title)}</span>
      ${l ? `<span class="chip">${esc(l.name)}</span>` : ''}
    </button>`;
  }).join('');
}
async function createLink(otherId) {
  await api('/api/link', { action: 'create', src_id: _linkDraft.taskId, dst_id: otherId, kind: _linkDraft.kind });
  closeModal();
  toast('Tareas vinculadas ✓');
  await refresh();
}
async function deleteLink(id) {
  await api('/api/link', { action: 'delete', id });
  await refresh();
}

/* ---------------------------------------------------------- panel de tarea */
function openTask(id) { openTaskId = id; renderPanel(); }
function closeTask() {
  openTaskId = null;
  const layer = $('#panel-layer');
  if (!layer.classList.contains('open')) { layer.innerHTML = ''; return; }
  layer.classList.remove('open');  // el scrim hace fade-out
  setTimeout(() => { if (!layer.classList.contains('open')) layer.innerHTML = ''; }, 200);
}

function renderPanel() {
  const t = taskById(openTaskId);
  if (!t) { closeTask(); return; }
  const st = statusById(t.status_id);
  const comments = commentsOf(t.id);
  const lists = [];
  for (const sp of S.spaces) for (const l of sp.lists) lists.push({ ...l, space: sp.name });
  const layer = $('#panel-layer');
  const wasOpen = layer.classList.contains('open'); // re-render por edición → no re-animar
  layer.innerHTML = `
    <div class="panel-scrim" onclick="closeTask()"></div>
    <div class="task-panel ${wasOpen ? '' : 'panel-anim'}">
      <div class="tp-head">
        <button class="status-pill" style="background:${st.color};border:none;cursor:pointer" onclick="statusMenu(event,${t.id})">${esc(st.name)}</button>
        <span class="spacer"></span>
        <button class="icon-btn btn-danger" onclick="deleteTask(${t.id})" title="Eliminar tarea">${I.trash}</button>
        <button class="icon-btn" onclick="closeTask()">${I.x}</button>
      </div>
      <div class="tp-body">
        <textarea class="tp-title" rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'" onblur="saveField(${t.id},'title',this.value)">${esc(t.title)}</textarea>
        <div class="tp-row"><span class="tp-label">Prioridad</span><div class="tp-value">
          <button class="btn btn-soft" style="min-height:34px;padding:6px 12px" onclick="prioMenu(event,${t.id})">
            ${t.priority ? `<span class="flag ${t.priority}">${I.flag}</span> ${t.priority}` : 'Sin prioridad'}
          </button></div></div>
        <div class="tp-row"><span class="tp-label">Fecha límite</span><div class="tp-value">
          <input type="date" value="${esc(t.due)}" onchange="saveField(${t.id},'due',this.value)">
          ${t.due ? `<button class="icon-btn" style="width:30px;height:30px" onclick="saveField(${t.id},'due','')" title="Quitar fecha">${I.x}</button>` : ''}
        </div></div>
        <div class="tp-row"><span class="tp-label">Lista</span><div class="tp-value">
          <select onchange="saveField(${t.id},'list_id',Number(this.value))">
            ${lists.map(l => `<option value="${l.id}" ${l.id === t.list_id ? 'selected' : ''}>${esc(l.space)} / ${esc(l.name)}</option>`).join('')}
          </select></div></div>
        <div class="tp-row"><span class="tp-label">Etiquetas</span><div class="tp-value">
          <input type="text" placeholder="separadas, por, comas" value="${esc(t.tags.join(', '))}"
            onchange="saveField(${t.id},'tags',this.value.split(',').map(s=>s.trim()).filter(Boolean))"></div></div>
        ${renderTaskCustomSection(t)}
        <div>
          <div class="tp-section" style="margin-bottom:8px">Descripción</div>
          <textarea class="tp-descr" placeholder="Escribe los detalles…" onblur="saveField(${t.id},'descr',this.value)">${esc(t.descr || '')}</textarea>
        </div>
        ${renderAttachmentsSection(t)}
        ${renderRelationsSection(t)}
        <div>
          <div class="tp-section" style="margin-bottom:8px">Comentarios y sugerencias (${comments.length})</div>
          ${comments.map(c => `
            <div class="comment">
              <span class="avatar">${esc((c.author || 'Y')[0]).toUpperCase()}</span>
              <div class="body">${esc(c.text)}<div class="meta">${esc(c.author || '')} · ${esc(c.created_at || '')}</div></div>
              <button class="icon-btn btn-danger" style="width:28px;height:28px" onclick="delComment(${c.id})">${I.x}</button>
            </div>`).join('')}
          <div class="comment-form">
            <input placeholder="Escribe un comentario…" onkeydown="if(event.key==='Enter')addComment(this,${t.id})">
            <button class="btn btn-primary" onclick="addComment(this.previousElementSibling,${t.id})">Enviar</button>
          </div>
        </div>
      </div>
      <div class="tp-foot">
        <span>Creada ${esc((t.created_at || '').slice(0, 10))}</span>
        ${t.done_at ? `<span>✓ Completada ${esc(t.done_at.slice(0, 10))}</span>` : ''}
      </div>
    </div>`;
  if (!wasOpen) { void layer.offsetHeight; layer.classList.add('open'); } // scrim fade-in solo al abrir
  const ta = layer.querySelector('.tp-title');
  ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px';
  // Pegar (⌘V) y arrastrar archivos sobre el panel → subir adjunto.
  if (!IS_GUEST) {
    const panel = layer.querySelector('.task-panel');
    if (panel) wirePanelDropPaste(panel, t.id);
  }
}

async function saveField(id, field, value) {
  const t = taskById(id);
  if (!t) return;
  const current = field === 'tags' ? JSON.stringify(t.tags) : t[field];
  const next = field === 'tags' ? JSON.stringify(value) : value;
  if (String(current) === String(next)) return;
  await api('/api/task', { action: 'update', id, [field]: value });
  await refresh();
}

function renderTaskCustomSection(t) {
  const l = listById(t.list_id);
  const fields = (l && Array.isArray(l.custom_fields)) ? l.custom_fields : [];
  if (!fields.length) return '';
  const cv = t.custom_values || {};
  const editLink = `<button class="cf-edit-link" onclick="openCustomFieldsEditor(${l.id})" title="Editar columnas">${I.edit} editar</button>`;
  const rows = fields.map(f => {
    const handler = (expr) => `onchange="saveCustomValue(${t.id}, '${f.id}', ${expr})"`;
    return `<div class="tp-row">
      <span class="tp-label">${esc(f.name)}</span>
      <div class="tp-value">${renderCustomEditor(f, cv[f.id], handler)}</div>
    </div>`;
  }).join('');
  return `<div class="tp-custom">
    <div class="tp-section" style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span>Personalizado</span> ${editLink}
    </div>
    ${rows}
  </div>`;
}

async function saveCustomValue(taskId, fieldId, value) {
  await api('/api/task', { action: 'update', id: taskId, custom_values: { [fieldId]: value } });
  await refresh();
}
async function deleteTask(id) {
  if (!await uiConfirm({ title: '¿Eliminar esta tarea?', message: 'Se borrará junto con sus comentarios y adjuntos.', okText: 'Eliminar', danger: true })) return;
  await api('/api/task', { action: 'delete', id });
  closeTask();
  toast('Tarea eliminada');
  await refresh();
}
async function addComment(input, taskId) {
  const v = input.value.trim();
  if (!v) return;
  input.value = '';
  await api('/api/comment', { action: 'create', task_id: taskId, text: v });
  await refresh();
}
async function delComment(id) {
  await api('/api/comment', { action: 'delete', id });
  await refresh();
}

/* ---------------------------------------------------------- popovers */
function popover(ev, html) {
  closePopovers();
  const scrim = document.createElement('div');
  scrim.className = 'pop-scrim';
  scrim.onclick = closePopovers;
  document.body.appendChild(scrim);
  const p = document.createElement('div');
  p.className = 'popover';
  p.innerHTML = html;
  document.body.appendChild(p);
  const r = p.getBoundingClientRect();
  let x = ev.clientX, y = ev.clientY + 8;
  if (x + r.width > innerWidth - 12) x = innerWidth - r.width - 12;
  if (y + r.height > innerHeight - 12) y = ev.clientY - r.height - 8;
  p.style.left = x + 'px'; p.style.top = y + 'px';
}
function closePopovers() { document.querySelectorAll('.popover,.pop-scrim').forEach(e => e.remove()); }

function statusMenu(ev, taskId) {
  ev.stopPropagation();
  popover(ev, statuses().map(st =>
    `<button class="pop-item" onclick="setTaskStatus(${taskId},${st.id})">
      <span class="status-dot" style="background:${st.color}"></span> ${esc(st.name)}</button>`).join(''));
}
async function setTaskStatus(taskId, statusId) {
  closePopovers();
  await api('/api/task', { action: 'update', id: taskId, status_id: statusId });
  await refresh();
}
function prioMenu(ev, taskId) {
  ev.stopPropagation();
  popover(ev, PRIOS.map(([v, label]) =>
    `<button class="pop-item" onclick="setTaskPrio(${taskId},'${v}')">
      <span class="flag ${v || 'baja'}" style="${v ? '' : 'opacity:.25'}">${I.flag}</span> ${label}</button>`).join(''));
}
async function setTaskPrio(taskId, prio) {
  closePopovers();
  await api('/api/task', { action: 'update', id: taskId, priority: prio });
  await refresh();
}
function spaceMenu(ev, spaceId) {
  ev.stopPropagation();
  const nGoals = (S.goals || []).filter(g => g.space_id === spaceId).length;
  popover(ev, `
    <button class="pop-item" onclick="closePopovers();openSpacePanel(${spaceId})">${I.chart} Panel / Metas${nGoals ? ` <span class="faint">(${nGoals})</span>` : ''}</button>
    <button class="pop-item" onclick="renameSpace(${spaceId})">${I.edit} Renombrar</button>
    <button class="pop-item" onclick="addListPrompt(${spaceId});closePopovers()">${I.plus} Nueva lista</button>
    <button class="pop-item btn-danger" onclick="deleteSpace(${spaceId})">${I.trash} Eliminar espacio</button>`);
}
// Panel a nivel de espacio: route especial que no depende de una lista.
function openSpacePanel(spaceId) {
  route = { type: 'space-panel', spaceId, listId: null, tab: 'panel' };
  q = '';
  render();
}

/* ---------------------------------------------------------- crear / editar estructuras */
async function addSpacePrompt() {
  const name = await uiPrompt({ title: 'Nuevo espacio', label: 'Nombre', placeholder: 'Ej: Akatrek, Mi Setup…', okText: 'Crear espacio' });
  if (!name || !name.trim()) return;
  const iconRaw = await uiPrompt({ title: 'Icono del espacio', label: 'Un emoji (opcional)', value: '📁', maxlength: 4 });
  if (iconRaw === null) return; // canceló
  const icon = (iconRaw && iconRaw.trim()) || '📁';
  const r = await api('/api/space', { action: 'create', name: name.trim(), icon: icon.trim() });
  await api('/api/list', { action: 'create', space_id: r.id, name: 'General' });
  const s = expandedSet(); s.add(r.id);
  localStorage.setItem(expKey, JSON.stringify([...s]));
  toast('Espacio creado ✓');
  await refresh();
}
async function renameSpace(id) {
  closePopovers();
  const sp = S.spaces.find(s => s.id === id);
  const name = await uiPrompt({ title: 'Renombrar espacio', label: 'Nuevo nombre', value: sp ? sp.name : '', okText: 'Guardar' });
  if (!name || !name.trim()) return;
  await api('/api/space', { action: 'update', id, name: name.trim() });
  await refresh();
}
async function deleteSpace(id) {
  closePopovers();
  const n = S.tasks.filter(t => { const sp = spaceOfList(t.list_id); return sp && sp.id === id; }).length;
  if (!await uiConfirm({ title: '¿Eliminar este espacio?', message: `Se borrará${n ? ' junto con sus ' + n + ' tareas' : ''}. Esto no se puede deshacer.`, okText: 'Eliminar', danger: true })) return;
  await api('/api/space', { action: 'delete', id });
  if (route.type === 'list' && !listById(route.listId)) route = { type: 'inicio', listId: null, tab: 'lista' };
  await refresh();
}
async function addListPrompt(spaceId) {
  const name = await uiPrompt({ title: 'Nueva lista', label: 'Nombre', placeholder: 'Ej: Trips activos, Contactos…', okText: 'Crear lista' });
  if (!name || !name.trim()) return;
  await api('/api/list', { action: 'create', space_id: spaceId, name: name.trim() });
  toast('Lista creada ✓');
  await refresh();
}

/* ---------------------------------------------------------- modal: nueva tarea */
function newTaskModal() {
  const lists = [];
  for (const sp of S.spaces) for (const l of sp.lists) lists.push({ ...l, space: sp.name });
  if (!lists.length) { toast('Primero crea un espacio con una lista', 'err'); return; }
  const sel = route.type === 'list' ? route.listId : lists[0].id;
  const selList = lists.find(l => l.id === sel);
  const noun = selList ? itemNoun(selList) : 'tarea';
  showModal(`
    <h2>Crear ${esc(noun)}</h2>
    <div class="sec"><input type="text" id="nt-title" placeholder="${noun === 'tarea' ? '¿Qué hay que hacer?' : 'Nombre del ' + esc(noun)}" onkeydown="if(event.key==='Enter')createFromModal()"></div>
    <div class="sec"><h4>Lista</h4>
      <select id="nt-list" onchange="document.querySelector('.modal h2').textContent='Crear '+(this.options[this.selectedIndex].dataset.noun||'tarea')" style="width:100%;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:10px">
        ${lists.map(l => `<option value="${l.id}" data-noun="${esc(itemNoun(l))}" ${l.id === sel ? 'selected' : ''}>${esc(l.space)} / ${l.icon ? esc(l.icon) + ' ' : ''}${esc(l.name)}</option>`).join('')}
      </select></div>
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-soft" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="createFromModal()">${I.plus} Crear</button>
    </div>`);
  setTimeout(() => { const e = $('#nt-title'); if (e) e.focus(); }, 60);
}

/* ---------------------------------------------------------- menú "+ Vista" inline */
function openAddViewMenu(ev) {
  ev.stopPropagation();
  const active = enabledViews();
  const available = [
    { id: 'lista', name: 'Lista', icon: I.list, desc: 'Tareas agrupadas por estado' },
    { id: 'tablero', name: 'Tablero', icon: I.board, desc: 'Kanban con drag & drop' },
    { id: 'calendario', name: 'Calendario', icon: I.cal, desc: 'Mes con tareas por fecha' },
    { id: 'tabla', name: 'Tabla', icon: I.all, desc: 'Spreadsheet con columnas custom' },
    { id: 'panel', name: 'Panel', icon: I.chart, desc: 'Metas del proyecto con progreso' },
    { id: 'grafo', name: 'Grafo', icon: I.graph, desc: 'Red de tareas conectadas por relaciones' },
    { id: 'documento', name: 'Documento', icon: I.file, desc: 'Página Markdown por lista, con imágenes' },
  ];
  const soon = [
    { id: 'gantt', name: 'Gantt', emoji: '📊', desc: 'Línea de tiempo con dependencias' },
    { id: 'cronograma', name: 'Cronograma', emoji: '🗓', desc: 'Timeline horizontal por fechas' },
    { id: 'formulario', name: 'Formulario', emoji: '📝', desc: 'Capturar tareas vía formulario' },
  ];
  const renderItem = (v) => {
    const isActive = active.includes(v.id);
    return `<button class="pop-item pop-view-item ${isActive ? 'on' : ''}" onclick="toggleViewInline('${v.id}')" title="${isActive ? 'Click para ocultar' : 'Click para activar'}">
      <span class="pop-toggle">${isActive ? '<span class="pop-toggle-check">✓</span>' : ''}</span>
      <span class="pop-icon" style="background:var(--accent-softer);color:var(--accent-text)">${v.icon}</span>
      <span style="flex:1;min-width:0">
        <div class="pop-title">${v.name}</div>
        <div class="pop-sub">${v.desc}</div>
      </span>
      <span class="pop-toggle-action">${isActive ? 'Ocultar' : 'Activar'}</span>
    </button>`;
  };
  popover(ev, `
    <div class="pop-section">Vistas disponibles</div>
    ${available.map(renderItem).join('')}
    <div class="pop-section">Próximamente</div>
    ${soon.map(v => `
      <div class="pop-item pop-item-soon" title="Pronto">
        <span class="pop-icon" style="background:var(--surface2);color:var(--faint);font-size:14px">${v.emoji}</span>
        <span style="flex:1">
          <div class="pop-title" style="opacity:.75">${v.name}</div>
          <div class="pop-sub">${v.desc}</div>
        </span>
      </div>`).join('')}`);
}

async function toggleViewInline(v) {
  closePopovers();
  let views = enabledViews();
  if (views.includes(v)) {
    if (views.length === 1) { toast('Debe quedar al menos una vista', 'err'); return; }
    views = views.filter(x => x !== v);
    if (route.tab === v) route.tab = views[0];
    toast('Vista ocultada');
  } else {
    views.push(v);
    toast('Vista agregada ✓');
  }
  const order = ['lista', 'tablero', 'calendario', 'tabla', 'panel', 'grafo', 'documento'];
  views.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  S.settings.views = JSON.stringify(views);
  await api('/api/setting', { key: 'views', value: S.settings.views });
  renderTopbar();
  renderMain();
}

function createMenu(ev) {
  ev.stopPropagation();
  popover(ev, `
    <div class="pop-section">Crear</div>
    <button class="pop-item" onclick="closePopovers();newTaskModal()">
      <span class="pop-icon" style="background:var(--accent-softer);color:var(--accent-text)">${I.list}</span>
      <span><div class="pop-title">Tarea</div><div class="pop-sub">Un pendiente con estado, fecha y prioridad</div></span>
    </button>
    <button class="pop-item" onclick="closePopovers();addListPromptPicker()">
      <span class="pop-icon" style="background:color-mix(in srgb, #4E9CF5 14%, transparent);color:#4E9CF5">${I.all}</span>
      <span><div class="pop-title">Lista</div><div class="pop-sub">Un grupo de tareas dentro de un espacio</div></span>
    </button>
    <button class="pop-item" onclick="closePopovers();addSpacePrompt()">
      <span class="pop-icon" style="background:color-mix(in srgb, #A78BFA 14%, transparent);color:#A78BFA">${I.folder}</span>
      <span><div class="pop-title">Espacio</div><div class="pop-sub">Un proyecto entero (ej. Akatrek, Mi Setup)</div></span>
    </button>
    <button class="pop-item" onclick="closePopovers();openConnectSourceModal()">
      <span class="pop-icon" style="background:color-mix(in srgb, #34C77B 14%, transparent);color:#34C77B">⚡</span>
      <span><div class="pop-title">Conectar fuente</div><div class="pop-sub">Trae datos desde Supabase, una API o GitHub</div></span>
    </button>
    <button class="pop-item" onclick="closePopovers();nav('md')">
      <span class="pop-icon" style="background:color-mix(in srgb, #F5A524 14%, transparent);color:#F5A524">${I.file}</span>
      <span><div class="pop-title">Vigilar carpeta</div><div class="pop-sub">Ver cambios y pendientes en archivos .md</div></span>
    </button>`);
}

/* ---------------------------------------------------------- conectar fuente externa */
function openConnectSourceModal() {
  if (!S.spaces.length) { toast('Crea primero un espacio', 'err'); return; }
  showModal(`
    <h2>Conectar fuente</h2>
    <div class="faint" style="margin-bottom:var(--space-4);font-size:13px">
      Trae datos desde un servicio externo a una lista nueva en Carmín.
      Los datos se ven en <strong>solo lectura</strong> — los cambios reales se hacen en la fuente.
    </div>
    <div class="sec">
      <h4>Tipo</h4>
      <div class="theme-cards">
        <div class="theme-card active" data-stype="supabase" onclick="cs_pickType(this,'supabase')">
          <div class="preview" style="background:linear-gradient(135deg,#3ECF8E 0%,#1E1318 100%)"></div>
          Supabase
        </div>
        <div class="theme-card" data-stype="github" onclick="cs_pickType(this,'github')">
          <div class="preview" style="background:linear-gradient(135deg,#8B97A6 0%,#1E1318 100%)"></div>
          GitHub
        </div>
        <div class="theme-card" data-stype="http" onclick="cs_pickType(this,'http')">
          <div class="preview" style="background:linear-gradient(135deg,#4E9CF5 0%,#1E1318 100%)"></div>
          API genérica
        </div>
      </div>
    </div>
    <div id="cs-fields"></div>
    <div style="display:flex;justify-content:flex-end;gap:10px">
      <button class="btn btn-soft" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="cs_submit()">Crear y conectar</button>
    </div>`);
  cs_renderFields('supabase');
}

let _csType = 'supabase';
function cs_pickType(el, type) {
  _csType = type;
  document.querySelectorAll('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.stype === type));
  cs_renderFields(type);
}
function cs_renderFields(type) {
  const spaceOptions = S.spaces.map(sp => `<option value="${sp.id}">${esc(sp.icon || '')} ${esc(sp.name)}</option>`).join('');
  let html = `
    <div class="sec">
      <h4>Espacio donde crear la lista</h4>
      <select id="cs-space" class="cf-input">${spaceOptions}</select>
    </div>
    <div class="sec">
      <h4>Nombre de la nueva lista</h4>
      <input type="text" id="cs-list-name" placeholder="Ej: Trips activos">
    </div>`;
  if (type === 'supabase') {
    html += `
      <div class="sec">
        <h4>URL del proyecto Supabase</h4>
        <input type="text" id="cs-url" placeholder="https://xxx.supabase.co">
        <div class="faint" style="font-size:12px;margin-top:4px">La parte <code>/rest/v1</code> se agrega sola.</div>
      </div>
      <div class="sec">
        <h4>Anon key (public)</h4>
        <input type="text" id="cs-key" placeholder="eyJ... o sb_publishable_...">
        <div class="faint" style="font-size:12px;margin-top:4px">Se guarda en <code>~/carmin/credentials.json</code> (en .gitignore), nunca en la base.</div>
      </div>
      <div class="sec">
        <h4>Query</h4>
        <input type="text" id="cs-path" value="trip_posts?select=id,title,status&limit=20" placeholder="tabla?col=eq.valor&select=...">
        <div class="faint" style="font-size:12px;margin-top:4px">Sintaxis estándar PostgREST. Sin la URL — solo lo que va después de <code>/rest/v1/</code>.</div>
      </div>`;
  } else if (type === 'github') {
    html += `
      <div class="sec">
        <h4>Repositorio</h4>
        <input type="text" id="cs-repo" placeholder="RedMors/akatrek" value="RedMors/akatrek">
        <div class="faint" style="font-size:12px;margin-top:4px">Formato <code>dueño/repo</code>. La URL de la API se arma sola.</div>
      </div>
      <div class="sec">
        <h4>Token (opcional para repos públicos, requerido para privados)</h4>
        <input type="text" id="cs-key" placeholder="ghp_... o github_pat_...">
        <div class="faint" style="font-size:12px;margin-top:4px">Personal Access Token. Se guarda en <code>~/carmin/credentials.json</code>, nunca en la base.</div>
      </div>
      <div class="sec">
        <h4>Filtro</h4>
        <input type="text" id="cs-path" value="state=open" placeholder="state=open&labels=bug">
        <div class="faint" style="font-size:12px;margin-top:4px">Parámetros de la API de issues de GitHub.</div>
      </div>`;
  } else {
    html += `
      <div class="sec">
        <h4>URL completa de la API</h4>
        <input type="text" id="cs-url" placeholder="https://api.tuapp.com/v1/items">
      </div>
      <div class="sec">
        <h4>Header de autorización (opcional)</h4>
        <input type="text" id="cs-key" placeholder="Bearer xxx... o ApiKey ...">
      </div>
      <div class="sec">
        <h4>Path adicional (opcional)</h4>
        <input type="text" id="cs-path" placeholder="?status=open">
      </div>`;
  }
  const mapStatusDefault = type === 'github' ? 'state' : 'status';
  html += `
    <div class="sec">
      <h4>Mapeo de campos (qué campo del JSON usar)</h4>
      <div style="display:grid;grid-template-columns:90px 1fr;gap:8px;align-items:center">
        <span class="faint" style="font-size:12px">Título</span>
        <input type="text" id="cs-map-title" value="title" placeholder="ej: name">
        <span class="faint" style="font-size:12px">Estado</span>
        <input type="text" id="cs-map-status" value="${mapStatusDefault}" placeholder="ej: stage">
      </div>
    </div>`;
  $('#cs-fields').innerHTML = html;
}

async function cs_submit() {
  const type = _csType;
  const spaceId = Number($('#cs-space').value);
  const listName = $('#cs-list-name').value.trim();
  const key = $('#cs-key').value.trim();
  const mapTitle = $('#cs-map-title').value.trim() || 'title';
  const mapStatus = $('#cs-map-status').value.trim() || (type === 'github' ? 'state' : 'status');

  // Cada tipo arma su url/path distinto
  let url, path, cfg, credRef, sourceLabel;
  if (type === 'github') {
    const repo = ($('#cs-repo').value.trim() || '').replace(/^\/+|\/+$/g, '');
    if (!listName || !/^[^/]+\/[^/]+$/.test(repo)) { toast('Repo inválido. Usa formato dueño/repo', 'err'); return; }
    credRef = 'gh_' + Date.now().toString(36);
    if (key) await api('/api/creds', { action: 'set', ref: credRef, values: { token: key } });
    cfg = {
      url: 'https://api.github.com', cred_ref: credRef,
      headers: key ? { Authorization: 'Bearer ${token}' } : {},
    };
    path = `repos/${repo}/issues?${$('#cs-path').value.trim() || 'state=open'}`;
    sourceLabel = `GitHub: ${repo}`;
  } else {
    url = $('#cs-url').value.trim();
    path = $('#cs-path').value.trim();
    if (!listName || !url) { toast('Faltan campos requeridos', 'err'); return; }
    credRef = (type === 'supabase' ? 'supa_' : 'http_') + Date.now().toString(36);
    if (key) {
      const credKey = type === 'supabase' ? 'anon_key' : 'auth';
      await api('/api/creds', { action: 'set', ref: credRef, values: { [credKey]: key } });
    }
    cfg = type === 'supabase'
      ? { url: url.replace(/\/+$/, '') + '/rest/v1', cred_ref: credRef,
          headers: { apikey: '${anon_key}', Authorization: 'Bearer ${anon_key}' } }
      : { url, cred_ref: credRef, headers: key ? { Authorization: '${auth}' } : {} };
    sourceLabel = `${type === 'supabase' ? 'Supabase' : 'HTTP'}: ${listName}`;
  }

  const sourceRes = await api('/api/source', { action: 'create', name: sourceLabel, type, config: cfg });
  const listRes = await api('/api/list', { action: 'create', space_id: spaceId, name: listName });
  await api('/api/source', {
    action: 'connect_list', list_id: listRes.id, source_id: sourceRes.id,
    path, mapping: { title: mapTitle, status: mapStatus },
  });
  closeModal();
  toast('Fuente conectada ✓');
  await refresh();
  nav('list', listRes.id);
}

async function addListPromptPicker() {
  if (!S.spaces.length) { toast('Crea primero un espacio', 'err'); return; }
  if (S.spaces.length === 1) return addListPrompt(S.spaces[0].id);
  // Mini-modal para elegir espacio
  showModal(`
    <h2>Nueva lista</h2>
    <div class="sec"><h4>¿En qué espacio?</h4>
      ${S.spaces.map(sp => `
        <button class="check-row" style="width:100%;text-align:left;border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;margin-bottom:6px;cursor:pointer;background:var(--surface)"
          onclick="closeModal();addListPrompt(${sp.id})">
          <span style="font-size:18px">${esc(sp.icon || '📁')}</span>
          <span style="font-weight:700">${esc(sp.name)}</span>
        </button>`).join('')}
    </div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-soft" onclick="closeModal()">Cancelar</button></div>`);
}
async function createFromModal() {
  const title = $('#nt-title').value.trim();
  if (!title) { toast('Ponle un nombre a la tarea', 'err'); return; }
  const listId = Number($('#nt-list').value);
  const r = await api('/api/task', { action: 'create', title, list_id: listId });
  closeModal();
  toast('Tarea creada ✓');
  await refresh();
  openTask(r.id);
}

/* ---------------------------------------------------------- diálogos propios (reemplazan prompt/confirm del navegador) */
// Capa independiente que se apila sobre cualquier modal (p.ej. Ajustes) sin reemplazarlo.
function _dialog(innerHtml, setup) {
  const wrap = document.createElement('div');
  wrap.className = 'ui-dialog-layer';
  wrap.innerHTML = `<div class="scrim"></div><div class="modal ui-dialog">${innerHtml}</div>`;
  document.body.appendChild(wrap);
  void wrap.offsetHeight;
  wrap.classList.add('open');
  setup(wrap, (cb) => { wrap.classList.remove('open'); setTimeout(() => { wrap.remove(); cb && cb(); }, 200); });
  return wrap;
}
function uiConfirm(opts) {
  opts = opts || {};
  return new Promise((res) => {
    _dialog(`
      <h2>${esc(opts.title || '¿Confirmar?')}</h2>
      ${opts.message ? `<p class="ui-dialog-msg">${esc(opts.message)}</p>` : ''}
      <div class="ui-dialog-actions">
        <button class="btn btn-soft" data-act="cancel">${esc(opts.cancelText || 'Cancelar')}</button>
        <button class="btn ${opts.danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${esc(opts.okText || 'Aceptar')}</button>
      </div>`, (w, close) => {
      w._uiClose = () => close(() => res(false));
      w.querySelector('[data-act=ok]').onclick = () => close(() => res(true));
      w.querySelector('[data-act=cancel]').onclick = w._uiClose;
      w.querySelector('.scrim').onclick = w._uiClose;
      setTimeout(() => w.querySelector('[data-act=ok]').focus(), 50);
    });
  });
}
function uiPrompt(opts) {
  opts = opts || {};
  return new Promise((res) => {
    _dialog(`
      <h2>${esc(opts.title || '')}</h2>
      <div class="sec">${opts.label ? `<h4>${esc(opts.label)}</h4>` : ''}
        <input type="text" data-el="input" value="${esc(opts.value || '')}" placeholder="${esc(opts.placeholder || '')}" maxlength="${opts.maxlength || 200}"></div>
      <div class="ui-dialog-actions">
        <button class="btn btn-soft" data-act="cancel">Cancelar</button>
        <button class="btn btn-primary" data-act="ok">${esc(opts.okText || 'Aceptar')}</button>
      </div>`, (w, close) => {
      const inp = w.querySelector('[data-el=input]');
      const submit = () => close(() => res(inp.value));
      const cancel = () => close(() => res(null));
      w._uiClose = cancel;
      w.querySelector('[data-act=ok]').onclick = submit;
      w.querySelector('[data-act=cancel]').onclick = cancel;
      w.querySelector('.scrim').onclick = cancel;
      inp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } };
      setTimeout(() => { inp.focus(); inp.select(); }, 50);
    });
  });
}
function _topDialog() { const ds = document.querySelectorAll('.ui-dialog-layer'); return ds.length ? ds[ds.length - 1] : null; }

/* ---------------------------------------------------------- sidebar colapsable */
function applySidebar() {
  document.body.classList.toggle('sidebar-collapsed', localStorage.getItem('carmin_sidebar') === '1');
}
function toggleSidebar() {
  const c = localStorage.getItem('carmin_sidebar') === '1';
  localStorage.setItem('carmin_sidebar', c ? '0' : '1');
  applySidebar();
}

/* ---------------------------------------------------------- modal genérico + ajustes */
function showModal(inner) {
  const layer = $('#modal-layer');
  // innerHTML PRIMERO (scrim nace en opacity:0), forzar reflow, luego .open
  // para que la transición de opacidad del scrim sí corra (antes aparecía de golpe).
  layer.innerHTML = `<div class="scrim" onclick="closeModal()"></div><div class="modal">${inner}</div>`;
  void layer.offsetHeight; // reflow
  layer.classList.add('open');
}
function closeModal() {
  const layer = $('#modal-layer');
  if (!layer.classList.contains('open')) { layer.innerHTML = ''; return; }
  layer.classList.remove('open');
  // Esperar a que el scrim se desvanezca antes de limpiar el DOM (salida suave).
  setTimeout(() => { if (!layer.classList.contains('open')) layer.innerHTML = ''; }, 200);
}

/* ---------------------------------------------------------- editor: configurar lista (tipo + columnas) */
let _cfDraft = null;          // borrador de columnas en memoria
let _cfListId = null;         // lista que se está editando
let _cfMeta = { icon: '', item_noun: '' }; // tipo de ítem e icono

function openCustomFieldsEditor(listId) {
  const l = listById(listId);
  if (!l) { toast('Esa lista ya no existe', 'err'); return; }
  _cfListId = listId;
  _cfDraft = JSON.parse(JSON.stringify(l.custom_fields || []));
  _cfMeta = { icon: l.icon || '', item_noun: l.item_noun || '' };
  renderCustomFieldsEditor(l);
}

function renderCustomFieldsEditor(l) {
  const fields = _cfDraft || [];
  const typeOpts = [
    ['text', 'Texto'],
    ['number', 'Número'],
    ['currency', 'Dinero'],
    ['date', 'Fecha'],
    ['url', 'Enlace'],
    ['checkbox', 'Casilla'],
    ['dropdown', 'Selector'],
  ];
  const rows = fields.map((f, i) => `
    <div class="cf-edit-row">
      <span class="cf-edit-handle" title="Tipo">${cfTypeIcon(f.type)}</span>
      <input type="text" value="${esc(f.name)}" placeholder="Nombre"
        onchange="cfDraftUpdate(${i}, 'name', this.value)" class="cf-input">
      <select onchange="cfDraftUpdate(${i}, 'type', this.value)" class="cf-input" style="max-width:140px">
        ${typeOpts.map(([v, lab]) => `<option value="${v}" ${f.type === v ? 'selected' : ''}>${lab}</option>`).join('')}
      </select>
      <button class="icon-btn btn-danger" onclick="cfDraftRemove(${i})" title="Quitar">${I.trash}</button>
      ${f.type === 'dropdown' ? cfDropdownOptions(f, i) : ''}
    </div>`).join('');
  showModal(`
    <h2>Configurar lista — ${esc(l.name)}</h2>
    <div class="faint" style="font-size:13px;margin-bottom:var(--space-4)">
      Convierte esta lista en un <strong>tipo</strong>: no solo tareas, sino contactos, viajes, gastos…
      El “ítem” define cómo se nombra cada fila; las columnas son su esquema (aparecen en la vista <strong>Tabla</strong> y en el panel).
    </div>
    <div class="sec" style="display:grid;grid-template-columns:90px 1fr;gap:12px">
      <div><h4>Icono</h4>
        <input type="text" id="cf-meta-icon" value="${esc(_cfMeta.icon)}" placeholder="📁" maxlength="4"
          oninput="_cfMeta.icon=this.value" style="text-align:center;font-size:18px">
      </div>
      <div><h4>Cada ítem es un…</h4>
        <input type="text" id="cf-meta-noun" value="${esc(_cfMeta.item_noun)}" placeholder="tarea (por defecto)"
          oninput="_cfMeta.item_noun=this.value">
      </div>
    </div>
    <div class="sec"><h4>Columnas (esquema del tipo)</h4>
      <div id="cf-rows">${rows || '<div class="faint" style="padding:12px 0">Sin columnas. Añade la primera ↓</div>'}</div>
    </div>
    <div class="sec">
      <button class="btn btn-ghost" onclick="cfDraftAdd()">${I.plus} Añadir columna</button>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
      <span class="faint" style="font-size:12px">Los valores que ya hayas escrito se conservan.</span>
      <div style="display:flex;gap:10px">
        <button class="btn btn-soft" onclick="closeModal();_cfDraft=null">Cancelar</button>
        <button class="btn btn-primary" onclick="cfDraftSave(${l.id})">Guardar</button>
      </div>
    </div>`);
}

function cfTypeIcon(t) {
  const map = { text: 'Aa', number: '123', currency: '$', date: '📅', url: '🔗', checkbox: '☑', dropdown: '▾' };
  return `<span style="font-weight:900;font-size:11px;color:var(--muted)">${map[t] || '?'}</span>`;
}

function cfDropdownOptions(f, fi) {
  const opts = f.options || [];
  return `<div class="cf-dropdown-opts">
    <div class="faint" style="font-size:11px;margin-bottom:4px">Opciones:</div>
    ${opts.map((o, oi) => `
      <div class="cf-opt-row">
        <input type="color" value="${esc(o.color || '#8B97A6')}" onchange="cfDraftOpt(${fi},${oi},'color',this.value)">
        <input type="text" value="${esc(o.label)}" placeholder="Etiqueta" onchange="cfDraftOpt(${fi},${oi},'label',this.value)" class="cf-input">
        <button class="icon-btn btn-danger" onclick="cfDraftOptRemove(${fi},${oi})" style="width:26px;height:26px">${I.x}</button>
      </div>`).join('')}
    <button class="btn btn-ghost" style="margin-top:4px;padding:4px 10px;min-height:auto;font-size:12px" onclick="cfDraftOptAdd(${fi})">${I.plus} Opción</button>
  </div>`;
}

function cfDraftAdd() {
  _cfDraft = _cfDraft || [];
  _cfDraft.push({ name: '', type: 'text' });
  refreshCfEditor();
}
function cfDraftRemove(i) {
  _cfDraft.splice(i, 1);
  refreshCfEditor();
}
function cfDraftUpdate(i, key, val) {
  _cfDraft[i][key] = val;
  if (key === 'type' && val === 'dropdown' && !_cfDraft[i].options) _cfDraft[i].options = [];
  refreshCfEditor();
}
function cfDraftOptAdd(fi) {
  _cfDraft[fi].options = _cfDraft[fi].options || [];
  _cfDraft[fi].options.push({ label: '', color: '#8B97A6' });
  refreshCfEditor();
}
function cfDraftOptRemove(fi, oi) {
  _cfDraft[fi].options.splice(oi, 1);
  refreshCfEditor();
}
function cfDraftOpt(fi, oi, key, val) {
  _cfDraft[fi].options[oi][key] = val;
  // No re-render para no perder el foco del input siguiente
}
function refreshCfEditor() {
  // Re-render manteniendo el modal abierto, sin perder el icono/sustantivo en edición.
  const ic = $('#cf-meta-icon'), nn = $('#cf-meta-noun');
  if (ic) _cfMeta.icon = ic.value;
  if (nn) _cfMeta.item_noun = nn.value;
  const l = listById(_cfListId);
  if (l) renderCustomFieldsEditor(l);
}
async function cfDraftSave(listId) {
  // Validar: cada campo necesita nombre
  for (const f of _cfDraft) {
    if (!String(f.name || '').trim()) { toast('Cada columna necesita un nombre', 'err'); return; }
  }
  // Lee los valores actuales por si no se disparó el onblur antes de guardar.
  const ic = $('#cf-meta-icon'), nn = $('#cf-meta-noun');
  const icon = ic ? ic.value : _cfMeta.icon;
  const item_noun = nn ? nn.value : _cfMeta.item_noun;
  try {
    await api('/api/list', { action: 'update', id: listId, icon, item_noun });
    await api('/api/list', { action: 'set_fields', id: listId, custom_fields: _cfDraft });
    _cfDraft = null;
    closeModal();
    toast('Lista configurada ✓');
    await refresh();
  } catch (e) {}
}

function openSettings() {
  const theme = S.settings.theme || 'dark';
  const accent = (S.settings.accent || '#E0314F').toLowerCase();
  const views = enabledViews();
  showModal(`
    <h2>Ajustes</h2>
    <div class="sec"><h4>Tu nombre</h4>
      <input type="text" value="${esc(S.settings.user_name || '')}" onchange="saveSetting('user_name',this.value)"></div>
    <div class="sec"><h4>Tema</h4>
      <div class="theme-cards">
        <div class="theme-card ${theme === 'dark' ? 'active' : ''}" data-theme="dark" onclick="setTheme('dark')"><div class="preview dark"></div>Dark Crimson</div>
        <div class="theme-card ${theme === 'light' ? 'active' : ''}" data-theme="light" onclick="setTheme('light')"><div class="preview light"></div>Blanco</div>
      </div></div>
    <div class="sec"><h4>Color de acento</h4>
      <div class="swatches">
        ${SWATCHES.map(c => `<div class="swatch ${c.toLowerCase() === accent ? 'active' : ''}" data-color="${c}" style="background:${c}" onclick="setAccent('${c}')"></div>`).join('')}
      </div></div>
    <div class="sec"><h4>Vistas activas (estilo ClickUp: tú decides)</h4>
      ${['lista', 'tablero', 'calendario', 'tabla'].map(v => `
        <label class="check-row"><input type="checkbox" ${views.includes(v) ? 'checked' : ''} onchange="toggleView('${v}',this)">
        ${v[0].toUpperCase() + v.slice(1)}</label>`).join('')}
      <div class="faint" style="font-size:12px">Inicio y Proyectos siempre están disponibles. Tabla es ideal para campos personalizados.</div></div>
    <div class="sec" id="status-edit-sec"><h4>Estados de tarea</h4>
      ${renderStatusEditList()}
      <button class="btn btn-ghost" onclick="addStatus()" style="margin-top:6px">${I.plus} Nuevo estado</button></div>
    <div class="sec" id="folder-edit-sec"><h4>Carpetas vigiladas</h4>
      ${renderFolderEditList()}
    </div>
    <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="closeModal()">Listo</button></div>`);
}

function renderStatusEditList() {
  return statuses().map(st => `
    <div class="status-edit-row" data-id="${st.id}">
      <input type="color" value="${st.color}" onchange="saveStatus(${st.id},'color',this.value)">
      <input type="text" value="${esc(st.name)}" onchange="saveStatus(${st.id},'name',this.value)">
      <select onchange="saveStatus(${st.id},'kind',this.value)">
        <option value="open" ${st.kind === 'open' ? 'selected' : ''}>Abierto</option>
        <option value="active" ${st.kind === 'active' ? 'selected' : ''}>Activo</option>
        <option value="done" ${st.kind === 'done' ? 'selected' : ''}>Hecho</option>
      </select>
      <button class="icon-btn" onclick="moveStatus(${st.id},-1)" title="Subir">↑</button>
      <button class="icon-btn" onclick="moveStatus(${st.id},1)" title="Bajar">↓</button>
      <button class="icon-btn btn-danger" onclick="deleteStatus(${st.id})">${I.trash}</button>
    </div>`).join('');
}
function renderFolderEditList() {
  if (!S.folders.length) return '<div class="faint">Ninguna aún — agrégalas en la vista Proyectos.</div>';
  return S.folders.map(f => `
    <div class="status-edit-row"><span style="flex:1;font-weight:500">${esc(f.name)} <span class="faint" style="font-size:12px">${esc(f.path)}</span></span>
    <button class="icon-btn btn-danger" onclick="removeFolderSettings(${f.id})">${I.trash}</button></div>`).join('');
}
function refreshStatusEditList() {
  const sec = document.querySelector('#status-edit-sec');
  if (!sec) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = renderStatusEditList();
  // Reemplaza solo las filas, no el botón "nuevo estado"
  [...sec.querySelectorAll('.status-edit-row')].forEach(el => el.remove());
  sec.querySelector('h4').insertAdjacentHTML('afterend', renderStatusEditList());
}
async function saveSetting(key, value) {
  S.settings[key] = value;
  await api('/api/setting', { key, value });
  renderSidebar();
  toast('Guardado ✓');
}
async function toggleView(v, el) {
  let views = enabledViews();
  if (el.checked) { if (!views.includes(v)) views.push(v); }
  else {
    views = views.filter(x => x !== v);
    if (!views.length) { views = [v]; el.checked = true; toast('Debe quedar al menos una vista', 'err'); }
  }
  const order = ['lista', 'tablero', 'calendario', 'tabla', 'panel', 'grafo', 'documento'];
  views.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  S.settings.views = JSON.stringify(views);
  await api('/api/setting', { key: 'views', value: S.settings.views });
  if (!views.includes(route.tab)) route.tab = views[0];
  renderTopbar();
}
async function saveStatus(id, field, value) {
  await api('/api/status', { action: 'update', id, [field]: value });
  await loadState();
  renderMain();
  // Actualiza solo las filas de estados en el modal, no todo
  const sec = document.querySelector('#status-edit-sec');
  if (sec) {
    [...sec.querySelectorAll('.status-edit-row')].forEach(el => el.remove());
    sec.querySelector('h4').insertAdjacentHTML('afterend', renderStatusEditList());
  }
}
async function moveStatus(id, dir) {
  await api('/api/status', { action: 'move', id, dir });
  await loadState();
  renderMain();
  const sec = document.querySelector('#status-edit-sec');
  if (sec) {
    [...sec.querySelectorAll('.status-edit-row')].forEach(el => el.remove());
    sec.querySelector('h4').insertAdjacentHTML('afterend', renderStatusEditList());
  }
}
async function deleteStatus(id) {
  const n = S.tasks.filter(t => t.status_id === id).length;
  if (!await uiConfirm({ title: '¿Eliminar este estado?', message: n ? `Sus ${n} tareas pasarán al primer estado.` : '', okText: 'Eliminar', danger: true })) return;
  try { await api('/api/status', { action: 'delete', id }); } catch (e) { return; }
  await loadState();
  renderMain();
  const sec = document.querySelector('#status-edit-sec');
  if (sec) {
    [...sec.querySelectorAll('.status-edit-row')].forEach(el => el.remove());
    sec.querySelector('h4').insertAdjacentHTML('afterend', renderStatusEditList());
  }
}
async function addStatus() {
  const name = await uiPrompt({ title: 'Nuevo estado', label: 'Nombre del estado', placeholder: 'Ej: BLOQUEADO', okText: 'Crear estado' });
  if (!name || !name.trim()) return;
  await api('/api/status', { action: 'create', name: name.trim(), color: '#8B97A6', kind: 'open' });
  await loadState();
  renderMain();
  const sec = document.querySelector('#status-edit-sec');
  if (sec) {
    [...sec.querySelectorAll('.status-edit-row')].forEach(el => el.remove());
    sec.querySelector('h4').insertAdjacentHTML('afterend', renderStatusEditList());
  }
}
async function removeFolderSettings(id) {
  await api('/api/folder', { action: 'delete', id });
  MDdata = null;
  await loadState();
  renderSidebar();
  const sec = document.querySelector('#folder-edit-sec');
  if (sec) sec.innerHTML = '<h4>Carpetas vigiladas</h4>' + renderFolderEditList();
}

/* ---------------------------------------------------------- arranque */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const dlg = _topDialog();
    if (dlg && dlg._uiClose) return dlg._uiClose();   // diálogos propios primero
    if (document.querySelector('.popover')) return closePopovers();
    if ($('#modal-layer').classList.contains('open')) return closeModal();
    if (openTaskId) return closeTask();
  }
});
window.addEventListener('focus', () => {
  const a = document.activeElement;
  const typing = a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA');
  if (!typing && S) refresh();
});

applySidebar();
loadState().then(() => {
  const exp = expandedSet();
  if (!localStorage.getItem(expKey)) {
    S.spaces.forEach(sp => exp.add(sp.id));
    localStorage.setItem(expKey, JSON.stringify([...exp]));
  }
  render();
  loadMD().catch(() => {});
});
