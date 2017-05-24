import { TYPE_BOOLEAN, TYPE_NUMBER } from '../util/constants';
import { ComponentMeta } from '../util/interfaces';


export function attributeChangedCallback(elm: any, cmpMeta: ComponentMeta, attrName: string, oldVal: string, newVal: string) {
  if (oldVal !== newVal) {
    // convert an attribute name that's in dash case
    // to a property name that's in camel case
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
