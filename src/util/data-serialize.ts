import { BundleIds, ComponentMeta, ComponentConstructorProperty,
  ComponentConstructorProperties, ComponentRegistry, ListenMeta,
  LoadComponentRegistry, MemberMeta, MembersMeta, StylesMeta, EventMeta, ComponentConstructorEvent } from './interfaces';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../util/constants';


export function formatComponentLoader(cmpMeta: ComponentMeta): LoadComponentRegistry {
  const d: any[] = [
    /* 0 */ cmpMeta.tagNameMeta,
    /* 1 */ formatBundleIds(cmpMeta.bundleIds),
    /* 2 */ formatHasStyles(cmpMeta.stylesMeta),
    /* 3 */ formatMembers(cmpMeta.membersMeta),
    /* 4 */ formatEncapsulation(cmpMeta.encapsulation),
    /* 5 */ formatListeners(cmpMeta.listenersMeta)
  ];

  return <any>trimFalsyData(d);
}


export function formatBundleIds(bundleIds: BundleIds): any {
  if (!bundleIds) {
    return 'invalid-bundle-id';
  }

  if (typeof bundleIds === 'string') {
    return bundleIds;
  }

  const modes = Object.keys(bundleIds).sort();
  if (!modes.length) {
    return 'invalid-bundle-id';
  }

  if (modes.length === 1) {
    return [
      bundleIds[modes[0]].es2015,
      bundleIds[modes[0]].es5
    ];
  }

  const bundleIdObj: any = {};

  modes.forEach(modeName => {
    bundleIdObj[modeName] = [
      bundleIds[modeName].es2015,
      bundleIds[modeName].es5
    ];
  });

  return bundleIdObj;
}


export function formatHasStyles(stylesMeta: StylesMeta) {
  if (stylesMeta && Object.keys(stylesMeta).length > 0) {
    return 1;
  }
  return 0;
}


function formatMembers(membersMeta: MembersMeta) {
  if (!membersMeta) {
    return 0;
  }

  const observeAttrs: any[] = [];

  const memberNames = Object.keys(membersMeta).sort();

  memberNames.forEach(memberName => {
    const memberMeta = membersMeta[memberName];

    const d: any[] = [
      memberName,
      memberMeta.memberType
    ];

    if (typeof memberMeta.attribName === 'string') {
      // observe the attribute
      d.push(1);

    } else {
      // do not observe the attribute
      d.push(0);
    }

    if (memberMeta.propType === PROP_TYPE.Boolean || memberMeta.propType === PROP_TYPE.Number || memberMeta.propType === PROP_TYPE.String || memberMeta.propType === PROP_TYPE.Any) {
      d.push(memberMeta.propType);

    } else {
      d.push(PROP_TYPE.Unknown);
    }

    if (memberMeta.ctrlId) {
      d.push(memberMeta.ctrlId);
    }

    observeAttrs.push(d);
  });

  if (!observeAttrs.length) {
    return 0;
  }

  return observeAttrs.map(p => {
    return trimFalsyData(p);
  });
}


function formatEncapsulation(val: ENCAPSULATION) {
  if (val === ENCAPSULATION.ShadowDom) {
    return ENCAPSULATION.ShadowDom;
  }
  if (val === ENCAPSULATION.ScopedCss) {
    return ENCAPSULATION.ScopedCss;
  }
  return ENCAPSULATION.NoEncapsulation;
}


function formatListeners(listeners: ListenMeta[]) {
  if (!listeners || !listeners.length) {
    return 0;
  }

  return listeners.map(listener => {
    const d: any[] = [
      listener.eventName,
      listener.eventMethodName,
      listener.eventDisabled ? 1 : 0,
      listener.eventPassive ? 1 : 0,
      listener.eventCapture ? 1 : 0
    ];
    return trimFalsyData(d);
  });
}


