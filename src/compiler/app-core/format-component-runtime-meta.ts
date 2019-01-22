import * as d from '@declarations';
import { MEMBER_TYPE, PROP_TYPE } from '@utils';


export function formatLazyBundleRuntimeMeta(bundleId: any, cmps: d.ComponentCompilerMeta[]) {
  const lazyBundleRuntimeMeta: d.LazyBundleRuntimeMeta = [
    bundleId,
    cmps.map(cmp => {
      return formatComponentRuntimeMeta(cmp, true);
    })
  ];
  return lazyBundleRuntimeMeta;
}


export function formatComponentRuntimeMeta(compilerMeta: d.ComponentCompilerMeta, includeTagName: boolean) {
  const runtimeMeta: d.ComponentLazyRuntimeMeta = {};

  if (includeTagName) {
    runtimeMeta.cmpTag = compilerMeta.tagName;
  }

  const members = formatComponentRuntimeMembers(compilerMeta);
  if (Object.keys(members).length > 0) {
    runtimeMeta.members = members;
  }

  const hostListeners = formatHostListeners(compilerMeta);
  if (hostListeners.length > 0) {
    runtimeMeta.hostListeners = hostListeners;
  }

  if (compilerMeta.encapsulation === 'shadow') {
    runtimeMeta.shadowDomEncapsulation = shortBoolean(true);

  } else if (compilerMeta.encapsulation === 'scoped') {
    runtimeMeta.scopedCssEncapsulation = shortBoolean(true);
  }

  return runtimeMeta;
}


function formatComponentRuntimeMembers(compilerMeta: d.ComponentCompilerMeta) {
  const runtimeMembers: d.ComponentRuntimeMembers = {};

  compilerMeta.properties.forEach(compilerProperty => {
    formatPropertyRuntimeMember(runtimeMembers, compilerProperty);
  });

  compilerMeta.states.forEach(compilerState => {
    formatStateRuntimeMember(runtimeMembers, compilerState);
  });

  compilerMeta.methods.forEach(compilerMethod => {
    formatMethodRuntimeMember(runtimeMembers, compilerMethod);
  });

  compilerMeta.events.forEach(compilerEvent => {
    formatEventRuntimeMember(runtimeMembers, compilerEvent);
  });

  return runtimeMembers;
}


function formatPropertyRuntimeMember(runtimeMembers: d.ComponentRuntimeMembers, compilerProperty: d.ComponentCompilerProperty) {
  const runtimeMember: d.ComponentRuntimeMember = [
    /**
     * [0] member type
     */
    compilerProperty.mutable ? MEMBER_TYPE.PropMutable : MEMBER_TYPE.Prop,

    /**
     * [1] prop type
     */
    formatPropType(compilerProperty.type),

    /**
     * [2] attribute name to observe
     */
    formatAttrName(compilerProperty),

    /**
     * [3] reflect to attribute
     */
    shortBoolean(compilerProperty.reflectToAttr),

  ];

  runtimeMembers[compilerProperty.name] = trimFalsy(runtimeMember);
}


function formatAttrName(compilerProperty: d.ComponentCompilerProperty) {
  if (typeof compilerProperty.attr === 'string') {
    // string attr name means we should observe this attribute
    if (compilerProperty.name === compilerProperty.attr) {
      // property name and attribute name are the exact same
      // true value means to use the property name for the attribute name
      return 1;
    }
    // property name and attribute name are not the same
    // so we need to return the actual string value
    // example: "multiWord" !== "multi-word"
    return compilerProperty.attr;
  }
  // we shouldn't even observe an attribute for this property
  return 0;
}


function formatPropType(type: d.ComponentCompilerPropertyType) {
  if (type === 'string') {
    return PROP_TYPE.String;
  }
  if (type === 'number') {
    return PROP_TYPE.Number;
  }
  if (type === 'boolean') {
    return PROP_TYPE.Boolean;
  }
  if (type === 'any') {
    return PROP_TYPE.Any;
  }
  return PROP_TYPE.Unknown;
}


function formatStateRuntimeMember(runtimeMembers: d.ComponentRuntimeMembers, compilerState: d.ComponentCompilerState) {
  const runtimeState: d.ComponentRuntimeMember = [
    /**
     * [0] member type
     */
    MEMBER_TYPE.State
  ];

  runtimeMembers[compilerState.name] = runtimeState;
}


function formatMethodRuntimeMember(runtimeMembers: d.ComponentRuntimeMembers, compilerMethod: d.ComponentCompilerMethod) {
  const runtimeMethod: d.ComponentRuntimeMember = [
    /**
     * [0] member type
     */
    MEMBER_TYPE.Method
  ];

  runtimeMembers[compilerMethod.name] = runtimeMethod;
}


function formatEventRuntimeMember(runtimeMembers: d.ComponentRuntimeMembers, compilerEvent: d.ComponentCompilerEvent) {
  const runtimeMethod: d.ComponentRuntimeMember = [
    /**
     * [0] member type
     */
    MEMBER_TYPE.Event
  ];

  runtimeMembers[compilerEvent.name] = runtimeMethod;
}


function formatHostListeners(compilerMeta: d.ComponentCompilerMeta) {
  return compilerMeta.listeners.map(compilerListener => {
    const hostListener: d.ComponentRuntimeHostListener = [
      compilerListener.name,
      compilerListener.method,
      shortBoolean(compilerListener.disabled),
      shortBoolean(compilerListener.capture),
      shortBoolean(compilerListener.passive)
    ];
    return trimFalsy(hostListener);
  });
}


function shortBoolean(val: boolean) {
  return (val ? 1 : 0) as any;
}


function trimFalsy(data: any): any {
  const arr = (data as any[]);
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i]) {
      break;
    }
    // if falsy, safe to pop()
    arr.pop();
  }

  return arr;
}
