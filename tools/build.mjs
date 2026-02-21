import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const header = readFileSync('./tools/header.template.js', 'utf8')
  .replace(/(@version\s+)\S+.*/, `$1${pkg.version}`);

await build({
  entryPoints: ['src/main.user.ts'],
  bundle: true,
  format: 'iife',
  target: ['es2022'],
  outfile: 'dist/dmv-assistant.user.js',
  banner: { js: header },
  logLevel: 'info'
});

console.log('✔ dist/dmv-assistant.user.js erstellt');
