import { setupDomTests } from '../util';

describe('slot replace wrapper', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-replace-wrapper/index.html');
  });
  afterEach(tearDownDom);

  it('renders A', async () => {
    const result = app.querySelector('.results1 a');
    expect(result.textContent.trim()).toBe('A');
    expect(result.children[0].textContent.trim()).toBe('A');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

  it('renders B', async () => {
    const result = app.querySelector('.results2 a');
    expect(result.textContent.trim()).toBe('B');
    expect(result.children[0].children[0].textContent.trim()).toBe('B');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

  it('renders C', async () => {
    const result = app.querySelector('.results3 a');
    expect(result.textContent.trim()).toBe('C');
    expect(result.children[0].children[0].children[0].textContent.trim()).toBe('C');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

  it('renders ABC from ABC', async () => {
    const result = app.querySelector('.results4 a');
    expect(result.textContent.trim()).toBe('ABC');
    expect(result.children[0].textContent.trim()).toBe('A');
    expect(result.children[1].children[0].textContent.trim()).toBe('B');
    expect(result.children[1].children[1].children[0].textContent.trim()).toBe('C');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

  it('renders ABC from BCA', async () => {
    const result = app.querySelector('.results5 a');
    expect(result.textContent.trim()).toBe('ABC');
    expect(result.children[0].textContent.trim()).toBe('A');
    expect(result.children[1].children[0].textContent.trim()).toBe('B');
    expect(result.children[1].children[1].children[0].textContent.trim()).toBe('C');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

  it('renders ABC from CAB', async () => {
    const result = app.querySelector('.results6 a');
    expect(result.textContent.trim()).toBe('ABC');
    expect(result.children[0].textContent.trim()).toBe('A');
    expect(result.children[1].children[0].textContent.trim()).toBe('B');
    expect(result.children[1].children[1].children[0].textContent.trim()).toBe('C');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

  it('renders A1A2B1B2C1C2 from A1A2B1B2C1C2', async () => {
    const result = app.querySelector('.results7 a');
    expect(result.textContent.trim()).toBe('A1A2B1B2C1C2');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });

  it('renders A1A2B1B2C1C2 from A1A2B1B2C1C2', async () => {
    const result = app.querySelector('.results8 a');
    expect(result.textContent.trim()).toBe('A1A2B1B2C1C2');
    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
