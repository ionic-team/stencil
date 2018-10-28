import * as d from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';
import { MEMBER_TYPE } from '../../util/constants';


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
  const useDirectives = outputTarget.useDirectives;
  const { hasOutputs, proxies } = generateProxies(components, useDirectives);

  const auxFunctions: string[] = [
    inputsAuxFunction(),
    outputsAuxFunction(),
    methodsAuxFunction()
  ];
  const angularImports = [
    'ElementRef'
  ];

  if (components.length > 0) {
    if (useDirectives) {
      angularImports.push('Directive');
    } else {
      angularImports.push('Component');
      angularImports.push('ViewEncapsulation');
      angularImports.push('ChangeDetectionStrategy');
    }
  }

  if (hasOutputs) {
    angularImports.push('EventEmitter');
  }

  const imports = `
${hasOutputs ? `import { fromEvent } from 'rxjs';` : '' }
import { ${angularImports.sort().join(', ')} } from '@angular/core';
`;

  const sourceImports = !outputTarget.componentCorePackage ? ''
    : `type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];`;

  const final: string[] = [
    '/* tslint:disable */',
    '/* auto-generated angular directive proxies */',
    imports,
    sourceImports,
    auxFunctions.join('\n'),
    proxies,
  ];

  const finalText = final.join('\n') + '\n';
  await compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, finalText);
  if (outputTarget.directivesArrayFile) {
    const proxyPath = relativeImport(config, outputTarget.directivesArrayFile, outputTarget.directivesProxyFile);
    const a = angularArray(components, proxyPath);
    await compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, a);
  }
  config.logger.debug(`generated angular directives: ${outputTarget.directivesProxyFile}`);
}

function inputsAuxFunction() {
  return `
export function proxyInputs(instance: any, el: any, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el[propName], set: (val: any) => el[propName] = val
    });
  });
}`;
}


function outputsAuxFunction() {
  return `
export function proxyOutputs(instance: any, el: any, events: string[]) {
  events.forEach(eventName => instance[eventName] = fromEvent(el, eventName));
}`;
}


function methodsAuxFunction() {
  return `
export function proxyMethods(instance: any, el: any, methods: string[]) {
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

function generateProxies(components: d.ComponentMeta[], useDirectives: boolean) {
  let hasMethods = false;
  let hasOutputs = false;
  let hasInputs = false;

  const lines = components.map(cmpMeta => {
    const proxy = generateProxy(cmpMeta, useDirectives);
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
    hasInputs,
    hasMethods,
    hasOutputs
  };
}

function generateProxy(cmpMeta: d.ComponentMeta, useDirectives: boolean) {
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
  const decorator = useDirectives ? 'Directive' : 'Component';
  const directiveOpts = [
    `selector: \'${cmpMeta.tagNameMeta}\'`,
  ];
  if (!useDirectives) {
    directiveOpts.push(
      `changeDetection: ChangeDetectionStrategy.OnPush`,
      `encapsulation: ViewEncapsulation.None`,
      `template: '<ng-content></ng-content>'`
    );
  }
  if (inputs.length > 0) {
    directiveOpts.push(`inputs: ['${inputs.join(`', '`)}']`);
  }

  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
  const lines = [`
export declare interface ${cmpMeta.componentClass} extends StencilComponents<'${tagNameAsPascal}'> {}
@${decorator}({ ${directiveOpts.join(', ')} })
export class ${cmpMeta.componentClass} {`];

  // Generate outputs
  outputs.forEach(output => {
    lines.push(`  ${output}: EventEmitter<CustomEvent>;`);
  });

  // Generate component constructor
  if (hasContructor) {
    lines.push(`
  constructor(r: ElementRef) {
    const el = r.nativeElement;`);
  }

  if (hasMethods) {
    lines.push(`    proxyMethods(this, el, ['${methods.join(`', '`)}']);`);
  }

  if (hasInputs) {
    lines.push(`    proxyInputs(this, el, ['${inputs.join(`', '`)}']);`);
  }

  if (hasOutputs) {
    lines.push(`    proxyOutputs(this, el, ['${outputs.join(`', '`)}']);`);
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


function relativeImport(config: d.Config, pathFrom: string, pathTo: string) {
  let relativePath = config.sys.path.relative(config.sys.path.dirname(pathFrom), config.sys.path.dirname(pathTo));
  relativePath = relativePath === '' ? '.' : relativePath;
  return `${relativePath}/${config.sys.path.basename(pathTo, '.ts')}`;
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
