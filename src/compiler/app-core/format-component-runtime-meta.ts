import * as d from '@declarations';
import { MEMBER_FLAGS, MEMBER_TYPE, PROP_TYPE } from '@utils';


export function formatLazyBundleRuntimeMeta(bundleId: any, cmps: d.ComponentCompilerMeta[]) {
  const lazyBundleRuntimeMeta: d.LazyBundleRuntimeData = [
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


function formatComponentRuntimeMembers(compilerMeta: d.ComponentCompilerMeta): d.ComponentRuntimeMembers {
  return {
    ...formatPropertiesRuntimeMember(compilerMeta.properties),
    ...formatStatesRuntimeMember(compilerMeta.states),
    ...formatMethodsRuntimeMember(compilerMeta.methods),
    ...formatEventsRuntimeMember(compilerMeta.events),
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


function formatEventsRuntimeMember(events: d.ComponentCompilerEvent[]) {
  const runtimeMembers: d.ComponentRuntimeMembers = {};

  events.forEach(member => {
    let flags = MEMBER_FLAGS.Event;
    if (member.bubbles) {
      flags |= MEMBER_FLAGS.EventBubbles;
    }
    if (member.composed) {
      flags |= MEMBER_FLAGS.EventComposed;
    }
    if (member.cancelable) {
      flags |= MEMBER_FLAGS.EventCancellable;
    }
    runtimeMembers[member.name] = [
      /**
       * [0] member flags
       */
      flags
    ];
  });
  return runtimeMembers;
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
