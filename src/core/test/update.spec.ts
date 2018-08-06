import * as d from '../../declarations';
import { h } from '../../renderer/vdom/h';
import { MockedPlatform, mockConnect, mockDefine, mockElement, mockPlatform, waitForLoad } from '../../testing/mocks';
import { NODE_TYPE } from '../../util/constants';
import { queueUpdate, renderUpdate } from '../update';
import { getDefaultBuildConditionals } from '../../util/build-conditionals';


describe('instance update', () => {

  let plt: MockedPlatform;

  beforeEach(() => {
    plt = mockPlatform();
    __BUILD_CONDITIONALS__ = getDefaultBuildConditionals();
  });


  describe('renderUpdate', () => {

    it('should fire off componentDidUpdate if its on the instance and isInitialLoad is false', () => {
      class MyComponent {
        ranLifeCycle = false;
        componentDidUpdate() {
          this.ranLifeCycle = true;
        }
      }
      const elm = mockElement('ion-tag') as d.HostElement;
      const cmpMeta: d.ComponentMeta = { tagNameMeta: 'ion-tag' };
      plt.defineComponent(cmpMeta);
      const instance = new MyComponent();
      renderUpdate(plt, elm, instance, false);
      expect(instance.ranLifeCycle).toBe(true);
    });

    it('should not fire off componentDidUpdate if its on the instance and isInitialLoad is true', () => {
      class MyComponent {
        ranLifeCycle = false;
        componentDidUpdate() {
          this.ranLifeCycle = true;
        }
      }
      const elm = mockElement('ion-tag') as d.HostElement;
      const cmpMeta: d.ComponentMeta = { tagNameMeta: 'ion-tag' };
      plt.defineComponent(cmpMeta);

      const instance = new MyComponent();
      renderUpdate(plt, elm, instance, true);
      expect(instance.ranLifeCycle).toBe(false);
    });

  });

  it('should render state', async () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        value = '88';
        render() {
          return [
            h('badger', null, this.value)
          ];
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-test></ion-test>');
    __BUILD_CONDITIONALS__.hostData = false;
    const elm = await waitForLoad(plt, node, 'ion-test');
    const vnode = plt.vnodeMap.get(elm);
    expect(vnode.elm.textContent).toBe('88');

    const instance = plt.instanceMap.get(elm);
    instance.value = '99';

    queueUpdate(plt, elm);

    await plt.$flushQueue();

    expect(vnode.elm.textContent).toBe('99');
  });

  it('should render text', async () => {
    __BUILD_CONDITIONALS__.ssrServerSide = false;

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

    const node = await mockConnect(plt, '<ion-test></ion-test>');

    const elm = await waitForLoad(plt, node, 'ion-test');
    expect(elm.childNodes[0].nodeType).toBe(NODE_TYPE.TextNode);
    expect(elm.childNodes[1].nodeName).toBe('GRASSHOPPER');
    expect(elm.childNodes[1].textContent).toBe('hi');
  });

  it('should render text where null values exist in an array', async () => {
    __BUILD_CONDITIONALS__.ssrServerSide = false;

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

    const node = await mockConnect(plt, '<ion-test></ion-test>');

    const elm = await waitForLoad(plt, node, 'ion-test') as d.HostElement;

    const contentRef = elm.childNodes[0] as d.RenderNode;
    expect(contentRef.nodeType).toBe(NODE_TYPE.TextNode);
    expect(contentRef.textContent).toBe('');
    expect(contentRef['s-cn']).toBe(true);
    expect(elm['s-cr']).toBe(contentRef);

    const emptyTextNode1 = elm.childNodes[1] as d.RenderNode;
    expect(emptyTextNode1.nodeType).toBe(NODE_TYPE.TextNode);
    expect(emptyTextNode1.textContent).toBe('');

    const grassHopper = elm.childNodes[2] as d.RenderNode;
    expect(grassHopper.nodeType).toBe(NODE_TYPE.ElementNode);
    expect(grassHopper.nodeName).toBe('GRASSHOPPER');
    expect(grassHopper.textContent).toBe('hi');

    const emptyTextNode2 = elm.childNodes[3] as d.RenderNode;
    expect(emptyTextNode2.nodeType).toBe(NODE_TYPE.TextNode);
    expect(emptyTextNode2.textContent).toBe('');
  });

  it('should not run renderer when no render() fn', async () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {} as any
    });

    const node = await mockConnect(plt, '<ion-test></ion-test>');

    const elm = await waitForLoad(plt, node, 'ion-test');
    const vnode = plt.vnodeMap.get(elm);
    expect(vnode).toBeUndefined();
  });

  it('should create instance', async () => {
    const cmpMeta: d.ComponentMeta = {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        constructor() {/**/}
      } as any
    };
    mockDefine(plt, cmpMeta);

    const node = await mockConnect(plt, '<ion-test></ion-test>');

    const elm = await waitForLoad(plt, node, 'ion-test');
    const instance = plt.instanceMap.get(elm);
    expect(instance).toBeDefined();
  });

});
