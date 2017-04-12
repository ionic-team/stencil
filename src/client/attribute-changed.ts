import { ComponentMeta, ProxyElement } from '../util/interfaces';
import { getPropValue, toCamelCase } from '../util/helpers';


export function attributeChangedCallback(elm: ProxyElement, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string) {
  if (oldVal !== newVal) {
    const propName = toCamelCase(attrName);
    if (cmpMeta.props[propName]) {
      elm[propName] = getPropValue(cmpMeta.props[propName].type, newVal);
    }
  }
}
