import { dashToPascalCase, normalizePath } from '@utils';
import { dirname, join, relative } from 'path';

import type * as d from '../../../declarations';
import { isOutputTargetDistCustomElements } from '../output-utils';

/**
 * Entrypoint for generating types for one or more `dist-custom-elements` output targets defined in a Stencil project's
 * configuration
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param typesDir the path to the directory where type declarations are saved
 */
export const generateCustomElementsTypes = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  typesDir: string
): Promise<void> => {
  const outputTargets = config.outputTargets.filter(isOutputTargetDistCustomElements);

  await Promise.all(
    outputTargets.map((outputTarget) =>
      generateCustomElementsTypesOutput(config, compilerCtx, buildCtx, typesDir, outputTarget)
    )
  );
};

/**
 * Generates types for a single `dist-custom-elements` output target definition in a Stencil project's configuration
 *
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param typesDir path to the directory where type declarations are saved
 * @param outputTarget the output target for which types are being currently generated
 */
const generateCustomElementsTypesOutput = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  typesDir: string,
  outputTarget: d.OutputTargetDistCustomElements
) => {
  // the path where we're going to write the typedef for the whole dist-custom-elements output
  const customElementsDtsPath = join(outputTarget.dir!, 'index.d.ts');
  // the directory where types for the individual components are written
  const componentsTypeDirectoryRelPath = relative(outputTarget.dir!, typesDir);

  const components = buildCtx.components.filter((m) => !m.isCollectionDependency);

  const code = [
    `/* ${config.namespace} custom elements */`,
    ...components.map((component) => {
      const exportName = dashToPascalCase(component.tagName);
      const importName = component.componentClassName;
      // typedefs for individual components can be found under paths like
      // $TYPES_DIR/components/my-component/my-component.d.ts
      //
      // To construct this path we:
      //
      // - get the relative path to the component's source file from the source directory
      // - join that relative path to the relative path from the `index.d.ts` file to the
      //   directory where typedefs are saved
      const componentSourceRelPath = relative(config.srcDir, component.sourceFilePath).replace('.tsx', '');
      const componentDTSPath = join(componentsTypeDirectoryRelPath, componentSourceRelPath);

      return `export { ${importName} as ${exportName} } from '${componentDTSPath}';`;
    }),
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
  ];

  const componentsDtsRelPath = relDts(outputTarget.dir!, join(typesDir, 'components.d.ts'));

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

  await Promise.all(
    components.map(async (cmp) => {
      const dtsCode = generateCustomElementType(componentsDtsRelPath, cmp);
      const fileName = `${cmp.tagName}.d.ts`;
      const filePath = join(outputTarget.dir!, fileName);
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
