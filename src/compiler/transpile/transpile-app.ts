import * as d from '../../declarations';
import { catchError } from '../util';
import { generateComponentTypes } from './create-component-types';
import { transpileService } from './transpile-service';
import { validateTypesMain } from './validate-types-main';


export async function transpileApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  try {
    const doTranspile = await transpileService(config, compilerCtx, buildCtx);

    await processMetadata(config, compilerCtx, buildCtx, doTranspile);

  } catch (e) {
    // gah!!
    catchError(buildCtx.diagnostics, e);
  }
}


async function processMetadata(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, doTranspile: boolean) {
  // let's clean up the module file cache so we only
  // hold on to stuff we know is being used
  cleanModuleFileCache(compilerCtx);

  // get all the active module files
  const moduleFiles = Object.keys(compilerCtx.moduleFiles).map(key => compilerCtx.moduleFiles[key]);

  // see if any of the active modules are using slot or svg
  // useful for the build process later on
  buildCtx.hasSlot = moduleFiles.some(mf => mf.hasSlot);
  buildCtx.hasSvg = moduleFiles.some(mf => mf.hasSvg);

  if (doTranspile && !buildCtx.shouldAbort()) {
    // ts changes have happened!!
    // create the components.d.ts file and write to disk
    await generateComponentTypes(config, compilerCtx);

    if (!config._isTesting) {
      // now that we've updated teh components.d.ts file
      // lets do a full typescript build (but in another thread)
      validateTypesMain(config, compilerCtx, buildCtx);
    }
  }
}


function cleanModuleFileCache(compilerCtx: d.CompilerCtx) {
  // let's clean up the module file cache so we only
  // hold on to stuff we know is being used
  const foundSourcePaths: string[] = [];

  compilerCtx.rootTsFiles.forEach(rootTsFile => {
    const moduleFile = compilerCtx.moduleFiles[rootTsFile];
    addSourcePaths(compilerCtx, foundSourcePaths, moduleFile);
  });

  const cachedSourcePaths = Object.keys(compilerCtx.moduleFiles);

  cachedSourcePaths.forEach(sourcePath => {
    if (sourcePath.endsWith('.d.ts') || sourcePath.endsWith('.js')) {
      // don't bother cleaning up for .d.ts and .js modules files
      return;
    }

    if (!foundSourcePaths.includes(sourcePath)) {
      // this source path is a typescript file
      // but we never found it again, so let's forget it
      delete compilerCtx.moduleFiles[sourcePath];
    }
  });
}


function addSourcePaths(compilerCtx: d.CompilerCtx, foundSourcePaths: string[], moduleFile: d.ModuleFile) {
  if (moduleFile && !foundSourcePaths.includes(moduleFile.sourceFilePath)) {
    foundSourcePaths.push(moduleFile.sourceFilePath);

    moduleFile.localImports.forEach(localImport => {
      const moduleFile = compilerCtx.moduleFiles[localImport];
      if (moduleFile) {
        addSourcePaths(compilerCtx, foundSourcePaths, moduleFile);
      }
    });
  }
}
