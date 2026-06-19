import path from 'path';

/** Central Allure paths — single source of truth */
export const ALLURE_PATHS = {
  resultsDir: path.resolve(process.cwd(), 'allure-results'),
  reportDir: path.resolve(process.cwd(), 'allure-report'),
  historyDir: path.resolve(process.cwd(), 'allure-report', 'history'),
  categoriesFile: path.resolve(process.cwd(), 'reporting', 'allure', 'categories.json'),
} as const;

/** Default reporter options passed to allure-playwright */
export const ALLURE_REPORTER_OPTIONS = {
  resultsDir: 'allure-results',
  detail: true,
  suiteTitle: true,
} as const;
