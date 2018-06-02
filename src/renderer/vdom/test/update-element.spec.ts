import { mockElement, mockPlatform } from '../../../testing/mocks';
import { NODE_TYPE } from '../../../util/constants';
import { updateElement } from '../update-dom-node';
import { VNode } from '../../../declarations';
import * as setAccessor from '../set-accessor';


describe('updateElement', () => {

  const plt: any = mockPlatform();

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

  it('should use host element on shadow root element when using shadow dom', () => {
    const elm: any = {
      host: mockElement('div') as HTMLElement,
      nodeType: NODE_TYPE.DocumentFragment
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

  it('should use host element when using an element with a "host" property', () => {
    const elm: any = mockElement('a') as HTMLElement;
    elm.host = 'localhost:8888';
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

  it('max test', () => {
    const spy = jest.spyOn(setAccessor, 'setAccessor');
    const elm = mockElement('section') as HTMLElement;
    const initialVNode: VNode = null;
    const firstVNode: VNode = {
      elm: elm,
      vattrs: {
        content: 'attributes removed',
        padding: false,
        bold: 'false',
        'no-attr': null
      }
    };
    const secondVNode: VNode = {
      elm: elm,
      vattrs: {
        content: 'attributes added',
        padding: true,
        bold: 'true',
        margin: '',
        color: 'lime',
        'no-attr': null
      }
    };
    updateElement(plt, initialVNode, firstVNode, false);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(1, plt, elm, 'content', undefined, 'attributes removed', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, plt, elm, 'padding', undefined, false, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(3, plt, elm, 'bold', undefined, 'false', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(4, plt, elm, 'no-attr', undefined, null, false, undefined);
    spy.mockReset();

    updateElement(plt, firstVNode, secondVNode, false);
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenNthCalledWith(1, plt, elm, 'content', 'attributes removed', 'attributes added', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, plt, elm, 'padding', false, true, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(3, plt, elm, 'bold', 'false', 'true', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(4, plt, elm, 'margin', undefined, '', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(5, plt, elm, 'color', undefined, 'lime', false, undefined);
    spy.mockReset();

    updateElement(plt, secondVNode, firstVNode, false);
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenNthCalledWith(1, plt, elm, 'margin', '', undefined, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, plt, elm, 'color', 'lime', undefined, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(3, plt, elm, 'content', 'attributes added', 'attributes removed', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(4, plt, elm, 'padding', true, false, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(5, plt, elm, 'bold', 'true', 'false', false, undefined);
    spy.mockReset();
    spy.mockRestore();
  });

});
