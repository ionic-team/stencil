import { Bundle, Component, ComponentMode, Listener, Props, Registry, Watchers, WatchOpts } from './interfaces';
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


export function formatComponentRegistryProps(props: Props): any {
  const p: any[] = [];

  Object.keys(props).forEach(propName => {
    const prop = props[propName];
    const formattedProp: any[] = [propName];

    if (prop.type === 'boolean') {
      formattedProp.push(0);

    } else if (prop.type === 'number') {
      formattedProp.push(1);
    }

    p.push(formattedProp);
  });

  return p;
}


export function formatComponentModeLoader(cmp: Component, mode: ComponentMode) {
  const tag = cmp.tag;

  const modeName = (mode.name ? mode.name : '');

  const modeCode = formatModeName(modeName);

  const styles = formatStyles(mode.styles);

  let label = tag;
  if (mode.name) {
    label += '.' + mode.name;
  }

  const methods = formatMethods(cmp.methods);

  const listeners = formatListeners(label, cmp.listeners);

  const watchers = formatWatchers(label, cmp.watchers);

  const shadow = formatShadow(cmp.shadow);

  const t = [
    `/** ${label}: [0] tagName **/\n'${tag}'`,
    `/** ${label}: [1] methods **/\n${methods}`,
    `/** ${label}: [2] listeners **/\n${listeners}`,
    `/** ${label}: [3] watchers **/\n${watchers}`,
    `/** ${label}: [4] shadow **/\n${shadow}`,
    `/** ${label}: [5] modeName **/\n${modeCode}`,
    `/** ${label}: [6] styles **/\n${styles}`
  ];

  return `\n/***************** ${label} *****************/\n[\n` + t.join(',\n\n') + `\n\n]`;
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


export function formatModeName(modeName: string) {
  return `${getModeCode(modeName)} /* ${modeName} mode **/`;
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


function formatMethods(methods: string[]) {
  if (!methods || !methods.length) {
    return '0 /* no methods */';
  }

  return `['` + methods.join(`', '`) + `']`;
}


function formatListeners(label: string, listeners: Listener[]) {
  if (!listeners.length) {
    return '0 /* no listeners */';
  }

  const t: string[] = [];

  listeners.forEach((listener, listenerIndex) => {
    t.push(formatListenerOpts(label, listener, listenerIndex));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatListenerOpts(label: string, listener: Listener, listenerIndex: number) {
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


function formatWatchers(label: string, watchers: Watchers) {
  const watcherMethodNames = Object.keys(watchers);
  if (!watcherMethodNames.length) {
    return '0 /* no watchers */';
  }

  const t: string[] = [];

  watcherMethodNames.forEach((methodName, watchIndex) => {
    t.push(formatWatcherOpts(label, methodName, watchIndex, watchers[methodName]));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatWatcherOpts(label: string, methodName: string, watchIndex: number, watchOpts: WatchOpts) {
  const t = [
    `    /*****  ${label} watch[${watchIndex}] ${methodName} ***** /\n` +
    `    /* [0] methodName **/ '${methodName}'`,
    `    /* [1] fn **********/ '${watchOpts.fn}'`
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatShadow(val: boolean) {
  return val ?
    '1 /* use shadow dom */' :
    '0 /* do not use shadow dom */';
}


function formatBoolean(val: boolean) {
  return val ?
    '1 /* true **/' :
    '0 /* false */';
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


export function getBundledModulesId(bundle: Bundle) {
  return bundle.components.map(c => c.component.tag).sort().join('.');
}
