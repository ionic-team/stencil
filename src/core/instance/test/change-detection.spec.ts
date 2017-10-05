import { mockPlatform, mockDomApi } from '../../../testing/mocks';
import { ComponentMeta, ComponentInstance, PlatformApi } from '../../../util/interfaces';
import { MEMBER_PROP, PROP_TYPE } from '../../../util/constants';
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
    membersMeta: {
      'num': {
        memberType: MEMBER_PROP,
        attribName: 'num',
        propType: PROP_TYPE.Number
      },
      'str': {
        memberType: MEMBER_PROP,
        attribName: 'str',
        propType: PROP_TYPE.String
      },
      'bool': {
        memberType: MEMBER_PROP,
        attribName: 'bool',
        propType: PROP_TYPE.Boolean
      },
      'arr': {
        memberType: MEMBER_PROP,
        attribName: 'arr',
        propType: PROP_TYPE.Any
      },
      'obj': {
        memberType: MEMBER_PROP,
        attribName: 'obj',
        propType: PROP_TYPE.Any
      }
    }
  };

  beforeEach(() => {
    plt = <any>mockPlatform();
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TwinPines();
    elm.$instance = instance;
    instance.__el = elm;
  });

});
