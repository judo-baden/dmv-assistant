/**
 * Copyright (c) 2026 Badischer Judo Verband e.V.
 * SPDX-License-Identifier: AGPL-3.0
 */

export function addStyle(id: string, css: string) {
  const existing = document.getElementById(id);
  if (existing) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}
