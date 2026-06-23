const screensData = window.screensData;
const meta = window.meta;

const screensById = Object.fromEntries(screensData.map(s => [s.id, s]));

// Add custom screen if not present
if (!screensById['us36-custom']) {
  screensById['us36-custom'] = { id: 'us36-custom', us: 'US36c', title: 'Nueva sesión', frameAttrs: '', html: '' };
}
if (!screensById['configuracion']) {
  screensById['configuracion'] = { id: 'configuracion', us: 'C', title: 'Configuración', frameAttrs: '', html: '' };
}
if (!screensById['sesiones-tutor']) {
  screensById['sesiones-tutor'] = { id: 'sesiones-tutor', us: 'C', title: 'Mis Sesiones', frameAttrs: '', html: '' };
}
if (!screensById['buscar-solicitudes']) {
  screensById['buscar-solicitudes'] = { id: 'buscar-solicitudes', us: 'C', title: 'Solicitudes', frameAttrs: '', html: '' };
}
if (!screensById['admin-login']) {
  screensById['admin-login'] = { id: 'admin-login', us: 'Admin', title: 'Acceso administrador', frameAttrs: '', html: '' };
}
if (!screensById['us49']) {
  screensById['us49'] = { id: 'us49', us: 'US49', title: 'Borrar cuenta', frameAttrs: '', html: '' };
}

const navigation = meta.navigation;

const MAIN_NAV = {
  Inicio: 'us15',
  Buscar: 'us11',
  Solicitudes: 'us19',
  Chats: 'us24',
  Perfil: 'us07',
};

const EXCLUDE_BOTTOM_NAV = new Set(['us45', 'us01', 'us01b', 'us02', 'us03', 'us41', 'us42', 'us43', 'us44', 'admin-login']);
const EXCLUDE_BACK = new Set(['us45', 'us15', 'us41', 'admin-login']);

const FALLBACK_BACK = {
  us02: 'us45',
  us15: 'us45',
  us24: 'us15',
  us39: 'us15',
  us41: 'us15',
};

const UNIVERSITIES = ['UNMSM', 'UNI', 'PUCP', 'UPC'];
const CAREERS = [
  'Medicina',
  'Ingeniería Civil',
  'Ingeniería de Software',
  'Ingeniería Industrial',
  'Ingeniería Mecánica',
  'Ingeniería Eléctrica',
  'Ingeniería de Sistemas',
  'Derecho',
  'Administración',
  'Psicología',
  'Enfermería',
  'Arquitectura',
];
const CYCLES = Array.from({ length: 10 }, (_, i) => `${i + 1}° ciclo`);
const SUBJECTS = [
  'Matemática Básica',
  'Cálculo I', 'Cálculo II', 'Cálculo III', 'Cálculo IV',
  'Física I', 'Física II',
  'Química General',
  'Química Orgánica',
  'Estadística',
  'Probabilidades',
  'Álgebra Lineal',
  'Programación I',
  'Base de Datos',
  'Economía',
  'Contabilidad',
];

const TUTORS_DATA = [
  { id:'t01', initials:'AP', name:'Andrea Paredes', univ:'PUCP', career:'Ing. Industrial', cycle:'7° ciclo', rating:4.9, reviews:32, course:'Cálculo Diferencial', bio:'Me especializo en Cálculo, Álgebra y Estadística. He dado más de 80 tutorías y me encanta encontrar formas creativas de explicar conceptos complejos.', subjects:['Cálculo Diferencial','Cálculo Integral','Álgebra Lineal'], avail:['Lunes','Miércoles','Viernes'], schedule:'Tarde (12 PM – 6 PM)', credits:3, color:'linear-gradient(135deg,#f4d4d8,#8B1A2B)', reviewsList:[{name:'Carlos M.',rating:5,text:'Excelente tutora, explica muy bien y tiene mucha paciencia.'},{name:'Valeria R.',rating:5,text:'Gracias a Andrea pude aprobar mi examen parcial de Cálculo.'}] },
  { id:'t02', initials:'LM', name:'Luis Mendoza', univ:'UNMSM', career:'Ciencias Físicas', cycle:'Egresado', rating:4.5, reviews:18, course:'Cálculo Diferencial', bio:'Me apasiona la física teórica y el cálculo aplicado. Con más de 2 años de experiencia como tutor, tengo metodologías probadas para que los conceptos difíciles parezcan sencillos.', subjects:['Cálculo Diferencial','Física General','Mecánica Clásica'], avail:['Martes','Jueves','Sábado'], schedule:'Mañana (8 AM – 12 PM)', credits:2, color:'linear-gradient(135deg,#c8daf4,#3a6bb5)', reviewsList:[{name:'Pedro A.',rating:5,text:'Luis tiene una manera increíble de explicar Física.'},{name:'María F.',rating:4,text:'Muy buen tutor, puntual y organizado.'}] },
  { id:'t03', initials:'KR', name:'Karen Ríos', univ:'UPC', career:'Ing. de Sistemas', cycle:'4° ciclo', rating:4.2, reviews:9, course:'Cálculo Diferencial', bio:'Estudiante de 4to año de Ing. de Sistemas en la UPC. Me especializo en programación y cálculo. Tengo experiencia como monitora en mi universidad.', subjects:['Cálculo Diferencial','Programación en Python','Bases de Datos'], avail:['Lunes','Martes','Viernes'], schedule:'Noche (6 PM – 10 PM)', credits:2, color:'linear-gradient(135deg,#d4f4e4,#2a8a55)', reviewsList:[{name:'Diego L.',rating:5,text:'Karen explica programación de forma muy clara, ideal para principiantes.'},{name:'Ana P.',rating:4,text:'Buena tutora, muy paciente y siempre dispuesta a resolver dudas.'}] },
  { id:'t04', initials:'MS', name:'Marco Silva', univ:'UTEC', career:'Cs. de la Computación', cycle:'6° ciclo', rating:4.7, reviews:25, course:'Programación', bio:'Apasionado por los algoritmos y estructuras de datos. Trabajo como desarrollador junior y enseño lo que aplico en el mundo real.', subjects:['Python','Estructuras de Datos','Algoritmos','JavaScript'], avail:['Lunes','Miércoles','Sábado'], schedule:'Mañana y Tarde', credits:3, color:'linear-gradient(135deg,#fde8c8,#d68a2a)', reviewsList:[{name:'Sofía T.',rating:5,text:'Marco tiene mucha paciencia y explica con ejemplos reales.'},{name:'Rodrigo B.',rating:4,text:'Muy bueno con Python y algoritmos, lo recomiendo.'}] },
  { id:'t05', initials:'VC', name:'Valeria Cruz', univ:'UPC', career:'Ing. de Software', cycle:'8° ciclo', rating:4.8, reviews:41, course:'Programación', bio:'Especialista en desarrollo web y móvil. He dado tutorías a más de 100 estudiantes y me encanta enseñar programación desde cero.', subjects:['HTML/CSS','JavaScript','React','Node.js'], avail:['Martes','Jueves','Domingo'], schedule:'Tarde y Noche', credits:3, color:'linear-gradient(135deg,#e8d4f4,#7a2a8b)', reviewsList:[{name:'Miguel A.',rating:5,text:'Valeria es increíble enseñando JavaScript, super didáctica.'},{name:'Lucía M.',rating:5,text:'Con Valeria empecé de cero en programación y ahora tengo mi primer proyecto.'}] },
  { id:'t06', initials:'DH', name:'Diego Huanca', univ:'UNMSM', career:'Ing. de Sistemas', cycle:'5° ciclo', rating:4.4, reviews:14, course:'Programación', bio:'Estudiante de Sistemas con experiencia en desarrollo backend. Enseño C++, Python y bases de datos relacionales.', subjects:['C++','Python','SQL','Bases de Datos'], avail:['Lunes','Miércoles','Viernes'], schedule:'Noche', credits:2, color:'linear-gradient(135deg,#c8f4e0,#2a7a5a)', reviewsList:[{name:'Fátima G.',rating:4,text:'Diego explica bien los conceptos de C++ y bases de datos.'},{name:'Ernesto P.',rating:5,text:'Muy buen profesor, me ayudó a entender SQL.'}] },
  { id:'t07', initials:'CV', name:'Carmen Vargas', univ:'PUCP', career:'Física', cycle:'Egresada', rating:4.6, reviews:28, course:'Física General', bio:'Egresada de Física con maestría en curso. He enseñado Física en pre-universitarias y universidades por 3 años.', subjects:['Física General','Mecánica','Electromagnetismo','Termodinámica'], avail:['Lunes','Martes','Jueves'], schedule:'Mañana (8 AM – 1 PM)', credits:3, color:'linear-gradient(135deg,#f4f0c8,#8b7a1a)', reviewsList:[{name:'Jorge R.',rating:5,text:'Carmen tiene mucha experiencia, hace que la física sea fácil.'},{name:'Paola N.',rating:4,text:'Muy buena profesora, puntual y bien preparada.'}] },
  { id:'t08', initials:'RL', name:'Roberto Llanos', univ:'UNI', career:'Ing. Mecánica', cycle:'9° ciclo', rating:4.3, reviews:11, course:'Física General', bio:'Estudiante de Ing. Mecánica en la UNI. Me especializo en mecánica clásica y física aplicada a la ingeniería.', subjects:['Física General','Mecánica Clásica','Dinámica'], avail:['Miércoles','Viernes','Sábado'], schedule:'Tarde', credits:2, color:'linear-gradient(135deg,#c8e4f4,#2a5a8b)', reviewsList:[{name:'César H.',rating:4,text:'Roberto es bueno explicando mecánica con diagramas de cuerpo libre.'},{name:'Daniela V.',rating:4,text:'Buen tutor, claro con los ejercicios prácticos.'}] },
  { id:'t09', initials:'SP', name:'Sofía Parodi', univ:'UNMSM', career:'Ciencias Físicas', cycle:'7° ciclo', rating:4.5, reviews:19, course:'Física General', bio:'Apasionada por la física teórica. Enseño con enfoque en entender los fenómenos antes de memorizar fórmulas.', subjects:['Física General','Ondas y Óptica','Física Moderna'], avail:['Lunes','Miércoles','Sábado'], schedule:'Tarde y Noche', credits:2, color:'linear-gradient(135deg,#f4c8e4,#8b2a6a)', reviewsList:[{name:'Alejandro Q.',rating:5,text:'Sofía hace que la física moderna sea muy comprensible.'},{name:'Ximena F.',rating:4,text:'Muy buena tutora, siempre llega preparada con ejemplos.'}] },
];

function getScreenIdFromPath() {
  const bodyId = document.body.dataset.screenId;
  if (bodyId && screensById[bodyId]) return bodyId;
  const filename = window.location.pathname.split('/').pop();
  const id = filename.replace('.html', '');
  if (screensById[id]) return id;
  return meta.defaultScreen;
}

let currentScreen = getScreenIdFromPath();

// Apply visual view mode on load
const viewMode = localStorage.getItem('appView') || 'pc';
document.body.classList.remove('view-pc', 'view-movil');
document.body.classList.add('view-' + viewMode);

function getNav(screenId) {
  return { ...MAIN_NAV, ...(navigation[screenId] || {}) };
}

function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const el = document.querySelector('#appFrame .bar span');
  if (el) el.textContent = `${h}:${m}`;
}
setInterval(updateClock, 60000);

function navigateTo(screenId) {
  if (!screensById[screenId]) return;
  window.location.href = screenId + '.html';
}

function goBack() {
  window.history.back();
}

function createBottomNav() {
  const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const isTutor = u && u.role === 'tutor';
  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Navegación principal');
  nav.innerHTML = `
    <div class="it" data-label="Inicio"><span class="gl">🏠</span>Inicio</div>
    <div class="it" data-label="${isTutor ? 'Solicitudes' : 'Buscar'}"><span class="gl">${isTutor ? '📩' : '🔍'}</span>${isTutor ? 'Solicitudes' : 'Buscar'}</div>
    <div class="it" data-label="Chats"><span class="gl">💬</span>Chats</div>
    <div class="it" data-label="Perfil"><span class="gl">👤</span>Perfil</div>
  `;
  return nav;
}

function injectBottomNav(frame, screenId) {
  if (EXCLUDE_BOTTOM_NAV.has(screenId)) return;
  if (frame.querySelector('.nav')) return;
  frame.appendChild(createBottomNav());
}

function ensureBackButton(frame, screenId) {
  if (EXCLUDE_BACK.has(screenId)) return;
  if (frame.querySelector('.back')) return;

  const scr = frame.querySelector('.scr');
  if (!scr) return;

  let head = scr.querySelector('.head');
  if (!head) {
    head = document.createElement('div');
    head.className = 'head head--injected';
    const title = screensById[screenId]?.title || 'Volver';
    head.innerHTML = `<span class="back" role="button" tabindex="0" aria-label="Volver">‹</span><h2>${title}</h2>`;
    scr.insertBefore(head, scr.firstChild);
  } else {
    const back = document.createElement('span');
    back.className = 'back';
    back.setAttribute('role', 'button');
    back.setAttribute('tabindex', '0');
    back.setAttribute('aria-label', 'Volver');
    back.textContent = '‹';
    head.insertBefore(back, head.firstChild);
  }
}

function buildSelect(options, selectedText) {
  const select = document.createElement('select');
  select.className = 'field-select';
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    if (selectedText && (opt === selectedText || selectedText.includes(opt))) {
      o.selected = true;
    }
    select.appendChild(o);
  });
  return select;
}

function replaceInputDiv(inputDiv, element) {
  inputDiv.classList.remove('input');
  inputDiv.classList.add('input-wrap');
  inputDiv.innerHTML = '';
  inputDiv.appendChild(element);
}

function enhanceFormFields(frame, screenId) {
  frame.querySelectorAll('.form-field').forEach(field => {
    const label = field.querySelector('label')?.textContent.trim() || '';
    const inputDiv = field.querySelector('.input');
    if (!inputDiv || inputDiv.querySelector('input, select, textarea')) return;

    const text = inputDiv.textContent.trim().replace(/▾/g, '').trim();
    const lower = label.toLowerCase();

    if (/correo/i.test(lower)) {
      const input = document.createElement('input');
      input.type = 'email';
      input.placeholder = 'tu.correo@universidad.edu.pe';
      input.value = text.includes('@') ? text : '';
      input.autocomplete = 'email';
      replaceInputDiv(inputDiv, input);
      return;
    }

    if (/contraseña/i.test(lower)) {
      const input = document.createElement('input');
      input.type = 'password';
      input.placeholder = 'Escribe tu contraseña';
      input.autocomplete = lower.includes('actual') ? 'current-password' : 'new-password';
      replaceInputDiv(inputDiv, input);
      return;
    }

    if (/^nombre/i.test(lower) || lower === 'nombres y apellidos') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Tu nombre completo';
      input.value = text && !text.includes('•') ? text : '';
      input.autocomplete = 'name';
      replaceInputDiv(inputDiv, input);
      return;
    }

    if (/bio/i.test(lower)) {
      const ta = document.createElement('textarea');
      ta.rows = 3;
      ta.placeholder = 'Cuéntanos sobre ti…';
      ta.value = text;
      replaceInputDiv(inputDiv, ta);
      return;
    }

    if (/mensaje/i.test(lower)) {
      const ta = document.createElement('textarea');
      ta.rows = 3;
      ta.placeholder = 'Escribe tu mensaje…';
      ta.value = text && text !== 'Hola, esta semana estoy en parciales…' ? text : '';
      if (!ta.value) ta.value = text;
      replaceInputDiv(inputDiv, ta);
      return;
    }

    if (label === 'Universidad' || (lower.includes('universidad') && !lower.includes('·'))) {
      const select = buildSelect(UNIVERSITIES, text);
      replaceInputDiv(inputDiv, select);
      return;
    }

    if (label === 'Carrera' || lower === 'carrera') {
      const select = buildSelect(CAREERS, text);
      replaceInputDiv(inputDiv, select);
      return;
    }

    if (label === 'Ciclo' || lower === 'ciclo') {
      const select = buildSelect(CYCLES, text);
      replaceInputDiv(inputDiv, select);
      return;
    }

    if (!inputDiv.querySelector('.ic') && text && !text.startsWith('+')) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = text.includes('•') ? '' : text;
      input.placeholder = label || 'Escribe aquí…';
      replaceInputDiv(inputDiv, input);
    }
  });

  frame.querySelectorAll('.scr > .input, .scr .input.mt, .col > .input').forEach(inputDiv => {
    if (inputDiv.closest('.form-field') || inputDiv.querySelector('input, textarea')) return;
    const icon = inputDiv.querySelector('.ic');
    const text = inputDiv.textContent.trim();

    if (icon || /buscar/i.test(text)) {
      const input = document.createElement('input');
      input.type = 'search';
      input.className = 'field-search';
      const placeholder = text.replace(/🔍/g, '').trim() || 'Buscar…';
      input.placeholder = placeholder;
      if (!/…|\.\.\./.test(placeholder)) input.value = placeholder;
      replaceInputDiv(inputDiv, input);
      return;
    }

    if (text.startsWith('+')) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = text;
      replaceInputDiv(inputDiv, input);
    }
  });

  if (screenId === 'us05') {
    enhanceSubjectChips(frame);
  }

  if (screenId === 'us12') {
    frame.querySelectorAll('.ckline').forEach(line => {
      if (line.textContent.includes('USIL')) {
        line.innerHTML = '<span class="ck"></span>UNI';
      }
    });
  }
}

