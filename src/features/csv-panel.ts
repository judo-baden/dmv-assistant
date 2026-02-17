import { selectors } from '../config/selectors';
import { qs, sleep, setProgress } from '../core/dom';
import { addStyle } from '../core/style';
import { log } from '../core/logger';
import { t } from '../core/i18n';

const THEME_STYLE_ID = 'tmCsvThemeStyle';
const PANEL_ID = 'tmCsvPanel';

function injectThemeOnce() {
  addStyle(
    THEME_STYLE_ID,
    `
/* Panel & Header */
[data-bs-theme="dark"] #tmCsvPanel {
  background: rgba(40,40,40,0.88) !important;
  border-color: #555 !important;
  color: #ddd !important;
}
[data-bs-theme="dark"] #tmCsvHeader {
  background: #333 !important;
  color: #fff !important;
  border-bottom-color: #555 !important;
}
/* Log */
[data-bs-theme="dark"] #tmCsvLog {
  background: #222 !important;
  border-color: #555 !important;
  color: #ddd !important;
}
/* Progressbars */
[data-bs-theme="dark"] #tmCsvImportBar { background: #0d6efd !important; color: #fff !important; }
[data-bs-theme="dark"] #tmCsvProcessBar { background: #198754 !important; color: #fff !important; }
/* CSV-Hinweis */
[data-bs-theme="dark"] #tmCsvHint {
  background: #2b2b2b !important;
  border-color: #555 !important;
  color: #ddd !important;
}
`
  );
}

export function ensureCsvPanelMounted() {
  if (document.getElementById(PANEL_ID)) return;

  // Suche-Feld suchen (Anker fürs Panel)
  const searchInput = qs<HTMLInputElement>(selectors.searchInput);
  if (!searchInput) return;

  injectThemeOnce();

  // Panel erzeugen
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.style.cssText = `
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #f0f0f0e8;
    padding: 0;
    font-size: 12px;
  `;

  panel.innerHTML = `
    <div id="tmCsvHeader"
        style="padding: 6px 10px; cursor: pointer; font-weight: bold;
               background:#e6e6e6; border-bottom:1px solid #ccc; user-select:none;">
      ▼ CSV‑${t('import')} <span style="color:#777;">(Tampermonkey)</span>
    </div>

    <div id="tmCsvContent" style="display:none; padding:10px;">

      <label style="font-weight:600;">${t('import')}</label>
      <input type="file" id="tmCsvFile"
             accept=".csv,text/csv"
             class="form-control"
             style="padding:3px; font-size:12px; margin-bottom:8px;" />

      <button id="tmCsvStart" class="btn btn-primary btn-sm w-100">
        ${t('import')}
      </button>

      <div style="margin-top:10px; font-weight:600;">${t('progress')}</div>
      <div class="progress" style="height:16px; background:#eee;">
        <div id="tmCsvImportBar" class="progress-bar"
            style="width:0" aria-valuenow="0"
            aria-valuemin="0" aria-valuemax="100">0%</div>
      </div>

      <div style="margin-top:10px; font-weight:600;">${t('progress')}</div>
      <div class="progress" style="height:16px; background:#eee;">
        <div id="tmCsvProcessBar" class="progress-bar bg-success"
            style="width:0" aria-valuenow="0"
            aria-valuemin="0" aria-valuemax="100">0%</div>
      </div>

      <!-- CSV Hinweis -->
      <div id="tmCsvHint"
          style="margin-top:10px; padding:8px; font-size:11px;
                 background:#eef2f5; border:1px solid #ccc; border-radius:4px; color:#333;">
        <strong>${t('welcome')}</strong><br>
        Jede Zeile muss folgendes Format haben:<br>
        <code>Name;Vorname;Geburtsdatum</code><br>
        Beispiel:<br>
        <code>Müller;Hans;2012-04-18</code><br>
        – Trennzeichen: <strong>Semikolon</strong><br>
        – Zeichencodierung: <strong>UTF‑8</strong><br>
        – Erste Zeile kann optional eine Kopfzeile sein<br>
      </div>

      <div id="tmCsvLog"
          style="margin-top:10px;height:120px;overflow:auto;
                 font-size:11px;padding:6px;background:#fff;border:1px solid #ccc;">
        Log bereit…
      </div>
    </div>
  `;

  // Nach dem Suchfeld einfügen
  searchInput.after(panel);

  // Controls
  const header = panel.querySelector<HTMLDivElement>('#tmCsvHeader')!;
  const content = panel.querySelector<HTMLDivElement>('#tmCsvContent')!;
  const fileInput = panel.querySelector<HTMLInputElement>('#tmCsvFile')!;
  const startBtn = panel.querySelector<HTMLButtonElement>('#tmCsvStart')!;
  const importBar = panel.querySelector<HTMLDivElement>('#tmCsvImportBar')!;
  const processBar = panel.querySelector<HTMLDivElement>('#tmCsvProcessBar')!;
  const logArea = panel.querySelector<HTMLDivElement>('#tmCsvLog')!;

  const logLine = (msg: string) => {
    logArea.innerHTML += msg + '<br>';
    logArea.scrollTop = logArea.scrollHeight;
  };

  // Toggle Panel
  header.addEventListener('click', () => {
    const open = content.style.display !== 'none';
    content.style.display = open ? 'none' : 'block';
    header.innerHTML = open
      ? '▼ CSV‑Optionen <span style="color:#777;">(Tampermonkey)</span>'
      : '▲ CSV‑Optionen <span style="color:#777;">(Tampermonkey)</span>';
  });

  // CSV verarbeiten
  startBtn.addEventListener('click', async () => {
    const file = fileInput.files?.[0];
    if (!file) {
      logLine('⚠️ Keine CSV‑Datei ausgewählt.');
      return;
    }

    logArea.innerHTML = '';
    setProgress(importBar, 0, 'Import');
    setProgress(processBar, 0, 'Verarbeitung');

    logLine('📄 CSV‑Datei: ' + file.name);

    const text = await file.text();
    const rawLines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const lines = [...rawLines];
    const totalLines = lines.length;
    logLine('📌 Zeilen erkannt: ' + totalLines);

    // Kopfzeile optional entfernen
    if (/^name\s*;.*vorname/i.test(lines[0])) lines.shift();

    // Import in Chunks (UI responsiv)
    const chunkSize = 200;
    const targets: Array<{ Name: string; Vorname: string; Geburtstag: string; _done: boolean }> = [];
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      for (const line of chunk) {
        const [Name = '', Vorname = '', Geburtstag = ''] = line.split(';').map(s => s.trim());
        targets.push({ Name, Vorname, Geburtstag, _done: false });
      }
      const done = Math.min(rawLines.length, i + chunk.length);
      setProgress(importBar, (done / totalLines) * 100, 'Import');
      await sleep(10);
    }
    logLine(`✅ Import abgeschlossen: ${targets.length} Datensätze`);

    // Verarbeitung (Testmodus – aktuell ohne Checkbox‑Aktion)
    const total = targets.length;
    const step = 200;
    for (let i = 0; i < targets.length; i += step) {
      const done = Math.min(total, i + step);
      setProgress(processBar, (done / total) * 100, 'Verarbeitung');
      await sleep(10);
    }
    logLine('🟢 Verarbeitung abgeschlossen (Testmodus, ohne Checkbox‑Aktion).');

    // 👉 Hier kannst du später Matching + Checkbox-Klicks ergänzen.
  });

  log.info('CSV-Panel mounted.');
}
