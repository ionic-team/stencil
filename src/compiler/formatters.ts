import { Bundle, ComponentMeta, MethodMeta, ModeMeta, ListenMeta, PropMeta, Registry, StateMeta, WatchMeta } from './interfaces';
import * as crypto from 'crypto';


export function generateBundleId(content: string) {
  return crypto.createHash('sha256')
                  .update(content)
                  .digest('hex')
                  .substr(0, 8);
}


export function formatBundleFileName(bundleId: string) {
  return `ionic.${bundleId}.js`;
}


export function formatBundleContent(coreVersion: number, bundleId: string, bundledJsModules: string, componentModeLoader: string) {
  return [
    `Ionic.loadComponents(\n`,

      `/**** core version ****/`,
      `${coreVersion},\n`,

      `/**** bundleId ****/`,
      `${bundleId},\n`,

      `/**** bundled modules ****/`,
      `${bundledJsModules},\n`,

      `${componentModeLoader}`,

    `)`
  ].join('\n');
}


export function formatComponentModeLoader(cmp: ComponentMeta, mode: ModeMeta, devMode: boolean) {
  const tag = cmp.tag;

  const modeName = (mode.modeName ? mode.modeName : '');

  let label = tag;
  if (mode.modeName) {
    label += '.' + mode.modeName;
  }

  const methods = formatMethods(cmp.methods);

  const states = formatStates(cmp.states);

  const listeners = formatListeners(label, cmp.listeners);

  const watchers = formatWatchers(label, cmp.watchers);

  const shadow = formatShadow(cmp.shadow);

  const host = formatHost(cmp.host, devMode);

  const modeCode = formatModeName(modeName);

  const styles = formatStyles(mode.styles);

  const t = [
    `/** ${label}: [0] tagName **/\n'${tag}'`,
    `/** ${label}: [1] methods **/\n${methods}`,
    `/** ${label}: [2] states **/\n${states}`,
    `/** ${label}: [3] listeners **/\n${listeners}`,
    `/** ${label}: [4] watchers **/\n${watchers}`,
    `/** ${label}: [5] shadow **/\n${shadow}`,
    `/** ${label}: [6] host **/\n${host}`,
    `/** ${label}: [7] modeName **/\n${modeCode}`,
    `/** ${label}: [8] styles **/\n${styles}`
  ];

  return `\n/***************** ${label} *****************/\n[\n` + t.join(',\n\n') + `\n\n]`;
}


export function formatModeName(modeName: string) {
  return `${getModeCode(modeName)} /* ${modeName} mode **/`;
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
    `    /***** ${label} listener[${listenerIndex}]  ${listener.eventName} -> ${listener.methodName}() *****/\n` +
    `    /* [0] methodName **/ '${listener.methodName}'`,
    `    /* [1] eventName ***/ '${listener.eventName}'`,
    `    /* [2] capture *****/ ${formatBoolean(listener.capture)}`,
    `    /* [3] passive *****/ ${formatBoolean(listener.passive)}`,
    `    /* [4] enabled *****/ ${formatBoolean(listener.enabled)}`,
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatBoolean(val: boolean) {
  return val ?
    '1 /* true **/' :
    '0 /* false */';
}


function formatWatchers(label: string, watchers: WatchMeta[]) {
  if (!watchers || !watchers.length) {
    return '0 /* no watchers */';
  }

  const t: string[] = [];

  watchers.forEach((watcher, watchIndex) => {
    t.push(formatWatcherOpts(label, watcher, watchIndex));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatWatcherOpts(label: string, watcher: WatchMeta, watchIndex: number) {
  const t = [
    `    /*****  ${label} watch[${watchIndex}] ${watcher.propName} ***** /\n` +
    `    /* [0] watch prop **/ '${watcher.propName}'`,
    `    /* [1] call fn *****/ '${watcher.fn}'`
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatShadow(val: boolean) {
  return val ?
    '1 /* use shadow dom */' :
    '0 /* do not use shadow dom */';
}

function formatHost(val: any, devMode: boolean) {
  return JSON.stringify(val, null, devMode ? 2 : null);
}

export function getModeCode(modeName: string) {
  switch (modeName) {
    case 'default':
      return 0;
    case 'ios':
      return 1;
    case 'md':
      return 2;
    case 'wp':
      return 3;
  }

  return `'${modeName}'`;
}


export function formatStyles(styles: string) {
  if (!styles) {
    return '0 /* no styles */';
  }

  const lines = styles.split(/\r?\n/g).map(line => {
    return `'${line.replace(/'/g, '"')}\\n'`;
  });

  return lines.join(' + \n');
}


export function formatPriority(priority: 'high'|'low') {
  return priority === 'low' ? '0' : '1';
}


export function formatRegistryContent(inputRegistry: Registry, devMode: boolean) {
  const registry: Registry = {};

  // alphabetize the registry
  Object.keys(inputRegistry).sort().forEach(tag => {
    registry[tag] = inputRegistry[tag];
  });

  let strData: string;

  if (devMode) {
    // pretty print
    strData = JSON.stringify(registry, null, 2);

  } else {
    // remove all whitespace
    strData = JSON.stringify(registry);
  }

  // remove unnecessary double quotes
  strData = strData.replace(/"0"/g, '0');
  strData = strData.replace(/"1"/g, '1');
  strData = strData.replace(/"2"/g, '2');
  strData = strData.replace(/"3"/g, '3');

  return strData;
}


export function formatComponentRegistryProps(props: PropMeta[]): any {
  if (!props || !props.length) {
    return null;
  }

  const p: any[] = [];

  props.forEach(prop => {
    const formattedProp: any[] = [prop.propName];

    if (prop.propType === 'boolean') {
      formattedProp.push(0);

    } else if (prop.propType === 'number') {
      formattedProp.push(1);
    }

    p.push(formattedProp);
  });

  return p;
}


export function getBundledModulesId(bundle: Bundle) {
  return bundle.components.map(c => c.component.tag).sort().join('.');
}
