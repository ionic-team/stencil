import { h } from '../h';
import { HostElement, VNode } from '../../../util/interfaces';
import { HAS_SLOTS, HAS_NAMED_SLOTS } from '../../../util/constants';
import { mockConnect, mockDefine, mockPlatform, waitForLoad } from '../../../testing/mocks';


describe('Component slot', () => {
  const plt = mockPlatform();


  it('should relocate nested default slot nodes', (done) => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      slotMeta: HAS_SLOTS,
      componentModule: class {
        render() {
          return h('spider', null, h('slot', null));
        }
      }
    });

    const node = mockConnect(plt, '<ion-test>88</ion-test>');

    waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.childNodes[0].nodeName).toBe('SPIDER');
      expect(elm.childNodes[0].childNodes[0].textContent).toBe('88');
      expect(elm.childNodes[0].childNodes.length).toBe(1);
      done();
    });
  });


  it('should relocate nested named slot nodes', (done) => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      slotMeta: HAS_NAMED_SLOTS,
      componentModule: class {
        render() {
          return h('monkey', null, h('slot', { name: 'start' }));
        }
      }
    });

    const node = mockConnect(plt, '<ion-test><tiger slot="start">88</tiger></ion-test>');

    waitForLoad(plt, node, 'ion-test').then(elm => {
      expect(elm.childNodes[0].nodeName).toBe('MONKEY');
      expect(elm.childNodes[0].childNodes[0].nodeName).toBe('TIGER');
      expect(elm.childNodes[0].childNodes[0].textContent).toBe('88');
      expect(elm.childNodes[0].childNodes[0].childNodes.length).toBe(1);
      done();
    });
  });

  it('no content', (done) => {
    mount({
      parentVNode: h('lion', null, h('ion-child', null)),
      childVNode: h('slot', null)
    }, (parentElm, childElm) => {
      expect(parentElm.childNodes.length).toBe(1);
      expect(parentElm.childNodes[0].nodeName).toBe('LION');
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes.length).toBe(0);

      parentElm._render();
      childElm._render();
      parentElm._render();
      childElm._render();

      expect(parentElm.childNodes[0].nodeName).toBe('LION');
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes.length).toBe(0);

      done();
    });
  });

  it('no content, nested child slot', (done) => {
    mount({
      parentVNode: h('giraffe', null, h('ion-child', null)),
      childVNode: h('fish', null, h('slot', null))
    }, (parentElm, childElm) => {
      expect(parentElm.childNodes.length).toBe(1);
      expect(parentElm.childNodes[0].nodeName).toBe('GIRAFFE');
      expect(parentElm.childNodes[0].childNodes.length).toBe(1);
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes.length).toBe(1);
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FISH');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes.length).toBe(0);

      parentElm._render();
      childElm._render();
      parentElm._render();
      childElm._render();

      expect(parentElm.childNodes.length).toBe(1);
      expect(parentElm.childNodes[0].nodeName).toBe('GIRAFFE');
      expect(parentElm.childNodes[0].childNodes.length).toBe(1);
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes.length).toBe(1);
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FISH');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes.length).toBe(0);

      done();
    });
  });

  it('should put parent content in child default slot', done => {
    mount({
      parentVNode: h('hippo', null,
        h('ion-child', null,
          h('aardvark', null, parentInstance.msg)
        )
      ),
      childVNode: h('slot', null)
    }, (parentElm, childElm) => {
      expect(parentElm.childNodes[0].nodeName).toBe('HIPPO');
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('AARDVARK');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');

      parentElm._render();
      childElm._render();
      parentElm._render();
      childElm._render();

      expect(parentElm.childNodes[0].nodeName).toBe('HIPPO');
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('AARDVARK');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');

      done();
    });
  });

  it('should put parent content in child nested default slot', done => {
    mount({
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
    }, (parentElm, childElm) => {
      expect(parentElm.childNodes[0].nodeName).toBe('BADGER');
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('CAMEL');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('OWL');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('DINGO');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');

      childElm._render();
      parentElm._render();
      childElm._render();
      parentElm._render();

      expect(parentElm.childNodes[0].nodeName).toBe('BADGER');
      expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('CAMEL');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('OWL');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('DINGO');
      expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');

      done();
    });
  });

  it('should update parent content in child default slot', done => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: HAS_NAMED_SLOTS,
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
      slotMeta: HAS_NAMED_SLOTS,
      componentModule: class {
        render() {
          return h('chipmunk', null,
            h('slot', null)
          );
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(() => {

        expect(parentElm.childNodes[0].nodeName).toBe('CHEETAH');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('CHIPMUNK');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('BEAR');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');

        parentElm.$instance.msg = 'change 1';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('CHEETAH');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('CHIPMUNK');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('BEAR');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('change 1');

        parentElm.$instance.msg = 'change 2';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('CHEETAH');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('CHIPMUNK');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('BEAR');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('change 2');

        done();
      });
    });
  });

  it('should update parent content inner text in child nested default slot', done => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: HAS_NAMED_SLOTS,
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
      slotMeta: HAS_NAMED_SLOTS,
      componentModule: class {
        render() {
          return h('bull', null,
            h('slot', null)
          );
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('BULL');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('WHALE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');

        parentElm.$instance.msg = 'change 1';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('BULL');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('WHALE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('change 1');

        parentElm.$instance.msg = 'change 2';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('BULL');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('WHALE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('change 2');

        done();
      });
    });
  });

  it('should allow multiple slots with same name', done => {
    let values = 0;

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: HAS_NAMED_SLOTS,
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
      slotMeta: HAS_NAMED_SLOTS,
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

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('MOUSE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FALCON');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('1');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('EAGLE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].textContent).toBe('2');

        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('MOUSE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FALCON');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('3');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('EAGLE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].textContent).toBe('4');

        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('MOUSE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FALCON');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('5');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('EAGLE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].textContent).toBe('6');

        done();
      });
    });

  });

  it('should only render nested named slots and default slot', () => {
    let values = 0;

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: HAS_NAMED_SLOTS,
      componentModule: class {
        render() {
          return h('ion-child', null,
            h('butterfly', null, (++values).toString()),
            h('fox', { a: { slot: 'end' } }, ++values),
            h('ferret', { a: { slot: 'start' } }, ++values)
          );
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: HAS_NAMED_SLOTS,
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

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('FLAMINGO');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FERRET');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('3');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('HORSE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[0].nodeName).toBe('BUTTERFLY');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[0].textContent).toBe('1');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].nodeName).toBe('BULLFROG');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].nodeName).toBe('FOX');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].textContent).toBe('2');

        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('FLAMINGO');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FERRET');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('6');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('HORSE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[0].nodeName).toBe('BUTTERFLY');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[0].textContent).toBe('4');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].nodeName).toBe('BULLFROG');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].nodeName).toBe('FOX');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].textContent).toBe('5');

        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('FLAMINGO');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('FERRET');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('9');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('HORSE');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[0].nodeName).toBe('BUTTERFLY');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[0].textContent).toBe('7');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].nodeName).toBe('BULLFROG');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].nodeName).toBe('FOX');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].textContent).toBe('8');
      });
    });
  });

  it('should allow nested default slots', () => {
    let values = 0;

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: HAS_NAMED_SLOTS,
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
      slotMeta: HAS_NAMED_SLOTS,
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
      slotMeta: HAS_NAMED_SLOTS,
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

          expect(elm.childNodes[0].nodeName).toBe('TEST-1');
          expect(elm.childNodes[0].childNodes[0].nodeName).toBe('SEAL');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('TEST-2');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('GOOSE');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('GOAT');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('1');

          elm._render();

          expect(elm.childNodes[0].nodeName).toBe('TEST-1');
          expect(elm.childNodes[0].childNodes[0].nodeName).toBe('SEAL');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('TEST-2');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('GOOSE');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('GOAT');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('2');

          elm._render();

          expect(elm.childNodes[0].nodeName).toBe('TEST-1');
          expect(elm.childNodes[0].childNodes[0].nodeName).toBe('SEAL');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('TEST-2');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('GOOSE');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('GOAT');
          expect(elm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].textContent).toBe('3');
        });
      });
    });
  });

  const parentInstance = {
    msg: ''
  };

  beforeEach(() => {
    parentInstance.msg = 'parent message';
  });

  function mount(options: {parentVNode: VNode, childVNode: VNode}, done: (parentElm: HostElement, childElm: HostElement) => void) {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      slotMeta: HAS_NAMED_SLOTS,
      componentModule: class {
        render() {
          return options.parentVNode;
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      slotMeta: HAS_NAMED_SLOTS,
      componentModule: class {
        render() {
          return options.childVNode;
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(childElm => {
        done(parentElm, childElm);
      });
    });
  }

});
