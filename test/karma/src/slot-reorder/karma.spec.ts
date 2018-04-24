import { setupDomTests } from '../util';


describe('slot-reorder', () => {
  const { app, setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);


  it('renders', async () => {
    await renderTest('/slot-reorder/index.html');
    let r: HTMLElement;
    const button = app.querySelector('button');

    function ordered() {
      r = app.querySelector('.results1 div');
      expect(r.children[0].textContent.trim()).toBe('fallback default');
      expect(r.children[0].hasAttribute('hidden')).toBe(false);
      expect(r.children[0].getAttribute('name')).toBe(null);
      expect(r.children[1].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[1].hasAttribute('hidden')).toBe(false);
      expect(r.children[1].getAttribute('name')).toBe('slot-a');
      expect(r.children[2].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[2].hasAttribute('hidden')).toBe(false);
      expect(r.children[2].getAttribute('name')).toBe('slot-b');

      r = app.querySelector('.results2 div');
      expect(r.children[0].textContent.trim()).toBe('fallback default');
      expect(r.children[0].hasAttribute('hidden')).toBe(true);
      expect(r.children[0].getAttribute('name')).toBe(null);
      expect(r.children[1].textContent.trim()).toBe('default content');
      expect(r.children[2].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[2].hasAttribute('hidden')).toBe(false);
      expect(r.children[2].getAttribute('name')).toBe('slot-a');
      expect(r.children[3].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[3].hasAttribute('hidden')).toBe(false);
      expect(r.children[3].getAttribute('name')).toBe('slot-b');

      r = app.querySelector('.results3 div');
      expect(r.children[0].textContent.trim()).toBe('fallback default');
      expect(r.children[0].hasAttribute('hidden')).toBe(true);
      expect(r.children[0].getAttribute('name')).toBe(null);
      expect(r.children[1].textContent.trim()).toBe('default content');
      expect(r.children[2].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[2].hasAttribute('hidden')).toBe(true);
      expect(r.children[2].getAttribute('name')).toBe('slot-a');
      expect(r.children[3].textContent.trim()).toBe('slot-a content');
      expect(r.children[4].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[4].hasAttribute('hidden')).toBe(true);
      expect(r.children[4].getAttribute('name')).toBe('slot-b');
      expect(r.children[5].textContent.trim()).toBe('slot-b content');

      r = app.querySelector('.results4 div');
      expect(r.children[0].textContent.trim()).toBe('fallback default');
      expect(r.children[0].hasAttribute('hidden')).toBe(true);
      expect(r.children[0].getAttribute('name')).toBe(null);
      expect(r.children[1].textContent.trim()).toBe('default content');
      expect(r.children[2].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[2].hasAttribute('hidden')).toBe(true);
      expect(r.children[2].getAttribute('name')).toBe('slot-a');
      expect(r.children[3].textContent.trim()).toBe('slot-a content');
      expect(r.children[4].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[4].hasAttribute('hidden')).toBe(true);
      expect(r.children[4].getAttribute('name')).toBe('slot-b');
      expect(r.children[5].textContent.trim()).toBe('slot-b content');
    }

    function reordered() {
      r = app.querySelector('.results1 div');
      expect(r.children[0].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[0].hasAttribute('hidden')).toBe(false);
      expect(r.children[0].getAttribute('name')).toBe('slot-b');
      expect(r.children[1].textContent.trim()).toBe('fallback default');
      expect(r.children[1].hasAttribute('hidden')).toBe(false);
      expect(r.children[1].getAttribute('name')).toBe(null);
      expect(r.children[2].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[2].hasAttribute('hidden')).toBe(false);
      expect(r.children[2].getAttribute('name')).toBe('slot-a');

      r = app.querySelector('.results2 div');
      expect(r.children[0].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[0].hasAttribute('hidden')).toBe(false);
      expect(r.children[0].getAttribute('name')).toBe('slot-b');
      expect(r.children[1].textContent.trim()).toBe('fallback default');
      expect(r.children[1].hasAttribute('hidden')).toBe(true);
      expect(r.children[1].getAttribute('name')).toBe(null);
      expect(r.children[2].textContent.trim()).toBe('default content');
      expect(r.children[3].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[3].hasAttribute('hidden')).toBe(false);
      expect(r.children[3].getAttribute('name')).toBe('slot-a');

      r = app.querySelector('.results3 div');
      expect(r.children[0].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[0].hasAttribute('hidden')).toBe(true);
      expect(r.children[0].getAttribute('name')).toBe('slot-b');
      expect(r.children[1].textContent.trim()).toBe('slot-b content');
      expect(r.children[2].textContent.trim()).toBe('fallback default');
      expect(r.children[2].hasAttribute('hidden')).toBe(true);
      expect(r.children[2].getAttribute('name')).toBe(null);
      expect(r.children[3].textContent.trim()).toBe('default content');
      expect(r.children[4].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[4].hasAttribute('hidden')).toBe(true);
      expect(r.children[4].getAttribute('name')).toBe('slot-a');
      expect(r.children[5].textContent.trim()).toBe('slot-a content');

      r = app.querySelector('.results4 div');
      expect(r.children[0].textContent.trim()).toBe('fallback slot-b');
      expect(r.children[0].hasAttribute('hidden')).toBe(true);
      expect(r.children[0].getAttribute('name')).toBe('slot-b');
      expect(r.children[1].textContent.trim()).toBe('slot-b content');
      expect(r.children[2].textContent.trim()).toBe('fallback default');
      expect(r.children[2].hasAttribute('hidden')).toBe(true);
      expect(r.children[2].getAttribute('name')).toBe(null);
      expect(r.children[3].textContent.trim()).toBe('default content');
      expect(r.children[4].textContent.trim()).toBe('fallback slot-a');
      expect(r.children[4].hasAttribute('hidden')).toBe(true);
      expect(r.children[4].getAttribute('name')).toBe('slot-a');
      expect(r.children[5].textContent.trim()).toBe('slot-a content');
    }

    ordered();

    button.click();
    await flush();

    reordered();

    button.click();
    await flush();

    ordered();

    button.click();
    await flush();

    reordered();
  });

});
