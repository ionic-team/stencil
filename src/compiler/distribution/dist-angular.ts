import * as d from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';
import { MEMBER_TYPE } from '../../util/constants';
import { isDocsPublic } from '../util';
import { OutputTargetAngular } from '../../declarations';


export async function generateAngularProxies(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry) {
  const angularOuputTargets = (config.outputTargets as d.OutputTargetAngular[])
    .filter(o => o.type === 'angular' && o.directivesProxyFile);

  await Promise.all(angularOuputTargets.map(async angularOuputTarget => {
    await angularDirectiveProxyOutput(config, compilerCtx, angularOuputTarget, cmpRegistry);
  }));
}

async function angularDirectiveProxyOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetAngular, cmpRegistry: d.ComponentRegistry) {
  const components = getComponents(outputTarget.excludeComponents, cmpRegistry);

  await Promise.all([
    generateProxies(config, compilerCtx, components, outputTarget),
    generateAngularArray(config, compilerCtx, components, outputTarget),
    generateAngularUtils(compilerCtx, outputTarget)
  ]);

  config.logger.debug(`generated angular directives: ${outputTarget.directivesProxyFile}`);
}

function getComponents(excludeComponents: string[], cmpRegistry: d.ComponentRegistry): d.ComponentMeta[] {
  return Object.keys(cmpRegistry)
    .map(key => cmpRegistry[key])
    .filter(c => !excludeComponents.includes(c.tagNameMeta) && isDocsPublic(c.jsdoc))
    .sort((a, b) => {
      if (a.tagNameMeta < b.tagNameMeta) return -1;
      if (a.tagNameMeta > b.tagNameMeta) return 1;
      return 0;
    });
}

async function generateProxies(config: d.Config, compilerCtx: d.CompilerCtx, components: d.ComponentMeta[], outputTarget: OutputTargetAngular) {
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

function getProxies(components: d.ComponentMeta[]) {
  return components
    .map(getProxy)
    .join('\n');
}

function getProxy(cmpMeta: d.ComponentMeta) {
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
    `selector: \'${cmpMeta.tagNameMeta}\'`,
    `changeDetection: 0`,
    `template: '<ng-content></ng-content>'`
  ];
  if (inputs.length > 0) {
    directiveOpts.push(`inputs: ['${inputs.join(`', '`)}']`);
  }

  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
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

function getInputs(cmpMeta: d.ComponentMeta) {
  return Object.keys(cmpMeta.membersMeta || {}).filter(memberName => {
    const m = cmpMeta.membersMeta[memberName];
    return isDocsPublic(m.jsdoc) && (m.memberType === MEMBER_TYPE.Prop || m.memberType === MEMBER_TYPE.PropMutable);
  });
}

function getOutputs(cmpMeta: d.ComponentMeta) {
  return (cmpMeta.eventsMeta || [])
    .filter(e => isDocsPublic(e.jsdoc))
    .map(eventMeta => eventMeta.eventName);
}

function getMethods(cmpMeta: d.ComponentMeta) {
  return Object.keys(cmpMeta.membersMeta || {}).filter(memberName => {
    const m = cmpMeta.membersMeta[memberName];
    return isDocsPublic(m.jsdoc) && m.memberType === MEMBER_TYPE.Method;
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

async function generateAngularArray(config: d.Config, compilerCtx: d.CompilerCtx, components: d.ComponentMeta[], outputTarget: OutputTargetAngular) {
  if (!outputTarget.directivesArrayFile) {
    return;
  }

  const proxyPath = relativeImport(config, outputTarget.directivesArrayFile, outputTarget.directivesProxyFile);
  const directives = components
    .map(cmpMeta => dashToPascalCase(cmpMeta.tagNameMeta))
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

