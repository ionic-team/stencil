import { waitForLoad, mockConnect, mockDefine, mockElement, mockPlatform } from '../../../testing/mocks';
import { ComponentMeta, HostElement } from '../../../util/interfaces';
import { h } from '../../renderer/h';
import { renderUpdate } from '../update';


describe('instance update', () => {

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

  it('should render state', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModule: class {
        value = '88';
        render() {
          return [
            h('ion-test', null, this.value)
          ];
        }
      }
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm._vnode.elm.textContent).toBe('88');

      const instance: any = elm.$instance;
      instance.value = '99';

      elm._queueUpdate();

      plt.$flushQueue(() => {
        expect(elm._vnode.elm.textContent).toBe('99');
      });
    });
  });

  it('should render text', () => {

    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModule: class {
        render() {
          return [
            h('grasshopper', null, 'hi')
          ];
        }
      }
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.childNodes[0].nodeName).toBe('GRASSHOPPER');
      expect(elm.childNodes[0].textContent).toBe('hi');
    });
  });

  it('should render text where null values exist in an array', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModule: class {
        render() {
          return [
            null,
            h('grasshopper', null, 'hi'),
            null
          ];
        }
      }
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.childNodes[0].nodeType).toBe(3); // Node.TEXT_NODE
      expect(elm.childNodes[0].textContent).toBe('');
      expect(elm.childNodes[1].nodeType).toBe(1); // Node.ELEMENT_NODE
      expect(elm.childNodes[1].nodeName).toBe('GRASSHOPPER');
      expect(elm.childNodes[1].textContent).toBe('hi');
      expect(elm.childNodes[2].nodeType).toBe(3); // Node.TEXT_NODE
      expect(elm.childNodes[2].textContent).toBe('');
    });
  });

  it('should not run renderer when no render() fn', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModule: class {}
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm._vnode).toBeUndefined();
    });
  });

  it('should create $instance', () => {
    const cmpMeta: ComponentMeta = {
      tagNameMeta: 'ion-test',
      componentModule: class {
        constructor() {
        }
      }
    };
    mockDefine(plt, cmpMeta);

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.$instance).toBeDefined();
    });
  });


  var plt: any;

  beforeEach(() => {
    plt = mockPlatform();
  });

});
