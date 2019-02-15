

const cstrs = new Map();


export function getComponent(tagName: string): any {
  return cstrs.get(tagName);
}


export function registerComponents(Cstrs: any[]) {
  Cstrs.forEach(Cstr => {
    cstrs.set(Cstr.is, Cstr);
  });
}
