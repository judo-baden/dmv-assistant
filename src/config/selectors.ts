/**
 * Copyright (c) 2026 Badischer Judo Verband e.V.
 * SPDX-License-Identifier: AGPL-3.0
 */

export const selectors = {
  // CSV-Panel
  searchInput:
    '#searchFilter, input[placeholder="Suche"], #membersDIV input.form-control[type="search"]',

  // Auto-Clean
  addMembersBtn: '#addMembersBTN',
  tableRows: 'table tbody tr',
  rowWarningBtn: 'button.btn-warning',
  rowDeleteBtn: 'button[data-deletelicenseposition]'
} as const;
