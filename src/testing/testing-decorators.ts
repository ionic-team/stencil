import * as d from '../declarations';

export interface TestingCmpCstr {
  ComponentOptions: d.ComponentOptions;
  Element: boolean;
  Event: boolean;
  Listen: boolean;
  Method: boolean;
  Prop: boolean;
  PropMutable: boolean;
  ReflectToAttr: boolean;
  State: boolean;
  Watch: boolean;
  prototype: {
    connectedCallback: Function;
    disconnectedCallback: Function;
    componentWillLoad: Function;
    componentDidLoad: Function;
    componentWillUpdate: Function;
    componentDidUpdate: Function;
    componentDidUnload: Function;
    render: Function;
    hostData: Function;
  };
}

export function Component(opts: d.ComponentOptions) {
  return (cls: any) => {
    (cls.prototype.constructor as TestingCmpCstr).ComponentOptions = opts;
  };
}

export function Element() {
  return (target: any, _propertyKey: string) => {
    (target.constructor as TestingCmpCstr).Element = true;
  };
}

export function Event(_opts?: d.EventOptions) {
  return (target: any, _propertyKey: string) => {
    (target.constructor as TestingCmpCstr).Event = true;
  };
}

export function Listen(_opts?: d.ListenOptions) {
  return (target: any, _propertyKey: string) => {
    (target.constructor as TestingCmpCstr).Listen = true;
  };
}

export function Method(_opts?: d.MethodOptions) {
  return (target: any, _propertyKey: string) => {
    (target.constructor as TestingCmpCstr).Method = true;
  };
}

export function Prop(opts?: d.PropOptions) {
  return (target: any, _propertyKey: string) => {
    (target.constructor as TestingCmpCstr).Prop = true;
    if (opts) {
      if (opts.mutable) {
        (target.constructor as TestingCmpCstr).PropMutable = true;
      }
      if (opts.reflectToAttr) {
        (target.constructor as TestingCmpCstr).ReflectToAttr = true;
      }
    }
  };
}

export function State() {
  return (target: any, _propertyKey: string) => {
    (target.constructor as TestingCmpCstr).State = true;
  };
}

export function Watch(_propName: string) {
  return (target: any, _propertyKey: string) => {
    (target.constructor as TestingCmpCstr).Watch = true;
  };
}
