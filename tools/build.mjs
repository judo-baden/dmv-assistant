import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const header = readFileSync('./tools/header.template.js', 'utf8');

await build({
  entryPoints: ['src/main.user.ts'],
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  outfile: 'dist/dmv-assistant.user.js',
  banner: { js: header },
  logLevel: 'info'
});

console.log('✔ dist/dmv-assistant.user.js erstellt');
