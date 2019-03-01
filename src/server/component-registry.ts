import * as d from '@declarations';
import { proxyComponent } from '@runtime';


const cstrs = new Map();


export function getComponent(tagName: string): any {
  return cstrs.get(tagName);
}


export function registerComponents(Cstrs: d.ComponentNativeConstructor[]) {
  Cstrs.forEach(Cstr => {
    cstrs.set(
      Cstr.cmpMeta.t,
      proxyComponent(Cstr, Cstr.cmpMeta, 0, 1)
    );
  });
}
