import { isArray, isStringOrNumber, isObject } from '../../util/helpers';
import { VNode, VNodeData } from '../../util/interfaces';
import { SVG_NS } from '../../util/constants';


// convert the user passed in args into our runtime equivalent
export function h(sel: string | Node): VNode;
export function h(sel: Node, data: VNodeData): VNode;
export function h(sel: string, data: VNodeData): VNode;
export function h(sel: string, text: string): VNode;
export function h(sel: string, children: Array<VNode | undefined | null>): VNode;
export function h(sel: string, data: VNodeData, text: string): VNode;
export function h(sel: string, data: VNodeData, children: Array<VNode | undefined | null>): VNode;
export function h(sel: string | Node, data: VNodeData, children: VNode): VNode;
export function h(sel: any, b?: any, c?: any): VNode {
  let data: VNodeData;

  const vnode: VNode = {
    isVnode: true
  };

  let id: string = null;
  let classNames: any = null;
  let i: number;

  if (sel.nodeType) {
    // this is an actual element
    vnode.n = <Node>sel;
    sel = vnode.e = sel.tagName.toLowerCase();

  } else if (typeof sel === 'string') {
    // this is a selector
    const hashIdx = sel.indexOf('#');
    const dotIdx = sel.indexOf('.', hashIdx);
    const hash = hashIdx > 0 ? hashIdx : sel.length;
    const dot = dotIdx > 0 ? dotIdx : sel.length;

    vnode.e = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;

    if (hash < dot) {
      id = sel.slice(hash + 1, dot);
    }
    if (dotIdx > 0) {
      classNames = {};
      sel.slice(dot + 1).split('.').forEach(className => {
        classNames[className] = true;
      });
    }
  }

  if (c !== undefined) {
    data = b;
    if (isStringOrNumber(c)) {
      vnode.h = [
        { t: c.toString() }
      ];

    } else if (c.isVnode) {
      vnode.h = [c];

    } else if (isArray(c)) {
      for (i = 0; i < c.length; i++) {
        if (isStringOrNumber(c[i])) {
          c[i] = [{t: c[i].toString()}];
        }
      }
      vnode.h = c;
    }

  } else if (b !== undefined) {
    if (isStringOrNumber(b)) {
      vnode.h = [
        {t: b.toString()}
      ];

    } else if (b.isVnode) {
      vnode.h = [b];

    } else if (isArray(b)) {
      for (i = 0; i < b.length; i++) {
        if (isStringOrNumber(b[i])) {
          b[i] = { t: b[i].toString()};
        }
      }
      vnode.h = b;

    } else if (isObject(b)) {
      data = b;
    }
  }

  if (data) {
    // bracket notation to ensure it's not property renamed
    vnode.c = data['class'];
    vnode.p = data['props'];
    vnode.a = data['attrs'];
    vnode.o = data['on'];
    vnode.s = data['style'];
    vnode.k = data['key'];
    vnode.m = data['ns'];
  }

  if (id !== null) {
    if (vnode.a) {
      vnode.a['id'] = id;
    } else {
      vnode.a = { 'id': id };
    }
  }

  if (classNames !== null) {
    if (vnode.c) {
      Object.assign(vnode.c, classNames);
    } else {
      vnode.c = classNames;
    }
  }

  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
    addSvgNS(vnode);
  }

  return vnode;
}


function addSvgNS(vnode: VNode): void {
  vnode.m = SVG_NS;

  if (vnode.e !== 'foreignObject' && vnode.h) {
    for (let i = 0; i < vnode.h.length; ++i) {
      addSvgNS(vnode.h[i]);
    }
  }
}
