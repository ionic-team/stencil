import { Bundle, Config } from '../../../util/interfaces';
import { dashToPascalCase } from '../../../util/helpers';

export default function bundleEntryFile(config: Config, bundles: Bundle[]) {

  return {
    name: 'bundleEntryFilePlugin',

    resolveId(importee: string) {
      const bundle = bundles.find(b => b.entryKey === importee);
      if (bundle) {
        return bundle.entryKey;
      }

      return null;
    },

    load(id: string) {
      const bundle = bundles.find(b => b.entryKey === id);
      if (bundle) {
        return createEntryPointString(config, bundle);
      }

      return null;
    }
  };
}

export function createEntryPointString(config: Config, bundle: Bundle): string {
  const path = config.sys.path;

  return bundle.moduleFiles
    .map(moduleFile => {
      const originalClassName = moduleFile.cmpMeta.componentClass;
      const pascalCasedClassName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

      let filePath = path.relative(path.dirname(bundle.entryKey), moduleFile.jsFilePath);
      return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
    })
    .join('\n');
}
