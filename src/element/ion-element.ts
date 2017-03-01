import { Config } from '../utils/config';
import { DomApi } from '../renderer/index';
import { Ionic } from '../utils/global';
import { Patch, VNode } from '../utils/interfaces';
import { patchElement } from './patch-element';
import { toCamelCase } from '../utils/helpers';


export class IonElement extends getBaseElement() {
  /** @internal */
  $dom: DomApi;
  /** @internal */
  $config: Config;
  /** @internal */
  $renderer: Patch;
  /** @internal */
  _vnode: VNode;
  /** @internal */
  _ob: MutationObserver;
  /** @internal */
  _obAttrs: string[];


  constructor() {
    super();

    const ionic = Ionic();
    const dom = this.$dom = ionic.dom;
    this.$config = ionic.config;

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
        patchElement(elm);
      }
    });

    const textNode = elm.$dom.createTextNode('');
    elm._ob.observe(textNode, { characterData: true });
    textNode.data = '1';
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      (<any>this)[toCamelCase(attrName)] = newVal;
    }
  }


  disconnectedCallback() {
    this.$dom = this.$config = this.$renderer = this._vnode = this._ob = null;
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
