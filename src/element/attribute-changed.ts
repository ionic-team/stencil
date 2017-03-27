import { ComponentInstance, ComponentMeta } from '../utils/interfaces';
import { getPropValue, toCamelCase } from '../utils/helpers';


export function attributeChangedCallback(instance: ComponentInstance, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string, namespace: string) {
  if (instance) {

    if (oldVal !== newVal) {
      const propName = toCamelCase(attrName);
      if (cmpMeta.props[propName]) {
        instance[propName] = getPropValue(cmpMeta.props[propName].type, newVal);
      }
    }

    instance.attributeChangedCallback && instance.attributeChangedCallback(attrName, oldVal, newVal, namespace);
  }
}
