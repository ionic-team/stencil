import { Bundle, ComponentMeta, ComponentRegistry, EventMeta, ListenMeta, LoadComponentRegistry,
  MethodMeta, ModuleFile, PropChangeMeta, PropMeta, StateMeta, StylesMeta } from './interfaces';
import { ATTR_LOWER_CASE, ATTR_DASH_CASE, TYPE_ANY, TYPE_BOOLEAN, HAS_SLOTS, HAS_NAMED_SLOTS, TYPE_NUMBER } from '../util/constants';


export function formatLoadComponentRegistry(cmpMeta: ComponentMeta, defaultAttrCase: number): LoadComponentRegistry {
  // ensure we've got a standard order of the components
  const d: any[] = [
    cmpMeta.tagNameMeta.toUpperCase(),
    cmpMeta.moduleId,
    formatStyles(cmpMeta.stylesMeta),
    formatSlot(cmpMeta.slotMeta),
    formatProps(cmpMeta.propsMeta, defaultAttrCase),
    formatListeners(cmpMeta.listenersMeta),
    cmpMeta.loadPriority
  ];

  return <any>trimFalsyData(d);
}


export function formatStyles(styleMeta: StylesMeta): any {
  if (!styleMeta) {
    return 0;
  }

  const stylesIds: any = {};

  Object.keys(styleMeta).sort().forEach(modeName => {
    stylesIds[modeName] = styleMeta[modeName].styleId;
  });

  return stylesIds;
}


function formatSlot(val: number) {
  if (val === HAS_SLOTS) {
    return HAS_SLOTS;
  }
  if (val === HAS_NAMED_SLOTS) {
    return HAS_NAMED_SLOTS;
  }
  return 0;
}


function formatProps(props: PropMeta[], defaultAttrCase: number) {
  if (!props || !props.length) {
    return 0;
  }

  return props.map(prop => {
    const d: any[] = [
      prop.propName,
    ];

    if (prop.attribCase === undefined) {
      // if individual prop wasn't set with an option
      // then use the config's default
      prop.attribCase = defaultAttrCase;
    }

    if (prop.attribCase === ATTR_LOWER_CASE) {
      d.push(prop.attribCase);

    } else {
      d.push(ATTR_DASH_CASE);
    }

    if (prop.propType === TYPE_BOOLEAN) {
      d.push(TYPE_BOOLEAN);

    } else if (prop.propType === TYPE_NUMBER) {
      d.push(TYPE_NUMBER);

    } else {
      d.push(TYPE_ANY);
    }

    if (prop.isStateful) {
      d.push(1);
    } else {
      d.push(0);
    }

    return trimFalsyData(d);
  });
}


function formatListeners(listeners: ListenMeta[]) {
  if (!listeners || !listeners.length) {
    return 0;
  }

  return listeners.map(listener => {
    const d: any[] = [
      listener.eventName,
      listener.eventMethodName,
      listener.eventDisabled,
      listener.eventPassive,
      listener.eventCapture
    ];
    return trimFalsyData(d);
  });
}


export function formatComponentRegistry(registry: ComponentRegistry, defaultAttrCase: number) {
  // ensure we've got a standard order of the components
  return Object.keys(registry).sort().map(tag => {
    if (registry[tag]) {
      return formatLoadComponentRegistry(registry[tag], defaultAttrCase);
    }
    return null;
  }).filter(c => c);
}


export function formatDefineComponents(
    namespace: string,
    moduleId: string,
    moduleBundleOutput: string,
    moduleFiles: ModuleFile[]
  ) {

  // ensure we've got a standard order of the components
  moduleFiles = moduleFiles.sort((a, b) => {
    if (a.cmpMeta.tagNameMeta < b.cmpMeta.tagNameMeta) return -1;
    if (a.cmpMeta.tagNameMeta > b.cmpMeta.tagNameMeta) return 1;
    return 0;
  });

  const componentMetaStr = moduleFiles.map(moduleFile => {
    return formatComponentMeta(moduleFile.cmpMeta);
  }).join(',\n');

  return [
    `${namespace}.defineComponents(\n`,

      `/**** module id (dev mode) ****/`,
      `'${moduleId}',\n`,

      `/**** component modules ****/`,
      `${moduleBundleOutput},\n`,

      `${componentMetaStr}`,

    `)`
  ].join('\n');
}


