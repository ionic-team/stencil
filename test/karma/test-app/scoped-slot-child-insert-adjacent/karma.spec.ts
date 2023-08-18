import { setupDomTests, waitForChanges } from '../util';

describe('scoped-slot-child-insert-adjacent', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/scoped-slot-child-insert-adjacent/index.html');
  });

  afterEach(tearDownDom);

  it('slots elements in for insertAdjacentHtml', async () => {
    const host = app.querySelector('scoped-slot-child-insert-adjacent');
    const parentDiv = host.querySelector('#parentDiv');
    expect(parentDiv).toBeDefined();

    // before we hit the button to call `insertAdjacentHTML`, we should only have one <p> elm
    let paragraphElms = host.querySelectorAll('p');
    const firstParagraph = paragraphElms[0];
    expect(firstParagraph.textContent).toBe('I am slotted and will receive a red background');
    expect(firstParagraph.parentElement).toBe(parentDiv);
    expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');

    // insert an additional <p> elm
    const addButton = app.querySelector<HTMLButtonElement>('#addInsertAdjacentHtml');
    addButton.click();
    await waitForChanges();

    // now we should have 2 <p> elms
    paragraphElms = host.querySelectorAll('p');
    expect(paragraphElms.length).toBe(2);

    // the inserted elm should:
    // 1. have the <div> as it's parent
    // 2. the <div> should have the same style (which gets acquired by both <p> elms)
    const secondParagraph = paragraphElms[1];
    expect(secondParagraph.textContent).toBe('Added via insertAdjacentHTML. I should have a red background.');
    expect(secondParagraph.parentElement).toBe(parentDiv);
    expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');
  });
});
