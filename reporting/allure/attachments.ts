import fs from 'fs';
import path from 'path';
import {
  attachment,
  attachmentPath,
  ContentType,
  logStep,
} from 'allure-js-commons';
import type { Page, TestInfo } from '@playwright/test';

export type ApiCallRecord = {
  method: string;
  url: string;
  status?: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  timestamp: string;
};

const API_RESOURCE_TYPES = new Set(['xhr', 'fetch']);

function headersToRecord(headers: { name: string; value: string }[]): Record<string, string> {
  return Object.fromEntries(headers.map((h) => [h.name, h.value]));
}

/** Track XHR/fetch calls for optional attachment on failure */
export function createApiTracker(page: Page): ApiCallRecord[] {
  const records: ApiCallRecord[] = [];
  const pending = new Map<string, Partial<ApiCallRecord>>();

  page.on('request', (request) => {
    if (!API_RESOURCE_TYPES.has(request.resourceType())) {
      return;
    }

    pending.set(request.url(), {
      method: request.method(),
      url: request.url(),
      requestHeaders: request.headers(),
      requestBody: request.postData() ?? undefined,
      timestamp: new Date().toISOString(),
    });
  });

  page.on('response', async (response) => {
    const url = response.url();
    const base = pending.get(url);
    if (!base) {
      return;
    }

    let responseBody: string | undefined;
    try {
      const contentType = response.headers()['content-type'] ?? '';
      if (/json|text|xml|html/i.test(contentType)) {
        responseBody = (await response.text()).slice(0, 4000);
      }
    } catch {
      responseBody = undefined;
    }

    records.push({
      ...base,
      method: base.method ?? response.request().method(),
      url,
      status: response.status(),
      responseHeaders: response.headers(),
      responseBody,
      timestamp: base.timestamp ?? new Date().toISOString(),
    } as ApiCallRecord);

    pending.delete(url);
  });

  return records;
}

export async function attachText(name: string, content: string): Promise<void> {
  await attachment(name, content, ContentType.TEXT);
}

export async function attachJson(name: string, data: unknown): Promise<void> {
  await attachment(name, JSON.stringify(data, null, 2), ContentType.JSON);
}

export async function attachApiCalls(records: ApiCallRecord[]): Promise<void> {
  if (records.length === 0) {
    return;
  }
  await attachJson('API Request/Response Log', records);
}

export async function attachTestContext(testInfo: TestInfo, page: Page): Promise<void> {
  await attachText('Test Context', [
    `Title: ${testInfo.title}`,
    `File: ${testInfo.file}`,
    `Project: ${testInfo.project.name}`,
    `Status: ${testInfo.status}`,
    `Retry: ${testInfo.retry}`,
    `Duration: ${testInfo.duration}ms`,
    `URL: ${page.url()}`,
  ].join('\n'));
}

export async function attachPlaywrightArtifacts(testInfo: TestInfo): Promise<void> {
  for (const attachmentInfo of testInfo.attachments) {
    if (!attachmentInfo.path || !fs.existsSync(attachmentInfo.path)) {
      continue;
    }

    const ext = path.extname(attachmentInfo.path).toLowerCase();
    const contentType =
      ext === '.png'
        ? ContentType.PNG
        : ext === '.webm'
          ? ContentType.WEBM
          : ext === '.zip'
            ? ContentType.ZIP
            : ContentType.TEXT;

    await attachmentPath(attachmentInfo.name, attachmentInfo.path, {
      contentType,
    });
  }
}

export async function attachTraceIfPresent(testInfo: TestInfo): Promise<void> {
  const trace = testInfo.attachments.find((a) => a.name === 'trace');
  if (trace?.path && fs.existsSync(trace.path)) {
    await attachmentPath('Playwright Trace', trace.path, {
      contentType: ContentType.PLAYWRIGHT_TRACE,
    });
  }
}

export async function logStepMessage(message: string): Promise<void> {
  await logStep(message);
}
