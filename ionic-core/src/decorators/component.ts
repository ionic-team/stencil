import { ComponentMeta, ComponentCompiledMeta, ComponentClass } from '../shared/interfaces';
import { getAnnotation, setAnnotation } from './annotations';


export function getComponentMeta(cls: any): ComponentCompiledMeta {
  return getAnnotation(cls, COMPONENT_ANNOTATION);
}


export const Component: ComponentDecorator = function(metadata: ComponentMeta): (cls: ComponentClass) => ClassDecorator {
  console.log('Component', metadata)
  return function(cls: any) {
    setAnnotation(cls, COMPONENT_ANNOTATION, metadata);
    return cls;
  };
};


export interface ComponentDecorator {
  (obj: ComponentMeta): any;
}


const COMPONENT_ANNOTATION = 'Component';
