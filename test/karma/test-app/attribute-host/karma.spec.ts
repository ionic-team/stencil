import { setupDomTests, flush } from '../util';


describe('attribute-host', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/attribute-host/index.html');
  });
  afterEach(tearDownDom);

  it('add/remove attrs', async () => {
    const elm = app.querySelector('section');
    const button = app.querySelector('button');

    expect(elm.getAttribute('content')).toBe('attributes removed');
    expect(elm.getAttribute('padding')).toBe('false');
    expect(elm.getAttribute('bold')).toBe('false');
    expect(elm.getAttribute('margin')).toBe(null);
    expect(elm.getAttribute('color')).toBe(null);
    expect(elm.getAttribute('no-attr')).toBe(null);

    expect(elm.style.getPropertyValue('border-color')).toEqual('black');

    // this tests CSS custom properties in inline style, but CSS var are
    // not supported natively in IE11, so let's skip the test
    const win = window as any;
    if (win.CSS && win.CSS.supports && win.CSS.supports('--prop', 'value')) {
      expect(elm.style.getPropertyValue('--css-var')).toEqual('12');
    }

    button.click();
    await flush(app);

    expect(elm.getAttribute('content')).toBe('attributes added');
    expect(elm.getAttribute('padding')).toBe('true');
    expect(elm.getAttribute('bold')).toBe('true');
    expect(elm.getAttribute('margin')).toBe('');
    expect(elm.getAttribute('color')).toBe('lime');
    expect(elm.getAttribute('no-attr')).toBe(null);

    button.click();
    await flush(app);

    expect(elm.getAttribute('content')).toBe('attributes removed');
    expect(elm.getAttribute('padding')).toBe('false');
    expect(elm.getAttribute('bold')).toBe('false');
    expect(elm.getAttribute('margin')).toBe(null);
    expect(elm.getAttribute('color')).toBe(null);
    expect(elm.getAttribute('no-attr')).toBe(null);

    button.click();
    await flush(app);

    expect(elm.getAttribute('content')).toBe('attributes added');
    expect(elm.getAttribute('padding')).toBe('true');
    expect(elm.getAttribute('bold')).toBe('true');
    expect(elm.getAttribute('margin')).toBe('');
    expect(elm.getAttribute('color')).toBe('lime');
    expect(elm.getAttribute('no-attr')).toBe(null);
  });

});
