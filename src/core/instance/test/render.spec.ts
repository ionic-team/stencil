import { ComponentConstructor, ComponentMeta, HostElement, PlatformApi } from '../../../declarations';
import { mockElement, mockPlatform } from '../../../testing/mocks';
import { h } from '../../renderer/h';
import { render } from '../render';


describe('instance render', () => {

  let plt: PlatformApi;
  let elm: HostElement;

  beforeEach(() => {
    plt = mockPlatform();
    elm = mockElement('ion-tag') as HostElement;
  });

  it('should create a vnode with no children when there is a render() but it returned null', () => {
    class MyComponent {
      render(): any {
        return null;
      }
    }

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(elm);
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

    const vnode = plt.vnodeMap.get(elm);
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

    const vnode = plt.vnodeMap.get(elm);
    expect(vnode).toBeDefined();
    expect(vnode.vchildren[0].vtext).toBe('');
    expect(vnode.vchildren[1].vtag).toBe('div');
    expect(vnode.vchildren[1].vchildren[0].vtext).toBe('text');
    expect(vnode.vchildren[2].vtext).toBe('');
  });

  it('should not create a vnode when there is no render() or hostData() or hostMeta', () => {
    class MyComponent { }

    doRender(MyComponent);

    const vnode = plt.vnodeMap.get(elm);
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
      expect(elm).toMatchClasses(['a', 'clAss', 'My-class_']);
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

      expect(elm).toMatchClasses(['a', 'b', 'c', 'my-class']);
      expect(elm).toMatchAttributes({
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

      expect(elm).toMatchClasses(['a', 'hola']);
      expect(elm).toMatchAttributes({
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

      expect(elm).toMatchClasses(['my-component']);
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

      expect(elm).toMatchClasses(['my-component', 'my-component-ios']);
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

      expect(elm).toMatchClasses([
        'my-component',
        'my-component-md',
        'my-component-main',
        'my-component-md-main'
      ]);
    });

    it ('should apply hostData() + theme (mode+color)', () => {
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

      expect(elm).toMatchClasses([
        'a',
        'hola',
        'my-component',
        'my-component-md',
        'my-component-main',
        'my-component-md-main'
      ]);

      expect(elm).toMatchAttributes({
        'class': 'a hola my-component my-component-md my-component-main my-component-md-main',
        'number': '12',
        'appear': 'true',
      });
    });

  });

  function doRender(cmpConstructor: any) {
    const instance = new cmpConstructor();
    plt.instanceMap.set(elm, instance);
    const cmpMeta: ComponentMeta = {
      componentConstructor: cmpConstructor
    };
    render(plt, cmpMeta, elm, instance, false);
    return instance;
  }

});
