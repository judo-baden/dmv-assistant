/**
 * Copyright (c) 2026 Badischer Judo Verband e.V.
 * SPDX-License-Identifier: AGPL-3.0
 */

import { selectors } from '../config/selectors';
import { waitFor, qsa, sleep } from '../core/dom';
import { addStyle } from '../core/style';
import { log } from '../core/logger';
import { t } from '../core/i18n';

const STYLE_ID = 'tmAutoCleanStyle';
let mounted = false;

// Während des Bereinigungsprozesses: confirm automatisch bejahen
let autoConfirm = false;
const originalConfirm = globalThis.confirm.bind(globalThis);

// TypScript erlaubt Zuweisung, aber wir kapseln es sauber:
function overrideConfirmOnce() {
  (globalThis as any).confirm = (msg: string) => {
    if (autoConfirm && msg.includes('Position löschen')) {
      return true;
    }
    return originalConfirm(msg);
  };
}

export function ensureAutoCleanMounted() {
  if (mounted) return;
  overrideConfirmOnce(); // nur einmal je Page-Lebenszeit
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

  // Warten bis „Mitglied hinzufügen“ existiert
  waitFor<HTMLButtonElement>(selectors.addMembersBtn)
    .then(anchorBtn => {
      const container = document.createElement('div');

      const cleanBtn = document.createElement('button');
      cleanBtn.id = 'tmAutoClean';
      cleanBtn.type = 'button';
      cleanBtn.className = 'btn w-100 mt-2 tm-btn-clean';
      cleanBtn.innerHTML = `${t('delete')}<span class="tm-badge">(Tampermonkey)</span>`;
      cleanBtn.title =
        'Von Tampermonkey eingefügt – löscht automatisch ALLE Positionen mit Avatar-Icon / btn-warning.';

      const status = document.createElement('div');
      status.id = 'tmCleanStatus';
      status.className = 'tm-subtle-note';
      status.textContent = t('progress') + '...';

      container.appendChild(cleanBtn);
      container.appendChild(status);

      anchorBtn.after(container);

      cleanBtn.addEventListener('click', async () => {
        // Nur eine Nachfrage
        if (!globalThis.confirm('Sollen wirklich ALLE Positionen gelöscht werden?')) {
          status.textContent = t('progress') + ': Abgebrochen.';
          return;
        }

        autoConfirm = true; // ab jetzt Systemdialoge auto-bestätigen
        cleanBtn.disabled = true;
        status.textContent = 'Suche Positionen…';

        const rows = qsa<HTMLTableRowElement>(selectors.tableRows);
        const candidates: HTMLButtonElement[] = [];

        for (const tr of rows) {
          const hasWarning = tr.querySelector(selectors.rowWarningBtn);
          const delBtn = tr.querySelector<HTMLButtonElement>(selectors.rowDeleteBtn);
          if (hasWarning && delBtn) {
            candidates.push(delBtn);
          }
        }

        if (candidates.length === 0) {
          status.textContent = 'Keine Positionen zu löschen.';
          cleanBtn.disabled = false;
          autoConfirm = false;
          return;
        }

        status.textContent = `Gefunden: ${candidates.length} – lösche…`;

        let done = 0;
        for (const delBtn of candidates) {
          try {
            delBtn.click();
            done++;
            status.textContent = `Gelöscht: ${done}/${candidates.length}`;
            await sleep(120);
          } catch (e) {
            log.warn('Fehler beim Löschen:', e);
          }
        }

        autoConfirm = false; // Reset
        status.textContent = `Fertig. Gelöscht: ${done}/${candidates.length}`;
        cleanBtn.disabled = false;
      });
    })
    .catch(() => {
      // Anker nicht gefunden (Seite evtl. anders) – kein harter Fehler
      log.warn('addMembersBTN nicht gefunden – Auto-Clean nicht gemountet.');
    });
}
