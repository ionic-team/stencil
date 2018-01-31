import { ComponentConstructor, ComponentInstance, ComponentMeta, PlatformApi } from '../../../declarations';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import { mockDomApi, mockPlatform } from '../../../testing/mocks';
import { proxyComponentInstance } from '../proxy-component-instance';


describe('proxy-component', () => {

  describe('watch callbacks', () => {

    it('watch callbacks called', () => {
      instance.chg = 'oldValue';
      spyOn(instance, 'watchCallbackA');
      spyOn(instance, 'watchCallbackB');
      proxyComponentInstance(plt, CmpConstructor, elm, instance);
      instance.chg = 'newValue';
      expect(instance.watchCallbackA).toBeCalledWith('newValue', 'oldValue', 'chg');
      expect(instance.watchCallbackB).toBeCalledWith('newValue', 'oldValue', 'chg');
    });

    it('multiple watch callbacks called w/ different property names', () => {
      const calls: any[] = [];

      const orgWatchCallbackA = instance.watchCallbackA;
      instance.watchCallbackA = function patchWatchCallbackA(newValue: string, oldValue: string, propName: string) {
        calls.push([newValue, oldValue, propName]);
      };

      instance.chg = 'oldValueChg1';
      instance.chg2 = 'oldValueChg2';
      proxyComponentInstance(plt, CmpConstructor, elm, instance);

      instance.chg = 'newValueChg1';
      instance.chg2 = 'newValueChg2';

      expect(calls).toHaveLength(2);
      expect(calls[0][0]).toBe('newValueChg1');
      expect(calls[0][1]).toBe('oldValueChg1');
      expect(calls[0][2]).toBe('chg');

      expect(calls[1][0]).toBe('newValueChg2');
      expect(calls[1][1]).toBe('oldValueChg2');
      expect(calls[1][2]).toBe('chg2');
    });

  });

  describe('has changed', () => {

    it('instance number changed', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, CmpConstructor, elm, instance);
      instance.num = 141.622;
      expect(plt.queue.add).toHaveBeenCalled();
    });

    it('instance string changed', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, CmpConstructor, elm, instance);
      instance.str = 'kph';
      expect(plt.queue.add).toHaveBeenCalled();
    });

    it('instance boolean changed', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, CmpConstructor, elm, instance);
      instance.bool = false;
      expect(plt.queue.add).toHaveBeenCalled();
    });

  });

  describe('no change', () => {

    it('instance number unchanged', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, CmpConstructor, elm, instance);
      instance.num = 88;
      expect(plt.queue.add).not.toHaveBeenCalled();
    });

    it('instance string unchanged', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, CmpConstructor, elm, instance);
      instance.str = 'mph';
      expect(plt.queue.add).not.toHaveBeenCalled();
    });

    it('instance boolean unchanged', () => {
      spyOn(plt.queue, 'add');
      proxyComponentInstance(plt, CmpConstructor, elm, instance);
      instance.bool = true;
      expect(plt.queue.add).not.toHaveBeenCalled();
    });

  });


  let plt: PlatformApi;
  const domApi = mockDomApi();
  let elm: any;
  let instance: ComponentInstance;
  let CmpConstructor: ComponentConstructor;

  class TwinPines {
    num = 88;
    str = 'mph';
    bool = true;
    arr = [1, 21];
    obj = { 'flux': 'plutonium' };

    watchCallbackA(newValue: any, oldValue: any) {/**/}
    watchCallbackB(newValue: any, oldValue: any) {/**/}

    static get properties() {
      return {
        'num': {
          mutable: true,
          attr: 'num',
          type: Number
        },
        'str': {
          mutable: true,
          attr: 'str',
          type: String
        },
        'bool': {
          mutable: true,
          attr: 'bool',
          type: Boolean
        },
        'arr': {
          mutable: true,
          attr: 'arr',
          type: 'Any'
        },
        'obj': {
          mutable: true,
          attr: 'obj',
          type: 'Any'
        },
        'chg': {
          mutable: true,
          type: Boolean,
          watchCallbacks: ['watchCallbackA', 'watchCallbackB']
        },
        'chg2': {
          mutable: true,
          type: Boolean,
          watchCallbacks: ['watchCallbackA']
        }
      };
    }
  }

  beforeEach(() => {
    plt = <any>mockPlatform();
    elm = domApi.$createElement('ion-cmp') as any;
    CmpConstructor = TwinPines as any;
    instance = new TwinPines();
    elm._instance = instance;
    instance.__el = elm;
  });

});
