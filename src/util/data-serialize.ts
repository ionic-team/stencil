import { ComponentMeta, ComponentRegistry, MethodMeta, ListenMeta, LoadComponentRegistry,
  Bundle, PropChangeMeta, PropMeta, StateMeta, StyleMeta } from './interfaces';
import { ATTR_LOWER_CASE, ATTR_DASH_CASE, TYPE_ANY, TYPE_BOOLEAN, HAS_SLOTS, HAS_NAMED_SLOTS, TYPE_NUMBER } from '../util/constants';


export function formatLoadComponentRegistry(cmpMeta: ComponentMeta, defaultAttrCase: number): LoadComponentRegistry {
  // ensure we've got a standard order of the components
  const d: any[] = [
    cmpMeta.tagNameMeta.toUpperCase(),
    cmpMeta.moduleId,
    formatStyles(cmpMeta.styleMeta),
    formatSlot(cmpMeta.slotMeta),
    formatProps(cmpMeta.propsMeta, defaultAttrCase),
    cmpMeta.loadPriority
  ];

  return <any>trimFalsyData(d);
}


export function formatStyles(styleMeta: StyleMeta): any {
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
    components: ComponentMeta[]
  ) {

  // ensure we've got a standard order of the components
  components = components.sort((a, b) => {
    if (a.tagNameMeta < b.tagNameMeta) return -1;
    if (a.tagNameMeta > b.tagNameMeta) return 1;
    return 0;
  });

  const componentMetaStr = components.map(cmpMeta => {
    return formatComponentMeta(cmpMeta);
  }).join(',\n');

  return [
    `${namespace}.defineComponents(\n`,

      `/**** module id ****/`,
      `'${moduleId}',\n`,

      `/**** component modules ****/`,
      `${moduleBundleOutput},\n`,

      `${componentMetaStr}`,

    `)`
  ].join('\n');
}


export function formatComponentMeta(cmpMeta: ComponentMeta) {
  const tag = cmpMeta.tagNameMeta.toLowerCase();
  const methods = formatMethods(cmpMeta.methodsMeta);
  const states = formatStates(cmpMeta.statesMeta);
  const listeners = formatListeners(tag, cmpMeta.listenersMeta);
  const propWillChanges = formatPropChanges(tag, 'prop will change', cmpMeta.propWillChangeMeta);
  const propDidChanges = formatPropChanges(tag, 'prop did change', cmpMeta.propDidChangeMeta);
  const host = formatHost(cmpMeta.hostMeta);
  const shadow = formatShadow(cmpMeta.isShadowMeta);

  const d: string[] = [];

  d.push(`/** ${tag}: [0] tag **/\n'${tag.toUpperCase()}'`);
  d.push(`/** ${tag}: [1] host **/\n${host}`);
  d.push(`/** ${tag}: [2] listeners **/\n${listeners}`);
  d.push(`/** ${tag}: [3] states **/\n${states}`);
  d.push(`/** ${tag}: [4] propWillChanges **/\n${propWillChanges}`);
  d.push(`/** ${tag}: [5] propDidChanges **/\n${propDidChanges}`);
  d.push(`/** ${tag}: [6] methods **/\n${methods}`);
  d.push(`/** ${tag}: [7] shadow **/\n${shadow}`);

  return `\n/***************** ${tag} *****************/\n[\n` + trimFalsyDataStr(d).join(',\n\n') + `\n\n]`;
}


export function formatJsBundleFileName(jsBundleId: string) {
  return `${jsBundleId}.js`;
}


export function formatCssBundleFileName(cssBundleId: string) {
  return `${cssBundleId}.css`;
}


function formatMethods(methods: MethodMeta[]) {
  if (!methods || !methods.length) {
    return '0 /* no methods */';
  }

  return `['` + methods.join(`', '`) + `']`;
}


function formatStates(states: StateMeta[]) {
  if (!states || !states.length) {
    return '0 /* no states */';
  }

  return `['` + states.join(`', '`) + `']`;
}


function formatListeners(label: string, listeners: ListenMeta[]) {
  if (!listeners || !listeners.length) {
    return '0 /* no listeners */';
  }

  const t: string[] = [];

  listeners.forEach((listener, listenerIndex) => {
    t.push(formatListenerOpts(label, listener, listenerIndex));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatListenerOpts(label: string, listener: ListenMeta, listenerIndex: number) {
  const t = [
    `    /***** ${label} listener[${listenerIndex}]  ${listener.eventName} -> ${listener.eventName}() *****/\n` +
    `    /* [0] eventMethod ***/ '${listener.eventMethodName}'`,
    `    /* [1] eventName *****/ '${listener.eventName}'`,
    `    /* [2] eventCapture **/ ${formatBoolean(listener.eventCapture)}`,
    `    /* [3] eventPassive **/ ${formatBoolean(listener.eventPassive)}`,
    `    /* [4] eventEnabled **/ ${formatBoolean(listener.eventEnabled)}`,
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
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


function formatHost(val: any) {
  if (val === undefined) {
    return '0 /* no host data */';
  }
  return JSON.stringify(val);
}


function formatShadow(val: boolean) {
  return val ?
    '1 /* use shadow dom */' :
    '0 /* do not use shadow dom */';
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
