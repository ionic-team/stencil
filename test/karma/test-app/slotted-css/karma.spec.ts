import { setupDomTests } from '../util';

describe('slotted css', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slotted-css/index.html');
  });
  afterEach(tearDownDom);

  it('assign slotted css', async () => {
    const elm = app.querySelector('slotted-css');

    const redElm = elm.querySelector('.red');
    const redStyles = window.getComputedStyle(redElm);
    expect(redStyles.color).toEqual('rgb(255, 0, 0)');

    // green background, blue border and color
    const greenElm = elm.querySelector('.green');
    const greenStyles = window.getComputedStyle(greenElm);
    expect(greenStyles.backgroundColor).toEqual('rgb(0, 255, 0)');
    expect(greenStyles.color).toEqual('rgb(0, 0, 255)');

    const blueElm = elm.querySelector('.blue');
    const blueStyles = window.getComputedStyle(blueElm);
    expect(blueStyles.color).toEqual('rgb(0, 0, 255)');
  });
});
