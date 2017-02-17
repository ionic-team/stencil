import { addAnnotation } from './annotations';


function makeDecorator(key: string): (...args: any[]) => (cls: any) => any {

  function DecoratorFactory(data: any): (cls: any) => any {
    const TypeDecorator: any = function(cls: any) {
      addAnnotation(cls, key, data);
      return cls;
    };
    return TypeDecorator;
  }

  return DecoratorFactory;
}


export interface ComponentDecorator {
  (obj: Component): any;
}


export interface Component {
  selector?: string;
  inputs?: string[];
  outputs?: string[];
  host?: {[key: string]: string};
}


export const Component: ComponentDecorator = makeDecorator('Component');


export interface InputDecorator {
  (obj: Input): any;
}


export interface Input {
}


export const Input: InputDecorator = makeDecorator('Input');


export interface OutputDecorator {
  (obj: Output): any;
}


export interface Output {
}


export const Output: OutputDecorator = makeDecorator('Output');
