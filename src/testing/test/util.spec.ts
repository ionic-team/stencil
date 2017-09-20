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

class IonThing {
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
  describe('render', () => {
    it('renders the specified component', async () => {
      util.register(
        [{
          tagNameMeta: 'ion-test',
          componentModule: IonTest
        }]
      );
      const node = await util.render('<ion-test></ion-test>');
      expect(node.innerHTML.toString()).toEqual('<div>hi</div>');
    });

    it('renders transpiled components', async () => {
      util.register(
        [{
          tagNameMeta: 'ion-test-es5',
          componentModule: IonTestES5
        }]
      );
      const node = await util.render('<ion-test-es5></ion-test-es5>');
      expect(node.innerHTML.toString()).toEqual('<div>hi</div>');
    });

    it('renders a node that can be queried for tests', async () => {
      util.register(
        [{
          tagNameMeta: 'ion-thing',
          componentModule: IonThing
        }]
      );
      const node = await util.render('<ion-thing></ion-thing>');
      const children = node.getElementsByClassName('child-thing');
      expect(children.length).toEqual(4);
    });

    it('allows the component class itself to be tested', async () => {
      util.register(
        [{
          tagNameMeta: 'ion-thing',
          componentModule: IonThing
        }]
      );
      const node = await util.render('<ion-thing></ion-thing>');
      const c: IonThing = node.$instance as IonThing;
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
