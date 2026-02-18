# Entwicklung

## Voraussetzungen
- Node.js ≥ 18
- npm

## Setup

```bash
npm install
```

## Build ausführen

```bash
npm run build
```

Ergebnis: `dist/dmv-assistant.user.js`

## Watch‑Modus

```bash
npm run watch
```

Build wird automatisch bei jeder Änderung in `src/` ausgeführt.

---

## Projektstruktur

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

## Build-System (esbuild)

- Einzelnes IIFE‑Bundle, Tampermonkey-kompatibel
- Userscript‑Header über `banner` eingebunden
- Keine dynamischen Imports
- Single-File-Output
