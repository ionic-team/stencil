import { mockPlatform, mockDomApi } from '../../../testing/mocks';
import { ComponentMeta, ComponentInstance, PlatformApi } from '../../../util/interfaces';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import { proxyComponentInstance } from '../proxy';


describe('set instance property', () => {

  describe('has changed', () => {

    it('instance number changed', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, cmpMeta, elm, instance);
      instance.num = 141.622;
      expect(plt.queue.add).toHaveBeenCalled();
    });

    it('instance string changed', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, cmpMeta, elm, instance);
      instance.str = 'kph';
      expect(plt.queue.add).toHaveBeenCalled();
    });

    it('instance boolean changed', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, cmpMeta, elm, instance);
      instance.bool = false;
      expect(plt.queue.add).toHaveBeenCalled();
    });

  });

  describe('no change', () => {

    it('instance number unchanged', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, cmpMeta, elm, instance);
      instance.num = 88;
      expect(plt.queue.add).not.toHaveBeenCalled();
    });

    it('instance string unchanged', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, cmpMeta, elm, instance);
      instance.str = 'mph';
      expect(plt.queue.add).not.toHaveBeenCalled();
    });

    it('instance boolean unchanged', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, cmpMeta, elm, instance);
      instance.bool = true;
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
        memberType: MEMBER_TYPE.State,
        attribName: 'num',
        propType: PROP_TYPE.Number
      },
      'str': {
        memberType: MEMBER_TYPE.State,
        attribName: 'str',
        propType: PROP_TYPE.String
      },
      'bool': {
        memberType: MEMBER_TYPE.State,
        attribName: 'bool',
        propType: PROP_TYPE.Boolean
      },
      'arr': {
        memberType: MEMBER_TYPE.State,
        attribName: 'arr',
        propType: PROP_TYPE.Any
      },
      'obj': {
        memberType: MEMBER_TYPE.State,
        attribName: 'obj',
        propType: PROP_TYPE.Any
      }
    }
  };

  beforeEach(() => {
    plt = <any>mockPlatform();
    elm = domApi.$createElement('ion-cmp') as any;
    instance = new TwinPines();
    elm._instance = instance;
    instance.__el = elm;
  });

});
