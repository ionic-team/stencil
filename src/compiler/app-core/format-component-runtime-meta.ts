import * as d from '@declarations';
import { LISTENER_FLAGS, MEMBER_FLAGS, MEMBER_TYPE, PROP_TYPE } from '@utils';


export function formatLazyBundleRuntimeMeta(bundleId: any, cmps: d.ComponentCompilerMeta[]): d.LazyBundleRuntimeData {
  return [
    bundleId,
    cmps.map(cmp => formatComponentRuntimeMeta(cmp, true))
  ];
}


export function formatComponentRuntimeMeta(compilerMeta: d.ComponentCompilerMeta, includeTagName: boolean) {
  const runtimeMeta: d.ComponentLazyRuntimeMeta = {};

  if (includeTagName) {
    runtimeMeta.cmpTag = compilerMeta.tagName;
  }

  const members = formatComponentRuntimeMembers(compilerMeta);
  if (Object.keys(members).length > 0) {
    runtimeMeta.cmpMembers = members;
  }

  const hostListeners = formatHostListeners(compilerMeta);
  if (hostListeners.length > 0) {
    runtimeMeta.cmpHostListeners = hostListeners;
  }

  if (compilerMeta.encapsulation === 'shadow') {
    runtimeMeta.cmpShadowDomEncapsulation = shortBoolean(true);

  } else if (compilerMeta.encapsulation === 'scoped') {
    runtimeMeta.cmpScopedCssEncapsulation = shortBoolean(true);
  }

  return runtimeMeta;
}


export function stringifyRuntimeData(data: any) {
  // stringify the data, then remove property double-quotes so they can be property renamed
  return JSON.stringify(data)
             .replace(/"cmpTag"/g, 'cmpTag')
             .replace(/"cmpMeta"/g, 'cmpMeta')
             .replace(/"cmpHostListeners"/g, 'cmpHostListeners')
             .replace(/"cmpShadowDomEncapsulation"/g, 'cmpShadowDomEncapsulation')
             .replace(/"cmpScopedCssEncapsulation"/g, 'cmpScopedCssEncapsulation')
             .replace(/"cmpMembers"/g, 'cmpMembers');
}


function formatComponentRuntimeMembers(compilerMeta: d.ComponentCompilerMeta): d.ComponentRuntimeMembers {
  return {
    ...formatPropertiesRuntimeMember(compilerMeta.properties),
    ...formatStatesRuntimeMember(compilerMeta.states),
    ...formatMethodsRuntimeMember(compilerMeta.methods),
  };
}


function formatPropertiesRuntimeMember(properties: d.ComponentCompilerProperty[]) {
  const runtimeMembers: d.ComponentRuntimeMembers = {};

  properties.forEach(member => {
    runtimeMembers[member.name] = trimFalsy([
      /**
       * [0] member type
       */
      formatFlags(member),
      formatAttrName(member)
    ]);
  });
  return runtimeMembers;
}


function formatFlags(compilerProperty: d.ComponentCompilerProperty) {
  let type = formatPropType(compilerProperty.type);
  if (compilerProperty.mutable) {
    type |= MEMBER_FLAGS.Mutable;
  }
  if (compilerProperty.reflect) {
    type |= MEMBER_FLAGS.ReflectAttr;
  }
  return type;
}


function formatAttrName(compilerProperty: d.ComponentCompilerProperty) {
  if (typeof compilerProperty.attribute === 'string') {
    // string attr name means we should observe this attribute
    if (compilerProperty.name === compilerProperty.attribute) {
      // property name and attribute name are the exact same
      // true value means to use the property name for the attribute name
      return undefined;
    }

    // property name and attribute name are not the same
    // so we need to return the actual string value
    // example: "multiWord" !== "multi-word"
    return compilerProperty.attribute;
  }

  // we shouldn't even observe an attribute for this property
  return undefined;
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


function formatStatesRuntimeMember(states: d.ComponentCompilerState[]) {
  const runtimeMembers: d.ComponentRuntimeMembers = {};

  states.forEach(member => {
    runtimeMembers[member.name] = [
      /**
       * [0] member flags
       */
      MEMBER_TYPE.State
    ];
  });
  return runtimeMembers;
}


function formatMethodsRuntimeMember(methods: d.ComponentCompilerMethod[]) {
  const runtimeMembers: d.ComponentRuntimeMembers = {};

  methods.forEach(member => {
    runtimeMembers[member.name] = [
      /**
       * [0] member flags
       */
      MEMBER_TYPE.Method
    ];
  });
  return runtimeMembers;
}

function formatHostListeners(compilerMeta: d.ComponentCompilerMeta) {
  return compilerMeta.listeners.map(compilerListener => {
    const hostListener: d.ComponentRuntimeHostListener = [
      computeListenerFlags(compilerListener),
      compilerListener.name,
      compilerListener.method,
    ];
    return hostListener;
  });
}

function computeListenerFlags(listener: d.ComponentCompilerListener) {
  let flags = 0;
  if (listener.disabled) {
    flags |= LISTENER_FLAGS.Disabled;
  }
  if (listener.capture) {
    flags |= LISTENER_FLAGS.Capture;
  }
  if (listener.passive) {
    flags |= LISTENER_FLAGS.Passive;
  }
  switch (listener.target) {
    case 'document': flags |= LISTENER_FLAGS.TargetDocument; break;
    case 'window': flags |= LISTENER_FLAGS.TargetWindow; break;
    case 'parent': flags |= LISTENER_FLAGS.TargetParent; break;
    case 'body': flags |= LISTENER_FLAGS.TargetBody; break;
  }
  return flags;
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
