import { setupDomTests, waitForChanges } from '../util';

describe('esm-import', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/esm-import/index.html');
  });
  afterEach(tearDownDom);

  it('import', async () => {
    await testEsmImport(app);
  });
});

export async function testEsmImport(app: HTMLElement) {
  const host = app.querySelector('esm-import');

  const hostStyles = window.getComputedStyle(host);
  expect(hostStyles.borderBottomColor).toBe('rgb(0, 0, 255)');

  const h1 = host.shadowRoot.querySelector('h1');
  const h1Styles = window.getComputedStyle(h1);
  expect(h1Styles.color).toBe('rgb(128, 0, 128)');

  const button = host.shadowRoot.querySelector('button');

  const propVal = host.shadowRoot.querySelector('#propVal');
  expect(propVal.textContent.trim()).toBe('propVal: 88');

  const stateVal = host.shadowRoot.querySelector('#stateVal');
  expect(stateVal.textContent.trim()).toBe('stateVal: mph');

  const listenVal = host.shadowRoot.querySelector('#listenVal');
  expect(listenVal.textContent.trim()).toBe('listenVal: 0');

  buttonClick(button);
  await waitForChanges();

  expect(propVal.textContent.trim()).toBe('propVal: 89');
  expect(listenVal.textContent.trim()).toBe('listenVal: 1');

  buttonClick(button);
  await waitForChanges();

  expect(propVal.textContent.trim()).toBe('propVal: 90');
  expect(listenVal.textContent.trim()).toBe('listenVal: 2');

  const isReady = host.shadowRoot.querySelector('#isReady');
  expect(isReady.textContent.trim()).toBe('componentOnReady: true');
}

if (typeof (window as any).CustomEvent !== 'function') {
  // CustomEvent polyfill
  (window as any).CustomEvent = (event: any, data: any) => {
    const evt = document.createEvent('CustomEvent');
    data = data || {};
    evt.initCustomEvent(event, data.bubbles, data.cancelable, data.detail);
    return evt;
  };
  (window as any).CustomEvent.prototype = (window as any).Event.prototype;
}

function buttonClick(button: HTMLButtonElement) {
  const event = new (window as any).CustomEvent('click', { bubbles: true, composed: true } as any);
  button.dispatchEvent(event);
  // button.click();
}
