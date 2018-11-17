import * as d from '../../declarations';
import { normalizePath } from '../util';


export function generateDocData(config: d.Config, compilerCtx: d.CompilerCtx) {
  const cmpDirectories: string[] = [];
  const warnings: string[] = [];
  const docs: d.DocsData = { components: [] };

  const moduleFiles = Object.keys(compilerCtx.moduleFiles).sort();

  moduleFiles.forEach(filePath => {
    const moduleFile = compilerCtx.moduleFiles[filePath];

    if (!moduleFile.cmpMeta || moduleFile.isCollectionDependency) {
      return;
    }

    const dirPath = normalizePath(config.sys.path.dirname(filePath));

    if (cmpDirectories.includes(dirPath)) {
      if (!warnings.includes(dirPath)) {
        config.logger.warn(`multiple components found in: ${dirPath}`);
        warnings.push(dirPath);
      }

    } else {
      cmpDirectories.push(dirPath);

      const cmpData: d.DocsDataComponent = {
        dirPath: dirPath,
        filePath: filePath,
        fileName: config.sys.path.basename(filePath),
        readmePath: normalizePath(config.sys.path.join(dirPath, 'readme.md')),
        usagesDir: normalizePath(config.sys.path.join(dirPath, 'usage')),
        moduleFile: moduleFile,
        cmpMeta: moduleFile.cmpMeta
      };

      docs.components.push(cmpData);
    }
  });

  return docs;
}
