import { ComponentMeta, ComponentModule, ProxyComponent } from '../utils/interfaces';
import { PlatformApi } from '../platform/platform-api';
import { Config } from '../utils/config';


export function connectedCallback(plt: PlatformApi, config: Config, prxElement: ProxyComponent, tag: string, cmpMeta: ComponentMeta, cmpModule: ComponentModule) {
  console.debug(`connectedCallback: ${tag}, ${cmpMeta}, ${prxElement}`);

  prxElement.$queued = false;

  let cmpInstance = prxElement.$instance;
  if (!cmpInstance) {
    cmpInstance = createComponentInstance(prxElement, cmpModule);
  }

  if (!prxElement.shadowRoot && cmpMeta.shadow !== false) {
    createShadowRoot(plt, config, prxElement, cmpMeta);
  }

  if (cmpInstance.render) {

  }

  var style = document.createElement('style');
  style.innerHTML = ':host { background: yellow; }';
  prxElement.shadowRoot.appendChild(style);

  var div = document.createElement('div');
  div.innerHTML = 'SHADOWY';

  prxElement.shadowRoot.appendChild(div);



  cmpInstance.connectedCallback && cmpInstance.connectedCallback();
}


function createComponentInstance(prxElement: ProxyComponent, cmpModule: ComponentModule) {
  return prxElement.$instance = new cmpModule();
}


function createShadowRoot(plt: PlatformApi, config: Config, prxElement: ProxyComponent, cmpMeta: ComponentMeta) {
  prxElement.attachShadow({ mode: 'open' });

  injectCssLink(plt, config, cmpMeta, prxElement.shadowRoot);
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
