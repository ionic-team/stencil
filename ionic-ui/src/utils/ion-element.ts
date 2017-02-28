import { Config } from './config';
import { isDef, toCamelCase } from './helpers';
import { init, DomApi, BrowserDomApi, VNode, VNodeData, h } from '../renderer/index';
import { attributesModule } from '../renderer/modules/attributes';
import { classModule } from '../renderer/modules/class';
import { eventListenersModule } from '../renderer/modules/eventlisteners';
import { propsModule } from '../renderer/modules/props';
import { styleModule } from '../renderer/modules/style';
export { h, VNode, VNodeData };
declare const global: any;


export class IonElement extends HTMLElement {
  ionic: Ionic;

  /** @internal */
  _vnode: VNode;
  /** @internal */
  _render: Patch;
  /** @internal */
  _ob: MutationObserver;
  /** @internal */
  _init = false;

  constructor() {
    super();
    this.ionic = getIonic();
  }


  connect(observedAttributes: string[]) {
    const self = this;

    self.ionic.domApi.setStyle(self, 'visibility', 'hidden');

    initProperties(self, observedAttributes);
    self.update();
  }

  update() {
    console.log('called update');
    const self = this;
    const ionic = self.ionic;
    const domApi = ionic.domApi;

    if (self._ob) {
      self._ob.disconnect();
    }

    self._ob = new MutationObserver(() => {
      const newVnode = self.ionNode(h);
      themeRoot(ionic.config, domApi, self, newVnode.data);
      patch(domApi, self, newVnode);

      self._ob.disconnect();
      self._ob = null;

      if (!self._init) {
        domApi.setStyle(self, 'visibility', '');
        self._init = true;
      }

      console.log('updated');
    });
    const textNode = domApi.createTextNode('');
    self._ob.observe(textNode, { characterData: true });
    textNode.data = '1';
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    console.debug(`attributeChangedCallback: ${attrName}, was "${oldVal}", now "${newVal}"`);

    if (oldVal !== newVal) {
      this.update();
    }
  }


  disconnectedCallback() {
    this.ionic = this._render = this._vnode = null;
  }

  ionNode(h: any): VNode { return h; };

}


function patch(domApi: DomApi, ele: IonElement, newVnode: VNode) {
  if (!ele._render) {
    ele._render = init([
      attributesModule,
      classModule,
      eventListenersModule,
      propsModule,
      styleModule
    ], domApi);

    ele._vnode = ele._render(ele, newVnode);

  } else {
    ele._vnode = ele._render(ele._vnode, newVnode);
  }
}


function initProperties(ele: HTMLElement, observedAttributes: string[]) {
  observedAttributes.forEach(attrName => {
    const propName = toCamelCase(attrName);

    if (ele.hasOwnProperty(propName)) {
      return;
    }


  });
}


function themeRoot(config: Config, domApi: DomApi, ele: HTMLElement, data: VNodeData): VNodeData {
  const mode = getValue('mode', config, domApi, ele);
  const color = getValue('color', config, domApi, ele);

  const componentName = getComponentName(domApi, ele);

  data.class = data.class || {};
  data.class[componentName] = true;

  data.class[`${componentName}-${mode}`] = true;
  if (color) {
    data.class[`${componentName}-${mode}-${color}`] = true;
  }

  return data;
}


function getValue(name: string, config: Config, domApi: DomApi, ele: HTMLElement, fallback: any = null): any {
  const val = domApi.getPropOrAttr(ele, name);
  return isDef(val) ? val : config.get(name, fallback);
}


function getIonic(): Ionic {
  const GLOBAL = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : Function('return this;')();
  const ionic: Ionic  = (GLOBAL.ionic = GLOBAL.ionic || {});

  ionic.domApi = new BrowserDomApi(document);

  ionic.config = new Config({
    mode: 'md'
  });

  return ionic;
}


function getComponentName(domApi: DomApi, ele: HTMLElement) {
  const tagName = domApi.tagName(ele).toLowerCase();
  return (tagName.indexOf('ion-') === 0) ? tagName.substring(4) : tagName;
}


export interface Ionic {
  domApi: DomApi;
  config: Config;
}


export interface Patch {
  (oldVnode: VNode | Element, vnode: VNode): VNode;
}
