import { test } from '../../../fixtures/amazon.fixture';

/** Serial execution + pause between tests to reduce Amazon rate-limiting */
test.describe.configure({ mode: 'serial' });

test.beforeEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
});
