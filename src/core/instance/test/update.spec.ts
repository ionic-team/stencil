import { waitForLoad, mockConnect, mockDefine, mockElement, mockPlatform } from '../../../testing/mocks';
import { ComponentMeta, HostElement } from '../../../util/interfaces';
import { h } from '../../renderer/h';
import { renderUpdate } from '../update';


describe('instance update', () => {
  const plt = mockPlatform() as any;

  describe('renderUpdate', () => {

    it('should fire off componentDidUpdate if its on the instance and isInitialLoad is false', () => {
      class MyComponent {
        ranLifeCycle = false;
        componentDidUpdate() {
          this.ranLifeCycle = true;
        }
      }
      const elm = mockElement('ion-tag') as HostElement;
      elm.$instance = new MyComponent();
      renderUpdate(plt, elm, false);
      expect(elm.$instance.ranLifeCycle).toBe(true);
    });

    it('should not fire off componentDidUpdate if its on the instance and isInitialLoad is true', () => {
      class MyComponent {
        ranLifeCycle = false;
        componentDidUpdate() {
          this.ranLifeCycle = true;
        }
      }
      const elm = mockElement('ion-tag') as HostElement;
      elm.$instance = new MyComponent();
      renderUpdate(plt, elm, true);
      expect(elm.$instance.ranLifeCycle).toBe(false);
    });

  });

  it('should render state', (done) => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModule: class {
        value = '88';
        render() {
          return [
            h('ion-test', 0, this.value)
          ];
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
      componentModule: class {
        render() {
          return [
            h('grasshopper', 0, 'hi')
          ];
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
      componentModule: class {}
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
      componentModule: class {
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
