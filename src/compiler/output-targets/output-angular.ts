import * as d from '../../declarations';
import { dashToPascalCase, sortBy } from '@utils';
import { dirname, join } from 'path';
import ts from 'typescript';
import { isOutputTargetAngular, relativeImport } from './output-utils';

export const outputAngular = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  if (!config.buildDist) {
    return;
  }
  const angularOutputTargets = config.outputTargets.filter(isOutputTargetAngular);
  if (angularOutputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate angular proxies started`, true);
  await Promise.all(angularOutputTargets.map(outputTarget => angularDirectiveProxyOutput(config, compilerCtx, buildCtx, outputTarget)));

  timespan.finish(`generate angular proxies finished`);
};

export const angularDirectiveProxyOutput = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetAngular) => {
  const filteredComponents = getFilteredComponents(outputTarget.excludeComponents, buildCtx.components);

  return Promise.all([
    generateProxies(config, compilerCtx, buildCtx, filteredComponents, outputTarget),
    generateAngularArray(compilerCtx, filteredComponents, outputTarget),
    generateAngularUtils(compilerCtx, outputTarget),
  ]);
};

const getFilteredComponents = (excludeComponents: string[] = [], cmps: d.ComponentCompilerMeta[]) => {
  return sortBy(cmps, cmp => cmp.tagName).filter(c => !excludeComponents.includes(c.tagName) && !c.internal);
};

const generateProxies = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, components: d.ComponentCompilerMeta[], outputTarget: d.OutputTargetAngular) => {
  const proxies = getProxies(components);
  const distTypesDir = dirname(buildCtx.packageJson.types);
  const dtsFilePath = join(config.rootDir, distTypesDir, GENERATED_DTS);
  const componentsTypeFile = relativeImport(outputTarget.directivesProxyFile, dtsFilePath, '.d.ts');

  const imports = `/* eslint-disable */
/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';`;

  const sourceImports = !outputTarget.componentCorePackage
    ? `import { Components } from '${componentsTypeFile}';`
    : `import { Components } from '${outputTarget.componentCorePackage}';`;

  const final: string[] = [imports, getProxyUtils(outputTarget), sourceImports, proxies];

  const finalText = final.join('\n') + '\n';
  const tsSourceFile = ts.createSourceFile(GENERATED_DTS, finalText, ts.ScriptTarget.Latest, false);
  const tsPrinter = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });

  const formattedCode = tsPrinter.printFile(tsSourceFile);
  return compilerCtx.fs.writeFile(outputTarget.directivesProxyFile, formattedCode);
};

const getProxies = (components: d.ComponentCompilerMeta[]) => {
  return components.map(getProxy).join('\n');
};

const getProxyCmp = (inputs: string[], methods: string[]): string => {
  const hasInputs = inputs.length > 0;
  const hasMethods = methods.length > 0;
  const proxMeta: string[] = [];

  if (!hasInputs && !hasMethods) {
    return '';
  }

  if (hasInputs) proxMeta.push(`inputs: ['${inputs.join(`', '`)}']`);
  if (hasMethods) proxMeta.push(`'methods': ['${methods.join(`', '`)}']`);

  return `@ProxyCmp({${proxMeta.join(', ')}})`;
};

const getProxy = (cmpMeta: d.ComponentCompilerMeta) => {
  // Collect component meta
  const inputs = getInputs(cmpMeta);
  const outputs = getOutputs(cmpMeta);
  const methods = getMethods(cmpMeta);

  const hasOutputs = outputs.length > 0;

  // Generate Angular @Directive
  const directiveOpts = [`selector: \'${cmpMeta.tagName}\'`, `changeDetection: ChangeDetectionStrategy.OnPush`, `template: '<ng-content></ng-content>'`];
  if (inputs.length > 0) {
    directiveOpts.push(`inputs: ['${inputs.join(`', '`)}']`);
  }

  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
  const lines = [
    `
export declare interface ${tagNameAsPascal} extends Components.${tagNameAsPascal} {}
${getProxyCmp(inputs, methods)}
@Component({ ${directiveOpts.join(', ')} })
export class ${tagNameAsPascal} {`,
  ];

  // Generate outputs
  outputs.forEach(output => {
    lines.push(`  ${output}!: EventEmitter<CustomEvent>;`);
  });

  lines.push('  protected el: HTMLElement;');
  lines.push(`  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;`);
  if (hasOutputs) {
    lines.push(`    proxyOutputs(this, this.el, ['${outputs.join(`', '`)}']);`);
  }
  lines.push(`  }`);
  lines.push(`}`);

  return lines.join('\n');
};

