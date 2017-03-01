import { Config } from '../utils/config';
import { Ionic } from '../utils/global';
import { Patch } from '../utils/interfaces';
import { isDef, toCamelCase } from '../utils/helpers';
import { init, DomApi, VNode, VNodeData, h } from '../renderer/index';
import { attributesModule } from '../renderer/modules/attributes';
import { classModule } from '../renderer/modules/class';
import { eventListenersModule } from '../renderer/modules/eventlisteners';
import { styleModule } from '../renderer/modules/style';
export { VNode, VNodeData };


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
    (<any>this)[toCamelCase(attrName)] = newVal;
  }


  disconnectedCallback() {
    this.$dom = this.$config = this.$renderer = this._vnode = this._ob = null;
  }

  ionNode(h: any): VNode { h; return null; };

  ionStyles(): string { return null; };

}


function initProperties(elm: IonElement) {
  if (!elm._obAttrs) return;

  const propValues: any = {};

  elm._obAttrs.forEach(attrName => {
    const propName = toCamelCase(attrName);

    propValues[propName] = (<any>elm)[propName];

    Object.defineProperty(elm, propName, {
      get: () => {
        return propValues[propName];
      },
      set: (value: any) => {
        if (propValues[propName] !== value) {
          propValues[propName] = value;
          elm.update();
        }
      }
    });
  });
}


function patchElement(elm: IonElement) {
  const config = elm.$config;
  const dom = elm.$dom;
  const newVnode = elm.ionNode(h);
  if (!newVnode) {
    return;
  }

  if (!elm.$renderer) {
    initProperties(elm);

    elm.$renderer = init([
      attributesModule,
      classModule,
      eventListenersModule,
      styleModule
    ], dom);
  }

  newVnode.elm = elm;
  newVnode.isHost = true;

  const mode = getValue('mode', config, dom, elm);
  const color = getValue('color', config, dom, elm);

  const dataClass = newVnode.data.class = newVnode.data.class || {};

  let componentPrefix: string;
  const cssClasses = newVnode.sel.split('.');
  if (cssClasses.length > 1) {
    componentPrefix = cssClasses[1] + '-';

  } else {
    componentPrefix = '';
  }
  newVnode.sel = undefined;

  dataClass[`${componentPrefix}${mode}`] = true;
  if (color) {
    dataClass[`${componentPrefix}${mode}-${color}`] = true;
  }

  // if we already have a vnode then use it
  // otherwise, elm it's the initial patch and we need it to pass it the actual host element
  elm._vnode =  elm.$renderer(elm._vnode ? elm._vnode : elm, newVnode);
}


function getValue(name: string, config: Config, domApi: DomApi, elm: HTMLElement, fallback: any = null): any {
  const val = domApi.getPropOrAttr(elm, name);
  return isDef(val) ? val : config.get(name, fallback);
}




function getBaseElement(): { new(): HTMLElement } {
  if (typeof HTMLElement !== 'function') {
    const BaseElement = function(){};
    BaseElement.prototype = Ionic().dom.createElement('div');
    return <any>BaseElement;
  }

  return HTMLElement;
}
