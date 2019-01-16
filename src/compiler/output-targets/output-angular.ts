import * as d from '../../declarations';
import { dashToPascalCase } from '@stencil/core/utils';
import { isDocsPublic } from '@stencil/core/utils';
import { OutputTargetAngular } from '../../declarations';


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
    await angularDirectiveProxyOutput(config, compilerCtx, outputTarget, buildCtx.moduleFiles);
  });

  await Promise.all(promises);

  timespan.finish(`generate angular proxies finished`);
}

async function angularDirectiveProxyOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetAngular, allModuleFiles: d.Module[]) {
  const components = getComponents(outputTarget.excludeComponents, allModuleFiles);

  await Promise.all([
    generateProxies(config, compilerCtx, components, outputTarget),
    generateAngularArray(config, compilerCtx, components, outputTarget),
    generateAngularUtils(compilerCtx, outputTarget)
  ]);

  config.logger.debug(`generated angular directives: ${outputTarget.directivesProxyFile}`);
}

function getComponents(excludeComponents: string[], allModuleFiles: d.Module[]) {
  const cmps = allModuleFiles.filter(m => m.cmpCompilerMeta).map(m => m.cmpCompilerMeta);

  return cmps
    .filter(c => !excludeComponents.includes(c.tagName) && isDocsPublic(c.jsdoc))
    .sort((a, b) => {
      if (a.tagName < b.tagName) return -1;
      if (a.tagName > b.tagName) return 1;
      return 0;
    });
}

async function generateProxies(config: d.Config, compilerCtx: d.CompilerCtx, components: d.ComponentCompilerMeta[], outputTarget: OutputTargetAngular) {
  const proxies = getProxies(components);

  const imports = `/* tslint:disable */
/* auto-generated angular directive proxies */
import { Component, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';`;

  const sourceImports = !outputTarget.componentCorePackage ? ''
    : `type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];`;

  const final: string[] = [
    imports,
    getProxyUtils(config, outputTarget),
    sourceImports,
    proxies,
  ];

  const finalText = final.join('\n') + '\n';
  await compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, finalText);
}

function getProxies(components: d.ComponentCompilerMeta[]) {
  return components
    .map(getProxy)
    .join('\n');
}

function getProxy(cmpMeta: d.ComponentCompilerMeta) {
  // Collect component meta
  const inputs = getInputs(cmpMeta);
  const outputs = getOutputs(cmpMeta);
  const methods = getMethods(cmpMeta);

  // Process meta
  const hasInputs = inputs.length > 0;
  const hasOutputs = outputs.length > 0;
  const hasMethods = methods.length > 0;

  // Generate Angular @Directive
  const directiveOpts = [
    `selector: \'${cmpMeta.tagName}\'`,
    `changeDetection: 0`,
    `template: '<ng-content></ng-content>'`
  ];
  if (inputs.length > 0) {
    directiveOpts.push(`inputs: ['${inputs.join(`', '`)}']`);
  }

  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
  const lines = [`
export declare interface ${tagNameAsPascal} extends StencilComponents<'${tagNameAsPascal}'> {}
@Component({ ${directiveOpts.join(', ')} })
export class ${tagNameAsPascal} {`];

  // Generate outputs
  outputs.forEach(output => {
    lines.push(`  ${output}!: EventEmitter<CustomEvent>;`);
  });

  lines.push('  el: HTMLElement;');
  lines.push(`  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;`);
  if (hasOutputs) {
    lines.push(`    proxyOutputs(this, this.el, ['${outputs.join(`', '`)}']);`);
  }
  lines.push(`  }`);
  lines.push(`}`);

  if (hasMethods) {
    lines.push(`proxyMethods(${tagNameAsPascal}, ['${methods.join(`', '`)}']);`);
  }
  if (hasInputs) {
    lines.push(`proxyInputs(${tagNameAsPascal}, ['${inputs.join(`', '`)}']);`);
  }

  return lines.join('\n');
}

function getInputs(cmpMeta: d.ComponentCompilerMeta) {
  return cmpMeta.properties.filter(_prop => {
    // TODO
    // return isDocsPublic(prop.jsdoc);
    return false;
  });
}

function getOutputs(cmpMeta: d.ComponentCompilerMeta) {
  return cmpMeta.events.filter(_event => {
    // TODO
    // return isDocsPublic(event.jsdoc);
    return false;
  }).map(eventMeta => eventMeta.name);
}

function getMethods(cmpMeta: d.ComponentCompilerMeta) {
  return cmpMeta.methods.filter(_method => {
    // TODO
    // return isDocsPublic(method.jsdoc);
    return false;
  });
}

function getProxyUtils(config: d.Config, outputTarget: OutputTargetAngular) {
  if (!outputTarget.directivesUtilsFile) {
    return PROXY_UTILS.replace(/export function/g, 'function');
  } else {
    const utilsPath = relativeImport(config, outputTarget.directivesProxyFile, outputTarget.directivesUtilsFile);
    return `import { proxyInputs, proxyMethods, proxyOutputs } from '${utilsPath}';\n`;
  }
}

async function generateAngularArray(config: d.Config, compilerCtx: d.CompilerCtx, components: d.ComponentCompilerMeta[], outputTarget: OutputTargetAngular) {
  if (!outputTarget.directivesArrayFile) {
    return;
  }

  const proxyPath = relativeImport(config, outputTarget.directivesArrayFile, outputTarget.directivesProxyFile);
  const directives = components
    .map(cmpMeta => dashToPascalCase(cmpMeta.tagName))
    .map(className => `d.${className}`)
    .join(',\n  ');

  const c = `
import * as d from '${proxyPath}';

export const DIRECTIVES = [
${directives}
];
`;
  await compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, c);
}

async function generateAngularUtils(compilerCtx: d.CompilerCtx, outputTarget: OutputTargetAngular) {
  if (outputTarget.directivesUtilsFile) {
    await compilerCtx.fs.writeFile(outputTarget.directivesUtilsFile, '/* tslint:disable */\n' + PROXY_UTILS);
  }
}

function relativeImport(config: d.Config, pathFrom: string, pathTo: string) {
  let relativePath = config.sys.path.relative(config.sys.path.dirname(pathFrom), config.sys.path.dirname(pathTo));
  relativePath = relativePath === '' ? '.' : relativePath;
  return `${relativePath}/${config.sys.path.basename(pathTo, '.ts')}`;
}

const PROXY_UTILS = `import { fromEvent } from 'rxjs';

export function proxyInputs(Cmp: any, inputs: string[]) {
  const Prototype = Cmp.prototype;
  inputs.forEach(item => {
    Object.defineProperty(Prototype, item, {
      get() { return this.el[item]; },
      set(val: any) { this.el[item] = val; },
    });
  });
}

export function proxyMethods(Cmp: any, methods: string[]) {
  const Prototype = Cmp.prototype;
  methods.forEach(methodName => {
    Prototype[methodName] = function() {
      const args = arguments;
      return this.el.componentOnReady().then((el: any) => el[methodName].apply(el, args));
    };
  });
}

export function proxyOutputs(instance: any, el: any, events: string[]) {
  events.forEach(eventName => instance[eventName] = fromEvent(el, eventName));
}
`;
