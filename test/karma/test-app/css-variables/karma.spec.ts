import { setupDomTests } from '../util';


fdescribe('css-variables', function() {
  const {setupDom, tearDownDom} = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/css-variables/index.html');
  });
  afterEach(tearDownDom);

  it('css variable should work as expected', async () => {

    const root = app.querySelector('css-variables-root');
    expect(root).not.toBeNull();


    const backgroundCheck = app.querySelector('css-variables-root > css-variables > header');
    const headerStyles = window.getComputedStyle(backgroundCheck)

    expect(headerStyles.color).toBe('maroon')
    })

});
