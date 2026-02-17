# DMV Assistant (Tampermonkey)

Der **DMV Assistant** ist ein Tampermonkey-Userscript zur **Automatisierung** und **Vereinfachung** von Abläufen im
**DJB‑Portal** (`https://djb.dokume.app/`).
Es kombiniert zwei Hauptfunktionen:

1. **CSV‑Import mit Fortschrittsanzeige**
   - Ein-Klick‑Import von Sammelbestell‑Datensätzen
   - Fortschrittsbalken (Import & Verarbeitung)
   - Dark/Light‑Theme-Unterstützung
   - Stabil dank Anti‑Duplikat‑Mounting + SPA‑Routing‑Erkennung

2. **Automatische Bereinigung von Lizenzbestellungen**
   - Löscht alle problematischen Positionen (`btn-warning`)
   - Nur *eine* Bestätigung, danach automatische Systempopup‑Bejahung
   - Fortschrittsanzeige und Sicherheitsmechanismen

Das Projekt ist vollständig in **TypeScript** umgesetzt und wird mit **esbuild** in eine einzige `*.user.js`‑Datei gebündelt.

---

## ✨ Features im Überblick

### CSV‑Import
- Auswahl einer CSV-Datei direkt im Portal
- Chunk‑Verarbeitung (UI bleibt responsiv)
- Fortschrittsbalken für Import und Verarbeitung
- Log‑Ausgabe
- Info‑Panel zum CSV‑Format
- Automatisches Remounting auf SPA‑Seiten

### Auto‑Bereinigung
- Ein-Klick: Alle fehlerhaften Positionen löschen
- Erkennbare Buttons (Avatar/Icon mit `btn-warning`)
- Automatische Bestätigung der systemeigenen Dialoge
- Fortschrittsanzeige und Statusmeldungen

---

## 🛠️ Installation

1. **Tampermonkey installieren**
   - Chrome, Edge, Firefox: https://www.tampermonkey.net/

2. **Script installieren**
   - `dist/dmv-assistant.user.js` öffnen
   - Tampermonkey fragt automatisch: *„Script installieren?“*

3. **Updates**
   Das Script unterstützt automatische Updates über den `@updateURL` Header
   (falls du das Projekt auf GitHub hostest).

---

## 📦 Entwicklung

### Voraussetzungen
- Node.js ≥ 18
- npm

### Setup

```bash
npm install
```

### Build ausführen

```bash
npm run build
```

Ergebnis:

```
dist/dmv-assistant.user.js
```

### Watch‑Modus

```bash
npm run watch
```

Build wird automatisch bei jeder Änderung in `src/` ausgeführt.

---

## 📁 Projektstruktur

```text
src/
├─ main.user.ts          # Entry-Point für das Userscript
├─ core/
│  ├─ bootstrap.ts       # SPA-Routing, MutationObserver, Remount-Logik
│  ├─ dom.ts             # DOM-Utilities (waitFor, qs, qsa, sleep)
│  ├─ logger.ts          # Logging Wrapper
│  └─ style.ts           # CSS-Injektion
├─ config/
│  ├─ routes.ts          # Routing-Erkennung
│  └─ selectors.ts       # Zentrale DOM-Selektoren
└─ features/
   ├─ csv-panel.ts       # CSV-Import-UI + Parser
   └─ auto-clean.ts      # Automatisches Löschen von Warnungs-Einträgen
```

---

## 🔧 Build-System (esbuild)

`tools/build.mjs` erzeugt ein **einzelnes IIFE‑Bundle**, das vollständig Tampermonkey-kompatibel ist.

Wichtig:
- Userscript‑Header über `banner` eingebunden
- Keine dynamischen Imports
- Single-File-Output

---

## 🤝 Mitarbeit & Feedback

Verbesserungen, Bugreports oder Feature‑Wünsche sind willkommen!
Siehe dazu die Datei **CONTRIBUTING.md**.

---

## 📄 Lizenz

Dieses Projekt steht unter der [GNU Affero General Public License Version 3 (AGPL-3.0)](LICENSE).
