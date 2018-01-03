import { Bundle, ModuleFile } from '../../util/interfaces';
import { dashToPascalCase } from '../../util/helpers';
import { normalizePath } from '../util';


export function generateBundleEntryInput(bundle: Bundle) {
  const lines: string[] = [];

  // create a PascalCased named export for each component within the button
  bundle.moduleFiles.forEach(m => {
    lines.push(componentExport(m));
  });

  // return a string representing the entry input file for this bundle
  return lines.join('\n');
}


function componentExport(moduleFile: ModuleFile) {
  const originalClassName = moduleFile.cmpMeta.componentClass;
  const pascalCasedClassName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);
  const filePath = normalizePath(moduleFile.jsFilePath);

  // export { Button as IonButton } from '/some/path.js';
  return `export { ${originalClassName} as ${pascalCasedClassName} } from '${filePath}';`;
}
