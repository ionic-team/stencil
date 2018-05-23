import { setupDomTests, flush } from '../util';

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
  const elm = app.querySelector('esm-import');
  const button = app.querySelector('button');

  const propVal = elm.querySelector('#propVal');
  expect(propVal.textContent.trim()).toBe('propVal: 88');

  const stateVal = elm.querySelector('#stateVal');
  expect(stateVal.textContent.trim()).toBe('stateVal: mph');

  const listenVal = elm.querySelector('#listenVal');
  expect(listenVal.textContent.trim()).toBe('listenVal: 0');

  button.click();
  await flush(app);

  expect(propVal.textContent.trim()).toBe('propVal: 89');
  expect(listenVal.textContent.trim()).toBe('listenVal: 1');

  button.click();
  await flush(app);

  expect(propVal.textContent.trim()).toBe('propVal: 90');
  expect(listenVal.textContent.trim()).toBe('listenVal: 2');

  const isReady = elm.querySelector('#isReady');
  expect(isReady.textContent.trim()).toBe('componentOnReady: true');
}
