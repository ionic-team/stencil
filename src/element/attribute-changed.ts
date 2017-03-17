import { ComponentInstance } from '../utils/interfaces';


export function attributeChangedCallback(cmpInstance: ComponentInstance, attrName: string, oldVal: string, newVal: string, namespace: string) {
  console.debug(`attributeChangedCallback: ${attrName}, ${oldVal}, ${newVal}, ${namespace}`);

  cmpInstance.attributeChangedCallback && cmpInstance.attributeChangedCallback(attrName, oldVal, newVal, namespace);
}
