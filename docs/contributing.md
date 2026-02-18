# Beitrag leisten

Vielen Dank für dein Interesse, zum DMV Assistant beizutragen!

Dieses Projekt soll Entwicklern und Vereinen helfen, Abläufe im DJB‑Portal effizienter zu automatisieren. Beiträge – egal ob Code, Bugreports oder Ideen – sind ausdrücklich willkommen.

## Grundprinzipien
- Kleine, klare Pull Requests
- TypeScript first
- Keine externen Abhängigkeiten, außer sie sind wirklich notwendig
- Selektoren zentral in `config/selectors.ts`
- Nur ein Script-Bundle (`.user.js`)

## Entwickler-Setup

1. Repository klonen
   ```bash
   git clone https://github.com/judo-baden/dmv-assistant.git
   cd dmv-assistant
   ```
2. Abhängigkeiten installieren
   ```bash
   npm install
   ```
3. Development Build
   ```bash
   npm run watch
   ```
4. Release Build
   ```bash
   npm run build
   ```
   Ergebnis: `dist/dmv-assistant.user.js`

## Code-Konventionen
- Strikte Typisierung, keine `any`-Typen ohne zwingenden Grund
- Utility-Funktionen in `core/` wiederverwenden
- Selektoren immer zentral, keine Inline-Selektoren
- Fehlertoleranz: `waitFor()`, MutationObserver mit Debounce
- CSS-Injektion über `core/style.ts`, IDs/Klassen prefixen
- Logging: `log.info()`, `log.warn()`, `log.error()` verwenden
- Keine `console.log()` im Produktionscode

## Tests (optional)
- JSDOM + Jest möglich
- Fokus: CSV-Parser, Matching-Logik, DOM-Rendering

## Bugs melden
- Beschreibung, Erwartung, Seite/URL, Schritte, ggf. Screenshot/Konsolenfehler

## Feature-Vorschläge
- Beschreibung des zu automatisierenden Schritts
- Was soll das Script tun?
- Beispiel-Screenshots/CSV
- Risiko/Sicherheitsaspekte

## pre-commit Hooks
- pre-commit-Konfiguration in `.pre-commit-config.yaml`
- Commitizen für Commit-Message-Prüfung
- Manuelle Ausführung: `pre-commit run --all-files`

## Branching & Pull Requests
- Branch-Naming: `feat/<beschreibung>`, `fix/<beschreibung>`, `refactor/<beschreibung>`
- Vor PR: `npm run build`
- PR ohne dist/
- Commit-Messages auf Englisch

## Lizenz für Beiträge
Mit dem Einreichen eines Beitrags stimmst du zu, deinen Code unter der MIT-Lizenz bereitzustellen.

---

Weitere Hinweise findest du im GitHub-Repository.
