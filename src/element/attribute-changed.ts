import { ComponentInstance, ComponentMeta } from '../util/interfaces';
import { getPropValue, toCamelCase } from '../util/helpers';


export function attributeChangedCallback(instance: ComponentInstance, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string) {
  if (instance) {

    if (oldVal !== newVal) {
      const propName = toCamelCase(attrName);
      if (cmpMeta.props[propName]) {
        instance[propName] = getPropValue(cmpMeta.props[propName].type, newVal);
      }
    }
  }
}
