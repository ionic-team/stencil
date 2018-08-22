import * as d from '../../declarations';
import { appendDefineCustomElementsType } from '../distribution/dist-esm';
import { captializeFirstLetter, dashToPascalCase } from '../../util/helpers';
import { GENERATED_DTS, getComponentsDtsSrcFilePath } from '../distribution/distribution';
import { MEMBER_TYPE } from '../../util/constants';
import { normalizePath, pathJoin } from '../util';
import { CompilerUpgrade, validateCollectionCompatibility } from '../collections/collection-compatibility';

export async function generateComponentTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destination = 'src') {
  // only gather components that are still root ts files we've found and have component metadata
  // the compilerCtx cache may still have files that may have been deleted/renamed
  const metadata: d.ModuleFile[] = compilerCtx.rootTsFiles
    .slice()
    .sort()
    .map(tsFilePath => compilerCtx.moduleFiles[tsFilePath])
    .filter(moduleFile => moduleFile && moduleFile.cmpMeta);

  // Generate d.ts files for component types
  let componentTypesFileContent = await generateComponentTypesFile(config, compilerCtx, metadata, destination);

  // get all the output targets that require types
  const typesOutputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => !!o.typesDir);

  if (typesOutputTargets.length > 0) {
    // we're building a dist output target(s)
    // so let's also add the types for the defineCustomElements
    componentTypesFileContent = appendDefineCustomElementsType(componentTypesFileContent);
  }

  // immediately write the generated.d.ts file to disk and put it into fs memory
  let componentsDtsFilePath = getComponentsDtsSrcFilePath(config);

  if (destination !== 'src') {
    componentsDtsFilePath = config.sys.path.resolve(destination, GENERATED_DTS);
  }

  // DEPRECATED: 2018/08/16
  const fileExists = await compilerCtx.fs.access(pathJoin(config, config.srcDir, 'components.d.ts'));
  if (fileExists) {
    config.logger.warn('As of Stencil 0.12.0 components.d.ts was renamed to generated.d.ts. Please delete the components.d.ts and update any references to it.');
  }

  await compilerCtx.fs.writeFile(componentsDtsFilePath, componentTypesFileContent, { immediateWrite: true });
  buildCtx.debug(`generated ${config.sys.path.relative(config.rootDir, componentsDtsFilePath)}`);
}


/**
 * Generate the component.d.ts file that contains types for all components
 * @param config the project build configuration
 * @param options compiler options from tsconfig
 */
