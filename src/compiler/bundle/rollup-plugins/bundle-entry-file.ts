import { Config, EntryModule } from '../../../declarations';
import { dashToPascalCase } from '../../../util/helpers';
import { normalizePath } from '../../util';

export default function bundleEntryFile(config: Config, entryModules: EntryModule[]) {

  return {
    name: 'bundleEntryFilePlugin',

    resolveId(importee: string) {
      const bundle = entryModules.find(b => b.entryKey === importee);
      if (bundle) {
        return bundle.entryKey;
      }

      return null;
    },

    load(id: string) {
      const bundle = entryModules.find(b => b.entryKey === id);
      if (bundle) {
        return createEntryPointString(config, bundle);
      }

      return null;
    }
  };
}

export function createEntryPointString(config: Config, entryModule: EntryModule): string {
  const path = config.sys.path;

  return entryModule.moduleFiles
    .map(moduleFile => {
      const originalClassName = moduleFile.cmpMeta.componentClass;
      const pascalCasedClassName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

      const filePath = normalizePath(path.relative(path.dirname(entryModule.entryKey), moduleFile.jsFilePath));
      return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
    })
    .join('\n');
}
