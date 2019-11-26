import { setupDomTests, waitForChanges } from '../util';


fdescribe('dom-reattach-clone', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/dom-reattach-clone/index.html');
    await waitForChanges();
  });
  afterEach(tearDownDom);

  const runTest = async (id: string) => {
    const component = app.querySelector(`#${id}`);
    const button = app.querySelector(`#toggle-${id}`) as HTMLButtonElement;
    button.click();
    await waitForChanges();
    button.click();
    await waitForChanges();
    expect(component.querySelectorAll('.component-mark-up').length).toBe(1);
  };

  it('should not double render', async () => {
    await runTest('simple');
  });

  it('should not double render with deeper slots', async () => {
    await runTest('deep');
  });

  it('should not double render with multiple slots', async () => {
    await runTest('multiple');
  });

  it('should not double render with Host element', async () => {
    await runTest('host');
  });
});
