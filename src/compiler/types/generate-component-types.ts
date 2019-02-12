import * as d from '@declarations';
import { captializeFirstLetter, dashToPascalCase } from '@utils';
import { CompilerUpgrade, validateCollectionCompatibility } from '../collections/collection-compatibility';
import { GENERATED_DTS, getComponentsDtsSrcFilePath } from '../output-targets/output-utils';
import { isDocsPublic, normalizePath } from '@utils';
import { logger, sys } from '@sys';
import { MEMBER_TYPE } from '@utils';
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
  return `${HEADER}

${indentTypes(code)}`;
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
function updateReferenceTypeImports(importDataObj: ImportData, allTypes: { [key: string]: number }, cmp: d.ComponentCompilerMeta, filePath: string) {
  const updateImportReferences = updateImportReferenceFactory(allTypes, filePath);

  importDataObj = cmp.properties
    .filter(cmpProp => cmpProp.complexType && cmpProp.complexType.references)
    .reduce((obj, cmpProp) => {
      return updateImportReferences(obj, cmpProp.complexType.references);
    }, importDataObj);

  // TODO!!
  // cmpMeta.eventsMeta
  //   .filter((meta: d.EventMeta) => {
  //     return meta.eventType && meta.eventType.typeReferences;
  //   })
  //   .reduce((obj, meta) => {
  //     return updateImportReferences(obj, meta.eventType.typeReferences);
  //   }, importDataObj);

  return importDataObj;
}

