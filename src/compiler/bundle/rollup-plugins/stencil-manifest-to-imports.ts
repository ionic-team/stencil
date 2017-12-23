import { ManifestBundle, ModuleFile } from '../../../util/interfaces';
import { dashToPascalCase } from '../../../util/helpers';
import { normalizePath } from '../../util';


export default function stencilManifestsToInputs(manifestBundle?: ManifestBundle) {

  let bundleEntryContents = '';
  let entry = manifestBundle.cacheKey;

  if (manifestBundle) {
    bundleEntryContents = createInMemoryBundleInput(manifestBundle.moduleFiles);
  }

  return {
    name: 'stencil-manifest-to-imports',
    options(options: { [key: string]: any }) {
      if (options.manifestBundle && options.input !== entry) {
        bundleEntryContents = createInMemoryBundleInput(manifestBundle.moduleFiles);
      }
      options.input = entry;
    },
    resolveId(id: string): string | void {
      if (id === entry) {
        return entry;
      }
    },
    load(id: string): string | void {
      if (id === entry) {
        return bundleEntryContents;
      }
    }
  };
}

function createInMemoryBundleInput(moduleFiles: ModuleFile[]) {
  const entryFileLines: string[] = [];
  const moduleJsFilePaths: string[] = [];

  moduleFiles
    .sort((a, b) => {
      if (a.cmpMeta.tagNameMeta.toLowerCase() < b.cmpMeta.tagNameMeta.toLowerCase()) return -1;
      if (a.cmpMeta.tagNameMeta.toLowerCase() > b.cmpMeta.tagNameMeta.toLowerCase()) return 1;
      return 0;

    }).forEach(moduleFile => {
      // create a full path to the modules to import
      const importPath = moduleFile.jsFilePath;
      moduleJsFilePaths.push(importPath);
      const asName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

      // manually create the content for our temporary entry file for the bundler
      entryFileLines.push(generateBundleImport(moduleFile.cmpMeta.componentClass, asName, importPath));

      // export map should always use UPPER CASE tag name
      entryFileLines.push(generateBundleExport(moduleFile.cmpMeta.tagNameMeta, asName));
    });

  // create the entry file for the bundler
  return entryFileLines.join('\n');
}


export function generateBundleImport(cmpClassName: string, asName: string, importPath: string) {
  return `import { ${cmpClassName} as ${asName} } from "${normalizePath(importPath)}";`;
}


export function generateBundleExport(tagName: string, asName: string) {
  return `exports['${tagName.toLowerCase()}'] = ${asName};`;
}
