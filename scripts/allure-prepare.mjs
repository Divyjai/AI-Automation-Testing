#!/usr/bin/env node
/**
 * Prepares allure-results for report generation:
 * - Copies history from previous report (enables trend charts)
 * - Writes executor.json for CI build info
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const RESULTS_DIR = path.join(ROOT, 'allure-results');
const REPORT_DIR = path.join(ROOT, 'allure-report');
const HISTORY_SRC = path.join(REPORT_DIR, 'history');
const HISTORY_DEST = path.join(RESULTS_DIR, 'history');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return false;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
  return true;
}

function writeExecutor() {
  const isCi = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  if (!isCi) {
    return;
  }

  const buildNumber = process.env.GITHUB_RUN_NUMBER ?? process.env.BUILD_NUMBER ?? 'local';
  const repo = process.env.GITHUB_REPOSITORY ?? 'local/qa-automation';
  const serverUrl = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
  const runId = process.env.GITHUB_RUN_ID ?? '0';

  const executor = {
    name: process.env.ALLURE_EXECUTOR_NAME ?? 'GitHub Actions',
    type: process.env.ALLURE_EXECUTOR_TYPE ?? 'github',
    buildOrder: Number(buildNumber),
    buildName: process.env.ALLURE_BUILD_NAME ?? `Run #${buildNumber}`,
    buildUrl: `${serverUrl}/${repo}/actions/runs/${runId}`,
    reportName: process.env.ALLURE_REPORT_NAME ?? 'Amazon.in QA Report',
    reportUrl: process.env.ALLURE_REPORT_URL,
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'executor.json'),
    JSON.stringify(executor, null, 2),
    'utf8'
  );
}

fs.mkdirSync(RESULTS_DIR, { recursive: true });

const copied = copyDir(HISTORY_SRC, HISTORY_DEST);
writeExecutor();

console.log(
  copied
    ? '[allure] History copied — trend charts will include previous runs'
    : '[allure] No prior history found — first run will seed trends'
);
