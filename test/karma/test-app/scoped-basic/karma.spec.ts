import { setupDomTests } from '../util';

describe('scoped-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/scoped-basic/index.html');
  });
  afterEach(tearDownDom);

  it('render', async () => {
    const doc = app.querySelector('scoped-basic-root');
    expect(doc.classList.toString()).toEqual('sc-scoped-basic-root-md-h sc-scoped-basic-root-md-s hydrated');

    const scopedEl = doc.querySelector('scoped-basic');
    expect(scopedEl.classList.toString()).toEqual(
      'sc-scoped-basic-root-md sc-scoped-basic-h sc-scoped-basic-s hydrated',
    );

    const scopedStyles = window.getComputedStyle(scopedEl);
    expect(scopedStyles.backgroundColor).toEqual('rgb(0, 0, 0)');
    expect(scopedStyles.color).toEqual('rgb(128, 128, 128)');

    const scopedDiv = scopedEl.querySelector('div');
    expect(scopedDiv.classList.toString()).toEqual('sc-scoped-basic');
    const scopedDivStyles = window.getComputedStyle(scopedDiv);
    expect(scopedDivStyles.color).toEqual('rgb(255, 0, 0)');

    const scopedP = scopedEl.querySelector('p');
    expect(scopedP.classList.toString()).toEqual('sc-scoped-basic sc-scoped-basic-s');

    const scopedSlot = scopedP.querySelector('span');
    expect(scopedSlot.classList.toString()).toEqual('sc-scoped-basic-root-md');
    expect(scopedSlot.textContent).toEqual('light');
    const scopedSlotStyles = window.getComputedStyle(scopedSlot);
    expect(scopedSlotStyles.color).toEqual('rgb(255, 255, 0)');
  });
});
