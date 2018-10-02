import * as d from '../declarations';
import { defineMember } from './proxy-members';


export function proxyComponentInstance(
  plt: d.PlatformApi,
  meta: d.InternalMeta,
  cmpConstructor: d.ComponentConstructor,
  instance: d.ComponentInstance,
  hostSnapshot: d.HostSnapshot,
) {
  // at this point we've got a specific node of a host element, and created a component class instance
  // and we've already created getters/setters on both the host element and component class prototypes
  // let's upgrade any data that might have been set on the host element already
  // and let's have the getters/setters kick in and do their jobs

  // let's automatically add a reference to the host element on the instance

  // get the properties from the constructor
  // and add default "mode" and "color" properties
  Object.entries({
    color: { type: String },
    ...cmpConstructor.properties,
    mode: { type: String },
  }).forEach(([memberName, property]) => {
    // define each of the members and initialize what their role is
    defineMember(plt, meta, property, instance, memberName, hostSnapshot);
  });
}
