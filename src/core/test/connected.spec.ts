import { mockConnect, mockDefine, mockPlatform, waitForLoad } from '../../testing/mocks';


describe('connected', () => {

  describe('instance connected', () => {
    const plt = mockPlatform();

    it('should create instance', async () => {
      mockDefine(plt, { tagNameMeta: 'ion-test' });

      const node = mockConnect(plt, '<ion-test></ion-test>');
      const elm = await waitForLoad(plt, node, 'ion-test');
      const instance = plt.instanceMap.get(elm);
      expect(instance).toBeDefined();
    });

    it('should set $connected', async () => {
      mockDefine(plt, { tagNameMeta: 'ion-test' });

      const node = mockConnect(plt, '<ion-test></ion-test>');
      const elm = await waitForLoad(plt, node, 'ion-test');
      const hasConnected = plt.hasConnectedMap.has(elm);
      expect(hasConnected).toBe(true);
    });

  });

});
