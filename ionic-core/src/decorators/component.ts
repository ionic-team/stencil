

export interface TypeDecorator {
  // /**
  //  * Invoke as ES7 decorator.
  //  */
  <T extends any>(type: T): T;

  // // Make TypeDecorator assignable to built-in ParameterDecorator type.
  // // ParameterDecorator is declared in lib.d.ts as a `declare type`
  // // so we cannot declare this interface as a subtype.
  // // see https://github.com/angular/angular/issues/3379#issuecomment-126169417
  // (target: Object, propertyKey?: string|symbol, parameterIndex?: number): void;

  // /**
  //  * Storage for the accumulated annotations so far used by the DSL syntax.
  //  *
  //  * Used by {@link Class} to annotate the generated class.
  //  */
  // annotations: any[];

  // /**
  //  * Generate a class from the definition and annotate it with {@link TypeDecorator#annotations}.
  //  */
  // Class(obj: any): any;
}


export function makeDecorator(
    name: string, props: {[name: string]: any}, parentClass?: any,
    chainFn: (fn: Function) => void = null): (...args: any[]) => (cls: any) => any {

  // const metaCtor = makeMetadataCtor([props]);

  function DecoratorFactory(objOrType: any): (cls: any) => any {
    // if (!(Reflect && Reflect.getOwnMetadata)) {
    //   throw 'reflect-metadata shim is required when using class decorators';
    // }

    if (this instanceof DecoratorFactory) {
      // metaCtor.call(this, objOrType);
      return this;
    }

    const annotationInstance = new (<any>DecoratorFactory)(objOrType);
    const chainAnnotation =
        typeof this === 'function' && Array.isArray(this.annotations) ? this.annotations : [];
    chainAnnotation.push(annotationInstance);
    const TypeDecorator: TypeDecorator = <TypeDecorator>function TypeDecorator(cls: any) {
      // const annotations = Reflect.getOwnMetadata('annotations', cls) || [];
      // annotations.push(annotationInstance);
      // Reflect.defineMetadata('annotations', annotations, cls);
      return cls;
    };
    // TypeDecorator.annotations = chainAnnotation;
    // TypeDecorator.Class = Class;
    if (chainFn) chainFn(TypeDecorator);
    return TypeDecorator;
  }

  if (parentClass) {
    DecoratorFactory.prototype = Object.create(parentClass.prototype);
  }

  DecoratorFactory.prototype.toString = () => `@${name}`;
  (<any>DecoratorFactory).annotationCls = DecoratorFactory;
  return DecoratorFactory;
}


export interface DirectiveDecorator {
  (obj: Directive): TypeDecorator;
  new (obj: Directive): Directive;
}


export interface Directive {
  selector?: string;
  inputs?: string[];
  outputs?: string[];
  host?: {[key: string]: string};
}


export const Directive: DirectiveDecorator = <DirectiveDecorator>makeDecorator('Directive', {
  selector: undefined,
  inputs: undefined,
  outputs: undefined,
  host: undefined,
});



@Directive({
  selector: 'hi'
})
class MyButton {}

var d = new MyButton();
