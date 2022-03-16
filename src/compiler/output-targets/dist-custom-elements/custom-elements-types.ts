import type * as d from '../../../declarations';
import { isOutputTargetDistCustomElements } from '../output-utils';
import { dirname, join, relative } from 'path';
import { normalizePath, dashToPascalCase } from '@utils';

/**
 * Entrypoint for generating types for one or more `dist-custom-elements` output targets defined in a Stencil project's
 * configuration
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param distDtsFilePath the path to a type declaration file (.d.ts) that is being generated for the output target.
 * This path is not necessarily the `components.d.ts` file that is found in the root of a project's `src` directory.
 */
export const generateCustomElementsTypes = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  distDtsFilePath: string
): Promise<void> => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElements);

  await Promise.all(
    outputTargets.map((outputTarget) =>
      generateCustomElementsTypesOutput(config, compilerCtx, buildCtx, distDtsFilePath, outputTarget)
    )
  );
};

/**
 * Generates types for a single `dist-custom-elements` output target definition in a Stencil project's configuration
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param distDtsFilePath the path to a type declaration file (.d.ts) that is being generated for the output target.
 * This path is not necessarily the `components.d.ts` file that is found in the root of a project's `src` directory.
 * @param outputTarget the output target for which types are being currently generated
 */
export const generateCustomElementsTypesOutput = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  distDtsFilePath: string,
  outputTarget: d.OutputTargetDistCustomElements
) => {
  const customElementsDtsPath = join(outputTarget.dir, 'index.d.ts');
  const componentsDtsRelPath = relDts(outputTarget.dir, distDtsFilePath);

  const code = [
    `/* ${config.namespace} custom elements */`,
    ``,
    `import type { Components, JSX } from "${componentsDtsRelPath}";`,
    ``,
    `/**`,
    ` * Used to manually set the base path where assets can be found.`,
    ` * If the script is used as "module", it's recommended to use "import.meta.url",`,
    ` * such as "setAssetPath(import.meta.url)". Other options include`,
    ` * "setAssetPath(document.currentScript.src)", or using a bundler's replace plugin to`,
    ` * dynamically set the path at build time, such as "setAssetPath(process.env.ASSET_PATH)".`,
    ` * But do note that this configuration depends on how your script is bundled, or lack of`,
    ` * bundling, and where your assets can be loaded from. Additionally custom bundling`,
    ` * will have to ensure the static assets are copied to its build directory.`,
    ` */`,
    `export declare const setAssetPath: (path: string) => void;`,
    ``,
    `export interface SetPlatformOptions {`,
    `  raf?: (c: FrameRequestCallback) => number;`,
    `  ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;`,
    `  rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;`,
    `}`,
    `export declare const setPlatformOptions: (opts: SetPlatformOptions) => void;`,
    ``,
    `export type { Components, JSX };`,
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

  await compilerCtx.fs.writeFile(customElementsDtsPath, code.join('\n') + `\n`, {
    outputTargetType: outputTarget.type,
  });

  const components = buildCtx.components.filter((m) => !m.isCollectionDependency);
  await Promise.all(
    components.map(async (cmp) => {
      const dtsCode = generateCustomElementType(componentsDtsRelPath, cmp);
      const fileName = `${cmp.tagName}.d.ts`;
      const filePath = join(outputTarget.dir, fileName);
      await compilerCtx.fs.writeFile(filePath, dtsCode, { outputTargetType: outputTarget.type });
    })
  );
};

/**
 * Generate a type declaration file for a specific Stencil component
 * @param componentsDtsRelPath the path to a root type declaration file from which commonly used entities can be
 * referenced from in the newly generated file
 * @param cmp the component to generate the type declaration file for
 * @returns the contents of the type declaration file for the provided `cmp`
 */
const generateCustomElementType = (componentsDtsRelPath: string, cmp: d.ComponentCompilerMeta): string => {
  const tagNameAsPascal = dashToPascalCase(cmp.tagName);
  const o: string[] = [
    `import type { Components, JSX } from "${componentsDtsRelPath}";`,
    ``,
    `interface ${tagNameAsPascal} extends Components.${tagNameAsPascal}, HTMLElement {}`,
    `export const ${tagNameAsPascal}: {`,
    `    prototype: ${tagNameAsPascal};`,
    `    new (): ${tagNameAsPascal};`,
    `};`,
    `/**`,
    ` * Used to define this component and all nested components recursively.`,
    ` */`,
    `export const defineCustomElement: () => void;`,
    ``,
  ];

  return o.join('\n');
};

/**
 * Determines the relative path between two provided paths. If a type declaration file extension is present on
 * `dtsPath`, it will be removed from the computed relative path.
 * @param fromPath the path from which to start at
 * @param dtsPath the destination path
 * @returns the relative path from the provided `fromPath` to the `dtsPath`
 */
const relDts = (fromPath: string, dtsPath: string): string => {
  dtsPath = relative(fromPath, dtsPath);
  if (!dtsPath.startsWith('.')) {
    dtsPath = '.' + dtsPath;
  }
  return normalizePath(dtsPath.replace('.d.ts', ''));
};
