import {
  epic,
  feature,
  story,
  severity,
  owner,
  tag,
  tags,
  issue,
  tms,
  testCaseId,
  historyId,
  parameter,
  label,
  LabelName,
  Severity,
} from 'allure-js-commons';
import type { TestInfo } from '@playwright/test';

export type TestMetadata = {
  epic?: string;
  feature?: string;
  story?: string;
  severity?: Severity | string;
  owner?: string;
  tags?: string[];
  issue?: { url: string; name?: string };
  tms?: { url: string; name?: string };
  testCaseId?: string;
  historyId?: string;
  parameters?: Record<string, string>;
};

const TAG_PATTERN = /@([\w-]+)/g;

/** Extract Playwright-style tags from test title (e.g. @regression @positive) */
export function extractTagsFromTitle(title: string): string[] {
  return [...title.matchAll(TAG_PATTERN)].map((match) => match[1]);
}

/** Derive suite metadata from spec file path */
export function metadataFromTestInfo(testInfo: TestInfo): Partial<TestMetadata> {
  const relative = testInfo.file.replace(/\\/g, '/');
  const parts = relative.split('/tests/')[1]?.split('/') ?? [];
  const suite = parts[0] ?? 'amazon-in';
  const folder = parts[1] ?? 'general';
  const fileName = parts.at(-1)?.replace('.spec.ts', '') ?? testInfo.title;

  return {
    epic: 'Amazon.in',
    feature: `${suite} / ${folder}`,
    story: fileName,
    tags: extractTagsFromTitle(testInfo.title),
  };
}

/** Apply Allure labels, links, and parameters to the current test */
export async function applyTestMetadata(meta: TestMetadata): Promise<void> {
  if (meta.epic) await epic(meta.epic);
  if (meta.feature) await feature(meta.feature);
  if (meta.story) await story(meta.story);
  if (meta.severity) await severity(meta.severity);
  if (meta.owner) await owner(meta.owner);
  if (meta.testCaseId) await testCaseId(meta.testCaseId);
  if (meta.historyId) await historyId(meta.historyId);

  if (meta.tags?.length) {
    await tags(...meta.tags);
  }

  if (meta.issue) {
    await issue(meta.issue.url, meta.issue.name);
  }

  if (meta.tms) {
    await tms(meta.tms.url, meta.tms.name);
  }

  if (meta.parameters) {
    for (const [name, value] of Object.entries(meta.parameters)) {
      await parameter(name, value);
    }
  }
}

/** Apply metadata inferred from test info plus optional overrides */
export async function annotateTest(
  testInfo: TestInfo,
  overrides: TestMetadata = {}
): Promise<void> {
  const inferred = metadataFromTestInfo(testInfo);
  await applyTestMetadata({ ...inferred, ...overrides });

  await label(LabelName.FRAMEWORK, 'Playwright');
  await label(LabelName.LANGUAGE, 'TypeScript');
  await label(LabelName.PACKAGE, testInfo.file.split(/[/\\]/).slice(-3, -1).join('.'));
  await tag(testInfo.project.name);
}
