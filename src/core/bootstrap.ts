import { ensureCsvPanelMounted } from '../features/csv-panel';
import { ensureAutoCleanMounted } from '../features/auto-clean';
import { isCollectiveOrderRoute } from '../config/routes';

let mo: MutationObserver | null = null;
let debTimer: any = null;

function handleRoute() {
  if (!isCollectiveOrderRoute()) return;
  ensureCsvPanelMounted();
  ensureAutoCleanMounted();
}

export function initBootstrap() {
  // Initial
  handleRoute();

  // Reagiert auf Hashwechsel (SPA Router)
  window.addEventListener('hashchange', handleRoute);

  // Reagiert auf DOM-Updates (z. B. Async Render)
  mo?.disconnect();
  mo = new MutationObserver(() => {
    clearTimeout(debTimer);
    debTimer = setTimeout(handleRoute, 120);
  });
  mo.observe(document.body, { childList: true, subtree: true });
}
