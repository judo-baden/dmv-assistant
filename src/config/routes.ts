/**
 * Copyright (c) 2026 Badischer Judo Verband e.V.
 * SPDX-License-Identifier: AGPL-3.0
 */

export function isCollectiveOrderRoute() {
  return location.hash.includes('licenses_collective_order');
}
