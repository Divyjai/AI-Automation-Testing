import os from 'os';
import { execSync } from 'child_process';
import type { EnvironmentInfo } from 'allure-js-commons/sdk/types';
import { env } from '../../config/env.config';

function safeExec(command: string): string | undefined {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return undefined;
  }
}

function resolveGitBranch(): string | undefined {
  return (
    process.env.GITHUB_HEAD_REF ??
    process.env.GITHUB_REF_NAME ??
    safeExec('git rev-parse --abbrev-ref HEAD')
  );
}

function resolveGitCommit(): string | undefined {
  const shortSha = process.env.GITHUB_SHA?.slice(0, 7);
  return shortSha ?? safeExec('git rev-parse --short HEAD');
}

/**
 * Builds dynamic environment info shown in the Allure Environment widget.
 * Values are populated from CI env vars when available, with local fallbacks.
 */
export function buildAllureEnvironment(browserName = 'chromium'): EnvironmentInfo {
  const playwrightVersion =
    process.env.PLAYWRIGHT_VERSION ??
    safeExec('npx playwright --version')?.replace('Version ', '');

  return {
    Browser: browserName,
    OS: `${os.type()} ${os.release()} (${os.arch()})`,
    'Node.js': process.version,
    Playwright: playwrightVersion,
    Environment: env.environment,
    'Base URL': env.baseUrl,
    Branch: resolveGitBranch(),
    Commit: resolveGitCommit(),
    'Build Number':
      process.env.GITHUB_RUN_NUMBER ??
      process.env.BUILD_NUMBER ??
      process.env.CI_BUILD_ID,
    CI: process.env.CI ? 'true' : 'false',
    Headless: String(env.headless),
  };
}
