export { ALLURE_PATHS, ALLURE_REPORTER_OPTIONS } from './config';
export { buildAllureEnvironment } from './environment';
export { ALLURE_CATEGORIES } from './categories';
export {
  applyTestMetadata,
  annotateTest,
  extractTagsFromTitle,
  metadataFromTestInfo,
  type TestMetadata,
} from './metadata';
export { Severity } from 'allure-js-commons';
export {
  attachApiCalls,
  attachJson,
  attachPlaywrightArtifacts,
  attachTestContext,
  attachText,
  attachTraceIfPresent,
  createApiTracker,
  logStepMessage,
  type ApiCallRecord,
} from './attachments';
