import { setupDomTests } from '../util';


describe('slot-no-default', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-no-default/index.html');
  });
  afterEach(tearDownDom);


  it('only renders slots that havea location', async () => {
    const elm = app.querySelector('slot-no-default');

    expect(elm.textContent).toContain('Header-No-Show');
    expect(elm.textContent).toContain('Default-Slot-No-Show');
    expect(elm.textContent).toContain('A-Show');
    expect(elm.textContent).toContain('Footer-Show');
    expect(elm.textContent).toContain('Nav-Show');
  });

});
