import * as d from '../declarations';
import { defineMember } from './proxy-members';


export function proxyComponentInstance(
  plt: d.PlatformApi,
  cmpConstructor: d.ComponentConstructor,
  elm: d.HostElement,
  instance: d.ComponentInstance,
  hostSnapshot: d.HostSnapshot,
  perf: Performance
) {
  if (__BUILD_CONDITIONALS__.perf) {
    perf.mark(`proxy_instance_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
  }

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
  Object.entries({
    color: { type: String },
    ...cmpConstructor.properties,
    mode: { type: String },
  }).forEach(([memberName, property]) => {
    // define each of the members and initialize what their role is
    defineMember(plt, property, elm, instance, memberName, hostSnapshot, perf);
  });

  if (__BUILD_CONDITIONALS__.perf) {
    perf.mark(`proxy_instance_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
    perf.measure(`proxy_instance:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `proxy_instance_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `proxy_instance_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
  }
}
