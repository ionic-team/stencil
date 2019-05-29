import * as d from '../../declarations';
import { catchError } from '@utils';
import { generateAppTypes } from '../types/generate-app-types';
import { getComponentsFromModules } from '../output-targets/output-utils';
import { resolveComponentDependencies} from '../entries/resolve-component-dependencies';
import { transpileService } from './transpile-service';
import { updateComponentBuildConditionals } from '../app-core/build-conditionals';
import { validateTypesMain } from './validate-types-main';


export async function transpileApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  try {
    const doTranspile = await transpileService(config, compilerCtx, buildCtx);

    await processMetadata(config, compilerCtx, buildCtx, doTranspile);
    return doTranspile;

  } catch (e) {
    // gah!!
    catchError(buildCtx.diagnostics, e);
  }
  return false;
}


async function processMetadata(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, doTranspile: boolean) {
  if (buildCtx.hasError) {
    buildCtx.debug(`processMetadata aborted`);
    return;
  }

  // let's clean up the module file cache so we only
  // hold on to stuff we know is being used
  cleanModuleFileCache(compilerCtx);

  buildCtx.moduleFiles = Array.from(compilerCtx.moduleMap.values());
  buildCtx.components = getComponentsFromModules(buildCtx.moduleFiles);
  updateComponentBuildConditionals(compilerCtx.moduleMap, buildCtx.components);
  resolveComponentDependencies(buildCtx.components);

  if (doTranspile && !buildCtx.hasError) {
    // ts changes have happened!!
    // create the components.d.ts file and write to disk
    await generateAppTypes(config, compilerCtx, buildCtx, 'src');

    if (!config._isTesting) {
      // now that we've updated the components.d.ts file
      // lets do a full typescript build (but in another thread)
      validateTypesMain(config, compilerCtx, buildCtx).catch(err => {
        catchError(buildCtx.diagnostics, err);
      });
    }
  }
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
