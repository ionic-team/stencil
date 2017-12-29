import { BuildConfig, BuildContext, ManifestBundle, ModuleFile } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { createDependencyGraph } from './create-dependency-graph';
import { generateEsModule, generateLegacyModule, runRollup } from './rollup-bundle';


export async function bundleModules(config: BuildConfig, ctx: BuildContext, manifestBundles: ManifestBundle[]) {
  // create main module results object
  if (hasError(ctx.diagnostics)) {
    return;
  }

  // do bundling if this is not a change build
  // or it's a change build that has either changed modules or components
  const doBundling = (!ctx.isChangeBuild || ctx.changeHasComponentModules || ctx.changeHasNonComponentModules);

  const timeSpan = config.logger.createTimeSpan(`bundle modules started`, !doBundling);

  ctx.graphData = {};

  try {
    await Promise.all(manifestBundles.map(manifestBundle => {
      manifestBundle.cacheKey = getModuleBundleCacheKey(manifestBundle.moduleFiles.map(m => m.cmpMeta.tagNameMeta));
      return createDependencyGraph(config, ctx, manifestBundle);
    }));

    ctx.graphData = remapData(ctx.graphData);

    await Promise.all(manifestBundles.map(manifestBundle => {
      return generateComponentModules(config, ctx, manifestBundle);
    }));

  } catch (err) {
    catchError(ctx.diagnostics, err);
  }

  timeSpan.finish('bundle modules finished');
}

function remapData(graphData: any) {
  return Object.keys(graphData)
    .reduce((allFiles: string[], key: string) => {
      return allFiles.concat(graphData[key]);
    }, [] as string[])
    .filter((fileName, index, array) => array.indexOf(fileName) === index)
    .reduce((allFiles: { [key: string]: string[] }, fileName: string) => {
      let listArray: string[] = [];

      for (let key in graphData) {
        if (graphData[key].indexOf(fileName) !== -1) {
          listArray.push(key);
        }
      }

      if (listArray.length > 1) {
        allFiles[fileName] = listArray;
      }

      return allFiles;
    }, {} as { [key: string]: any });
}



export async function generateComponentModules(config: BuildConfig, ctx: BuildContext, manifestBundle: ManifestBundle) {
  if (canSkipBuild(config, ctx, manifestBundle.moduleFiles, manifestBundle.cacheKey)) {
    // don't bother bundling if this is a change build but
    // none of the changed files are modules or components
    manifestBundle.compiledModuleText = ctx.moduleBundleOutputs[manifestBundle.cacheKey];
    manifestBundle.compiledModuleLegacyText = ctx.moduleBundleLegacyOutputs[manifestBundle.cacheKey];
    return Promise.resolve();
  }

  // keep track of module bundling for testing
  ctx.moduleBundleCount++;

  // run rollup, but don't generate yet
  // returned rollup bundle can be reused for es module and legacy
  const rollupBundle = await runRollup(config, ctx, manifestBundle);

  // bundle using only es modules and dynamic imports
  manifestBundle.compiledModuleText = await generateEsModule(config, rollupBundle);

  // cache for later
  ctx.moduleBundleOutputs[manifestBundle.cacheKey] = manifestBundle.compiledModuleText;

  if (config.es5Fallback) {
    // only create legacy modules when generating es5 fallbacks
    // bundle using commonjs using jsonp callback
    manifestBundle.compiledModuleLegacyText = await generateLegacyModule(config, rollupBundle);

    // cache for later
    ctx.moduleBundleLegacyOutputs[manifestBundle.cacheKey] = manifestBundle.compiledModuleLegacyText;
  }
}


export function canSkipBuild(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFile[], cacheKey: string) {
  // must build if it's not a change build
  if (!ctx.isChangeBuild) {
    return false;
  }

  // cannot skip if there isn't anything cached
  if (!ctx.moduleBundleOutputs[cacheKey]) {
    return false;
  }

  // must rebuild if it's non-component changes
  // basically don't know of deps of deps changed, so play it safe
  if (ctx.changeHasNonComponentModules) {
    return false;
  }

  // ok to skip if it wasn't a component module change
  if (!ctx.changeHasComponentModules) {
    return true;
  }

  // check if this bundle has one of the changed files
  const bundleContainsChangedFile = bundledComponentContainsChangedFile(config, moduleFiles, ctx.changedFiles);
  if (!bundleContainsChangedFile) {
    // don't bother bundling, none of the changed files have the same filename
    return true;
  }

  // idk, probs need to bundle, can't skip
  return false;
}


export function bundledComponentContainsChangedFile(config: BuildConfig, bundlesModuleFiles: ModuleFile[], changedFiles: string[]) {
  // loop through all the changed typescript filenames and see if there are corresponding js filenames
  // if there are no filenames that match then let's not bundle
  // yes...there could be two files that have the same filename in different directories
  // but worst case scenario is that both of them run their bundling, which isn't a performance problem
  return bundlesModuleFiles.some(moduleFile => {
    const distFileName = config.sys.path.basename(moduleFile.jsFilePath, '.js');
    return changedFiles.some(f => {
      const changedFileName = config.sys.path.basename(f);
      return (changedFileName === distFileName + '.ts' || changedFileName === distFileName + '.tsx');
    });
  });
}


export function getModuleBundleCacheKey(components: string[]) {
  return `bundle:${components.map(c => c.toLocaleLowerCase().trim()).sort().join('.')}`;
}
