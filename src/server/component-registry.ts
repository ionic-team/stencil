import * as d from '@declarations';


const cstrs = new Map();


export function getComponent(tagName: string): any {
  return cstrs.get(tagName);
}


export function registerComponents(Cstrs: d.ComponentNativeConstructor[]) {
  Cstrs.forEach(Cstr => {
    cstrs.set(Cstr.cmpMeta.cmpTag, Cstr);
  });
}
