import { ComponentInstance } from '../utils/interfaces';


export function attributeChangedCallback(instance: ComponentInstance, attrName: string, oldVal: string, newVal: string, namespace: string) {
  instance && instance.attributeChangedCallback && instance.attributeChangedCallback(attrName, oldVal, newVal, namespace);
}
