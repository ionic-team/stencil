import * as d from '../../declarations';
import { MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { basename, dirname, relative } from 'path';

export function angularDirectiveProxyOutputs(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry) {
  const angularOuputTargets = (config.outputTargets as d.OutputTargetAngular[]).filter(o => o.type === 'angular' && o.directivesProxyFile);

  return Promise.all(angularOuputTargets.map(angularOuputTarget => {
    return angularDirectiveProxyOutput(config, compilerCtx, angularOuputTarget, cmpRegistry);
  }));
}


async function angularDirectiveProxyOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetAngular, cmpRegistry: d.ComponentRegistry) {
  const metadata = getMetadata(outputTarget.excludeComponents, cmpRegistry);
  let c = angularDirectiveProxies(metadata);

  const angularImports: string[] = [];

  if (c.includes('@NgDirective')) {
    angularImports.push('Directive as NgDirective');
  }

  angularImports.push('Input as NgInput', 'ElementRef');

  c = angularProxyInput() + c;
  c = angularProxyMethod() + c;

  if (c.includes('@NgOutput')) {
    c = angularProxyOutput() + c;
    angularImports.push('Output as NgOutput');
    angularImports.push('EventEmitter as NgEventEmitter');
  }

  c = `/* angular directive proxies */\nimport { ${angularImports.sort().join(', ')} } from '@angular/core';\n\n` + c;

  await compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, c);
  if (outputTarget.directivesArrayFile) {
    const proxyPath = relativeImport(outputTarget.directivesArrayFile, outputTarget.directivesProxyFile);
    const a = angularArray(metadata, proxyPath);
    await compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, a);
  }
  config.logger.debug(`generated angular directives: ${outputTarget.directivesProxyFile}`);
}

function relativeImport(pathFrom: string, pathTo: string) {
  let relativePath = relative(dirname(pathFrom), dirname(pathTo));
  relativePath = relativePath === '' ? '.' : relativePath;
  return `${relativePath}/${basename(pathTo, '.ts')}`;
}

function angularProxyInput() {
  return `
export function inputs(instance: any, el: ElementRef, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el.nativeElement[propName], set: (val: any) => el.nativeElement[propName] = val
    });
  });
}
`;
}


function angularProxyOutput() {
  return `
export function outputs(instance: any, events: string[]) {
  events.forEach(eventName => {
    instance[eventName] = new NgEventEmitter();
  });
}
`;
}


function angularProxyMethod() {
  return `
export function method(ref: ElementRef, methodName: string, args: any[]) {
  return ref.nativeElement.componentOnReady()
    .then((el: any) => el[methodName].apply(el, args));
}
`;
}

function getMetadata(excludeComponents: string[], cmpRegistry: d.ComponentRegistry): d.ComponentMeta[] {
  return Object.keys(cmpRegistry)
    .map(key => cmpRegistry[key])
    .filter(c => {
      return !excludeComponents.includes(c.tagNameMeta);
    })
    .sort((a, b) => {
      if (a.componentClass < b.componentClass) return -1;
      if (a.componentClass > b.componentClass) return 1;
      return 0;
    });
}

function angularDirectiveProxies(metadata: d.ComponentMeta[]) {
  const allInstanceMembers: string[] = [];
  const c = metadata.map(cmpMeta => angularDirectiveProxy(allInstanceMembers, cmpMeta)).join('\n');
  allInstanceMembers.sort();

  const instanceMembers = allInstanceMembers.map(v => `${v} = '${v}'`).join(', ');

  return `const ${instanceMembers};\n\n${c}`;
}

function angularArray(metadata: d.ComponentMeta[], proxyPath: string) {
  const directives = metadata.map(cmpMeta => `d.${cmpMeta.componentClass}`).join(',\n  ');
  return `
import * as d from '${proxyPath}';

export const DIRECTIVES = [
  ${directives}
];
`;
}


function angularDirectiveProxy(allInstanceMembers: string[], cmpMeta: d.ComponentMeta) {
  const o: string[] = [];
  const inputMembers: string[] = [];
  const outputMembers: string[] = [];

  o.push(`@NgDirective({ selector: '${cmpMeta.tagNameMeta}' })`);
  o.push(`export class ${cmpMeta.componentClass} {`);

  // Inputs
  Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    const m = cmpMeta.membersMeta[memberName];

    if (m.memberType === MEMBER_TYPE.Prop || m.memberType === MEMBER_TYPE.PropMutable) {
      o.push(getInput(memberName, m));

      if (RESERVED_KEYWORDS.includes(memberName)) {
        inputMembers.push(`'${memberName}'`);

      } else {
        if (!allInstanceMembers.includes(memberName)) {
          allInstanceMembers.push(memberName);
        }
        inputMembers.push(memberName);
      }
    }
  });

  // Events
  cmpMeta.eventsMeta.forEach(eventMeta => {
    o.push(`  @NgOutput() ${eventMeta.eventName}: NgEventEmitter<any>;`);
    const eventName = eventMeta.eventName;
    if (RESERVED_KEYWORDS.includes(eventName)) {
      outputMembers.push(`'${eventName}'`);
    } else {
      outputMembers.push(eventName);
      if (!allInstanceMembers.includes(eventName)) {
        allInstanceMembers.push(eventName);
      }
    }
  });

  // Methods
  let hasMethods = false;
  Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    const m = cmpMeta.membersMeta[memberName];

    if (m.memberType === MEMBER_TYPE.Method) {
      if (!allInstanceMembers.includes(memberName)) {
        allInstanceMembers.push(memberName);
      }
      o.push(getMethod(memberName, m));
      hasMethods = true;
    }
  });


  let hasContructor = false;
  if (hasMethods) {
    hasContructor = true;
    o.push(`  constructor(private r: ElementRef) {`);
  } else if ( inputMembers.length > 0) {
    hasContructor = true;
    o.push(`  constructor(r: ElementRef) {`);
  } else if ( outputMembers.length > 0 ) {
    hasContructor = true;
    o.push(`  constructor() {`);
  }
  if (inputMembers.length > 0) {
    o.push(`    inputs(this, r, [${inputMembers.join(`, `)}]);`);
  }
  if (outputMembers.length > 0) {
    o.push(`    outputs(this, [${outputMembers.join(`, `)}]);`);
  }
  if (hasContructor) {
    o.push(`  }`);
  }
  o.push(`}\n`);

  return o.join('\n');
}


function getInput(memberName: string, memberMeta: d.MemberMeta) {
  return `${getJsDocs(memberMeta)}  @NgInput() ${memberName}: ${getPropType(memberMeta.propType)};`;
}

function getMethod(memberName: string, memberMeta: d.MemberMeta) {
  return `${getJsDocs(memberMeta)}  ${memberName}(...__args: any[]): Promise<any> {
    return method(this.r, ${memberName}, __args);
  }`;
}

function getJsDocs(m: d.MemberMeta) {
  let c = '';

  if (m.jsdoc && m.jsdoc.documentation) {
    c += `  /**\n`;
    c += `   * ${m.jsdoc.documentation.replace(/\r?\n|\r/g, ' ')}\n`;
    c += `   */\n`;
  }

  return c;
}


function getPropType(propType: PROP_TYPE) {
  if (propType === PROP_TYPE.String) {
    return 'string';
  }
  if (propType === PROP_TYPE.Number) {
    return 'number';
  }
  if (propType === PROP_TYPE.Boolean) {
    return 'boolean';
  }
  return 'any';
}

const RESERVED_KEYWORDS = [
  'interface'
];
