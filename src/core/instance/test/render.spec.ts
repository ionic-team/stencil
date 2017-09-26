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

    elm.$instance = new MyComponent();
    render(plt, elm, {}, false);
    expect(elm._vnode).toBeDefined();
    expect(elm._vnode.vchildren[0].vtext).toBe('');
  });

  it('should create a vnode when there is a render() and it returned a vnode', () => {
    class MyComponent {
      render() {
        return h('div', 0, 'text');
      }
    }

    elm.$instance = new MyComponent();
    render(plt, elm, {}, false);
    expect(elm._vnode).toBeDefined();
    expect(elm._vnode.vchildren[0].vtag).toBe('div');
    expect(elm._vnode.vchildren[0].vchildren[0].vtext).toBe('text');
  });

  it('should not create a vnode when there is no render() or hostData() or hostMeta', () => {
    class MyComponent {}

    const cmpMeta: ComponentMeta = {};

    elm.$instance = new MyComponent();
    render(plt, elm, cmpMeta, false);

    expect(elm._vnode).toBeUndefined();
  });

  var plt = mockPlatform() as PlatformApi;
  var elm: HostElement;

  beforeEach(() => {
    elm = mockElement('ion-tag') as HostElement;
  });

});
