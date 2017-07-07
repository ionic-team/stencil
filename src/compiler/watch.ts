import { BuildConfig } from '../util/interfaces';
import { BuildContext, BuildResults, Manifest } from './interfaces';
import { build, catchAll, finalizePhase, manifestPhase, optimizeHtmlPhase, writePhase } from './build';
import { compileFiles } from './compile';
import { isTsSourceFile } from './util';
import { mergeManifests, updateManifestUrls } from './manifest';


export function rebuild(buildConfig: BuildConfig, ctx: BuildContext, changedFiles: string[]) {
  const logger = buildConfig.logger;

  // create the build results which will be the returned object
  const buildResults: BuildResults = {
    diagnostics: [],
    manifest: {},
    componentRegistry: []
  };

  if (!changedFiles) {
    return Promise.resolve(buildResults);
  }

  changedFiles = changedFiles.filter(f => typeof f === 'string');

  if (!changedFiles.length) {
    return Promise.resolve(buildResults);
  }

  if (changedFiles.length > 10) {
    return build(buildConfig);
  }

  // create the build context
  const changedFilesStr = changedFiles.map(changedFile => {
    return buildConfig.sys.path.basename(changedFile);
  }).join(', ');

  logger.info(`changed file${changedFiles.length > 1 ? 's' : ''}: ${changedFilesStr}`);

  const timeSpan = logger.createTimeSpan(`rebuild, ${buildConfig.devMode ? 'dev' : 'prod'} mode, started`);

  // begin the rebuild
  return Promise.resolve().then(() => {
    // generate manifest phase
    return manifestPhase(buildConfig);

  }).then(dependentManifests => {
    // compile phase
    return compileFilesPhase(buildConfig, ctx, dependentManifests, changedFiles, buildResults);

  }).then(manifest => {
    // bundle phase
    manifest;
    // return bundleFilesPhase(buildConfig, ctx, manifest, changedFiles, buildResults);

  }).then(() => {
    // optimize index.html
    return optimizeHtmlPhase(buildConfig, ctx, buildResults);

  }).then(() => {
    // write all the files in one go
    return writePhase(buildConfig, ctx);

  }).catch(err => {
    // catch all phase
    return catchAll(buildResults, err);

  }).then(() => {
    // finalize phase
    timeSpan.finish(`rebuild ready, watching files...`);

    return finalizePhase(buildConfig, buildResults);
  });
}


export function compileFilesPhase(buildConfig: BuildConfig, ctx: BuildContext, dependentManifests: Manifest[], changedFiles: string[], buildResults: BuildResults) {
  const tsFilePaths = changedFiles.filter(isTsSourceFile);

  return compileFiles(buildConfig, ctx, tsFilePaths).then(compileResults => {
    if (compileResults.diagnostics) {
      buildResults.diagnostics = buildResults.diagnostics.concat(compileResults.diagnostics);
    }

    const resultsManifest: Manifest = compileResults.manifest || {};

    const localManifest = updateManifestUrls(
      buildConfig,
      resultsManifest,
      buildConfig.collectionDest
    );
    return mergeManifests([].concat((localManifest || []), dependentManifests));
  });
}


// export function bundleFilesPhase(buildConfig: BuildConfig, ctx: BuildContext, manifest: Manifest, changedFiles: string[], buildResults: BuildResults) {
//   const tsFilePaths = changedFiles.filter(isTsSourceFile);
// }
