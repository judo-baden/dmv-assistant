const enabled = true;
const pfx = '[dmva]';

export const log = {
  info: (...a: unknown[]) => enabled && console.info(pfx, ...a),
  warn: (...a: unknown[]) => enabled && console.warn(pfx, ...a),
  error: (...a: unknown[]) => enabled && console.error(pfx, ...a)
};
