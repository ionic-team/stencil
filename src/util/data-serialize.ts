import * as d from '../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../util/constants';


export function formatComponentLoaderRegistry(cmpRegistry: d.ComponentRegistry) {
  // ensure we've got a standard order of the components
  return Object.keys(cmpRegistry).sort().map(tag => {
    const cmpMeta = cmpRegistry[tag];
    cmpMeta.tagNameMeta = tag.toLowerCase().trim();
    return formatComponentLoader(cmpMeta);
  });
}


export function formatComponentLoader(cmpMeta: d.ComponentMeta): d.LoadComponentRegistry {
  const d: any[] = [
    /* 0 */ cmpMeta.tagNameMeta,
    /* 1 */ formatLoaderBundleIds(cmpMeta.bundleIds),
    /* 2 */ formatHasStyles(cmpMeta.stylesMeta),
    /* 3 */ formatMembers(cmpMeta.membersMeta),
    /* 4 */ formatEncapsulation(cmpMeta.encapsulation),
    /* 5 */ formatListeners(cmpMeta.listenersMeta)
  ];

  return <any>trimFalsyData(d);
}


export function formatLoaderBundleIds(bundleIds: string | d.BundleIds): any {
  if (!bundleIds) {
    return `invalid-bundle-id`;
  }

  if (typeof bundleIds === 'string') {
    return bundleIds;
  }

  const modes = Object.keys(bundleIds).sort();
  if (!modes.length) {
    return `invalid-bundle-id`;
  }

  if (modes.length === 1) {
    return bundleIds[modes[0]];
  }

  const bundleIdObj: any = {};

  modes.forEach(modeName => {
    bundleIdObj[modeName] = bundleIds[modeName];
  });

  return bundleIdObj;
}


export function formatHasStyles(stylesMeta: d.StylesMeta) {
  if (stylesMeta && Object.keys(stylesMeta).length > 0) {
    return 1;
  }
  return 0;
}


function formatMembers(membersMeta: d.MembersMeta) {
  if (!membersMeta) {
    return 0;
  }

  const observeAttrs: any[] = [];

  const memberNames = Object.keys(membersMeta).sort();

  memberNames.forEach(memberName => {
    const memberMeta = membersMeta[memberName];

    const d: any[] = [
      memberName, /* 0 - memberName */
      memberMeta.memberType /* 1 - memberType */
    ];

    if (memberMeta.propType === PROP_TYPE.Boolean || memberMeta.propType === PROP_TYPE.Number || memberMeta.propType === PROP_TYPE.String || memberMeta.propType === PROP_TYPE.Any) {
      // observe the attribute

      if (memberMeta.reflectToAttr) {
        d.push(1); /* 2 - reflectToAttr */
      } else {
        d.push(0); /* 2 - reflectToAttr */
      }

      if (memberMeta.attribName !== memberName) {
        // property name and attribute name are different
        // ariaDisabled !== aria-disabled
        d.push(memberMeta.attribName); /* 3 - attribName */

      } else {
        // property name and attribute name are the exact same
        // checked === checked
        d.push(1); /* 3 - attribName */
      }

      d.push(memberMeta.propType); /* 4 - propType */

    } else {
      // do not observe the attribute
      d.push(0); /* 2 - reflectToAttr */
      d.push(0); /* 3 - attribName */
      d.push(PROP_TYPE.Unknown); /* 4 - propType */
    }

    if (memberMeta.ctrlId) {
      d.push(memberMeta.ctrlId); /* 5 - ctrlId */
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


function formatListeners(listeners: d.ListenMeta[]) {
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


export function formatComponentConstructorProperties(membersMeta: d.MembersMeta) {
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

  const properties: d.ComponentConstructorProperties = {};

  memberNames.forEach(memberName => {
    properties[memberName] = formatComponentConstructorProperty(membersMeta[memberName]);
  });

  return properties;
}


function formatComponentConstructorProperty(memberMeta: d.MemberMeta) {
  const property: d.ComponentConstructorProperty = {};

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

    } else {
      property.type = 'Any';
    }

    if (typeof memberMeta.attribName === 'string') {
      property.attr = memberMeta.attribName;

      if (memberMeta.reflectToAttr) {
        property.reflectToAttr = true;
      }
    }

    if (memberMeta.memberType === MEMBER_TYPE.PropMutable) {
      property.mutable = true;
    }
  }

  if (memberMeta.watchCallbacks && memberMeta.watchCallbacks.length > 0) {
    property.watchCallbacks = memberMeta.watchCallbacks.slice();
  }

  return property;
}


export function formatComponentConstructorEvents(eventsMeta: d.EventMeta[]) {
  if (!eventsMeta || !eventsMeta.length) {
    return null;
  }

  return eventsMeta.map(ev => formatComponentConstructorEvent(ev));
}


export function formatComponentConstructorEvent(eventMeta: d.EventMeta): d.ComponentConstructorEvent {
  const constructorEvent = {
    name: eventMeta.eventName,
    method: eventMeta.eventMethodName,
    bubbles: true,
    cancelable: true,
    composed: true
  };

  // default bubbles true
  if (typeof eventMeta.eventBubbles === 'boolean') {
    constructorEvent.bubbles = eventMeta.eventBubbles;
  }

  // default cancelable true
  if (typeof eventMeta.eventCancelable === 'boolean') {
    constructorEvent.cancelable = eventMeta.eventCancelable;
  }

  // default composed true
  if (typeof eventMeta.eventComposed === 'boolean') {
    constructorEvent.composed = eventMeta.eventComposed;
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
  return `/**js-path-placeholder:${tagName}:**/`;
}


export function getStylePlaceholder(tagName: string) {
  return `/**style-placeholder:${tagName}:**/`;
}


export function getStyleIdPlaceholder(tagName: string) {
  return `/**style-id-placeholder:${tagName}:**/`;
}


export function getBundleIdPlaceholder() {
  return `/**:bundle-id:**/`;
}


export function replaceBundleIdPlaceholder(jsText: string, bundleId: string) {
  return jsText.replace(getBundleIdPlaceholder(), bundleId);
}
