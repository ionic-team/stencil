import * as d from '../../../declarations';
import { NODE_TYPE } from '../../runtime-constants';
import { updateElement } from '../update-element';
import * as setAccessor from '../set-accessor';


describe('updateElement', () => {

  it('should add/remove classes', () => {
    const elm = document.createElement('my-tag') as HTMLElement;
    elm.className = 'mr plutonium';
    const oldVNode: d.VNode = {
      vattrs: { class: 'mr plutonium' }
    };
    const newVnode: d.VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should remove classes when oldVNode.vattrs but no newVNode.attrs', () => {
    const elm = document.createElement('my-tag') as HTMLElement;
    elm.className = 'mr fusion';
    const oldVNode: d.VNode = {
      vattrs: { class: 'mr fusion' }
    };
    const newVnode: d.VNode = {
      elm: elm
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.className).toBe('');
  });

  it('should do nothing when class is unchanged', () => {
    const elm = document.createElement('my-tag') as HTMLElement;
    elm.className = 'mr fusion';
    const oldVNode: d.VNode = {
      vattrs: { class: 'mr fusion' }
    };
    const newVnode: d.VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should add new classes when no oldVNode.vattrs', () => {
    const elm = document.createElement('my-tag') as HTMLElement;
    const oldVNode: d.VNode = {};
    const newVnode: d.VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should add new class when no oldVNode', () => {
    const elm = document.createElement('my-tag') as HTMLElement;
    const oldVNode: d.VNode = null;
    const newVnode: d.VNode = {
      elm: elm,
      vattrs: { class: 'mr fusion' }
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
  });

  it('should do nothing when no newVnode attrs', () => {
    expect(() => {
      const elm = document.createElement('my-tag') as HTMLElement;
      const oldVNode: d.VNode = null;
      const newVnode: d.VNode = {
        elm: elm
      };
      updateElement(oldVNode, newVnode, false);
    }).not.toThrow();
  });

  it('should use host element on shadow root element when using shadow dom', () => {
    const elm: any = {
      host: document.createElement('div') as HTMLElement,
      nodeType: NODE_TYPE.DocumentFragment
    };
    const oldVNode: d.VNode = null;
    const newVnode: d.VNode = {
      elm: elm,
      vattrs: {
        class: 'mr fusion',
        style: { color: 'gray' }
      }
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.host.className).toBe('mr fusion');
    expect(elm.host.style.color).toBe('gray');
  });

  it('should use host element when using an element with a "host" property', () => {
    const elm: any = document.createElement('a') as HTMLElement;
    elm.host = 'localhost:8888';
    const oldVNode: d.VNode = null;
    const newVnode: d.VNode = {
      elm: elm,
      vattrs: {
        class: 'mr fusion',
        style: { color: 'gray' }
      }
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
    expect(elm.style.color).toBe('gray');
  });

  it('should use host element when not shadow dom', () => {
    const elm = document.createElement('my-tag') as HTMLElement;
    const oldVNode: d.VNode = null;
    const newVnode: d.VNode = {
      elm: elm,
      vattrs: {
        class: 'mr fusion',
        style: { color: 'gray' }
      }
    };
    updateElement(oldVNode, newVnode, false);
    expect(elm.className).toBe('mr fusion');
    expect(elm.style.color).toBe('gray');
  });

  it('max test', () => {
    const spy = jest.spyOn(setAccessor, 'setAccessor');
    const elm = document.createElement('section') as HTMLElement;
    const initialVNode: d.VNode = null;
    const firstVNode: d.VNode = {
      elm: elm,
      vattrs: {
        content: 'attributes removed',
        padding: false,
        bold: 'false',
        'no-attr': null
      }
    };
    const secondVNode: d.VNode = {
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
    updateElement(initialVNode, firstVNode, false);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(1, elm, 'content', undefined, 'attributes removed', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, elm, 'padding', undefined, false, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(3, elm, 'bold', undefined, 'false', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(4, elm, 'no-attr', undefined, null, false, undefined);
    spy.mockReset();

    updateElement(firstVNode, secondVNode, false);
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenNthCalledWith(1, elm, 'content', 'attributes removed', 'attributes added', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, elm, 'padding', false, true, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(3, elm, 'bold', 'false', 'true', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(4, elm, 'margin', undefined, '', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(5, elm, 'color', undefined, 'lime', false, undefined);
    spy.mockReset();

    updateElement(secondVNode, firstVNode, false);
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenNthCalledWith(1, elm, 'margin', '', undefined, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, elm, 'color', 'lime', undefined, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(3, elm, 'content', 'attributes added', 'attributes removed', false, undefined);
    expect(spy).toHaveBeenNthCalledWith(4, elm, 'padding', true, false, false, undefined);
    expect(spy).toHaveBeenNthCalledWith(5, elm, 'bold', 'true', 'false', false, undefined);
    spy.mockReset();
    spy.mockRestore();
  });

});
