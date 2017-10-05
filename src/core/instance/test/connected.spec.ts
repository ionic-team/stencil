import { waitForLoad, mockConnect, mockDefine, mockPlatform } from '../../../testing/mocks';


describe('instance connected', () => {
  const plt = mockPlatform();

  it('should create $instance', () => {
    mockDefine(plt, { tagNameMeta: 'ion-test' });

    const node = mockConnect(plt, '<ion-test></ion-test>');
    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.$instance).toBeDefined();
    });
  });

  it('should set $connected', () => {
    mockDefine(plt, { tagNameMeta: 'ion-test' });

    const node = mockConnect(plt, '<ion-test></ion-test>');
    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.$connected).toBe(true);
    });
  });

});
