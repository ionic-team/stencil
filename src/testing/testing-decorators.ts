import * as d from '@declarations';
import { MEMBER_TYPE } from '@stencil/core/utils';


export function Component(opts: d.ComponentOptions) {
  return (cls: any) => {
    if (opts) {
      const cmpMeta = (cls.prototype.constructor as d.DecoratoredRuntimeConstructor).cmpMeta;
      cmpMeta.cmpTag = opts.tag;
      cmpMeta.scopedCssEncapsulation = !!opts.scoped;
      cmpMeta.shadowDomEncapsulation = !!opts.shadow;
    }
  };
}

interface PropertyTarget {
  constructor: d.DecoratoredRuntimeConstructor;
}

function addMember(target: PropertyTarget, memberName: string, memberType: number, propType?: number, attributeName?: string | 1 | 0, reflectToAttr?: boolean) {
  if (target.constructor.cmpMeta) {
    (target.constructor.cmpMeta.members = target.constructor.cmpMeta.members || []).push([
      memberName,
      memberType,
      propType,
      attributeName,
      reflectToAttr
    ]);
  }
}


export function Element() {
  return (target: any, memberName: string) => {
    addMember(target, memberName, MEMBER_TYPE.Element);
  };
}

export function Event(_opts?: d.EventOptions) {
  return (target: any, memberName: string) => {
    addMember(target, memberName, MEMBER_TYPE.Event);
  };
}

export function Listen(_opts?: d.ListenOptions) {
  return (target: any, memberName: string) => {
    addMember(target, memberName, 9999/*TODO*/);
  };
}

export function Method(_opts?: d.MethodOptions) {
  return (target: any, memberName: string) => {
    addMember(target, memberName, MEMBER_TYPE.Method);
  };
}

export function Prop(_opts?: d.PropOptions) {
  return (_target: any, _memberName: string) => {

    // addMember(
    //   target,
    //   memberName,
    //   (opts && opts.mutable) ? MEMBER_TYPE.PropMutable : MEMBER_TYPE.Prop,
    //   PROP_TYPE.Any,
    //   (opts && opts.reflectToAttr)
    // );

    // const cmpMeta = (target.constructor as d.DecoratoredRuntimeConstructor).cmpMeta;
    // if (opts) {
    //   if (opts.mutable) {
    //     (target.constructor as d.DecoratoredRuntimeConstructor).PropMutable = true;
    //   }
    //   if (opts.reflectToAttr) {
    //     (target.constructor as d.DecoratoredRuntimeConstructor).ReflectToAttr = true;
    //   }
    // }
  };
}

export function State() {
  return (_target: any, _propertyKey: string) => {
    // const cmpMeta = (target.constructor as d.DecoratoredRuntimeConstructor).cmpMeta;
  };
}

export function Watch(_propName: string) {
  return (_target: any, _propertyKey: string) => {
    // const cmpMeta = (target.constructor as d.DecoratoredRuntimeConstructor).cmpMeta;
  };
}

export function updateRuntimeBuild(b: d.Build, Cstr: d.DecoratoredRuntimeConstructor) {
  const cmpMeta = Cstr.cmpMeta;

  if (cmpMeta.shadowDomEncapsulation) {
    b.shadowDom = true;
  }
  if (cmpMeta.scopedCssEncapsulation) {
    b.scoped = true;
  }

  // if (cmpMeta.members) {
  //   cmpMeta.members.forEach(member => {
  //     if (Cstr.Element) {
  //       b.element = true;
  //       b.member = true;
  //     }

  //     if (Cstr.Method) {
  //       b.method = true;
  //       b.member = true;
  //     }

  //     if (Cstr.Listen) {
  //       b.listener = true;
  //       b.member = true;
  //     }

  //     if (Cstr.Prop) {
  //       b.prop = true;
  //       b.member = true;
  //       b.updatable = true;
  //       b.observeAttr = true;

  //       if (Cstr.PropMutable) {
  //         b.propMutable = true;
  //       }
  //       if (Cstr.ReflectToAttr) {
  //         b.reflectToAttr = true;
  //       }
  //     }

  //     if (Cstr.State) {
  //       b.state = true;
  //       b.member = true;
  //       b.updatable = true;
  //     }

  //     if (Cstr.Watch) {
  //       b.watchCallback = true;
  //     }
  //   });
  // }

  if (Cstr.prototype.connectedCallback) b.connectedCallback = true;
  if (Cstr.prototype.disconnectedCallback) b.disconnectedCallback = true;
  if (Cstr.prototype.componentWillLoad) b.cmpWillLoad = true;
  if (Cstr.prototype.componentDidLoad) b.cmpDidLoad = true;
  if (Cstr.prototype.componentWillUpdate) b.cmpWillUpdate = true;
  if (Cstr.prototype.componentDidUpdate) b.cmpDidUpdate = true;
  if (Cstr.prototype.componentDidUnload) b.cmpDidUnload = true;
  if (Cstr.prototype.render) b.hasRenderFn = true;
  if (Cstr.prototype.hostData) b.hostData = true;
}
