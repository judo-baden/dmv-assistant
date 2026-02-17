/**
 * Copyright (c) 2026 Badischer Judo Verband e.V.
 * SPDX-License-Identifier: AGPL-3.0
 */

const enabled = true;
const pfx = '[dmva]';

export const log = {
  info: (...a: unknown[]) => enabled && console.info(pfx, ...a),
  warn: (...a: unknown[]) => enabled && console.warn(pfx, ...a),
  error: (...a: unknown[]) => enabled && console.error(pfx, ...a)
};
