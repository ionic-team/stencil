import * as d from '../declarations';


export function attributeChangedCallback(attrPropsMap: {[attr: string]: string}, elm: d.HostElement, attribName: string, newVal: string) {
  // look up to see if we have a property wired up to this attribute name
  const propName = attrPropsMap[attribName];
  if (propName) {
    // there is not need to cast the value since, it's already casted when
    // the prop is setted
    (elm as any)[propName] = newVal;
  }
}
