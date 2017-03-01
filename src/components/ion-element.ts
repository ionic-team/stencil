import { Config } from '../utils/config';
import { GlobalIonic, Patch } from '../utils/interfaces';
import { isDef, toCamelCase } from '../utils/helpers';
import { init, DomApi, BrowserDomApi, VNode, VNodeData, h } from '../renderer/index';
import { attributesModule } from '../renderer/modules/attributes';
import { classModule } from '../renderer/modules/class';
import { eventListenersModule } from '../renderer/modules/eventlisteners';
import { styleModule } from '../renderer/modules/style';
export { VNode, VNodeData };
declare const global: any;


export class IonElement extends getBaseElement() {
  /** @internal */
  $root: ShadowRoot;
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


  constructor() {
    super();

    const ionic = getIonic();
    this.$dom = ionic.dom;
    this.$config = ionic.config;

    this.$root = this.attachShadow({mode: 'open'});

    const styles = this.ionStyles();
    if (styles) {
      const styleEle = this.$dom.createElement('style');
      styleEle.innerHTML = styles;
      this.$root.appendChild(styleEle);
    }
  }


  connect(observedAttributes: string[]) {
    const elm = this;

    const propValues: any = {};

    observedAttributes.forEach(attrName => {
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

    elm.update();
  }


  update() {
    console.log('called update');
    const elm = this;

    patchElement(elm);

    if (elm._ob) {
      return;
    }

    // elm._ob = new MutationObserver(() => {
    //   if (elm._ob) {
    //     debugger
    //     patch(elm);
    //     elm._ob.disconnect();
    //     elm._ob = null;
    //   }
    // });

    // const textNode = elm.$dom.createTextNode('');
    // elm._ob.observe(textNode, { characterData: true });
    // textNode.data = '1';
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    console.debug(`attributeChangedCallback: ${attrName}, was "${oldVal}", now "${newVal}"`);

    (<any>this)[toCamelCase(attrName)] = newVal;
  }


  disconnectedCallback() {
    this.$dom = this.$config = this.$root = this.$renderer = this._vnode = this._ob = null;
  }

  ionNode(h: any): VNode { h; return null; };

  ionStyles(): string { return null; };

}


function patchElement(elm: IonElement) {
  const newVnode = elm.ionNode(h);
  if (!newVnode) {
    return;
  }

  const config = elm.$config;
  const dom = elm.$dom;

  newVnode.elm = elm;
  newVnode.isShadowHost = true;

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

  if (!elm.$renderer) {
    elm.$renderer = init([
      attributesModule,
      classModule,
      eventListenersModule,
      styleModule
    ], dom);

    elm._vnode = elm.$renderer(elm, newVnode);

  } else {
    elm._vnode = elm.$renderer(elm._vnode, newVnode);
  }
}


function getValue(name: string, config: Config, domApi: DomApi, elm: HTMLElement, fallback: any = null): any {
  const val = domApi.getPropOrAttr(elm, name);
  return isDef(val) ? val : config.get(name, fallback);
}


function getIonic(): GlobalIonic {
  const GLOBAL = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : Function('return this;')();
  const ionic: GlobalIonic  = (GLOBAL.ionic = GLOBAL.ionic || {});

  if (!ionic.dom) {
    ionic.dom = new BrowserDomApi(document);
  }

  if (!ionic.config) {
    ionic.config = new Config();
  }

  return ionic;
}


function getBaseElement(): { new(): HTMLElement } {
  if (typeof HTMLElement !== 'function') {
    const BaseElement = function(){};
    BaseElement.prototype = getIonic().dom.createElement('div');
    return <any>BaseElement;
  }

  return HTMLElement;
}
