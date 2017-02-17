
const annotations = new WeakMap();


export function setAnnotation(cls: any, dataKey: string, dataValue: any) {
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
  let clsAnnotations = annotations.get(cls);

  if (clsAnnotations) {
    return clsAnnotations[dataKey];
  }
}
