import { ComponentMeta, ProxyElement } from '../util/interfaces';
import { toCamelCase } from '../util/helpers';


export function attributeChangedCallback(elm: ProxyElement, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string) {
  if (oldVal !== newVal) {
    const propName = toCamelCase(attrName);
    const prop = cmpMeta.props[propName];

    if (prop) {
      if (prop.type === 'boolean') {
        elm[propName] = (newVal === null || newVal === 'false') ? false : true;

      } else if (prop.type === 'number') {
        elm[propName] = parseFloat(newVal);

      } else {
        elm[propName] = newVal;
      }
    }
  }
}
