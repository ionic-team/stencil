import { waitForLoad, mockConnect, mockDefine, mockPlatform } from '../../../testing/mocks';


describe('instance connected', () => {
  const plt = mockPlatform();

  it('should create $instance', (done) => {
    mockDefine(plt, { tagNameMeta: 'ion-test' });

    const node = mockConnect(plt, '<ion-test></ion-test>');
    waitForLoad(plt, node, 'ion-test', (elm) => {
      expect(elm.$instance).toBeDefined();
      done();
    });
  });

  it('should set $hasConnected', (done) => {
    mockDefine(plt, { tagNameMeta: 'ion-test' });

    const node = mockConnect(plt, '<ion-test></ion-test>');
    waitForLoad(plt, node, 'ion-test', (elm) => {
      expect(elm._hasConnected).toBe(true);
      done();
    });
  });

});
