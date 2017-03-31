import { ComponentController, ProxyElement } from '../utils/interfaces';
import { Config } from '../utils/config';
import { generateVNode } from './host';
import { initProps } from './proxy';
import { PlatformApi } from '../platform/platform-api';
import { Renderer } from '../utils/interfaces';


export function queueUpdate(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, tag: string) {
  // only run patch if it isn't queued already
  if (!ctrl.queued) {
    ctrl.queued = true;

    // run the patch in the next tick
    plt.domWrite(function domWrite() {

      // vdom diff and patch the host element for differences
      update(plt, config, renderer, elm, ctrl, tag);

      // no longer queued
      ctrl.queued = false;
    });
  }
}


export function update(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, tag: string) {
  const cmpMeta = plt.getComponentMeta(tag);

  let instance = ctrl.instance;
  if (!instance) {
    instance = ctrl.instance = new cmpMeta.componentModule();
    initProps(plt, config, renderer, elm, ctrl, tag, cmpMeta.props);
  }

  if (!ctrl.root) {
    const cmpMode = cmpMeta.modes[instance.mode];

    ctrl.root = elm.attachShadow({ mode: 'open' });

    if (plt.supports.shadowDom) {
      if (!cmpMode.styleElm) {
        cmpMode.styleElm = <HTMLStyleElement>plt.createElement('style');
        cmpMode.styleElm.innerHTML = cmpMode.styles;
      }

      ctrl.root.appendChild(cmpMode.styleElm.cloneNode(true));

    } else {
      const cmpModeId = `${cmpMeta.tag}.${instance.mode}`;
      if (!plt.hasCss(cmpModeId)) {
        const headStyleEle = <HTMLStyleElement>plt.createElement('style');
        headStyleEle.dataset['cmpModeId'] = cmpModeId;
        headStyleEle.innerHTML = cmpMode.styles.replace(/\:host\-context\((.*?)\)|:host\((.*?)\)|\:host/g, '__h');
        plt.appendChild(plt.getDocumentHead(), headStyleEle);
        plt.setCss(cmpModeId);
      }
    }
  }

  const vnode = generateVNode(ctrl.root, instance, cmpMeta);

  // if we already have a vnode then use it
  // otherwise, elm is the initial patch and
  // we need it to pass it the actual host element
  ctrl.vnode = renderer(ctrl.vnode ? ctrl.vnode : elm, vnode);

  if (!ctrl.connected) {
    instance.connectedCallback && instance.connectedCallback();
    ctrl.connected = true;
  }
}
