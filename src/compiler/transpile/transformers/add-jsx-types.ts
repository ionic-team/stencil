import { dashToPascalCase } from '../../../util/helpers';
import { normalizePath } from '../../util';
import { MEMBER_TYPE } from '../../../util/constants';
import { ComponentMeta, MembersMeta, MemberMeta, BuildConfig } from '../../../util/interfaces';

const METADATA_MEMBERS_TYPED = [ MEMBER_TYPE.Prop, MEMBER_TYPE.PropMutable ];

export interface ImportData {
  [key: string]: Array<{
    localName: string;
    importName?: string;
  }>;
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
export function updateReferenceTypeImports(importDataObj: ImportData, allTypes: { [key: string]: number }, cmpMeta: ComponentMeta, filePath: string, config: BuildConfig) {

  function getIncrememntTypeName(name: string): string {
    if (allTypes[name] == null) {
      allTypes[name] = 1;
      return name;
    }

    allTypes[name] += 1;
    return `${name}${allTypes[name]}`;
  }

  return Object.keys(cmpMeta.membersMeta)
  .filter((memberName) => {
    const member: MemberMeta = cmpMeta.membersMeta[memberName];

    return METADATA_MEMBERS_TYPED.indexOf(member.memberType) !== -1 &&
      member.attribType.typeReferences;
  })
  .reduce((obj, memberName) => {
    const member: MemberMeta = cmpMeta.membersMeta[memberName];
    Object.keys(member.attribType.typeReferences).forEach(typeName => {
      var type = member.attribType.typeReferences[typeName];
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
        importFileLocation = normalizePath(
          config.sys.path.resolve(
            config.sys.path.dirname(filePath),
            importFileLocation)
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
  }, importDataObj);
}

/**
 * Generate a string based on the types that are defined within a component.
 *
 * @param cmpMeta the metadata for the component that a type definition string is generated for
 * @param importPath the path of the component file
 */
export function createTypesAsString(cmpMeta: ComponentMeta, importPath: string) {
  const tagName = cmpMeta.tagNameMeta;
  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
  const interfaceName = `HTML${tagNameAsPascal}Element`;
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;
  const interfaceOptions = membersToInterfaceOptions(cmpMeta.membersMeta);
  (<MembersMeta>cmpMeta.membersMeta);

  return `
import {
  ${cmpMeta.componentClass} as ${dashToPascalCase(cmpMeta.tagNameMeta)}
} from './${importPath}';

declare global {
  interface ${interfaceName} extends ${tagNameAsPascal}, HTMLElement {
  }
  var ${interfaceName}: {
    prototype: ${interfaceName};
    new (): ${interfaceName};
  };
  interface HTMLElementTagNameMap {
    "${tagName}": ${interfaceName};
  }
  interface ElementTagNameMap {
    "${tagName}": ${interfaceName};
  }
  namespace JSX {
    interface IntrinsicElements {
      "${tagName}": JSXElements.${jsxInterfaceName};
    }
  }
  namespace JSXElements {
    export interface ${jsxInterfaceName} extends HTMLAttributes {
      ${Object.keys(interfaceOptions).map((key: string) => `
        ${key}?: ${interfaceOptions[key]}`
      )}
    }
  }
}
`;
}

function membersToInterfaceOptions(membersMeta: MembersMeta): { [key: string]: string } {
  const interfaceData = Object.keys(membersMeta)
    .filter((memberName) => {
      return METADATA_MEMBERS_TYPED.indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member: MemberMeta = membersMeta[memberName];
      obj[memberName] = member.attribType.text;

      return obj;
    }, <{ [key: string]: string }>{});

  return interfaceData;
}
