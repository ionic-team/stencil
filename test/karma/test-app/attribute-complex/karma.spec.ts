import { setupDomTests, waitForChanges } from '../util';

describe('attribute-complex', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/attribute-complex/index.html');
  });
  afterEach(tearDownDom);

  it('should cast attributes', async () => {
    const el = app.querySelector('attribute-complex') as any;

    el.setAttribute('nu-0', '3');
    el.setAttribute('nu-1', '-2.3');
    el.nu2 = '123';

    el.setAttribute('bool-0', 'false');
    el.setAttribute('bool-1', 'true');
    el.setAttribute('bool-2', '');

    el.setAttribute('str-0', 'false');
    el.setAttribute('str-1', '123');
    el.str2 = 321;

    await waitForChanges();

    const instance = await el.getInstance();
    expect(instance.nu0).toBe(3);
    expect(instance.nu1).toBe(-2.3);
    expect(instance.nu2).toBe(123);

    expect(instance.bool0).toBe(false);
    expect(instance.bool1).toBe(true);
    expect(instance.bool2).toBe(true);

    expect(instance.str0).toBe('false');
    expect(instance.str1).toBe('123');
    expect(instance.str2).toBe('321');
  });

  it('should cast element props', async () => {
    const el = app.querySelector('attribute-complex') as any;
    const instance = await el.getInstance();

    el.nu0 = '1234';
    el.nu1 = '-111.1';

    el.bool0 = 'true';
    el.bool1 = 'false';
    el.bool2 = false;

    await waitForChanges();

    expect(instance.nu0).toBe(1234);
    expect(instance.nu1).toBe(-111.1);

    expect(instance.bool0).toBe(true);
    expect(instance.bool1).toBe(false);
    expect(instance.bool2).toBe(false);

    expect(instance.str0).toBe('hello'); // default value
  });
});