export function formatComponentRegistry(registry: ComponentRegistry) {
  // ensure we've got a standard order of the components
  return Object.keys(registry).sort().map(tag => {
    if (registry[tag]) {
      return formatComponentLoader(registry[tag]);
    }
    return null;
  }).filter(c => c);
}


export function formatComponentConstructorProperties(membersMeta: MembersMeta) {
  if (!membersMeta) {
    return null;
  }

  const memberNames = Object.keys(membersMeta).sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  });

  if (!memberNames.length) {
    return null;
  }

  const properties: ComponentConstructorProperties = {};

  memberNames.forEach(memberName => {
    properties[memberName] = formatComponentConstructorProperty(membersMeta[memberName]);
  });

  return properties;
}


function formatComponentConstructorProperty(memberMeta: MemberMeta) {
  const property: ComponentConstructorProperty = {};

  if (memberMeta.memberType === MEMBER_TYPE.State) {
    property.state = true;

  } else if (memberMeta.memberType === MEMBER_TYPE.Element) {
    property.elementRef = true;

  } else if (memberMeta.memberType === MEMBER_TYPE.Method) {
    property.method = true;

  } else if (memberMeta.memberType === MEMBER_TYPE.PropConnect) {
    property.connect = memberMeta.ctrlId;

  } else if (memberMeta.memberType === MEMBER_TYPE.PropContext) {
    property.context = memberMeta.ctrlId;

  } else {
    if (memberMeta.propType === PROP_TYPE.String) {
      property.type = String;

    } else if (memberMeta.propType === PROP_TYPE.Boolean) {
      property.type = Boolean;

    } else if (memberMeta.propType === PROP_TYPE.Number) {
      property.type = Number;

    } else if (memberMeta.propType === PROP_TYPE.Any) {
      property.type = 'Any';
    }

    if (memberMeta.memberType === MEMBER_TYPE.PropMutable) {
      property.mutable = true;
    }
  }

  if (memberMeta.willChangeMethodNames && memberMeta.willChangeMethodNames.length > 0) {
    property.willChange = memberMeta.willChangeMethodNames.slice();
  }

  if (memberMeta.didChangeMethodNames && memberMeta.didChangeMethodNames.length > 0) {
    property.didChange = memberMeta.didChangeMethodNames.slice();
  }

  return property;
}


export function formatComponentConstructorEvents(eventsMeta: EventMeta[]) {
  if (!eventsMeta || !eventsMeta.length) {
    return null;
  }

  return eventsMeta.map(ev => formatComponentConstructorEvent(ev));
}


export function formatComponentConstructorEvent(eventMeta: EventMeta) {
  const constructorEvent: ComponentConstructorEvent = {
    name: eventMeta.eventName,
    method: eventMeta.eventMethodName
  };

  // bubbles default w/in runtime is true
  // only set if it's false
  if (!eventMeta.eventBubbles) {
    constructorEvent.bubbles = false;
  }

  // cancelable default w/in runtime is true
  // only set if it's false
  if (!eventMeta.eventCancelable) {
    constructorEvent.cancelable = false;
  }

  // cancelable default w/in runtime is true
  // only set if it's false
  if (!eventMeta.eventComposed) {
    constructorEvent.composed = false;
  }

  return constructorEvent;
}


function trimFalsyData(d: string[]) {
  for (var i = d.length - 1; i >= 0; i--) {
    if (d[i]) {
      break;
    }
    // if falsy, safe to pop()
    d.pop();
  }

  return d;
}


export function getJsPathBundlePlaceholder(tagName: string) {
  return `/***:js-path:${tagName}:***/`;
}


export function getStylePlaceholder(tagName: string) {
  return `/***:style:${tagName}:***/`;
}


export function getStyleIdPlaceholder(tagName: string) {
  return `/***:style-id:${tagName}:***/`;
}


export function getBundleIdPlaceholder() {
  return `/***:bundle-id:***/`;
}


export function replaceBundleIdPlaceholder(jsText: string, bundleId: string) {
  return jsText.replace(getBundleIdPlaceholder(), `${bundleId}`);
}
