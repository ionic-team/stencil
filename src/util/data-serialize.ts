import * as d from '../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../util/constants';
import { dashToPascalCase } from './helpers';


export function formatBrowserLoaderComponentRegistry(cmpRegistry: d.ComponentRegistry) {
  // ensure we've got a standard order of the components
  return Object.keys(cmpRegistry).sort().map(tag => {
    const cmpMeta = cmpRegistry[tag];
    cmpMeta.tagNameMeta = tag.toLowerCase().trim();
    return formatBrowserLoaderComponent(cmpMeta);
  });
}


export function formatBrowserLoaderComponent(cmpMeta: d.ComponentMeta): d.ComponentHostData {
  const d: any[] = [
    /* 0 */ cmpMeta.tagNameMeta,
    /* 1 */ formatBrowserLoaderBundleIds(cmpMeta.bundleIds as d.BundleIds),
    /* 2 */ formatHasStyles(cmpMeta.stylesMeta),
    /* 3 */ formatMembers(cmpMeta.membersMeta),
    /* 4 */ formatEncapsulation(cmpMeta.encapsulation),
    /* 5 */ formatListeners(cmpMeta.listenersMeta)
  ];

  return <any>trimFalsyData(d);
}


export async function formatEsmLoaderComponent(config: d.Config, cmpMeta: d.ComponentMeta) {
  const d: any[] = [
    /* 0 */ cmpMeta.tagNameMeta,
    /* 1 */ '__GET_MODULE_FN__',
    /* 2 */ formatHasStyles(cmpMeta.stylesMeta),
    /* 3 */ formatMembers(cmpMeta.membersMeta),
    /* 4 */ formatEncapsulation(cmpMeta.encapsulation),
    /* 5 */ formatListeners(cmpMeta.listenersMeta)
  ];

  trimFalsyData(d);

  const str = JSON.stringify(d);

  const importFn = await formatEsmLoaderImportFns(config, cmpMeta);

  return str.replace(`"__GET_MODULE_FN__"`, importFn);
}


