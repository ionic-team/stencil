import { ComponentMeta } from '../util/interfaces';
import { TYPE_BOOLEAN, TYPE_NUMBER } from '../util/constants';


export function attributeChangedCallback(elm: any, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string) {
  if (oldVal !== newVal) {
    attrName = attrName.toLowerCase();
    const prop = cmpMeta.props.find(p => p.attrName === attrName);

    if (prop) {
      if (prop.propType === TYPE_BOOLEAN) {
        // per the HTML spec, any string value means it is a boolean true value
        // but we'll cheat here and say that the string "false" is the boolean false
        elm[prop.propName] = (newVal === null || newVal === 'false') ? false : true;

      } else if (prop.propType === TYPE_NUMBER) {
        elm[prop.propName] = parseFloat(newVal);

      } else {
        elm[prop.propName] = newVal;
      }
    }
  }
}
