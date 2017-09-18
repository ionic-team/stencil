import { h } from '../../core/renderer/h';
import * as util from '../util';

class IonTest {
  render() {
    return [
      h('div', 0, 'hi')
    ];
  }
}

var IonTestES5 = (function() {
  function IonTestES5() { }
  IonTestES5.prototype.render = function() {
    return [
      h('div', 0, 'hi')
    ];
  };
  return IonTestES5;
}());

class IonThingOne {
  render() {
    return [
      h('div', 0, 'thing')
    ];
  }
}

class IonThingTwo {
  x = 18;
  y = 24;
  sum() { return this.x + this.y; }
  render() {
    return [
      h('div', { c: 'thing' }, [
        h('div', { c: 'child-thing' }, 'I am the eldest'),
        h('div', { c: 'child-thing' }, 'Middle child rules'),
        h('div', { c: 'child-thing' }, 'No youngest does'),
        h('div', { c: 'child-thing' }, 'say wut now?'),
        h('div', { c: 'random-sum' }, this.sum())
      ])
    ];
  }
}

describe('testing utilities', () => {
  describe('register', () => {
    it('returns a platform', () => {
      const plt = util.register();
      expect(plt).toBeTruthy();
      expect(typeof plt.defineComponent).toEqual('function');
      expect(typeof plt.getComponentMeta).toEqual('function');
      expect(typeof plt.getContextItem).toEqual('function');
    });

    it('registers the components', () => {
      const plt = util.register(
        [{
          tagNameMeta: 'ion-test',
          componentModule: IonTest
        }, {
          tagNameMeta: 'ion-thing-one',
          componentModule: IonThingOne
        }]
      );
      expect(plt.getComponentMeta({ tagName: 'ion-test' } as Element)).toBeTruthy();
      expect(plt.getComponentMeta({ tagName: 'ion-thing-one' } as Element)).toBeTruthy();
    });
  });

  describe('render', () => {
    it('renders the specified component', async () => {
      const plt = util.register(
        [{
          tagNameMeta: 'ion-test',
          componentModule: IonTest
        }]
      );
      const node = await util.render(plt, '<ion-test></ion-test>');
      expect(node.innerHTML.toString()).toEqual('<div>hi</div>');
    });

    it('renders transpiled components', async () => {
      const plt = util.register(
        [{
          tagNameMeta: 'ion-test-es5',
          componentModule: IonTestES5
        }]
      );
      const node = await util.render(plt, '<ion-test-es5></ion-test-es5>');
      expect(node.innerHTML.toString()).toEqual('<div>hi</div>');
    });

    it('renders a node that can be queried for tests', async () => {
      const plt = util.register(
        [{
          tagNameMeta: 'ion-thing-two',
          componentModule: IonThingTwo
        }]
      );
      const node = await util.render(plt, '<ion-thing-two></ion-thing-two>');
      const children = node.getElementsByClassName('child-thing');
      expect(children.length).toEqual(4);
    });

    it('allows the component class itself to be tested', async () => {
      const plt = util.register(
        [{
          tagNameMeta: 'ion-thing-two',
          componentModule: IonThingTwo
        }]
      );
      const node = await util.render(plt, '<ion-thing-two></ion-thing-two>');
      const c: IonThingTwo = node.$instance as IonThingTwo;
      expect(c.sum()).toEqual(42);
      c.x = 25;
      c.y = 48;
      expect(c.sum()).toEqual(73);
    });
  });

  describe('transpile', () => {
    it('syncronously transpiles the specified file', () => {
      const res = util.transpile(`${__dirname}/test-class.tsx`, `${__dirname}`);
      // just some sanity checks, validating the whole string may be too fragile
      expect(res).toContain('TestClass.prototype.sum = function');
      expect(res).toContain('TestClass.prototype.render = function');
      expect(res).toContain('h("div",');
    });
  });
});
