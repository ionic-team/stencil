import * as d from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';


export async function generateAngularProxies(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!buildCtx.requiresFullBuild && buildCtx.isRebuild && !buildCtx.hasScriptChanges) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetAngular[]).filter(o => {
    return o.type === 'angular' && o.directivesProxyFile;
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate angular proxies started`, true);

  const promises = outputTargets.map(async outputTarget => {
    await angularDirectiveProxyOutput(config, compilerCtx, buildCtx.moduleFiles, outputTarget);
  });

  await Promise.all(promises);

  timespan.finish(`generate angular proxies finished`);
}


function getComponents(excludeComponents: string[], allModuleFiles: d.Module[]) {
  const cmps = allModuleFiles.filter(m => m.cmpCompilerMeta).map(m => m.cmpCompilerMeta);

  return cmps
    .filter(c => !excludeComponents.includes(c.tagName))
    .sort((a, b) => {
      if (a.tagName < b.tagName) return -1;
      if (a.tagName > b.tagName) return 1;
      return 0;
    });
}


async function angularDirectiveProxyOutput(config: d.Config, compilerCtx: d.CompilerCtx, allModuleFiles: d.Module[], outputTarget: d.OutputTargetAngular) {
  const components = getComponents(outputTarget.excludeComponents, allModuleFiles);
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
      angularImports.push('ChangeDetectorRef');
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

  const outputText = (final.join('\n') + '\n');

  writeAngularProxyOutput(config, compilerCtx, outputTarget, components, outputText);

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

function generateProxies(components: d.ComponentCompilerMeta[], useDirectives: boolean) {
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

function generateProxy(cmpMeta: d.ComponentCompilerMeta, useDirectives: boolean) {
  // Collect component meta
  const inputs = (cmpMeta.properties || []);
  const outputs = (cmpMeta.events || []).map(eventMeta => eventMeta.name);
  const methods = (cmpMeta.methods || []);

  // Process meta
  const hasInputs = inputs.length > 0;
  const hasOutputs = outputs.length > 0;
  const hasMethods = methods.length > 0;
  const hasContructor = hasInputs || hasOutputs || hasMethods;

  // Generate Angular @Directive
  const decorator = useDirectives ? 'Directive' : 'Component';
  const directiveOpts = [
    `selector: \'${cmpMeta.tagName}\'`,
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

  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
  const lines = [`
export declare interface ${tagNameAsPascal} extends StencilComponents<'${tagNameAsPascal}'> {}
@${decorator}({ ${directiveOpts.join(', ')} })
export class ${tagNameAsPascal} {`];

  // Generate outputs
  outputs.forEach(output => {
    lines.push(`  ${output}!: EventEmitter<CustomEvent>;`);
  });

  // Generate component constructor
  if (hasContructor) {
    if (useDirectives) {
      lines.push(`
  constructor(r: ElementRef) {
    const el = r.nativeElement;`);
    } else {
      lines.push(`
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    const el = r.nativeElement;`);
    }
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


function relativeImport(config: d.Config, pathFrom: string, pathTo: string) {
  let relativePath = config.sys.path.relative(config.sys.path.dirname(pathFrom), config.sys.path.dirname(pathTo));
  relativePath = relativePath === '' ? '.' : relativePath;
  return `${relativePath}/${config.sys.path.basename(pathTo, '.ts')}`;
}

function angularArray(components: d.ComponentMeta[], proxyPath: string) {
  const directives = components
    .map(cmpMeta => dashToPascalCase(cmpMeta.tagNameMeta))
    .map(className => `d.${className}`)
    .join(',\n  ');

  return `
import * as d from '${proxyPath}';

export const DIRECTIVES = [
  ${directives}
];
`;
}


async function writeAngularProxyOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetAngular, components: d.ComponentCompilerMeta[], outputText: string) {
  await compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, outputText);

  if (outputTarget.directivesArrayFile) {
    const proxyPath = relativeImport(config, outputTarget.directivesArrayFile, outputTarget.directivesProxyFile);
    const a = angularArray(components, proxyPath);
    await compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, a);
  }
}
