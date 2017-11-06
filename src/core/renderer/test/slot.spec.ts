import { h } from '../h';
import { HostElement, VNode } from '../../../util/interfaces';
import { mockConnect, mockDefine, mockPlatform, waitForLoad } from '../../../testing/mocks';
import { render } from '../../instance/render';
import { SLOT_META } from '../../../util/constants';


describe('Component slot', () => {

  it('should relocate nested default slot nodes', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      slotMeta: SLOT_META.HasSlots,
      componentModule: class {
        render() {
          return h('spider', null, h('slot', null));
        }
      }
    });

    const node = mockConnect(plt, '<ion-test>88</ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.firstElementChild.nodeName).toBe('SPIDER');
      expect(elm.firstElementChild.childNodes[1].textContent).toBe('88');
      expect(elm.firstElementChild.childNodes.length).toBe(2);
    });
  });


  it('should relocate nested named slot nodes', () => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('monkey', null, h('slot', { name: 'start' }));
        }
      }
    });

    const node = mockConnect(plt, '<ion-test><tiger slot="start">88</tiger></ion-test>');

    return waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.firstElementChild.nodeName).toBe('MONKEY');
      expect(elm.firstElementChild.firstElementChild.nodeName).toBe('TIGER');
      expect(elm.firstElementChild.firstElementChild.textContent).toBe('88');
      expect(elm.firstElementChild.firstElementChild.childNodes.length).toBe(1);
    });
  });

  it('no content', async () => {
    const { parentElm, childElm } = await mount({
      parentVNode: h('lion', null, h('ion-child', null)),
      childVNode: h('slot', null)
    });
    expect(parentElm.childNodes.length).toBe(2);
    expect(parentElm.firstElementChild.nodeName).toBe('LION');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.childNodes.length).toBe(1);

    render(plt, parentElm, {}, false);
    render(plt, childElm, {}, false);
    render(plt, parentElm, {}, false);
    render(plt, childElm, {}, false);

    expect(parentElm.firstElementChild.nodeName).toBe('LION');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.childNodes[0].nodeName).toBe('#comment');
  });

  it('no content, nested child slot', async () => {
    const { parentElm, childElm } = await mount({
      parentVNode: h('giraffe', null, h('ion-child', null)),
      childVNode: h('fish', null, h('slot', null))
    });
    expect(parentElm.childNodes.length).toBe(2);
    expect(parentElm.firstElementChild.nodeName).toBe('GIRAFFE');
    expect(parentElm.firstElementChild.childNodes.length).toBe(1);
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.childNodes.length).toBe(1);
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FISH');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.childNodes.length).toBe(1);

    render(plt, parentElm, {}, false);
    render(plt, childElm, {}, false);
    render(plt, parentElm, {}, false);
    render(plt, childElm, {}, false);

    expect(parentElm.firstElementChild.nodeName).toBe('GIRAFFE');
    expect(parentElm.firstElementChild.childNodes.length).toBe(1);
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.childNodes.length).toBe(1);
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FISH');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.childNodes.length).toBe(1);
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

    render(plt, parentElm, {}, false);
    render(plt, childElm, {}, false);
    render(plt, parentElm, {}, false);
    render(plt, childElm, {}, false);

    expect(parentElm.firstElementChild.nodeName).toBe('HIPPO');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('AARDVARK');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');
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

    render(plt, childElm, {}, false);
    render(plt, parentElm, {}, false);
    render(plt, childElm, {}, false);
    render(plt, parentElm, {}, false);

    expect(parentElm.firstElementChild.nodeName).toBe('BADGER');
    expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CAMEL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('OWL');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('DINGO');
    expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');
  });

  it('should render conditional content into a nested default slot', () => {
    var plt: any = mockPlatform();
    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        msg = 'parent message';

        render() {
          return h('ion-child', null,
            h('slot', null)
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
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
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      return waitForLoad(plt, parentElm, 'ion-child').then(childElm => {
        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.textContent).toBe('');

        render(plt, childElm, {}, false);
        expect(parentElm.firstElementChild.textContent).toBe('content 1content 2');

        render(plt, childElm, {}, false);
        expect(parentElm.firstElementChild.textContent).toBe('');

        render(plt, childElm, {}, false);
        expect(parentElm.firstElementChild.textContent).toBe('content 4');
      });
    });

  });

  it('should update parent content in child default slot', () => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        msg = 'parent message';

        render() {
          return h('cheetah', null,
            h('ion-child', null,
              h('bear', null, this.msg)
            )
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('chipmunk', null,
            h('slot', null)
          );
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      return waitForLoad(plt, parentElm, 'ion-child').then(() => {

        expect(parentElm.firstElementChild.nodeName).toBe('CHEETAH');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');

        parentElm._instance.msg = 'change 1';
        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('CHEETAH');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 1');

        parentElm._instance.msg = 'change 2';
        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('CHEETAH');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('CHIPMUNK');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('BEAR');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 2');
      });
    });
  });

  it('should update parent content inner text in child nested default slot', () => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        msg = 'parent message';

        render() {
          return h('ion-child', null,
            h('whale', null, this.msg)
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('bull', null,
            h('slot', null)
          );
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      return waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('BULL');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('parent message');

        parentElm._instance.msg = 'change 1';
        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('BULL');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 1');

        parentElm._instance.msg = 'change 2';
        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('BULL');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('WHALE');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('change 2');
      });
    });
  });

  it('should allow multiple slots with same name', () => {
    let values = 0;

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('ion-child', null,
            h('falcon', { slot: 'start' }, ++values),
            h('eagle', { slot: 'start' }, ++values),
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('mouse', null,
            h('slot', null),
            h('slot', { name: 'start' }),
            h('slot', { name: 'end' })
          );
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      return waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('MOUSE');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FALCON');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('1');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[2].nodeName).toBe('EAGLE');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[2].textContent).toBe('2');

        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('MOUSE');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FALCON');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('3');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[2].nodeName).toBe('EAGLE');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[2].textContent).toBe('4');

        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('MOUSE');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FALCON');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('5');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[2].nodeName).toBe('EAGLE');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[2].textContent).toBe('6');
      });
    });

  });

  it('should only render nested named slots and default slot', () => {
    let values = 0;

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('ion-child', null,
            h('butterfly', null, (++values).toString()),
            h('fox', { slot: 'end' }, ++values),
            h('ferret', { slot: 'start' }, ++values)
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
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
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      return waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('FLAMINGO');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FERRET');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('3');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].nodeName).toBe('HORSE');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[1].nodeName).toBe('BUTTERFLY');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[1].textContent).toBe('1');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].nodeName).toBe('BULLFROG');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].childNodes[0].nodeName).toBe('FOX');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].childNodes[0].textContent).toBe('2');

        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('FLAMINGO');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FERRET');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('6');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].nodeName).toBe('HORSE');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[1].nodeName).toBe('BUTTERFLY');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[1].textContent).toBe('4');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].nodeName).toBe('BULLFROG');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].childNodes[0].nodeName).toBe('FOX');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].childNodes[0].textContent).toBe('5');

        render(plt, parentElm, {}, false);

        expect(parentElm.firstElementChild.nodeName).toBe('ION-CHILD');
        expect(parentElm.firstElementChild.firstElementChild.nodeName).toBe('FLAMINGO');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('FERRET');
        expect(parentElm.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('9');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].nodeName).toBe('HORSE');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[1].nodeName).toBe('BUTTERFLY');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[1].textContent).toBe('7');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].nodeName).toBe('BULLFROG');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].childNodes[0].nodeName).toBe('FOX');
        expect(parentElm.firstElementChild.firstElementChild.childNodes[1].childNodes[2].childNodes[0].textContent).toBe('8');
      });
    });
  });

  it('should allow nested default slots', () => {
    let values = 0;

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('test-1', null,
            h('test-2', null,
              h('goat', null, (++values).toString())
            )
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'test-1',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('seal', null,
            h('slot', null)
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'test-2',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return h('goose', null,
            h('slot', null)
          );
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(elm => {
      return waitForLoad(plt, elm, 'test-1').then(() => {
        return waitForLoad(plt, elm, 'test-2').then(() => {

          expect(elm.firstElementChild.nodeName).toBe('TEST-1');
          expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('TEST-2');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOOSE');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOAT');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('1');

          render(plt, elm, {}, false);

          expect(elm.firstElementChild.nodeName).toBe('TEST-1');
          expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('TEST-2');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOOSE');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOAT');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('2');

          render(plt, elm, {}, false);

          expect(elm.firstElementChild.nodeName).toBe('TEST-1');
          expect(elm.firstElementChild.firstElementChild.nodeName).toBe('SEAL');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('TEST-2');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOOSE');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.nodeName).toBe('GOAT');
          expect(elm.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent).toBe('3');
        });
      });
    });
  });

  const parentInstance = {
    msg: ''
  };

  var plt: any;

  beforeEach(() => {
    parentInstance.msg = 'parent message';
    plt = mockPlatform();
  });

  function mount(options: {parentVNode: VNode, childVNode: VNode}): Promise<{ parentElm?: HostElement, childElm?: HostElement }> {
    const rtn: { parentElm?: HostElement, childElm?: HostElement } = {};

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return options.parentVNode;
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: SLOT_META.HasNamedSlots,
      componentModule: class {
        render() {
          return options.childVNode;
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    return waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      rtn.parentElm = parentElm;

      return waitForLoad(plt, parentElm, 'ion-child').then(childElm => {
        rtn.childElm = childElm;
        return rtn;
      });
    });
  }

});
