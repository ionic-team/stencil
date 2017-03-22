import { ComponentInstance, ComponentMeta } from '../utils/interfaces';
import { toCamelCase } from '../utils/helpers';


export function attributeChangedCallback(instance: ComponentInstance, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string, namespace: string) {
  if (!instance) return;

  const propName = toCamelCase(attrName);
  if (cmpMeta.props[propName]) {
    instance[propName] = newVal;
  }

  instance.attributeChangedCallback && instance.attributeChangedCallback(attrName, oldVal, newVal, namespace);
}