export function updateImportReferenceFactory(allTypes: { [key: string]: number }, filePath: string) {
  function getIncrememntTypeName(name: string): string {
    if (allTypes[name] == null) {
      allTypes[name] = 1;
      return name;
    }

    allTypes[name] += 1;
    return `${name}${allTypes[name]}`;
  }

  return (obj: ImportData, typeReferences: { [key: string]: d.ComponentCompilerTypeReference }) => {
    Object.keys(typeReferences).map(typeName => {
      return [typeName, typeReferences[typeName]] as [string, d.ComponentCompilerTypeReference];
    }).forEach(([typeName, type]) => {
      let importFileLocation: string;

      // If global then there is no import statement needed
      if (type.location === 'global') {
        return;

      // If local then import location is the current file
      } else if (type.location === 'local') {
        importFileLocation = filePath;

      } else if (type.location === 'import') {
        importFileLocation = type.location;
      }

      // If this is a relative path make it absolute
      if (importFileLocation.startsWith('.')) {
        importFileLocation =
          sys.path.resolve(
            sys.path.dirname(filePath),
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
export function createTypesAsString(cmpMeta: d.ComponentCompilerMeta, _importPath: string): StencilModule {
  const tagName = cmpMeta.tagName;
  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagName);
  const interfaceName = `HTML${tagNameAsPascal}Element`;
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;
  // const propAttributes = membersToPropAttributes(cmpMeta.membersMeta);
  // const methodAttributes = membersToMethodAttributes(cmpMeta.membersMeta);
  // const eventAttributes = membersToEventAttributes(cmpMeta.eventsMeta);
  const stencilComponentAttributes = attributesToMultiLineString({
    // ...propAttributes,
    // ...methodAttributes
  }, false);
  const stencilComponentJSXAttributes = attributesToMultiLineString({
    // ...propAttributes,
    // ...eventAttributes
  }, true);

  return {
    tagNameAsPascal: tagNameAsPascal,
    StencilComponents: `
interface ${tagNameAsPascal} {${
  stencilComponentAttributes !== '' ? `\n${stencilComponentAttributes}\n` : ''
}}`,
    JSXElements: `
interface ${jsxInterfaceName} extends JSXElements.HTMLAttributes {${
  stencilComponentJSXAttributes !== '' ? `\n${stencilComponentJSXAttributes}\n` : ''
}}`,
    global: `
interface ${interfaceName} extends Components.${tagNameAsPascal}, HTMLElement {}
var ${interfaceName}: {
  prototype: ${interfaceName};
  new (): ${interfaceName};
};`,
    HTMLElementTagNameMap: `'${tagName}': ${interfaceName}`,
    ElementTagNameMap: `'${tagName}': ${interfaceName};`,
    IntrinsicElements: `'${tagName}': Components.${jsxInterfaceName};`
  };
}

interface StencilModule {
  tagNameAsPascal: string;
  StencilComponents: string;
  JSXElements: string;
  global: string;
  HTMLElementTagNameMap: string;
  ElementTagNameMap: string;
  IntrinsicElements: string;
}

interface TypeInfo {
  [key: string]: {
    type: string;
    optional: boolean;
    required: boolean;
    public: boolean;
    jsdoc?: string;
  };
}

function attributesToMultiLineString(attributes: TypeInfo, jsxAttributes: boolean, paddingString = '') {
  if (Object.keys(attributes).length === 0) {
    return '';
  }

  return Object.keys(attributes)
    .sort()
    .reduce((fullList, key) => {
      const type = attributes[key];
      if (type.public || !jsxAttributes) {
        if (type.jsdoc) {
          fullList.push(`/**`);
          fullList.push(` * ${type.jsdoc.replace(/\r?\n|\r/g, ' ')}`);
          fullList.push(` */`);
        }
        const optional = (jsxAttributes)
          ? !type.required
          : type.optional;

        fullList.push(`'${key}'${ optional ? '?' : '' }: ${type.type};`);
      }
      return fullList;
    }, <string[]>[])
    .map(item => `${paddingString}${item}`)
    .join(`\n`);
}

export function membersToPropAttributes(membersMeta: d.MembersMeta): TypeInfo {
  const interfaceData = Object.keys(membersMeta)
    .filter((memberName) => {
      return [ MEMBER_TYPE.Prop ].indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member: d.MemberMeta = membersMeta[memberName];
      obj[memberName] = {
        type: member.attribType.text,
        optional: member.attribType.optional,
        required: member.attribType.required,
        public: isDocsPublic(member.jsdoc)
      };

      if (member.jsdoc) {
        obj[memberName].jsdoc = member.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}

export function membersToMethodAttributes(membersMeta: d.MembersMeta): TypeInfo {
  const interfaceData = Object.keys(membersMeta)
    .filter((memberName) => {
      return [ MEMBER_TYPE.Method ].indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member: d.MemberMeta = membersMeta[memberName];
      obj[memberName] = {
        type: member.attribType.text,
        optional: false,
        required: false,
        public: isDocsPublic(member.jsdoc)
      };

      if (member.jsdoc) {
        obj[memberName].jsdoc = member.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}


export function membersToEventAttributes(eventMetaList: d.EventMeta[]): TypeInfo {
  const interfaceData = eventMetaList
    .reduce((obj, eventMetaObj) => {
      const memberName = `on${captializeFirstLetter(eventMetaObj.eventName)}`;
      const eventType = (eventMetaObj.eventType) ? `CustomEvent<${eventMetaObj.eventType.text}>` : `CustomEvent`;
      obj[memberName] = {
        type: `(event: ${eventType}) => void`, // TODO this is not good enough
        optional: false,
        required: false,
        public: isDocsPublic(eventMetaObj.jsdoc)
      };

      if (eventMetaObj.jsdoc) {
        obj[memberName].jsdoc = eventMetaObj.jsdoc.documentation;
      }

      return obj;
    }, <TypeInfo>{});

  return interfaceData;
}


async function getCollectionsTypeImports(compilerCtx: d.CompilerCtx, includeIntrinsicElements = false) {
  const collections = compilerCtx.collections.map(collection => {
    const upgrades = validateCollectionCompatibility(collection);
    const shouldIncludeLocalIntrinsicElements = includeIntrinsicElements && upgrades.indexOf(CompilerUpgrade.Add_Local_Intrinsic_Elements) !== -1;
    return getCollectionTypesImport(compilerCtx, collection, shouldIncludeLocalIntrinsicElements);
  });

  const collectionTypes = await Promise.all(collections);
  return collectionTypes;
}


async function getCollectionTypesImport(compilerCtx: d.CompilerCtx, collection: d.Collection, includeIntrinsicElements = false) {
  let typeImport = null;

  try {
    const collectionDir = collection.moduleDir;
    const collectionPkgJson = sys.path.join(collectionDir, 'package.json');

    const pkgJsonStr = await compilerCtx.fs.readFile(collectionPkgJson);
    const pkgData: d.PackageJsonData = JSON.parse(pkgJsonStr);

    if (pkgData.types && pkgData.collection) {
      typeImport = {
        pkgName: pkgData.name,
        includeIntrinsicElements
      };
    }

  } catch (e) {
    logger.debug(`getCollectionTypesImport: ${e}`);
  }

  if (typeImport == null) {
    logger.debug(`unabled to find "${collection.collectionName}" collection types`);
  }

  return typeImport;
}

const HEADER = `/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */`;


export interface ImportData {
  [key: string]: MemberNameData[];
}

export interface MemberNameData {
  localName: string;
  importName?: string;
}
