# Installation

## Voraussetzungen
- Tampermonkey (Browser-Erweiterung für Chrome, Edge, Firefox, ...)
- Node.js ≥ 18 und npm (nur für Entwicklung notwendig)

## Schritt-für-Schritt-Anleitung

### 1. Tampermonkey installieren
- [https://www.tampermonkey.net/](https://www.tampermonkey.net/)

### 2. Userscript installieren
- Öffne die Datei [`dmv-assistant.user.js`](https://judo-baden.github.io/dmv-assistant/dmv-assistant.user.js)
- Tampermonkey fragt automatisch: „Script installieren?“

### 3. Updates
- Das Script unterstützt automatische Updates über den `@updateURL`-Header (bei GitHub-Hosting)

---

## Lokale Entwicklung

```bash
npm install
npm run build
```

Das gebaute Script findest du anschließend unter `dist/dmv-assistant.user.js`.
