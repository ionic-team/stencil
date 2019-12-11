import * as d from '../../declarations';
import { COMPONENTS_DTS_HEADER, indentTypes, sortImportNames } from './types-utils';
import { generateComponentTypes } from './generate-component-types';
import { GENERATED_DTS, getComponentsDtsSrcFilePath } from '../output-targets/output-utils';
import { updateReferenceTypeImports } from './update-import-refs';
import { normalizePath } from '@utils';
import { updateStencilTypesImports } from './stencil-types';


export const generateAppTypes = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destination: string) => {
  // only gather components that are still root ts files we've found and have component metadata
  // the compilerCtx cache may still have files that may have been deleted/renamed
  const timespan = buildCtx.createTimeSpan(`generated app types started`, true);

  // Generate d.ts files for component types
  let componentTypesFileContent = await generateComponentTypesFile(config, buildCtx, destination);

  // immediately write the components.d.ts file to disk and put it into fs memory
  let componentsDtsFilePath = getComponentsDtsSrcFilePath(config);

  if (destination !== 'src') {
    componentsDtsFilePath = config.sys.path.resolve(destination, GENERATED_DTS);
    componentTypesFileContent = updateStencilTypesImports(config.sys.path, destination, componentsDtsFilePath, componentTypesFileContent);
  }

  const { changedContent } = await compilerCtx.fs.writeFile(componentsDtsFilePath, componentTypesFileContent, { immediateWrite: true });

  timespan.finish(`generated app types finished: ${config.sys.path.relative(config.rootDir, componentsDtsFilePath)}`);
  return changedContent;
};


/**
 * Generate the component.d.ts file that contains types for all components
 * @param config the project build configuration
 * @param options compiler options from tsconfig
 */
const generateComponentTypesFile = async (config: d.Config, buildCtx: d.BuildCtx, _destination: string) => {
  let typeImportData: d.TypesImportData = {};
  const allTypes = new Map<string, number>();
  const needsJSXElementHack = buildCtx.components.some(cmp => cmp.isLegacy);
  const components = buildCtx.components.filter(m => !m.isCollectionDependency);

  const modules: d.TypesModule[] = components.map(cmp => {
    typeImportData = updateReferenceTypeImports(config, typeImportData, allTypes, cmp, cmp.sourceFilePath);
    return generateComponentTypes(cmp);
  });

  const jsxAugmentation = `
declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      ${modules.map(m => `'${m.tagName}': LocalJSX.${m.tagNameAsPascal} & JSXBase.HTMLAttributes<${m.htmlElementName}>;`).join('\n')}
    }
  }
}
`;

const jsxElementGlobal = !needsJSXElementHack ? '' : `
// Adding a global JSX for backcompatibility with legacy dependencies
export namespace JSX {
  export interface Element {}
}
`;

  const componentsFileString = `
export namespace Components {
  ${modules.map(m => `${m.component}`).join('\n').trim()}
}

declare global {
  ${jsxElementGlobal}
  ${modules.map(m => m.element).join('\n')}
  interface HTMLElementTagNameMap {
    ${modules.map(m => `'${m.tagName}': ${m.htmlElementName};`).join('\n')}
  }
}

declare namespace LocalJSX {
  ${modules.map(m => `${m.jsx}`).join('\n').trim()}

  interface IntrinsicElements {
    ${modules.map(m => `'${m.tagName}': ${m.tagNameAsPascal};`).join('\n')}
  }
}

export { LocalJSX as JSX };

${jsxAugmentation}
`;

  const typeImportString = Object.keys(typeImportData).map(filePath => {
    const typeData = typeImportData[filePath];
    let importFilePath: string;
    if (config.sys.path.isAbsolute(filePath)) {
      importFilePath = normalizePath('./' +
        config.sys.path.relative(config.srcDir, filePath)
      ).replace(/\.(tsx|ts)$/, '');
    } else {
      importFilePath = filePath;
    }

    return `import {
${typeData.sort(sortImportNames).map(td => {
  if (td.localName === td.importName) {
    return `${td.importName},`;
  } else {
    return `${td.localName} as ${td.importName},`;
  }
})
.join('\n')
}
} from '${importFilePath}';`;

  }).join('\n');

  const code = `
import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
${typeImportString}
${componentsFileString}
`;
  return `${COMPONENTS_DTS_HEADER}

${indentTypes(code)}`;
};
