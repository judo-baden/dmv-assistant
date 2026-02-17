/**
 * Copyright (c) 2026 Badischer Judo Verband e.V.
 * SPDX-License-Identifier: AGPL-3.0
 */

import { initI18n } from './core/i18n';
import { initBootstrap } from './core/bootstrap';

(async () => {
  await initI18n();
  initBootstrap();
})();
