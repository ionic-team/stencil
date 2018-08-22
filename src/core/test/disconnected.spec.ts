import { isDisconnected } from '../disconnected';
import { mockDocument, mockDomApi } from '../../testing/mocks';


describe('disconnected', () => {

  describe('isDisconnected', () => {

    const domApi = mockDomApi();

    it('should not be disconnected when elm has a parentNode', () => {
      const doc = mockDocument();
      const parentNode = doc.createElement('div');
      const elm = doc.createElement('div');
      parentNode.appendChild(elm);
      expect(isDisconnected(domApi, elm)).toBe(true);
    });

    it('should be disconnected when elm has no parentNode', () => {
      const doc = mockDocument();
      const elm = doc.createElement('div');
      expect(isDisconnected(domApi, elm)).toBe(true);
    });

    it('should be cool if its a null/undefined elm', () => {
      expect(isDisconnected(domApi, null)).toBeUndefined();
    });

  });

});
