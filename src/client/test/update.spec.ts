import { mockComponent, mockConfigController, mockIonicGlobal,
  mockPlatformClient, mockProxyElement } from './client-mocks';
import { Renderer } from '../renderer/core';
import { update } from '../update';


describe('client/update', function() {
  const IonicGbl = mockIonicGlobal();
  const plt = mockPlatformClient(IonicGbl);
  const renderer = Renderer(plt);
  const config = mockConfigController();

  function createComponent(tag: string, cmpName: string, cmpModule: any) {
    return mockComponent(IonicGbl, plt, tag, cmpName, cmpModule);
  }

  describe('update', function() {

    it('should create an instance', function() {
      const tag  = 'ion-elm';
      const elm = mockProxyElement(tag);
      createComponent(tag, 'MyClass', class MyClass {});

      update(plt, config, renderer, elm, tag);

      const instance = elm.$instance;

      expect(elm.$instance).toBeDefined();
      expect(instance.$el).toBe(elm);

      expect(instance.$meta).toBeDefined();
      expect(instance.$meta.tag).toEqual(tag);
    });

  });

});
