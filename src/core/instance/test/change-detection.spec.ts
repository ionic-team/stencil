import { mockPlatform, mockDomApi } from '../../../test';
import { ComponentMeta, ComponentInstance, PlatformApi } from '../../../util/interfaces';
import { ATTR_DASH_CASE, TYPE_ANY, TYPE_BOOLEAN, TYPE_NUMBER } from '../../../util/constants';
import { initProxy } from '../proxy';


describe('instance change detection', () => {

  describe('has changed', () => {

    it('number changed', () => {
      spyOn(plt.queue, 'add');

      initProxy(plt, elm, instance, cmpMeta);

      elm.num = 141.622;

      expect(plt.queue.add).toHaveBeenCalled();
    });

    it('string changed', () => {
      spyOn(plt.queue, 'add');

      initProxy(plt, elm, instance, cmpMeta);

      elm.str = 'kph';

      expect(plt.queue.add).toHaveBeenCalled();
    });

    it('boolean changed', () => {
      spyOn(plt.queue, 'add');

      initProxy(plt, elm, instance, cmpMeta);

      elm.bool = false;

      expect(plt.queue.add).toHaveBeenCalled();
    });

  });

  describe('no change', () => {

    it('number unchanged', () => {
      spyOn(plt.queue, 'add');

      initProxy(plt, elm, instance, cmpMeta);

      elm.num = 88;

      expect(plt.queue.add).not.toHaveBeenCalled();
    });

    it('string unchanged', () => {
      spyOn(plt.queue, 'add');

      initProxy(plt, elm, instance, cmpMeta);

      elm.str = 'mph';

      expect(plt.queue.add).not.toHaveBeenCalled();
    });

    it('boolean unchanged', () => {
      spyOn(plt.queue, 'add');

      initProxy(plt, elm, instance, cmpMeta);

      elm.bool = true;

      expect(plt.queue.add).not.toHaveBeenCalled();
    });

  });


  let plt: PlatformApi;
  const domApi = mockDomApi();
  let elm: any;
  let instance: ComponentInstance;

  class TwinPines {
    num = 88;
    str = 'mph';
    bool = true;
    arr = [1, 21];
    obj = { 'flux': 'plutonium' };
  }

  let cmpMeta: ComponentMeta = {
    propsMeta: [
      {
        propName: 'num',
        attribName: 'num',
        propType: TYPE_NUMBER,
        attribCase: ATTR_DASH_CASE,
        isStateful: false
      },
      {
        propName: 'str',
        attribName: 'str',
        propType: TYPE_ANY,
        attribCase: ATTR_DASH_CASE,
        isStateful: false
      },
      {
        propName: 'bool',
        attribName: 'bool',
        propType: TYPE_BOOLEAN,
        attribCase: ATTR_DASH_CASE,
        isStateful: false
      },
      {
        propName: 'arr',
        attribName: 'arr',
        propType: TYPE_ANY,
        attribCase: ATTR_DASH_CASE,
        isStateful: false
      },
      {
        propName: 'obj',
        attribName: 'obj',
        propType: TYPE_ANY,
        attribCase: ATTR_DASH_CASE,
        isStateful: false
      }
    ]
  };

  beforeEach(() => {
    plt = <any>mockPlatform();
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TwinPines();
    elm.$instance = instance;
    instance.__el = elm;
  });

});
