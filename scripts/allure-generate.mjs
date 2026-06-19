#!/usr/bin/env node
/**
 * Full Allure report workflow:
 * 1. Prepare history + executor metadata
 * 2. Generate HTML report with trends and categories
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('node', [path.join(__dirname, 'allure-prepare.mjs')]);
run('npx', ['allure', 'generate', 'allure-results', '--clean', '-o', 'allure-report']);

console.log('[allure] Report generated at allure-report/index.html');
