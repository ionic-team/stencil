import { BuildResults, CompilerCtx, Config, WatcherResults } from '../../declarations';
import { bundle } from '../bundle/bundle';
import { catchError, getCompilerCtx } from '../util';
import { copyTasks } from '../copy/copy-tasks';
import { emptyDestDir, writeBuildFiles } from './write-build';
import { getBuildContext } from './build-utils';
import { generateAppFiles } from '../app/generate-app-files';
import { generateBundles } from '../bundle/generate-bundles';
import { generateEntryModules } from '../entries/entry-modules';
import { generateIndexHtml } from '../html/generate-index-html';
import { generateReadmes } from '../docs/generate-readmes';
import { generateStyles } from '../style/style';
import { initIndexHtml } from '../html/init-index-html';
import { loadCollections } from '../collections/load-collections';
import { prerenderApp } from '../prerender/prerender-app';
import { transpileAppModules } from '../transpile/transpile-app-modules';


export async function build(config: Config, compilerCtx?: CompilerCtx, watcher?: WatcherResults): Promise<BuildResults> {
  // create the build context if it doesn't exist
  // the buid context is the same object used for all builds and rebuilds
  // ctx is where stuff is cached for fast in-memory lookups later
  compilerCtx = getCompilerCtx(config, compilerCtx);

  // reset the build context, this is important for rebuilds
  const buildCtx = getBuildContext(config, compilerCtx, watcher);

  try {
    // create an initial index.html file if one doesn't already exist
    // this is synchronous on purpose
    await initIndexHtml(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // empty the directories on the first build
    await emptyDestDir(config, compilerCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // load colleciton data from all the dependent collections
    // and upgrade modules as necessary
    await loadCollections(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // async scan the src directory for ts files
    // then transpile them all in one go
    await transpileAppModules(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    const entryModules = generateEntryModules(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // bundle modules and styles into separate files phase
    const jsModules = await bundle(config, compilerCtx, buildCtx, entryModules);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // create each of the components's styles
    await generateStyles(config, compilerCtx, buildCtx, entryModules);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // both styles and modules are done bundling
    // inject the styles into the modules and
    // generate each of the output bundles
    const cmpRegistry = await generateBundles(config, compilerCtx, buildCtx, entryModules, jsModules);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // generate the app files, such as app.js, app.core.js
    await generateAppFiles(config, compilerCtx, buildCtx, entryModules, cmpRegistry);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // copy all assets
    if (!compilerCtx.hasSuccessfulBuild) {
      // only do the initial copy on the first build
      // watcher handles any re-copies
      await copyTasks(config, compilerCtx, buildCtx.diagnostics, false);
      if (buildCtx.shouldAbort()) return buildCtx.finish();
    }

    // build index file and service worker
    await generateIndexHtml(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // generate each of the readmes
    await generateReadmes(config, compilerCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // prerender that app
    await prerenderApp(config, compilerCtx, buildCtx, entryModules);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // write all the files and copy asset files
    await writeBuildFiles(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // return what we've learned today
  return buildCtx.finish();
}
