import { setupDomTests, waitForChanges } from '../util';

describe('reflect-to-attr', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/reflect-to-attr/index.html');
  });
  afterEach(tearDownDom);

  it('should have proper attributes', async () => {
    const cmp = app.querySelector('reflect-to-attr') as any;

    expect(cmp.getAttribute('str')).toEqual('single');
    expect(cmp.getAttribute('nu')).toEqual('2');
    expect(cmp.getAttribute('undef')).toEqual(null);
    expect(cmp.getAttribute('null')).toEqual(null);
    expect(cmp.getAttribute('bool')).toEqual(null);
    expect(cmp.getAttribute('other-bool')).toEqual('');

    cmp.str = 'second';
    cmp.nu = -12.2;
    cmp.undef = 'no undef';
    cmp.null = 'no null';
    cmp.bool = true;
    cmp.otherBool = false;

    await waitForChanges();

    expect(cmp.getAttribute('str')).toEqual('second');
    expect(cmp.getAttribute('nu')).toEqual('-12.2');
    expect(cmp.getAttribute('undef')).toEqual('no undef');
    expect(cmp.getAttribute('null')).toEqual('no null');
    expect(cmp.getAttribute('bool')).toEqual('');
    expect(cmp.getAttribute('other-bool')).toEqual(null);

    expect(cmp.getAttribute('dynamic-str')).toEqual('value');
    expect(cmp.getAttribute('dynamic-nu')).toEqual('123');
  });

  it('should reflect booleans property', async () => {
    const cmp = app.querySelector('reflect-to-attr') as any;
    expect(cmp.disabled).toBe(false);

    const toggle = app.querySelector('#toggle') as any;
    toggle.click();
    await waitForChanges();
    expect(cmp.disabled).toBe(true);

    toggle.click();
    await waitForChanges();
    expect(cmp.disabled).toBe(false);
  });
});
