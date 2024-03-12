import { setupDomTests, waitForChanges } from '../util';

describe('attribute-boolean', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/attribute-boolean/index.html');
  });
  afterEach(tearDownDom);

  it('button click rerenders', async () => {
    const root = app.querySelector('attribute-boolean-root');
    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.getAttribute('fixedtrue')).toBe('true');
    expect(root.getAttribute('fixedfalse')).toBe('false');
    expect(root.getAttribute('readonly')).toBe(null);
    expect(root.getAttribute('tappable')).toBe(null);
    expect(root.getAttribute('str')).toBe(null);
    expect(root.getAttribute('no-appear')).toBe(null);
    expect(root.getAttribute('no-appear-two')).toBe(null);

    const child = root.querySelector('attribute-boolean');
    expect(child.getAttribute('aria-hidden')).toBe('false');
    expect(child.getAttribute('str-state')).toBe('false');
    expect(child.getAttribute('bool-state')).toBe(null);
    expect(child.getAttribute('noreflect')).toBe(null);
    expect(child.getAttribute('tappable')).toBe(null);

    const button = app.querySelector('button');
    button.click();

    await waitForChanges();

    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.getAttribute('fixedtrue')).toBe('true');
    expect(root.getAttribute('fixedfalse')).toBe('false');
    expect(root.getAttribute('readonly')).toBe('');
    expect(root.getAttribute('tappable')).toBe('');
    expect(root.getAttribute('str')).toBe('hello');
    expect(root.getAttribute('no-appear')).toBe(null);
    expect(root.getAttribute('no-appear-two')).toBe(null);

    expect(child.getAttribute('aria-hidden')).toBe('true');
    expect(child.getAttribute('str-state')).toBe('true');
    expect(child.getAttribute('bool-state')).toBe('');
    expect(child.getAttribute('noreflect')).toBe(null);
    expect(child.getAttribute('tappable')).toBe('');
  });
});
