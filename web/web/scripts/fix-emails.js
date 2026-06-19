const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'js', 'screens-data.json');
const jsPath = path.join(__dirname, '..', 'js', 'screens-data.js');

try {
  if (!fs.existsSync(jsonPath)) {
    console.error(`JSON file not found at: ${jsonPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const emailPat = /<a href="\/cdn-cgi\/l\/email-protection"[^>]*>\[email[^\]]*\]<\/a>/g;

  for (const s of data) {
    s.html = s.html.replace(emailPat, 'rogger@upc.edu.pe');
    s.html = s.html.replace(/\[email&#160;protected\]/g, 'rogger@upc.edu.pe');
    if (s.id === 'us01b') {
      // In JS, .replace(string, string) replaces only the first occurrence.
      s.html = s.html.replace('rogger@upc.edu.pe', 'gmail@gmail.com');
    }
  }

  // Write JSON
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Fixed emails in', jsonPath);

  // Write JS global version
  const jsContent = `window.screensData = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log('Fixed emails in', jsPath);

} catch (err) {
  console.error('Error executing fix-emails.js:', err);
  process.exit(1);
}
