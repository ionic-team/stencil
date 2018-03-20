import * as d from '../declarations';
import { parsePropertyValue } from '../util/data-parse';
import { toLowerCase } from '../util/helpers';


export function attributeChangedCallback(membersMeta: d.MembersMeta, elm: d.HostElement, attribName: string, oldVal: string, newVal: string, propName?: string, memberMeta?: d.MemberMeta) {
  // only react if the attribute values actually changed
  if (membersMeta && oldVal !== newVal) {

    // using the known component meta data
    // look up to see if we have a property wired up to this attribute name
    for (propName in membersMeta) {
      memberMeta = membersMeta[propName];

      // normalize the attribute name w/ lower case
      if (memberMeta.attribName && toLowerCase(memberMeta.attribName) === toLowerCase(attribName)) {
        // cool we've got a prop using this attribute name, the value will
        // be a string, so let's convert it to the correct type the app wants
        (elm as any)[propName] = parsePropertyValue(memberMeta.propType, newVal);
        break;
      }
    }
  }
}
