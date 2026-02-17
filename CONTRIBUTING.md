# Mitarbeit am DMV Assistant

Vielen Dank für dein Interesse, zum **DMV Assistant** beizutragen!
Dieses Projekt soll Entwicklern und Vereinen helfen, Abläufe im DJB‑Portal effizienter zu automatisieren.
Beiträge – egal ob Code, Bugreports oder Ideen – sind ausdrücklich willkommen.

---

## 🧭 Grundprinzipien

- **Kleine, klare PRs**
  Lieber mehrere kleine Pull Requests statt eines sehr großen.
- **TypeScript first**
  Alle neuen Funktionen bitte in TypeScript (`src/`) schreiben.
- **Keine externen Abhängigkeiten**, außer sie sind wirklich notwendig.
- **Robust gegen DOM-Änderungen**
  Selektoren sollen zentral in `config/selectors.ts` gepflegt werden.
- **Nur ein Script-Bundle**
  Alles muss letztlich in eine `.user.js` Datei gebündelt werden.

---

## 🛠️ Setup für Entwickler:innen

### 1. Repository klonen

```bash
git clone https://github.com/judo-baden/dmv-assistant.git
cd dmv-assistant
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Development Build

```bash
npm run watch
```

Dieser Modus baut das Script automatisch bei jeder Änderung.

### 4. Release Build

```bash
npm run build
```

Ergebnis liegt in:

```
dist/dmv-assistant.user.js
```

---

## 🔍 Code-Konventionen

### TypeScript
- Strikte Typisierung (`strict: true`)
- Keine `any`‑Typen ohne zwingenden Grund
- Utility‑Funktionen in `core/` wiederverwenden

### DOM-Hooks
- Keine Inline‑Selektoren im Feature‑Code
- Immer `selectors.ts` verwenden
- Fehlertoleranz:
  - `waitFor()` verwenden, wenn Elemente verzögert geladen werden
  - MutationObserver (Bootstrap) nutzt Debounce

### Styling
- CSS-Injektion über `addStyle()` aus `core/style.ts`
- IDs und Klassen immer prefixen: `#tm...`, `.tm-...`

### Logging
- `log.info()`, `log.warn()`, `log.error()` verwenden
- Keine `console.log()` im Produktionscode (Ausnahme: Debug-Phasen)

---

## 🧪 Tests (optional)

Falls du Tests ergänzen möchtest:

- JSDOM + Jest möglich
- Fokus auf:
  - CSV‑Parser
  - Matching‑Logik (wenn ergänzt)
  - DOM‑Rendering (unitär, nicht integriert)

Ein offizielles Test‑Setup kann später ergänzt werden.

---

## 🐛 Bugs melden

Bitte im GitHub‑Issue eine kurze Beschreibung angeben:

- Was passiert?
- Was hast du erwartet?
- Seite/URL + Hash
- Schritte zum Reproduzieren
- Ggf. Screenshot oder Konsolen‑Fehler

---

## 🌟 Feature-Vorschläge

Neue Automatisierungen sind willkommen!

Bitte beschreibe:

1. Welcher Schritt im DJB‑Portal verbessert werden soll
2. Was das Script automatisch tun soll
3. Beispiel‑Screenshots oder CSV‑Beispiele
4. Risiko / Sicherheitsaspekte

---

## 🧹 pre-commit Hooks

Dieses Repository verwendet [pre-commit](https://pre-commit.com/) zur automatischen Code-Qualitätssicherung. Die Konfiguration findest du in der Datei [.pre-commit-config.yaml](.pre-commit-config.yaml).

**Installation und Aktivierung:**

```bash
pip install pre-commit  # oder: brew install pre-commit
pre-commit install
```

Danach werden die definierten Checks automatisch vor jedem Commit ausgeführt. Bitte stelle sicher, dass alle Checks erfolgreich durchlaufen, bevor du einen Commit erstellst.

**Wichtig:** Für die Commit-Message-Prüfung wird zusätzlich [commitizen](https://commitizen-tools.github.io/commitizen/) benötigt. Installiere es im Projekt mit:

```bash
npm install --save-dev commitizen
```

**Manuelle Prüfung der Commit-Messages:**

Um eine Commit-Message manuell zu prüfen, schreibe sie zunächst in eine Datei (z.B. .git/COMMIT_EDITMSG):

```bash
echo "fix(csv): handle empty rows correctly" > .git/COMMIT_EDITMSG
pre-commit run commitizen --hook-stage commit-msg --commit-msg-filename .git/COMMIT_EDITMSG
```

Damit wird geprüft, ob die Commit-Message dem Standard entspricht.

**Manuelle Ausführung aller pre-commit-Hooks:**

Um alle pre-commit-Hooks für das gesamte Repository (alle Dateien) manuell auszuführen, verwende:

```bash
pre-commit run --all-files
```

Das ist z.B. sinnvoll, um vor einem größeren Commit oder nach Refactorings sicherzustellen, dass alle Checks erfolgreich sind.

---

## 🧹 Branching & Pull Requests

- Branch‑Naming:
  - `feat/<beschreibung>`
  - `fix/<beschreibung>`
  - `refactor/<beschreibung>`
- Vor PR:
  ```bash
  npm run build
  ```
- PR bitte **ohne dist/** (wird nicht committed)
- **Commit-Messages müssen ausschließlich auf Englisch verfasst werden!**
  - Beispiel: `fix(csv): handle empty rows correctly`

---

## 📄 Lizenz

Mit dem Einreichen eines Beitrags stimmst du zu, deinen Code unter der MIT‑Lizenz bereitzustellen.

Vielen Dank an alle, die das Projekt weiterentwickeln!
