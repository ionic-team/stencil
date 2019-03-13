import * as d from '../../declarations';
import { COMPONENTS_DTS_HEADER, indentTypes, sortImportNames } from './types-utils';
import { generateComponentTypes } from './generate-component-types';
import { GENERATED_DTS, getComponentsDtsSrcFilePath, getComponentsFromModules } from '../output-targets/output-utils';
import { updateReferenceTypeImports } from './update-import-refs';
import { normalizePath, sortBy } from '@utils';
import { updateStencilTypesImports } from './stencil-types';


export async function generateAppTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destination: string) {
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

  await compilerCtx.fs.writeFile(componentsDtsFilePath, componentTypesFileContent, { immediateWrite: true });

  timespan.finish(`generated app types finished: ${config.sys.path.relative(config.rootDir, componentsDtsFilePath)}`);
}


/**
 * Generate the component.d.ts file that contains types for all components
 * @param config the project build configuration
 * @param options compiler options from tsconfig
 */
async function generateComponentTypesFile(config: d.Config, buildCtx: d.BuildCtx, destination: string) {
  let typeImportData: d.TypesImportData = {};
  const allTypes = new Map<string, number>();
  const isSrcTypes = destination === 'src';
  const components = sortBy(
    getComponentsFromModules(buildCtx.moduleFiles).filter(cmp => isSrcTypes || !cmp.isCollectionDependency),
    cmp => cmp.tagName
  );

  const modules: d.TypesModule[] = components.map(cmp => {
    const importPath = normalizePath(config.sys.path.relative(config.srcDir, cmp.sourceFilePath)
    .replace(/\.(tsx|ts)$/, ''));
    typeImportData = updateReferenceTypeImports(config, typeImportData, allTypes, cmp, cmp.sourceFilePath);

    return generateComponentTypes(cmp, importPath);
  });

  const jsxAugmentation = !isSrcTypes ? '' : `
declare module "@stencil/core" {
  export namespace JSX {
    interface ElementInterfaces extends LocalJSX.ElementInterfaces {}
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}
`;

  const componentsFileString = `
export namespace Components {
  ${modules.map(m => `${m.StencilComponents}${m.JSXElements}`).join('\n')}
}

interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
  forceUpdate(): void;
}

declare namespace LocalJSX {
  interface ElementInterfaces {
  ${modules.map(m => `'${m.tagNameAsPascal}': Components.${m.tagNameAsPascal};`).join('\n')}
  }

  interface IntrinsicElements {
  ${modules.map(m => m.IntrinsicElements).join('\n')}
  }
}
export { LocalJSX as JSX };
${jsxAugmentation}
declare global {
  ${modules.map(m => m.global).join('\n')}
  interface HTMLElementTagNameMap {
  ${modules.map(m => m.HTMLElementTagNameMap).join('\n')}
  }

  interface ElementTagNameMap {
  ${modules.map(m => m.ElementTagNameMap).join('\n')}
  }
}
`;

  const typeImportString = Object.keys(typeImportData).reduce((finalString: string, filePath: string) => {

    const typeData = typeImportData[filePath];
    let importFilePath: string;
    if (config.sys.path.isAbsolute(filePath)) {
      importFilePath = normalizePath('./' +
        config.sys.path.relative(config.srcDir, filePath)
      ).replace(/\.(tsx|ts)$/, '');
    } else {
      importFilePath = filePath;
    }
    finalString +=
`import {
${typeData.sort(sortImportNames).map(td => {
  if (td.localName === td.importName) {
    return `${td.importName},`;
  } else {
    return `${td.localName} as ${td.importName},`;
  }
}).join('\n')}
} from '${importFilePath}';\n`;

    return finalString;
  }, '');

  const code = `
import { JSXElements } from '@stencil/core';

${typeImportString}
${componentsFileString}
`;
  return `${COMPONENTS_DTS_HEADER}

${indentTypes(code)}`;
}
