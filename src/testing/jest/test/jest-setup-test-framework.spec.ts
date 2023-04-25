import { MockHTMLElement, MockNode } from '../../../mock-doc/node';
import { removeDomNodes } from '../jest-setup-test-framework';

describe('jest setup test framework', () => {
  describe('removeDomNodes', () => {
    it('removes all children of the parent node', () => {
      const parentNode = new MockHTMLElement(null, 'div');
      parentNode.appendChild(new MockHTMLElement(null, 'p'));

      expect(parentNode.childNodes.length).toEqual(1);

      removeDomNodes(parentNode);

      expect(parentNode.childNodes.length).toBe(0);
    });

    it('does nothing if there is no parent node', () => {
      const parentNode: MockNode = undefined;

      removeDomNodes(parentNode);

      expect(parentNode).toBeUndefined();
    });

    it('does nothing if the parent node child array is empty', () => {
      const parentNode = new MockHTMLElement(null, 'div');
      parentNode.childNodes = [];

      removeDomNodes(parentNode);

      expect(parentNode.childNodes).toStrictEqual([]);
    });

    it('does nothing if the parent node child array is `null`', () => {
      const parentNode = new MockHTMLElement(null, 'div');
      parentNode.childNodes = null;

      removeDomNodes(parentNode);

      expect(parentNode.childNodes).toBe(null);
    });
  });
});