const getInputs = (cmpMeta: d.ComponentCompilerMeta): string[] => {
  return [...cmpMeta.properties.filter(prop => !prop.internal).map(prop => prop.name), ...cmpMeta.virtualProperties.map(prop => prop.name)].sort();
};

const getOutputs = (cmpMeta: d.ComponentCompilerMeta): string[] => {
  return cmpMeta.events.filter(ev => !ev.internal).map(prop => prop.name);
};

const getMethods = (cmpMeta: d.ComponentCompilerMeta): string[] => {
  return cmpMeta.methods.filter(method => !method.internal).map(prop => prop.name);
};

const getProxyUtils = (outputTarget: d.OutputTargetAngular) => {
  if (!outputTarget.directivesUtilsFile) {
    return PROXY_UTILS.replace(/export function/g, 'function');
  } else {
    const utilsPath = relativeImport(outputTarget.directivesProxyFile, outputTarget.directivesUtilsFile, '.ts');
    return `import { ProxyCmp, proxyOutputs } from '${utilsPath}';\n`;
  }
};

const generateAngularArray = (compilerCtx: d.CompilerCtx, components: d.ComponentCompilerMeta[], outputTarget: d.OutputTargetAngular): Promise<any> => {
  if (!outputTarget.directivesArrayFile) {
    return Promise.resolve();
  }

  const proxyPath = relativeImport(outputTarget.directivesArrayFile, outputTarget.directivesProxyFile, '.ts');
  const directives = components
    .map(cmpMeta => dashToPascalCase(cmpMeta.tagName))
    .map(className => `  d.${className}`)
    .join(',\n');

  const c = `
import * as d from '${proxyPath}';

export const DIRECTIVES = [
${directives}
];
`;
  return compilerCtx.fs.writeFile(outputTarget.directivesArrayFile, c);
};

const generateAngularUtils = async (compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetAngular) => {
  if (outputTarget.directivesUtilsFile) {
    await compilerCtx.fs.writeFile(outputTarget.directivesUtilsFile, '/* eslint-disable */\n/* tslint:disable */\n' + PROXY_UTILS);
  }
};

const PROXY_UTILS = `import { fromEvent } from 'rxjs';

export const proxyInputs = (Cmp: any, inputs: string[]) => {
  const Prototype = Cmp.prototype;
  inputs.forEach(item => {
    Object.defineProperty(Prototype, item, {
      get() {
        return this.el[item];
      },
      set(val: any) {
        this.z.runOutsideAngular(() => (this.el[item] = val));
      }
    });
  });
};

export const proxyMethods = (Cmp: any, methods: string[]) => {
  const Prototype = Cmp.prototype;
  methods.forEach(methodName => {
    Prototype[methodName] = function () {
      const args = arguments;
      return this.z.runOutsideAngular(() =>
        this.el[methodName].apply(this.el, args)
      );
    };
  });
};

export const proxyOutputs = (instance: any, el: any, events: string[]) => {
  events.forEach(eventName => instance[eventName] = fromEvent(el, eventName));
}

export function ProxyCmp(opts: { inputs?: any; methods?: any }) {
  const decorator =  function(cls: any){
    if (opts.inputs) {
      proxyInputs(cls, opts.inputs);
    }
    if (opts.methods) {
      proxyMethods(cls, opts.methods);
    }
    return cls;
  };
  return decorator;
}
`;

export const GENERATED_DTS = 'components.d.ts';
