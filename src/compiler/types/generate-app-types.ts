import type * as d from '../../declarations';
import { COMPONENTS_DTS_HEADER, COMPONENT_EVENTS_NAMESPACE, sortImportNames } from './types-utils';
import { generateComponentTypes } from './generate-component-types';
import { generateEventDetailTypes } from './generate-event-detail-types';
import { GENERATED_DTS, getComponentsDtsSrcFilePath } from '../output-targets/output-utils';
import { isAbsolute, relative, resolve } from 'path';
import { normalizePath } from '@utils';
import { updateReferenceTypeImports } from './update-import-refs';
import { updateStencilTypesImports } from './stencil-types';

/**
 * Generates and writes a `components.d.ts` file to disk. This file may be written to the `src` directory of a project,
 * or be written to a directory that is meant to be distributed (e.g. the output directory of `dist-custom-elements`).
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param destination the relative directory in the filesystem to write the type declaration file to
 * @returns `true` if the type declaration file written to disk has changed, `false` otherwise
 */
export const generateAppTypes = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  destination: string
): Promise<boolean> => {
  // only gather components that are still root ts files we've found and have component metadata
  // the compilerCtx cache may still have files that may have been deleted/renamed
  const timespan = buildCtx.createTimeSpan(`generated app types started`, true);
  const areTypesInternal = destination === 'src';

  // Generate d.ts files for component types
  let componentTypesFileContent = generateComponentTypesFile(config, buildCtx, areTypesInternal);

  // immediately write the components.d.ts file to disk and put it into fs memory
  let componentsDtsFilePath = getComponentsDtsSrcFilePath(config);

  if (!areTypesInternal) {
    componentsDtsFilePath = resolve(destination, GENERATED_DTS);
    componentTypesFileContent = updateStencilTypesImports(
      destination,
      componentsDtsFilePath,
      componentTypesFileContent
    );
  }

  const writeResults = await compilerCtx.fs.writeFile(componentsDtsFilePath, componentTypesFileContent, {
    immediateWrite: true,
  });
  const hasComponentsDtsChanged = writeResults.changedContent;

  const componentsDtsRelFileName = relative(config.rootDir, componentsDtsFilePath);
  if (hasComponentsDtsChanged) {
    config.logger.debug(`generateAppTypes: ${componentsDtsRelFileName} has changed`);
  }

  timespan.finish(`generated app types finished: ${componentsDtsRelFileName}`);
  return hasComponentsDtsChanged;
};

/**
 * Generates a `component.d.ts` file's contents, which contains the typings for all components in a Stencil project
 * @param config the Stencil configuration associated with the project being compiled
 * @param buildCtx the context associated with the current build
 * @param areTypesInternal determines if non-exported type definitions are being generated or not
 * @returns the contents of the `components.d.ts` file
 */
const generateComponentTypesFile = (config: d.Config, buildCtx: d.BuildCtx, areTypesInternal: boolean): string => {
  let typeImportData: d.TypesImportData = {};
  const c: string[] = [];
  const allTypes = new Map<string, number>();
  const components = buildCtx.components.filter((m) => !m.isCollectionDependency);

  const modules: d.TypesModule[] = [];
  const componentEventDetailTypes: d.TypesModule[] = [];

  for (const cmp of components) {
    typeImportData = updateReferenceTypeImports(typeImportData, allTypes, cmp, cmp.sourceFilePath);
    modules.push(generateComponentTypes(cmp, areTypesInternal));
    componentEventDetailTypes.push(generateEventDetailTypes(cmp));
  }

  c.push(COMPONENTS_DTS_HEADER);
  c.push(`import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";`);

  c.push(
    ...Object.keys(typeImportData).map((filePath) => {
      const typeData = typeImportData[filePath];
      let importFilePath: string;
      if (isAbsolute(filePath)) {
        importFilePath = normalizePath('./' + relative(config.srcDir, filePath)).replace(/\.(tsx|ts)$/, '');
      } else {
        importFilePath = filePath;
      }

      return `import { ${typeData
        .sort(sortImportNames)
        .map((td) => {
          if (td.localName === td.importName) {
            return `${td.importName}`;
          } else {
            return `${td.localName} as ${td.importName}`;
          }
        })
        .join(`, `)} } from "${importFilePath}";`;
    })
  );

  c.push(`export namespace Components {`);
  c.push(...modules.map((m) => `${m.component}`));
  c.push(`}`);

  c.push(`export namespace ${COMPONENT_EVENTS_NAMESPACE} {`);
  c.push(...componentEventDetailTypes.map((m) => `${m.component}`));
  c.push(`}`);

  c.push(`declare global {`);

  c.push(...modules.map((m) => m.element));

  c.push(`        interface HTMLElementTagNameMap {`);
  c.push(...modules.map((m) => `                "${m.tagName}": ${m.htmlElementName};`));
  c.push(`        }`);

  c.push(`}`);

  c.push(`declare namespace LocalJSX {`);
  c.push(...modules.map((m) => `  ${m.jsx}`));

  c.push(`        interface IntrinsicElements {`);
  c.push(...modules.map((m) => `              "${m.tagName}": ${m.tagNameAsPascal};`));
  c.push(`        }`);

  c.push(`}`);

  c.push(`export { LocalJSX as JSX };`);

  c.push(`declare module "@stencil/core" {`);
  c.push(`        export namespace JSX {`);
  c.push(`                interface IntrinsicElements {`);
  c.push(
    ...modules.map(
      (m) =>
        `                        "${m.tagName}": LocalJSX.${m.tagNameAsPascal} & JSXBase.HTMLAttributes<${m.htmlElementName}>;`
    )
  );
  c.push(`                }`);
  c.push(`        }`);
  c.push(`}`);

  return c.join(`\n`) + `\n`;
};
