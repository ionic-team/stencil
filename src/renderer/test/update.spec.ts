import { mockComponent, mockConfigController, mockIonicGlobal,
  mockPlatform, mockProxyElement } from '../../test';
import { Renderer } from '../core';
import { update } from '../update';


describe('client/update', function() {
  const config = mockConfigController();
  const IonicGbl = mockIonicGlobal(config);
  const plt = mockPlatform(IonicGbl);
  const renderer = Renderer(plt);

  describe('update', function() {

    it('should create an instance', function() {

      mockComponent(plt, {
        tag: 'ion-test'
      });

      const elm = mockProxyElement('ion-test');

      update(plt, config, renderer, elm);

      const instance = elm.$instance;

      expect(elm.$instance).toBeDefined();
      expect(instance.$el).toBe(elm);

      expect(instance.$meta).toBeDefined();
      expect(instance.$meta.tag).toEqual(elm.tagName.toLowerCase());
    });

    // it('should run ionViewDidLoad only once', function() {


    //   let runCount = 0;

    //   createComponent(tag, class MyClass {
    //     ionViewDidLoad() {
    //       runCount++;
    //     }
    //   });

    //   update(plt, config, renderer, elm);
    //   update(plt, config, renderer, elm);

    //   expect(runCount).toEqual(1);
    // });

  });

});
