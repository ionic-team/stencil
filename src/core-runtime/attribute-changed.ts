import * as d from '../declarations';
import { toLowerCase } from '../util/helpers';


export const attributeChangedCallback = (elm: d.HostElement, attrNameToPropName: Map<string, string>, attribName: string, newVal: string, propName?: string) =>
  // look up to see if we have a property wired up to this attribute name
  (propName = attrNameToPropName.get(toLowerCase(attribName)), (elm as any)[propName] = newVal);
