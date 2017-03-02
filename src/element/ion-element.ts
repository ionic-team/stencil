import { Ionic } from '../utils/global';
import { GlobalIonic, VNode } from '../utils/interfaces';
import { patchHostElement } from './patch-element';
import { toCamelCase } from '../utils/helpers';


export class IonElement extends getBaseElement() {
  /** @internal */
  $ionic: GlobalIonic;
  /** @internal */
  _vnode: VNode;
  /** @internal */
  _q: boolean;
  /** @internal */
  _obAttrs: string[];


  constructor() {
    super();

    this.$ionic = Ionic();
    const dom = this.$ionic.api;

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
    const self = this;

    if (!self._q) {
      self._q = true;

      self.$ionic.api.nextTick(() => {
        self._q = false;
        patchHostElement(self);
      });
    }
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      (<any>this)[toCamelCase(attrName)] = newVal;
    }
  }


  disconnectedCallback() {
    this.$ionic = this._vnode = null;
  }

  ionNode(h: any): VNode { h; return null; };

  ionStyles(): string { return null; };

}


function getBaseElement(): { new(): HTMLElement } {
  if (typeof HTMLElement !== 'function') {
    const BaseElement = function(){};
    BaseElement.prototype = Ionic().api.createElement('div');
    return <any>BaseElement;
  }

  return HTMLElement;
}
