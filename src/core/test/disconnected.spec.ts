import { isDisconnected } from '../disconnected';
import { mockDomApi, mockElement } from '../../testing/mocks';


describe('disconnected', () => {

  describe('isDisconnected', () => {

    const domApi = mockDomApi();

    it('should not be disconnected when elm has a parentNode', () => {
      const parentNode = mockElement();
      const elm = mockElement();
      parentNode.appendChild(elm);
      expect(isDisconnected(domApi, elm)).toBe(true);
    });

    it('should be disconnected when elm has no parentNode', () => {
      const elm = mockElement();
      expect(isDisconnected(domApi, elm)).toBe(true);
    });

    it('should be cool if its a null/undefined elm', () => {
      expect(isDisconnected(domApi, null)).toBeUndefined();
    });

  });

});
