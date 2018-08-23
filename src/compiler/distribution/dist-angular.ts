import * as d from '../../declarations';
import { MEMBER_TYPE } from '../../util/constants';
import { basename, dirname, relative } from 'path';
import { dashToPascalCase } from '../../util/helpers';


export async function generateAngularProxies(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry) {
  const angularOuputTargets = (config.outputTargets as d.OutputTargetAngular[])
    .filter(o => o.type === 'angular' && o.directivesProxyFile);

  await Promise.all(angularOuputTargets.map(async angularOuputTarget => {
    await angularDirectiveProxyOutput(config, compilerCtx, angularOuputTarget, cmpRegistry);
  }));
}


function getComponents(excludeComponents: string[], cmpRegistry: d.ComponentRegistry): d.ComponentMeta[] {
  return Object.keys(cmpRegistry)
    .map(key => cmpRegistry[key])
    .filter(c => !excludeComponents.includes(c.tagNameMeta))
    .sort((a, b) => {
      if (a.componentClass < b.componentClass) return -1;
      if (a.componentClass > b.componentClass) return 1;
      return 0;
    });
}

async function angularDirectiveProxyOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetAngular, cmpRegistry: d.ComponentRegistry) {
  const components = getComponents(outputTarget.excludeComponents, cmpRegistry);
  const { hasDirectives, hasOutputs, proxies } = generateProxies(components);

  const auxFunctions: string[] = [
    inputsAuxFunction(),
    outputsAuxFunction(),
    methodsAuxFunction()
  ];
  const angularImports = [
    'ElementRef'
  ];

  if (hasDirectives) {
    angularImports.push('Directive');
  }

  if (hasOutputs) {
    angularImports.push('EventEmitter');
  }

  const imports = `import { ${angularImports.sort().join(', ')} } from '@angular/core';`;
  let sourceImports =  '';
  if (outputTarget.componentCorePackage) {
    sourceImports = `import { LocalElementInterfaces } from '${ outputTarget.componentCorePackage }';\n` +
      `type StencilComponents<T extends keyof LocalElementInterfaces> = LocalElementInterfaces[T];`;
  }

  const final: string[] = [
    '/* auto-generated angular directive proxies */',
    '/* tslint:disable */',
    imports,
    sourceImports,
    auxFunctions.join('\n'),
    proxies,
  ];

  const finalText = final.join('\n') + '\n';
  await compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, finalText);
  if (outputTarget.directivesArrayFile) {
    const proxyPath = relativeImport(outputTarget.directivesArrayFile, outputTarget.directivesProxyFile);
    const a = angularArray(components, proxyPath);
    await compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, a);
  }
  config.logger.debug(`generated angular directives: ${outputTarget.directivesProxyFile}`);
}

function inputsAuxFunction() {
  return `
export function proxyInputs(instance: any, el: ElementRef, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el.nativeElement[propName], set: (val: any) => el.nativeElement[propName] = val
    });
  });
}`;
}


function outputsAuxFunction() {
  return `
export function proxyOutputs(instance: any, events: string[]) {
  events.forEach(eventName => instance[eventName] = new EventEmitter());
}`;
}


function methodsAuxFunction() {
  return `
export function proxyMethods(instance: any, ref: ElementRef, methods: string[]) {
  const el = ref.nativeElement;
  methods.forEach(methodName => {
    Object.defineProperty(instance, methodName, {
      get: function() {
        return function() {
          const args = arguments;
          return el.componentOnReady().then((el: any) => el[methodName].apply(el, args));
        };
      }
    });
  });
}
`;
}

function generateProxies(components: d.ComponentMeta[]) {
  let hasDirectives = false;
  let hasMethods = false;
  let hasOutputs = false;
  let hasInputs = false;

  const lines = components.map(cmpMeta => {
    const proxy = generateProxy(cmpMeta);
    hasDirectives = true;
    if (proxy.hasInputs) {
      hasInputs = true;
    }
    if (proxy.hasMethods) {
      hasMethods = true;
    }
    if (proxy.hasOutputs) {
      hasOutputs = true;
    }
    return proxy.text;
  });

  return {
    proxies: lines.join('\n'),
    hasDirectives,
    hasInputs,
    hasMethods,
    hasOutputs
  };
}

function generateProxy(cmpMeta: d.ComponentMeta) {
  // Collect component meta
  const inputs = getInputs(cmpMeta);
  const outputs = getOutputs(cmpMeta);
  const methods = getMethods(cmpMeta);

  // Process meta
  const hasInputs = inputs.length > 0;
  const hasOutputs = outputs.length > 0;
  const hasMethods = methods.length > 0;
  const hasContructor = hasInputs || hasOutputs || hasMethods;

  // Generate Angular @Directive
  const directiveOpts = [
    `selector: \'${cmpMeta.tagNameMeta}\'`
  ];
  if (inputs.length > 0) {
    directiveOpts.push(`inputs: ['${inputs.join(`', '`)}']`);
  }
  if (outputs.length > 0) {
    directiveOpts.push(`outputs: ['${outputs.join(`', '`)}']`);
  }

  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
  const lines = [`
export declare interface ${cmpMeta.componentClass} extends StencilComponents<'${tagNameAsPascal}'> {}
@Directive({ ${directiveOpts.join(', ')} })
export class ${cmpMeta.componentClass} {`];

  // Generate outputs
  outputs.forEach(output => {
    lines.push(`  ${output}: EventEmitter<any>;`);
  });

  // Generate component constructor
  if (hasMethods || hasInputs) {
    lines.push(`  constructor(r: ElementRef) {`);
  } else if (hasOutputs) {
    lines.push(`  constructor() {`);
  }

  if (hasMethods) {
    lines.push(`    proxyMethods(this, r, ['${methods.join(`', '`)}']);`);
  }

  if (hasInputs) {
    lines.push(`    proxyInputs(this, r, ['${inputs.join(`', '`)}']);`);
  }

  if (hasOutputs) {
    lines.push(`    proxyOutputs(this, ['${outputs.join(`', '`)}']);`);
  }

  if (hasContructor) {
    lines.push(`  }`);
  }

  lines.push(`}`);

  return {
    text: lines.join('\n'),
    hasInputs,
    hasMethods,
    hasOutputs
  };
}

function getInputs(cmpMeta: d.ComponentMeta) {
  return Object.keys(cmpMeta.membersMeta || {}).filter(memberName => {
    const m = cmpMeta.membersMeta[memberName];
    return m.memberType === MEMBER_TYPE.Prop || m.memberType === MEMBER_TYPE.PropMutable;
  });
}

function getOutputs(cmpMeta: d.ComponentMeta) {
  return (cmpMeta.eventsMeta || []).map(eventMeta => eventMeta.eventName);
}

function getMethods(cmpMeta: d.ComponentMeta) {
  return Object.keys(cmpMeta.membersMeta || {}).filter(memberName => {
    const m = cmpMeta.membersMeta[memberName];
    return m.memberType === MEMBER_TYPE.Method;
  });
}


function relativeImport(pathFrom: string, pathTo: string) {
  let relativePath = relative(dirname(pathFrom), dirname(pathTo));
  relativePath = relativePath === '' ? '.' : relativePath;
  return `${relativePath}/${basename(pathTo, '.ts')}`;
}

function angularArray(components: d.ComponentMeta[], proxyPath: string) {
  const directives = components.map(cmpMeta => `d.${cmpMeta.componentClass}`).join(',\n  ');
  return `
import * as d from '${proxyPath}';

export const DIRECTIVES = [
  ${directives}
];
`;
}
