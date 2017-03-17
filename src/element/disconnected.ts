import { ComponentInstance } from '../utils/interfaces';


export function disconnectedCallback(cmpInstance: ComponentInstance) {
  cmpInstance.disconnectedCallback && cmpInstance.disconnectedCallback();
}
