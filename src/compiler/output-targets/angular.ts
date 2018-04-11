import * as d from '../../declarations';
import { MEMBER_TYPE } from '../../util/constants';
import { basename, dirname, relative } from 'path';
import { dashToPascalCase } from '../../util/helpers';

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

  if (c.includes('@Directive')) {
    angularImports.push('Directive');
  }

  angularImports.push('ElementRef');

  c = angularProxyInput() + c;
  c = angularProxyMethod() + c;

  if (c.includes('@Output')) {
    c = angularProxyOutput() + c;
    angularImports.push('Output');
    angularImports.push('EventEmitter');
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
    instance[eventName] = new EventEmitter();
  });
}
`;
}


function angularProxyMethod() {
  return `
export function methods(instance: any, ref: ElementRef, methods: string[]) {
  const el = ref.nativeElement;
  methods.forEach(methodName => {
    Object.defineProperty(instance, methodName, {
      get: function() {
        const args = arguments;
        return el.componentOnReady()
          .then((el: any) => el[methodName].apply(el, args));
      }
    });
  });
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
  const set = new Set<string>();
  const c = metadata.map(cmpMeta => angularDirectiveProxy(set, cmpMeta)).join('\n');
  const allInstanceMembers = Array.from(set).sort();

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


function angularDirectiveProxy(allInstanceMembers: Set<string>, cmpMeta: d.ComponentMeta) {
  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);

  // Inputs
  const inputMembers = Object.keys(cmpMeta.membersMeta).filter(memberName => {
    const m = cmpMeta.membersMeta[memberName];
    return m.memberType === MEMBER_TYPE.Prop || m.memberType === MEMBER_TYPE.PropMutable;
  }).map(name => {
    if (RESERVED_KEYWORDS.includes(name)) {
      name = `'${name}'`;
    } else {
      allInstanceMembers.add(name);
    }
    return name;
  });

  // Events
  const outputMembers = cmpMeta.eventsMeta.map(eventMeta => {
    const name = eventMeta.eventName;
    allInstanceMembers.add(name);
    return name;
  });

  // Methods
  const methodMembers = Object.keys(cmpMeta.membersMeta).filter(memberName => {
    const m = cmpMeta.membersMeta[memberName];
    return m.memberType === MEMBER_TYPE.Method;
  }).map(name => {
    if (RESERVED_KEYWORDS.includes(name)) {
      name = `'${name}'`;
    } else {
      allInstanceMembers.add(name);
    }
    return name;
  });


  const directiveOpts = [
    `selector: \'${cmpMeta.tagNameMeta}\'`
  ];
  if (inputMembers.length > 0) {
    directiveOpts.push(`inputs: [${inputMembers.join(', ')}]`);
  }
  if (outputMembers.length > 0) {
    directiveOpts.push(`outputs: [${outputMembers.join(', ')}]`);
  }
  const o: string[] = [
    `export declare interface ${cmpMeta.componentClass} extends StencilComponents.${tagNameAsPascal} {}`,
    `@Directive({${directiveOpts.join(', ')}})`,
    `export class ${cmpMeta.componentClass} {`
  ];

  outputMembers.forEach(output => {
    o.push(`  @Output() ${output}: EventEmitter<any>;`);
  });

  let hasContructor = false;
  if (methodMembers.length > 0 || inputMembers.length > 0) {
    hasContructor = true;
    o.push(`  constructor(r: ElementRef) {`);
  } else if ( outputMembers.length > 0 ) {
    hasContructor = true;
    o.push(`  constructor() {`);
  }
  if (methodMembers.length > 0) {
    o.push(`    methods(this, r, [${methodMembers.join(`, `)}]);`);
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

const RESERVED_KEYWORDS = [
  'interface'
];
