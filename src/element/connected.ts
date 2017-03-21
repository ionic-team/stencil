import { ComponentMeta, ComponentModule, ProxyElement } from '../utils/interfaces';
import { PlatformApi } from '../platform/platform-api';
import { Config } from '../utils/config';


export function connectedCallback(plt: PlatformApi, config: Config, prxCmp: ProxyElement, cmpMeta: ComponentMeta, cmpModule: ComponentModule) {
  prxCmp.$queued = false;

  let cmpInstance = prxCmp.$instance;
  if (!cmpInstance) {
    cmpInstance = createComponentInstance(prxCmp, cmpModule);
  }

  if (!prxCmp.$root) {
    createRoot(plt, config, prxCmp, cmpMeta);
  }

  if (cmpInstance.render) {

  }

  var div = document.createElement('div');
  div.innerHTML = 'SHADOWY';

  prxCmp.$root.appendChild(div);

  cmpInstance.connectedCallback && cmpInstance.connectedCallback();
}


function createComponentInstance(prxCmp: ProxyElement, cmpModule: ComponentModule) {
  return prxCmp.$instance = new cmpModule();
}


function createRoot(plt: PlatformApi, config: Config, prxCmp: ProxyElement, cmpMeta: ComponentMeta) {
  prxCmp.$shadowDom = !!prxCmp.attachShadow;

  if (prxCmp.$shadowDom && cmpMeta.shadow !== false) {
    // huzzah!! support for native shadow DOM!
    prxCmp.$root =  prxCmp.attachShadow({ mode: 'open' });

    injectCssLink(plt, config, cmpMeta, prxCmp.$root, true);

  } else {
    // yeah, no native shadow DOM, but we can still do this, don't panic
    prxCmp.$root =  prxCmp;

    injectCssLink(plt, config, cmpMeta, plt.getDocumentHead(), false);
  }
}


function injectCssLink(plt: PlatformApi, config: Config, cmpMeta: ComponentMeta, parentNode: Node, supportsShadowDom: boolean) {
  const modeStyleFilename = cmpMeta.modeStyleUrls[config.getValue('mode')];
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
