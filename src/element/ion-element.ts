import { Ionic } from '../utils/global';
import { GlobalIonic, VNode } from '../utils/interfaces';
import { patchHostElement } from './patch-element';
import { toCamelCase } from '../utils/helpers';


export class IonElement extends getBaseElement() {
  /** @internal */
  $ionic: GlobalIonic;
  /** @internal */
  _init: boolean;
  /** @internal */
  _vnode: VNode;
  /** @internal */
  _ob: MutationObserver;
  /** @internal */
  _obAttrs: string[];


  constructor() {
    super();

    this.$ionic = Ionic();
    const dom = this.$ionic.dom;

    const tag = dom.tag(this);
    if (!dom.hasElementCss(tag)) {
      dom.appendElementCss(tag, this.ionStyles());
    }
  }


  connect(observedAttributes?: string[]) {
    this._obAttrs = observedAttributes;
    this.update();
  }


  update() {
    const elm = this;

    if (elm._ob) {
      return;
    }

    elm._ob = new MutationObserver(() => {
      if (elm._ob) {
        elm._ob.disconnect();
        elm._ob = null;
        patchHostElement(elm);
      }
    });

    const textNode = elm.$ionic.dom.createTextNode('');
    elm._ob.observe(textNode, { characterData: true });
    textNode.data = '1';
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      (<any>this)[toCamelCase(attrName)] = newVal;
    }
  }


  disconnectedCallback() {
    this.$ionic = this._vnode = this._ob = null;
  }

  ionNode(h: any): VNode { h; return null; };

  ionStyles(): string { return null; };

}


function getBaseElement(): { new(): HTMLElement } {
  if (typeof HTMLElement !== 'function') {
    const BaseElement = function(){};
    BaseElement.prototype = Ionic().dom.createElement('div');
    return <any>BaseElement;
  }

  return HTMLElement;
}