export function formatComponentMeta(cmpMeta: ComponentMeta) {
  const tag = cmpMeta.tagNameMeta.toLowerCase();
  const host = formatHost(cmpMeta.hostMeta);
  const states = formatStates(cmpMeta.statesMeta);
  const propWillChanges = formatPropChanges(tag, 'prop will change', cmpMeta.propsWillChangeMeta);
  const propDidChanges = formatPropChanges(tag, 'prop did change', cmpMeta.propsDidChangeMeta);
  const events = formatEvents(tag, cmpMeta.eventsMeta);
  const methods = formatMethods(cmpMeta.methodsMeta);
  const hostElementMember = formatHostElementMember(cmpMeta.hostElementMember);
  const shadow = formatShadow(cmpMeta.isShadowMeta);

  const d: string[] = [];

  d.push(`/** ${tag}: [0] tag **/\n'${tag.toUpperCase()}'`);
  d.push(`/** ${tag}: [1] host **/\n${host}`);
  d.push(`/** ${tag}: [2] states **/\n${states}`);
  d.push(`/** ${tag}: [3] propWillChanges **/\n${propWillChanges}`);
  d.push(`/** ${tag}: [4] propDidChanges **/\n${propDidChanges}`);
  d.push(`/** ${tag}: [5] events **/\n${events}`);
  d.push(`/** ${tag}: [6] methods **/\n${methods}`);
  d.push(`/** ${tag}: [7] hostElementMember **/\n${hostElementMember}`);
  d.push(`/** ${tag}: [8] shadow **/\n${shadow}`);

  return `\n/***************** ${tag} *****************/\n[\n` + trimFalsyDataStr(d).join(',\n\n') + `\n\n]`;
}


function formatHost(val: any) {
  if (val === undefined) {
    return '0 /* no host data */';
  }
  return JSON.stringify(val);
}


function formatStates(states: StateMeta[]) {
  if (!states || !states.length) {
    return '0 /* no states */';
  }

  return `['` + states.join(`', '`) + `']`;
}


function formatBoolean(val: boolean) {
  return val ?
    '1 /* true **/' :
    '0 /* false */';
}


function formatPropChanges(label: string, propChangeType: string, propChange: PropChangeMeta[]) {
  if (!propChange || !propChange.length) {
    return `0 /* no ${propChangeType} methods */`;
  }

  const t: string[] = [];

  propChange.forEach((propChange, index) => {
    t.push(formatPropChangeOpts(label, propChangeType, propChange, index));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatPropChangeOpts(label: string, propChangeType: string, propChange: PropChangeMeta, index: number) {
  const t = [
    `    /*****  ${label} ${propChangeType} [${index}] ***** /\n` +
    `    /* [0] prop name **/ '${propChange[0]}'`,
    `    /* [1] call fn *****/ '${propChange[1]}'`
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatEvents(label: string, events: EventMeta[]) {
  if (!events || !events.length) {
    return '0 /* no events */';
  }

  const t: string[] = [];

  events.forEach(eventMeta => {
    t.push(formatEventOpts(label, eventMeta));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatEventOpts(label: string, eventMeta: EventMeta) {
  const t = [
    `    /*****  ${label} ${eventMeta.eventName} ***** /\n` +
    `    /* [0] event name ***/ '${eventMeta.eventName}'`,
    `    /* [1] method name **/ '${eventMeta.eventMethodName}'`,
    `    /* [2] bubbles ******/ '${formatBoolean(eventMeta.eventBubbles)}'`,
    `    /* [3] cancelable ***/ '${formatBoolean(eventMeta.eventCancelable)}'`,
    `    /* [4] composed *****/ '${formatBoolean(eventMeta.eventComposed)}'`
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatMethods(methods: MethodMeta[]) {
  if (!methods || !methods.length) {
    return '0 /* no methods */';
  }

  return `['` + methods.join(`', '`) + `']`;
}


function formatHostElementMember(val: any) {
  if (typeof val !== 'string') {
    return `0 /* no host element member name */`;
  }

  return `'${val.trim()}'`;
}


function formatShadow(val: boolean) {
  return val ?
    '1 /* use shadow dom */' :
    '0 /* do not use shadow dom */';
}


export function formatJsBundleFileName(jsBundleId: string) {
  return `${jsBundleId}.js`;
}


export function formatCssBundleFileName(cssBundleId: string) {
  return `${cssBundleId}.css`;
}


export function getBundledModulesId(bundle: Bundle) {
  return bundle.components.map(c => c.toLowerCase()).sort().join('.');
}


export function generateBundleId(tags: string[]) {
  return tags.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
  }).join('.');
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


function trimFalsyDataStr(d: string[]) {
  const arrData: any[] = new Function(`return [${d.join(',').replace(/\n/gm, '')}]`)();

  for (var i = arrData.length - 1; i >= 0; i--) {
    if (arrData[i]) {
      break;
    }
    // if falsy, safe to pop()
    d.pop();
  }

  return d;
}
