const fs = require('fs');
const path = require('path');

const screensPath = path.join(__dirname, '..', 'js', 'screens-data.json');
const outDir = path.join(__dirname, '..');

// Define the custom HTML overrides that will be written into the static files
const CUSTOM_SCREENS_HTML = {
  us45: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%; justify-content:space-between;">
      <div style="flex:1; display:flex; flex-direction:column; justify-content:center; text-align:center; padding:0 6px;">
        <div style="margin-bottom:12px;"><img src="images/logo.jpg" alt="Swaply Logo" style="height:70px; border-radius:12px; margin: 0 auto;"></div>
        <div style="font-family:'Caveat',cursive; font-size:42px; font-weight:700; line-height:1; margin-top:6px; color:var(--primary);">Swaply</div>
        <div style="font-size:13px; font-weight:700; margin-top:12px; min-height:36px; color:var(--ink);" id="welcome-carousel-title">Intercambia conocimiento entre universidades</div>
        <div class="small" style="margin:6px 14px 0; line-height:1.5; min-height:54px;" id="welcome-carousel-desc">Conecta con estudiantes de otras casas de estudio. Aprende lo que necesitas, enseña lo que dominas.</div>
        <div class="dots" style="margin-top:18px;"><i class="on"></i><i></i><i></i></div>
      </div>
      <div style="padding-bottom:12px;">
        <div class="btn" style="width:100%; text-align:center;" id="welcome-btn-register">Crear cuenta</div>
        <div class="btn ghost mt" style="width:100%; text-align:center;" id="welcome-btn-login">Iniciar sesión</div>
      </div>
    </div>
  `,
  us01: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Crear cuenta</h2></div>
      <div class="small" style="margin-bottom:12px;">Completa tus datos para empezar</div>
      
      <div class="col" style="gap:8px; overflow-y:auto; flex:1; padding-bottom:12px;">
        <div class="form-field"><label>Nombre y Apellidos</label><div class="input-wrap"><input type="text" id="reg-name" placeholder="Ej. Juan Pérez" required></div></div>
        <div class="form-field"><label>Correo Institucional</label><div class="input-wrap"><input type="email" id="reg-email" placeholder="usuario@universidad.edu.pe" required></div></div>
        <div class="form-field"><label>Contraseña</label><div class="input-wrap"><input type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required></div></div>
        
        <div class="form-field">
          <label>¿Qué perfil prefieres?</label>
          <div style="display:flex; gap:10px; margin-top:4px;">
            <label style="flex:1; border:1.5px solid var(--primary); border-radius:8px; padding:8px; text-align:center; cursor:pointer;" id="lbl-role-estudiante">
              <input type="radio" name="reg-role" value="estudiante" checked style="margin-right:6px;">Estudiante
            </label>
            <label style="flex:1; border:1.5px solid #c9c7c2; border-radius:8px; padding:8px; text-align:center; cursor:pointer;" id="lbl-role-tutor">
              <input type="radio" name="reg-role" value="tutor" style="margin-right:6px;">Tutor
            </label>
          </div>
          <div class="small" style="margin-top:4px; font-size:11px; font-style:italic;">* Luego puedes crear el otro perfil desde Ajustes o mis roles.</div>
        </div>
        
        <div id="reg-error" class="toast bad" style="display:none; margin-top:8px;"><span class="ic">⚠</span><div id="reg-error-msg"></div></div>
      </div>
      
      <div style="margin-top:auto; padding-top:8px; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-register-submit" style="width:100%;">Registrar</button>
      </div>
    </div>
  `,
  us02: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div style="text-align:center; margin-top:24px; margin-bottom:8px;">
        <img src="images/logo.jpg" alt="Swaply Logo" style="height: 60px; border-radius: 8px;">
      </div>
      <div class="small center" style="margin-bottom:24px">Inicia sesión para continuar</div>
      
      <div class="col" style="gap:10px;">
        <div class="form-field"><label>Correo</label><div class="input-wrap"><input type="email" id="login-email" placeholder="usuario@universidad.edu.pe" required></div></div>
        <div class="form-field"><label>Contraseña</label><div class="input-wrap"><input type="password" id="login-password" placeholder="Ingresa tu contraseña" required></div></div>
        
        <div class="small" style="text-align:right;">
          <a href="us03.html" style="text-decoration:underline; color:var(--primary); font-weight:600;">¿Olvidaste tu contraseña?</a>
        </div>
        
        <div id="login-error" class="toast bad" style="display:none;"><span class="ic">⚠</span><div id="login-error-msg">Correo o contraseña incorrectos.</div></div>
      </div>
      
      <div style="margin-top:auto; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-login-submit" style="width:100%;">Iniciar sesión</button>
        <div class="btn ghost mt" id="btn-login-to-register" style="width:100%;">Crear cuenta</div>
      </div>
    </div>
  `,
  us04: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Ajustes</h2></div>
      
      <div class="col" style="gap:12px; flex:1; overflow-y:auto; padding-bottom:12px;">
        <div class="section-label" style="font-weight:700;">Preferencias de Visualización</div>
        
        <div class="row-line" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="l">🖥️ Modo de Vista</div>
          <div class="r">
            <select id="config-view-mode" class="field-select" style="padding:4px 8px; border-radius:6px; font-size:12px;">
              <option value="pc">Vista Computadora (PC)</option>
              <option value="movil">Vista Celular (Móvil)</option>
            </select>
          </div>
        </div>
        
        <div class="row-line" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="l">🌓 Modo Oscuro</div>
          <div class="r">
            <button type="button" id="btn-toggle-dark-mode" style="border:1.5px solid var(--primary); background:transparent; color:var(--primary); font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; font-weight:600;">Desactivado</button>
          </div>
        </div>
        
        <div class="section-label" style="font-weight:700;">Aplicación</div>
        
        <div class="row-line" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="l">🌐 Idioma</div>
          <div class="r">
            <select id="config-lang" class="field-select" style="padding:4px 8px; border-radius:6px; font-size:12px;">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
        
        <div class="row-line" style="display:flex; justify-content:space-between; align-items:center;">
          <div class="l">🔒 Modo Privacidad</div>
          <div class="r">
            <button type="button" id="btn-toggle-privacy-mode" style="border:1.5px solid var(--primary); background:transparent; color:var(--primary); font-size:11px; padding:4px 10px; border-radius:6px; cursor:pointer; font-weight:600;">Inactivo</button>
          </div>
        </div>
        
        <div class="section-label" style="font-weight:700;">Seguridad y Cuenta</div>
        
        <div class="row-line" id="opt-change-password" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
          <div class="l">🔑 Actualizar Contraseña</div>
          <div class="r">›</div>
        </div>
        
        <div class="row-line" id="opt-delete-account" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; color:#d64545;">
          <div class="l" style="font-weight:600;">🗑️ Eliminar Cuenta</div>
          <div class="r">›</div>
        </div>
      </div>
      
      <div style="margin-top:auto; padding-top:8px; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-logout-submit" style="width:100%; background:#d64545;">Cerrar sesión</button>
      </div>
    </div>
  `,
  us05: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Tu perfil · aprendiz</h2></div>
      <div class="dots" style="margin-bottom:12px;"><i class="on"></i><i></i><i></i></div>
      
      <div class="col" style="gap:8px; overflow-y:auto; flex:1; padding-bottom:12px;">
        <div class="form-field"><label>Universidad</label><div class="input-wrap">
          <select id="setup-univ" class="field-select">
            <option value="UNMSM">UNMSM (Universidad Nacional Mayor de San Marcos)</option>
            <option value="UNI">UNI (Universidad Nacional de Ingeniería)</option>
            <option value="PUCP">PUCP (Pontificia Universidad Católica del Perú)</option>
            <option value="UPC">UPC (Universidad Peruana de Ciencias Aplicadas)</option>
          </select>
        </div></div>
        <div class="form-field"><label>Área de Estudio</label><div class="input-wrap">
          <select id="setup-field" class="field-select">
            <option value="Educación">Educación</option>
            <option value="Humanidades y Arte">Humanidades y Arte</option>
            <option value="Ciencias Sociales, Comerciales y Derecho">Ciencias Sociales, Comerciales y Derecho</option>
            <option value="Ingeniería, Industria y Construcción">Ingeniería, Industria y Construcción</option>
            <option value="Ciencias de la Salud">Ciencias de la Salud</option>
          </select>
        </div></div>
        <div class="form-field"><label>Carrera</label><div class="input-wrap">
          <select id="setup-career" class="field-select">
            <!-- Populated dynamically -->
          </select>
        </div></div>
        <div class="form-field"><label>Ciclo</label><div class="input-wrap">
          <select id="setup-cycle" class="field-select">
            <option value="1° ciclo">1° ciclo</option>
            <option value="2° ciclo">2° ciclo</option>
            <option value="3° ciclo">3° ciclo</option>
            <option value="4° ciclo" selected>4° ciclo</option>
            <option value="5° ciclo">5° ciclo</option>
            <option value="6° ciclo">6° ciclo</option>
            <option value="7° ciclo">7° ciclo</option>
            <option value="8° ciclo">8° ciclo</option>
            <option value="9° ciclo">9° ciclo</option>
            <option value="10° ciclo">10° ciclo</option>
          </select>
        </div></div>
        
        <div class="section-label" style="font-weight:700; margin-top:8px;">Quiero aprender</div>
        <div class="chips" id="setup-learn-chips" style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">
          <!-- Populated dynamically -->
        </div>
      </div>
      
      <div style="margin-top:auto; padding-top:8px; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-setup-student-submit" style="width:100%;">Guardar y continuar</button>
      </div>
    </div>
  `,
  us06: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Tu perfil · tutor</h2></div>
      
      <div class="col" style="gap:8px; overflow-y:auto; flex:1; padding-bottom:12px;">
        <div class="form-field"><label>¿Qué materia/tema enseñas?</label><div class="input-wrap"><input type="text" id="tutor-setup-subject" placeholder="Ej. Cálculo Diferencial, Física I"></div></div>
        <div class="form-field"><label>Pequeña Biografía</label><div class="input-wrap"><textarea id="tutor-setup-bio" rows="2" placeholder="Cuéntanos un poco sobre ti y tu experiencia..."></textarea></div></div>
        <div class="form-field"><label>Experiencia</label><div class="input-wrap"><input type="text" id="tutor-setup-exp" placeholder="Ej. 2 años, Jefe de práctica"></div></div>
        <div class="form-field"><label>Nivel de Dominio</label><div class="input-wrap">
          <select id="tutor-setup-level" class="field-select">
            <option value="Básico">Básico</option>
            <option value="Intermedio" selected>Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div></div>
        <div class="form-field">
          <label>Disponibilidad</label>
          <div class="chips" style="margin-top:4px; display:flex; gap:6px;">
            <span class="chip on" id="setup-tutor-disp-m" style="cursor:pointer;">Mañana</span>
            <span class="chip" id="setup-tutor-disp-t" style="cursor:pointer;">Tarde</span>
            <span class="chip" id="setup-tutor-disp-n" style="cursor:pointer;">Noche</span>
          </div>
        </div>
        <div class="form-field" id="setup-tutor-hours-container">
          <label>Horarios Disponibles</label>
          <div id="setup-tutor-hours-chips" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
            <!-- Populated dynamically based on selected availability -->
          </div>
        </div>
      </div>
      
      <div style="margin-top:auto; padding-top:8px; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-setup-tutor-submit" style="width:100%;">Guardar perfil</button>
      </div>
    </div>
  `,
  us15: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%; padding: 12px 16px;">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div id="home-user-role" style="font-weight:700; font-size:11px; color:var(--primary); text-transform:capitalize; border:1.5px solid var(--primary); border-radius:12px; padding:3px 8px; background:var(--brand-bg);">Estudiante</div>
        <div><img src="images/logo.jpg" alt="Swaply" style="height:44px; border-radius:6px; object-fit: contain;"></div>
        <div id="home-user-name" style="font-weight:700; font-size:12px; color:var(--ink);">Juan P. 👋</div>
      </div>
      
      <!-- Content/Options -->
      <div class="col" style="flex:1; justify-content:center; gap:12px;">
        <!-- Mis Roles -->
        <div class="card" id="opt-mis-roles" style="border:1.5px solid var(--primary); border-radius:14px; padding:12px; cursor:pointer; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:flex; align-items:center; gap:12px; transition:all 0.2s;">
          <span style="font-size:24px;">🔄</span>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:13px; color:var(--primary);">Mis Roles</div>
            <div class="small" style="font-size:10px; margin-top:2px;">Cambia tu rol activo.</div>
          </div>
        </div>
        
        <!-- Mis Sesiones -->
        <div class="card" id="opt-mis-sesiones" style="border:1.5px solid var(--primary); border-radius:14px; padding:12px; cursor:pointer; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:flex; align-items:center; gap:12px; transition:all 0.2s;">
          <span style="font-size:24px;">📅</span>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:13px; color:var(--primary);">Mis Sesiones</div>
            <div class="small" style="font-size:10px; margin-top:2px;">Gestiona tus clases próximas y pasadas.</div>
          </div>
        </div>
        
        <!-- Mis Calificaciones (New 4th option!) -->
        <div class="card" id="opt-mis-calificaciones" style="border:1.5px solid var(--primary); border-radius:14px; padding:12px; cursor:pointer; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:flex; align-items:center; gap:12px; transition:all 0.2s;">
          <span style="font-size:24px;">🏅</span>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:13px; color:var(--primary);">Mis Calificaciones</div>
            <div class="small" style="font-size:10px; margin-top:2px;">Mira lo que te pusieron e insignias de logros.</div>
          </div>
        </div>
        
        <!-- Mi Billetera -->
        <div class="card" id="opt-mi-billetera" style="border:1.5px solid var(--primary); border-radius:14px; padding:12px; cursor:pointer; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:flex; align-items:center; gap:12px; transition:all 0.2s;">
          <span style="font-size:24px;">💳</span>
          <div style="flex:1;">
            <div style="font-weight:700; font-size:13px; color:var(--primary);">Mi Billetera</div>
            <div class="small" style="font-size:10px; margin-top:2px;">Consulta tu saldo e historial de créditos.</div>
          </div>
        </div>
      </div>
    </div>
  `,
  us09: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Mis roles</h2></div>
      <div class="small" style="margin-bottom:16px;">Selecciona tu rol activo. Solo puedes usar uno a la vez.</div>
      
      <div class="col" style="gap:12px; flex:1;">
        <!-- Estudiante Card -->
        <div id="card-role-student" class="role-card-hover" style="border:1.5px solid #c9c7c2; border-radius:12px; padding:12px; cursor:pointer; background:#fff; position:relative; transition:all 0.2s;">
          <div class="flex">
            <div style="font-weight:700; font-size:13px; flex:1;">🎓 Aprendiz / Estudiante</div>
            <div class="pill" id="pill-student" style="background:#ccc; color:#fff; padding:2px 8px; border-radius:8px; font-size:10px;">Inactivo</div>
          </div>
          <div class="small" style="margin-top:4px;">Pide ayuda y agenda tutorías.</div>
          <div id="btn-activate-student" class="btn ghost sm" style="margin-top:8px; display:none; text-align:center;">Activar rol estudiante</div>
        </div>
        
        <!-- Tutor Card -->
        <div id="card-role-tutor" class="role-card-hover" style="border:1.5px solid #c9c7c2; border-radius:12px; padding:12px; cursor:pointer; background:#fff; position:relative; transition:all 0.2s;">
          <div class="flex">
            <div style="font-weight:700; font-size:13px; flex:1;">📚 Tutor</div>
            <div class="pill" id="pill-tutor" style="background:#ccc; color:#fff; padding:2px 8px; border-radius:8px; font-size:10px;">Inactivo</div>
          </div>
          <div class="small" style="margin-top:4px;">Enseña tus habilidades y ayuda a otros.</div>
          <div id="btn-activate-tutor" class="btn ghost sm" style="margin-top:8px; display:none; text-align:center;">Activar rol tutor</div>
        </div>
      </div>
    </div>
  `,
  us26: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Programar sesión</h2></div>
      
      <div class="flex" style="margin-bottom:12px;">
        <div class="av" id="schedule-tutor-avatar" style="width:32px; height:32px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">AP</div>
        <div class="small" style="font-size:11px; margin-left:6px;">con <b id="schedule-tutor-name" style="color:var(--ink)">Andrea Paredes</b> · <span id="schedule-tutor-subj">Cálculo Dif.</span></div>
      </div>
      
      <div class="section-label" style="font-weight:700; margin-bottom:6px;">Fecha</div>
      <div style="border:1.5px solid #c9c7c2; border-radius:10px; padding:8px; font-size:10px; background:#fff; margin-bottom:12px;">
        <div class="flex" style="justify-content:space-between; font-weight:600; font-size:11px; margin-bottom:6px;">
          <span>‹ Noviembre 2026</span><span>›</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(7,1fr); gap:6px; text-align:center;" id="calendar-days-grid">
          <!-- Grid header -->
          <span class="small" style="font-weight:700;">L</span>
          <span class="small" style="font-weight:700;">M</span>
          <span class="small" style="font-weight:700;">M</span>
          <span class="small" style="font-weight:700;">J</span>
          <span class="small" style="font-weight:700;">V</span>
          <span class="small" style="font-weight:700;">S</span>
          <span class="small" style="font-weight:700;">D</span>
          
          <!-- Days -->
          <span style="color:#bbb; padding:2px;">28</span>
          <span style="color:#bbb; padding:2px;">29</span>
          <span style="color:#bbb; padding:2px;">30</span>
          <span style="color:#bbb; padding:2px;">31</span>
          
          <!-- Selectable days in November -->
          <span class="calendar-day" data-day="1">1</span>
          <span class="calendar-day" data-day="2">2</span>
          <span class="calendar-day" data-day="3">3</span>
          <span class="calendar-day" data-day="4">4</span>
          <span class="calendar-day" data-day="5">5</span>
          <span class="calendar-day" data-day="6">6</span>
          <span class="calendar-day selected" data-day="7">7</span>
          <span class="calendar-day" data-day="8">8</span>
          <span class="calendar-day" data-day="9">9</span>
          <span class="calendar-day" data-day="10">10</span>
          <span class="calendar-day" data-day="11">11</span>
          <span class="calendar-day" data-day="12">12</span>
          <span class="calendar-day" data-day="13">13</span>
          <span class="calendar-day" data-day="14">14</span>
          <span class="calendar-day" data-day="15">15</span>
          <span class="calendar-day" data-day="16">16</span>
          <span class="calendar-day" data-day="17">17</span>
          <span class="calendar-day" data-day="18">18</span>
          <span class="calendar-day" data-day="19">19</span>
          <span class="calendar-day" data-day="20">20</span>
          <span class="calendar-day" data-day="21">21</span>
          <span class="calendar-day" data-day="22">22</span>
          <span class="calendar-day" data-day="23">23</span>
          <span class="calendar-day" data-day="24">24</span>
          <span class="calendar-day" data-day="25">25</span>
          <span class="calendar-day" data-day="26">26</span>
          <span class="calendar-day" data-day="27">27</span>
          <span class="calendar-day" data-day="28">28</span>
          <span class="calendar-day" data-day="29">29</span>
          <span class="calendar-day" data-day="30">30</span>
        </div>
      </div>
      
      <div class="section-label" style="font-weight:700; margin-bottom:6px;">Hora</div>
      <div class="chips" style="margin-bottom:12px; display:flex; gap:6px;" id="schedule-hours-container">
        <span class="chip time-chip" data-time="17:00">17:00</span>
        <span class="chip time-chip selected" data-time="19:00">19:00</span>
        <span class="chip time-chip" data-time="20:00">20:00</span>
        <span class="chip" style="opacity:.4; text-decoration:line-through; cursor:not-allowed;">21:00</span>
      </div>
      
      <div style="margin-top:auto; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-schedule-confirm" style="width:100%;">Confirmar · Nov 7 · 19:00</button>
      </div>
    </div>
  `,
  us30: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Mis sesiones</h2><span id="btn-reminders" style="cursor:pointer; font-size:18px; margin-left:auto; padding:4px;" title="Ver recordatorios">🔔</span></div>
      
      <div class="tabs" style="display:flex; border-bottom:1.5px solid var(--soft); margin-bottom:12px; padding: 0 4px;">
        <div class="t on" id="tab-sesiones-proximas" style="flex:1; text-align:center; padding:10px; cursor:pointer; font-weight:700; border-radius: 6px 6px 0 0; transition: all 0.2s;">Próximas</div>
        <div class="t" id="tab-sesiones-completadas" style="flex:1; text-align:center; padding:10px; cursor:pointer; font-weight:700; border-radius: 6px 6px 0 0; transition: all 0.2s;">Completadas</div>
      </div>
      
      <div class="col" style="flex:1; overflow-y:auto; padding-bottom:12px;" id="sesiones-container">
        <!-- Will be populated dynamically by JS -->
      </div>
      
      <div style="margin-top:auto; padding-top:8px; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-nueva-sesion" style="width:100%;">+ Nueva sesión</button>
      </div>
    </div>
  `,
  us31: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>¿Cómo estuvo?</h2></div>
      <div class="center" style="text-align:center; margin-top: 12px;">
        <div class="av xl" style="margin:0 auto; width: 64px; height: 64px; border-radius: 50%; background: #F4E7E9; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;">AP</div>
        <div style="font-weight:600; font-size:13px; margin-top:8px;" id="rate-tutor-name">Andrea Paredes</div>
        <div class="small" id="rate-tutor-subj">Cálculo Diferencial · 7 nov</div>
      </div>
      
      <div class="stars-row" id="rate-stars-container" style="display:flex; justify-content:center; gap:8px; font-size:32px; margin: 16px 0; cursor:pointer; color:#ccc;">
        <span class="star" data-value="1">★</span>
        <span class="star" data-value="2">★</span>
        <span class="star" data-value="3">★</span>
        <span class="star" data-value="4">★</span>
        <span class="star" data-value="5">★</span>
      </div>
      
      <div class="center small" id="rate-stars-feedback" style="font-weight:600; color:var(--primary); text-align:center; min-height: 20px;"></div>
      
      <div class="form-field mt" style="margin-top:12px;">
        <label>Reseña (opcional)</label>
        <div class="input-wrap" style="border: 1.5px solid #c9c7c2; border-radius: 8px; padding: 6px;">
          <textarea id="rate-comment" rows="3" style="width:100%; border:none; outline:none; font-family:inherit; font-size:12px; resize:none;" placeholder="Reseña (opcional)"></textarea>
        </div>
      </div>
      
      <div class="section-label" style="font-weight:700; margin-top:12px; margin-bottom:6px;">Etiquetas rápidas</div>
      <div class="chips" id="rate-tags-container" style="display:flex; flex-wrap:wrap; gap:6px;">
        <span class="chip" data-tag="Paciente" style="cursor:pointer;">Paciente</span>
        <span class="chip" data-tag="Clara" style="cursor:pointer;">Clara</span>
        <span class="chip" data-tag="Puntual" style="cursor:pointer;">Puntual</span>
        <span class="chip" data-tag="+ más" style="cursor:pointer;">+ más</span>
      </div>
      
      <div style="margin-top:auto; padding-top:12px; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-submit-rating" style="width:100%;">Enviar calificación</button>
      </div>
    </div>
  `,
  us32: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Califica al aprendiz</h2></div>
      <div class="center" style="text-align:center; margin-top: 12px;">
        <div class="av xl" style="margin:0 auto; width: 64px; height: 64px; border-radius: 50%; background: #F4E7E9; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;">RE</div>
        <div style="font-weight:600; font-size:13px; margin-top:8px;" id="rate-student-name">Rogger Escalante</div>
        <div class="small">Aprendiz · 7 nov</div>
      </div>
      
      <div class="stars-row" id="rate-apprentice-stars-container" style="display:flex; justify-content:center; gap:8px; font-size:32px; margin: 16px 0; cursor:pointer; color:#ccc;">
        <span class="star" data-value="1">★</span>
        <span class="star" data-value="2">★</span>
        <span class="star" data-value="3">★</span>
        <span class="star" data-value="4">★</span>
        <span class="star" data-value="5">★</span>
      </div>
      
      <div class="center small" id="rate-apprentice-feedback" style="font-weight:600; color:var(--primary); text-align:center; min-height: 20px;"></div>
      
      <div class="form-field mt" style="margin-top:12px;">
        <label>Reseña (opcional)</label>
        <div class="input-wrap" style="border: 1.5px solid #c9c7c2; border-radius: 8px; padding: 6px;">
          <textarea id="rate-apprentice-comment" rows="3" style="width:100%; border:none; outline:none; font-family:inherit; font-size:12px; resize:none;" placeholder="Reseña (opcional)"></textarea>
        </div>
      </div>
      
      <div class="section-label" style="font-weight:700; margin-top:12px; margin-bottom:6px;">Etiquetas rápidas</div>
      <div class="chips" id="rate-apprentice-tags" style="display:flex; flex-wrap:wrap; gap:6px;">
        <span class="chip" data-tag="Puntual" style="cursor:pointer;">Puntual</span>
        <span class="chip" data-tag="Atento" style="cursor:pointer;">Atento</span>
        <span class="chip" data-tag="Preparado" style="cursor:pointer;">Preparado</span>
      </div>
      
      <div style="margin-top:auto; padding-top:12px; padding-bottom:12px;">
        <button type="button" class="btn" id="btn-submit-apprentice-rating" style="width:100%;">Enviar calificación</button>
      </div>
    </div>
  `,
  us33: `
    <div class="bar"><span>12:30</span><span class="icons">▲▼ ⋯⋯⋯</span></div>
    <div class="scr" style="display:flex; flex-direction:column; height:100%;">
      <div class="head"><span class="back">‹</span><h2>Mis calificaciones</h2></div>
      
      <div class="col" style="gap:12px; flex:1; overflow-y:auto; padding-bottom:12px;">
        <div class="center" style="border:1.5px solid var(--primary); border-radius:14px; padding:12px; text-align:center; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
          <div style="font-family:'Caveat',cursive; font-size:42px; font-weight:700; line-height:1; color:var(--primary);" id="my-rating-value">4.8</div>
          <div class="stars" style="font-size:16px; color:var(--cta);" id="my-rating-stars">★★★★★</div>
          <div class="small" style="margin-top:4px;">basado en <b id="my-rating-count">24 reseñas</b></div>
        </div>
        
        <div class="section-label" style="font-weight:700;">Mis Logros e Insignias</div>
        <div id="achievements-container" style="display:flex; flex-direction:column; gap:8px;">
          <!-- Will be populated dynamically -->
        </div>
        
        <div class="section-label" style="font-weight:700;">Últimas Reseñas Recibidas</div>
        <div class="col" style="gap:8px;" id="my-reviews-list">
          <!-- Will be populated dynamically -->
        </div>
      </div>
    </div>
  `
};

