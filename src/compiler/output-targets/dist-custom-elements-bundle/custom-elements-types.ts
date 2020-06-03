import * as d from '../../../declarations';
import { isOutputTargetDistCustomElementsBundle } from '../output-utils';
import { dirname, join, relative } from 'path';
import { normalizePath, dashToPascalCase } from '@utils';

export const generateCustomElementsTypes = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, distDtsFilePath: string) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElementsBundle);

  await Promise.all(outputTargets.map(outputTarget => generateCustomElementsTypesOutput(config, compilerCtx, buildCtx, distDtsFilePath, outputTarget)));
};

const generateCustomElementsTypesOutput = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  distDtsFilePath: string,
  outputTarget: d.OutputTargetDistCustomElementsBundle,
) => {
  const customElementsDtsPath = join(outputTarget.dir, 'index.d.ts');
  const componentsDtsRelPath = relDts(outputTarget.dir, distDtsFilePath);

  const components = buildCtx.components.filter(m => !m.isCollectionDependency);

  const code = [
    `/* ${config.namespace} custom elements bundle */`,
    ``,
    `import { Components } from "${componentsDtsRelPath}";`,
    ``,
    ...components.map(generateCustomElementType),
    `/**`,
    ` * Utility to safely define a custom element by:`,
    ` * 1. Ensuring the "customElements" registry is available in the global context (window).`,
    ` * 2. The component tagname is not already defined.`,
    ` *`,
    ` * Use the standard [customElements.define()](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) `,
    ` * if you do not want to run these checks before defining a custom element.`,
    ` */`,
    `export declare const safeDefineCustomElement: (tag: string, cmp: any, opts?: any) => void;`,
    ``,
    `/**`,
    ` * Utility to automatically define all custom elements within this package using the tagname provided component's source. `,
    ` * This utility uses the "safeDefineCustomElement()" method. `,
    ` * Use the standard [customElements.define()](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) `,
    ` * method instead to define custom elements individually, or to define the custom element with a different tagname.`,
    ` */`,
    `export declare const defineCustomElements: (opts?: any) => void;`,
    ``,
  ];

  const usersIndexJsPath = join(config.srcDir, 'index.ts');
  const hasUserIndex = await compilerCtx.fs.access(usersIndexJsPath);
  if (hasUserIndex) {
    const userIndexRelPath = normalizePath(dirname(componentsDtsRelPath));
    code.push(`export * from '${userIndexRelPath}';`);
  } else {
    code.push(`export * from '${componentsDtsRelPath}';`);
  }

  await compilerCtx.fs.writeFile(customElementsDtsPath, code.join('\n') + `\n`, { outputTargetType: outputTarget.type });
};

const generateCustomElementType = (cmp: d.ComponentCompilerMeta) => {
  const tagNameAsPascal = dashToPascalCase(cmp.tagName);
  const o: string[] = [
    `interface ${tagNameAsPascal} extends Components.${tagNameAsPascal}, HTMLElement {}`,
    `export const ${tagNameAsPascal}: {`,
    `    prototype: ${tagNameAsPascal};`,
    `    new (): ${tagNameAsPascal};`,
    `};`,
    ``,
  ];

  return o.join('\n');
};

const relDts = (fromPath: string, dtsPath: string) => {
  dtsPath = relative(fromPath, dtsPath);
  if (!dtsPath.startsWith('.')) {
    dtsPath = '.' + dtsPath;
  }
  return normalizePath(dtsPath.replace('.d.ts', ''));
};
