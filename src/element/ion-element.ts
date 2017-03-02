import { Ionic } from '../utils/global';
import { initProperties } from './init-element';
import { VNode, VNodeData, Props, Prop } from '../utils/interfaces';
import { patchHostElement } from './patch-element';
import { toCamelCase } from '../utils/helpers';
export { h } from '../renderer/core';
export { VNode, VNodeData, Props, Prop };


export class IonElement extends getBaseElement() {
  /** @internal */
  _vnode: VNode;
  /** @internal */
  _q: boolean;


  constructor() {
    super();

    const api = Ionic().api;

    const tag = api.tag(this);
    if (!api.hasElementCss(tag)) {
      api.appendElementCss(tag, this.styles());
    }
  }

  connectedCallback() {
    this.update();
  }


  static get observedAttributes() {
    return Ionic().obsAttrs.get(this) || [];
  }


  static set observedAttributes(attrs: string[]) {
    const ionic = Ionic();
    let existingObsAttrs = ionic.obsAttrs.get(this);
    if (existingObsAttrs) {
      attrs = existingObsAttrs.concat(attrs);
    }
    ionic.obsAttrs.set(this, attrs);
  }


  static set props(props: Props) {
    const obsAttrs: string[] = [];
    const propNames = Object.keys(props);
    let prop: Prop;

    for (var i = 0; i < propNames.length; i++) {
      prop = props[propNames[i]];

      obsAttrs.push(propNames[i]);
    }

    this.observedAttributes = obsAttrs;
    Ionic().props.set(this, props);
  }


  update() {
    const elm = this;

    if (!elm._q) {
      elm._q = true;

      const ionic = Ionic();
      ionic.api.nextTick(() => {
        if (!elm._vnode) {
          // if no _vnode then this is the initial patch
          initProperties(elm, ionic.props.get(elm.constructor));
        }

        patchHostElement(ionic.config, ionic.api, ionic.renderer, elm);
        elm._q = false;
      });
    }
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      (<any>this)[toCamelCase(attrName)] = newVal;
    }
  }

  render(): VNode { return null; };

  styles(): string { return null; };

}


function getBaseElement(): { new(): HTMLElement } {
  if (typeof HTMLElement !== 'function') {
    const BaseElement = function(){};
    BaseElement.prototype = Ionic().api.createElement('div');
    return <any>BaseElement;
  }

  return HTMLElement;
}
