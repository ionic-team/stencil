import { waitForLoad, mockConnect, mockDefine, mockPlatform } from '../../../test';
import { ComponentMeta } from '../../../util/interfaces';
import { h } from '../../renderer/h';


describe('instance update', () => {
  const plt = mockPlatform();

  it('should render state', (done) => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModuleMeta: class {
        value = '88';
        render() {
          return h('ion-test', this.value);
        }
      }
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    waitForLoad(plt, node, 'ion-test', (elm) => {

      expect(elm._vnode.elm.textContent).toBe('88');

      const instance: any = elm.$instance;
      instance.value = '99';

      elm._queueUpdate();

      plt.$flushQueue(() => {
        expect(elm._vnode.elm.textContent).toBe('99');

        done();
      });
    });
  });

  it('should render text', (done) => {

    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModuleMeta: class {
        render() {
          return h('grasshopper', 'hi');
        }
      }
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    waitForLoad(plt, node, 'ion-test', (elm) => {
      expect(elm.childNodes[0].nodeName).toBe('GRASSHOPPER');
      expect(elm.childNodes[0].textContent).toBe('hi');
      done();
    });
  });

  it('should not run renderer when no render() fn', (done) => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModuleMeta: class {}
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    waitForLoad(plt, node, 'ion-test', (elm) => {
      expect(elm._vnode).toBeUndefined();
      done();
    });
  });

  it('should create $instance', (done) => {
    let createdInstance = false;
    const cmpMeta: ComponentMeta = {
      tagNameMeta: 'ion-test',
      componentModuleMeta: class {
        constructor() {
          createdInstance = true;
        }
      }
    };
    mockDefine(plt, cmpMeta);

    const node = mockConnect(plt, '<ion-test></ion-test>');

    waitForLoad(plt, node, 'ion-test', (elm) => {
      expect(elm.$instance).toBeDefined();
      done();
    });
  });

});
