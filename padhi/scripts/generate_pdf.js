#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const htmlPath = path.join(rootDir, 'scripts', 'project_description.html');
const outputPath = path.join(rootDir, 'CivicFix_Project_Description.pdf');

if (!fs.existsSync(htmlPath)) {
  console.error(`[PDF Generator] Source HTML not found at: ${htmlPath}`);
  process.exit(1);
}

const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

let chromeExe = null;
for (const cand of chromeCandidates) {
  if (fs.existsSync(cand)) {
    chromeExe = cand;
    break;
  }
}

if (!chromeExe) {
  try {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'where chrome' : 'which google-chrome || which chromium';
    const found = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim().split('\n')[0].trim();
    if (found && fs.existsSync(found)) {
      chromeExe = found;
    }
  } catch (e) {
    // ignore
  }
}

if (!chromeExe) {
  console.error('[PDF Generator] Google Chrome or Chromium executable not found on system.');
  process.exit(1);
}

console.log(`[PDF Generator] Using browser: ${chromeExe}`);
console.log(`[PDF Generator] Compiling HTML: ${htmlPath}`);
console.log(`[PDF Generator] Output PDF: ${outputPath}`);

const tempProfileDir = path.join('/tmp', `chrome_pdf_${Date.now()}`);

try {
  const flags = [
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir="${tempProfileDir}"`,
    '--no-pdf-header-footer',
    `--print-to-pdf="${outputPath}"`,
    `"${htmlPath}"`,
  ].join(' ');

  execSync(`"${chromeExe}" ${flags}`, { stdio: 'inherit' });

  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`[PDF Generator] Successfully generated ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error('[PDF Generator] Output PDF was not created.');
    process.exit(1);
  }
} catch (err) {
  console.error('[PDF Generator] Error running Chrome print-to-pdf:', err.message);
  process.exit(1);
} finally {
  try {
    if (fs.existsSync(tempProfileDir)) {
      fs.rmSync(tempProfileDir, { recursive: true, force: true });
    }
  } catch (e) {
    // ignore
  }
}
