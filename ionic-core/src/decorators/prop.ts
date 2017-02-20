import { getAnnotation, setAnnotation } from './annotations';
import { PropOptionsMeta } from '../shared/interfaces';


export function getAllPropMeta(cls: any) {
  const propAnnotation: {[key: string]: PropOptionsMeta} = getAnnotation(cls, PROP_ANNOTATION);
  if (propAnnotation) {
    return propAnnotation;
  }
}


export const Prop: PropDecorator = function(opts: PropOptionsMeta): (target: any, propKey: string) => any {
  return function(target: any, propKey: string) {
    let propAnnotation: {[key: string]: PropOptionsMeta} = getAnnotation(target.constructor, PROP_ANNOTATION);
    if (!propAnnotation) {
      propAnnotation = {};
    }
    propAnnotation[propKey] = opts;

    setAnnotation(target.constructor, PROP_ANNOTATION, propAnnotation);
    return target.constructor;
  };
};


export interface PropDecorator {
  (opts: PropOptionsMeta): any;
}


const PROP_ANNOTATION = 'Prop';
