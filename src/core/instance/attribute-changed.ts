import { HostElement } from '../../util/interfaces';
import { TYPE_BOOLEAN, TYPE_NUMBER } from '../../util/constants';


export function attributeChangedCallback( elm: any, attribName: string, oldVal: string, newVal: string) {
  // only react if the attribute values actually changed
  if (oldVal !== newVal) {

    // normalize the attribute name w/ lower case
    attribName = attribName.toLowerCase();

    // using the known component meta data
    // look up to see if we have a property wired up to this attribute name
    const prop = (<HostElement>elm).$meta.propsMeta.find(p => p.attribName === attribName);

    if (prop) {
      // cool we've got a prop using this attribute name
      // the value will be a string, so let's convert it
      // to the correct type the app wants

      if (prop.propType === TYPE_BOOLEAN) {
        // per the HTML spec, any string value means it is a boolean "true" value
        // but we'll cheat here and say that the string "false" is the boolean false
        elm[prop.propName] = (newVal === null || newVal === 'false') ? false : true;

      } else if (prop.propType === TYPE_NUMBER) {
        // force it to be a number
        elm[prop.propName] = parseFloat(newVal);

      } else {
        // idk, any will do
        elm[prop.propName] = newVal;
      }
    }
  }
}
