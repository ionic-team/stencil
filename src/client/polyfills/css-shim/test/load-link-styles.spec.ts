import { win } from '../../../client-window';
import { addGlobalLink } from '../load-link-styles';

describe('loadLinkStyles', () => {
  describe('addGlobalLink', () => {
    global.fetch = jest.fn().mockResolvedValue({ text: () => '--color: var(--app-color);' });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a style tag within the link element parent node', async () => {
      const linkElm = document.createElement('link');
      linkElm.setAttribute('rel', 'stylesheet');
      linkElm.setAttribute('href', '');

      const parentElm = document.createElement('head');
      parentElm.appendChild(linkElm);

      await addGlobalLink(document, [], linkElm);

      expect(parentElm.innerHTML).toEqual('<style data-styles>--color: var(--app-color);</style>');
    });

    it('should create a style tag with a nonce attribute within the link element parent node', async () => {
      (win as any).nonce = 'abc123';
      const linkElm = document.createElement('link');
      linkElm.setAttribute('rel', 'stylesheet');
      linkElm.setAttribute('href', '');

      const parentElm = document.createElement('head');
      parentElm.appendChild(linkElm);

      await addGlobalLink(document, [], linkElm);

      expect(parentElm.innerHTML).toEqual('<style data-styles nonce="abc123">--color: var(--app-color);</style>');
    });
  });
});
