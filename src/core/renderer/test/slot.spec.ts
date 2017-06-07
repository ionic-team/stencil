import { waitForLoad, mockConnect, mockDefine, mockPlatform } from '../../../test';
import { h, VNode } from '../patch';
import { HostElement } from '../../../util/interfaces';


describe('Component slot', () => {
  const plt = mockPlatform();


  it('should relocate nested default slot nodes', (done) => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModuleMeta: class {
        render() {
          return h('spider', [
            h('slot')
          ]);
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


  fit('should relocate nested named slot nodes', (done) => {
    mockDefine(plt, {
      tagNameMeta: 'ion-test',
      componentModuleMeta: class {
        render() {
          return h('monkey', [
            h('slot', { attrs: { name: 'start' } })
          ]);
        }
      }
    });

    const node = mockConnect(plt, '<ion-test><tiger slot="start">88</tiger></ion-test>');

    waitForLoad(plt, node, 'ion-test').then(elm => {
      console.log(elm.outerHTML)
      expect(elm.childNodes[0].nodeName).toBe('MONKEY');
      expect(elm.childNodes[0].childNodes[0].nodeName).toBe('TIGER');
      expect(elm.childNodes[0].childNodes[0].textContent).toBe('88');
      expect(elm.childNodes[0].childNodes[0].childNodes.length).toBe(1);
      done();
    });
  });

  it('no content', (done) => {
    mount({
      parentVNode: h('div', [
        h('ion-child')
      ]),
      childVNode: h('div', [
        h('slot')
      ])
    }, (elm) => {
      expect(elm.childNodes[0].nodeName).toBe('ION-CHILD');
      expect(elm.childNodes[0].childNodes.length).toBe(0);
      done();
    });
  });

  it('no content, nested child slot', (done) => {
    mount({
      parentVNode: h('div', [
        h('ion-child')
      ]),
      childVNode: h('div', [
        h('fish', [
          h('slot')
        ])
      ])
    }, (elm) => {
      expect(elm.childNodes[0].nodeName).toBe('ION-CHILD');
      expect(elm.childNodes[0].childNodes[0].nodeName).toBe('FISH');
      expect(elm.childNodes[0].childNodes[0].childNodes.length).toBe(0);
      done();
    });
  });

  it('should put parent content in child default slot', done => {
    mount({
      parentVNode: h('div', [
        h('ion-child', [
          h('p', parentInstance.msg)
        ])
      ]),
      childVNode: h('div', [
        h('slot')
      ])
    }, (elm) => {
      expect(elm.childNodes[0].childNodes[0].nodeName).toBe('P');
      expect(elm.childNodes[0].childNodes[0].textContent).toBe('parent message');
      done();
    });
  });

  it('should put parent content in child nested default slot', done => {
    mount({
      parentVNode: h('div', [
        h('ion-child', [
          h('parent-div', parentInstance.msg)
        ])
      ]),
      childVNode: h('div', [
        h('child-div', [
          h('slot')
        ])
      ])
    }, (elm) => {
      expect(elm.childNodes[0].nodeName).toBe('ION-CHILD');
      expect(elm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
      expect(elm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('PARENT-DIV');
      expect(elm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');
      done();
    });
  });

  it('should update parent content in child default slot', done => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentModuleMeta: class {
        msg = 'parent message';

        render() {
          return h('div', [
            h('ion-child', [
              h('p', this.msg)
            ])
          ]);
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentModuleMeta: class {
        render() {
          return h('div', [
            h('slot')
          ]);
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.childNodes[0].childNodes[0].textContent).toBe('parent message');

        parentElm.$instance.msg = 'changed';
        parentElm._render();

        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('P');
        expect(parentElm.childNodes[0].childNodes[0].textContent).toBe('changed');

        done();
      });
    });
  });

  it('should update parent content text in child nested default slot', done => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentModuleMeta: class {
        msg = 'parent message';

        render() {
          return h('div', [
            h('ion-child', this.msg)
          ]);
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentModuleMeta: class {
        render() {
          return h('div', [
            h('child-div', [
              h('slot')
            ])
          ]);
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].textContent).toBe('parent message');

        parentElm.$instance.msg = 'change 1';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].textContent).toBe('change 1');

        parentElm.$instance.msg = 'change 2';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].textContent).toBe('change 2');

        done();
      });
    });
  });

  it('should update parent content inner text in child nested default slot', done => {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentModuleMeta: class {
        msg = 'parent message';

        render() {
          return h('div', [
            h('ion-child', [
              h('parent-div', this.msg)
            ])
          ]);
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentModuleMeta: class {
        render() {
          return h('div', [
            h('child-div', [
              h('slot')
            ])
          ]);
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('PARENT-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('parent message');

        parentElm.$instance.msg = 'change 1';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('PARENT-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('change 1');

        parentElm.$instance.msg = 'change 2';
        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('PARENT-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('change 2');

        done();
      });
    });
  });

  it('should allow multiple slots with same name', done => {
    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentModuleMeta: class {
        msg = 'parent message';

        render() {
          return h('div', [
            h('ion-child', [
              h('p', { attrs: { slot: 'start' } }, '1'),
              h('p', { attrs: { slot: 'start' } }, Math.random().toString()),
            ])
          ]);
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentModuleMeta: class {
        render() {
          return h('div', [
            h('child-div', [
              h('slot'),
              h('slot', { attrs: { name: 'start' } }),
              h('slot', { attrs: { name: 'end' } })
            ])
          ]);
        }
      }
    });

    const node = mockConnect(plt, '<ion-parent></ion-parent>');

    waitForLoad(plt, node, 'ion-parent').then(parentElm => {
      waitForLoad(plt, parentElm, 'ion-child').then(() => {
        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('P');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('1');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('P');

        parentElm._render();

        expect(parentElm.childNodes[0].nodeName).toBe('ION-CHILD');
        expect(parentElm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('P');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('1');
        expect(parentElm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('P');

        done();
      });
    });

  });

  it('should only render default parts not selected', done => {
    mount({
      parentVNode: h('div', [
        h('ion-child', [
          h('div', 'foo'),
          h('p', { attrs: { slot: 'start' } }, '1'),
          h('p', { attrs: { slot: 'end' } }, Math.random().toString())
        ])
      ]),
      childVNode: h('div', [
        h('child-div', [
          h('slot', { attrs: { name: 'start' } }),
          h('slot'),
          h('slot', { attrs: { name: 'end' } })
        ])
      ])
    }, (elm) => {
      expect(elm.childNodes[0].nodeName).toBe('ION-CHILD');
      expect(elm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
      expect(elm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('P');
      expect(elm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('1');
      expect(elm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('DIV');
      expect(elm.childNodes[0].childNodes[0].childNodes[1].textContent).toBe('foo');
      expect(elm.childNodes[0].childNodes[0].childNodes[2].nodeName).toBe('P');

      done();
    });
  });

  it('should only match direct children slot names', done => {
    // mount({
    //   childTemplate: `
    //     <div>
    //       <slot name="a"><p>fallback a</p></slot>
    //       <slot name="b"><p>fallback b</p></slot>
    //       <slot name="c"><p>fallback c</p></slot>
    //     </div>
    //   `,
    //   parentContent: `
    //     '<p slot="b">select b</p>
    //     '<span><p slot="b">nested b</p></span>
    //     '<span><p slot="c">nested c</p></span>
    //   `
    // })
    // expect(child.$el.children.length).toBe(3)
    // expect(child.$el.children[0].textContent).toBe('fallback a')
    // expect(child.$el.children[1].textContent).toBe('select b')
    // expect(child.$el.children[2].textContent).toBe('fallback c')

    mount({
      parentVNode: h('div', [
        h('ion-child', [
          h('p', { attrs: { slot: 'start' } }, '1'),
          h('span', [
            h('p', { attrs: { slot: 'end' } }, Math.random().toString())
          ])
        ])
      ]),
      childVNode: h('div', [
        h('child-div', [
          h('slot', { attrs: { name: 'start' } }),
          h('slot', { attrs: { name: 'end' } })
        ])
      ])
    }, (elm) => {
      console.log(elm.outerHTML)
      expect(elm.childNodes[0].nodeName).toBe('ION-CHILD');
      expect(elm.childNodes[0].childNodes[0].nodeName).toBe('CHILD-DIV');
      expect(elm.childNodes[0].childNodes[0].childNodes[0].nodeName).toBe('P');
      expect(elm.childNodes[0].childNodes[0].childNodes[0].textContent).toBe('1');
      expect(elm.childNodes[0].childNodes[0].childNodes[1].nodeName).toBe('DIV');
      expect(elm.childNodes[0].childNodes[0].childNodes[1].textContent).toBe('foo');
      expect(elm.childNodes[0].childNodes[0].childNodes[2].nodeName).toBe('P');

      done();
    });
  });

  // it('nested slots', done => {
  //   const vm = new Vue({
  //     template: '<test><test2><p>{{ msg }}</p></test2></test>',
  //     data: {
  //       msg: 'foo'
  //     },
  //     components: {
  //       test: {
  //         template: '<div><slot></slot></div>'
  //       },
  //       test2: {
  //         template: '<div><slot></slot></div>'
  //       }
  //     }
  //   }).$mount()
  //   expect(vm.$el.innerHTML).toBe('<div><p>foo</p></div>')
  //   vm.msg = 'bar'
  //   waitForUpdate(() => {
  //     expect(vm.$el.innerHTML).toBe('<div><p>bar</p></div>')
  //   }).then(done)
  // })

  // it('default slot should use fallback content if has only whitespace', () => {
  //   mount({
  //     childTemplate: `
  //       <div>
  //         <slot name="first"><p>first slot</p></slot>
  //         <slot><p>this is the default slot</p></slot>
  //         <slot name="second"><p>second named slot</p></slot>
  //       </div>
  //     `,
  //     parentContent: `<div slot="first">1</div> <div slot="second">2</div> <div slot="second">2+</div>`
  //   })
  //   expect(child.$el.innerHTML).toBe(
  //     '<div>1</div> <p>this is the default slot</p> <div>2</div><div>2+</div>'
  //   )
  // })

  // // #3254
  // it('should not keep slot name when passed further down', () => {
  //   const vm = new Vue({
  //     template: '<test><span slot="foo">foo</span></test>',
  //     components: {
  //       test: {
  //         template: '<child><slot name="foo"></slot></child>',
  //         components: {
  //           child: {
  //             template: `
  //               <div>
  //                 <div class="default"><slot></slot></div>
  //                 <div class="named"><slot name="foo"></slot></div>
  //               </div>
  //             `
  //           }
  //         }
  //       }
  //     }
  //   }).$mount()
  //   expect(vm.$el.querySelector('.default').textContent).toBe('foo')
  //   expect(vm.$el.querySelector('.named').textContent).toBe('')
  // })

  // it('should not keep slot name when passed further down (nested)', () => {
  //   const vm = new Vue({
  //     template: '<wrap><test><span slot="foo">foo</span></test></wrap>',
  //     components: {
  //       wrap: {
  //         template: '<div><slot></slot></div>'
  //       },
  //       test: {
  //         template: '<child><slot name="foo"></slot></child>',
  //         components: {
  //           child: {
  //             template: `
  //               <div>
  //                 <div class="default"><slot></slot></div>
  //                 <div class="named"><slot name="foo"></slot></div>
  //               </div>
  //             `
  //           }
  //         }
  //       }
  //     }
  //   }).$mount()
  //   expect(vm.$el.querySelector('.default').textContent).toBe('foo')
  //   expect(vm.$el.querySelector('.named').textContent).toBe('')
  // })

  // it('should not keep slot name when passed further down (functional)', () => {
  //   const child = {
  //     template: `
  //       <div>
  //         <div class="default"><slot></slot></div>
  //         <div class="named"><slot name="foo"></slot></div>
  //       </div>
  //     `
  //   }

  //   const vm = new Vue({
  //     template: '<test><span slot="foo">foo</span></test>',
  //     components: {
  //       test: {
  //         functional: true,
  //         render (h, ctx) {
  //           const slots = ctx.slots()
  //           return h(child, slots.foo)
  //         }
  //       }
  //     }
  //   }).$mount()
  //   expect(vm.$el.querySelector('.default').textContent).toBe('foo')
  //   expect(vm.$el.querySelector('.named').textContent).toBe('')
  // })

  // // #3400
  // it('named slots should be consistent across re-renders', done => {
  //   const vm = new Vue({
  //     template: `
  //       <comp>
  //         <div slot="foo">foo</div>
  //       </comp>
  //     `,
  //     components: {
  //       comp: {
  //         data () {
  //           return { a: 1 }
  //         },
  //         template: `<div><slot name="foo"></slot>{{ a }}</div>`
  //       }
  //     }
  //   }).$mount()
  //   expect(vm.$el.textContent).toBe('foo1')
  //   vm.$children[0].a = 2
  //   waitForUpdate(() => {
  //     expect(vm.$el.textContent).toBe('foo2')
  //   }).then(done)
  // })

  // // #3437
  // it('should correctly re-create components in slot', done => {
  //   const calls = []
  //   const vm = new Vue({
  //     template: `
  //       <comp ref="child">
  //         <div slot="foo">
  //           <child></child>
  //         </div>
  //       </comp>
  //     `,
  //     components: {
  //       comp: {
  //         data () {
  //           return { ok: true }
  //         },
  //         template: `<div><slot name="foo" v-if="ok"></slot></div>`
  //       },
  //       child: {
  //         template: '<div>child</div>',
  //         created () {
  //           calls.push(1)
  //         },
  //         destroyed () {
  //           calls.push(2)
  //         }
  //       }
  //     }
  //   }).$mount()

  //   expect(calls).toEqual([1])
  //   vm.$refs.child.ok = false
  //   waitForUpdate(() => {
  //     expect(calls).toEqual([1, 2])
  //     vm.$refs.child.ok = true
  //   }).then(() => {
  //     expect(calls).toEqual([1, 2, 1])
  //     vm.$refs.child.ok = false
  //   }).then(() => {
  //     expect(calls).toEqual([1, 2, 1, 2])
  //   }).then(done)
  // })

  // it('renders static tree with text', () => {
  //   const vm = new Vue({
  //     template: `<div><test><template><div></div>Hello<div></div></template></test></div>`,
  //     components: {
  //       test: {
  //         template: '<div><slot></slot></div>'
  //       }
  //     }
  //   })
  //   vm.$mount()
  //   expect('Error when rendering root').not.toHaveBeenWarned()
  // })

  // // #4209
  // it('slot of multiple text nodes should not be infinitely merged', done => {
  //   const wrap = {
  //     template: `<inner ref="inner">foo<slot></slot></inner>`,
  //     components: {
  //       inner: {
  //         data: () => ({ a: 1 }),
  //         template: `<div>{{a}}<slot></slot></div>`
  //       }
  //     }
  //   }
  //   const vm = new Vue({
  //     template: `<wrap ref="wrap">bar</wrap>`,
  //     components: { wrap }
  //   }).$mount()

  //   expect(vm.$el.textContent).toBe('1foobar')
  //   vm.$refs.wrap.$refs.inner.a++
  //   waitForUpdate(() => {
  //     expect(vm.$el.textContent).toBe('2foobar')
  //   }).then(done)
  // })

  // // #4315
  // it('functional component passing slot content to stateful child component', done => {
  //   const ComponentWithSlots = {
  //     render (h) {
  //       return h('div', this.$slots.slot1)
  //     }
  //   }

  //   const FunctionalComp = {
  //     functional: true,
  //     render (h) {
  //       return h(ComponentWithSlots, [h('span', { slot: 'slot1' }, 'foo')])
  //     }
  //   }

  //   const vm = new Vue({
  //     data: { n: 1 },
  //     render (h) {
  //       return h('div', [this.n, h(FunctionalComp)])
  //     }
  //   }).$mount()

  //   expect(vm.$el.textContent).toBe('1foo')
  //   vm.n++
  //   waitForUpdate(() => {
  //     // should not lose named slot
  //     expect(vm.$el.textContent).toBe('2foo')
  //   }).then(done)
  // })

  // it('the elements of slot should be updated correctly', done => {
  //   const vm = new Vue({
  //     data: { n: 1 },
  //     template: '<div><test><span v-for="i in n" :key="i">{{ i }}</span><input value="a"/></test></div>',
  //     components: {
  //       test: {
  //         template: '<div><slot></slot></div>'
  //       }
  //     }
  //   }).$mount()
  //   expect(vm.$el.innerHTML).toBe('<div><span>1</span><input value="a"></div>')
  //   const input = vm.$el.querySelector('input')
  //   input.value = 'b'
  //   vm.n++
  //   waitForUpdate(() => {
  //     expect(vm.$el.innerHTML).toBe('<div><span>1</span><span>2</span><input value="a"></div>')
  //     expect(vm.$el.querySelector('input')).toBe(input)
  //     expect(vm.$el.querySelector('input').value).toBe('b')
  //   }).then(done)
  // });

  const parentInstance = {
    msg: ''
  };

  beforeEach(() => {
    parentInstance.msg = 'parent message';
  });

  function mount(options: {parentVNode: VNode, childVNode: VNode}, done: (parentElm: HostElement, childElm: HostElement) => void) {

    mockDefine(plt, {
      tagNameMeta: 'ion-parent',
      componentModuleMeta: class {
        render() {
          return options.parentVNode;
        }
      }
    });

    mockDefine(plt, {
      tagNameMeta: 'ion-child',
      componentModuleMeta: class {
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
