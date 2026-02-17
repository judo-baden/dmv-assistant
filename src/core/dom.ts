/**
 * Copyright (c) 2026 Badischer Judo Verband e.V.
 * SPDX-License-Identifier: AGPL-3.0
 */

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export function qs<T extends Element = Element>(sel: string, root: ParentNode = document) {
  return root.querySelector<T>(sel);
}
export function qsa<T extends Element = Element>(sel: string, root: ParentNode = document) {
  return Array.from(root.querySelectorAll<T>(sel));
}

export function waitFor<T extends Element = Element>(
  selector: string,
  timeoutMs = 15000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const found = qs<T>(selector);
    if (found) return resolve(found);
    const t0 = Date.now();

    const obs = new MutationObserver(() => {
      const el = qs<T>(selector);
      if (el) {
        obs.disconnect();
        resolve(el);
      } else if (Date.now() - t0 > timeoutMs) {
        obs.disconnect();
        reject(new Error('Timeout waiting for ' + selector));
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  });
}

export function setProgress(el: HTMLElement, value: number, label?: string) {
  const n = Math.max(0, Math.min(100, Math.round(value)));
  el.style.width = n + '%';
  el.setAttribute('aria-valuenow', String(n));
  el.textContent = label ? `${label} ${n}%` : `${n}%`;
}
