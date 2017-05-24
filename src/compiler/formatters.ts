import { Bundle, ComponentMeta, ManifestComponentMeta, MethodMeta, ModeMeta,
  ListenMeta, PropMeta, StateMeta, WatchMeta } from './interfaces';
import { ATTR_CAMEL_CASE, ATTR_DASH_CASE, TYPE_BOOLEAN, PRIORITY_LOW, PRIORITY_HIGH, TYPE_NUMBER } from '../util/constants';
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
    `Ionic.defineComponents(\n`,

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


export function formatComponentModeLoader(attrCase: number, cmp: ComponentMeta, modeName: string, modeMeta: ModeMeta) {
  const tag = cmp.tag;

  const label = `${tag}.${modeName}`;

  const props = formatProps(cmp.props, attrCase);

  const methods = formatMethods(cmp.methods);

  const states = formatStates(cmp.states);

  const listeners = formatListeners(label, cmp.listeners);

  const watchers = formatWatchers(label, cmp.watchers);

  const shadow = formatShadow(cmp.shadow);

  const modeCode = formatModeName(modeName);

  const styles = formatStyles(modeMeta.styles);

  const t = [
    `/** ${label}: [0] tagName **/\n'${tag}'`,
    `/** ${label}: [1] props **/\n${props}`,
    `/** ${label}: [2] methods **/\n${methods}`,
    `/** ${label}: [3] states **/\n${states}`,
    `/** ${label}: [4] listeners **/\n${listeners}`,
    `/** ${label}: [5] watchers **/\n${watchers}`,
    `/** ${label}: [6] shadow **/\n${shadow}`,
    `/** ${label}: [7] modeName **/\n${modeCode}`,
    `/** ${label}: [8] styles **/\n${styles}`
  ];

  return `\n/***************** ${label} *****************/\n[\n` + t.join(',\n\n') + `\n\n]`;
}


function formatProps(props: PropMeta[], attrCase: number, prefix = '') {
  if (!props || !props.length) {
    return prefix + `0 /* no props */`;
  }

  const formattedProps: string[] = [];

  props.forEach(prop => {
    let formattedProp = `'${prop.propName}'`;

    if (prop.attrCase === undefined) {
      // if individual prop wasn't set with an option
      // then use the config's default
      prop.attrCase = attrCase;
    }

    //
    if (prop.attrCase === ATTR_CAMEL_CASE) {
      formattedProp += `, ${prop.attrCase} /* camelCase attribute */`;

    } else {
      formattedProp += `, ${ATTR_DASH_CASE} /* dash-case attribute */`;
    }

    if (prop.propType === 'boolean') {
      formattedProp += `, ${TYPE_BOOLEAN} /* boolean props */`;

    } else if (prop.propType === 'number') {
      formattedProp += `, ${TYPE_NUMBER} /* number props */`;
    }

    formattedProps.push(prefix + `  [${formattedProp}]`);
  });

  return prefix + `[\n` + formattedProps.join(`,\n`) + '\n' + prefix + `]`;
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


export function formatModeName(modeName: string) {
  return `${getModeCode(modeName)} /* ${modeName} **/`;
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
  return priority === 'low' ? PRIORITY_LOW : PRIORITY_HIGH;
}


export function formatRegistry(bundles: Bundle[], attrOption: number) {
  let registry: {
    component: ManifestComponentMeta;
    bundles: {[modeCode: string]: Bundle};
  }[] = [];

  bundles.forEach(bundle => {
    bundle.components.forEach(bundledComponent => {
      let registryCmp = registry.find(c => c.component.tag === bundledComponent.component.tag);
      if (!registryCmp) {
        registryCmp = {
          component: bundledComponent.component,
          bundles: {}
        };
        registry.push(registryCmp);
      }
      registryCmp.bundles[bundledComponent.modeName] = bundle;
    });
  });

  registry = registry.sort((a, b) => {
    if (a.component.tag < b.component.tag) return -1;
    if (a.component.tag > b.component.tag) return 1;
    return 0;
  });

  const cmps: string[] = [];

  registry.forEach(registryCmp => {
    const tag = registryCmp.component.tag;
    let cmp: string[] = [];

    cmp.push([
      `    /** tag [0] **/`,
      `    '${tag}'`
    ].join('\n'));

    let modes = [
      `    /** ${tag}: modes [1] **/`,
      `    {`
    ];
    modes.push(Object.keys(registryCmp.bundles).map(modeName => {
      return `      ${formatModeName(modeName)}: '${registryCmp.bundles[modeName].id}'`;
    }).join(',\n'));
    modes.push(`    }`);
    cmp.push(modes.join('\n'));

    const props = registryCmp.component.props;

    if ((props && props.length) || registryCmp.component.priority === PRIORITY_LOW) {

      if (props && props.length) {
        cmp.push([
          `    /** ${tag}: props [2] **/`,
          `${formatProps(registryCmp.component.props, attrOption, '    ')}`
        ].join('\n'));

      } else {
        cmp.push(`    0 /** ${tag} has no props [2] **/`);
      }

      if (registryCmp.component.priority === PRIORITY_LOW) {
        let priority = [
          `    /** ${tag}: priority [3] **/`,
          `    ${registryCmp.component.priority}`
        ];
        cmp.push(priority.join('\n'));
      }
    }

    cmps.push(`  [\n${cmp.join(',\n\n')}\n  ]`);
  });

  return `[\n${cmps.join(',\n')}\n]`;
}


export function getBundledModulesId(bundle: Bundle) {
  return bundle.components.map(c => c.component.tag).sort().join('.');
}