async function generateComponentTypesFile(config: d.Config, compilerCtx: d.CompilerCtx, metadata: d.ModuleFile[], destination: string) {
  let typeImportData: ImportData = {};
  const allTypes: { [key: string]: number } = {};
  const defineGlobalIntrinsicElements = destination === 'src';

  const collectionTypesImports = await getCollectionsTypeImports(config, compilerCtx, defineGlobalIntrinsicElements);
  const intrinsicImports: string[] = [];
  const collectionTypesImportsString = collectionTypesImports.map((cti) => {
    if (cti.includeIntrinsicElements) {
      const intrinsicImportAlias = 'DependentIntrinsicElements' + (intrinsicImports.length + 1);
      intrinsicImports.push(intrinsicImportAlias);
      return `import { LocalIntrinsicElements as ${intrinsicImportAlias} } from '${cti.pkgName}';`;
    }
    return `import '${cti.pkgName}'`;
  })
  .join('\n');

  const modules = metadata.map(moduleFile => {
    const cmpMeta = moduleFile.cmpMeta;
    const importPath = normalizePath(config.sys.path.relative(config.srcDir, moduleFile.sourceFilePath)
        .replace(/\.(tsx|ts)$/, ''));

    typeImportData = updateReferenceTypeImports(config, typeImportData, allTypes, cmpMeta, moduleFile.sourceFilePath);
    return createTypesAsString(cmpMeta, importPath);
  });

  const componentsFileString = `
export namespace StencilComponents {
${modules.map(m => {
    return `${m.StencilComponents}${m.JSXElements}`;
  })
  .join('\n')}
}

export interface LocalIntrinsicElements {
${modules.map(m => m.IntrinsicElements).join('\n')}
}

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
  const code = `/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
/* tslint:disable */

import { JSXElements } from '@stencil/core';

${collectionTypesImportsString}
${typeImportString}
${componentsFileString}
${defineGlobalIntrinsicElements ? generateLocalTypesFile(intrinsicImports) : ''}
`;
  return indentTypes(code);
}

function generateLocalTypesFile(intrinsicImports: string[]) {
  const intrinsicElementInterfaces = [
    'LocalIntrinsicElements',
    'DefaultIntrinsicElements',
    ...intrinsicImports
  ];

  return `
import { DefaultIntrinsicElements } from '@stencil/core';

declare global {
  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends ${intrinsicElementInterfaces.join(', ')} {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends JSXElements.HTMLAttributes {}
}
`;
}

function indentTypes(code: string) {
  const INDENT_STRING = '  ';
  let indentSize = 0;

  return code
    .split('\n')
    .map(cl => {
      let newCode = cl.trim();
      if (newCode.length === 0) {
        return newCode;
      }
      if (newCode.startsWith('}') && indentSize > 0) {
        indentSize -= 1;
      }
      newCode = INDENT_STRING.repeat(indentSize) + newCode;
      if (newCode.endsWith('{')) {
        indentSize += 1;
      }
      return newCode;
    })
    .join('\n');
}


function sortImportNames(a: MemberNameData, b: MemberNameData) {
  const aName = a.localName.toLowerCase();
  const bName = b.localName.toLowerCase();

  if (aName < bName) return -1;
  if (aName > bName) return 1;
  if (a.localName < b.localName) return -1;
  if (a.localName > b.localName) return 1;
  return 0;
}


/**
 * Find all referenced types by a component and add them to the importDataObj and return the newly
 * updated importDataObj
 *
 * @param importDataObj key/value of type import file, each value is an array of imported types
 * @param cmpMeta the metadata for the component that is referencing the types
 * @param filePath the path of the component file
 * @param config general config that all of stencil uses
 */
function updateReferenceTypeImports(config: d.Config, importDataObj: ImportData, allTypes: { [key: string]: number }, cmpMeta: d.ComponentMeta, filePath: string) {


  const updateImportReferences = updateImportReferenceFactory(config, allTypes, filePath);

  importDataObj = Object.keys(cmpMeta.membersMeta)
  .filter((memberName) => {
    const member: d.MemberMeta = cmpMeta.membersMeta[memberName];

    return [ MEMBER_TYPE.Prop, MEMBER_TYPE.PropMutable, MEMBER_TYPE.Method ].indexOf(member.memberType) !== -1 &&
      member.attribType.typeReferences;
  })
  .reduce((obj, memberName) => {
    const member: d.MemberMeta = cmpMeta.membersMeta[memberName];
    return updateImportReferences(obj, member.attribType.typeReferences);
  }, importDataObj);


  cmpMeta.eventsMeta
  .filter((meta: d.EventMeta) => {
    return meta.eventType && meta.eventType.typeReferences;
  })
  .reduce((obj, meta) => {
    return updateImportReferences(obj, meta.eventType.typeReferences);
  }, importDataObj);

  return importDataObj;
}

function updateImportReferenceFactory(config: d.Config, allTypes: { [key: string]: number }, filePath: string) {
  function getIncrememntTypeName(name: string): string {
    if (allTypes[name] == null) {
      allTypes[name] = 1;
      return name;
    }

    allTypes[name] += 1;
    return `${name}${allTypes[name]}`;
  }

  return (obj: ImportData, typeReferences: { [key: string]: d.AttributeTypeReference }) => {
    Object.keys(typeReferences).map(typeName => {
      return [typeName, typeReferences[typeName]] as [string, d.AttributeTypeReference];
    }).forEach(([typeName, type]) => {
      let importFileLocation: string;

      // If global then there is no import statement needed
      if (type.referenceLocation === 'global') {
        return;

      // If local then import location is the current file
      } else if (type.referenceLocation === 'local') {
        importFileLocation = filePath;

      } else if (type.referenceLocation === 'import') {
        importFileLocation = type.importReferenceLocation;
      }

      // If this is a relative path make it absolute
      if (importFileLocation.startsWith('.')) {
        importFileLocation =
          config.sys.path.resolve(
            config.sys.path.dirname(filePath),
            importFileLocation
          );
      }

      obj[importFileLocation] = obj[importFileLocation] || [];

      // If this file already has a reference to this type move on
      if (obj[importFileLocation].find(df => df.localName === typeName)) {
        return;
      }

      const newTypeName = getIncrememntTypeName(typeName);
      obj[importFileLocation].push({
        localName: typeName,
        importName: newTypeName
      });
    });

    return obj;
  };
}


/**
 * Generate a string based on the types that are defined within a component.
 *
 * @param cmpMeta the metadata for the component that a type definition string is generated for
 * @param importPath the path of the component file
 */
export function createTypesAsString(cmpMeta: d.ComponentMeta, _importPath: string) {
  const tagName = cmpMeta.tagNameMeta;
  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
  const interfaceName = `HTML${tagNameAsPascal}Element`;
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;
  const propAttributes = membersToPropAttributes(cmpMeta.membersMeta);
  const methodAttributes = membersToMethodAttributes(cmpMeta.membersMeta);
  const eventAttributes = membersToEventAttributes(cmpMeta.eventsMeta);
  const stencilComponentAttributes = attributesToMultiLineString({
    ...propAttributes,
    ...methodAttributes
  }, false);
  const stencilComponentAttributesOptional = attributesToMultiLineString({
    ...propAttributes,
    ...eventAttributes
  }, true);

  return {
    StencilComponents: `
interface ${tagNameAsPascal} {${
  stencilComponentAttributes !== '' ? `\n${stencilComponentAttributes}\n` : ''
}}`,
    JSXElements: `
interface ${jsxInterfaceName} extends JSXElements.HTMLAttributes {${
  stencilComponentAttributesOptional !== '' ? `\n${stencilComponentAttributesOptional}\n` : ''
}}`,
    global: `
interface ${interfaceName} extends StencilComponents.${tagNameAsPascal}, HTMLStencilElement {}
var ${interfaceName}: {
  prototype: ${interfaceName};
  new (): ${interfaceName};
};`,
    HTMLElementTagNameMap: `'${tagName}': ${interfaceName}`,
    ElementTagNameMap: `'${tagName}': ${interfaceName};`,
    IntrinsicElements: `'${tagName}': StencilComponents.${jsxInterfaceName};`
  };
}

interface TypeInfo {
  [key: string]: {
    type: string;
    jsdoc?: string;
  };
}

function attributesToMultiLineString(attributes: TypeInfo, optional = true, paddingString = '') {
  if (Object.keys(attributes).length === 0) {
    return '';
  }

  return Object.keys(attributes)
    .sort()
    .reduce((fullList, key) => {
      if (attributes[key].jsdoc) {
        fullList.push(`/**`);
        fullList.push(` * ${attributes[key].jsdoc.replace(/\r?\n|\r/g, ' ')}`);
        fullList.push(` */`);
      }
      fullList.push(`'${key}'${optional ? '?' : '' }: ${attributes[key].type};`);
      return fullList;
    }, <string[]>[])
    .map(item => `${paddingString}${item}`)
    .join(`\n`);
}

function membersToPropAttributes(membersMeta: d.MembersMeta): TypeInfo {
  const interfaceData = Object.keys(membersMeta)
    .filter((memberName) => {
      return [ MEMBER_TYPE.Prop, MEMBER_TYPE.PropMutable ].indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member: d.MemberMeta = membersMeta[memberName];
      obj[memberName] = {
        type: member.attribType.text,
      };

      if (member.jsdoc) {
        obj[memberName].jsdoc = member.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}

function membersToMethodAttributes(membersMeta: d.MembersMeta): TypeInfo {
  const interfaceData = Object.keys(membersMeta)
    .filter((memberName) => {
      return [ MEMBER_TYPE.Method ].indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member: d.MemberMeta = membersMeta[memberName];
      obj[memberName] = {
        type: member.attribType.text,
      };

      if (member.jsdoc) {
        obj[memberName].jsdoc = member.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}


function membersToEventAttributes(eventMetaList: d.EventMeta[]): TypeInfo {
  const interfaceData = eventMetaList
    .reduce((obj, eventMetaObj) => {
      const memberName = `on${captializeFirstLetter(eventMetaObj.eventName)}`;
      const eventType = (eventMetaObj.eventType) ? `CustomEvent<${eventMetaObj.eventType.text}>` : `CustomEvent`;
      obj[memberName] = {
        type: `(event: ${eventType}) => void`, // TODO this is not good enough
      };

      if (eventMetaObj.jsdoc) {
        obj[memberName].jsdoc = eventMetaObj.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}


async function getCollectionsTypeImports(config: d.Config, compilerCtx: d.CompilerCtx, includeIntrinsicElements = false) {
  const collections = compilerCtx.collections.map(collection => {
    const upgrades = validateCollectionCompatibility(config, collection);
    const shouldIncludeLocalIntrinsicElements = includeIntrinsicElements && upgrades.indexOf(CompilerUpgrade.Add_Local_Intrinsic_Elements) !== -1;
    return getCollectionTypesImport(config, compilerCtx, collection, shouldIncludeLocalIntrinsicElements);
  });

  const collectionTypes = await Promise.all(collections);
  return collectionTypes;
}


async function getCollectionTypesImport(config: d.Config, compilerCtx: d.CompilerCtx, collection: d.Collection, includeIntrinsicElements = false) {
  let typeImport = null;

  try {
    const collectionDir = collection.moduleDir;
    const collectionPkgJson = config.sys.path.join(collectionDir, 'package.json');

    const pkgJsonStr = await compilerCtx.fs.readFile(collectionPkgJson);
    const pkgData: d.PackageJsonData = JSON.parse(pkgJsonStr);

    if (pkgData.types && pkgData.collection) {
      typeImport = {
        pkgName: pkgData.name,
        includeIntrinsicElements
      };
    }

  } catch (e) {
    config.logger.debug(`getCollectionTypesImport: ${e}`);
  }

  if (typeImport == null) {
    config.logger.debug(`unabled to find "${collection.collectionName}" collection types`);
  }

  return typeImport;
}


export interface ImportData {
  [key: string]: MemberNameData[];
}

export interface MemberNameData {
  localName: string;
  importName?: string;
}
