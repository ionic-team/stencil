import { Bundle, ComponentMeta, FormatComponentDataOptions, MethodMeta, ModeMeta,
  ModesMeta, ListenMeta, PropMeta, StateMeta, PropChangeMeta } from './interfaces';
import { ATTR_LOWER_CASE, ATTR_DASH_CASE, BUNDLE_ID, STYLES, TYPE_ANY, TYPE_BOOLEAN, HAS_SLOTS, HAS_NAMED_SLOTS, TYPE_NUMBER } from '../util/constants';
import * as crypto from 'crypto';


export function formatRegistry(components: ComponentMeta[], opts: FormatComponentDataOptions) {
  const componentMeta = components.map(cmpMeta => {
    return formatComponentMeta(cmpMeta, opts);
  }).join(',\n');

  return '[\n' + componentMeta + '\n]';
}


export function formatDefineComponents(
    namespace: string,
    coreVersion: number,
    bundleId: string,
    opts: FormatComponentDataOptions,
    bundledJsModules: string,
    components: ComponentMeta[]
  ) {

  const componentMeta = components.map(cmpMeta => {
    return formatComponentMeta(cmpMeta, opts);
  }).join(',\n');

  return [
    `${namespace}.defineComponents(\n`,

      `/**** core version ****/`,
      `${coreVersion},\n`,

      `/**** bundleId ****/`,
      `'${bundleId}',\n`,

      `/**** bundled modules ****/`,
      `${bundledJsModules},\n`,

      `${componentMeta}`,

    `)`
  ].join('\n');
}


export function formatComponentMeta(cmpMeta: ComponentMeta, opts: FormatComponentDataOptions) {
  const tag = cmpMeta.tagNameMeta;
  const modes = formatModes(cmpMeta.modesMeta, opts);
  const props = formatProps(cmpMeta.propsMeta, opts.defaultAttrCase);
  const methods = formatMethods(cmpMeta.methodsMeta);
  const states = formatStates(cmpMeta.statesMeta);
  const listeners = formatListeners(tag, cmpMeta.listenersMeta);
  const propWillChanges = formatPropChanges(tag, 'prop will change', cmpMeta.propWillChangeMeta);
  const propDidChanges = formatPropChanges(tag, 'prop did change', cmpMeta.propDidChangeMeta);
  const host = formatHost(cmpMeta.hostMeta);
  const slot = formatSlot(cmpMeta.slotMeta);
  const shadow = formatShadow(cmpMeta.isShadowMeta);


  const d: string[] = [];

  d.push(`/** ${tag}: [0] tagName **/\n'${tag}'`);
  d.push(`/** ${tag}: [1] modes **/\n${modes}`);
  d.push(`/** ${tag}: [2] props **/\n${props}`);
  d.push(`/** ${tag}: [3] slot **/\n${slot}`);

  if (!opts.minimumData) {
    d.push(`/** ${tag}: [4] host **/\n${host}`);
    d.push(`/** ${tag}: [5] listeners **/\n${listeners}`);
    d.push(`/** ${tag}: [6] states **/\n${states}`);
    d.push(`/** ${tag}: [7] propWillChanges **/\n${propWillChanges}`);
    d.push(`/** ${tag}: [8] propDidChanges **/\n${propDidChanges}`);
    d.push(`/** ${tag}: [9] methods **/\n${methods}`);
    d.push(`/** ${tag}: [10] shadow **/\n${shadow}`);
  }

  const arrData: any[] = new Function(`return [${d.join(',').replace(/\n/gm, '')}]`)();
  for (var i = arrData.length - 1; i >= 0; i--) {
    if (arrData[i]) {
      break;
    }
    // if falsy, safe to pop()
    d.pop();
  }

  return `\n/***************** ${tag} *****************/\n[\n` + d.join(',\n\n') + `\n\n]`;
}


export function formatModes(modesMeta: ModesMeta, opts: FormatComponentDataOptions) {
  if (!modesMeta) {
    return '{} /* no modes */';
  }

  let modeNames = Object.keys(modesMeta).sort();

  if (opts.onlyIncludeModeName) {
    modeNames = modeNames.filter(modeName => modeName === opts.onlyIncludeModeName);
  }

  const o = modeNames.map(modeName => {
    return `\n  ${modeName}: ${formatMode(modesMeta[modeName], opts.includeStyles)}`;
  });

  return `{${o.join(`,\n`)}\n}`;
}


export function formatMode(modeMeta: ModeMeta, includeStyles: boolean) {
  if (!modeMeta) {
    return '[] /* no mode data */';
  }

  let bundleId = modeMeta[BUNDLE_ID] ? `'${modeMeta[BUNDLE_ID]}'` : `0`;

  if (includeStyles && modeMeta[STYLES]) {
    const styles = modeMeta[STYLES].split(/\r?\n/g).map(line => {
      return `     '${line.replace(/'/g, '"')}\\n'`;
    }).join(' + \n');
    return `[${bundleId}, \n${styles}]`;
  }

  return `[${bundleId}]`;
}


export function formatBundleFileName(bundleId: string) {
  return `ionic.${bundleId}.js`;
}


function formatProps(props: PropMeta[], defaultAttrCase: number) {
  if (!props || !props.length) {
    return `0 /* no props */`;
  }

  const formattedProps: string[] = [];

  props.forEach(prop => {
    let formattedProp = `'${prop.propName}'`;

    if (prop.attribCase === undefined) {
      // if individual prop wasn't set with an option
      // then use the config's default
      prop.attribCase = defaultAttrCase;
    }

    if (prop.attribCase === ATTR_LOWER_CASE) {
      formattedProp += `, ${prop.attribCase} /* lowercase attribute */`;

    } else {
      formattedProp += `, ${ATTR_DASH_CASE} /* dash-case attribute */`;
    }

    if (prop.propType === TYPE_BOOLEAN) {
      formattedProp += `, ${TYPE_BOOLEAN} /* boolean type */`;

    } else if (prop.propType === TYPE_NUMBER) {
      formattedProp += `, ${TYPE_NUMBER} /* number type */`;

    } else if (prop.isStateful) {
      // if no propType data, but there is isStateful data
      // then we still need a value in this index
      formattedProp += `, ${TYPE_ANY} /* any type */`;
    }

    if (prop.isStateful) {
      formattedProp += `, 1 /* is stateful prop */`;
    }

    formattedProps.push(`  [${formattedProp}]`);
  });

  return `[\n` + formattedProps.join(`,\n`) + `\n]`;
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
    `    /* [0] eventMethod ***/ '${listener.eventMethod}'`,
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


function formatSlot(val: number) {
  if (val === HAS_SLOTS) {
    return HAS_SLOTS + ' /* has slots */';
  }
  if (val === HAS_NAMED_SLOTS) {
    return HAS_NAMED_SLOTS + ' /* has named slots */';
  }
  return '0 /* no slot */';
}


function formatShadow(val: boolean) {
  return val ?
    '1 /* use shadow dom */' :
    '0 /* do not use shadow dom */';
}


export function getBundledModulesId(bundle: Bundle) {
  return bundle.components.map(c => c.tagNameMeta).sort().join('.');
}


export function generateBundleId(content: string) {
  return crypto.createHash('sha256')
                  .update(content)
                  .digest('hex')
                  .substr(0, 8);
}
