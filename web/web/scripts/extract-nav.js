const fs = require('fs');
const path = require('path');

const srcPath = 'c:\\Users\\PC\\Downloads\\Wireflows individuales - 50 HU.html';
const outJsonPath = 'c:\\Users\\PC\\Desktop\\web\\js\\flows-data.json';

try {
  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found at: ${srcPath}`);
    process.exit(1);
  }

  const html = fs.readFileSync(srcPath, 'utf8');

  const flows = [];
  const huPattern = /<section class="hu">([\s\S]*?)<span class="id">(US\d+)<\/span>([\s\S]*?)<h2>([^<]+)<\/h2>([\s\S]*?)<\/section>/g;

  // Let's refine the pattern to match exactly what python's:
  // r'<section class="hu">.*?<span class="id">(US\d+)</span>.*?<h2>([^<]+)</h2>.*?</section>' did.
  // In JS, .*? is represented by [\s\S]*?
  const refinedPattern = /<section class="hu">[\s\S]*?<span class="id">(US\d+)<\/span>[\s\S]*?<h2>([^<]+)<\/h2>([\s\S]*?)<\/section>/g;

  let match;
  while ((match = refinedPattern.exec(html)) !== null) {
    const us = match[1];
    const title = match[2].trim();
    const section = match[0];

    // Extract arrow labels and following node labels
    const arrLabels = [];
    const arrRegex = /<span class="lab">([^<]+)<\/span>/g;
    let arrMatch;
    while ((arrMatch = arrRegex.exec(section)) !== null) {
      arrLabels.push(arrMatch[1]);
    }

    const nodeLabels = [];
    const nodeRegex = /<div class="node"><div class="lbl">([^<]+)<\/div>/g;
    let nodeMatch;
    while ((nodeMatch = nodeRegex.exec(section)) !== null) {
      nodeLabels.push(nodeMatch[1]);
    }

    flows.push({
      us: us,
      title: title,
      actions: arrLabels.slice(0, 12),
      screens: nodeLabels.slice(0, 12)
    });
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });

  fs.writeFileSync(outJsonPath, JSON.stringify(flows, null, 2), 'utf8');
  console.log(`Extracted ${flows.length} flows -> ${outJsonPath}`);

} catch (err) {
  console.error('Error executing extract-nav.js:', err);
  process.exit(1);
}
