import { setupDomTests, waitForChanges } from '../util';

describe('scoped-slot-child-insert-adjacent', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);

  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;
  let parentDiv: HTMLDivElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/scoped-slot-child-insert-adjacent/index.html');
    host = app.querySelector('scoped-slot-child-insert-adjacent');
    parentDiv = host.querySelector('#parentDiv');
  });

  afterEach(tearDownDom);

  describe('insertAdjacentHtml', () => {
    it('slots elements w/ "beforeend" position', async () => {
      expect(parentDiv).toBeDefined();

      // before we hit the button to call `insertAdjacentHTML`, we should only have one <p> elm
      let paragraphElms = host.querySelectorAll('p');
      const firstParagraph = paragraphElms[0];
      expect(firstParagraph.textContent).toBe('I am slotted and will receive a red background');
      expect(firstParagraph.parentElement).toBe(parentDiv);
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');

      // insert an additional <p> elm
      const addButton = app.querySelector<HTMLButtonElement>('#addInsertAdjacentHtmlBeforeEnd');
      addButton.click();
      await waitForChanges();

      // now we should have 2 <p> elms
      paragraphElms = host.querySelectorAll('p');
      expect(paragraphElms.length).toBe(2);

      // the inserted elm should:
      // 1. have the <div> as it's parent
      // 2. the <div> should have the same style (which gets acquired by both <p> elms)
      const secondParagraph = paragraphElms[1];
      expect(secondParagraph.textContent).toBe(
        'Added via insertAdjacentHTMLBeforeEnd. I should have a red background.',
      );
      expect(secondParagraph.parentElement).toBe(parentDiv);
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');
    });

    it('slots elements w/ "afterbegin" position', async () => {
      expect(parentDiv).toBeDefined();

      // before we hit the button to call `insertAdjacentHTML`, we should only have one <p> elm
      let paragraphElms = host.querySelectorAll('p');
      const firstParagraph = paragraphElms[0];
      expect(firstParagraph.textContent).toBe('I am slotted and will receive a red background');
      expect(firstParagraph.parentElement).toBe(parentDiv);
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');

      // insert an additional <p> elm
      const addButton = app.querySelector<HTMLButtonElement>('#addInsertAdjacentHtmlAfterBegin');
      addButton.click();
      await waitForChanges();

      // now we should have 2 <p> elms
      paragraphElms = host.querySelectorAll('p');
      expect(paragraphElms.length).toBe(2);

      // the inserted elm should:
      // 1. have the <div> as it's parent
      // 2. the <div> should have the same style (which gets acquired by both <p> elms)
      const insertedParagraph = paragraphElms[0];
      expect(insertedParagraph.textContent).toBe(
        'Added via insertAdjacentHTMLAfterBegin. I should have a red background.',
      );
      expect(insertedParagraph.parentElement).toBe(parentDiv);
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');
    });
  });

  describe('insertAdjacentText', () => {
    it('slots elements w/ "beforeend" position', async () => {
      expect(parentDiv).toBeDefined();

      expect(parentDiv.textContent).toBe(
        'Here is my slot. It is red.\n  I am slotted and will receive a red background\n',
      );
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');

      // insert an additional text node
      const addButton = app.querySelector<HTMLButtonElement>('#addInsertAdjacentTextBeforeEnd');
      addButton.click();
      await waitForChanges();

      expect(parentDiv.textContent).toBe(
        'Here is my slot. It is red.\n  I am slotted and will receive a red background\nAdded via insertAdjacentTextBeforeEnd. I should have a red background.',
      );
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');
    });

    it('slots elements w/ "afterbegin" position', async () => {
      expect(parentDiv).toBeDefined();

      expect(parentDiv.textContent).toBe(
        'Here is my slot. It is red.\n  I am slotted and will receive a red background\n',
      );
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');

      // insert an additional text node
      const addButton = app.querySelector<HTMLButtonElement>('#addInsertAdjacentTextAfterBegin');
      addButton.click();
      await waitForChanges();

      expect(parentDiv.textContent).toBe(
        'Here is my slot. It is red.Added via insertAdjacentTextAfterBegin. I should have a red background.\n  I am slotted and will receive a red background\n',
      );
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');
    });
  });

  describe('insertAdjacentElement', () => {
    it('slots elements w/ "beforeend" position', async () => {
      expect(parentDiv).toBeDefined();

      let children = parentDiv.children;
      expect(children.length).toBe(1);
      expect(children[0].textContent).toBe('I am slotted and will receive a red background');
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');

      const addButton = app.querySelector<HTMLButtonElement>('#addInsertAdjacentElementBeforeEnd');
      addButton.click();
      await waitForChanges();

      children = parentDiv.children;
      expect(children.length).toBe(2);
      expect(children[1].textContent).toBe('Added via insertAdjacentElementBeforeEnd. I should have a red background.');
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');
    });

    it('slots elements w/ "afterBegin" position', async () => {
      expect(parentDiv).toBeDefined();

      let children = parentDiv.children;
      expect(children.length).toBe(1);
      expect(children[0].textContent).toBe('I am slotted and will receive a red background');
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');

      const addButton = app.querySelector<HTMLButtonElement>('#addInsertAdjacentElementAfterBegin');
      addButton.click();
      await waitForChanges();

      children = parentDiv.children;
      expect(children.length).toBe(2);
      expect(children[0].textContent).toBe(
        'Added via insertAdjacentElementAfterBegin. I should have a red background.',
      );
      expect((getComputedStyle(parentDiv) as any)['background-color']).toBe('rgb(255, 0, 0)');
    });
  });
});
