import * as d from '../../declarations';
import { mockElement, mockPlatform } from '../../testing/mocks';
import { h } from '../../renderer/vdom/h';
import { render } from '../render';
import { PROP_TYPE } from '../../util/constants';


describe('instance render', () => {

  let plt: d.PlatformApi;
  let hostElm: d.HostElement;

  beforeEach(() => {
    plt = mockPlatform();
    hostElm = mockElement('ion-tag') as d.HostElement;
  });


  it('should reflect standardized boolean attribute, falsy by removing attr, no render()', () => {
    class MyComponent {
      checked = false;

      static get properties() {
        return {
          checked: {
            type: Boolean,
            attr: 'checked',
            reflectToAttr: true
          }
        };
      }
    }

    plt.defineComponent({
      tagNameMeta: 'ion-tag',
      componentConstructor: MyComponent,
      membersMeta: {
        checked: {
          propType: PROP_TYPE.Boolean,
          attribName: 'checked',
          reflectToAttrib: true
        }
      }
    });

    hostElm.setAttribute('checked', '');

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(hostElm.getAttribute('checked')).toBe(null);
  });

  it('should reflect standardized boolean attribute, truthy w/ no value, no render()', () => {
    class MyComponent {
      checked = true;

      static get properties() {
        return {
          checked: {
            type: Boolean,
            attr: 'checked',
            reflectToAttr: true
          }
        };
      }
    }

    plt.defineComponent({
      tagNameMeta: 'ion-tag',
      componentConstructor: MyComponent,
      membersMeta: {
        checked: {
          propType: PROP_TYPE.Boolean,
          attribName: 'checked',
          reflectToAttrib: true
        }
      }
    });

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(hostElm.getAttribute('checked')).toBe('');
  });

  it('should reflect non-standardized boolean attribute, falsy w/ value', () => {
    class MyComponent {
      rflBool = false;

      static get properties() {
        return {
          rflBool: {
            type: Boolean,
            attr: 'my-attr-name',
            reflectToAttr: true
          }
        };
      }
    }

    plt.defineComponent({
      tagNameMeta: 'ion-tag',
      componentConstructor: MyComponent,
      membersMeta: {
        rflBool: {
          propType: PROP_TYPE.Boolean,
          attribName: 'my-attr-name',
          reflectToAttrib: true
        }
      }
    });

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(hostElm.hasAttribute('my-attr-name')).toBe(false);
  });

  it('should reflect non-standardized boolean attribute, truthy w/ value', () => {
    class MyComponent {
      rflBool = true;

      static get properties() {
        return {
          rflBool: {
            type: Boolean,
            attr: 'my-attr-name',
            reflectToAttr: true
          }
        };
      }
    }

    plt.defineComponent({
      tagNameMeta: 'ion-tag',
      componentConstructor: MyComponent,
      membersMeta: {
        rflBool: {
          propType: PROP_TYPE.Boolean,
          attribName: 'my-attr-name',
          reflectToAttrib: true
        }
      }
    });

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(hostElm.getAttribute('my-attr-name')).toBe('');
  });

  it('should reflect boolean property value to attribute, but not a standardized Boolean attribute, no render()', () => {
    class MyComponent {
      rflBool = true;

      static get properties() {
        return {
          rflBool: {
            type: Boolean,
            attr: 'my-attr-name',
            reflectToAttr: true
          }
        };
      }
    }

    plt.defineComponent({
      tagNameMeta: 'ion-tag',
      componentConstructor: MyComponent,
      membersMeta: {
        rflBool: {
          propType: PROP_TYPE.Boolean,
          attribName: 'my-attr-name',
          reflectToAttrib: true
        }
      }
    });

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(hostElm.getAttribute('my-attr-name')).toBe('');
  });

  it('should reflect number property value to attribute, w/ render()', () => {
    class MyComponent {
      rflNum = 88;

      render() {
        return h('div', 0, 'text');
      }

      static get properties() {
        return {
          rflNum: {
            type: Number,
            attr: 'my-attr-name',
            reflectToAttr: true
          }
        };
      }
    }

    plt.defineComponent({
      tagNameMeta: 'ion-tag',
      componentConstructor: MyComponent,
      membersMeta: {
        rflNum: {
          propType: PROP_TYPE.Number,
          attribName: 'my-attr-name',
          reflectToAttrib: true
        }
      }
    });

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(hostElm.getAttribute('my-attr-name')).toBe('88');
  });

  it('should reflect string property value to attribute, w/ hostData()', () => {
    class MyComponent {
      rflStr = 'str';

      hostData() {
        return {
          'host-data': 'hello'
        };
      }

      static get properties() {
        return {
          rflStr: {
            type: String,
            attr: 'my-attr-name',
            reflectToAttr: true
          }
        };
      }
    }

    plt.defineComponent({
      tagNameMeta: 'ion-tag',
      componentConstructor: MyComponent,
      membersMeta: {
        rflStr: {
          propType: PROP_TYPE.String,
          attribName: 'my-attr-name',
          reflectToAttrib: true
        }
      }
    });

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(vnode.ishost).toBe(true);

    expect(hostElm.getAttribute('my-attr-name')).toBe('str');
    expect(hostElm.getAttribute('host-data')).toBe('hello');
  });

  it('should create a vnode with no children when there is a render() but it returned null', () => {
    class MyComponent {
      render(): any {
        return null;
      }
    }

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(vnode).toBeDefined();
    expect(vnode.vchildren[0].vtext).toBe('');
  });

  it('should create a vnode when there is a render() and it returned a vnode', () => {
    class MyComponent {
      render() {
        return h('div', 0, 'text');
      }
    }

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(vnode).toBeDefined();
    expect(vnode.vchildren[0].vtag).toBe('div');
    expect(vnode.vchildren[0].vchildren[0].vtext).toBe('text');
  });

  it('should create a vnode for non null values of an array and create text for null values', () => {
    class MyComponent {
      render() {
        return [
          null,
          h('div', 0, 'text'),
          null
        ];
      }
    }

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(vnode).toBeDefined();
    expect(vnode.vchildren[0].vtext).toBe('');
    expect(vnode.vchildren[1].vtag).toBe('div');
    expect(vnode.vchildren[1].vchildren[0].vtext).toBe('text');
    expect(vnode.vchildren[2].vtext).toBe('');
  });

  it('should not create a vnode when there is no render() or hostData() or hostMeta', () => {
    class MyComponent { }

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(hostElm);
    expect(vnode).toBeUndefined();
  });

  it('should apply css even if there is not render function', () => {
    class MyComponent {}
    spyOn(plt, 'attachStyles');
    doRender(MyComponent);
    expect(plt.attachStyles).toHaveBeenCalled();
  });


  describe('hostData()', () => {
    it('should set classes', () => {
      class MyComponent {
        hostData() {
          return {
            class: {
              'a': true,
              'b': false,
              ' clAss   ': true,
              'My-class_ ': true,
              'not-a-class': false
            }
          };
        }
      }

      doRender(MyComponent);
      expect(hostElm).toMatchClasses(['a', 'clAss', 'My-class_']);
    });

    it('should set attributes', () => {
      class MyComponent {
        hostData() {
          return {
            'side': '  left   top ',
            'class': 'a b c  my-class',
            'empty': '',
            'type': null as string,
            'something': undefined as string,
            'number': 12,
            'appear': true,  // REVIEW!!
            'no-appear': false,  // REVIEW!!
          };
        }
      }

      doRender(MyComponent);

      expect(hostElm).toMatchClasses(['a', 'b', 'c', 'my-class']);
      expect(hostElm).toMatchAttributes({
        side: '  left   top ',
        empty: '',
        class: 'a b c my-class',
        number: '12',
        appear: 'true',
        'no-appear': 'false'
      });
    });

    it('should set classes and attributes', () => {
      class MyComponent {
        hostData() {
          return {
            type: null as string,
            number: 12,
            appear: 'true',
            class: {
              a: true,
              hola: true,
              b: false,
              c: false,
            }
          };
        }
      }

      doRender(MyComponent);

      expect(hostElm).toMatchClasses(['a', 'hola']);
      expect(hostElm).toMatchAttributes({
        class: 'a hola',
        number: '12',
        appear: 'true'
      });
    });

    it('should apply theme', () => {
      class MyComponent {
        static get host() {
          return {
            theme: 'my-component'
          };
        }
      }

      doRender(MyComponent);

      expect(hostElm).toMatchClasses(['my-component']);
    });

    it('should apply theme with mode', () => {
      class MyComponent {
        mode = 'ios';
        static get host() {
          return {
            theme: 'my-component'
          };
        }
      }

      spyOn(plt, 'attachStyles');
      doRender(MyComponent);

      expect(hostElm).toMatchClasses(['my-component', 'my-component-ios']);
      expect(plt.attachStyles).toHaveBeenCalled();
    });

    it('should apply theme with mode and color', () => {
      class MyComponent {
        mode = 'md';
        color = 'main';
        static get host() {
          return {
            theme: 'my-component'
          };
        }
      }

      doRender(MyComponent);

      expect(hostElm).toMatchClasses([
        'my-component',
        'my-component-md',
        'my-component-main',
        'my-component-md-main'
      ]);
    });

    it('should apply hostData() + theme (mode+color)', () => {
      class MyComponent {
        mode = 'md';
        color = 'main';

        hostData() {
          return {
            type: null as string,
            number: 12,
            appear: 'true',
            class: {
              a: true,
              hola: true,
              'my-component': false, // REVIEW!!
              c: false,
            }
          };
        }

        static get host() {
          return {
            theme: 'my-component'
          };
        }
      }

      doRender(MyComponent);

      expect(hostElm).toMatchClasses([
        'a',
        'hola',
        'my-component',
        'my-component-md',
        'my-component-main',
        'my-component-md-main'
      ]);

      expect(hostElm).toMatchAttributes({
        'class': 'a hola my-component my-component-md my-component-main my-component-md-main',
        'number': '12',
        'appear': 'true',
      });
    });

  });

  function doRender(cmpConstructor: any) {
    const instance = new cmpConstructor();
    plt.instanceMap.set(hostElm, instance);
    const cmpMeta: d.ComponentMeta = {
      componentConstructor: cmpConstructor
    };
    render(plt, cmpMeta, hostElm, instance, false);
    return instance;
  }

});
