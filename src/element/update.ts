import { ComponentController, ComponentMeta, ComponentModule, ProxyElement } from '../utils/interfaces';
import { PlatformApi } from '../platform/platform-api';
import { Config } from '../utils/config';
import { generateVNode } from './host';
import { initState } from './proxy';
import { Renderer } from '../utils/interfaces';


export function update(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, cmpMeta: ComponentMeta, cmpModule?: ComponentModule) {
  // only run patch if it isn't queued already
  if (!ctrl.queued) {
    ctrl.queued = true;

    // run the patch in the next tick
    plt.nextTick(function patchUpdate() {

      // vdom diff and patch the host element for differences
      patch(plt, config, renderer, elm, ctrl, cmpMeta, cmpModule);

      // no longer queued
      ctrl.queued = false;
    });
  }
}


export function patch(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, cmpMeta: ComponentMeta, cmpModule: ComponentModule) {
  let instance = ctrl.instance;
  if (!instance) {
    instance = ctrl.instance = new cmpModule();
    initState(plt, config, renderer, elm, ctrl, cmpMeta);
  }

  if (!ctrl.root) {
    createRoot(plt, config, elm, ctrl, cmpMeta);
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


function createRoot(plt: PlatformApi, config: Config, elm: ProxyElement, ctrl: ComponentController, cmpMeta: ComponentMeta) {
  ctrl.shadowDom = !!elm.attachShadow;

  if (ctrl.shadowDom && cmpMeta.shadow !== false) {
    // huzzah!! support for native shadow DOM!
    ctrl.root = elm.attachShadow({ mode: 'open' });

    injectCssLink(plt, config, cmpMeta, ctrl.root, true);

  } else {
    // yeah, no native shadow DOM, but we can still do this, don't panic
    ctrl.root =  elm;

    injectCssLink(plt, config, cmpMeta, plt.getDocumentHead(), false);
  }
}


function injectCssLink(plt: PlatformApi, config: Config, cmpMeta: ComponentMeta, parentNode: Node, supportsShadowDom: boolean) {
  const modeStyleFilename = cmpMeta.modeStyleUrls[config.get('mode')];
  if (!modeStyleFilename) {
    return;
  }

  let linkUrl = plt.staticDir + modeStyleFilename;

  if (!supportsShadowDom) {
    linkUrl = linkUrl.replace('.css', '.scoped.css');

    if (plt.hasCssLink(linkUrl)) {
      return;
    }
    plt.setCssLink(linkUrl);
  }

  const linkEle = <HTMLLinkElement>plt.createElement('link');
  linkEle.href = linkUrl;
  linkEle.rel = 'stylesheet';

  plt.appendChild(parentNode, linkEle);
}

