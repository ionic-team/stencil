import { BuildConfig, BuildContext, ManifestBundle } from '../../util/interfaces';
import { catchError, hasError } from '../util';
import { generateComponentModules } from './component-modules';
import { createDependencyGraph } from './create-dependency-graph';

export async function bundleModules(config: BuildConfig, ctx: BuildContext, manifestBundles: ManifestBundle[]) {
  // create main module results object
  if (hasError(ctx.diagnostics)) {
    return Promise.resolve();
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

function getModuleBundleCacheKey(components: string[]) {
  return components.map(c => c.toLocaleLowerCase().trim()).sort().join('.');
}
