import type * as d from '../../declarations';
import { dirname, resolve } from 'path';

/**
 * Find all referenced types by a component and add them to the importDataObj and return the newly
 * updated importDataObj
 *
 * @param importDataObj key/value of type import file, each value is an array of imported types
 * @param cmpMeta the metadata for the component that is referencing the types
 * @param filePath the path of the component file
 * @param config general config that all of stencil uses
 */
export const updateReferenceTypeImports = (
  importDataObj: d.TypesImportData,
  allTypes: Map<string, number>,
  cmp: d.ComponentCompilerMeta,
  filePath: string
) => {
  const updateImportReferences = updateImportReferenceFactory(allTypes, filePath);

  return [...cmp.properties, ...cmp.events, ...cmp.methods]
    .filter((cmpProp) => cmpProp.complexType && cmpProp.complexType.references)
    .reduce((obj, cmpProp) => {
      return updateImportReferences(obj, cmpProp.complexType.references);
    }, importDataObj);
};

const updateImportReferenceFactory = (allTypes: Map<string, number>, filePath: string) => {
  function getIncrementTypeName(name: string): string {
    const counter = allTypes.get(name);
    if (counter === undefined) {
      allTypes.set(name, 1);
      return name;
    }
    allTypes.set(name, counter + 1);
    return `${name}${counter}`;
  }

  return (obj: d.TypesImportData, typeReferences: { [key: string]: d.ComponentCompilerTypeReference }) => {
    Object.keys(typeReferences)
      .map((typeName) => {
        return [typeName, typeReferences[typeName]] as [string, d.ComponentCompilerTypeReference];
      })
      .forEach(([typeName, type]) => {
        let importFileLocation: string;

        // If global then there is no import statement needed
        if (type.location === 'global') {
          return;

          // If local then import location is the current file
        } else if (type.location === 'local') {
          importFileLocation = filePath;
        } else if (type.location === 'import') {
          importFileLocation = type.path;
        }

        // If this is a relative path make it absolute
        if (importFileLocation.startsWith('.')) {
          importFileLocation = resolve(dirname(filePath), importFileLocation);
        }

        obj[importFileLocation] = obj[importFileLocation] || [];

        // If this file already has a reference to this type move on
        if (obj[importFileLocation].find((df) => df.localName === typeName)) {
          return;
        }

        const newTypeName = getIncrementTypeName(typeName);
        obj[importFileLocation].push({
          localName: typeName,
          importName: newTypeName,
        });
      });

    return obj;
  };
};
