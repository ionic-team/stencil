import * as d from '@declarations';
import { h } from '../h';
import { mockConnect, mockDefine, mockPlatform, waitForLoad } from '../../../testing/mocks';
import { render } from '../../../core/render';


describe('Component slot', () => {

  const parentInstance = {
    msg: ''
  };

  let plt: d.PlatformApi;

  beforeEach(() => {
    parentInstance.msg = 'parent message';
    plt = mockPlatform();
  });

  async function mount(options: {parentVNode: d.VNode, childVNode: d.VNode}): Promise<{ parentElm?: d.HostElement, childElm?: d.HostElement }> {
    const rtn: { parentElm?: d.HostElement, childElm?: d.HostElement } = {};

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        render() {
          return options.parentVNode;
        }
      } as any
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentConstructor: class {
        render() {
          return options.childVNode;
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      rtn.parentElm = parentElm;

      return waitForLoad(plt, parentElm, 'ion-child').then(childElm => {
        rtn.childElm = childElm;
        return rtn;
      });
    });
  }


  it('should relocate nested default slot nodes', async () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        render() {
          return h('spider', null, h('slot', null));
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-test>88</ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.firstElementChild.nodeName).toBe('SPIDER');
      expect(elm.firstElementChild.childNodes[1].textContent).toBe('88');
      expect(elm.firstElementChild.childNodes).toHaveLength(2);
    });
  });

  it('should use components default slot text content', async () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        render() {
          return h('spider', null, h('slot', null, 'default content'));
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-test></ion-test>');

    const elm = await waitForLoad(plt, node, 'ion-test');

    expect(elm.firstElementChild.nodeName).toBe('SPIDER');
    expect(elm.firstElementChild.children).toHaveLength(1);
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.textContent).toBe('default content');
    expect(elm.firstElementChild.firstElementChild.childNodes).toHaveLength(1);
  });

  it('should use components default slot node content', async () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        render() {
          return h('spider', null, h('slot', null, h('div', null, 'default content')));
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-test></ion-test>');
    const elm = await waitForLoad(plt, node, 'ion-test');

    expect(elm.firstElementChild.nodeName).toBe('SPIDER');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('default content');
  });

  it('should relocate nested named slot nodes', async () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentConstructor: class {
        render() {
          return h('monkey', null, h('slot', { name: 'start' }));
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-test><tiger slot="start">88</tiger></ion-test>');

    const elm = await waitForLoad(plt, node, 'ion-test');
    expect(elm.firstElementChild.nodeName).toBe('MONKEY');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('TIGER');
    expect(elm.firstElementChild.firstElementChild.textContent).toBe('88');
    expect(elm.firstElementChild.firstElementChild.childNodes).toHaveLength(1);
  });

  it('no content', async () => {
    const { parentElm, childElm } = await mount({
      parentVNode: h('lion', null, h('ion-child', null)),
      childVNode: h('slot', null)
    });
    expect(parentElm.children).toHaveLength(1);
    expect(parentElm.firstElementChild.nodeName).toBe('LION');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.children).toHaveLength(0);

    render(plt, {}, parentElm, {});
    render(plt, {}, childElm, {});
    render(plt, {}, parentElm, {});
    render(plt, {}, childElm, {});

    expect(parentElm.firstElementChild.nodeName).toBe('LION');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.children).toHaveLength(0);
  });

  it('no content, nested child slot', async () => {
    const { parentElm, childElm } = await mount({
      parentVNode: h('giraffe', null, h('ion-child', null)),
      childVNode: h('fish', null, h('slot', null))
    });

    expect(parentElm.children).toHaveLength(1);
    expect(parentElm.firstElementChild.nodeName).toBe('GIRAFFE');
    expect(parentElm.firstElementChild.children).toHaveLength(1);
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.children).toHaveLength(1);
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FISH');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.children).toHaveLength(0);

    render(plt, {}, parentElm, {});
    render(plt, {}, childElm, {});
    render(plt, {}, parentElm, {});
    render(plt, {}, childElm, {});

    expect(parentElm.firstElementChild.nodeName).toBe('GIRAFFE');
    expect(parentElm.firstElementChild.children).toHaveLength(1);
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.children).toHaveLength(1);
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FISH');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.children).toHaveLength(0);
  });

  it('should put parent content in child default slot', async () => {
    const { parentElm, childElm } = await mount({
      parentVNode: h('hippo', null,
        h('ion-child', null,
          h('aardvark', null, parentInstance.msg)
        )
      ),
      childVNode: h('slot', null)
    });
    expect(parentElm.firstElementChild.nodeName).toBe('HIPPO');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('AARDVARK');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');

    render(plt, {}, parentElm, {});
    render(plt, {}, childElm, {});
    render(plt, {}, parentElm, {});
    render(plt, {}, childElm, {});

    expect(parentElm.firstElementChild.nodeName).toBe('HIPPO');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('AARDVARK');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');
  });

  it('should relocate parent content after child content dynamically changes slot wrapper tag', async () => {
    const plt = mockPlatform();

    const parentCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        innerH = h('h1', null, 'parent text');

        render() {
          return h('ion-child', null,
            this.innerH
          );
        }
      } as any
    });

    const childCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentConstructor: class {
        tag = 'section';

        render() {
          return  h(this.tag, null,
            h('slot', null)
          );
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const parentElm = await waitForLoad(plt, node, 'ion-parent');
    const childElm = await waitForLoad(plt, parentElm, 'ion-child');

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('SECTION');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('H1');
    expect(parentElm.firstElementChild.textContent).toBe('parent text');

    let instance = plt.instanceMap.get(parentElm);
    instance.innerH = h('h6', null, 'parent text update');
    render(plt, parentCmpMeta, parentElm, instance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('SECTION');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('H6');
    expect(parentElm.firstElementChild.textContent).toBe('parent text update');

    instance = plt.instanceMap.get(childElm);
    instance.tag = 'article';
    render(plt, childCmpMeta, childElm, instance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ARTICLE');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('H6');
    expect(parentElm.firstElementChild.textContent).toBe('parent text update');
  });

  it('should put parent content in child nested default slot', async () => {
    const { parentElm, childElm } = await mount({
      parentVNode: h('badger', null,
        h('ion-child', null,
          h('dingo', null, parentInstance.msg)
        )
      ),
      childVNode: h('camel', null,
        h('owl', null,
          h('slot', null)
        )
      )
    });

    expect(parentElm.firstElementChild.nodeName).toBe('BADGER');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CAMEL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('OWL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('DINGO');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');

    render(plt, {}, childElm, {});
    render(plt, {}, parentElm, {});
    render(plt, {}, childElm, {});
    render(plt, {}, parentElm, {});

    expect(parentElm.firstElementChild.nodeName).toBe('BADGER');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CAMEL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('OWL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('DINGO');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');
  });

  it('should render conditional content into a nested default slot', async () => {
    const plt: any = mockPlatform();

    const parentCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        msg = 'parent message';

        render() {
          return h('ion-child', null,
            h('slot', null)
          );
        }
      } as any
    });

    const childCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentConstructor: class {
        test = 0;
        render() {
          this.test++;

          if (this.test === 1) {
            return null;
          }

          if (this.test === 2) {
            return [
              h('div', null, 'content 1'),
              h('div', null, 'content 2')
            ];
          }

          if (this.test === 3) {
            return null;
          }

          return  h('div', null, 'content 4');
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const parentElm = await waitForLoad(plt, node, 'ion-parent');
    const childElm = await waitForLoad(plt, parentElm, 'ion-child');

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.textContent).toBe('');

    const instance = plt.instanceMap.get(childElm);
    render(plt, parentCmpMeta, childElm, instance);
    expect(parentElm.firstElementChild.textContent).toBe('content 1content 2');

    render(plt, childCmpMeta, childElm, instance);
    expect(parentElm.firstElementChild.textContent).toBe('');

    render(plt, childCmpMeta, childElm, instance);
    expect(parentElm.firstElementChild.textContent).toBe('content 4');
  });

  it('should update parent content in child default slot', async () => {

    const parentCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        msg = 'parent message';

        render() {
          return h('cheetah', null,
            h('ion-child', null,
              h('bear', null, this.msg)
            )
          );
        }
      } as any
    });

    const childCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentConstructor: class {
        render() {
          return h('chipmunk', null,
            h('slot', null)
          );
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const parentElm = await waitForLoad(plt, node, 'ion-parent');
    await waitForLoad(plt, parentElm, 'ion-child');

    expect(parentElm.firstElementChild.nodeName).toBe('CHEETAH');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');

    const parentInstance = plt.instanceMap.get(parentElm);
    parentInstance.msg = 'change 1';
    render(plt, parentCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('CHEETAH');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 1');

    parentInstance.msg = 'change 2';
    render(plt, childCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('CHEETAH');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 2');
  });

  it('should update parent content inner text in child nested default slot', async () => {

    const parentCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        msg = 'parent message';

        render() {
          return h('ion-child', null,
            h('whale', null, this.msg)
          );
        }
      } as any
    });

    const childCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentConstructor: class {
        render() {
          return h('bull', null,
            h('slot', null)
          );
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const parentElm = await waitForLoad(plt, node, 'ion-parent');
    await waitForLoad(plt, parentElm, 'ion-child');

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('BULL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');

    const parentInstance = plt.instanceMap.get(parentElm);
    parentInstance.msg = 'change 1';
    render(plt, parentCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('BULL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 1');

    parentInstance.msg = 'change 2';
    render(plt, childCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('BULL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 2');
  });

  it('should allow multiple slots with same name', async () => {
    let values = 0;

    const parentCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        render() {
          return h('ion-child', null,
            h('falcon', { slot: 'start' }, ++values),
            h('eagle', { slot: 'start' }, ++values),
          );
        }
      } as any
    });

    const childCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentConstructor: class {
        render() {
          return h('mouse', null,
            h('slot', null),
            h('slot', { name: 'start' }),
            h('slot', { name: 'end' })
          );
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const parentElm = await waitForLoad(plt, node, 'ion-parent');
    await waitForLoad(plt, parentElm, 'ion-child');

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('MOUSE');
    expect(parentElm.firstElementChild.firstElementChild.children[0].nodeName).toBe('FALCON');
    expect(parentElm.firstElementChild.firstElementChild.children[0].textContent).toBe('1');
    expect(parentElm.firstElementChild.firstElementChild.children[1].nodeName).toBe('EAGLE');
    expect(parentElm.firstElementChild.firstElementChild.children[1].textContent).toBe('2');

    const parentInstance = plt.instanceMap.get(parentElm);
    render(plt, parentCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('MOUSE');
    expect(parentElm.firstElementChild.firstElementChild.children[0].nodeName).toBe('FALCON');
    expect(parentElm.firstElementChild.firstElementChild.children[0].textContent).toBe('3');
    expect(parentElm.firstElementChild.firstElementChild.children[1].nodeName).toBe('EAGLE');
    expect(parentElm.firstElementChild.firstElementChild.children[1].textContent).toBe('4');

    render(plt, childCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('MOUSE');
    expect(parentElm.firstElementChild.firstElementChild.children[0].nodeName).toBe('FALCON');
    expect(parentElm.firstElementChild.firstElementChild.children[0].textContent).toBe('5');
    expect(parentElm.firstElementChild.firstElementChild.children[1].nodeName).toBe('EAGLE');
    expect(parentElm.firstElementChild.firstElementChild.children[1].textContent).toBe('6');
  });

  it('should only render nested named slots and default slot', async () => {
    let values = 0;

    const parentCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        render() {
          return h('ion-child', null,
            h('butterfly', null, (++values).toString()),
            h('fox', { slot: 'end' }, ++values),
            h('ferret', { slot: 'start' }, ++values)
          );
        }
      } as any
    });

    const childCmpMeta = mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentConstructor: class {
        render() {
          return h('flamingo', null,
            h('slot', { name: 'start' }),
            h('horse', null,
              h('slot', null),
              h('bullfrog', null,
                h('slot', { name: 'end' })
              )
            )
          );
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const parentElm = await waitForLoad(plt, node, 'ion-parent');
    await waitForLoad(plt, parentElm, 'ion-child');

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('FLAMINGO');
    expect(parentElm.firstElementChild.firstElementChild.children[0].nodeName).toBe('FERRET');
    expect(parentElm.firstElementChild.firstElementChild.children[0].textContent).toBe('3');
    expect(parentElm.firstElementChild.firstElementChild.children[1].nodeName).toBe('HORSE');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[0].nodeName).toBe('BUTTERFLY');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[0].textContent).toBe('1');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].nodeName).toBe('BULLFROG');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].children[0].nodeName).toBe('FOX');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].children[0].textContent).toBe('2');

    const parentInstance = plt.instanceMap.get(parentElm);
    render(plt, parentCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('FLAMINGO');
    expect(parentElm.firstElementChild.firstElementChild.children[0].nodeName).toBe('FERRET');
    expect(parentElm.firstElementChild.firstElementChild.children[0].textContent).toBe('6');
    expect(parentElm.firstElementChild.firstElementChild.children[1].nodeName).toBe('HORSE');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[0].nodeName).toBe('BUTTERFLY');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[0].textContent).toBe('4');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].nodeName).toBe('BULLFROG');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].children[0].nodeName).toBe('FOX');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].children[0].textContent).toBe('5');

    render(plt, childCmpMeta, parentElm, parentInstance);

    expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('FLAMINGO');
    expect(parentElm.firstElementChild.firstElementChild.children[0].nodeName).toBe('FERRET');
    expect(parentElm.firstElementChild.firstElementChild.children[0].textContent).toBe('9');
    expect(parentElm.firstElementChild.firstElementChild.children[1].nodeName).toBe('HORSE');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[0].nodeName).toBe('BUTTERFLY');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[0].textContent).toBe('7');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].nodeName).toBe('BULLFROG');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].children[0].nodeName).toBe('FOX');
    expect(parentElm.firstElementChild.firstElementChild.children[1].children[1].children[0].textContent).toBe('8');
  });

  it('should allow nested default slots', async () => {
    let values = 0;

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        render() {
          return h('test-1', null,
            h('test-2', null,
              h('goat', null, (++values).toString())
            )
          );
        }
      } as any
    });

    const test1CmpMeta = mockDefine(plt, {
      tagNameMeta: 'test-1',
      componentConstructor: class {
        render() {
          return h('seal', null,
            h('slot', null)
          );
        }
      } as any
    });

    const test2CmpMeta = mockDefine(plt, {
      tagNameMeta: 'test-2',
      componentConstructor: class {
        render() {
          return h('goose', null,
            h('slot', null)
          );
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const elm = await waitForLoad(plt, node, 'ion-parent');
    await waitForLoad(plt, node, 'test-1');
    await waitForLoad(plt, node, 'test-2');

    expect(elm.firstElementChild.nodeName).toBe('TEST-1');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('TEST-2');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOOSE');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOAT');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('1');

    let instance = plt.instanceMap.get(elm);
    render(plt, test1CmpMeta, elm, instance);

    expect(elm.firstElementChild.nodeName).toBe('TEST-1');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('TEST-2');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOOSE');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOAT');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('2');

    instance = plt.instanceMap.get(elm);
    render(plt, test2CmpMeta, elm, instance);

    expect(elm.firstElementChild.nodeName).toBe('TEST-1');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('TEST-2');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOOSE');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOAT');
    expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('3');
  });

  it('should allow nested default slots w/ default slot content', async () => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentConstructor: class {
        render() {
          return h('test-1', null,
            h('test-2', null,
              h('goat', null, 'hey goat!')
            )
          );
        }
      } as any
    });

    const test1CmpMeta = mockDefine(plt, {
      tagNameMeta: 'test-1',
      componentConstructor: class {
        render() {
          return h('seal', null,
            h('slot', null, h('div', null, 'hey seal!'))
          );
        }
      } as any
    });

    const test2CmpMeta = mockDefine(plt, {
      tagNameMeta: 'test-2',
      componentConstructor: class {
        render() {
          return h('goose', null,
            h('slot', null, h('div', null, 'hey goose!'))
          );
        }
      } as any
    });

    const node = await mockConnect(plt, '<ion-parent></ion-parent>');

    const elm = await waitForLoad(plt, node, 'ion-parent');
    await waitForLoad(plt, node, 'test-1');
    await waitForLoad(plt, node, 'test-2');

    expect(elm.firstElementChild.nodeName).toBe('TEST-1');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
    expect(elm.firstElementChild.firstElementChild.children[0].nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.children[0].hasAttribute('hidden')).toBe(true);
    expect(elm.firstElementChild.firstElementChild.children[1].nodeName).toBe('TEST-2');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.nodeName).toBe('GOOSE');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[0].nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[0].hasAttribute('hidden')).toBe(true);
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[1].nodeName).toBe('GOAT');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[1].textContent).toBe('hey goat!');

    let instance = plt.instanceMap.get(elm);
    render(plt, test1CmpMeta, elm, instance);

    expect(elm.firstElementChild.nodeName).toBe('TEST-1');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
    expect(elm.firstElementChild.firstElementChild.children[0].nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.children[0].hasAttribute('hidden')).toBe(true);
    expect(elm.firstElementChild.firstElementChild.children[1].nodeName).toBe('TEST-2');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.nodeName).toBe('GOOSE');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[0].nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[0].hasAttribute('hidden')).toBe(true);
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[1].nodeName).toBe('GOAT');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[1].textContent).toBe('hey goat!');

    instance = plt.instanceMap.get(elm);
    render(plt, test2CmpMeta, elm, instance);

    expect(elm.firstElementChild.nodeName).toBe('TEST-1');
    expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
    expect(elm.firstElementChild.firstElementChild.children[0].nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.children[0].hasAttribute('hidden')).toBe(true);
    expect(elm.firstElementChild.firstElementChild.children[1].nodeName).toBe('TEST-2');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.nodeName).toBe('GOOSE');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[0].nodeName).toBe('SLOT-FB');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[0].hasAttribute('hidden')).toBe(true);
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[1].nodeName).toBe('GOAT');
    expect(elm.firstElementChild.firstElementChild.children[1].firstElementChild.children[1].textContent).toBe('hey goat!');
  });

});
