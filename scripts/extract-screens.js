const fs = require('fs');
const path = require('path');

const srcPath = 'c:\\Users\\PC\\Downloads\\Wireframes Swaply - 50 HU - colored.html';
const outJsonPath = 'c:\\Users\\PC\\Desktop\\web\\js\\screens-data.json';
const outJsPath = 'c:\\Users\\PC\\Desktop\\web\\js\\screens-data.js';

try {
  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found at: ${srcPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(srcPath, 'utf8');

  const screens = [];
  // DotAll equivalent in JS regex is the 's' flag.
  // We use global ('g') and dotAll ('s') flags.
  const pattern = /<!-- (US\d+b?[^-]*?) -->\s*<div class="ph">\s*<div class="uslabel">([\s\S]*?)<\/div>\s*<div class="frame"([^>]*)>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;

  let match;
  while ((match = pattern.exec(html)) !== null) {
    const comment = match[1].trim();
    // Strip HTML tags from label
    const rawLabel = match[2];
    const labelHtml = rawLabel.replace(/<[^>]+>/g, '').trim();
    const frameAttrs = match[3];
    const frameInner = match[4].trim();

    const idMatch = /US(\d+)(b)?/i.exec(comment);
    if (!idMatch) {
      continue;
    }
    const num = idMatch[1];
    const suffix = idMatch[2] || '';
    const screenId = `us${num}${suffix}`;

    const title = labelHtml.includes('·') ? labelHtml.split('·').pop().trim() : labelHtml;

    screens.push({
      id: screenId,
      us: `US${num}${suffix}`,
      title: title,
      frameAttrs: frameAttrs,
      html: frameInner
    });
  }

  // Ensure output directories exist
  fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });

  // Write JSON
  fs.writeFileSync(outJsonPath, JSON.stringify(screens, null, 2), 'utf8');
  console.log(`Extracted ${screens.length} screens -> ${outJsonPath}`);

  // Write JS global version
  const jsContent = `window.screensData = ${JSON.stringify(screens, null, 2)};\n`;
  fs.writeFileSync(outJsPath, jsContent, 'utf8');
  console.log(`Extracted ${screens.length} screens -> ${outJsPath}`);

} catch (err) {
  console.error('Error executing extract-screens.js:', err);
  process.exit(1);
}