export function formatBrowserLoaderBundleIds(bundleIds: string | d.BundleIds): any {
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


export async function formatEsmLoaderImportFns(config: d.Config, cmpMeta: d.ComponentMeta): Promise<string> {
  const modes = Object.keys(cmpMeta.bundleIds).sort((a, b) => {
    if (a === '$' || a === 'md') return 1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  const moduleImports = modes.map(styleMode => {
    return getModuleImport(cmpMeta, styleMode);
  }).join('');

  let importFn = `(function(){${moduleImports}})()`;

  const minifyResults = await config.sys.minifyJs(importFn);

  importFn = minifyResults.output;
  if (importFn.endsWith(';')) {
    importFn = importFn.substring(0, importFn.length - 1);
  }

  return `function(${importFn.includes('o.') ? 'o' : ''}){return(${importFn}).then(function(m){return m.${dashToPascalCase(cmpMeta.tagNameMeta)}})}`;
}


function getModuleFileName(cmpMeta: d.ComponentMeta, styleMode: string) {
  return (typeof cmpMeta.bundleIds !== 'string') ? (cmpMeta.bundleIds as d.BundleIds)[styleMode] : cmpMeta.bundleIds;
}


function getModuleImport(cmpMeta: d.ComponentMeta, styleMode: string) {
  const bundleFileName = getModuleFileName(cmpMeta, styleMode);
  const isScoped = cmpMeta.encapsulation === ENCAPSULATION.ScopedCss;

  if (styleMode === '$' || styleMode === 'md') {

    if (isScoped) {
      return `
        if (o.scoped) {
          return import('./${bundleFileName}.sc.js');
        }
        return import('./${bundleFileName}.js');
      `;
    }

    return `return import('./${bundleFileName}.js');`;
  }

  if (isScoped) {
    return `
      if (o.mode == '${styleMode}') {
        if (o.scoped) {
          return import('./${bundleFileName}.sc.js');
        }
        return import('./${bundleFileName}.js');
      }`;
  }

  return `
    if (o.mode == '${styleMode}') {
      return import('./${bundleFileName}.js');
    }`;
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

      if (memberMeta.reflectToAttrib) {
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


export function formatConstructorEncapsulation(encapsulation: ENCAPSULATION) {
  if (encapsulation) {
    if (encapsulation === ENCAPSULATION.ShadowDom) {
      return 'shadow';

    } else if (encapsulation === ENCAPSULATION.ScopedCss) {
      return 'scoped';
    }
  }
  return null;
}


export function formatComponentConstructorProperties(membersMeta: d.MembersMeta, stringify?: boolean, excludeInternal?: boolean) {
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
    const prop = formatComponentConstructorProperty(membersMeta[memberName], stringify, excludeInternal) as any;
    if (prop !== null) {
      properties[memberName] = prop;
    }
  });

  if (!Object.keys(properties).length) {
    return null;
  }

  if (stringify) {
    let str = JSON.stringify(properties);
    str = str.replace(`"TYPE_String"`, `String`);
    str = str.replace(`"TYPE_Boolean"`, `Boolean`);
    str = str.replace(`"TYPE_Number"`, `Number`);
    return str;
  }

  return properties;
}


function formatComponentConstructorProperty(memberMeta: d.MemberMeta, stringify?: boolean, excludeInternal?: boolean) {
  const property: d.ComponentConstructorProperty = {};

  if (memberMeta.memberType === MEMBER_TYPE.State) {
    if (excludeInternal) return null;
    property.state = true;

  } else if (memberMeta.memberType === MEMBER_TYPE.Element) {
    if (excludeInternal) return null;
    property.elementRef = true;

  } else if (memberMeta.memberType === MEMBER_TYPE.Method) {
    property.method = true;

  } else if (memberMeta.memberType === MEMBER_TYPE.PropConnect) {
    if (excludeInternal) return null;
    property.connect = memberMeta.ctrlId;

  } else if (memberMeta.memberType === MEMBER_TYPE.PropContext) {
    if (excludeInternal) return null;
    property.context = memberMeta.ctrlId;

  } else {
    if (memberMeta.propType === PROP_TYPE.String) {
      if (stringify) {
        property.type = 'TYPE_String' as any;
      } else {
        property.type = String;
      }

    } else if (memberMeta.propType === PROP_TYPE.Boolean) {
      if (stringify) {
        property.type = 'TYPE_Boolean' as any;
      } else {
        property.type = Boolean;
      }

    } else if (memberMeta.propType === PROP_TYPE.Number) {
      if (stringify) {
        property.type = 'TYPE_Number' as any;
      } else {
        property.type = Number;
      }

    } else {
      property.type = 'Any';
    }

    if (typeof memberMeta.attribName === 'string') {
      property.attr = memberMeta.attribName;

      if (memberMeta.reflectToAttrib) {
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


export function formatComponentConstructorEvent(eventMeta: d.EventMeta) {
  const constructorEvent: d.ComponentConstructorEvent = {
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


export function formatComponentConstructorListeners(listenersMeta: d.ListenMeta[], stringify?: boolean) {
  if (!listenersMeta || !listenersMeta.length) {
    return null;
  }

  const listeners = listenersMeta.map(ev => formatComponentConstructorListener(ev));

  if (stringify) {
    return JSON.stringify(listeners);
  }

  return listeners;
}


export function formatComponentConstructorListener(listenMeta: d.ListenMeta) {
  const constructorListener: d.ComponentConstructorListener = {
    name: listenMeta.eventName,
    method: listenMeta.eventMethodName
  };

  // default capture falsy
  if (listenMeta.eventCapture === true) {
    constructorListener.capture = true;
  }

  // default disabled falsy
  if (listenMeta.eventDisabled === true) {
    constructorListener.disabled = true;
  }

  // default passive falsy
  if (listenMeta.eventPassive === true) {
    constructorListener.passive = true;
  }

  return constructorListener;
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
