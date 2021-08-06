import { newE2EPage } from '@stencil/core/testing';

describe('@Mixin', () => {
  it('should mixin properties', async () => {
    const page = await newE2EPage({
      html: `
      <mixin-cmp></mixin-cmp>
    `,
    });

    const elm = await page.find('mixin-cmp div');
    expect(elm).toEqualText('Jonny B Good');

    await page.$eval('mixin-cmp', (elm: any) => {
      // test that ionic button properties have mixed in
      elm.routerDirection = 'forward';
    });
  });

  it('should mixin methods', async () => {
    const page = await newE2EPage({
      html: `
      <mixin-cmp></mixin-cmp>
    `,
    });

    const elm = await page.find('mixin-cmp');
    const methodRtnValue = await elm.callMethod('surnameWithTitle');

    expect(methodRtnValue).toBe('Mr Good');
  });

  it('should mixin anything', async () => {
    const page = await newE2EPage({
      html: `
      <mixin-cmp></mixin-cmp>
    `,
    });

    const div = await page.find('mixin-cmp div');
    const divStyle = await div.getComputedStyle();

    expect(divStyle.backgroundColor).toBe('rgba(0, 0, 255, 0.1)');
  });
});
