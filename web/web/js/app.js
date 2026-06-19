const screensData = window.screensData;
const meta = window.meta;

const screensById = Object.fromEntries(screensData.map(s => [s.id, s]));

// Add custom screen if not present
if (!screensById['us36-custom']) {
  screensById['us36-custom'] = {
    id: 'us36-custom',
    us: 'US36c',
    title: 'Nueva sesión',
    frameAttrs: '',
    html: ''
  };
}

const navigation = meta.navigation;

const MAIN_NAV = {
  Inicio: 'us15',
  Buscar: 'us11',
  Chats: 'us24',
  Perfil: 'us07',
};

const EXCLUDE_BOTTOM_NAV = new Set(['us45', 'us01', 'us01b', 'us02', 'us03']);
const EXCLUDE_BACK = new Set(['us45']);

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
  const nav = document.createElement('div');
  nav.className = 'nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Navegación principal');
  nav.innerHTML = `
    <div class="it" data-label="Inicio"><span class="gl">🏠</span>Inicio</div>
    <div class="it" data-label="Buscar"><span class="gl">🔍</span>Buscar</div>
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
  Object.entries(MAIN_NAV).forEach(([label, id]) => {
    const icons = { Inicio: '🏠', Buscar: '🔍', Chats: '💬', Perfil: '👤' };
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

  const modifiedScreenIds = ['us45', 'us01', 'us02', 'us05', 'us06', 'us09', 'us15', 'us26', 'us30'];

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
    
    const modifiedCount = epicScreens.filter(s => modifiedScreenIds.includes(s.id) || !!CUSTOM_SCREENS_HTML[s.id]).length;
    const totalCount = epicScreens.length;
    
    heading.innerHTML = `📁 ${epic.id} · ${epic.name} <span style="float: right; font-size: 10px; opacity: 0.7;">(${modifiedCount}/${totalCount})</span>`;
    heading.addEventListener('click', () => group.classList.toggle('collapsed'));

    const list = document.createElement('div');
    list.className = 'hu-list';

    epicScreens.forEach(screen => {
      const isMod = modifiedScreenIds.includes(screen.id) || !!CUSTOM_SCREENS_HTML[screen.id];
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
    const modifiedScreensCount = Object.keys(screensById).filter(id => modifiedScreenIds.includes(id) || !!CUSTOM_SCREENS_HTML[id]).length;
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

  // Only overwrite innerHTML if it's empty to preserve static custom overrides
  if (!frame.innerHTML.trim()) {
    frame.innerHTML = screen.html;
  }
  updateClock();
  ensureBackButton(frame, screenId);
  enhanceFormFields(frame, screenId);
  injectBottomNav(frame, screenId);
  bindInteractions(frame, screenId);
  updateBottomNav(frame, screenId);
  updateSidebarActive(screenId);

  // Global settings gear listener
  const btnSettings = document.getElementById('btnSettings');
  if (btnSettings) {
    btnSettings.onclick = () => navigateTo('us04');
  }

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

  container.querySelectorAll('.btn, .btn.ghost, .btn.sm').forEach(btn => {
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

window.addEventListener('hashchange', () => {
  const id = getScreenIdFromPath();
  if (id !== currentScreen) {
    currentScreen = id;
    renderScreen(id);
  }
});

window.addEventListener('popstate', () => {
  const id = getScreenIdFromPath();
  if (id !== currentScreen) {
    currentScreen = id;
    renderScreen(id);
  }
});

buildHuSidebar();
currentScreen = getScreenIdFromPath();

// Inject setupCustomFlows call into renderScreen
const origRenderScreen = renderScreen;
renderScreen = function(screenId) {
  origRenderScreen(screenId);
  const frame = document.getElementById('appFrame');
  if (frame) {
    // Run overrides
    setupCustomFlows(frame, screenId);
  }
};

renderScreen(currentScreen);

let welcomeInterval = null;

function setupCustomFlows(frame, screenId) {
  if (welcomeInterval) {
    clearInterval(welcomeInterval);
    welcomeInterval = null;
  }

  const user = JSON.parse(localStorage.getItem('currentUser')) || null;

  if (screenId === 'us45') {
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
  
  else if (screenId === 'us01') {
    const radioEst = frame.querySelector('input[value="estudiante"]');
    const radioTut = frame.querySelector('input[value="tutor"]');
    const lblEst = frame.querySelector('#lbl-role-estudiante');
    const lblTut = frame.querySelector('#lbl-role-tutor');
    
    const updateRoleFields = () => {
      if (radioEst && radioEst.checked) {
        if (lblEst) lblEst.style.borderColor = 'var(--primary)';
        if (lblTut) lblTut.style.borderColor = '#c9c7c2';
      } else if (radioTut && radioTut.checked) {
        if (lblEst) lblEst.style.borderColor = '#c9c7c2';
        if (lblTut) lblTut.style.borderColor = 'var(--primary)';
      }
    };
    
    if (radioEst) radioEst.addEventListener('change', updateRoleFields);
    if (radioTut) radioTut.addEventListener('change', updateRoleFields);
    
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
        
        const studentProfile = null;
        const tutorProfile = null;
        
        const newUser = {
          name,
          email,
          password,
          role,
          studentProfile,
          tutorProfile
        };
        
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.email !== email);
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        history.length = 0;
        
        // Redirección condicional según rol
        if (role === 'estudiante') {
          navigateTo('us05');
        } else {
          navigateTo('us06');
        }
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
          navigateTo('us15');
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
  
  else if (screenId === 'us05') {
    // Configuración perfil aprendiz
    if (!user) return;
    const fieldSelect = frame.querySelector('#setup-field');
    const careerSelect = frame.querySelector('#setup-career');
    const chipsContainer = frame.querySelector('#setup-learn-chips');
    const btnSave = frame.querySelector('#btn-setup-student-submit');
    
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
    
    if (chipsContainer) {
      chipsContainer.innerHTML = '';
      SUBJECTS.forEach(subject => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = subject;
        chip.style.cursor = 'pointer';
        chip.onclick = () => chip.classList.toggle('on');
        chipsContainer.appendChild(chip);
      });
    }
    
    if (btnSave) {
      btnSave.onclick = (e) => {
        e.preventDefault();
        const univ = frame.querySelector('#setup-univ').value;
        const field = fieldSelect ? fieldSelect.value : 'Ingeniería, Industria y Construcción';
        const career = careerSelect ? careerSelect.value : 'Ingeniería Civil';
        const cycle = frame.querySelector('#setup-cycle').value;
        
        const selectedSubjects = [];
        if (chipsContainer) {
          chipsContainer.querySelectorAll('.chip.on').forEach(c => {
            selectedSubjects.push(c.textContent.trim());
          });
        }
        
        user.studentProfile = { univ, field, career, cycle, subjects: selectedSubjects };
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
    // Configuración perfil tutor
    if (!user) return;
    const chipM = frame.querySelector('#setup-tutor-disp-m');
    const chipT = frame.querySelector('#setup-tutor-disp-t');
    const chipN = frame.querySelector('#setup-tutor-disp-n');
    const hoursChipsContainer = frame.querySelector('#setup-tutor-hours-chips');
    const btnSave = frame.querySelector('#btn-setup-tutor-submit');
    
    const hoursMap = {
      m: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
      t: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
      n: ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"]
    };
    
    let selectedHours = new Set();
    
    const renderHours = (period) => {
      if (!hoursChipsContainer) return;
      hoursChipsContainer.innerHTML = '';
      const hours = hoursMap[period] || [];
      hours.forEach(h => {
        const span = document.createElement('span');
        span.className = 'chip' + (selectedHours.has(h) ? ' on' : '');
        span.textContent = h;
        span.style.cursor = 'pointer';
        span.style.margin = '2px';
        span.addEventListener('click', () => {
          span.classList.toggle('on');
          if (span.classList.contains('on')) {
            selectedHours.add(h);
          } else {
            selectedHours.delete(h);
          }
        });
        hoursChipsContainer.appendChild(span);
      });
    };
    
    if (chipM) chipM.addEventListener('click', () => {
      chipM.classList.add('on');
      if (chipT) chipT.classList.remove('on');
      if (chipN) chipN.classList.remove('on');
      renderHours('m');
    });
    if (chipT) chipT.addEventListener('click', () => {
      chipT.classList.add('on');
      if (chipM) chipM.classList.remove('on');
      if (chipN) chipN.classList.remove('on');
      renderHours('t');
    });
    if (chipN) chipN.addEventListener('click', () => {
      chipN.classList.add('on');
      if (chipM) chipM.classList.remove('on');
      if (chipT) chipT.classList.remove('on');
      renderHours('n');
    });
    
    // Initial load
    renderHours('m');
    
    if (btnSave) {
      btnSave.onclick = (e) => {
        e.preventDefault();
        const subject = frame.querySelector('#tutor-setup-subject').value.trim() || 'Cálculo Diferencial';
        const bio = frame.querySelector('#tutor-setup-bio').value.trim() || 'Biografía de tutor';
        const exp = frame.querySelector('#tutor-setup-exp').value.trim() || '1 año';
        const level = frame.querySelector('#tutor-setup-level').value;
        
        user.tutorProfile = {
          subject,
          bio,
          exp,
          level,
          hours: Array.from(selectedHours)
        };
        user.role = 'tutor';
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.map(u => u.email === user.email ? user : u);
        localStorage.setItem('users', JSON.stringify(users));
        
        navigateTo('us15');
      };
    }
  }
  
  else if (screenId === 'us15') {
    const activeUser = user || { name: 'Juan Pérez', role: 'estudiante' };
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
    const optCalificaciones = frame.querySelector('#opt-mis-calificaciones');
    const optBilletera = frame.querySelector('#opt-mi-billetera');
    
    if (optRoles) optRoles.addEventListener('click', () => navigateTo('us09'));
    if (optSesiones) optSesiones.addEventListener('click', () => navigateTo('us30'));
    if (optBuscar) optBuscar.addEventListener('click', () => navigateTo('us11'));
    if (optCalificaciones) optCalificaciones.addEventListener('click', () => navigateTo('us33'));
    if (optBilletera) optBilletera.addEventListener('click', () => navigateTo('us39'));
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
    
    const switchRole = (newRole) => {
      if (newRole === 'estudiante' && !user.studentProfile) {
        alert("Vamos a configurar tu perfil de estudiante.");
        navigateTo('us05');
        return;
      }
      
      if (newRole === 'tutor' && !user.tutorProfile) {
        alert("Vamos a configurar tu perfil de tutor.");
        navigateTo('us06');
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
  
  else if (screenId === 'us30') {
    const btnReminders = frame.querySelector('#btn-reminders');
    if (btnReminders) {
      btnReminders.onclick = () => navigateTo('us28');
    }
    
    let completed = JSON.parse(localStorage.getItem('completedSessions')) || [
      { id: 1, tutor: "Andrea Paredes", subject: "Cálculo Inicial", date: "28 oct", duration: "1h", rating: 5 },
      { id: 2, tutor: "Luis Mendoza", subject: "Física I", date: "15 oct", duration: "1.5h", rating: 4 },
      { id: 3, tutor: "Karen Ríos", subject: "Química General", date: "08 oct", duration: "1h", rating: 5 },
      { id: 4, tutor: "Carlos Montes", subject: "Cálculo Integral", date: "22 sep", duration: "2h", rating: 3 }
    ];
    
    let upcoming = JSON.parse(localStorage.getItem('upcomingSessions')) || [
      { id: 101, tutor: "Andrea Paredes", subject: "Cálculo Diferencial", date: "Jueves 7 Nov", time: "19:00", duration: "60 min", reminder: false }
    ];
    
    let activeTab = 'proximas';
    
    const sContainer = frame.querySelector('#sesiones-container');
    const tabProx = frame.querySelector('#tab-sesiones-proximas');
    const tabComp = frame.querySelector('#tab-sesiones-completadas');
    
    const renderList = () => {
      if (!sContainer) return;
      sContainer.innerHTML = '';
      
      if (activeTab === 'completadas') {
        if (tabComp) {
          tabComp.classList.add('on');
        }
        if (tabProx) {
          tabProx.classList.remove('on');
        }
        
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
              <div class="stars" style="font-size:10px; color:var(--cta); cursor:pointer;">` + `★`.repeat(s.rating) + `☆`.repeat(5-s.rating) + ` <b style="color:var(--ink)">calificar</b></div>
            </div>
            <button type="button" class="btn-clear-session" style="border:none; background:#3aa56b; color:#fff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:700;" title="Limpiar del historial">✓</button>
          `;
          
          card.querySelector('.stars').onclick = () => {
            const role = (user && user.role) || 'estudiante';
            if (role === 'tutor') {
              navigateTo('us32');
            } else {
              navigateTo('us31');
            }
          };
          
          card.querySelector('.btn-clear-session').onclick = (e) => {
            e.stopPropagation();
            completed = completed.filter(x => x.id !== s.id);
            localStorage.setItem('completedSessions', JSON.stringify(completed));
            renderList();
          };
          
          sContainer.appendChild(card);
        });
      } else {
        if (tabProx) {
          tabProx.classList.add('on');
        }
        if (tabComp) {
          tabComp.classList.remove('on');
        }
        
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
            if (confirm(`¿Estás seguro de que deseas cancelar la sesión con ${s.tutor}?`)) {
              upcoming = upcoming.filter(x => x.id !== s.id);
              localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
              renderList();
            }
          };
          
          card.querySelector('.btn-complete-session').onclick = (e) => {
            e.stopPropagation();
            upcoming = upcoming.filter(x => x.id !== s.id);
            localStorage.setItem('upcomingSessions', JSON.stringify(upcoming));
            
            completed.unshift({
              id: Date.now(),
              tutor: s.tutor,
              subject: s.subject,
              date: s.date,
              duration: s.duration,
              rating: 5
            });
            localStorage.setItem('completedSessions', JSON.stringify(completed));
            renderList();
            
            const role = (user && user.role) || 'estudiante';
            if (role === 'tutor') {
              navigateTo('us32');
            } else {
              navigateTo('us31');
            }
          };
          
          sContainer.appendChild(card);
        });
      }
    };
    
    if (tabProx) tabProx.onclick = () => { activeTab = 'proximas'; renderList(); };
    if (tabComp) tabComp.onclick = () => { activeTab = 'completadas'; renderList(); };
    
    renderList();
    
    const btnNew = frame.querySelector('#btn-nueva-sesion');
    if (btnNew) {
      btnNew.onclick = () => navigateTo('us36-custom');
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
    frame.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        const nameEl = card.querySelector('.name') || card.querySelector('div[style*="font-weight:600"]');
        const subjectEl = card.querySelector('.meta') || card.querySelector('.small');
        if (nameEl) {
          const name = nameEl.textContent.trim();
          const subject = subjectEl ? subjectEl.textContent.split('·')[0].trim() : 'Cálculo';
          localStorage.setItem('selectedTutorForScheduling', JSON.stringify({ name, subject }));
        }
      });
    });
  }
  
  else if (screenId === 'us10') {
    const btnSol = frame.querySelector('.btn');
    if (btnSol) {
      btnSol.textContent = 'Programar sesión';
      btnSol.onclick = (e) => {
        e.preventDefault();
        navigateTo('us26');
      };
    }
  }
  
  else if (screenId === 'us04') {
    const viewSelect = frame.querySelector('#config-view-mode');
    if (viewSelect) {
      const currentView = localStorage.getItem('appView') || 'pc';
      viewSelect.value = currentView;
      viewSelect.addEventListener('change', () => {
        const newView = viewSelect.value;
        localStorage.setItem('appView', newView);
        document.body.classList.remove('view-pc', 'view-movil');
        document.body.classList.add('view-' + newView);
      });
    }

    const btnLogout = frame.querySelector('#btn-logout-submit') || frame.querySelector('.btn:not(.ghost)');
    if (btnLogout) {
      btnLogout.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        history.length = 0;
        navigateTo('us45');
      };
    }
  }

  else if (screenId === 'us31') {
    let ratingValue = 0;
    const stars = frame.querySelectorAll('#rate-stars-container .star');
    const feedbackText = frame.querySelector('#rate-stars-feedback');
    const ratingTexts = ["1 - Muy malo", "2 - Malo", "3 - Regular", "4 - Bueno", "5 - ¡Excelente!"];
    
    stars.forEach((star, idx) => {
      star.style.cursor = 'pointer';
      star.onclick = () => {
        ratingValue = idx + 1;
        stars.forEach((s, i) => {
          s.classList.toggle('on', i <= idx);
          s.style.color = i <= idx ? 'var(--cta)' : '#ccc';
        });
        if (feedbackText) feedbackText.textContent = ratingTexts[idx];
      };
    });
    
    const tags = frame.querySelectorAll('#rate-tags-container .chip');
    tags.forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.onclick = () => {
        tag.classList.toggle('on');
      };
    });
    
    const btnSubmit = frame.querySelector('#btn-submit-rating');
    if (btnSubmit) {
      btnSubmit.onclick = () => {
        if (ratingValue === 0) {
          alert("Por favor, selecciona una calificación en estrellas.");
          return;
        }
        alert("¡Gracias por tu calificación!");
        const nextScreen = (user && user.role === 'tutor') ? 'us33' : 'us30';
        navigateTo(nextScreen);
      };
    }
  }

  else if (screenId === 'us32') {
    let apprenticeRatingValue = 0;
    const apprenticeStars = frame.querySelectorAll('#rate-apprentice-stars-container .star');
    const apprenticeFeedback = frame.querySelector('#rate-apprentice-feedback');
    const apprenticeRatingTexts = ["1 - Impuntual/Mal preparado", "2 - Regular", "3 - Bueno", "4 - Muy bueno", "5 - ¡Excelente aprendiz!"];
    
    apprenticeStars.forEach((star, idx) => {
      star.style.cursor = 'pointer';
      star.onclick = () => {
        apprenticeRatingValue = idx + 1;
        apprenticeStars.forEach((s, i) => {
          s.classList.toggle('on', i <= idx);
          s.style.color = i <= idx ? 'var(--cta)' : '#ccc';
        });
        if (apprenticeFeedback) apprenticeFeedback.textContent = apprenticeRatingTexts[idx];
      };
    });
    
    const apprenticeTags = frame.querySelectorAll('#rate-apprentice-tags .chip');
    apprenticeTags.forEach(tag => {
      tag.style.cursor = 'pointer';
      tag.onclick = () => {
        tag.classList.toggle('on');
      };
    });
    
    const btnSubmitApprentice = frame.querySelector('#btn-submit-apprentice-rating');
    if (btnSubmitApprentice) {
      btnSubmitApprentice.onclick = () => {
        if (apprenticeRatingValue === 0) {
          alert("Por favor, selecciona una calificación en estrellas.");
          return;
        }
        alert("¡Gracias por calificar al aprendiz!");
        const nextScreen = (user && user.role === 'tutor') ? 'us33' : 'us30';
        navigateTo(nextScreen);
      };
    }
  }

  else if (screenId === 'us33') {
    const ratingVal = frame.querySelector('#my-rating-value');
    const ratingStars = frame.querySelector('#my-rating-stars');
    const ratingCount = frame.querySelector('#my-rating-count');
    const achievementsContainer = frame.querySelector('#achievements-container');
    const reviewsList = frame.querySelector('#my-reviews-list');
    
    if (ratingVal) ratingVal.textContent = "4.9";
    if (ratingStars) ratingStars.textContent = "★★★★★";
    if (ratingCount) ratingCount.textContent = "28 reseñas";
    
    if (achievementsContainer) {
      achievementsContainer.innerHTML = `
        <div class="card" id="achievement-tutor-destacado" style="border:1.5px solid var(--primary); border-radius:12px; padding:10px; cursor:pointer; background:var(--brand-bg); display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">🏆</span>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:12px; color:var(--primary);">¡Tutor Destacado!</div>
            <div class="small" style="font-size:10px;">Promedio 4.5+ con +10 tutorías completadas.</div>
          </div>
          <span style="font-size:14px; font-weight:700; color:var(--primary);">›</span>
        </div>
      `;
      const badgeCard = achievementsContainer.querySelector('#achievement-tutor-destacado');
      if (badgeCard) {
        badgeCard.onclick = () => navigateTo('us34');
      }
    }
    
    if (reviewsList) {
      const reviews = [
        { name: "Juan P.", rating: 5, comment: "Excelente tutora, me ayudó a entender todo sobre integrales en 1 hora.", date: "Hace 2 días" },
        { name: "Rogger E.", rating: 5, comment: "Explicación clara y paciente. ¡Recomendada!", date: "Hace 1 semana" },
        { name: "Diana S.", rating: 4, comment: "Muy amable y puntual.", date: "Hace 2 semanas" }
      ];
      reviewsList.innerHTML = reviews.map(r => `
        <div style="border:1px solid var(--soft); border-radius:10px; padding:10px; background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.01);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b style="font-size:12px;">${r.name}</b>
            <span class="small" style="font-size:10px; color:var(--muted);">${r.date}</span>
          </div>
          <div style="font-size:11px; color:var(--cta); margin:2px 0;">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
          <p class="small" style="margin:2px 0 0; line-height:1.4;">${r.comment}</p>
        </div>
      `).join('');
    }
  }
}
