import { Config } from '../utils/config';
import { Renderer } from '../utils/interfaces';
import { IonElement } from './ion-element';
import { isDef } from '../utils/helpers';
import { PlatformApi } from '../platform/platform-api';


export function patchHostElement(config: Config, api: PlatformApi, renderer: Renderer, elm: IonElement) {
  elm.mode = getValue('mode', config, api, elm);
  elm.color = getValue('color', config, api, elm);

  const newVnode = elm.render();
  if (!newVnode) {
    return;
  }

  newVnode.elm = elm;
  newVnode.isHost = true;

  const hostCss = newVnode.data.class = newVnode.data.class || {};

  let componentPrefix: string;
  const cssClasses = newVnode.sel.split('.');
  if (cssClasses.length > 1) {
    componentPrefix = cssClasses[1] + '-';
    for (var i = 1; i < cssClasses.length; i++) {
      hostCss[cssClasses[i]] = true;
    }

  } else {
    componentPrefix = '';
  }
  newVnode.sel = undefined;

  hostCss[`${componentPrefix}${elm.mode}`] = true;
  if (elm.color) {
    hostCss[`${componentPrefix}${elm.mode}-${elm.color}`] = true;
  }

  // if we already have a vnode then use it
  // otherwise, elm is the initial patch and
  // we need it to pass it the actual host element
  if (!elm._vnode) {
    elm._vnode = renderer(elm, newVnode, true);
  } else {
    elm._vnode = renderer(elm._vnode, newVnode, false);
  }
}


function getValue(name: string, config: Config, api: PlatformApi, elm: HTMLElement, fallback: any = null): any {
  const val = api.getPropOrAttr(elm, name);
  return isDef(val) ? val : config.get(name, fallback);
}
