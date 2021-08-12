import { setupDomTests, waitForChanges } from '../util';

describe('dom-reattach-clone', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/dom-reattach-clone/index.html');
    await waitForChanges();
  });
  afterEach(tearDownDom);

  const runTest = async (id: string, paragraphs: number) => {
    const component = app.querySelector(`#${id}`);
    const parent = app.querySelector(`#${id}-parent`);
    const button = app.querySelector(`#clone-${id}`) as HTMLButtonElement;
    button.click();
    await waitForChanges();
    button.click();
    await waitForChanges();
    expect(component.querySelectorAll('.component-mark-up').length).toBe(1);
    expect(component.querySelectorAll('p').length).toBe(paragraphs);

    expect(parent.querySelectorAll('.component-mark-up').length).toBe(3);
    expect(parent.querySelectorAll('p').length).toBe(paragraphs * 3);
  };

  it('should not double render', async () => {
    await runTest('simple', 1);
  });

  it('should not double render with deeper slots', async () => {
    await runTest('deep', 2);
  });

  it('should not double render with multiple slots', async () => {
    await runTest('multiple', 3);
  });

  it('should not double render with Host element', async () => {
    await runTest('host', 4);
  });
});
