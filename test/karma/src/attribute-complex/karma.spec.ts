import { setupDomTests } from '../util';


describe('attribute-complex', function() {
  const { setupDom, tearDownDom, flush } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/attribute-complex/index.html');
  });
  afterEach(tearDownDom);

  it('should cast attributes', async () => {
    const el = app.querySelector('attribute-complex') as any;

    el.setAttribute('nu-0', '3');
    el.setAttribute('nu-1', '-2.3');

    el.setAttribute('bool-0', 'false');
    el.setAttribute('bool-1', 'true');
    el.setAttribute('bool-2', '');

    el.setAttribute('str-0', 'false');
    el.setAttribute('str-1', '123');

    await flush(app);

    const instance = el.getInstance();
    expect(instance.nu0).toBe(3);
    expect(instance.nu1).toBe(-2.3);

    expect(instance.bool0).toBe(false);
    expect(instance.bool1).toBe(true);
    expect(instance.bool2).toBe(true);

    expect(instance.str0).toBe('false');
    expect(instance.str1).toBe('123');
  });

  it('should cast element props', async () => {
    const el = app.querySelector('attribute-complex') as any;
    const instance = el.getInstance();

    el.nu0 = '1234';
    el.nu1 = '-111.1';

    el.bool0 = 'true';
    el.bool1 = 'false';
    el.bool2 = false;

    await flush(app);

    expect(instance.nu0).toBe(1234);
    expect(instance.nu1).toBe(-111.1);

    expect(instance.bool0).toBe(true);
    expect(instance.bool1).toBe(false);
    expect(instance.bool2).toBe(false);

    expect(instance.str0).toBe('hello'); // default value
  });
});
