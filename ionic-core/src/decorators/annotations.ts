
export const annotations = new WeakMap();


export function addAnnotation(cls: any, dataKey: string, dataValue: any) {
  let clsAnnotations = annotations.get(cls);

  if (clsAnnotations) {
    clsAnnotations[dataKey] = dataValue;

  } else {
    clsAnnotations = {};
    clsAnnotations[dataKey] = dataValue;
    annotations.set(cls, clsAnnotations);
  }
}
