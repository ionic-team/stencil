import { Component, ComponentMode, Listeners, ListenOpts, Props, Registry, Watchers, WatchOpts } from './interfaces';


export function formatBundleFileName(bundleId: number) {
  return `ionic.${bundleId}.js`;
}


export function formatBundleContent(bundleId: number, componentModeLoader: string) {
  return `Ionic.loadComponents(\n/** bundleId **/\n${bundleId},${componentModeLoader});`;
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


export function formatComponentModeLoader(component: Component, mode: ComponentMode) {
  const tag = component.tag.trim().toLowerCase();

  const componentClass = component.componentClass;

  const shadow = component.shadow;

  const modeName = (mode.name ? mode.name.trim().toLowerCase() : '');

  const modeCode = `/* ${modeName} **/ ${formatModeName(modeName)}`;

  const styles = (mode.styles ? ('\'' + mode.styles.replace(/'/g, '"') + '\'') : '/* no styles */ 0');

  const componentFn = component.componentImporter.trim();

  let label = tag;
  if (mode.name) {
    label += '.' + mode.name;
  }

  const listeners = formatListeners(label, component.listeners);

  const watchers = formatWatchers(label, component.watchers);

  const t = [
    `/** ${label}: [0] tagName **/\n'${tag}'`,
    `/** ${label}: [1] component class name **/\n'${componentClass}'`,
    `/** ${label}: [2] listeners **/\n${listeners}`,
    `/** ${label}: [3] watchers **/\n${watchers}`,
    `/** ${label}: [4] shadow **/\n${formatBoolean(shadow)}`,
    `/** ${label}: [5] modeName **/\n${modeCode}`,
    `/** ${label}: [6] styles **/\n${styles}`,
    `/** ${label}: [7] importComponent function **/\n${componentFn}`
  ];

  return `\n\n/***************** ${label} *****************/\n[\n` + t.join(',\n\n') + `\n\n]`;
}


export function formatModeName(modeName: string) {
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


function formatListeners(label: string, listeners: Listeners) {
  const methodNames = Object.keys(listeners);
  if (!methodNames.length) {
    return '[]'
  }

  const t: string[] = [];

  methodNames.forEach((methodName, listenerIndex) => {
    t.push(formatListenerOpts(label, methodName, listenerIndex, listeners[methodName]));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatListenerOpts(label: string, methodName: string, listenerIndex: number, listenerOpts: ListenOpts) {
  const t = [
    `    /********* ${label} listener[${listenerIndex}] ${methodName} *********/\n` +
    `    /* [0] methodName **/ '${methodName}'`,
    `    /* [1] eventName ***/ '${listenerOpts.eventName}'`,
    `    /* [2] capture *****/ ${formatBoolean(listenerOpts.capture)}`,
    `    /* [3] passive *****/ ${formatBoolean(listenerOpts.passive)}`,
    `    /* [4] enabled *****/ ${formatBoolean(listenerOpts.enabled)}`,
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatWatchers(label: string, watchers: Watchers) {
  const methodNames = Object.keys(watchers);
  if (!methodNames.length) {
    return '[]'
  }

  const t: string[] = [];

  methodNames.forEach((methodName, watchIndex) => {
    t.push(formatWatcherOpts(label, methodName, watchIndex, watchers[methodName]));
  });

  return `[\n` + t.join(',\n') + `\n]`;
}


function formatWatcherOpts(label: string, methodName: string, watchIndex: number, watchOpts: WatchOpts) {
  const t = [
    `    /********* ${label} watch[${watchIndex}] ${methodName} *********/\n` +
    `    /* [0] methodName **/ '${methodName}'`,
    `    /* [1] fn **********/ '${watchOpts.fn}'`
  ];

  return `  [\n` + t.join(',\n') + `\n  ]`;
}


function formatBoolean(val: boolean) {
  return val ?
    '/* true **/ 1' :
    '/* false */ 0';
}


export function formatRegistryContent(registry: Registry) {
  let content = '(window.Ionic = window.Ionic || {}).components = ';

  let strData = JSON.stringify(registry, null, 2) + ';';

  strData = strData.replace(/"0"/g, '0');
  strData = strData.replace(/"1"/g, '1');
  strData = strData.replace(/"2"/g, '2');
  strData = strData.replace(/"3"/g, '3');

  content += strData;

  return content;
}
