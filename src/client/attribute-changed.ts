import { ComponentMeta, ProxyElement } from '../util/interfaces';
import { toCamelCase } from '../util/helpers';
import { BOOLEAN_TYPE_CODE, NUMBER_TYPE_CODE } from '../util/data-parse';


export function attributeChangedCallback(elm: ProxyElement, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string) {
  if (oldVal !== newVal) {
    const propName = toCamelCase(attrName);
    const prop = cmpMeta.props.find(p => p.propName === propName);

    if (prop) {
      if (prop.propType === BOOLEAN_TYPE_CODE) {
        elm[propName] = (newVal === null || newVal === 'false') ? false : true;

      } else if (prop.propType === NUMBER_TYPE_CODE) {
        elm[propName] = parseFloat(newVal);

      } else {
        elm[propName] = newVal;
      }
    }
  }
}
