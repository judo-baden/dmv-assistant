// ==UserScript==
// @name         DMV Assistant (DJB Portal)
// @namespace    https://djb.dokume.app/
// @version      0.1.0
// @description  CSV-Import & Fortschritt + Auto-Bereinigung für Sammelbestellungen im DJB-Portal.
// @author       Code.Sport
// @match        https://djb.dokume.app/*
// @run-at       document-idle
// @grant        none
// @license      AGPL-3.0
// @updateURL    https://raw.githubusercontent.com/YOURORG/dmv-assistant/main/dist/dmv-assistant.user.js
// @downloadURL  https://raw.githubusercontent.com/YOURORG/dmv-assistant/main/dist/dmv-assistant.user.js
// ==/UserScript==

"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/i18n/en.json
  var require_en = __commonJS({
    "src/i18n/en.json"(exports, module) {
      module.exports = {
        hello: "Hello",
        welcome: "Welcome to DMV Assistant!",
        import: "Import",
        delete: "Delete",
        progress: "Progress"
      };
    }
  });

  // src/i18n/de.json
  var require_de = __commonJS({
    "src/i18n/de.json"(exports, module) {
      module.exports = {
        hello: "Hallo",
        welcome: "Willkommen beim DMV Assistant!",
        import: "Importieren",
        delete: "L\xF6schen",
        progress: "Fortschritt"
      };
    }
  });

  // src/core/i18n.ts
  var LANGS = /* @__PURE__ */ new Set(["de", "en"]);
  var translations = {};
  function detectLang() {
    const navLang = navigator.language.slice(0, 2).toLowerCase();
    return LANGS.has(navLang) ? navLang : "de";
  }
  async function loadTranslations(lang) {
    switch (lang) {
      case "en":
        return (await Promise.resolve().then(() => __toESM(require_en(), 1))).default;
      case "de":
      default:
        return (await Promise.resolve().then(() => __toESM(require_de(), 1))).default;
    }
  }
  async function initI18n() {
    const lang = detectLang();
    translations = await loadTranslations(lang);
  }
  function t(key) {
    return translations[key] || key;
  }

  // src/config/selectors.ts
  var selectors = {
    // CSV-Panel
    searchInput: '#searchFilter, input[placeholder="Suche"], #membersDIV input.form-control[type="search"]',
    // Auto-Clean
    addMembersBtn: "#addMembersBTN",
    tableRows: "table tbody tr",
    rowWarningBtn: "button.btn-warning",
    rowDeleteBtn: "button[data-deletelicenseposition]"
  };

  // src/core/dom.ts
  var sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  function qs(sel, root = document) {
    return root.querySelector(sel);
  }
  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }
  function waitFor(selector, timeoutMs = 15e3) {
    return new Promise((resolve, reject) => {
      const found = qs(selector);
      if (found) return resolve(found);
      const t0 = Date.now();
      const obs = new MutationObserver(() => {
        const el = qs(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        } else if (Date.now() - t0 > timeoutMs) {
          obs.disconnect();
          reject(new Error("Timeout waiting for " + selector));
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    });
  }
  function setProgress(el, value, label) {
    const n = Math.max(0, Math.min(100, Math.round(value)));
    el.style.width = n + "%";
    el.setAttribute("aria-valuenow", String(n));
    el.textContent = label ? `${label} ${n}%` : `${n}%`;
  }

  // src/core/style.ts
  function addStyle(id, css) {
    const existing = document.getElementById(id);
    if (existing) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  }

  // src/core/logger.ts
  var enabled = true;
  var pfx = "[dmva]";
  var log = {
    info: (...a) => enabled && console.info(pfx, ...a),
    warn: (...a) => enabled && console.warn(pfx, ...a),
    error: (...a) => enabled && console.error(pfx, ...a)
  };

  // src/features/csv-panel.ts
  var THEME_STYLE_ID = "tmCsvThemeStyle";
  var PANEL_ID = "tmCsvPanel";
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
  function ensureCsvPanelMounted() {
    if (document.getElementById(PANEL_ID)) return;
    const searchInput = qs(selectors.searchInput);
    if (!searchInput) return;
    injectThemeOnce();
    const panel = document.createElement("div");
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
      \u25BC CSV\u2011${t("import")} <span style="color:#777;">(Tampermonkey)</span>
    </div>

    <div id="tmCsvContent" style="display:none; padding:10px;">

      <label style="font-weight:600;">${t("import")}</label>
      <input type="file" id="tmCsvFile"
             accept=".csv,text/csv"
             class="form-control"
             style="padding:3px; font-size:12px; margin-bottom:8px;" />

      <button id="tmCsvStart" class="btn btn-primary btn-sm w-100">
        ${t("import")}
      </button>

      <div style="margin-top:10px; font-weight:600;">${t("progress")}</div>
      <div class="progress" style="height:16px; background:#eee;">
        <div id="tmCsvImportBar" class="progress-bar"
            style="width:0" aria-valuenow="0"
            aria-valuemin="0" aria-valuemax="100">0%</div>
      </div>

      <div style="margin-top:10px; font-weight:600;">${t("progress")}</div>
      <div class="progress" style="height:16px; background:#eee;">
        <div id="tmCsvProcessBar" class="progress-bar bg-success"
            style="width:0" aria-valuenow="0"
            aria-valuemin="0" aria-valuemax="100">0%</div>
      </div>

      <!-- CSV Hinweis -->
      <div id="tmCsvHint"
          style="margin-top:10px; padding:8px; font-size:11px;
                 background:#eef2f5; border:1px solid #ccc; border-radius:4px; color:#333;">
        <strong>${t("welcome")}</strong><br>
        Jede Zeile muss folgendes Format haben:<br>
        <code>Name;Vorname;Geburtsdatum</code><br>
        Beispiel:<br>
        <code>M\xFCller;Hans;2012-04-18</code><br>
        \u2013 Trennzeichen: <strong>Semikolon</strong><br>
        \u2013 Zeichencodierung: <strong>UTF\u20118</strong><br>
        \u2013 Erste Zeile kann optional eine Kopfzeile sein<br>
      </div>

      <div id="tmCsvLog"
          style="margin-top:10px;height:120px;overflow:auto;
                 font-size:11px;padding:6px;background:#fff;border:1px solid #ccc;">
        Log bereit\u2026
      </div>
    </div>
  `;
    searchInput.after(panel);
    const header = panel.querySelector("#tmCsvHeader");
    const content = panel.querySelector("#tmCsvContent");
    const fileInput = panel.querySelector("#tmCsvFile");
    const startBtn = panel.querySelector("#tmCsvStart");
    const importBar = panel.querySelector("#tmCsvImportBar");
    const processBar = panel.querySelector("#tmCsvProcessBar");
    const logArea = panel.querySelector("#tmCsvLog");
    const logLine = (msg) => {
      logArea.innerHTML += msg + "<br>";
      logArea.scrollTop = logArea.scrollHeight;
    };
    header.addEventListener("click", () => {
      const open = content.style.display !== "none";
      content.style.display = open ? "none" : "block";
      header.innerHTML = open ? '\u25BC CSV\u2011Optionen <span style="color:#777;">(Tampermonkey)</span>' : '\u25B2 CSV\u2011Optionen <span style="color:#777;">(Tampermonkey)</span>';
    });
    startBtn.addEventListener("click", async () => {
      const file = fileInput.files?.[0];
      if (!file) {
        logLine("\u26A0\uFE0F Keine CSV\u2011Datei ausgew\xE4hlt.");
        return;
      }
      logArea.innerHTML = "";
      setProgress(importBar, 0, "Import");
      setProgress(processBar, 0, "Verarbeitung");
      logLine("\u{1F4C4} CSV\u2011Datei: " + file.name);
      const text = await file.text();
      const rawLines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const lines = [...rawLines];
      const totalLines = lines.length;
      logLine("\u{1F4CC} Zeilen erkannt: " + totalLines);
      if (/^name\s*;.*vorname/i.test(lines[0])) lines.shift();
      const chunkSize = 200;
      const targets = [];
      for (let i = 0; i < lines.length; i += chunkSize) {
        const chunk = lines.slice(i, i + chunkSize);
        for (const line of chunk) {
          const [Name = "", Vorname = "", Geburtstag = ""] = line.split(";").map((s) => s.trim());
          targets.push({ Name, Vorname, Geburtstag, _done: false });
        }
        const done = Math.min(rawLines.length, i + chunk.length);
        setProgress(importBar, done / totalLines * 100, "Import");
        await sleep(10);
      }
      logLine(`\u2705 Import abgeschlossen: ${targets.length} Datens\xE4tze`);
      const total = targets.length;
      const step = 200;
      for (let i = 0; i < targets.length; i += step) {
        const done = Math.min(total, i + step);
        setProgress(processBar, done / total * 100, "Verarbeitung");
        await sleep(10);
      }
      logLine("\u{1F7E2} Verarbeitung abgeschlossen (Testmodus, ohne Checkbox\u2011Aktion).");
    });
    log.info("CSV-Panel mounted.");
  }

  // src/features/auto-clean.ts
  var STYLE_ID = "tmAutoCleanStyle";
  var mounted = false;
  var autoConfirm = false;
  var originalConfirm = globalThis.confirm.bind(globalThis);
  function overrideConfirmOnce() {
    globalThis.confirm = (msg) => {
      if (autoConfirm && msg.includes("Position l\xF6schen")) {
        return true;
      }
      return originalConfirm(msg);
    };
  }
  function ensureAutoCleanMounted() {
    if (mounted) return;
    overrideConfirmOnce();
    mounted = true;
    addStyle(
      STYLE_ID,
      `
.tm-badge {
  font-size: 11px;
  color: #777;
  margin-left: .35rem;
}
.tm-subtle-note {
  font-size: 11px;
  color: #888;
  margin-top: 6px;
}
.tm-btn-clean {
  --tm-danger:#c62828;
  color: var(--tm-danger);
  border: 1px solid var(--tm-danger) !important;
  background:#fff;
}
.tm-btn-clean:hover {
  color:#fff !important;
  background:var(--tm-danger) !important;
}
`
    );
    waitFor(selectors.addMembersBtn).then((anchorBtn) => {
      const container = document.createElement("div");
      const cleanBtn = document.createElement("button");
      cleanBtn.id = "tmAutoClean";
      cleanBtn.type = "button";
      cleanBtn.className = "btn w-100 mt-2 tm-btn-clean";
      cleanBtn.innerHTML = `${t("delete")}<span class="tm-badge">(Tampermonkey)</span>`;
      cleanBtn.title = "Von Tampermonkey eingef\xFCgt \u2013 l\xF6scht automatisch ALLE Positionen mit Avatar-Icon / btn-warning.";
      const status = document.createElement("div");
      status.id = "tmCleanStatus";
      status.className = "tm-subtle-note";
      status.textContent = t("progress") + "...";
      container.appendChild(cleanBtn);
      container.appendChild(status);
      anchorBtn.after(container);
      cleanBtn.addEventListener("click", async () => {
        if (!globalThis.confirm("Sollen wirklich ALLE Positionen gel\xF6scht werden?")) {
          status.textContent = t("progress") + ": Abgebrochen.";
          return;
        }
        autoConfirm = true;
        cleanBtn.disabled = true;
        status.textContent = "Suche Positionen\u2026";
        const rows = qsa(selectors.tableRows);
        const candidates = [];
        for (const tr of rows) {
          const hasWarning = tr.querySelector(selectors.rowWarningBtn);
          const delBtn = tr.querySelector(selectors.rowDeleteBtn);
          if (hasWarning && delBtn) {
            candidates.push(delBtn);
          }
        }
        if (candidates.length === 0) {
          status.textContent = "Keine Positionen zu l\xF6schen.";
          cleanBtn.disabled = false;
          autoConfirm = false;
          return;
        }
        status.textContent = `Gefunden: ${candidates.length} \u2013 l\xF6sche\u2026`;
        let done = 0;
        for (const delBtn of candidates) {
          try {
            delBtn.click();
            done++;
            status.textContent = `Gel\xF6scht: ${done}/${candidates.length}`;
            await sleep(120);
          } catch (e) {
            log.warn("Fehler beim L\xF6schen:", e);
          }
        }
        autoConfirm = false;
        status.textContent = `Fertig. Gel\xF6scht: ${done}/${candidates.length}`;
        cleanBtn.disabled = false;
      });
    }).catch(() => {
      log.warn("addMembersBTN nicht gefunden \u2013 Auto-Clean nicht gemountet.");
    });
  }

  // src/config/routes.ts
  function isCollectiveOrderRoute() {
    return location.hash.includes("licenses_collective_order");
  }

  // src/core/bootstrap.ts
  var mo = null;
  var debTimer = null;
  function handleRoute() {
    if (!isCollectiveOrderRoute()) return;
    ensureCsvPanelMounted();
    ensureAutoCleanMounted();
  }
  function initBootstrap() {
    handleRoute();
    window.addEventListener("hashchange", handleRoute);
    mo?.disconnect();
    mo = new MutationObserver(() => {
      clearTimeout(debTimer);
      debTimer = setTimeout(handleRoute, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  // src/main.user.ts
  (async () => {
    await initI18n();
    initBootstrap();
  })();
})();