function enhanceSubjectChips(frame) {
  const labels = [...frame.querySelectorAll('.section-label')];
  const learnLabel = labels.find(l => /quiero aprender/i.test(l.textContent));
  const chipsContainer = learnLabel?.nextElementSibling;
  if (!chipsContainer?.classList.contains('chips') || chipsContainer.dataset.enhanced) return;
  chipsContainer.dataset.enhanced = '1';

  const selected = new Set();
  chipsContainer.querySelectorAll('.chip.on').forEach(chip => {
    selected.add(chip.textContent.replace(/✕/g, '').trim());
  });

  chipsContainer.innerHTML = '';

  SUBJECTS.forEach(subject => {
    const chip = document.createElement('span');
    chip.className = 'chip' + (selected.has(subject) ? ' on' : '');
    chip.textContent = subject;
    chip.addEventListener('click', () => chip.classList.toggle('on'));
    chipsContainer.appendChild(chip);
  });

  const addChip = document.createElement('span');
  addChip.className = 'chip chip-add';
  addChip.textContent = '+ Agregar materia';
  addChip.addEventListener('click', () => {
    const custom = prompt('¿Qué materia quieres agregar?');
    if (!custom?.trim()) return;
    const chip = document.createElement('span');
    chip.className = 'chip on';
    chip.textContent = custom.trim();
    chip.addEventListener('click', () => chip.classList.toggle('on'));
    chipsContainer.insertBefore(chip, addChip);
  });
  chipsContainer.appendChild(addChip);
}

function updateSidebarActive(screenId) {
  document.querySelectorAll('.hu-link, .sidebar-main-link').forEach(link => {
    const isActive = link.dataset.screen === screenId;
    link.classList.toggle('active', isActive);
    
    if (isActive) {
      const parentGroup = link.closest('.hu-group');
      if (parentGroup) {
        parentGroup.classList.remove('collapsed');
      }
    }
  });
  const titleEl = document.getElementById('screenTitle');
  if (titleEl) {
    const screen = screensById[screenId];
    titleEl.textContent = screen ? `${screen.us} · ${screen.title}` : '';
  }
}

function buildHuSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (!sidebar) return;

  sidebar.innerHTML = '';

  const logo = document.createElement('div');
  logo.className = 'sidebar-logo';
  logo.innerHTML = '<a href="index.html">Swaply</a><span>Historias de Usuario</span>';
  sidebar.appendChild(logo);

  const mainLinks = document.createElement('nav');
  mainLinks.className = 'sidebar-main-nav';
  mainLinks.setAttribute('aria-label', 'Secciones principales');
  const sidebarUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const sidebarIsAdmin = sidebarUser && sidebarUser.role === 'admin';
  const sidebarIsTutor = sidebarUser && sidebarUser.role === 'tutor';
  const icons = { Inicio: '🏠', Buscar: '🔍', Solicitudes: '📩', Chats: '💬', Perfil: '👤', Panel: '📊', Verificar: '✅', Reportes: '⚑', Universidades: '🏫' };
  const sidebarNav = sidebarIsAdmin
    ? [['Panel', 'us41'], ['Verificar', 'us42'], ['Reportes', 'us43'], ['Universidades', 'us44']]
    : [
        ['Inicio', 'us15'],
        sidebarIsTutor ? ['Solicitudes', 'us19'] : ['Buscar', 'us11'],
        ['Chats', 'us24'],
        ['Perfil', 'us07'],
      ];
  sidebarNav.forEach(([label, id]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sidebar-main-link';
    btn.dataset.screen = id;
    btn.innerHTML = `<span>${icons[label]}</span>${label}`;
    btn.addEventListener('click', () => {
      navigateTo(id);
      sidebar.classList.remove('open');
    });
    mainLinks.appendChild(btn);
  });
  sidebar.appendChild(mainLinks);

  const modifiedScreenIds = new Set(['us45', 'us01', 'us02', 'us04', 'us05', 'us06', 'us09', 'us10', 'us11', 'us15', 'us26', 'us28', 'us30', 'us31', 'us32', 'us33', 'us34', 'us36-custom']);

  meta.epics.forEach(epic => {
    const epicScreens = [];
    epic.screens.forEach(screenId => {
      if (screensById[screenId]) {
        epicScreens.push(screensById[screenId]);
      }
      Object.values(screensById).forEach(s => {
        if (s.id.startsWith(screenId + '-') && !epicScreens.includes(s)) {
          epicScreens.push(s);
        }
      });
    });

    if (epicScreens.length === 0) return;

    const hasActiveScreen = epicScreens.some(s => s.id === currentScreen);
    const group = document.createElement('div');
    group.className = 'hu-group' + (hasActiveScreen ? '' : ' collapsed');

    const heading = document.createElement('button');
    heading.type = 'button';
    heading.className = 'hu-group-title';
    
    const modifiedCount = epicScreens.filter(s => modifiedScreenIds.has(s.id)).length;
    const totalCount = epicScreens.length;
    
    heading.innerHTML = `📁 ${epic.id} · ${epic.name} <span style="float: right; font-size: 10px; opacity: 0.7;">(${modifiedCount}/${totalCount})</span>`;
    heading.addEventListener('click', () => group.classList.toggle('collapsed'));

    const list = document.createElement('div');
    list.className = 'hu-list';

    epicScreens.forEach(screen => {
      const isMod = modifiedScreenIds.has(screen.id);
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'hu-link';
      link.dataset.screen = screen.id;
      link.classList.toggle('active', screen.id === currentScreen);
      
      const statusIcon = isMod ? '✨' : '⏳';
      const boldStyle = isMod ? 'font-weight: 600; color: #fff;' : '';

      link.innerHTML = `
        <span class="hu-id" style="display: flex; align-items: center; gap: 4px;">
          <span>${statusIcon}</span>
          <span>${screen.us}</span>
        </span>
        <span class="hu-name" style="${boldStyle}">${screen.title}</span>
      `;

      link.addEventListener('click', () => {
        navigateTo(screen.id);
        sidebar.classList.remove('open');
      });
      list.appendChild(link);
    });

    group.appendChild(heading);
    group.appendChild(list);
    sidebar.appendChild(group);
  });

  const huToggleBtn = document.getElementById('huToggle');
  if (huToggleBtn) {
    const totalScreens = Object.keys(screensById).length;
    const modifiedScreensCount = Object.keys(screensById).filter(id => modifiedScreenIds.has(id)).length;
    huToggleBtn.textContent = `${modifiedScreensCount}/${totalScreens} HU`;
  }
}

function renderScreen(screenId) {
  const screen = screensById[screenId];
  if (!screen) return;

  document.title = `${screen.title} — Swaply`;

  const frame = document.getElementById('appFrame');
  frame.classList.add('is-transitioning');

  if (screen.frameAttrs.includes('background:var(--ink)')) {
    frame.dataset.theme = 'dark';
  } else {
    frame.dataset.theme = 'light';
  }

  frame.innerHTML = screen.html;
  updateClock();
  ensureBackButton(frame, screenId);
  enhanceFormFields(frame, screenId);
  injectBottomNav(frame, screenId);
  bindInteractions(frame, screenId);
  updateBottomNav(frame, screenId);
  updateSidebarActive(screenId);

  requestAnimationFrame(() => {
    frame.classList.remove('is-transitioning');
  });
}

function updateBottomNav(frame, screenId) {
  const nav = getNav(screenId);
  frame.querySelectorAll('.nav .it').forEach(item => {
    const label = item.dataset.label || item.textContent.trim();
    const target = nav[label];
    item.classList.toggle('on', target === screenId);
  });
}

function bindInteractions(container, screenId) {
  const nav = getNav(screenId);

  container.querySelectorAll('.back').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); goBack(); });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goBack(); }
    });
  });

  const SKIP_IDS = new Set(['btn-login-submit', 'btn-register-submit', 'btn-logout-submit', 'btn-submit-rating', 'btn-submit-apprentice-rating', 'btn-schedule-confirm', 'btn-reminder-done', 'btn-nueva-sesion', 'btn-save-profile', 'btn-dark', 'btn-privacy', 'btn-save-photo', 'btn-solicitar-sesion', 'btn-logout-us07', 'btn-delete-si', 'btn-delete-no', 'btn-delete-account', 'btn-send-solicitud', 'btn-cancel-solicitud', 'btn-us17-aceptar', 'btn-us17-rechazar', 'btn-us18-cancelar', 'btn-us18-confirmar', 'btn-mark-complete', 'btn-rate-session', 'btn-save-reminder', 'btn-send-code', 'btn-update-pass', 'btn-save-privacy', 'btn-us20-si', 'btn-us20-no', 'btn-us25-si', 'btn-us25-no', 'chat-send-btn', 'btn-us35-enviar', 'chat-attach-btn', 'btn-us37-aceptar', 'btn-save-notif', 'btn-ver-historial', 'btn-us39-ganar', 'btn-us39-historial', 'btn-go-notif', 'btn-us39-mark-read', 'btn-us36-historial', 'btn-us07-settings', 'btn-us42-aprobar', 'btn-us42-rechazar', 'btn-nueva-univ', 'btn-admin-login', 'btn-admin-logout', 'btn-logout-yes', 'btn-logout-no']);
  container.querySelectorAll('.btn, .btn.ghost, .btn.sm').forEach(btn => {
    if (btn.id && SKIP_IDS.has(btn.id)) return;
    const text = btn.textContent.trim();
    if (nav[text]) {
      btn.setAttribute('data-nav', nav[text]);
      btn.addEventListener('click', () => navigateTo(nav[text]));
    }
  });

  container.querySelectorAll('.nav .it').forEach(item => {
    const label = item.dataset.label || item.textContent.trim();
    const target = nav[label];
    if (target) {
      item.addEventListener('click', () => navigateTo(target));
    }
  });

  container.querySelectorAll('.card').forEach(card => {
    const nameEl = card.querySelector('.name');
    if (!nameEl) return;
    const fullName = nameEl.textContent.trim();
    const parts = fullName.split(/\s/);
    const shortName = parts[0] + ' ' + (parts[1]?.charAt(0) + '.' || '');
    const target = nav[fullName] || nav[shortName] || nav[parts[0] + ' ' + parts[1]];
    if (target) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => navigateTo(target));
    }
  });

  container.querySelectorAll('.row-line').forEach(row => {
    const text = row.querySelector('.l')?.textContent.trim();
    if (text && nav[text]) {
      row.addEventListener('click', () => navigateTo(nav[text]));
    }
  });

  container.querySelectorAll('.center.small b, .center.small').forEach(el => {
    const text = el.textContent.trim();
    if (nav[text]) {
      el.addEventListener('click', () => navigateTo(nav[text]));
    }
  });

  container.querySelectorAll('[style*="text-decoration:underline"]').forEach(el => {
    const text = el.textContent.trim();
    Object.keys(nav).forEach(key => {
      if (text.includes(key) || key.includes(text)) {
        el.addEventListener('click', () => navigateTo(nav[key]));
      }
    });
  });

  container.querySelectorAll('.tabs .t').forEach(tab => {
    const text = tab.textContent.trim();
    if (nav[text]) {
      tab.addEventListener('click', () => navigateTo(nav[text]));
    }
  });
}

document.getElementById('huToggle')?.addEventListener('click', () => {
  document.getElementById('appSidebar')?.classList.toggle('open');
});

let welcomeInterval = null;

// Seed admin user if not exists
(function seedAdmin() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (!users.find(u => u.role === 'admin')) {
    users.push({ name: 'Admin Swaply', email: 'admin@swaply.pe', password: 'admin123', role: 'admin' });
    localStorage.setItem('users', JSON.stringify(users));
  }
})();

// buildHuSidebar(); // HU sidebar removed

document.getElementById('btnSettings')?.addEventListener('click', () => navigateTo('configuracion'));

// On static HTML pages, the content is already in the frame — just wire up interactions
const _initFrame = document.getElementById('appFrame');
if (_initFrame) {
  updateClock();
  ensureBackButton(_initFrame, currentScreen);
  injectBottomNav(_initFrame, currentScreen);
  bindInteractions(_initFrame, currentScreen);
  updateBottomNav(_initFrame, currentScreen);
  setupCustomFlows(_initFrame, currentScreen);
  const screenTitleEl = document.getElementById('screenTitle');
  if (screenTitleEl) {
    screenTitleEl.textContent = screenTitleEl.textContent.replace(/^US\d+[a-z]?\s*[·•]\s*/i, '').trim();
  }
}

