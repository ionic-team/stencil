import type * as d from '../../declarations';
import { COMPONENTS_DTS_HEADER, sortImportNames } from './types-utils';
import { generateComponentTypes } from './generate-component-types';
import { GENERATED_DTS, getComponentsDtsSrcFilePath } from '../output-targets/output-utils';
import { isAbsolute, relative, resolve } from 'path';
import { normalizePath } from '@utils';
import { updateReferenceTypeImports } from './update-import-refs';
import { updateStencilTypesImports } from './stencil-types';

export const generateAppTypes = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  destination: string
) => {
  // only gather components that are still root ts files we've found and have component metadata
  // the compilerCtx cache may still have files that may have been deleted/renamed
  const timespan = buildCtx.createTimeSpan(`generated app types started`, true);
  const internal = destination === 'src';

  // Generate d.ts files for component types
  let componentTypesFileContent = generateComponentTypesFile(config, buildCtx, internal);

  // immediately write the components.d.ts file to disk and put it into fs memory
  let componentsDtsFilePath = getComponentsDtsSrcFilePath(config);

  if (!internal) {
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
 * Generate the component.d.ts file that contains types for all components
 * @param config the project build configuration
 * @param options compiler options from tsconfig
 */
const generateComponentTypesFile = (config: d.Config, buildCtx: d.BuildCtx, internal: boolean) => {
  let typeImportData: d.TypesImportData = {};
  const c: string[] = [];
  const allTypes = new Map<string, number>();
  const components = buildCtx.components.filter((m) => !m.isCollectionDependency);

  const modules: d.TypesModule[] = components.map((cmp) => {
    typeImportData = updateReferenceTypeImports(typeImportData, allTypes, cmp, cmp.sourceFilePath);
    return generateComponentTypes(cmp, internal);
  });

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

  c.push(`export namespace Components {\n${modules.map((m) => `${m.component}`).join('\n')}\n}`);

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
