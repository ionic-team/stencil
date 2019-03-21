import * as d from '../../../declarations';
import { OutputTargetAngular } from './types';
import { dashToPascalCase, flatOne, relativeImport, sortBy } from './utils';


export function angularDirectiveProxyOutput(compilerCtx: d.CompilerCtx, outputTarget: OutputTargetAngular, moduleFiles: d.Module[]) {
  const components = getComponents(outputTarget.excludeComponents, moduleFiles);

  return Promise.all([
    generateProxies(compilerCtx, components, outputTarget),
    generateAngularArray(compilerCtx, components, outputTarget),
    generateAngularUtils(compilerCtx, outputTarget)
  ]);
}

function getComponents(excludeComponents: string[], moduleFiles: d.Module[]) {
  const cmps = getComponentsFromModules(moduleFiles);
  return sortBy(cmps, cmp => cmp.tagName)
    .filter(c => !excludeComponents.includes(c.tagName) && !c.internal);
}

export function getComponentsFromModules(moduleFiles: d.Module[]) {
  return flatOne(moduleFiles.map(m => m.cmps));
}

function generateProxies(compilerCtx: d.CompilerCtx, components: d.ComponentCompilerMeta[], outputTarget: OutputTargetAngular) {
  const proxies = getProxies(components);

  const imports = `/* tslint:disable */
/* auto-generated angular directive proxies */
import { Component, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';`;

  const sourceImports = !outputTarget.componentCorePackage ? ''
    : `type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];`;

  const final: string[] = [
    imports,
    getProxyUtils(outputTarget),
    sourceImports,
    proxies,
  ];

  const finalText = final.join('\n') + '\n';

  return compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, finalText);
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

  lines.push('  protected el: HTMLElement;');
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

function getInputs(cmpMeta: d.ComponentCompilerMeta): string[] {
  return [
    ...cmpMeta.properties.filter(prop => !prop.internal).map(prop => prop.name),
    ...cmpMeta.virtualProperties.map(prop => prop.name)
  ].sort();
}

function getOutputs(cmpMeta: d.ComponentCompilerMeta): string[] {
  return cmpMeta.events.filter(ev => !ev.internal).map(prop => prop.name);
}

function getMethods(cmpMeta: d.ComponentCompilerMeta): string[] {
  return cmpMeta.methods.filter(method => !method.internal).map(prop => prop.name);
}

function getProxyUtils(outputTarget: OutputTargetAngular) {
  if (!outputTarget.directivesUtilsFile) {
    return PROXY_UTILS.replace(/export function/g, 'function');
  } else {
    const utilsPath = relativeImport(outputTarget.directivesProxyFile, outputTarget.directivesUtilsFile, '.ts');
    return `import { proxyInputs, proxyMethods, proxyOutputs } from '${utilsPath}';\n`;
  }
}

function generateAngularArray(compilerCtx: d.CompilerCtx, components: d.ComponentCompilerMeta[], outputTarget: OutputTargetAngular): Promise<any> {
  if (!outputTarget.directivesArrayFile) {
    return Promise.resolve();
  }

  const proxyPath = relativeImport(outputTarget.directivesArrayFile, outputTarget.directivesProxyFile, '.ts');
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
  return compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, c);
}

async function generateAngularUtils(compilerCtx: d.CompilerCtx, outputTarget: OutputTargetAngular) {
  if (outputTarget.directivesUtilsFile) {
    await compilerCtx.fs.writeFile(outputTarget.directivesUtilsFile, '/* tslint:disable */\n' + PROXY_UTILS);
  }
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
