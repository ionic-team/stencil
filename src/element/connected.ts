import { ComponentMeta, ComponentModule, ProxyComponent, ProxyController } from '../utils/interfaces';
import { PlatformApi } from '../platform/platform-api';
import { Config } from '../utils/config';


export function connectedCallback(plt: PlatformApi, config: Config, prxCtrl: ProxyController, tag: string, cmpMeta: ComponentMeta, cmpModule: ComponentModule) {
  console.debug(`connectedCallback: ${tag}, ${cmpMeta}`);

  prxCtrl.queued = false;

  let cmpInstance = prxCtrl.instance;
  if (!cmpInstance) {
    cmpInstance = createComponentInstance(prxCtrl, cmpModule);
  }
debugger
  // if (!prxCtrl.root && cmpMeta.shadow !== false) {
  //   createShadowRoot(plt, config, prxCtrl, cmpMeta);
  // }

  // if (cmpInstance.render) {

  // }

  // var style = document.createElement('style');
  // style.innerHTML = ':host { background: yellow; }';
  // prxCtrl.root.appendChild(style);

  // var div = document.createElement('div');
  // div.innerHTML = 'SHADOWY';

  // prxCtrl.root.appendChild(div);


  // cmpInstance.connectedCallback && cmpInstance.connectedCallback();
}


function createComponentInstance(prxCtrl: ProxyController, cmpModule: ComponentModule) {
  return prxCtrl.instance = new cmpModule();
}


function createShadowRoot(plt: PlatformApi, config: Config, prxCtrl: ProxyController, cmpMeta: ComponentMeta) {
  // prxElement.attachShadow({ mode: 'open' });

  // injectCssLink(plt, config, cmpMeta, prxElement.shadowRoot);
}


function injectCssLink(plt: PlatformApi, config: Config, cmpMeta: ComponentMeta, parentNode: Node) {
  const modeStyleFilename = cmpMeta.modeStyleUrls[config.getValue('mode')];
  if (!modeStyleFilename) {
    return;
  }

  let linkUrl = plt.staticDir + modeStyleFilename;

  if (plt.injectScopedCss) {
    linkUrl = linkUrl.replace('.css', '.scoped.css');

    if (plt.hasLinkCss(linkUrl)) {
      return;
    }
  }

  const linkEle = <HTMLLinkElement>plt.createElement('link');
  linkEle.href = linkUrl;
  linkEle.rel = 'stylesheet';

  plt.appendChild(parentNode, linkEle);
}
