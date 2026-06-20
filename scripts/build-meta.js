const fs = require('fs');
const path = require('path');

const screensPath = 'c:\\Users\\PC\\Desktop\\web\\js\\screens-data.json';
const flowsPath = 'c:\\Users\\PC\\Desktop\\web\\js\\flows-data.json';
const outJsonPath = 'c:\\Users\\PC\\Desktop\\web\\js\\app-meta.json';
const outJsPath = 'c:\\Users\\PC\\Desktop\\web\\js\\app-meta.js';

try {
  if (!fs.existsSync(screensPath)) {
    console.error(`Screens data not found at: ${screensPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(flowsPath)) {
    console.error(`Flows data not found at: ${flowsPath}`);
    process.exit(1);
  }

  const screens = JSON.parse(fs.readFileSync(screensPath, 'utf8'));
  const flows = JSON.parse(fs.readFileSync(flowsPath, 'utf8'));

  // Map US number to primary screen id
  const usToScreen = {};
  for (const s of screens) {
    const us = s.us.toLowerCase();
    if (!(s.us in usToScreen) || !s.id.includes('b')) {
      usToScreen[s.us] = s.id;
    }
    usToScreen[us] = usToScreen[s.us] || s.id;
  }

  // Screen lookup by id
  const byId = {};
  for (const s of screens) {
    byId[s.id] = s;
  }

  // Manual flow navigation based on wireflows (happy path + key branches)
  const NAV = {
    "us45": {"Empezar": "us05", "Ya tengo cuenta": "us02"},
    "us02": {"Iniciar sesión": "us15", "Crear cuenta": "us01", "¿Olvidaste tu contraseña?": "us03"},
    "us01": {"Crear cuenta": "us05", "Inicia sesión": "us02"},

    "us03": {"Enviar enlace": "us02", "Volver al inicio de sesión": "us02", "back": "us02"},
    "us04": {"Cerrar sesión": "us02", "Cancelar": "us15", "Notificaciones": "us40", "Privacidad": "us48", "Ayuda": "us47", "back": "us15"},
    "us05": {"Guardar y continuar": "us06", "back": "us45"},
    "us06": {"Guardar perfil": "us15", "back": "us05"},
    "us07": {"Guardar cambios": "us15", "Cambiar foto": "us08", "back": "us15"},
    "us08": {"Usar esta foto": "us07", "back": "us07"},
    "us09": {"Activar rol tutor": "us06", "back": "us15"},
    "us10": {"Enviar solicitud": "us16", "back": "us11"},
    "us11": {"back": "us15", "Andrea Paredes": "us10", "Luis Mendoza": "us10", "Karen Ríos": "us10"},
    "us11b": {"back": "us11"},
    "us12": {"Aplicar filtros (1)": "us11", "back": "us11", "Limpiar": "us12"},
    "us13": {"Ver 5 tutores disponibles": "us11", "Limpiar filtro": "us11", "back": "us11"},
    "us14": {"back": "us15", "Andrea Paredes": "us10", "Carlos Montes": "us10"},
    "us15": {"Buscar tutores…": "us11", "Andrea P.": "us10", "Luis M.": "us10", "Sesión con Karen R.": "us30", "Inicio": "us15", "Buscar": "us11", "Chats": "us24", "Perfil": "us07"},
    "us16": {"Enviar solicitud (3 créditos)": "us19", "back": "us10"},
    "us17": {"Aceptar": "us21", "Rechazar": "us18", "back": "us19"},
    "us18": {"Confirmar rechazo": "us19", "Cancelar": "us17", "back": "us17"},
    "us19": {"Andrea Paredes": "us20", "Carlos Montes": "us20", "Luis Mendoza": "us21", "back": "us15"},
    "us20": {"Sí, cancelar": "us19", "Volver": "us19", "back": "us19"},
    "us21": {"back": "us24", "➤": "us21"},
    "us22": {"back": "us21"},
    "us23": {"back": "us21"},
    "us24": {"Andrea Paredes": "us21", "Luis Mendoza": "us21", "Carlos Montes": "us21", "Karen Ríos": "us21", "Inicio": "us15", "Buscar": "us11", "Chats": "us24", "Perfil": "us07"},
    "us25": {"Bloquear": "us24", "Cancelar": "us21", "back": "us21"},
    "us26": {"Confirmar · Jue 7 nov · 19:00": "us30", "back": "us21"},

    "us28": {"Marcar como completada": "us31", "Reportar problema": "us43", "back": "us30"},
    "us29": {"Cancelar igual": "us30", "Volver": "us30", "back": "us30"},
    "us30": {"Andrea Paredes": "us31", "back": "us15"},
    "us31": {"Enviar calificación": "us15", "back": "us30"},
    "us32": {"Enviar calificación": "us30", "back": "us28"},
    "us33": {"back": "us07"},
    "us34": {"back": "us07"},
    "us35": {"Enviar reporte": "us33", "back": "us33"},
    "us36": {"Ver historial completo": "us38", "back": "us15"},
    "us37": {"Aceptar y enviar (–3)": "us19", "back": "us16"},
    "us38": {"back": "us36"},
    "us39": {"Nueva solicitud": "us17", "Mensaje de Andrea P.": "us21", "Sesión en 1 hora": "us30", "Inicio": "us15", "Buscar": "us11", "Chats": "us24", "Perfil": "us07"},
    "us40": {"back": "us04"},
    "us41": {"back": "us15", "Validar identidad": "us42", "Reportes": "us43", "Universidades": "us44"},
    "us42": {"Aprobar ✓": "us41", "Rechazar": "us41", "back": "us41"},
    "us43": {"back": "us41"},
    "us44": {"back": "us41", "+ Nueva": "us44"},
    "us46": {"Siguiente ›": "us46", "Saltar tour": "us15", "back": "us15"},
    "us47": {"back": "us04", "Contactar soporte": "us04"},
    "us48": {"back": "us04"},
    "us49": {"Eliminar": "us02", "Cancelar": "us04", "back": "us04"},
    "us50": {"Actualizar contraseña": "us04", "back": "us04"}
  };

  // Epic grouping for sidebar
  const EPICS = [
    {"id": "EP01", "name": "Autenticación", "screens": ["us45", "us01", "us02", "us03", "us04"]},
    {"id": "EP02", "name": "Perfil", "screens": ["us05", "us06", "us07", "us08", "us09", "us10"]},
    {"id": "EP03", "name": "Búsqueda", "screens": ["us11", "us11b", "us12", "us13", "us14", "us15"]},
    {"id": "EP04", "name": "Solicitudes", "screens": ["us16", "us17", "us18", "us19", "us20"]},
    {"id": "EP05", "name": "Mensajería", "screens": ["us21", "us22", "us23", "us24", "us25"]},
    {"id": "EP06", "name": "Sesiones", "screens": ["us26", "us28", "us29", "us30"]},
    {"id": "EP07", "name": "Calificaciones", "screens": ["us31", "us32", "us33", "us34", "us35"]},
    {"id": "EP08", "name": "Créditos", "screens": ["us36", "us37", "us38"]},
    {"id": "EP09", "name": "Notificaciones", "screens": ["us39", "us40"]},
    {"id": "EP10", "name": "Admin", "screens": ["us41", "us42", "us43", "us44"]},
    {"id": "EP11", "name": "Onboarding", "screens": ["us45", "us46", "us47"]},
    {"id": "EP12", "name": "Privacidad", "screens": ["us48", "us49", "us50"]}
  ];

  // Map screens to exclude html key to keep meta lightweight
  const screensMeta = screens.map(s => {
    const copy = { ...s };
    delete copy.html;
    return copy;
  });

  const meta = {
    screens: screensMeta,
    navigation: NAV,
    epics: EPICS,
    defaultScreen: "us45",
    flows: flows
  };

  // Write JSON
  fs.writeFileSync(outJsonPath, JSON.stringify(meta, null, 2), 'utf8');
  console.log(`Wrote ${outJsonPath}`);

  // Write JS global version
  const jsContent = `window.meta = ${JSON.stringify(meta, null, 2)};\n`;
  fs.writeFileSync(outJsPath, jsContent, 'utf8');
  console.log(`Wrote ${outJsPath}`);

} catch (err) {
  console.error('Error executing build-meta.js:', err);
  process.exit(1);
}
