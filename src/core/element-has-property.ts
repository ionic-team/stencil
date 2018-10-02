import * as d from '../declarations';


export function elementHasProperty(cmpMeta: d.ComponentMeta, elm: d.HostElement, memberName: string) {
  // within the browser, the element's prototype
  // already has its getter/setter set, but on the
  // server the prototype is shared causing issues
  // so instead the server's elm has the getter/setter
  // directly on the actual element instance, not its prototype
  // so at the time of this function being called, the server
  // side element is unaware if the element has this property
  // name. So for server-side only, do this trick below
  // don't worry, this runtime code doesn't show on the client
  let hasOwnProperty = elm.hasOwnProperty(memberName);
  if (!hasOwnProperty) {
    // element doesn't
    if (cmpMeta) {
      if (cmpMeta.componentConstructor && cmpMeta.componentConstructor.properties) {
        // if we have the constructor property data, let's check that
        const member = cmpMeta.componentConstructor.properties[memberName];
        hasOwnProperty = !!(member && member.type);
      }
      if (!hasOwnProperty && cmpMeta.membersMeta) {
        // if we have the component's metadata, let's check that
        const member = cmpMeta.membersMeta[memberName];
        hasOwnProperty = !!(member && member.propType);
      }
    }
  }
  return hasOwnProperty;
}
