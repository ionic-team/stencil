

export function setAnnotation(cls: any, dataKey: string, dataValue: any) {
  const annotations = getAnnotationsGlobal();
console.log('setAnnotation', annotations)
  let clsAnnotations = annotations.get(cls);

  if (clsAnnotations) {
    clsAnnotations[dataKey] = dataValue;

  } else {
    clsAnnotations = {};
    clsAnnotations[dataKey] = dataValue;
    annotations.set(cls, clsAnnotations);
  }
}


export function getAnnotation(cls: any, dataKey: string) {
  const annotations = getAnnotationsGlobal();

  console.log('getAnnotation', annotations)
  let clsAnnotations = annotations.get(cls);

  if (clsAnnotations) {
    return clsAnnotations[dataKey];
  }
}

function getAnnotationsGlobal() {
  const GLOBAL = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : Function("return this;")();
  GLOBAL.annotations = GLOBAL.annotations || new WeakMap();
  return GLOBAL.annotations;
}
