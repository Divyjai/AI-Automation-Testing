import { test } from '../../../fixtures/amazon.fixture';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
});
