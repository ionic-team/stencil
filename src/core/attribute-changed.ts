import { HostElement, MembersMeta } from '../declarations';
import { parsePropertyValue } from '../util/data-parse';
import { toLowerCase } from '../util/helpers';


export function attributeChangedCallback(membersMeta: MembersMeta, elm: HostElement, attribName: string, oldVal: string, newVal: string, propName?: string) {
  // only react if the attribute values actually changed
  if (oldVal !== newVal && membersMeta) {

    // normalize the attribute name w/ lower case
    attribName = toLowerCase(attribName);

    // using the known component meta data
    // look up to see if we have a property wired up to this attribute name
    for (propName in membersMeta) {
      if (membersMeta[propName].attribName === attribName) {
        // cool we've got a prop using this attribute name the value will
        // be a string, so let's convert it to the correct type the app wants
        // below code is ugly yes, but great minification ;)
        (<any>elm)[propName] = parsePropertyValue(membersMeta[propName].propType, newVal);
        break;
      }
    }
  }
}
