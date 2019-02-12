import * as d from '@declarations';
import { COMPONENTS_DTS_HEADER, ImportData, StencilModule, indentTypes, sortImportNames } from './types-utils';
import { createTypesAsString } from './component-types-string';
import { GENERATED_DTS, getComponentsDtsSrcFilePath } from '../output-targets/output-utils';
import { getCollectionsTypeImports, updateReferenceTypeImports } from './update-import-refs';
import { normalizePath } from '@utils';
import { sys } from '@sys';
import { updateStencilTypesImports } from './stencil-types';


export async function generateComponentTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destination: string) {
  // only gather components that are still root ts files we've found and have component metadata
  // the compilerCtx cache may still have files that may have been deleted/renamed
  const moduleFiles = compilerCtx.rootTsFiles
    .slice()
    .sort()
    .map(tsFilePath => compilerCtx.moduleMap.get(tsFilePath))
    .filter(m => m && m.cmps.length > 0);

  // Generate d.ts files for component types
  let componentTypesFileContent = await generateComponentTypesFile(config, compilerCtx, moduleFiles, destination);

  // immediately write the components.d.ts file to disk and put it into fs memory
  let componentsDtsFilePath = getComponentsDtsSrcFilePath(config);

  if (destination !== 'src') {
    componentsDtsFilePath = sys.path.resolve(destination, GENERATED_DTS);
    componentTypesFileContent = updateStencilTypesImports(destination, componentsDtsFilePath, componentTypesFileContent);
  }

  await compilerCtx.fs.writeFile(componentsDtsFilePath, componentTypesFileContent, { immediateWrite: true });
  buildCtx.debug(`generated ${sys.path.relative(config.rootDir, componentsDtsFilePath)}`);
}


/**
 * Generate the component.d.ts file that contains types for all components
 * @param config the project build configuration
 * @param options compiler options from tsconfig
 */
async function generateComponentTypesFile(config: d.Config, compilerCtx: d.CompilerCtx, moduleFiles: d.Module[], destination: string) {
  let typeImportData: ImportData = {};
  const allTypes: { [key: string]: number } = {};
  const defineGlobalIntrinsicElements = destination === 'src';

  const collectionTypesImports = await getCollectionsTypeImports(compilerCtx, defineGlobalIntrinsicElements);
  const collectionTypesImportsString = collectionTypesImports.map(cti => {
    return `import '${cti.pkgName}';`;
  })
  .join('\n');

  const modules = moduleFiles.reduce((modules, moduleFile) => {
    moduleFile.cmps.forEach(cmp => {
      const importPath = normalizePath(sys.path.relative(config.srcDir, moduleFile.sourceFilePath)
          .replace(/\.(tsx|ts)$/, ''));

      typeImportData = updateReferenceTypeImports(typeImportData, allTypes, cmp, moduleFile.sourceFilePath);
      const cmpTypes = createTypesAsString(cmp, importPath);
      modules.push(cmpTypes);
    });
    return modules;
  }, [] as StencilModule[]);

  const componentsFileString = `
export namespace Components {
${modules.map(m => {
  return `${m.StencilComponents}${m.JSXElements}`;
})
.join('\n')}
}

declare global {
interface StencilElementInterfaces {
${modules.map(m => `'${m.tagNameAsPascal}': Components.${m.tagNameAsPascal};`).join('\n')}
}

interface StencilIntrinsicElements {
${modules.map(m => m.IntrinsicElements).join('\n')}
}

${modules.map(m => m.global).join('\n')}

interface HTMLElementTagNameMap {
${modules.map(m => m.HTMLElementTagNameMap).join('\n')}
}

interface ElementTagNameMap {
${modules.map(m => m.ElementTagNameMap).join('\n')}
}
`;

  const typeImportString = Object.keys(typeImportData).reduce((finalString: string, filePath: string) => {

    const typeData = typeImportData[filePath];
    let importFilePath: string;
    if (sys.path.isAbsolute(filePath)) {
      importFilePath = normalizePath('./' +
        sys.path.relative(config.srcDir, filePath)
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

${collectionTypesImportsString}
${typeImportString}
${componentsFileString}
}
`;
  return `${COMPONENTS_DTS_HEADER}

${indentTypes(code)}`;
}
