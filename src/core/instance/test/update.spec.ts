import { Build } from '../../../util/build-conditionals';
import { ComponentMeta, HostElement } from '../../../declarations';
import { h } from '../../renderer/h';
import { MockedPlatform, mockConnect, mockDefine, mockElement, mockPlatform, waitForLoad } from '../../../testing/mocks';
import { NODE_TYPE } from '../../../util/constants';
import { queueUpdate, renderUpdate } from '../update';


describe('instance update', () => {

  let plt: MockedPlatform;

  beforeEach(() => {
    plt = mockPlatform();
  });


  describe('renderUpdate', () => {

    it('should fire off componentDidUpdate if its on the instance and isInitialLoad is false', () => {
      class MyComponent {
        ranLifeCycle = false;
        componentDidUpdate() {
          this.ranLifeCycle = true;
        }
      }
      const elm = mockElement('ion-tag') as HostElement;
      const cmpMeta: ComponentMeta = { tagNameMeta: 'ion-tag' };
      plt.defineComponent(cmpMeta);
      elm._instance = new MyComponent();
      renderUpdate(plt, elm, false);
      expect(elm._instance.ranLifeCycle).toBe(true);
    });

    it('should not fire off componentDidUpdate if its on the instance and isInitialLoad is true', () => {
      class MyComponent {
        ranLifeCycle = false;
        componentDidUpdate() {
          this.ranLifeCycle = true;
        }
      }
      const elm = mockElement('ion-tag') as HostElement;
      const cmpMeta: ComponentMeta = { tagNameMeta: 'ion-tag' };
      plt.defineComponent(cmpMeta);
      elm._instance = new MyComponent();
      renderUpdate(plt, elm, true);
      expect(elm._instance.ranLifeCycle).toBe(false);
    });

  });

  it('should render state', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        value = '88';
        render() {
          return [
            h('ion-test', null, this.value)
          ];
        }
      } as any
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');
    Build.hostData = false;
    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm._vnode.elm.textContent).toBe('88');

      const instance: any = elm._instance;
      instance.value = '99';

      queueUpdate(plt, elm);

      plt.$flushQueue(() => {
        expect(elm._vnode.elm.textContent).toBe('99');
        Build.hostData = true;
      });
    });
  });

  it('should render text', () => {

    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        render() {
          return [
            h('grasshopper', null, 'hi')
          ];
        }
      } as any
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.childNodes[0].nodeType).toBe(NODE_TYPE.CommentNode);
      expect(elm.childNodes[1].nodeName).toBe('GRASSHOPPER');
      expect(elm.childNodes[1].textContent).toBe('hi');
    });
  });

  it('should render text where null values exist in an array', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        render() {
          return [
            null,
            h('grasshopper', null, 'hi'),
            null
          ];
        }
      } as any
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.childNodes[0].nodeType).toBe(NODE_TYPE.CommentNode);
      expect(elm.childNodes[1].nodeType).toBe(3); // Node.TEXT_NODE
      expect(elm.childNodes[1].textContent).toBe('');
      expect(elm.childNodes[2].nodeType).toBe(1); // Node.ELEMENT_NODE
      expect(elm.childNodes[2].nodeName).toBe('GRASSHOPPER');
      expect(elm.childNodes[2].textContent).toBe('hi');
      expect(elm.childNodes[3].nodeType).toBe(3); // Node.TEXT_NODE
      expect(elm.childNodes[3].textContent).toBe('');
    });
  });

  it('should not run renderer when no render() fn', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {} as any
    });

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm._vnode).toBeUndefined();
    });
  });

  it('should create _instance', () => {
    const cmpMeta: ComponentMeta = {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        constructor() {/**/}
      } as any
    };
    mockDefine(plt, cmpMeta);

    const node = mockConnect(plt, '<ion-test></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm._instance).toBeDefined();
    });
  });

});
