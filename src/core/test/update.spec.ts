import * as d from '../../declarations';
import { h } from '../../renderer/vdom/h';
import { MockedPlatform, mockConnect, mockDefine, mockPlatform, testingPerf, waitForLoad } from '../../testing/mocks';
import { NODE_TYPE } from '../../util/constants';
import { queueUpdate } from '../update';
import { getDefaultBuildConditionals } from '../../util/build-conditionals';


describe('instance update', () => {

  let plt: MockedPlatform;

  beforeEach(() => {
    plt = mockPlatform();
    _BUILD_ = getDefaultBuildConditionals();
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
    _BUILD_.hostData = false;
    const elm = await waitForLoad(plt, node, 'ion-test');
    const vnode = plt.vnodeMap.get(elm);
    expect(vnode.elm.textContent).toBe('88');

    const instance = plt.instanceMap.get(elm);
    instance.value = '99';

    queueUpdate(plt, elm, testingPerf);

    await plt.$flushQueue();

    expect(vnode.elm.textContent).toBe('99');
  });

  it('should render text', async () => {

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

    const elm = await waitForLoad(plt, node, 'ion-test');
    expect(elm.childNodes[0].nodeType).toBe(NODE_TYPE.TextNode);
    expect(elm.childNodes[1].nodeType).toBe(3); // Node.TEXT_NODE
    expect(elm.childNodes[1].textContent).toBe('');
    expect(elm.childNodes[2].nodeType).toBe(1); // Node.ELEMENT_NODE
    expect(elm.childNodes[2].nodeName).toBe('GRASSHOPPER');
    expect(elm.childNodes[2].textContent).toBe('hi');
    expect(elm.childNodes[3].nodeType).toBe(3); // Node.TEXT_NODE
    expect(elm.childNodes[3].textContent).toBe('');
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
