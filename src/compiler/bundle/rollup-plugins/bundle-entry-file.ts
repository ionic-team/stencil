import { Bundle, ModuleFile, BuildConfig } from '../../../util/interfaces';
import { dashToPascalCase } from '../../../util/helpers';

export default function bundleEntryFile(config: BuildConfig, bundles: Bundle[]) {

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
        return generateBundleEntryInput(config, bundle);
      }

      return null;
    }
  };
}

export function generateBundleEntryInput(config: BuildConfig, bundle: Bundle) {
  const lines: string[] = [];

  // create a PascalCased named export for each component within the button
  bundle.moduleFiles.forEach(m => {
    lines.push(componentExport(config, m, bundle.entryKey));
  });

  // return a string representing the entry input file for this bundle
  return lines.join('\n');
}


function componentExport(config: BuildConfig, moduleFile: ModuleFile, bundlePath: string) {
  const path = config.sys.path;
  const originalClassName = moduleFile.cmpMeta.componentClass;
  const pascalCasedClassName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

  let filePath = path.relative(path.dirname(bundlePath), moduleFile.jsFilePath);
  filePath = `./${filePath}`;

  // export { Button as IonButton } from '/some/path.js';
  return `export { ${originalClassName} as ${pascalCasedClassName} } from '${filePath}';`;
}
