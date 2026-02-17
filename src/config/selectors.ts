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
