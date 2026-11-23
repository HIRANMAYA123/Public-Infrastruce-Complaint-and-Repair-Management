import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'project_description.html');

let html = fs.readFileSync(filePath, 'utf8');

// The updated theme design CSS
const themeCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1E293B;
    background-color: #FFFFFF;
    font-size: 10pt;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Page Breaks */
  .page-break {
    page-break-after: always;
    break-after: page;
  }

  .avoid-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Theme Tokens */
  :root {
    --navy-950: #0A1424;
    --navy-900: #0F1E36;
    --navy-800: #142D4E;
    --navy-700: #1D3B64;
    --navy-600: #264A7C;
    --teal-800: #0D5C56;
    --teal-700: #116C65;
    --teal-600: #0D9488;
    --teal-500: #14B8A6;
    --teal-100: #CCFBF1;
    --teal-50: #F0FDFA;
    --surface-bg: #F8FAFC;
    --surface-card: #FFFFFF;
    --border-subtle: #E2E8F0;
    --border-strong: #CBD5E1;
    --text-primary: #0F172A;
    --text-secondary: #334155;
    --text-muted: #64748B;
    --accent-amber: #D97706;
    --accent-red: #DC2626;
    --accent-green: #059669;
    --accent-blue: #2563EB;
  }

  /* Typography */
  h1, h2, h3, h4, h5 {
    color: var(--navy-800);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  h1 {
    font-size: 26pt;
    line-height: 1.15;
    font-weight: 800;
  }

  h2 {
    font-size: 13.5pt;
    line-height: 1.3;
    margin-top: 18pt;
    margin-bottom: 8pt;
    padding-bottom: 4pt;
    border-bottom: 2px solid transparent;
    border-image: linear-gradient(90deg, var(--teal-600) 0%, var(--navy-800) 45%, #E2E8F0 100%) 1;
    display: flex;
    align-items: center;
  }

  h3 {
    font-size: 11pt;
    margin-top: 12pt;
    margin-bottom: 4pt;
    color: var(--navy-700);
    font-weight: 700;
  }

  h4 {
    font-size: 9.5pt;
    margin-top: 9pt;
    margin-bottom: 3pt;
    color: var(--navy-800);
    font-weight: 600;
  }

  p {
    margin-bottom: 6.5pt;
    color: var(--text-secondary);
    text-align: justify;
    font-size: 9.5pt;
  }

  /* Running Document Header */
  .doc-header-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid var(--border-subtle);
    padding-bottom: 5pt;
    margin-bottom: 12pt;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  .doc-header-banner .brand-mark {
    color: var(--navy-800);
    display: flex;
    align-items: center;
    gap: 4pt;
  }

  .doc-header-banner .brand-mark span {
    color: var(--teal-600);
  }

  /* Cover Page */
  .cover-page {
    min-height: 250mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16mm 12mm 12mm 12mm;
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    background: radial-gradient(circle at 100% 0%, #F0FDFA 0%, #FFFFFF 45%, #F8FAFC 100%);
    position: relative;
    overflow: hidden;
  }

  .cover-page::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, var(--navy-800) 0%, var(--teal-600) 60%, var(--teal-500) 100%);
  }

  .cover-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--teal-50);
    color: var(--teal-700);
    border: 1px solid var(--border-subtle);
    padding: 3.5px 12px;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-radius: 20px;
  }

  .cover-title-box {
    margin-top: 22pt;
  }

  .cover-title {
    font-size: 38pt;
    font-weight: 800;
    color: var(--navy-900);
    line-height: 1.05;
    margin-bottom: 6pt;
    letter-spacing: -0.03em;
  }

  .cover-title .brand-accent {
    color: var(--teal-600);
  }

  .cover-subtitle {
    font-size: 13.5pt;
    color: var(--teal-700);
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 12pt;
  }

  .cover-desc {
    font-size: 10pt;
    color: var(--text-secondary);
    max-width: 92%;
    line-height: 1.6;
  }

  .cover-metadata-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10pt;
    margin: 18pt 0 14pt 0;
    background: #FFFFFF;
    padding: 12pt 14pt;
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
  }

  .meta-label {
    font-size: 7.5pt;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 1.5pt;
  }

  .meta-value {
    font-size: 9.5pt;
    font-weight: 600;
    color: var(--navy-900);
  }

  .cover-footer {
    border-top: 1px solid var(--border-subtle);
    padding-top: 10pt;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8pt;
    color: var(--text-muted);
  }

  /* Themed Cards & Callouts */
  .card {
    background: #FFFFFF;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 10pt 12pt;
    margin-bottom: 10pt;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  }

  .highlight-card {
    background: linear-gradient(135deg, #F8FAFC 0%, var(--teal-50) 100%);
    border-left: 4px solid var(--teal-600);
    border-top: 1px solid var(--border-subtle);
    border-right: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    padding: 10pt 14pt;
    border-radius: 0 8px 8px 0;
    margin-bottom: 10pt;
  }

  .alert-box {
    border-radius: 6px;
    padding: 7pt 10pt;
    margin: 8pt 0;
    font-size: 9pt;
  }

  .alert-amber {
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    color: #92400E;
  }

  .alert-blue {
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    color: #1E40AF;
  }

  /* Themed Tables */
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 8pt 0 11pt 0;
    font-size: 8.5pt;
    background: #FFFFFF;
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    overflow: hidden;
  }

  th, td {
    padding: 5.5pt 7.5pt;
    border-bottom: 1px solid var(--border-subtle);
    border-right: 1px solid var(--border-subtle);
    text-align: left;
    vertical-align: middle;
  }

  th:last-child, td:last-child {
    border-right: none;
  }

  tr:last-child td {
    border-bottom: none;
  }

  th {
    background: linear-gradient(180deg, var(--navy-900) 0%, var(--navy-800) 100%);
    color: #FFFFFF;
    font-weight: 700;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-top: none;
  }

  tr:nth-child(even) td {
    background-color: #F8FAFC;
  }

  /* Themed Code Blocks */
  pre, code {
    font-family: 'JetBrains Mono', Consolas, Menlo, Monaco, monospace;
    font-size: 8pt;
  }

  code {
    background: #F1F5F9;
    color: var(--navy-900);
    padding: 1px 4pt;
    border-radius: 3px;
    border: 1px solid #E2E8F0;
    font-weight: 500;
  }

  pre {
    background: #0B1424;
    color: #E2E8F0;
    padding: 8pt 10pt;
    border-radius: 6px;
    overflow-x: auto;
    margin: 7pt 0 10pt 0;
    line-height: 1.45;
    border: 1px solid #1E293B;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    border: none;
  }

  /* Badges */
  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge-urgent { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
  .badge-high { background: #FFEDD5; color: #9A3412; border: 1px solid #FED7AA; }
  .badge-medium { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
  .badge-resolved { background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; }
  .badge-navy { background: #E0E7FF; color: #3730A3; border: 1px solid #C7D2FE; }

  /* Architecture Diagram Cards */
  .arch-diagram {
    display: flex;
    flex-direction: column;
    gap: 6pt;
    margin: 8pt 0;
  }

  .arch-tier {
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    background: #FFFFFF;
    padding: 7pt 10pt;
    border-left: 4px solid var(--teal-600);
  }

  .arch-tier-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3pt;
  }

  .arch-tier-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: var(--navy-800);
  }

  .arch-tier-tech {
    font-size: 7.5pt;
    font-weight: 600;
    color: var(--teal-700);
    background: var(--teal-50);
    border: 1px solid var(--teal-100);
    padding: 1.5px 6px;
    border-radius: 4px;
  }

  .arch-tier-body {
    font-size: 8.5pt;
    color: var(--text-secondary);
  }

  /* Process Flow Steps */
  .flow-step {
    display: flex;
    gap: 10pt;
    margin-bottom: 7pt;
    align-items: flex-start;
  }

  .flow-num {
    flex-shrink: 0;
    width: 20pt;
    height: 20pt;
    background: linear-gradient(135deg, var(--navy-800) 0%, var(--teal-600) 100%);
    color: #FFFFFF;
    font-weight: 700;
    font-size: 8.5pt;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(13, 148, 136, 0.2);
  }

  .flow-content {
    flex: 1;
  }

  .flow-content strong {
    color: var(--navy-800);
    font-size: 9.5pt;
  }

  .flow-content p {
    margin-bottom: 2pt;
    font-size: 8.5pt;
  }
`;

// Replace <style> block
const styleRegex = /<style>[\s\S]*?<\/style>/;
html = html.replace(styleRegex, `<style>${themeCSS}</style>`);

// Update cover title with themed span
html = html.replace(
  '<h1 class="cover-title">CivicFix</h1>',
  '<h1 class="cover-title">Civic<span class="brand-accent">Fix</span></h1>'
);

// Add running document header to section page breaks
const runningHeader = `
    <div class="doc-header-banner">
      <div class="brand-mark">CIVIC<span>FIX</span> &bull; MUNICIPAL PLATFORM</div>
      <div>TECHNICAL ARCHITECTURAL REPORT &bull; 2026</div>
    </div>
`;

// Inject running header right after <div class="page-break"> (except the cover page)
let parts = html.split('<div class="page-break">');
if (parts.length > 1) {
  for (let i = 1; i < parts.length; i++) {
    // Only inject if it doesn't already have doc-header-banner
    if (!parts[i].includes('doc-header-banner')) {
      parts[i] = '\n' + runningHeader + parts[i];
    }
  }
  html = parts.join('<div class="page-break">');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('[Theme Design] Successfully applied theme styling to project_description.html without altering structure.');