try {
  if (!fs.existsSync(screensPath)) {
    console.error(`Screens data file not found at: ${screensPath}`);
    process.exit(1);
  }

  const screens = JSON.parse(fs.readFileSync(screensPath, 'utf8'));

  // Separate screen template
  const template = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#8B1A2B">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>SCREEN_TITLE — Swaply</title>
  <link rel="stylesheet" href="css/app.css">
</head>
<body class="app-body" data-screen-id="SCREEN_ID">
  <div class="app-shell">
    <aside id="appSidebar" class="app-sidebar" aria-label="Historias de usuario"></aside>
    <div class="app-main">
      <header class="app-topbar" id="appTopbar">
        <!-- Configuration settings gear button on the far left -->
        <button type="button" class="btn-settings" id="btnSettings" aria-label="Ajustes" style="background:none; border:none; font-size:20px; cursor:pointer; padding:0 8px; color:var(--primary);">⚙️</button>
        <span class="app-topbar-title" id="screenTitle">SCREEN_TITLE</span>
        <button type="button" class="hu-toggle" id="huToggle" aria-label="Ver historias de usuario">50 HU</button>
      </header>
      <div class="app-viewport">
        <div class="app-frame" id="appFrame" role="main" aria-live="polite">
          SCREEN_HTML
        </div>
      </div>
    </div>
  </div>
  <script src="js/screens-data.js"></script>
  <script src="js/app-meta.js"></script>
  <script src="js/app.js"></script>
</body>
</html>`;

  // Get screen list (excluding us01b and us27)
  const finalScreens = screens.filter(s => s.id !== 'us01b' && s.id !== 'us27');

  // Also include the custom screen: us36-custom
  finalScreens.push({
    id: 'us36-custom',
    us: 'US36c',
    title: 'Nueva sesión',
    frameAttrs: '',
    html: '' // will be replaced by override
  });

  console.log(`Generating ${finalScreens.length} HTML files...`);

  finalScreens.forEach(screen => {
    // If we have a custom HTML override, use it; otherwise use the raw HTML from screens-data.json
    const rawHtml = CUSTOM_SCREENS_HTML[screen.id] !== undefined ? CUSTOM_SCREENS_HTML[screen.id] : screen.html;

    // Build the final html
    let fileContent = template
      .replace(/SCREEN_ID/g, screen.id)
      .replace(/SCREEN_TITLE/g, `${screen.us} · ${screen.title}`)
      .replace('SCREEN_HTML', rawHtml);

    const outPath = path.join(outDir, `${screen.id}.html`);
    fs.writeFileSync(outPath, fileContent, 'utf8');
  });

  console.log('Static pages generated successfully!');

} catch (err) {
  console.error('Error generating pages:', err);
  process.exit(1);
}
