import { type E2EPage, newE2EPage } from '@stencil/core/testing';

describe('do not throw page already closed if page was defined in before(All) hook', () => {
  let page: E2EPage;

  beforeAll(async () => {
    page = await newE2EPage();
  });

  it('first test', async () => {
    const p = await page.find('html');
    expect(p).not.toBeNull();
  });

  it('second test', async () => {
    const p = await page.find('html');
    expect(p).not.toBeNull();
  });
});
