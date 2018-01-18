import { BuildCtx, Bundle, Config, CompilerCtx, ModuleFile } from '../../util/interfaces';
import { generateEsModule, generateLegacyModule, runRollup } from './rollup-bundle';
import { isTsFile } from '../util';


export async function generateBundleModule(config: Config, contextCtx: CompilerCtx, buildCtx: BuildCtx, bundle: Bundle) {
  if (canSkipBundleModule(config, contextCtx, buildCtx, bundle.moduleFiles, bundle.entryKey)) {
    // we can skip bundling, let's use our cached data
    bundle.compiledModuleJsText = contextCtx.compiledModuleJsText[bundle.entryKey];
    bundle.compiledModuleLegacyJsText = contextCtx.compiledModuleLegacyJsText[bundle.entryKey];
    return;
  }

  // keep track of module bundling for testing
  buildCtx.bundleBuildCount++;

  // run rollup, but don't generate yet
  // returned rollup bundle can be reused for es module and legacy
  const rollupBundle = await runRollup(config, contextCtx, buildCtx, bundle);

  // bundle using only es modules and dynamic imports
  bundle.compiledModuleJsText = await generateEsModule(config, rollupBundle);

  // cache for later
  contextCtx.compiledModuleJsText[bundle.entryKey] = bundle.compiledModuleJsText;

  if (config.buildEs5) {
    // only create legacy modules when generating es5 fallbacks
    // bundle using commonjs using jsonp callback
    bundle.compiledModuleLegacyJsText = await generateLegacyModule(config, rollupBundle);

    // cache for later
    contextCtx.compiledModuleLegacyJsText[bundle.entryKey] = bundle.compiledModuleLegacyJsText;
  }
}


export function canSkipBundleModule(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, moduleFiles: ModuleFile[], cacheKey: string) {
  if (!buildCtx.requiresFullBuild) {
    // cannot skip if this is a full build
    return false;
  }

  if (!compilerCtx.compiledModuleJsText[cacheKey]) {
    // cannot skip if there isn't anything cached
    return false;
  }

  if (!buildCtx.hasChangedJsText) {
    // skip if there wasn't any changed JS text
    return true;
  }

  // get a list of filepaths that are components
  const componentFilePaths = Object.keys(compilerCtx.moduleFiles).filter(filePath => {
    return !!(compilerCtx.moduleFiles[filePath].cmpMeta);
  });

    // if the changed file is a typescript file
    // and the typescript file isn't a component then
    // we must do a rebuild. Basically we don't know if this
    // typescript file affects this bundle or not
  const isNonComponentTsFileChange = componentFilePaths.some(componentFilePath => {
    return buildCtx.filesChanged.some(changedFilePath => isTsFile(changedFilePath) && changedFilePath === componentFilePath);
  });

  if (isNonComponentTsFileChange) {
    // we've got a changed ts file that isn't a component
    // so it could be like dependent library
    // we cannot skip bundling this module
    return false;
  }

  // check if this bundle has one of the changed files
  const bundleContainsChangedFile = bundledComponentContainsChangedFile(config, moduleFiles, buildCtx.filesChanged);
  if (!bundleContainsChangedFile) {
    // don't bother bundling, none of the changed files have the same filename
    // we can skip bundling this module
    return true;
  }

  // idk, probs need to bundle, can't skip
  return false;
}


export function bundledComponentContainsChangedFile(config: Config, bundlesModuleFiles: ModuleFile[], changedFiles: string[]) {
  // loop through all the changed typescript filenames and see if there are corresponding js filenames
  // if there are no filenames that match then let's not bundle
  // yes...there could be two files that have the same filename in different directories
  // but worst case scenario is that both of them run their bundling, which isn't a performance problem
  return bundlesModuleFiles.some(moduleFile => {
    // get the basename without any extension
    const distFileName = config.sys.path.basename(moduleFile.jsFilePath, '.js');

    return changedFiles.some(f => {
      // compare the basename like it had a ts extension
      // to one the changed file
      const changedFileName = config.sys.path.basename(f);
      return (changedFileName === distFileName + '.ts' || changedFileName === distFileName + '.tsx');
    });
  });
}
