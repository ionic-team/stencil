import { ProxyElement } from '../utils/interfaces';


export function disconnectedCallback(prxElm: ProxyElement) {
  const cmpInstance = prxElm.$instance;

  if (cmpInstance) {
    cmpInstance.disconnectedCallback && cmpInstance.disconnectedCallback();
  }

  prxElm.$instance = prxElm.$root = null;
}
