import * as d from '../../../declarations';
import { dashToPascalCase } from '../../../util/helpers';
import { ENTRY_KEY_PREFIX } from '../../entries/entry-modules';
import { normalizePath } from '../../util';


export default function bundleEntryFile(config: d.Config, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {

  return {
    name: 'bundleEntryFilePlugin',

    resolveId(importee: string) {
      if (!buildCtx.isActiveBuild) {
        return `_not_active_build.js`;
      }

      if (importee.startsWith(ENTRY_KEY_PREFIX)) {
        const bundle = entryModules.find(b => b.entryKey === importee);
        console.log(bundle);
        if (bundle) {
          return bundle.entryKey;
        }

        buildCtx.debug(`bundleEntryFilePlugin resolveId, unable to find entry key: ${importee}`);
        buildCtx.debug(`entryModules entryKeys: ${entryModules.map(em => em.entryKey).join(', ')}`);
      }

      return null;
    },

    load(id: string) {
      if (!buildCtx.isActiveBuild) {
        return `/* build aborted */`;
      }

      if (id.startsWith(ENTRY_KEY_PREFIX)) {
        const bundle = entryModules.find(b => b.entryKey === id);
        if (bundle) {
          return createEntryPointString(config, bundle);
        }

        buildCtx.debug(`bundleEntryFilePlugin load, unable to find entry key: ${id}`);
        buildCtx.debug(`entryModules entryKeys: ${entryModules.map(em => em.entryKey).join(', ')}`);
      }

      return null;
    }
  };
}


export function createEntryPointString(config: d.Config, entryModule: d.EntryModule): string {
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
