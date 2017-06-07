import { HostElement, PlatformApi } from '../../util/interfaces';
import { TYPE_BOOLEAN, TYPE_NUMBER } from '../../util/constants';


export function attributeChangedCallback(plt: PlatformApi, elm: HostElement, attribName: string, oldVal: string, newVal: string) {
  // only react if the attribute values actually changed
  if (oldVal !== newVal) {

    // normalize the attribute name w/ lower case
    attribName = attribName.toLowerCase();

    // using the known component meta data
    // look up to see if we have a property wired up to this attribute name
    const prop = plt.getComponentMeta(elm).propsMeta.find(p => p.attribName === attribName);

    if (prop) {
      // cool we've got a prop using this attribute name the value will
      // be a string, so let's convert it to the correct type the app wants
      // below code is ugly yes, but great minification ;)
      (<any>elm)[prop.propName] =
          (prop.propType === TYPE_BOOLEAN) ?
              // per the HTML spec, any string value means it is a boolean "true" value
              // but we'll cheat here and say that the string "false" is the boolean false
              (newVal === null || newVal === 'false' ? false : true) :

          (prop.propType === TYPE_NUMBER) ?
              // force it to be a number
              parseFloat(newVal) :

          // else, idk, "any"
          newVal;
    }
  }
}
