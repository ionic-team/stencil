import { ComponentMeta, HostElement } from '../../util/interfaces';
import { parsePropertyValue } from '../../util/data-parse';


export function attributeChangedCallback(cmpMeta: ComponentMeta, elm: HostElement, attribName: string, oldVal: string, newVal: string) {
  // only react if the attribute values actually changed
  if (oldVal !== newVal) {

    // normalize the attribute name w/ lower case
    attribName = attribName.toLowerCase();

    // using the known component meta data
    // look up to see if we have a property wired up to this attribute name
    const propsMeta = cmpMeta.membersMeta;
    if (propsMeta) {
      for (var propName in propsMeta) {
        if (propsMeta[propName].attribName === attribName) {
          // cool we've got a prop using this attribute name the value will
          // be a string, so let's convert it to the correct type the app wants
          // below code is ugly yes, but great minification ;)
          (<any>elm)[propName] = parsePropertyValue(propsMeta[propName].propType, newVal);
          break;
        }
      }
    }
  }
}
