import { ComponentConstructor, ComponentConstructorProperties,
  ComponentInstance, HostElement, PlatformApi } from '../../declarations';
import { defineMember } from './proxy-members';


export function proxyComponentInstance(plt: PlatformApi, cmpConstructor: ComponentConstructor, elm: HostElement, instance: ComponentInstance, properties?: ComponentConstructorProperties, memberName?: string) {
  // at this point we've got a specific node of a host element, and created a component class instance
  // and we've already created getters/setters on both the host element and component class prototypes
  // let's upgrade any data that might have been set on the host element already
  // and let's have the getters/setters kick in and do their jobs

  // let's automatically add a reference to the host element on the instance
  plt.hostElementMap.set(instance, elm);

  // create the values object if it doesn't already exist
  // this will hold all of the internal getter/setter values
  if (!plt.valuesMap.has(elm)) {
    plt.valuesMap.set(elm, {});
  }

  // get the properties from the constructor
  // and add default "mode" and "color" properties
  properties = Object.assign({
    color: { type: String }
  }, cmpConstructor.properties);

  // always set mode
  properties.mode = { type: String };

  // define each of the members and initialize what their role is
  for (memberName in properties) {
    defineMember(plt, properties[memberName], elm, instance, memberName);
  }
}
