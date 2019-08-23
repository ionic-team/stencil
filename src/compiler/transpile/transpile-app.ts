import * as d from '../../declarations';

export function cleanModuleFileCache(compilerCtx: d.CompilerCtx) {
  // let's clean up the module file cache so we only
  // hold on to stuff we know is being used
  const foundSourcePaths = new Set<string>();

  compilerCtx.rootTsFiles.forEach(rootTsFile => {
    const moduleFile = compilerCtx.moduleMap.get(rootTsFile);
    addSourcePaths(compilerCtx, moduleFile, foundSourcePaths);
  });

  compilerCtx.moduleMap.forEach(moduleFile => {
    const sourcePath = moduleFile.sourceFilePath;

    if (sourcePath.endsWith('.d.ts') || sourcePath.endsWith('.js')) {
      // don't bother cleaning up for .d.ts and .js modules files
      return;
    }

    if (!foundSourcePaths.has(sourcePath)) {
      // this source path is a typescript file
      // but we never found it again, so let's forget it
      compilerCtx.moduleMap.delete(sourcePath);
    }
  });
}


function addSourcePaths(compilerCtx: d.CompilerCtx, moduleFile: d.Module, foundSourcePaths: Set<string>) {
  if (moduleFile && !foundSourcePaths.has(moduleFile.sourceFilePath)) {
    foundSourcePaths.add(moduleFile.sourceFilePath);

    moduleFile.localImports.forEach(localImport => {
      const moduleFile = compilerCtx.moduleMap.get(localImport);
      if (moduleFile) {
        addSourcePaths(compilerCtx, moduleFile, foundSourcePaths);
      }
    });
  }
}
