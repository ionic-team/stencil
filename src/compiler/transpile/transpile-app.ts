import * as d from '../../declarations';
import { generateAppTypes } from '../types/generate-app-types';
import { buildTsService } from './transpile-service';
import { getComponentsDtsSrcFilePath, getComponentsFromModules } from '../output-targets/output-utils';
import { resolveComponentDependencies} from '../entries/resolve-component-dependencies';
import { loadTypeScriptDiagnostics } from '@utils';
import minimatch from 'minimatch';

export async function transpileApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (shouldScanForTsChanges(compilerCtx, buildCtx)) {
    // either we haven't figured out all the root ts files yet
    // or we already know we need to do a full rebuild
    // or new files were added or deleted
    // so let's scan the entire src directory looking for ts files to transpile
    // rootTsFiles always used as a way to know the active modules being used
    // basically so our cache knows which stuff we can forget about
    compilerCtx.rootTsFiles = await scanDirForTsFiles(config, compilerCtx, buildCtx);
  }

  const changedTsFiles = (buildCtx.requiresFullBuild)
    ? compilerCtx.rootTsFiles.slice()
    : buildCtx.filesChanged.filter(filePath => {
      // do transpiling if one of the changed files is a ts file
      // and the changed file is not the components.d.ts file
      // when the components.d.ts file is written to disk it shouldn't cause a new build
      return isFileIncludePath(config, filePath);
    });

  // Create TS Service if it's the first time
  if (compilerCtx.tsService == null) {
    // create the typescript language service
    compilerCtx.tsService = await buildTsService(config, compilerCtx, buildCtx);
  }

  // we've found ts files we need to tranpsile
  // or at least one ts file has changed
  const timeSpan = buildCtx.createTimeSpan(`transpile started`);

  // invalidate all changed files
  compilerCtx.tsService.invalidate(changedTsFiles);

  // go ahead and kick off the ts service
  const changeCtx = await compilerCtx.tsService.transpile(compilerCtx, buildCtx, changedTsFiles);

  if (buildCtx.hasError) {
    return false;
  }

  // let's clean up the module file cache so we only
  // hold on to stuff we know is being used
  cleanModuleFileCache(compilerCtx);

  buildCtx.moduleFiles = Array.from(compilerCtx.moduleMap.values());
  buildCtx.components = getComponentsFromModules(buildCtx.moduleFiles);
  resolveComponentDependencies(buildCtx.components);

  if (await generateAppTypes(config, compilerCtx, buildCtx, 'src')) {
    changeCtx.types = changeCtx.implementation = true;
  }

  if (changeCtx.types) {
    // ts changes have happened!!
    // create the components.d.ts file and write to disk
    const typeDiagnostics = compilerCtx.tsService.getTypeDiagnostics();
    loadTypeScriptDiagnostics(buildCtx.diagnostics, typeDiagnostics);

  } else if (changeCtx.implementation) {
    const typeDiagnostics = compilerCtx.tsService.getTypeDiagnostics(changedTsFiles);
    loadTypeScriptDiagnostics(buildCtx.diagnostics, typeDiagnostics);
  }

  timeSpan.finish('transpile finished');

  return changeCtx.implementation;
}


function cleanModuleFileCache(compilerCtx: d.CompilerCtx) {
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


function shouldScanForTsChanges(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!compilerCtx.rootTsFiles) {
    return true;
  }
  if (buildCtx.requiresFullBuild) {
    return true;
  }
  if (
    (buildCtx.filesAdded.length +
    buildCtx.filesDeleted.length +
    buildCtx.dirsAdded.length +
    buildCtx.dirsDeleted.length) > 0
  ) {
    return true;
  }
  return false;
}

async function scanDirForTsFiles(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const scanDirTimeSpan = buildCtx.createTimeSpan(`scan ${config.srcDir} started`, true);

  // loop through this directory and sub directories looking for
  // files that need to be transpiled
  const dirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: true });

  // filter down to only the ts files we should include
  const tsFileItems = dirItems.filter(item => {
    return item.isFile && isFileIncludePath(config, item.absPath);
  });
  const componentsDtsSrcFilePath = getComponentsDtsSrcFilePath(config);

  // return just the abs path
  // make sure it doesn't include components.d.ts
  const tsFilePaths = tsFileItems
    .map(tsFileItem => tsFileItem.absPath)
    .filter(tsFileAbsPath => tsFileAbsPath !== componentsDtsSrcFilePath);

  scanDirTimeSpan.finish(`scan for ts files finished: ${tsFilePaths.length}`);

  return tsFilePaths;
}


export function isFileIncludePath(config: d.Config, readPath: string) {
  // filter e2e tests
  if (readPath.includes('.e2e.') || readPath.includes('/e2e.')) {
    // keep this test if it's an e2e file and we should be testing e2e
    return false;
  }

  // filter spec tests
  if (readPath.includes('.spec.') || readPath.includes('/spec.')) {
    return false;
  }

  for (var i = 0; i < config.excludeSrc.length; i++) {
    if (minimatch(readPath, config.excludeSrc[i])) {
      // this file is a file we want to exclude
      return false;
    }
  }

  for (i = 0; i < config.includeSrc.length; i++) {
    if (minimatch(readPath, config.includeSrc[i])) {
      // this file is a file we want to include
      return true;
    }
  }

  // not a file we want to include, let's not add it
  return false;
}
