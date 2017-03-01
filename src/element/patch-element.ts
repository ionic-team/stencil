import { Config } from '../utils/config';
import { DomApi, init, h } from '../renderer/index';
import { attributesModule } from '../renderer/modules/attributes';
import { classModule } from '../renderer/modules/class';
import { eventListenersModule } from '../renderer/modules/eventlisteners';
import { styleModule } from '../renderer/modules/style';
import { IonElement } from './base-element';
import { initProperties } from './init-element';
import { isDef } from '../utils/helpers';


export function patchElement(elm: IonElement) {
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
    for (var i = 1; i < cssClasses.length; i++) {
      dataClass[cssClasses[i]] = true;
    }

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