function setupCustomFlows(frame, screenId) {
  if (welcomeInterval) {
    clearInterval(welcomeInterval);
    welcomeInterval = null;
  }

  const user = JSON.parse(localStorage.getItem('currentUser')) || null;

  if (screenId === 'admin-login') {
    const btn = frame.querySelector('#btn-admin-login');
    const passInput = frame.querySelector('#admin-pass');
    const errorDiv = frame.querySelector('#admin-error');
    if (btn) btn.addEventListener('click', () => {
      if (passInput && passInput.value === '1234') {
        const adminUser = { name: 'Admin Swaply', email: 'admin@swaply.pe', password: 'admin', role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.location.href = 'us41.html';
      } else {
        if (errorDiv) errorDiv.style.display = 'flex';
      }
    });
    if (passInput) passInput.addEventListener('keydown', e => { if (e.key === 'Enter') btn?.click(); });
  }

  else if (screenId === 'us45') {
    history.length = 0; // Clear history on welcome
    const welcomeTitle = frame.querySelector('#welcome-carousel-title');
    const welcomeDesc = frame.querySelector('#welcome-carousel-desc');
    const dotsContainer = frame.querySelector('.dots');
    
    const btns = frame.querySelectorAll('.btn');
    if (btns.length >= 2) {
      btns[0].textContent = 'Crear cuenta';
      btns[0].onclick = (e) => { e.preventDefault(); navigateTo('us01'); };
      btns[1].textContent = 'Iniciar sesión';
      btns[1].onclick = (e) => { e.preventDefault(); navigateTo('us02'); };
    }
    
    frame.querySelector('#btn-admin-access')?.addEventListener('click', () => navigateTo('us02'));

    if (dotsContainer) {
      dotsContainer.innerHTML = '<i class="on"></i><i></i><i></i>';
    }
    
    const slides = [
      { title: "Intercambia conocimiento entre universidades", desc: "Conecta con estudiantes de otras casas de estudio. Aprende lo que necesitas, enseña lo que dominas." },
      { title: "Estudio seguro", desc: "Advertencia: Evita estudiar en lugares privados con personas que no conoces." },
      { title: "Aprendizaje sin límites", desc: "Promueve el aprendizaje y estudio general entre personas de cualquier carrera o universidad." }
    ];
    let currentSlide = 0;
    welcomeInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      if (welcomeTitle) welcomeTitle.textContent = slides[currentSlide].title;
      if (welcomeDesc) welcomeDesc.textContent = slides[currentSlide].desc;
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('i');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('on', idx === currentSlide);
        });
      }
    }, 4000);
  }
  
  else if (screenId === 'us46') {
    const btnStart = frame.querySelector('#btn-tour-start');
    if (btnStart) btnStart.onclick = () => navigateTo('us11');
  }

  else if (screenId === 'us03') {
    const emailInput = frame.querySelector('#us03-email');
    const errEl = frame.querySelector('#us03-err');
    const btnSend = frame.querySelector('#btn-send-code');
    const formDiv = frame.querySelector('#us03-form');
    const loadingDiv = frame.querySelector('#us03-loading');
    const btnWrap = frame.querySelector('#us03-btn-wrap');

    if (btnSend) {
      btnSend.addEventListener('click', () => {
        const email = emailInput ? emailInput.value.trim() : '';
        if (!email || !email.includes('@')) {
          if (errEl) errEl.style.display = 'block';
          return;
        }
        if (errEl) errEl.style.display = 'none';
        // Show loading
        if (formDiv) formDiv.style.display = 'none';
        if (loadingDiv) { loadingDiv.style.display = 'flex'; }
        if (btnWrap) btnWrap.style.display = 'none';
        // After 3 seconds go to change password (from recovery, no current pass needed)
        setTimeout(() => {
          localStorage.setItem('passFromRecovery', '1');
          localStorage.removeItem('passFromSettings');
          navigateTo('us50');
        }, 3000);
      });
    }
  }

  else if (screenId === 'us47') {
    const searchInput = frame.querySelector('#faq-search');
    const catBtns = frame.querySelectorAll('.cat-chip');
    const items = frame.querySelectorAll('.faq-item');

    // Expand/collapse
    items.forEach(item => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      if (q && a) {
        q.addEventListener('click', () => {
          const isOpen = a.classList.toggle('open');
          q.classList.toggle('open', isOpen);
        });
      }
    });

    // Category filter
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        items.forEach(item => {
          const show = cat === 'todos' || item.dataset.cat === cat || item.dataset.cat === 'todos';
          item.style.display = show ? '' : 'none';
        });
      });
    });

    // Search
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(q) ? '' : 'none';
        });
      });
    }
  }

  else if (screenId === 'us48') {
    const privadoChk = frame.querySelector('#priv-privado');
    const aviso = frame.querySelector('#priv-aviso');
    if (privadoChk && aviso) {
      privadoChk.addEventListener('change', () => {
        aviso.style.display = privadoChk.checked ? 'block' : 'none';
      });
    }
    const btnSave = frame.querySelector('#btn-save-privacy');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        btnSave.textContent = '✓ Guardado';
        btnSave.style.background = '#3aa56b';
        setTimeout(() => { btnSave.textContent = 'Guardar cambios'; btnSave.style.background = ''; }, 1500);
      });
    }
  }

  else if (screenId === 'us50') {
    const fromRecovery = localStorage.getItem('passFromRecovery') === '1';
    const currentBlock = frame.querySelector('#current-pass-block');
    // Hide current password field if coming from recovery flow
    if (fromRecovery && currentBlock) currentBlock.style.display = 'none';

    // Show/hide password toggles
    frame.querySelectorAll('.pass-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const inp = frame.querySelector('#' + btn.dataset.target);
        if (inp) { inp.type = inp.type === 'password' ? 'text' : 'password'; }
      });
    });

    // Live requirements check
    const passNew = frame.querySelector('#pass-new');
    const reqLen   = frame.querySelector('#req-len');
    const reqUpper = frame.querySelector('#req-upper');
    const reqNum   = frame.querySelector('#req-num');
    const reqSym   = frame.querySelector('#req-sym');
    const setReq = (el, ok) => { if (el) { el.classList.toggle('ok', ok); el.textContent = ok ? '✓' : ''; } };

    if (passNew) {
      passNew.addEventListener('input', () => {
        const v = passNew.value;
        setReq(reqLen,   v.length >= 8);
        setReq(reqUpper, /[A-Z]/.test(v));
        setReq(reqNum,   /[0-9]/.test(v));
        setReq(reqSym,   /[^A-Za-z0-9]/.test(v));
      });
    }

    const btnUpdate = frame.querySelector('#btn-update-pass');
    if (btnUpdate) {
      btnUpdate.addEventListener('click', () => {
        const newPass = passNew ? passNew.value : '';
        const confirmPass = frame.querySelector('#pass-confirm');
        const errMatch = frame.querySelector('#err-match');

        if (newPass.length < 8 || !/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass)) return;
        if (confirmPass && confirmPass.value !== newPass) {
          if (errMatch) errMatch.style.display = 'block';
          return;
        }
        if (errMatch) errMatch.style.display = 'none';

        // Update password in localStorage (demo)
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (u) { u.password = newPass; localStorage.setItem('currentUser', JSON.stringify(u)); }
        localStorage.removeItem('passFromRecovery');
        localStorage.removeItem('passFromSettings');

        btnUpdate.textContent = '✓ Contraseña actualizada';
        btnUpdate.style.background = '#3aa56b';
        setTimeout(() => navigateTo('us02'), 1800);
      });
    }
  }

  else if (screenId === 'us01') {
    const radioEst = frame.querySelector('input[value="estudiante"]');
    const radioTut = frame.querySelector('input[value="tutor"]');
    const divEst = frame.querySelector('#dynamic-student-fields');
    const divTut = frame.querySelector('#dynamic-tutor-fields');
    const lblEst = frame.querySelector('#lbl-role-estudiante');
    const lblTut = frame.querySelector('#lbl-role-tutor');
    
    const updateRoleFields = () => {
      if (radioEst && radioEst.checked) {
        if (divEst) divEst.style.display = 'flex';
        if (divTut) divTut.style.display = 'none';
        if (lblEst) lblEst.style.borderColor = 'var(--primary)';
        if (lblTut) lblTut.style.borderColor = '#c9c7c2';
      } else if (radioTut && radioTut.checked) {
        if (divEst) divEst.style.display = 'none';
        if (divTut) divTut.style.display = 'flex';
        if (lblEst) lblEst.style.borderColor = '#c9c7c2';
        if (lblTut) lblTut.style.borderColor = 'var(--primary)';
      }
    };
    
    if (radioEst) radioEst.addEventListener('change', updateRoleFields);
    if (radioTut) radioTut.addEventListener('change', updateRoleFields);
    
    const fieldSelect = frame.querySelector('#reg-field');
    const careerSelect = frame.querySelector('#reg-career');
    
    const careersMap = {
      "Educación": ["Educación Inicial", "Educación Primaria", "Educación Secundaria", "Educación Especial"],
      "Humanidades y Arte": ["Historia", "Filosofía", "Literatura", "Artes Plásticas"],
      "Ciencias Sociales, Comerciales y Derecho": ["Derecho", "Psicología", "Administración de Empresas", "Contabilidad"],
      "Ingeniería, Industria y Construcción": ["Ingeniería Civil", "Ingeniería Mecatrónica", "Ingeniería Industrial", "Arquitectura"],
      "Ciencias de la Salud": ["Medicina Humana", "Enfermería", "Odontología", "Nutrición"]
    };
    
    const updateCareers = () => {
      if (!fieldSelect || !careerSelect) return;
      const area = fieldSelect.value;
      const careers = careersMap[area] || [];
      careerSelect.innerHTML = '';
      careers.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        careerSelect.appendChild(opt);
      });
    };
    
    if (fieldSelect) {
      fieldSelect.addEventListener('change', updateCareers);
      updateCareers();
    }
    
    const btnSubmit = frame.querySelector('#btn-register-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const name = frame.querySelector('#reg-name').value.trim();
        const email = frame.querySelector('#reg-email').value.trim();
        const password = frame.querySelector('#reg-password').value.trim();
        const role = frame.querySelector('input[name="reg-role"]:checked').value;
        const errorDiv = frame.querySelector('#reg-error');
        const errorMsg = frame.querySelector('#reg-error-msg');
        
        if (!name || !email || !password) {
          if (errorMsg) errorMsg.textContent = "Todos los campos son obligatorios.";
          if (errorDiv) errorDiv.style.display = 'flex';
          return;
        }
        
        if (!email.endsWith('.edu') && !email.endsWith('.edu.pe')) {
          if (errorMsg) errorMsg.textContent = "El correo debe terminar en .edu o .edu.pe.";
          if (errorDiv) errorDiv.style.display = 'flex';
          return;
        }
        
        if (password.length < 6) {
          if (errorMsg) errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
          if (errorDiv) errorDiv.style.display = 'flex';
          return;
        }
        
        if (errorDiv) errorDiv.style.display = 'none';

        // Save user with basic info — profile details se completan en us05/us06
        const newUser = {
          name,
          email,
          password,
          role,
          studentProfile: null,
          tutorProfile: null
        };

        localStorage.setItem('currentUser', JSON.stringify(newUser));

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.email !== email);
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Ir a configurar perfil según rol
        navigateTo(role === 'tutor' ? 'us06' : 'us05');
      });
    }
  }
  
  else if (screenId === 'us02') {
    const btnLogin = frame.querySelector('#btn-login-submit');
    const btnToReg = frame.querySelector('#btn-login-to-register');
    
    if (btnLogin) {
      btnLogin.addEventListener('click', () => {
        const email = frame.querySelector('#login-email').value.trim();
        const password = frame.querySelector('#login-password').value.trim();
        const errorDiv = frame.querySelector('#login-error');
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const matchedUser = users.find(u => u.email === email && u.password === password);
        
        if (matchedUser) {
          localStorage.setItem('currentUser', JSON.stringify(matchedUser));
          history.length = 0;
          navigateTo(matchedUser.role === 'admin' ? 'us41' : 'us15');
        } else {
          if (errorDiv) errorDiv.style.display = 'flex';
        }
      });
    }
    
    if (btnToReg) {
      btnToReg.addEventListener('click', () => {
        navigateTo('us01');
      });
    }
  }
  
  else if (screenId === 'us15') {
    if (!user) { navigateTo('us45'); return; }
    const activeUser = user;
    const roleDiv = frame.querySelector('#home-user-role');
    const nameDiv = frame.querySelector('#home-user-name');
    
    if (roleDiv) roleDiv.textContent = activeUser.role === 'tutor' ? '📚 Tutor' : '🎓 Estudiante';
    if (nameDiv) {
      const parts = activeUser.name.split(' ');
      nameDiv.textContent = parts[0] + ' 👋';
    }
    
    const optRoles = frame.querySelector('#opt-mis-roles');
    const optSesiones = frame.querySelector('#opt-mis-sesiones');
    const optBuscar = frame.querySelector('#opt-buscar-tutores');
    const optCalif = frame.querySelector('#opt-mis-calificaciones');
    const optBilletera = frame.querySelector('#opt-mi-billetera');

    if (optRoles) optRoles.addEventListener('click', () => navigateTo('us09'));
    if (optSesiones) optSesiones.addEventListener('click', () => navigateTo('us30'));
    if (optBuscar) optBuscar.addEventListener('click', () => navigateTo('us11'));
    if (optCalif) optCalif.addEventListener('click', () => navigateTo('us33'));
    if (optBilletera) optBilletera.addEventListener('click', () => navigateTo('us36'));

    frame.querySelector('#btn-go-notif')?.addEventListener('click', () => navigateTo('us39'));

    // ⚙️ Ajustes button in topbar
    document.querySelector('#btnSettings')?.addEventListener('click', () => navigateTo('configuracion'));
  }

  else if (screenId === 'us07') {
    frame.querySelector('#btn-us07-settings')?.addEventListener('click', () => navigateTo('configuracion'));
    const nameIn = frame.querySelector('#edit-name');
    const bioIn = frame.querySelector('#edit-bio');
    const univIn = frame.querySelector('#edit-univ');
    const careerIn = frame.querySelector('#edit-career');
    const toast = frame.querySelector('#edit-toast');
    const toastMsg = frame.querySelector('#edit-toast-msg');

    if (user) {
      if (nameIn) nameIn.value = user.name || '';
      if (bioIn) bioIn.value = (user.studentProfile?.bio || user.tutorProfile?.bio) || '';
      if (univIn) univIn.value = (user.studentProfile?.univ || user.tutorProfile?.univ) || '';
      if (careerIn) careerIn.value = (user.studentProfile?.career || user.tutorProfile?.career) || '';
    }

    const saveBtn = frame.querySelector('#btn-save-profile');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const updatedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        updatedUser.name = nameIn?.value.trim() || updatedUser.name;
        const profileKey = updatedUser.role === 'tutor' ? 'tutorProfile' : 'studentProfile';
        if (!updatedUser[profileKey]) updatedUser[profileKey] = {};
        updatedUser[profileKey].bio = bioIn?.value.trim() || '';
        updatedUser[profileKey].univ = univIn?.value.trim() || '';
        updatedUser[profileKey].career = careerIn?.value.trim() || '';
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.map(u => u.email === updatedUser.email ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(users));
        if (toast) toast.style.display = 'flex';
        if (toastMsg) toastMsg.textContent = '¡Cambios guardados!';
        setTimeout(() => { if (toast) toast.style.display = 'none'; }, 2500);
      });
    }

    // Logout button in us07
    const logoutBtn07 = frame.querySelector('#btn-logout-us07');
    if (logoutBtn07) {
      logoutBtn07.addEventListener('click', () => {
        const overlay = frame.querySelector('#logout-overlay');
        if (overlay) overlay.style.display = 'flex';
      });
    }
    const overlayNo07 = frame.querySelector('#logout-overlay-no');
    if (overlayNo07) {
      overlayNo07.addEventListener('click', () => {
        const overlay = frame.querySelector('#logout-overlay');
        if (overlay) overlay.style.display = 'none';
      });
    }
    const overlaySi07 = frame.querySelector('#logout-overlay-si');
    if (overlaySi07) {
      overlaySi07.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
      });
    }
  }

  else if (screenId === 'us49') {
    const btnSi = frame.querySelector('#btn-delete-si');
    const btnNo = frame.querySelector('#btn-delete-no');
    const checkbox = frame.querySelector('#delete-confirm-check');
    const passInput = frame.querySelector('#delete-password');
    const passError = frame.querySelector('#delete-pass-error');

    const updateBtn = () => {
      const enabled = checkbox && checkbox.checked;
      if (btnSi) { btnSi.disabled = !enabled; btnSi.style.opacity = enabled ? '1' : '.4'; }
    };
    if (checkbox) checkbox.addEventListener('change', updateBtn);

    if (btnSi) {
      btnSi.addEventListener('click', () => {
        const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
        // In demo: accept any password (non-empty)
        if (passInput && !passInput.value) {
          if (passError) passError.style.display = 'block';
          return;
        }
        if (passError) passError.style.display = 'none';
        if (u) {
          let users = JSON.parse(localStorage.getItem('users') || '[]');
          users = users.filter(x => x.email !== u.email);
          localStorage.setItem('users', JSON.stringify(users));
        }
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
      });
    }
    if (btnNo) btnNo.addEventListener('click', () => history.back());
  }

  else if (screenId === 'configuracion') {
    const btnLogout = frame.querySelector('#btn-logout-submit');
    if (btnLogout) {
      btnLogout.onclick = () => {
        const overlay = frame.querySelector('#logout-overlay-cfg');
        if (overlay) overlay.style.display = 'flex';
      };
    }
    const cfgNo = frame.querySelector('#logout-cfg-no');
    if (cfgNo) cfgNo.addEventListener('click', () => {
      const overlay = frame.querySelector('#logout-overlay-cfg');
      if (overlay) overlay.style.display = 'none';
    });
    const cfgSi = frame.querySelector('#logout-cfg-si');
    if (cfgSi) cfgSi.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
    const btnDeleteAccount = frame.querySelector('#btn-delete-account');
    if (btnDeleteAccount) btnDeleteAccount.addEventListener('click', () => navigateTo('us49'));

    const navNotif = frame.querySelector('#cfg-nav-notif');
    if (navNotif) navNotif.addEventListener('click', () => navigateTo('us40'));

    const navPrivacy = frame.querySelector('#cfg-nav-privacy');
    if (navPrivacy) navPrivacy.addEventListener('click', () => navigateTo('us48'));

    const navPassword = frame.querySelector('#cfg-nav-password');
    if (navPassword) navPassword.addEventListener('click', () => {
      localStorage.setItem('passFromSettings', '1');
      navigateTo('us50');
    });

    const navFaq = frame.querySelector('#cfg-nav-faq');
    if (navFaq) navFaq.addEventListener('click', () => navigateTo('us47'));
  }

  else if (screenId === 'us09') {
    if (!user) return;
    const cardStudent = frame.querySelector('#card-role-student');
    const cardTutor = frame.querySelector('#card-role-tutor');
    const pillStudent = frame.querySelector('#pill-student');
    const pillTutor = frame.querySelector('#pill-tutor');
    const btnActStudent = frame.querySelector('#btn-activate-student');
    const btnActTutor = frame.querySelector('#btn-activate-tutor');
    
    const updateRoleUI = () => {
      if (user.role === 'tutor') {
        if (cardTutor) cardTutor.style.borderColor = 'var(--primary)';
        if (pillTutor) {
          pillTutor.textContent = 'Activo';
          pillTutor.style.background = 'var(--primary)';
        }
        if (btnActTutor) btnActTutor.style.display = 'none';
        
        if (cardStudent) cardStudent.style.borderColor = '#c9c7c2';
        if (pillStudent) {
          pillStudent.textContent = 'Inactivo';
          pillStudent.style.background = '#ccc';
        }
        if (btnActStudent) btnActStudent.style.display = 'block';
      } else {
        if (cardStudent) cardStudent.style.borderColor = 'var(--primary)';
        if (pillStudent) {
          pillStudent.textContent = 'Activo';
          pillStudent.style.background = 'var(--primary)';
        }
        if (btnActStudent) btnActStudent.style.display = 'none';
        
        if (cardTutor) cardTutor.style.borderColor = '#c9c7c2';
        if (pillTutor) {
          pillTutor.textContent = 'Inactivo';
          pillTutor.style.background = '#ccc';
        }
        if (btnActTutor) btnActTutor.style.display = 'block';
      }
    };
    
    updateRoleUI();
    
    const showRoleConfirm = (role, label, icon, targetScreen) => {
      const existing = frame.querySelector('#role-confirm-overlay');
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = 'role-confirm-overlay';
      overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.45);z-index:999;display:flex;align-items:center;justify-content:center;';
      overlay.innerHTML = `
        <div style="background:#fff;border-radius:20px;padding:28px 22px;max-width:280px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.18);text-align:center;">
          <div style="font-size:40px;margin-bottom:12px;">${icon}</div>
          <div style="font-weight:700;font-size:15px;color:var(--ink);margin-bottom:8px;">Cambiar a ${label}</div>
          <div style="font-size:12px;color:var(--muted);line-height:1.6;margin-bottom:20px;">
            Para continuar necesitamos configurar tu perfil de <b style="color:var(--ink);">${label.toLowerCase()}</b>. ¿Deseas hacerlo ahora?
          </div>
          <div style="display:flex;gap:10px;">
            <button id="role-confirm-no" type="button" style="flex:1;padding:12px;border:1.5px solid var(--primary);background:transparent;color:var(--primary);border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;">Ahora no</button>
            <button id="role-confirm-si" type="button" style="flex:1;padding:12px;background:var(--primary);border:none;color:#fff;border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;">Configurar</button>
          </div>
        </div>
      `;
      frame.appendChild(overlay);
      overlay.querySelector('#role-confirm-no').onclick = () => overlay.remove();
      overlay.querySelector('#role-confirm-si').onclick = () => { overlay.remove(); navigateTo(targetScreen); };
    };

    const switchRole = (newRole) => {
      if (newRole === 'estudiante' && !user.studentProfile) {
        showRoleConfirm('estudiante', 'Estudiante', '🎓', 'us05');
        return;
      }

      if (newRole === 'tutor' && !user.tutorProfile) {
        showRoleConfirm('tutor', 'Tutor', '👨‍🏫', 'us06');
        return;
      }
      
      user.role = newRole;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users = users.map(u => u.email === user.email ? user : u);
      localStorage.setItem('users', JSON.stringify(users));
      
      updateRoleUI();
      alert(`Rol cambiado a: ${newRole === 'tutor' ? 'Tutor' : 'Estudiante'}`);
    };
    
    if (btnActStudent) btnActStudent.addEventListener('click', (e) => { e.stopPropagation(); switchRole('estudiante'); });
    if (btnActTutor) btnActTutor.addEventListener('click', (e) => { e.stopPropagation(); switchRole('tutor'); });
  }
  
  else if (screenId === 'us05') {
    if (!user) { navigateTo('us45'); return; }

    const careersMap = {
      'Educación': ['Educación Primaria', 'Educación Secundaria', 'Educación Inicial', 'Educación Especial'],
      'Humanidades y Arte': ['Literatura', 'Historia', 'Filosofía', 'Artes Visuales', 'Música', 'Lingüística'],
      'Ciencias Sociales, Comerciales y Derecho': ['Derecho', 'Administración', 'Economía', 'Contabilidad', 'Marketing', 'Psicología', 'Sociología'],
      'Ingeniería, Industria y Construcción': ['Ingeniería Civil', 'Ingeniería de Software', 'Ingeniería Industrial', 'Ingeniería Mecánica', 'Ingeniería Eléctrica', 'Ingeniería de Sistemas', 'Arquitectura'],
      'Ciencias de la Salud': ['Medicina', 'Enfermería', 'Odontología', 'Farmacia', 'Nutrición', 'Psicología Clínica'],
    };

    const fieldSel = frame.querySelector('#setup-field');
    const careerSel = frame.querySelector('#setup-career');

    const updateCareers = () => {
      if (!careerSel || !fieldSel) return;
      const careers = careersMap[fieldSel.value] || [];
      careerSel.innerHTML = careers.map(c => `<option value="${c}">${c}</option>`).join('');
    };

    if (fieldSel) {
      fieldSel.addEventListener('change', updateCareers);
      updateCareers();
    }

    // Populate learn chips
    const learnChips = frame.querySelector('#setup-learn-chips');
    if (learnChips && !learnChips.dataset.enhanced) {
      learnChips.dataset.enhanced = '1';
      learnChips.innerHTML = '';
      SUBJECTS.forEach(s => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = s;
        chip.addEventListener('click', () => chip.classList.toggle('on'));
        learnChips.appendChild(chip);
      });
    }

    const btnSave = frame.querySelector('#btn-setup-student-submit') || frame.querySelector('.btn');
    if (btnSave) {
      btnSave.onclick = (e) => {
        e.preventDefault();
        const univ = frame.querySelector('#setup-univ')?.value || 'UPC';
        const field = fieldSel?.value || 'Ingeniería, Industria y Construcción';
        const career = careerSel?.value || 'Ingeniería Civil';
        const cycle = frame.querySelector('#setup-cycle')?.value || '1° ciclo';
        const subjects = [...(learnChips?.querySelectorAll('.chip.on') || [])].map(c => c.textContent);
        user.studentProfile = { univ, field, career, cycle, subjects };
        user.role = 'estudiante';
        localStorage.setItem('currentUser', JSON.stringify(user));
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.map(u => u.email === user.email ? user : u);
        localStorage.setItem('users', JSON.stringify(users));
        navigateTo('us15');
      };
    }
  }

  else if (screenId === 'us06') {
    if (!user) { navigateTo('us45'); return; }

    // Chips Mañana / Tarde / Noche
    const _chipM = frame.querySelector('#chip-disp-m, #setup-tutor-disp-m');
    const _chipT = frame.querySelector('#chip-disp-t, #setup-tutor-disp-t');
    const _chipN = frame.querySelector('#chip-disp-n, #setup-tutor-disp-n');
    const _hoursContainer = frame.querySelector('#tutor-hours-chips');
    const _hoursMap = {
      m: ['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM'],
      t: ['12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'],
      n: ['6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM']
    };
    let _selectedHours = new Set();
    const _renderHours = (period) => {
      if (!_hoursContainer) return;
      _hoursContainer.innerHTML = '';
      (_hoursMap[period] || []).forEach(h => {
        const sp = document.createElement('span');
        sp.className = 'chip' + (_selectedHours.has(h) ? ' on' : '');
        sp.textContent = h; sp.style.cursor = 'pointer';
        sp.addEventListener('click', () => { sp.classList.toggle('on'); _selectedHours[sp.classList.contains('on') ? 'add' : 'delete'](h); });
        _hoursContainer.appendChild(sp);
      });
    };
    const _selPeriod = (period, active, others) => {
      active.classList.add('on');
      active.style.background = 'var(--primary)'; active.style.color = '#fff';
      others.forEach(c => { if (c) { c.classList.remove('on'); c.style.background = 'transparent'; c.style.color = 'var(--primary)'; } });
      _renderHours(period);
    };
    if (_chipM) _chipM.addEventListener('click', () => _selPeriod('m', _chipM, [_chipT, _chipN]));
    if (_chipT) _chipT.addEventListener('click', () => _selPeriod('t', _chipT, [_chipM, _chipN]));
    if (_chipN) _chipN.addEventListener('click', () => _selPeriod('n', _chipN, [_chipM, _chipT]));
    if (_hoursContainer) _renderHours('m');

    const btnSave = frame.querySelector('.btn');
    if (btnSave) {
      btnSave.onclick = (e) => {
        e.preventDefault();
        const inputs = frame.querySelectorAll('input[type="text"], textarea');
        const subject = inputs[0]?.value.trim() || 'Cálculo Diferencial';
        const bio = frame.querySelector('textarea')?.value.trim() || '';
        const selects = frame.querySelectorAll('select');
        const level = selects[0]?.value || 'Intermedio';
        user.tutorProfile = { subject, bio, level, hours: [] };
        user.role = 'tutor';
        localStorage.setItem('currentUser', JSON.stringify(user));
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.map(u => u.email === user.email ? user : u);
        localStorage.setItem('users', JSON.stringify(users));
        navigateTo('us15');
      };
    }
  }
  
  else if (screenId === 'us30') {
    if (user && user.role === 'tutor') { navigateTo('sesiones-tutor'); return; }
    let completed = JSON.parse(localStorage.getItem('completedSessions')) || [
      { id: 1, tutor: "Andrea Paredes", subject: "Cálculo Inicial", date: "28 oct", duration: "1h", rating: 5 },
      { id: 2, tutor: "Luis Mendoza", subject: "Física I", date: "15 oct", duration: "1.5h", rating: 4 },
      { id: 3, tutor: "Karen Ríos", subject: "Química General", date: "08 oct", duration: "1h", rating: 5 },
      { id: 4, tutor: "Carlos Montes", subject: "Cálculo Integral", date: "22 sep", duration: "2h", rating: 3 }
    ];
    
    let upcoming = JSON.parse(localStorage.getItem('upcomingSessions')) || [
      { id: 101, tutor: "Andrea Paredes", subject: "Cálculo Diferencial", date: "Jueves 7 Nov", time: "19:00", duration: "60 min", reminder: false }
    ];
    
    let pendingSolicitudes = JSON.parse(localStorage.getItem('studentSolicitudes') || 'null') || [
      { id: 201, tutor: "Andrea Paredes", subject: "Cálculo Diferencial", sent: "hace 1h", status: "pending" },
      { id: 202, tutor: "Luis Mendoza", subject: "Física I", sent: "hace 3h", status: "pending" }
    ];

    let activeTab = 'proximas';

    const sContainer = frame.querySelector('#sesiones-container');
    const tabProx = frame.querySelector('#tab-sesiones-proximas');
    const tabComp = frame.querySelector('#tab-sesiones-completadas');
    const tabPend = frame.querySelector('#tab-sesiones-pendientes');
    
    const allTabs = [tabProx, tabComp, tabPend];
    const setTab = (active) => {
      allTabs.forEach(t => {
        if (!t) return;
        t.classList.remove('on');
        t.style.cssText = '';
      });
      if (active) active.classList.add('on');
    };

    const renderList = () => {
      if (!sContainer) return;
      sContainer.innerHTML = '';

      // update tab highlight
      setTab(activeTab === 'proximas' ? tabProx : activeTab === 'completadas' ? tabComp : tabPend);

      if (activeTab === 'pendientes') {
        const visible = pendingSolicitudes.filter(p => p.status === 'pending');
        if (visible.length === 0) {
          sContainer.innerHTML = '<div class="small center" style="margin-top:30px;">No tienes solicitudes pendientes.</div>';
          return;
        }
        visible.forEach(p => {
          const card = document.createElement('div');
          card.style.cssText = 'background:#fff; border:1px solid var(--soft); border-radius:10px; padding:12px; margin-bottom:8px;';
          card.innerHTML = `
            <div style="font-weight:700; font-size:12px; color:var(--ink);">${p.tutor}</div>
            <div style="font-size:11px; color:var(--muted); margin-top:2px;">${p.subject} · Enviada ${p.sent}</div>
            <div style="margin-top:8px; display:flex; align-items:center; justify-content:space-between;">
              <span style="font-size:10px; background:var(--brand-bg); color:var(--primary); padding:2px 8px; border-radius:6px; font-weight:600;">⏳ En espera de respuesta</span>
              <button type="button" class="btn-cancel-pend" style="border:1px solid #d64545; background:transparent; color:#d64545; padding:4px 10px; font-size:11px; border-radius:6px; cursor:pointer; font-weight:600;">Cancelar</button>
            </div>
          `;
          card.querySelector('.btn-cancel-pend').onclick = (e) => {
            e.stopPropagation();
            localStorage.setItem('cancellingPendingSolicitud', JSON.stringify(p));
            navigateTo('us20');
          };
          sContainer.appendChild(card);
        });
        return;
      }

      if (activeTab === 'completadas') {
        if (completed.length === 0) {
          sContainer.innerHTML = '<div class="small center" style="margin-top:30px;">No hay sesiones completadas.</div>';
          return;
        }
        
        completed.forEach(s => {
          const card = document.createElement('div');
          card.className = 'card';
          card.style.display = 'flex';
          card.style.alignItems = 'center';
          card.style.justifyContent = 'space-between';
          card.style.padding = '10px';
          card.style.border = '1px solid var(--soft)';
          card.style.borderRadius = '10px';
          card.style.marginBottom = '8px';
          card.style.background = '#fff';
          
          card.innerHTML = `
            <div style="flex:1;">
              <div style="font-weight:600; font-size:12px;">${s.tutor}</div>
              <div class="small" style="font-size:10px;">${s.subject} · ${s.date} · ${s.duration}</div>
              <div class="stars" style="font-size:10px; color:var(--cta);">` + `★`.repeat(s.rating) + `☆`.repeat(5-s.rating) + ` <b style="color:var(--ink)">calificación: ${s.rating}</b></div>
            </div>
            <button type="button" class="btn-clear-session" style="border:none; background:#3aa56b; color:#fff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:700;" title="Limpiar del historial">✓</button>
          `;
          
          card.querySelector('.btn-clear-session').onclick = (e) => {
            e.stopPropagation();
            completed = completed.filter(x => x.id !== s.id);
            localStorage.setItem('completedSessions', JSON.stringify(completed));
            renderList();
          };

          card.style.cursor = 'pointer';
          card.onclick = (e) => {
            if (e.target.classList.contains('btn-clear-session')) return;
            localStorage.setItem('selectedSession', JSON.stringify(s));
            navigateTo('us28');
          };

          sContainer.appendChild(card);
        });
      } else {
        if (upcoming.length === 0) {
          sContainer.innerHTML = '<div class="small center" style="margin-top:30px;">No hay sesiones programadas.</div>';
          return;
        }
        
        upcoming.forEach(s => {
          const card = document.createElement('div');
          card.className = 'card';
          card.style.display = 'block';
          card.style.padding = '12px';
          card.style.border = '1px solid var(--primary)';
          card.style.borderRadius = '10px';
          card.style.marginBottom = '8px';
          card.style.background = '#fff';
          
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-weight:700; font-size:12px; color:var(--primary);">${s.subject}</span>
              <span class="small" style="font-size:11px; background:var(--brand-bg); padding:2px 6px; border-radius:6px; font-weight:600; color:var(--primary);">${s.date} a las ${s.time}</span>
            </div>
            <div class="small" style="font-size:11px;">Con: <b>${s.tutor}</b> (${s.duration})</div>
            
            <div style="margin-top:10px; border-top:1px solid var(--soft); padding-top:8px; display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="small" style="font-size:11px;">Recordatorio antes de sesión:</span>
                <button type="button" class="btn-toggle-reminder" style="border:1.5px solid var(--primary); background:${s.reminder ? 'var(--primary)' : 'transparent'}; color:${s.reminder ? '#fff' : 'var(--primary)'}; font-size:10px; padding:2px 8px; border-radius:6px; cursor:pointer; font-weight:600;">${s.reminder ? '⏰ Habilitado' : '🔔 Activar'}</button>
              </div>
              <div style="display:flex; gap:6px; margin-top:4px;">
                <button type="button" class="btn-cancel-session" style="flex:1; border:1px solid #d64545; background:transparent; color:#d64545; padding:6px; font-size:11px; border-radius:6px; cursor:pointer; font-weight:600;">Cancelar sesión</button>
                <button type="button" class="btn-complete-session" style="flex:1; background:#3aa56b; color:#fff; padding:6px; font-size:11px; border-radius:6px; cursor:pointer; border:none; font-weight:600;">Completar</button>
              </div>
            </div>
          `;
          
          card.querySelector('.btn-toggle-reminder').onclick = (e) => {
            e.stopPropagation();
            s.reminder = !s.reminder;
            localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
            renderList();
          };
          
          card.querySelector('.btn-cancel-session').onclick = (e) => {
            e.stopPropagation();
            const existing = frame.querySelector('#cancel-modal');
            if (existing) existing.remove();
            const modal = document.createElement('div');
            modal.id = 'cancel-modal';
            modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:999;display:flex;align-items:center;justify-content:center;';
            modal.innerHTML = `
              <div style="background:#fff;border-radius:16px;padding:20px;max-width:280px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
                <div style="font-weight:700;font-size:14px;color:var(--ink);margin-bottom:4px;">Cancelar sesión</div>
                <div style="font-size:11px;color:var(--muted);margin-bottom:12px;">Estás por cancelar la sesión con <b style="color:var(--ink);">${s.tutor}</b> del <b style="color:var(--ink);">${s.date} · ${s.time}</b>.</div>
                <div style="background:#fff3cd;border-radius:8px;padding:8px;font-size:10px;color:#856404;margin-bottom:12px;">⚠ Cancelaciones tardías pueden afectar tu reputación.</div>
                <div style="margin-bottom:12px;">
                  <label style="font-size:11px;font-weight:600;color:var(--ink);display:block;margin-bottom:4px;">Motivo (obligatorio)</label>
                  <textarea id="cancel-reason" placeholder="Ej: Se me cruzó una clase obligatoria…" style="width:100%;height:60px;font-size:11px;padding:8px;border:1.5px solid #e8e6e1;border-radius:8px;resize:none;box-sizing:border-box;"></textarea>
                </div>
                <div style="font-size:9px;color:var(--muted);margin-bottom:12px;">Política: +2h sin penalidad · 2h–1h advertencia · &lt;1h afecta reputación</div>
                <div style="display:flex;gap:8px;">
                  <button id="cancel-modal-no" type="button" style="flex:1;padding:10px;border:1.5px solid var(--primary);background:transparent;color:var(--primary);border-radius:10px;font-weight:600;font-size:12px;cursor:pointer;">Volver</button>
                  <button id="cancel-modal-si" type="button" style="flex:1;padding:10px;background:#d64545;border:none;color:#fff;border-radius:10px;font-weight:600;font-size:12px;cursor:pointer;">Cancelar igual</button>
                </div>
              </div>
            `;
            frame.appendChild(modal);
            modal.querySelector('#cancel-modal-no').onclick = () => modal.remove();
            modal.querySelector('#cancel-modal-si').onclick = () => {
              const reason = modal.querySelector('#cancel-reason').value.trim();
              if (!reason) { modal.querySelector('#cancel-reason').style.border = '1.5px solid #d64545'; return; }
              modal.remove();
              upcoming = upcoming.filter(x => x.id !== s.id);
              localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
              renderList();
            };
          };
          
          card.querySelector('.btn-complete-session').onclick = (e) => {
            e.stopPropagation();
            upcoming = upcoming.filter(x => x.id !== s.id);
            localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));

            const newCompleted = { id: Date.now(), tutor: s.tutor, subject: s.subject, date: s.date, duration: s.duration, rating: 0 };
            completed.unshift(newCompleted);
            localStorage.setItem('completedSessions', JSON.stringify(completed));
            localStorage.setItem('completingSession', JSON.stringify(newCompleted));

            const u2 = JSON.parse(localStorage.getItem('currentUser') || 'null');
            navigateTo(u2 && u2.role === 'tutor' ? 'us32' : 'us31');
          };
          
          sContainer.appendChild(card);
        });
      }
    };
    
    if (tabProx) tabProx.onclick = () => { activeTab = 'proximas'; renderList(); };
    if (tabComp) tabComp.onclick = () => { activeTab = 'completadas'; renderList(); };
    if (tabPend) tabPend.onclick = () => { activeTab = 'pendientes'; renderList(); };
    
    renderList();
    
    const btnNew = frame.querySelector('#btn-nueva-sesion');
    if (btnNew) {
      btnNew.onclick = () => navigateTo('us36-custom');
    }

    // Bell icon: click on any upcoming reminder card → us28
    const headEl = frame.querySelector('.head');
    if (headEl && !headEl.querySelector('.bell-btn')) {
      const bellBtn = document.createElement('button');
      bellBtn.type = 'button';
      bellBtn.className = 'bell-btn';
      bellBtn.setAttribute('title', 'Ver recordatorios');
      bellBtn.style.cssText = 'background:none; border:none; font-size:20px; cursor:pointer; margin-left:auto; color:var(--primary);';
      bellBtn.textContent = '🔔';
      bellBtn.onclick = () => {
        const upcoming = JSON.parse(localStorage.getItem('upcomingSessions') || '[]');
        if (upcoming.length > 0) {
          localStorage.setItem('pendingReminder', JSON.stringify(upcoming[0]));
        }
        navigateTo('us27');
      };
      headEl.appendChild(bellBtn);
    }
  }
  
  else if (screenId === 'us36-custom') {
    const btnKnown = frame.querySelector('#btn-tutor-conocido');
    const knownList = frame.querySelector('#known-tutors-list');
    const btnNew = frame.querySelector('#btn-tutor-nuevo');
    
    if (btnKnown) {
      btnKnown.onclick = () => {
        knownList.style.display = knownList.style.display === 'none' ? 'flex' : 'none';
      };
    }
    
    if (btnNew) {
      btnNew.onclick = () => navigateTo('us11');
    }
    
    frame.querySelectorAll('.select-tutor-item').forEach(item => {
      item.onclick = () => {
        const tutor = item.dataset.tutor;
        const subject = item.dataset.subject;
        localStorage.setItem('selectedTutorForScheduling', JSON.stringify({ name: tutor, subject }));
        navigateTo('us26');
      };
    });
  }
  
  else if (screenId === 'us26') {
    const selectedTutor = JSON.parse(localStorage.getItem('selectedTutorForScheduling')) || { name: 'Andrea Paredes', subject: 'Cálculo Diferencial' };
    
    const avatarEl = frame.querySelector('#schedule-tutor-avatar');
    const nameEl = frame.querySelector('#schedule-tutor-name');
    const subjEl = frame.querySelector('#schedule-tutor-subj');
    
    if (nameEl) nameEl.textContent = selectedTutor.name;
    if (subjEl) subjEl.textContent = selectedTutor.subject;
    if (avatarEl) {
      const initials = selectedTutor.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
      avatarEl.textContent = initials;
    }
    
    let selectedDay = '7';
    let selectedTime = '19:00';
    
    const calendarDays = frame.querySelectorAll('.calendar-day');
    const timeChips = frame.querySelectorAll('.time-chip');
    const btnConfirm = frame.querySelector('#btn-schedule-confirm');
    
    const updateConfirmBtn = () => {
      if (btnConfirm) {
        btnConfirm.textContent = `Confirmar · Nov ${selectedDay} · ${selectedTime}`;
      }
    };
    
    calendarDays.forEach(day => {
      day.onclick = () => {
        calendarDays.forEach(d => d.classList.remove('selected'));
        day.classList.add('selected');
        selectedDay = day.dataset.day;
        updateConfirmBtn();
      };
    });
    
    timeChips.forEach(chip => {
      chip.onclick = () => {
        timeChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedTime = chip.dataset.time;
        updateConfirmBtn();
      };
    });
    
    if (btnConfirm) {
      btnConfirm.onclick = () => {
        const newSession = {
          id: Date.now(),
          tutor: selectedTutor.name,
          subject: selectedTutor.subject,
          date: `Jueves ${selectedDay} Nov`,
          time: selectedTime,
          duration: "60 min",
          reminder: false
        };
        
        let upcoming = JSON.parse(localStorage.getItem('upcomingSessions') || '[]');
        upcoming.push(newSession);
        localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
        
        alert(`Sesión agendada para el ${selectedDay} de noviembre a las ${selectedTime}`);
        navigateTo('us30');
      };
    }
  }
  
  else if (screenId === 'us11') {
    if (!user) { navigateTo('us45'); return; }
    if (user.role === 'tutor') { navigateTo('buscar-solicitudes'); return; }

    const searchInput = frame.querySelector('#search-input');
    const resultsEl = frame.querySelector('#search-results');
    const btnUniv = frame.querySelector('#btn-filter-univ');
    const btnDisp = frame.querySelector('#btn-filter-disp');

    const univFilter = localStorage.getItem('filterUniv') || null;
    const dispFilter = localStorage.getItem('filterDisp') || null;

    let activeUniv = localStorage.getItem('filterUniv') || null;
    let activeDisp = localStorage.getItem('filterDisp') || null;

    const applyFilterStyles = () => {
      if (btnUniv) {
        if (activeUniv) {
          btnUniv.style.background = 'var(--primary)'; btnUniv.style.color = '#fff';
          btnUniv.textContent = '🏛 ' + activeUniv + ' ✕';
        } else {
          btnUniv.style.background = ''; btnUniv.style.color = '';
          btnUniv.textContent = '🏛 Universidad';
        }
      }
      if (btnDisp) {
        if (activeDisp) {
          btnDisp.style.background = 'var(--primary)'; btnDisp.style.color = '#fff';
          btnDisp.textContent = '🕐 ' + activeDisp + ' ✕';
        } else {
          btnDisp.style.background = ''; btnDisp.style.color = '';
          btnDisp.textContent = '🕐 Disponibilidad';
        }
      }
    };
    applyFilterStyles();

    if (btnUniv) btnUniv.addEventListener('click', () => {
      if (activeUniv) { activeUniv = null; localStorage.removeItem('filterUniv'); applyFilterStyles(); renderResults(searchInput?.value || ''); }
      else navigateTo('us12');
    });
    if (btnDisp) btnDisp.addEventListener('click', () => {
      if (activeDisp) { activeDisp = null; localStorage.removeItem('filterDisp'); applyFilterStyles(); renderResults(searchInput?.value || ''); }
      else navigateTo('us13');
    });

    const makeTutorCard = (t) => {
      const card = document.createElement('div');
      card.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px;cursor:pointer;border:1px solid #e8e6e1;border-radius:12px;margin-bottom:8px;background:#fff;';
      const fullStars = Math.floor(t.rating);
      const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
      card.innerHTML = `
        <div class="av" style="background:${t.color};color:#fff;font-weight:700;flex-shrink:0;">${t.initials}</div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:12px;">${t.name}</div>
          <div style="font-size:10px;color:var(--muted);">${t.univ} · ${t.career}</div>
          <div style="font-size:10px;color:#f5a623;">${stars} <b style="color:var(--ink);">${t.rating} (${t.reviews})</b></div>
          <span class="tag" style="font-size:10px;margin-top:2px;">${t.course}</span>
        </div>
        <span style="color:#f5a623;font-size:16px;">★</span>
      `;
      card.addEventListener('click', () => {
        localStorage.setItem('selectedTutor', JSON.stringify(t));
        navigateTo('us10');
      });
      return card;
    };

    const renderResults = (query) => {
      if (!resultsEl) return;
      resultsEl.innerHTML = '';
      let filtered = TUTORS_DATA;
      if (activeUniv) filtered = filtered.filter(t => t.univ === activeUniv);
      if (activeDisp) {
        const kw = activeDisp.replace('Mañanas','mañan').replace('Tardes','tarde').replace('Noches','noche').toLowerCase();
        filtered = filtered.filter(t => t.schedule.toLowerCase().includes(kw));
      }
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.course.toLowerCase().includes(q) || t.univ.toLowerCase().includes(q) || t.subjects.some(s => s.toLowerCase().includes(q)));
      }
      if (filtered.length === 0) {
        resultsEl.innerHTML = '<div style="text-align:center;margin-top:30px;font-size:13px;color:var(--muted);">No se encontraron tutores.</div>';
        return;
      }
      const courses = [...new Set(filtered.map(t => t.course))];
      courses.forEach(course => {
        const hdr = document.createElement('div');
        hdr.style.cssText = 'font-weight:700;font-size:12px;color:var(--primary);margin:12px 0 6px;';
        hdr.textContent = '📘 ' + course;
        resultsEl.appendChild(hdr);
        filtered.filter(t => t.course === course).forEach(t => resultsEl.appendChild(makeTutorCard(t)));
      });
    };

    renderResults('');
    if (searchInput) searchInput.addEventListener('input', e => renderResults(e.target.value));
  }

  else if (screenId === 'us10') {
    const tutor = JSON.parse(localStorage.getItem('selectedTutor')) || TUTORS_DATA[0];
    const avatarEl = frame.querySelector('#tutor-avatar');
    const nameEl = frame.querySelector('#tutor-name');
    const metaEl = frame.querySelector('#tutor-meta');
    const starsEl = frame.querySelector('#tutor-stars');
    const badgeEl = frame.querySelector('#tutor-badge');
    const bioEl = frame.querySelector('#tutor-bio');
    const subjectsEl = frame.querySelector('#tutor-subjects');
    const availEl = frame.querySelector('#tutor-avail');
    const scheduleEl = frame.querySelector('#tutor-schedule');
    const creditsEl = frame.querySelector('#tutor-credits');
    const reviewsEl = frame.querySelector('#tutor-reviews');
    const solicitarBtn = frame.querySelector('#btn-solicitar-sesion');

    if (avatarEl) { avatarEl.style.background = tutor.color; avatarEl.textContent = tutor.initials; avatarEl.style.color = '#fff'; }
    if (nameEl) nameEl.textContent = tutor.name;
    if (metaEl) metaEl.textContent = tutor.univ + ' · ' + tutor.career + ' · ' + tutor.cycle;
    if (starsEl) {
      const full = Math.floor(tutor.rating);
      const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
      starsEl.innerHTML = `<span style="color:#f5a623;font-size:13px;">${stars}</span>&nbsp;<span style="font-weight:700;font-size:12px;">${tutor.rating}</span>&nbsp;<span style="font-size:11px;color:var(--muted);">(${tutor.reviews} reseñas)</span>`;
    }
    if (badgeEl) { badgeEl.textContent = tutor.reviews >= 20 ? '📚 Tutor verificado' : '🌱 Tutor activo'; badgeEl.style.background = 'var(--brand-bg)'; badgeEl.style.color = 'var(--primary)'; }
    if (bioEl) bioEl.textContent = tutor.bio;
    if (subjectsEl) tutor.subjects.forEach(s => { const sp = document.createElement('span'); sp.className = 'chip on'; sp.textContent = s; subjectsEl.appendChild(sp); });
    if (availEl) tutor.avail.forEach(a => { const sp = document.createElement('span'); sp.className = 'chip on'; sp.textContent = a; availEl.appendChild(sp); });
    if (scheduleEl) scheduleEl.textContent = '🕐 ' + tutor.schedule;
    if (creditsEl) creditsEl.textContent = tutor.credits + ' créditos / hora';
    if (reviewsEl) tutor.reviewsList.forEach(r => {
      const div = document.createElement('div');
      div.style.cssText = 'background:#f9f9f9;border-radius:10px;padding:10px;margin-top:6px;';
      div.innerHTML = `<div style="font-size:12px;font-weight:700;">${r.name} · ${'★'.repeat(r.rating)}</div><div style="font-size:11px;color:var(--ink);margin-top:2px;">"${r.text}"</div>`;
      reviewsEl.appendChild(div);
    });
    if (solicitarBtn) solicitarBtn.onclick = () => navigateTo('us16');
  }

  else if (screenId === 'us19') {
    // Tutor's pending requests list — only pending, each tappable → us17
    const list = frame.querySelector('#us19-list');
    if (!list) return;

    const defaultSolicitudes = [
      { id: 1, initials:'AP', name:'Andrea Paredes', univ:'UPC', cycle:'3° ciclo', rating:'4.8', subject:'Cálculo Diferencial', avail:'Tarde / Noche', time:'hace 2h', message:'Busco tutor para preparar el examen parcial. Tengo dudas con derivadas implícitas.', color:'#3a6bb5' },
      { id: 2, initials:'CM', name:'Carlos Montes', univ:'UNMSM', cycle:'5° ciclo', rating:'4.2', subject:'Física I', avail:'Mañana', time:'enviada ayer', message:'Necesito ayuda con cinemática y dinámica para el examen.', color:'#2a8a55' },
      { id: 3, initials:'LQ', name:'Lucía Quispe', univ:'PUCP', cycle:'2° ciclo', rating:'4.6', subject:'Cálculo Diferencial', avail:'Noche', time:'hace 3 días', message:'Clases regulares, 2 veces por semana si es posible.', color:'#8B1A2B' },
    ];
    let solicitudes = JSON.parse(localStorage.getItem('tutorSolicitudes') || 'null') || defaultSolicitudes;

    const render = () => {
      list.innerHTML = '';
      const pending = solicitudes.filter(s => !s.rejected && !s.accepted);
      if (pending.length === 0) {
        list.innerHTML = '<div style="text-align:center; margin-top:40px; color:var(--muted);"><div style="font-size:36px; margin-bottom:8px;">📭</div><div style="font-weight:700; font-size:14px;">Sin solicitudes pendientes</div><div style="font-size:12px; margin-top:4px;">Cuando alguien te solicite, aparecerá aquí.</div></div>';
        return;
      }
      pending.forEach(s => {
        const card = document.createElement('div');
        card.style.cssText = 'display:flex; align-items:center; gap:12px; background:#fff; border:1px solid var(--soft); border-radius:12px; padding:14px; margin-bottom:10px; cursor:pointer;';
        card.innerHTML = `
          <div style="width:44px; height:44px; border-radius:50%; background:${s.color}; color:#fff; font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${s.initials}</div>
          <div style="flex:1; min-width:0;">
            <div style="font-weight:700; font-size:13px;">${s.name}</div>
            <div style="font-size:11px; color:var(--muted);">${s.subject} · ${s.time}</div>
          </div>
          <span style="background:#fff3cd; color:#856404; font-size:10px; font-weight:700; padding:3px 8px; border-radius:6px; white-space:nowrap;">Pendiente</span>
        `;
        card.addEventListener('click', () => {
          localStorage.setItem('selectedSolicitud', JSON.stringify(s));
          navigateTo('us17');
        });
        list.appendChild(card);
      });
    };
    render();
  }

  else if (screenId === 'us17') {
    // Solicitud detail — tutor accepts or rejects
    const sol = JSON.parse(localStorage.getItem('selectedSolicitud') || 'null');
    if (sol) {
      const av = frame.querySelector('#us17-avatar');
      const nm = frame.querySelector('#us17-name');
      const mt = frame.querySelector('#us17-meta');
      const rt = frame.querySelector('#us17-rating');
      const sb = frame.querySelector('#us17-subject');
      const av2 = frame.querySelector('#us17-avail');
      const ti = frame.querySelector('#us17-time');
      const ms = frame.querySelector('#us17-message');
      if (av) { av.textContent = sol.initials; av.style.background = sol.color; }
      if (nm) nm.textContent = sol.name;
      if (mt) mt.textContent = `${sol.univ} · ${sol.cycle}`;
      if (rt) rt.innerHTML = `★★★★☆ <span style="color:var(--muted);">${sol.rating}</span>`;
      if (sb) sb.textContent = sol.subject;
      if (av2) av2.textContent = sol.avail;
      if (ti) ti.textContent = sol.time;
      if (ms) ms.textContent = `"${sol.message}"`;
    }

    const btnAceptar = frame.querySelector('#btn-us17-aceptar');
    const btnRechazar = frame.querySelector('#btn-us17-rechazar');

    if (btnAceptar) {
      btnAceptar.addEventListener('click', () => {
        if (sol) {
          let sols = JSON.parse(localStorage.getItem('tutorSolicitudes') || '[]');
          const idx = sols.findIndex(s => s.id === sol.id);
          if (idx !== -1) { sols[idx].accepted = true; localStorage.setItem('tutorSolicitudes', JSON.stringify(sols)); }
          // Also add to upcoming sessions
          let upcoming = JSON.parse(localStorage.getItem('upcomingSessions') || '[]');
          upcoming.push({ id: Date.now(), tutor: sol.name, subject: sol.subject, date: 'Por definir', time: '--:--', duration: '60 min', reminder: false });
          localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
        }
        btnAceptar.textContent = '✓ Aceptada';
        btnAceptar.style.background = '#3aa56b';
        btnAceptar.disabled = true;
        if (btnRechazar) btnRechazar.disabled = true;
        setTimeout(() => navigateTo('us19'), 1200);
      });
    }

    if (btnRechazar) {
      btnRechazar.addEventListener('click', () => navigateTo('us18'));
    }
  }

  else if (screenId === 'us18') {
    // Reject with motivo — radio buttons + textarea
    const rows = frame.querySelectorAll('.motivo-row');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        rows.forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
      });
    });

    const btnCancelar = frame.querySelector('#btn-us18-cancelar');
    const btnConfirmar = frame.querySelector('#btn-us18-confirmar');

    if (btnCancelar) btnCancelar.addEventListener('click', () => history.back());

    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', () => {
        const sol = JSON.parse(localStorage.getItem('selectedSolicitud') || 'null');
        if (sol) {
          let sols = JSON.parse(localStorage.getItem('tutorSolicitudes') || '[]');
          const idx = sols.findIndex(s => s.id === sol.id);
          if (idx !== -1) { sols[idx].rejected = true; localStorage.setItem('tutorSolicitudes', JSON.stringify(sols)); }
        }
        btnConfirmar.textContent = '✓ Rechazada';
        btnConfirmar.style.background = '#3aa56b';
        setTimeout(() => navigateTo('us19'), 1000);
      });
    }
  }

  else if (screenId === 'us16') {
    const tutor = JSON.parse(localStorage.getItem('selectedTutor') || 'null');
    const avatarEl = frame.querySelector('#sol-avatar');
    const nameEl = frame.querySelector('#sol-name');
    const metaEl = frame.querySelector('#sol-meta');
    const creditsEl = frame.querySelector('#sol-credits');
    const subjectSel = frame.querySelector('#sol-subject');
    const toast = frame.querySelector('#sol-toast');

    if (tutor) {
      if (avatarEl) { avatarEl.textContent = tutor.initials; avatarEl.style.background = tutor.color; }
      if (nameEl) nameEl.textContent = 'Para: ' + tutor.name;
      if (metaEl) metaEl.textContent = tutor.univ + ' · ' + tutor.course;
      if (creditsEl) creditsEl.textContent = tutor.credits + ' créditos / hora';
      if (subjectSel) {
        tutor.subjects.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s; opt.textContent = s;
          subjectSel.appendChild(opt);
        });
      }
    }

    // Chips disponibilidad
    const chipM = frame.querySelector('#sol-chip-m');
    const chipT = frame.querySelector('#sol-chip-t');
    const chipN = frame.querySelector('#sol-chip-n');
    [chipM, chipT, chipN].forEach(c => {
      if (!c) return;
      c.addEventListener('click', () => {
        const on = c.classList.toggle('on');
        c.style.background = on ? 'var(--primary)' : 'transparent';
        c.style.color = on ? '#fff' : 'var(--primary)';
      });
    });

    const cancelSolBtn = frame.querySelector('#btn-cancel-solicitud');
    if (cancelSolBtn) {
      cancelSolBtn.addEventListener('click', () => navigateTo('us20'));
    }

    const sendBtn = frame.querySelector('#btn-send-solicitud');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        // Always go to US37 to confirm credit spend
        localStorage.setItem('pendingSolicitud', JSON.stringify({
          tutor: tutor ? tutor.name : 'Tutor',
          subject: frame.querySelector('#sol-subject')?.value || '',
          cost: tutor ? (tutor.credits || 3) : 3
        }));
        navigateTo('us37');
      });
    }
  }

  else if (screenId === 'us37') {
    const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const pending = JSON.parse(localStorage.getItem('pendingSolicitud') || 'null');
    const credits = u ? (u.credits ?? 15) : 15;
    const cost = pending ? (pending.cost || 3) : 3;
    const after = credits - cost;

    // Populate dynamic values
    const tutorNameEl = frame.querySelector('#us37-tutor-name');
    const tutorSubjEl = frame.querySelector('#us37-tutor-subj');
    const tutorAvEl = frame.querySelector('#us37-tutor-av');
    const saldoActEl = frame.querySelector('#us37-saldo-actual');
    const saldoTrasEl = frame.querySelector('#us37-saldo-tras');
    const costoEl = frame.querySelector('#us37-costo');
    const habilidadEl = frame.querySelector('#us37-habilidad');
    const msgEl = frame.querySelector('#us37-msg');
    const btnAceptar = frame.querySelector('#btn-us37-aceptar');

    if (pending) {
      if (tutorNameEl) tutorNameEl.textContent = pending.tutor;
      if (tutorSubjEl) tutorSubjEl.textContent = pending.subject;
      if (tutorAvEl) tutorAvEl.textContent = pending.tutor.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      if (habilidadEl) habilidadEl.textContent = pending.subject || 'Cálculo';
      if (costoEl) costoEl.textContent = cost + ' créditos';
    }
    if (saldoActEl) saldoActEl.textContent = credits;
    if (saldoTrasEl) saldoTrasEl.textContent = after >= 0 ? after : 0;

    if (after < 0) {
      if (msgEl) {
        msgEl.style.background = '#f8d7da';
        msgEl.innerHTML = '✗ Créditos insuficientes. <a href="us36.html" style="color:var(--primary);font-weight:700;">¿Cómo ganar más?</a>';
      }
      if (btnAceptar) { btnAceptar.disabled = true; btnAceptar.style.opacity = '0.4'; }
    }

    if (btnAceptar && after >= 0) {
      btnAceptar.addEventListener('click', () => {
        if (u) { u.credits = after; localStorage.setItem('currentUser', JSON.stringify(u)); }
        localStorage.removeItem('pendingSolicitud');
        btnAceptar.textContent = '✓ Solicitud enviada';
        btnAceptar.style.background = '#3aa56b';
        btnAceptar.disabled = true;
        setTimeout(() => navigateTo('us15'), 1500);
      });
    }
  }

  else if (screenId === 'us36') {
    const btnHistorial = frame.querySelector('#btn-ver-historial');
    if (btnHistorial) btnHistorial.addEventListener('click', () => navigateTo('us38'));
    const btnMiHist = frame.querySelector('#btn-us36-historial');
    if (btnMiHist) btnMiHist.addEventListener('click', () => navigateTo('us38'));
  }

  else if (screenId === 'us39') {
    const markBtn = frame.querySelector('#btn-us39-mark-read');
    if (markBtn) markBtn.addEventListener('click', () => {
      frame.querySelectorAll('.notif-card.unread').forEach(c => c.classList.remove('unread'));
      markBtn.style.opacity = '0.4';
      markBtn.disabled = true;
    });
  }

  else if (screenId === 'us38') {
    const tabs = ['tab-mov-todos', 'tab-mov-ganados', 'tab-mov-gastados'];
    const allMovs = [
      { type: 'g', title: 'Sesión con Luis M.', sub: '7 nov · enseñé', val: '+3' },
      { type: 'b', title: 'Solicitud Andrea P.', sub: '5 nov · aprendí', val: '−3' },
      { type: 'g', title: '5★ de Carlos M.', sub: '2 nov · bonus', val: '+1' },
      { type: 'g', title: 'Insignia destacada', sub: '1 nov · logro', val: '+5' },
    ];
    const listEl = frame.querySelector('#mov-list');
    const renderMovs = (filter) => {
      if (!listEl) return;
      listEl.innerHTML = '';
      const filtered = filter === 'ganados' ? allMovs.filter(m => m.type === 'g')
                      : filter === 'gastados' ? allMovs.filter(m => m.type === 'b')
                      : allMovs;
      filtered.forEach(m => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--soft);';
        row.innerHTML = `
          <div style="width:28px;height:28px;border-radius:50%;background:${m.type==='g'?'#d4edda':'#f8d7da'};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:${m.type==='g'?'#155724':'#721c24'};flex-shrink:0;">${m.type==='g'?'↑':'↓'}</div>
          <div style="flex:1;"><div style="font-size:13px;font-weight:600;color:var(--ink);">${m.title}</div><div style="font-size:11px;color:var(--muted);">${m.sub}</div></div>
          <div style="font-weight:700;font-size:13px;color:${m.type==='g'?'#3aa56b':'#d64545'};">${m.val}</div>
        `;
        listEl.appendChild(row);
      });
    };
    tabs.forEach(id => {
      const el = frame.querySelector('#' + id);
      if (!el) return;
      const filter = id.replace('tab-mov-', '');
      el.addEventListener('click', () => {
        tabs.forEach(t => {
          const b = frame.querySelector('#' + t);
          if (b) { b.style.background = 'transparent'; b.style.color = 'var(--primary)'; b.style.border = '1.5px solid var(--primary)'; }
        });
        el.style.background = 'var(--primary)'; el.style.color = '#fff'; el.style.border = 'none';
        renderMovs(filter === 'todos' ? '' : filter);
      });
    });
    renderMovs('');
  }

  else if (screenId === 'us40') {
    const btnSave = frame.querySelector('#btn-save-notif');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        btnSave.textContent = '✓ Preferencias guardadas';
        btnSave.style.background = '#3aa56b';
        btnSave.disabled = true;
        setTimeout(() => { btnSave.textContent = 'Guardar preferencias'; btnSave.style.background = ''; btnSave.disabled = false; }, 2000);
      });
    }
  }

  else if (screenId === 'us41') {
    frame.querySelector('#admin-nav-verif')?.addEventListener('click', () => navigateTo('us42'));
    frame.querySelector('#admin-nav-reports')?.addEventListener('click', () => navigateTo('us43'));
    frame.querySelector('#admin-nav-univs')?.addEventListener('click', () => navigateTo('us44'));
    const logoutOverlay = frame.querySelector('#logout-confirm');
    frame.querySelector('#btn-admin-logout')?.addEventListener('click', () => {
      if (logoutOverlay) logoutOverlay.style.display = 'flex';
    });
    frame.querySelector('#btn-logout-no')?.addEventListener('click', () => {
      if (logoutOverlay) logoutOverlay.style.display = 'none';
    });
    frame.querySelector('#btn-logout-yes')?.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }

  else if (screenId === 'us42') {
    const detail = frame.querySelector('#verif-detail');
    const cards = frame.querySelectorAll('.verif-card');
    const total = cards.length;

    const openDetail = (card) => {
      frame.querySelector('#detail-av').textContent = card.dataset.av;
      frame.querySelector('#detail-av').style.background = card.querySelector('.verif-av').style.background || 'var(--primary)';
      frame.querySelector('#detail-name').textContent = card.dataset.name;
      frame.querySelector('#detail-email').textContent = card.dataset.email;
      frame.querySelector('#detail-cert').textContent = card.dataset.cert;
      frame.querySelector('#detail-univ').textContent = card.dataset.univ;
      frame.querySelector('#detail-career').textContent = card.dataset.career;
      frame.querySelector('#detail-counter').textContent = `${card.dataset.id} / ${total}`;
      detail.classList.add('open');
    };

    cards.forEach(card => card.addEventListener('click', () => openDetail(card)));

    frame.querySelector('#detail-back')?.addEventListener('click', () => detail.classList.remove('open'));

    const showToast = (msg, color) => {
      const t = document.createElement('div');
      t.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${color};color:#fff;padding:10px 20px;border-radius:10px;font-weight:700;font-size:13px;z-index:9999;`;
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2000);
    };

    frame.querySelector('#btn-us42-aprobar')?.addEventListener('click', () => {
      showToast('✓ Certificado aprobado', '#27ae60');
      detail.classList.remove('open');
    });
    frame.querySelector('#btn-us42-rechazar')?.addEventListener('click', () => {
      showToast('✗ Certificado rechazado', '#d64545');
      detail.classList.remove('open');
    });
  }

  else if (screenId === 'us43') {
    const pendItems = frame.querySelectorAll('#rep-list > div');
    const tabPend = frame.querySelector('#tab-rep-pend');
    const tabRes = frame.querySelector('#tab-rep-res');
    const repList = frame.querySelector('#rep-list');
    const resolvedHTML = `
      <div style="background:#fff;border:1px solid var(--soft);border-radius:10px;padding:12px;margin-bottom:8px;">
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <span style="color:#27ae60;font-size:16px;flex-shrink:0;">✓</span>
          <div><div style="font-weight:700;font-size:13px;">Reseña falsa eliminada</div><div style="font-size:12px;color:var(--muted);margin-top:2px;">Carlos G. → Luis M.</div><div style="font-size:11px;color:var(--muted);">resuelto hace 2 días</div></div>
        </div>
      </div>
      <div style="background:#fff;border:1px solid var(--soft);border-radius:10px;padding:12px;margin-bottom:8px;">
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <span style="color:#27ae60;font-size:16px;flex-shrink:0;">✓</span>
          <div><div style="font-weight:700;font-size:13px;">Cuenta suspendida</div><div style="font-size:12px;color:var(--muted);margin-top:2px;">Usuario "tutor_fake22"</div><div style="font-size:11px;color:var(--muted);">resuelto hace 5 días</div></div>
        </div>
      </div>`;
    const pendingHTML = repList ? repList.innerHTML : '';
    const setTab = (isPend) => {
      [tabPend, tabRes].forEach(t => { if (!t) return; t.style.background = ''; t.style.color = ''; t.style.border = ''; });
      if (isPend) {
        if (tabPend) { tabPend.style.background = 'var(--primary)'; tabPend.style.color = '#fff'; tabPend.style.border = 'none'; }
        if (tabRes) { tabRes.style.background = 'transparent'; tabRes.style.color = 'var(--primary)'; tabRes.style.border = '1.5px solid var(--primary)'; }
        if (repList) repList.innerHTML = pendingHTML;
      } else {
        if (tabRes) { tabRes.style.background = 'var(--primary)'; tabRes.style.color = '#fff'; tabRes.style.border = 'none'; }
        if (tabPend) { tabPend.style.background = 'transparent'; tabPend.style.color = 'var(--primary)'; tabPend.style.border = '1.5px solid var(--primary)'; }
        if (repList) repList.innerHTML = resolvedHTML;
      }
    };
    if (tabPend) tabPend.addEventListener('click', () => setTab(true));
    if (tabRes) tabRes.addEventListener('click', () => setTab(false));
    // Add action button handlers (toast)
    const actionToast = (msg) => { const t = document.createElement('div'); t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:10px 20px;border-radius:10px;font-weight:700;font-size:13px;z-index:9999;'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),2000); };
    frame.querySelector('#btn-rep-eliminar')?.addEventListener('click', () => actionToast('🗑 Contenido eliminado'));
    frame.querySelector('#btn-rep-suspender')?.addEventListener('click', () => actionToast('🚫 Usuario suspendido'));
    frame.querySelector('#btn-rep-desestimar')?.addEventListener('click', () => actionToast('✓ Reporte desestimado'));
  }

  else if (screenId === 'us44') {
    const btnNueva = frame.querySelector('#btn-nueva-univ');
    if (btnNueva) btnNueva.addEventListener('click', () => {
      const t = document.createElement('div');
      t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:10px 20px;border-radius:10px;font-weight:700;font-size:13px;z-index:9999;';
      t.textContent = '🏫 Función próximamente';
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 2000);
    });
  }

  else if (screenId === 'us20') {
    const tutor = JSON.parse(localStorage.getItem('selectedTutor') || 'null');
    const cancellingPend = JSON.parse(localStorage.getItem('cancellingPendingSolicitud') || 'null');
    const source = cancellingPend || tutor;
    const infoEl = frame.querySelector('#us20-info');
    const tutorEl = frame.querySelector('#us20-tutor');
    const subjectEl = frame.querySelector('#us20-subject');
    if (source && infoEl) {
      infoEl.style.display = 'block';
      if (tutorEl) tutorEl.textContent = source.name || source.tutor || 'Tutor';
      if (subjectEl) subjectEl.textContent = source.subject || '';
    }

    // Motivo radio options
    let selectedMotivo = null;
    const opts = frame.querySelectorAll('.motivo-opt');
    const otroWrap = frame.querySelector('#us20-otro-wrap');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        opts.forEach(o => o.classList.remove('sel'));
        opt.classList.add('sel');
        selectedMotivo = opt.dataset.val;
        if (otroWrap) otroWrap.style.display = selectedMotivo === 'otro' ? 'block' : 'none';
      });
    });

    const btnSi = frame.querySelector('#btn-us20-si');
    const btnNo = frame.querySelector('#btn-us20-no');
    if (btnSi) {
      btnSi.addEventListener('click', () => {
        if (cancellingPend) {
          const pends = JSON.parse(localStorage.getItem('studentSolicitudes') || '[]');
          const updated = pends.map(p => p.id === cancellingPend.id ? { ...p, status: 'cancelled' } : p);
          localStorage.setItem('studentSolicitudes', JSON.stringify(updated));
          localStorage.removeItem('cancellingPendingSolicitud');
          navigateTo('us30');
        } else {
          navigateTo('us11');
        }
      });
    }
    if (btnNo) {
      btnNo.addEventListener('click', () => {
        localStorage.removeItem('cancellingPendingSolicitud');
        history.back();
      });
    }
  }

  else if (screenId === 'us24') {
    const u = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const isTutor = u && u.role === 'tutor';
    const listEl = frame.querySelector('#us24-list');
    if (!listEl) return;

    const tutorChats = [
      { id: 't1', name: 'Rogger Escalante', initials: 'RE', last: '¿A qué hora sería la sesión profe?', time: '12:30', unread: 2,
        messages: [
          { text: 'Hola, vi su perfil y me interesa Cálculo Diferencial', mine: false, time: '12:10' },
          { text: 'Claro Rogger, ¿qué temas necesitas reforzar?', mine: true, time: '12:15' },
          { text: 'Derivadas implícitas sobre todo, tengo examen el viernes', mine: false, time: '12:20' },
          { text: 'Perfecto, puedo el jueves a las 7pm por Meet', mine: true, time: '12:25' },
          { text: '¿A qué hora sería la sesión profe?', mine: false, time: '12:30' }
        ]
      },
      { id: 't2', name: 'Camila Torres', initials: 'CT', last: 'Muchas gracias por la clase 🙌', time: 'ayer',
        messages: [
          { text: 'Buenos días, ¿tiene disponibilidad esta semana para Física?', mine: false, time: '9:00' },
          { text: 'Hola Camila, sí tengo el martes por la tarde', mine: true, time: '9:10' },
          { text: 'Perfecto! Me anoto', mine: false, time: '9:12' },
          { text: 'Aquí te paso el enlace de Meet: meet.google.com/xyz', mine: true, time: '9:15' },
          { text: 'Muchas gracias por la clase 🙌', mine: false, time: 'ayer' }
        ]
      },
      { id: 't3', name: 'Diego Quispe', initials: 'DQ', last: 'Entendido, nos vemos el lunes', time: 'lun',
        messages: [
          { text: 'Profe, ¿podría reforzarme Química Orgánica?', mine: false, time: 'lun 10:00' },
          { text: 'Sí claro Diego, ¿qué temas exactamente?', mine: true, time: 'lun 10:05' },
          { text: 'Hidrocarburos y reacciones de sustitución', mine: false, time: 'lun 10:08' },
          { text: 'Ok, el lunes a las 6pm está bien?', mine: true, time: 'lun 10:10' },
          { text: 'Entendido, nos vemos el lunes', mine: false, time: 'lun 10:11' }
        ]
      }
    ];

    const studentChats = [
      { id: 's1', name: 'Andrea Paredes', initials: 'AP', last: 'Conéctate a las 7pm al enlace 👍', time: '12:30', unread: 1,
        messages: [
          { text: 'Hola Andrea, gracias por aceptar mi solicitud!', mine: true, time: '11:00' },
          { text: 'Hola! Claro, ¿tienes dudas previas a la sesión?', mine: false, time: '11:05' },
          { text: 'Sí, me cuesta mucho la regla de la cadena', mine: true, time: '11:10' },
          { text: 'Tranquilo, lo vemos desde el inicio. Lleva ejercicios del libro', mine: false, time: '11:20' },
          { text: 'Conéctate a las 7pm al enlace 👍', mine: false, time: '12:30' }
        ]
      },
      { id: 's2', name: 'Luis Mendoza', initials: 'LM', last: 'Te paso la fórmula que aplicamos…', time: 'ayer',
        messages: [
          { text: 'Luis, ¿me puedes explicar los vectores de nuevo?', mine: true, time: 'ayer 15:00' },
          { text: 'Claro, ¿qué parte te quedó confusa?', mine: false, time: 'ayer 15:10' },
          { text: 'El producto cruzado, no entiendo cuándo usarlo', mine: true, time: 'ayer 15:15' },
          { text: 'Ah es para calcular el área de paralelogramos o perpendiculares', mine: false, time: 'ayer 15:20' },
          { text: 'Te paso la fórmula que aplicamos…', mine: false, time: 'ayer 15:22' }
        ]
      },
      { id: 's3', name: 'Karen Ríos', initials: 'KR', last: '¡Gracias por la sesión! 😊', time: 'lun',
        messages: [
          { text: 'Hola Karen, ¿tiene espacio para Química esta semana?', mine: true, time: 'lun 9:00' },
          { text: 'Hola! Sí tengo el miércoles a las 5pm', mine: false, time: 'lun 9:08' },
          { text: 'Perfecto, ahí estaré', mine: true, time: 'lun 9:10' },
          { text: 'Listo, te mando el link por acá', mine: false, time: 'lun 9:11' },
          { text: '¡Gracias por la sesión! 😊', mine: true, time: 'lun 18:05' }
        ]
      }
    ];

    const chats = isTutor ? tutorChats : studentChats;
    localStorage.setItem('chatList', JSON.stringify(chats));

    chats.forEach(chat => {
      const card = document.createElement('div');
      card.style.cssText = 'display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid var(--soft); cursor:pointer; background:#fff;';
      card.innerHTML = `
        <div style="width:46px;height:46px;border-radius:50%;background:var(--primary);color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${chat.initials}</div>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
            <span style="font-weight:700;font-size:13px;color:var(--ink);">${chat.name}</span>
            <span style="font-size:10px;color:var(--muted);">${chat.time}</span>
          </div>
          <div style="font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${chat.last}</div>
        </div>
        ${chat.unread ? `<span style="background:var(--primary);color:#fff;border-radius:50%;min-width:18px;height:18px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;">${chat.unread}</span>` : ''}
      `;
      card.addEventListener('click', () => {
        localStorage.setItem('selectedChat', JSON.stringify(chat));
        navigateTo('us21');
      });
      listEl.appendChild(card);
    });
  }

  else if (screenId === 'us21') {
    const chat = JSON.parse(localStorage.getItem('selectedChat') || 'null');
    const contact = chat || { name: 'Andrea Paredes', initials: 'AP', messages: [] };

    const nameEl = frame.querySelector('#chat-name');
    const avEl = frame.querySelector('#chat-av');
    const messagesEl = frame.querySelector('#chat-messages');
    const inputEl = frame.querySelector('#chat-input');
    const sendBtn = frame.querySelector('#chat-send-btn');
    const backBtn = frame.querySelector('#chat-back-btn');
    const menuBtn = frame.querySelector('#chat-menu-btn');
    const dropdown = frame.querySelector('#chat-dropdown');
    const ddInfo = frame.querySelector('#dd-info');
    const ddBlock = frame.querySelector('#dd-block');

    if (nameEl) nameEl.textContent = contact.name;
    if (avEl) avEl.textContent = contact.initials || contact.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

    let messages = contact.messages ? [...contact.messages] : [
      { text: 'Hola, ¿cómo puedo ayudarte?', mine: false, time: '12:00' },
      { text: '¡Hola! Tengo dudas con derivadas', mine: true, time: '12:01' }
    ];

    const getTime = () => { const n = new Date(); return n.getHours() + ':' + String(n.getMinutes()).padStart(2,'0'); };

    const renderMessages = () => {
      if (!messagesEl) return;
      messagesEl.innerHTML = '';
      messages.forEach(msg => {
        const wrap = document.createElement('div');
        wrap.className = 'bubble-wrap' + (msg.mine ? ' mine' : '');
        if (msg.file) {
          wrap.innerHTML = `<div class="bubble ${msg.mine ? 'mine' : 'theirs'}" style="padding:10px 12px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:20px;">${msg.file === 'imagen' ? '🖼️' : msg.file === 'pdf' ? '📄' : '📷'}</span>
              <div><div style="font-size:12px;font-weight:600;">${msg.text}</div><div style="font-size:10px;opacity:.7;">Toca para ver</div></div>
            </div>
            <div class="bubble-time">${msg.time}</div>
          </div>`;
        } else {
          wrap.innerHTML = `<div class="bubble ${msg.mine ? 'mine' : 'theirs'}">${msg.text}<div class="bubble-time">${msg.time}</div></div>`;
        }
        messagesEl.appendChild(wrap);
      });
      messagesEl.scrollTop = messagesEl.scrollHeight;
    };
    renderMessages();

    const attachBtn = frame.querySelector('#chat-attach-btn');
    const attachSheet = frame.querySelector('#attach-sheet');
    if (attachBtn && attachSheet) {
      attachBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        attachSheet.style.display = attachSheet.style.display === 'none' ? 'block' : 'none';
      });
      attachSheet.querySelectorAll('.attach-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          const type = opt.dataset.type;
          const names = { imagen: 'Foto_clase.jpg', pdf: 'Ejercicios_calculo.pdf', camara: 'Foto_20241107.jpg' };
          messages.push({ text: names[type], mine: true, time: getTime(), file: type });
          attachSheet.style.display = 'none';
          renderMessages();
        });
      });
      document.addEventListener('click', (e) => {
        if (!attachSheet.contains(e.target) && e.target !== attachBtn) attachSheet.style.display = 'none';
      });
    }

    if (sendBtn && inputEl) {
      const doSend = () => {
        const txt = inputEl.value.trim();
        if (!txt) return;
        messages.push({ text: txt, mine: true, time: getTime() });
        inputEl.value = '';
        renderMessages();
      };
      sendBtn.addEventListener('click', doSend);
      inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') doSend(); });
    }

    if (backBtn) backBtn.addEventListener('click', () => navigateTo('us24'));

    if (menuBtn && dropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });
      document.addEventListener('click', () => dropdown.classList.remove('open'), { once: false });
    }

    if (ddInfo) {
      ddInfo.addEventListener('click', () => {
        dropdown.classList.remove('open');
        localStorage.setItem('selectedProfile', JSON.stringify(contact));
        navigateTo('us15');
      });
    }

    if (ddBlock) {
      ddBlock.addEventListener('click', () => {
        dropdown.classList.remove('open');
        localStorage.setItem('blockingContact', JSON.stringify(contact));
        navigateTo('us25');
      });
    }
  }

  else if (screenId === 'us25') {
    const contact = JSON.parse(localStorage.getItem('blockingContact') || 'null');
    const nameEl = frame.querySelector('#us25-name');
    const fullnameEl = frame.querySelector('#us25-fullname');
    const avEl = frame.querySelector('#us25-av');
    const metaEl = frame.querySelector('#us25-meta');
    const cardEl = frame.querySelector('#us25-card');

    if (contact) {
      if (nameEl) nameEl.textContent = contact.name;
      if (cardEl) cardEl.style.display = 'flex';
      if (avEl) avEl.textContent = contact.initials || (contact.name || '').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      if (fullnameEl) fullnameEl.textContent = contact.name;
      if (metaEl) metaEl.textContent = contact.meta || 'Contacto de Swaply';
    }

    const btnSi = frame.querySelector('#btn-us25-si');
    const btnNo = frame.querySelector('#btn-us25-no');
    if (btnSi) {
      btnSi.addEventListener('click', () => {
        const chats = JSON.parse(localStorage.getItem('chatList') || '[]');
        const updated = chats.filter(c => c.id !== (contact && contact.id));
        localStorage.setItem('chatList', JSON.stringify(updated));
        localStorage.removeItem('blockingContact');
        localStorage.removeItem('selectedChat');
        btnSi.textContent = '✓ Bloqueado';
        btnSi.style.background = '#555';
        setTimeout(() => navigateTo('us24'), 1200);
      });
    }
    if (btnNo) {
      btnNo.addEventListener('click', () => {
        localStorage.removeItem('blockingContact');
        history.back();
      });
    }
  }

  else if (screenId === 'us12') {
    const checklines = frame.querySelectorAll('.ckline');
    let selectedUniv = localStorage.getItem('filterUniv') || null;
    const applyBtn = frame.querySelector('.btn');
    const clearEl = frame.querySelector('.right');

    checklines.forEach(line => {
      const ck = line.querySelector('.ck');
      const univName = line.textContent.replace('✓','').split('(')[0].trim();
      if (selectedUniv && univName === selectedUniv && ck) { ck.classList.add('on'); ck.textContent = '✓'; }
      line.style.cursor = 'pointer';
      line.addEventListener('click', () => {
        checklines.forEach(l => { const c = l.querySelector('.ck'); if (c) { c.classList.remove('on'); c.textContent = ''; } });
        if (ck) { ck.classList.add('on'); ck.textContent = '✓'; }
        selectedUniv = univName;
      });
    });
    if (clearEl) clearEl.style.cursor = 'pointer';
    if (clearEl) clearEl.addEventListener('click', () => {
      localStorage.removeItem('filterUniv');
      checklines.forEach(l => { const c = l.querySelector('.ck'); if (c) { c.classList.remove('on'); c.textContent = ''; } });
      selectedUniv = null;
    });
    if (applyBtn) applyBtn.addEventListener('click', () => {
      if (selectedUniv) localStorage.setItem('filterUniv', selectedUniv);
      else localStorage.removeItem('filterUniv');
      navigateTo('us11');
    });
  }

  else if (screenId === 'us13') {
    const labels = ['Mañanas','Tardes','Noches'];
    const optDivs = Array.from(frame.querySelectorAll('.col > div'));
    let selectedDisp = localStorage.getItem('filterDisp') || null;
    const applyBtn = frame.querySelector('.btn:not(.ghost)');
    const clearBtn = frame.querySelector('.btn.ghost');

    optDivs.forEach((div, idx) => {
      const label = labels[idx];
      if (!label) return;
      div.style.cursor = 'pointer';
      if (selectedDisp === label) div.style.border = '2px solid var(--primary)';
      else div.style.border = '1.5px solid #c9c7c2';
      div.addEventListener('click', () => {
        optDivs.forEach(d => { d.style.border = '1.5px solid #c9c7c2'; });
        div.style.border = '2px solid var(--primary)';
        selectedDisp = label;
      });
    });
    if (clearBtn) clearBtn.addEventListener('click', () => {
      localStorage.removeItem('filterDisp');
      optDivs.forEach(d => { d.style.border = '1.5px solid #c9c7c2'; });
      selectedDisp = null;
    });
    if (applyBtn) applyBtn.addEventListener('click', () => {
      if (selectedDisp) localStorage.setItem('filterDisp', selectedDisp);
      else localStorage.removeItem('filterDisp');
      navigateTo('us11');
    });
  }

  else if (screenId === 'us08') {
    const photoInput = frame.querySelector('#photo-input');
    const previewEl = frame.querySelector('#photo-preview');
    const photoIcon = frame.querySelector('#photo-icon');
    const errorDiv = frame.querySelector('#photo-error');
    const previewName = frame.querySelector('#photo-preview-name');
    const previewUniv = frame.querySelector('#photo-preview-univ');
    const saveBtn = frame.querySelector('#btn-save-photo');

    if (user) {
      if (previewName) previewName.textContent = user.name || '';
      const profile = user.studentProfile || user.tutorProfile || {};
      if (previewUniv) previewUniv.textContent = (profile.univ && profile.career) ? profile.univ + ' · ' + profile.career : '';
      if (user.photo && previewEl) {
        previewEl.innerHTML = `<img src="${user.photo}" style="width:100%;height:100%;object-fit:cover;" alt="Foto">`;
      } else if (previewEl) {
        previewEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : '?';
        previewEl.style.background = 'var(--primary)'; previewEl.style.color = '#fff'; previewEl.style.fontWeight = '700';
      }
    }

    let pendingPhoto = null;
    if (photoInput) {
      photoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { if (errorDiv) errorDiv.style.display = 'flex'; return; }
        if (errorDiv) errorDiv.style.display = 'none';
        const reader = new FileReader();
        reader.onload = ev => {
          pendingPhoto = ev.target.result;
          if (previewEl) previewEl.innerHTML = `<img src="${pendingPhoto}" style="width:100%;height:100%;object-fit:cover;" alt="Foto">`;
          if (photoIcon) photoIcon.textContent = '✅';
        };
        reader.readAsDataURL(file);
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (pendingPhoto && user) {
          user.photo = pendingPhoto;
          localStorage.setItem('currentUser', JSON.stringify(user));
          let users = JSON.parse(localStorage.getItem('users') || '[]');
          users = users.map(u => u.email === user.email ? user : u);
          localStorage.setItem('users', JSON.stringify(users));
        }
        navigateTo('us07');
      });
    }
  }

  else if (screenId === 'sesiones-tutor') {
    const container = frame.querySelector('#tutor-sesiones-container');
    const tabProx = frame.querySelector('#tab-tutor-prox');
    const tabComp = frame.querySelector('#tab-tutor-comp');
    let activeTab = 'proximas';
    const upcoming = [
      { student:'Carlos Mendoza', subject:'Cálculo Diferencial', date:'Jueves 7 Nov', time:'15:00', univ:'UNMSM' },
      { student:'Fátima García', subject:'Álgebra Lineal', date:'Viernes 8 Nov', time:'18:00', univ:'UPC' },
    ];
    const completed = [
      { student:'Pedro Alva', subject:'Cálculo Diferencial', date:'28 oct', rating:5 },
      { student:'Daniela Vega', subject:'Estadística', date:'22 oct', rating:4 },
      { student:'Omar Quispe', subject:'Cálculo Integral', date:'15 oct', rating:5 },
    ];
    const setTabST = (a, b) => {
      if (!a || !b) return;
      a.style.background = 'var(--primary)'; a.style.color = '#fff'; a.style.borderBottom = 'none';
      b.style.background = 'transparent'; b.style.color = 'var(--primary)'; b.style.borderBottom = '2px solid transparent';
    };
    const renderST = () => {
      if (!container) return;
      container.innerHTML = '';
      if (activeTab === 'proximas') {
        setTabST(tabProx, tabComp);
        upcoming.forEach(s => {
          const card = document.createElement('div');
          card.style.cssText = 'background:#fff;border:1px solid var(--primary);border-radius:10px;padding:12px;margin-bottom:8px;';
          card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><span style="font-weight:700;font-size:12px;color:var(--primary);">${s.subject}</span><span style="font-size:10px;background:var(--brand-bg);padding:2px 6px;border-radius:6px;font-weight:600;color:var(--primary);">${s.date} ${s.time}</span></div><div style="font-size:11px;">Estudiante: <b>${s.student}</b> · ${s.univ}</div>`;
          container.appendChild(card);
        });
      } else {
        setTabST(tabComp, tabProx);
        completed.forEach(s => {
          const card = document.createElement('div');
          card.style.cssText = 'background:#fff;border:1px solid #e8e6e1;border-radius:10px;padding:10px;margin-bottom:8px;';
          card.innerHTML = `<div style="font-weight:600;font-size:12px;">${s.student}</div><div style="font-size:10px;color:var(--muted);">${s.subject} · ${s.date}</div><div style="font-size:10px;color:#f5a623;">${'★'.repeat(s.rating)}${'☆'.repeat(5-s.rating)} <b style="color:var(--ink);">calificación: ${s.rating}</b></div>`;
          container.appendChild(card);
        });
      }
    };
    renderST();
    if (tabProx) tabProx.addEventListener('click', () => { activeTab = 'proximas'; renderST(); });
    if (tabComp) tabComp.addEventListener('click', () => { activeTab = 'completadas'; renderST(); });
  }

  else if (screenId === 'buscar-solicitudes') {
    const container = frame.querySelector('#solicitudes-container');
    const solicitudes = [
      { initials:'CM', name:'Carlos Mendoza', univ:'UNMSM', subject:'Cálculo Diferencial', note:'Busco tutor para preparar examen parcial', time:'hace 2h', color:'linear-gradient(135deg,#c8daf4,#3a6bb5)' },
      { initials:'FG', name:'Fátima García', univ:'UPC', subject:'Álgebra Lineal', note:'Necesito ayuda con matrices y vectores', time:'hace 3h', color:'linear-gradient(135deg,#d4f4e4,#2a8a55)' },
      { initials:'PA', name:'Pedro Alva', univ:'PUCP', subject:'Cálculo Diferencial', note:'Clases regulares, 2 veces por semana', time:'hace 5h', color:'linear-gradient(135deg,#fde8c8,#d68a2a)' },
      { initials:'LQ', name:'Lucía Quispe', univ:'UNI', subject:'Estadística', note:'Apoyo con probabilidades y distribuciones', time:'hace 1d', color:'linear-gradient(135deg,#f4d4d8,#8B1A2B)' },
      { initials:'JR', name:'Jorge Rojas', univ:'UNMSM', subject:'Cálculo Diferencial', note:'Primera semana de clases, necesito base sólida', time:'hace 1d', color:'linear-gradient(135deg,#e8d4f4,#7a2a8b)' },
    ];
    if (container) {
      solicitudes.forEach(s => {
        const card = document.createElement('div');
        card.style.cssText = 'background:#fff;border:1px solid #e8e6e1;border-radius:12px;padding:12px;margin-bottom:10px;';
        card.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <div class="av" style="background:${s.color};color:#fff;font-weight:700;flex-shrink:0;">${s.initials}</div>
            <div style="flex:1;"><div style="font-weight:700;font-size:12px;">${s.name}</div><div style="font-size:10px;color:var(--muted);">${s.univ}</div></div>
            <div style="font-size:10px;color:var(--muted);">${s.time}</div>
          </div>
          <span class="tag" style="font-size:10px;margin-bottom:6px;display:inline-block;">${s.subject}</span>
          <div style="font-size:11px;color:var(--ink);margin-bottom:10px;">"${s.note}"</div>
          <div class="reject-reason" style="display:none;margin-bottom:8px;">
            <textarea placeholder="Motivo del rechazo (opcional)…" style="width:100%;font-size:11px;padding:6px;border:1px solid #e8e6e1;border-radius:6px;resize:none;height:52px;box-sizing:border-box;"></textarea>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn-aceptar" style="flex:1;padding:6px;background:var(--primary);color:#fff;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Aceptar</button>
            <button type="button" class="btn-rechazar" style="flex:1;padding:6px;background:transparent;color:#d64545;border:1px solid #d64545;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Rechazar</button>
          </div>
        `;

        const btnAceptar = card.querySelector('.btn-aceptar');
        const btnRechazar = card.querySelector('.btn-rechazar');
        const rejectArea = card.querySelector('.reject-reason');

        btnAceptar.addEventListener('click', () => {
          card.style.opacity = '0.5';
          btnAceptar.textContent = 'Aceptada ✓';
          btnAceptar.disabled = true;
          btnRechazar.disabled = true;
        });

        let rechazando = false;
        btnRechazar.addEventListener('click', () => {
          if (!rechazando) {
            rechazando = true;
            rejectArea.style.display = 'block';
            btnRechazar.textContent = 'Confirmar rechazo';
          } else {
            card.style.opacity = '0.5';
            btnRechazar.textContent = 'Rechazada ✗';
            btnRechazar.disabled = true;
            btnAceptar.disabled = true;
            rejectArea.style.display = 'none';
          }
        });

        container.appendChild(card);
      });
    }
  }

  else if (screenId === 'us04') {
    // Settings: view mode toggle + logout
    const viewSelect = frame.querySelector('#config-view-mode');
    const btnLogout = frame.querySelector('#btn-logout-submit');

    const currentView = localStorage.getItem('appView') || 'pc';
    if (viewSelect) viewSelect.value = currentView;

    if (viewSelect) {
      viewSelect.addEventListener('change', () => {
        const newMode = viewSelect.value;
        localStorage.setItem('appView', newMode);
        document.body.classList.remove('view-pc', 'view-movil');
        document.body.classList.add('view-' + newMode);
      });
    }

    if (btnLogout) {
      btnLogout.onclick = () => {
        localStorage.removeItem('currentUser');
        navigateTo('us45');
      };
    }
  }

  else if (screenId === 'us27') {
    // Reminder configuration screen — populated from pendingReminder in localStorage
    const session = JSON.parse(localStorage.getItem('pendingReminder') || 'null');
    if (session) {
      const titleEl = frame.querySelector('#rem-title');
      const dtEl = frame.querySelector('#rem-datetime');
      const subjEl = frame.querySelector('#rem-subject');
      if (titleEl) titleEl.textContent = `Sesión con ${session.tutor}`;
      if (dtEl) dtEl.textContent = `${session.date} · ${session.time}`;
      if (subjEl) subjEl.textContent = `${session.subject} · ${session.duration}`;
    }

    const btnSave = frame.querySelector('#btn-save-reminder');
    if (btnSave) {
      btnSave.onclick = () => {
        const check24 = frame.querySelector('#check-24h');
        const check1h = frame.querySelector('#check-1h');
        const check15m = frame.querySelector('#check-15m');
        const prefs = {
          h24: check24 ? check24.checked : true,
          h1: check1h ? check1h.checked : true,
          m15: check15m ? check15m.checked : false
        };
        if (session) {
          session.reminderPrefs = prefs;
          localStorage.setItem('pendingReminder', JSON.stringify(session));
          // Update upcoming sessions too
          let upcoming = JSON.parse(localStorage.getItem('upcomingSessions') || '[]');
          const idx = upcoming.findIndex(s => s.id === session.id);
          if (idx !== -1) { upcoming[idx].reminder = true; upcoming[idx].reminderPrefs = prefs; }
          localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
        }
        btnSave.textContent = '✓ Guardado';
        btnSave.style.background = '#3aa56b';
        setTimeout(() => history.back(), 1200);
      };
    }
  }

  else if (screenId === 'us28') {
    // Session detail + Mark as complete — populated from selectedSession in localStorage
    const session = JSON.parse(localStorage.getItem('selectedSession') || 'null');

    if (session) {
      const avatarEl = frame.querySelector('#us28-avatar');
      const tutorEl = frame.querySelector('#us28-tutor');
      const subjectEl = frame.querySelector('#us28-subject');
      const dateEl = frame.querySelector('#us28-date');
      const durEl = frame.querySelector('#us28-duration');
      if (avatarEl) {
        avatarEl.textContent = session.tutor ? session.tutor.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : 'AP';
      }
      if (tutorEl) tutorEl.textContent = session.tutor || 'Tutor';
      if (subjectEl) subjectEl.textContent = session.subject || '';
      if (dateEl) dateEl.textContent = `${session.date || ''} · ${session.time || ''}`;
      if (durEl) durEl.textContent = session.duration || '60 min';
    }

    const btnMark = frame.querySelector('#btn-mark-complete');
    const btnRate = frame.querySelector('#btn-rate-session');
    const statusEl = frame.querySelector('#us28-status');
    const creditsBlock = frame.querySelector('#us28-credits-block');

    if (btnMark) {
      btnMark.onclick = () => {
        // Mark session as complete, award credits
        if (statusEl) { statusEl.textContent = '✓ Completada'; statusEl.style.background = '#d1fae5'; statusEl.style.color = '#065f46'; }
        if (creditsBlock) creditsBlock.style.display = 'flex';
        btnMark.style.display = 'none';
        if (btnRate) btnRate.style.display = 'block';

        // Move from upcoming to completed in localStorage
        if (session) {
          let upcoming = JSON.parse(localStorage.getItem('upcomingSessions') || '[]');
          upcoming = upcoming.filter(s => s.id !== session.id);
          localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
          let completed = JSON.parse(localStorage.getItem('completedSessions') || '[]');
          completed.unshift({ id: session.id || Date.now(), tutor: session.tutor, subject: session.subject, date: session.date, duration: session.duration, rating: 0 });
          localStorage.setItem('completedSessions', JSON.stringify(completed));
        }
      };
    }

    if (btnRate) {
      btnRate.onclick = () => navigateTo('us31');
    }
  }

  else if (screenId === 'us31') {
    // Califica al tutor — stars interactivos, tags, submit → us33
    const stars = frame.querySelectorAll('#rate-stars-container .star');
    const feedback = frame.querySelector('#rate-stars-feedback');
    const tags = frame.querySelectorAll('#rate-tags-container .chip');
    const btnSubmit = frame.querySelector('#btn-submit-rating');
    const feedbackTexts = ['', 'Muy malo 😞', 'Malo 😕', 'Regular 😐', 'Bueno 👍', '¡Excelente! 🌟'];
    let selectedRating = 0;

    stars.forEach(star => {
      const val = parseInt(star.dataset.value);
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => s.style.color = i < val ? 'var(--cta)' : '#ccc');
      });
      star.addEventListener('mouseleave', () => {
        stars.forEach((s, i) => s.style.color = i < selectedRating ? 'var(--cta)' : '#ccc');
      });
      star.addEventListener('click', () => {
        selectedRating = val;
        stars.forEach((s, i) => s.style.color = i < selectedRating ? 'var(--cta)' : '#ccc');
        if (feedback) feedback.textContent = feedbackTexts[selectedRating];
      });
    });

    const addTagFn = (container) => {
      frame.querySelectorAll(container + ' .chip').forEach(tag => {
        tag.addEventListener('click', () => tag.classList.toggle('on'));
      });
      const addBtn = frame.querySelector('#tag-add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          const label = prompt('Escribe una etiqueta:');
          if (!label || !label.trim()) return;
          const chip = document.createElement('span');
          chip.className = 'chip on';
          chip.dataset.tag = label.trim();
          chip.style.cursor = 'pointer';
          chip.textContent = label.trim();
          chip.addEventListener('click', () => chip.classList.toggle('on'));
          addBtn.parentElement.insertBefore(chip, addBtn);
        });
      }
    };
    addTagFn('#rate-tags-container');

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        if (selectedRating === 0) { alert('Por favor selecciona una calificación.'); return; }
        const comment = frame.querySelector('#rate-comment')?.value.trim() || '';
        const selectedTags = [...frame.querySelectorAll('#rate-tags-container .chip.on')].map(c => c.dataset.tag).filter(Boolean);
        const sess = JSON.parse(localStorage.getItem('completingSession') || '{}');
        const reviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
        reviews.unshift({ id: Date.now(), from: sess.tutor || 'Tutor', rating: selectedRating, comment, tags: selectedTags, date: new Date().toLocaleDateString('es-PE', {day:'numeric', month:'short'}) });
        localStorage.setItem('myReviews', JSON.stringify(reviews));
        navigateTo('us33');
      });
    }
  }

  else if (screenId === 'us32') {
    const stars = frame.querySelectorAll('#rate-apprentice-stars-container .star');
    const feedback = frame.querySelector('#rate-apprentice-feedback');
    const btnSubmit = frame.querySelector('#btn-submit-apprentice-rating');
    const feedbackTexts = ['', 'Muy malo 😞', 'Malo 😕', 'Regular 😐', 'Bueno 👍', '¡Excelente! 🌟'];
    let selectedRating = 0;

    stars.forEach(star => {
      const val = parseInt(star.dataset.value);
      star.addEventListener('mouseenter', () => { stars.forEach((s, i) => s.style.color = i < val ? 'var(--cta)' : '#ccc'); });
      star.addEventListener('mouseleave', () => { stars.forEach((s, i) => s.style.color = i < selectedRating ? 'var(--cta)' : '#ccc'); });
      star.addEventListener('click', () => {
        selectedRating = val;
        stars.forEach((s, i) => s.style.color = i < selectedRating ? 'var(--cta)' : '#ccc');
        if (feedback) feedback.textContent = feedbackTexts[selectedRating];
      });
    });

    frame.querySelectorAll('#rate-apprentice-tags .chip').forEach(tag => {
      tag.addEventListener('click', () => tag.classList.toggle('on'));
    });
    const addBtn32 = frame.querySelector('#tag-add-btn-32');
    if (addBtn32) {
      addBtn32.addEventListener('click', () => {
        const label = prompt('Escribe una etiqueta:');
        if (!label || !label.trim()) return;
        const chip = document.createElement('span');
        chip.className = 'chip on'; chip.dataset.tag = label.trim(); chip.style.cursor = 'pointer'; chip.textContent = label.trim();
        chip.addEventListener('click', () => chip.classList.toggle('on'));
        addBtn32.parentElement.insertBefore(chip, addBtn32);
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        if (selectedRating === 0) { alert('Por favor selecciona una calificación.'); return; }
        const comment = frame.querySelector('#rate-apprentice-comment')?.value.trim() || '';
        const selectedTags = [...frame.querySelectorAll('#rate-apprentice-tags .chip.on')].map(c => c.dataset.tag).filter(Boolean);
        const reviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
        reviews.unshift({ id: Date.now(), from: 'Rogger Escalante', rating: selectedRating, comment, tags: selectedTags, date: new Date().toLocaleDateString('es-PE', {day:'numeric', month:'short'}) });
        localStorage.setItem('myReviews', JSON.stringify(reviews));
        navigateTo('us33');
      });
    }
  }

  else if (screenId === 'us33') {
    // Mis Calificaciones — promedio, logros, reseñas, → us34
    const sampleReviews = [
      { id: 1, from: 'Andrea Paredes', rating: 5, comment: 'Excelente estudiante, muy atento y puntual.', tags: ['Puntual', 'Atento'], date: '7 nov' },
      { id: 2, from: 'Luis Mendoza', rating: 4, comment: 'Muy buen alumno, se nota que estudia.', tags: ['Preparado'], date: '5 nov' },
    ];
    const reviews = JSON.parse(localStorage.getItem('myReviews') || '[]');
    const displayReviews = reviews.length > 0 ? reviews : sampleReviews;

    const avg = displayReviews.reduce((s, r) => s + r.rating, 0) / displayReviews.length;
    const rounded = Math.round(avg);

    const ratingValueEl = frame.querySelector('#my-rating-value');
    const ratingStarsEl = frame.querySelector('#my-rating-stars');
    const ratingCountEl = frame.querySelector('#my-rating-count');
    if (ratingValueEl) ratingValueEl.textContent = avg.toFixed(1);
    if (ratingStarsEl) ratingStarsEl.textContent = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    if (ratingCountEl) ratingCountEl.textContent = `${displayReviews.length} reseña${displayReviews.length !== 1 ? 's' : ''}`;

    // Achievements section
    const achContainer = frame.querySelector('#achievements-container');
    if (achContainer) {
      const achievements = [
        { icon: '🏆', name: 'Primer intercambio', desc: 'Completaste tu primera sesión' },
        { icon: '⭐', name: 'Calificación perfecta', desc: 'Recibiste 5 estrellas' },
        { icon: '🔥', name: '10 intercambios', desc: 'Has completado 10 sesiones' },
      ].filter((_, i) => i < displayReviews.length + 1);

      achievements.forEach(a => {
        const div = document.createElement('div');
        div.style.cssText = 'display:flex; align-items:center; gap:10px; padding:10px; border:1.5px solid var(--primary); border-radius:10px; background:#fff;';
        div.innerHTML = `<span style="font-size:22px;">${a.icon}</span><div><div style="font-weight:600; font-size:12px;">${a.name}</div><div class="small" style="font-size:11px;">${a.desc}</div></div>`;
        achContainer.appendChild(div);
      });

      const btnLogros = document.createElement('button');
      btnLogros.type = 'button';
      btnLogros.className = 'btn ghost sm';
      btnLogros.style.marginTop = '8px';
      btnLogros.textContent = 'Ver todos mis logros →';
      btnLogros.onclick = () => navigateTo('us34');
      achContainer.appendChild(btnLogros);
    }

    // Reviews list
    const reviewsList = frame.querySelector('#my-reviews-list');
    if (reviewsList) {
      displayReviews.forEach(r => {
        const div = document.createElement('div');
        div.style.cssText = 'border:1px solid var(--soft); border-radius:10px; padding:10px; background:#fff; cursor:pointer; position:relative;';
        const initials = r.from.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        div.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <div style="width:30px;height:30px;border-radius:50%;background:var(--brand-bg);color:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;flex-shrink:0;">${initials}</div>
            <div style="flex:1;">
              <div style="font-weight:600; font-size:12px;">${r.from}</div>
              <div style="color:var(--cta); font-size:12px;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            </div>
            <div class="small" style="font-size:10px;">${r.date || ''}</div>
          </div>
          ${r.comment ? `<div class="small" style="font-size:12px;line-height:1.4;">"${r.comment}"</div>` : ''}
          ${r.tags?.length ? `<div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;">${r.tags.map(t => `<span style="padding:2px 8px;border:1px solid var(--primary);color:var(--primary);border-radius:999px;font-size:10px;">${t}</span>`).join('')}</div>` : ''}
          <div style="margin-top:8px;font-size:10px;color:var(--muted);text-align:right;">⚑ Reportar reseña</div>
        `;
        div.addEventListener('click', () => {
          localStorage.setItem('reportingReview', JSON.stringify(r));
          navigateTo('us35');
        });
        reviewsList.appendChild(div);
      });
    }
  }

  else if (screenId === 'us35') {
    const review = JSON.parse(localStorage.getItem('reportingReview') || 'null');
    const avEl = frame.querySelector('#us35-av');
    const fromEl = frame.querySelector('#us35-from');
    const starsEl = frame.querySelector('#us35-stars');
    const commentEl = frame.querySelector('#us35-comment');
    if (review) {
      if (avEl) avEl.textContent = review.from.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
      if (fromEl) fromEl.textContent = review.from;
      if (starsEl) starsEl.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      if (commentEl) commentEl.textContent = review.comment ? `"${review.comment}"` : '';
    }

    let selectedMotivo = null;
    const opts = frame.querySelectorAll('.report-opt');
    const otroWrap = frame.querySelector('#us35-otro-wrap');
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        opts.forEach(o => o.classList.remove('sel'));
        opt.classList.add('sel');
        selectedMotivo = opt.dataset.val;
        if (otroWrap) otroWrap.style.display = selectedMotivo === 'otro' ? 'block' : 'none';
      });
    });

    const btnEnviar = frame.querySelector('#btn-us35-enviar');
    if (btnEnviar) {
      btnEnviar.addEventListener('click', () => {
        if (!selectedMotivo) { alert('Por favor selecciona un motivo.'); return; }
        localStorage.removeItem('reportingReview');
        btnEnviar.textContent = '✓ Reporte enviado';
        btnEnviar.style.background = '#3aa56b';
        btnEnviar.disabled = true;
        setTimeout(() => navigateTo('us33'), 1500);
      });
    }
  }

  else if (screenId === 'us34') {
    // Logros destacados — grid de insignias
    const allAchievements = [
      { icon: '🏆', name: 'Primer intercambio', desc: 'Completaste tu primera sesión', earned: true },
      { icon: '⭐', name: 'Calificación perfecta', desc: 'Recibiste 5 estrellas', earned: true },
      { icon: '🔥', name: '10 intercambios', desc: 'Has completado 10 sesiones', earned: false },
      { icon: '💬', name: 'Super comunicador', desc: 'Enviaste 50 mensajes', earned: false },
      { icon: '📚', name: 'Tutor estrella', desc: 'Enseñaste 5 materias distintas', earned: false },
      { icon: '🎓', name: 'Aprendiz dedicado', desc: 'Tomaste 20 sesiones como estudiante', earned: false },
    ];

    const grid = frame.querySelector('#logros-grid');
    if (grid) {
      allAchievements.forEach(a => {
        const div = document.createElement('div');
        div.style.cssText = `border:1.5px solid ${a.earned ? 'var(--primary)' : '#d9d7d2'}; border-radius:14px; padding:14px; text-align:center; background:${a.earned ? 'var(--brand-bg)' : '#fafaf8'}; opacity:${a.earned ? '1' : '0.55'};`;
        div.innerHTML = `
          <div style="font-size:28px; margin-bottom:6px;">${a.icon}</div>
          <div style="font-weight:700; font-size:11px; color:${a.earned ? 'var(--primary)' : 'var(--muted)'};">"${a.name}"</div>
          <div class="small" style="font-size:10px; margin-top:4px;">${a.desc}</div>
          ${a.earned ? `<div style="margin-top:6px; font-size:10px; color:var(--good); font-weight:700;">✓ Obtenido</div>` : `<div style="margin-top:6px; font-size:10px; color:var(--muted);">🔒 Pendiente</div>`}
        `;
        grid.appendChild(div);
      });
    }
  }
}
