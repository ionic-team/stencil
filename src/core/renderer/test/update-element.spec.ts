import { updateElement } from '../update-dom-node';
import { mockElement, mockPlatform } from '../../../testing/mocks';
import { VNode } from '../../../util/interfaces';

describe('updateElement', () => {

  it('should add/remove classes', () => {
    const elm = mockElement('my-tag') as HTMLElement;
    elm.className = 'mr plutonium';
    const oldVNode: VNode = {
      vattrs: { class: 'mr plutonium' }
    };
    const newVnode: VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(plt, oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should remove classes when oldVNode.vattrs but no newVNode.attrs', () => {
    const elm = mockElement('my-tag') as HTMLElement;
    elm.className = 'mr fusion';
    const oldVNode: VNode = {
      vattrs: { class: 'mr fusion' }
    };
    const newVnode: VNode = {
      elm: elm
    };
    updateElement(plt, oldVNode, newVnode, false);
    expect(elm.className).toBe('');
  });

  it('should do nothing when class is unchanged', () => {
    const elm = mockElement('my-tag') as HTMLElement;
    elm.className = 'mr fusion';
    const oldVNode: VNode = {
      vattrs: { class: 'mr fusion' }
    };
    const newVnode: VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(plt, oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should add new classes when no oldVNode.vattrs', () => {
    const elm = mockElement('my-tag') as HTMLElement;
    const oldVNode: VNode = {};
    const newVnode: VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(plt, oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should add new class when no oldVNode', () => {
    const elm = mockElement('my-tag') as HTMLElement;
    const oldVNode: VNode = null;
    const newVnode: VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(plt, oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should do nothing when no newVnode attrs', () => {
    expect(() => {
      const elm = mockElement('my-tag') as HTMLElement;
      const oldVNode: VNode = null;
      const newVnode: VNode = {
        elm: elm
      };
      updateElement(plt, oldVNode, newVnode, false);
    }).not.toThrow();
  });

  it('should use shadow root element when using shadow dom', () => {
    const elm: any = {
      host: mockElement('my-tag') as HTMLElement
    };
    const oldVNode: VNode = null;
    const newVnode: VNode = {
      elm: elm,
      vattrs: {
        class: 'mr fusion',
        style: { color: 'gray' }
      }
    };
    updateElement(plt, oldVNode, newVnode, false);
    expect(elm.host.className).toBe('mr fusion');
    expect(elm.host.style.color).toBe('gray');
  });

  it('should use host element when not shadow dom', () => {
    const elm = mockElement('my-tag') as HTMLElement;
    const oldVNode: VNode = null;
    const newVnode: VNode = {
      elm: elm,
      vattrs: {
        class: 'mr fusion',
        style: { color: 'gray' }
      }
    };
    updateElement(plt, oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
    expect(elm.style.color).toBe('gray');
  });


  var plt: any = mockPlatform();

});
