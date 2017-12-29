import { getJsPathBundlePlaceholder } from '../../../util/data-serialize';
import { ManifestBundle } from '../../../util/interfaces';


export default function bundleResolver(manifestBundle: ManifestBundle) {
  return {
    name: 'bundleResolverPlugin',

    resolveId(importee: string) {
      // get the module file uses the placeholder id
      const moduleFile = getModuleFileByPlaceholdId(manifestBundle, importee);
      if (moduleFile) {
        return moduleFile.jsFilePath;
      }

      return null;
    },
  };
}


function getModuleFileByPlaceholdId(manifestBundle: ManifestBundle, placeholderId: string) {
  return manifestBundle.moduleFiles.find(m => {
    if (m.cmpMeta && m.jsFilePath) {
      const jsPathBundlePlaceholder = getJsPathBundlePlaceholder(m.cmpMeta.tagNameMeta);
      return jsPathBundlePlaceholder === placeholderId;
    }
    return false;
  });
}
