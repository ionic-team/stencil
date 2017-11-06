import { ComponentMeta, HostElement, PlatformApi } from '../../../util/interfaces';
import { mockPlatform, mockElement } from '../../../testing/mocks';
import { render } from '../render';
import { h } from '../../renderer/h';

describe('instance render', () => {

  it('should create a vnode with no children when there is a render() but it returned null', () => {
    class MyComponent {
      render(): any {
        return null;
      }
    }

    doRender(MyComponent);

    expect(elm._vnode).toBeDefined();
    expect(elm._vnode.vchildren[0].vtext).toBe('');
  });

  it('should create a vnode when there is a render() and it returned a vnode', () => {
    class MyComponent {
      render() {
        return h('div', 0, 'text');
      }
    }

    doRender(MyComponent);

    expect(elm._vnode).toBeDefined();
    expect(elm._vnode.vchildren[0].vtag).toBe('div');
    expect(elm._vnode.vchildren[0].vchildren[0].vtext).toBe('text');
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

    expect(elm._vnode).toBeDefined();
    expect(elm._vnode.vchildren[0].vtext).toBe('');
    expect(elm._vnode.vchildren[1].vtag).toBe('div');
    expect(elm._vnode.vchildren[1].vchildren[0].vtext).toBe('text');
    expect(elm._vnode.vchildren[2].vtext).toBe('');
  });

  it('should not create a vnode when there is no render() or hostData() or hostMeta', () => {
    class MyComponent { }

    doRender(MyComponent);

    expect(elm._vnode).toBeUndefined();
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
      class MyComponent { }

      doRender(MyComponent, {
        hostMeta: {
          theme: 'my-component'
        }
      });

      expect(elm).toMatchClasses(['my-component']);
    });

    it('should apply theme with mode', () => {
      class MyComponent {
        mode = 'ios';
      }

      doRender(MyComponent, {
        hostMeta: {
          theme: 'my-component'
        }
      });

      expect(elm).toMatchClasses(['my-component', 'my-component-ios']);
    });

    it('should apply theme with mode and color', () => {
      class MyComponent {
        mode = 'md';
        color = 'main';
      }

      doRender(MyComponent, {
        hostMeta: {
          theme: 'my-component'
        }
      });

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
      }

      doRender(MyComponent, {
        hostMeta: {
          theme: 'my-component'
        }
      });

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

  function doRender(cmp: any, meta: ComponentMeta = {}) {
    const instance = elm._instance = new cmp();
    render(plt, elm, meta, false);
    return instance;
  }

  var plt = mockPlatform() as PlatformApi;
  var elm: HostElement;

  beforeEach(() => {
    elm = mockElement('ion-tag') as HostElement;
  });

});
