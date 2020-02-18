import { newE2EPage } from '@stencil/core/testing';

describe('app-root', () => {
  it('renders', async () => {
    const page = await newE2EPage({ url: '/'});

    const element = await page.find('app-root');
    expect(element).toHaveClass('hydrated');
  });

  it('renders an ion-app', async () => {
    const page = await newE2EPage({ url: '/'});

    const element = await page.find('app-root > ion-app');
    expect(element).toHaveClass('hydrated');
  });
});
