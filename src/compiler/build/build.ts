import * as d from '../../declarations';
import { buildAuxiliaries } from './build-auxiliaries';
import { catchError } from '../util';
import { copyTasksMain } from '../copy/copy-tasks-main';
import { emptyOutputTargetDirs } from './empty-dir';
import { generateAppFiles } from '../app/generate-app-files';
import { generateBundles } from '../bundle/generate-bundles';
import { generateEntryModules } from '../entries/entry-modules';
import { generateIndexHtmls } from '../html/generate-index-html';
import { generateModuleMap } from '../bundle/bundle';
import { generateStyles } from '../style/style';
import { initCollections } from '../collections/init-collections';
import { initIndexHtmls } from '../html/init-index-html';
import { transpileApp } from '../transpile/transpile-app';
import { writeBuildFiles } from './write-build';


export async function build(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  try {
    // create an initial index.html file if one doesn't already exist
    // this is synchronous on purpose
    await initIndexHtmls(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // empty the directories on the first build
    await emptyOutputTargetDirs(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // async scan the src directory for ts files
    // then transpile them all in one go
    await transpileApp(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // initialize all the collections we found when transpiling
    // async copy collection files and upgrade collections as needed
    await initCollections(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    const entryModules = generateEntryModules(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // start copy tasks from the config.copy and component assets
    // but don't wait right now (running in worker)
    const copyTaskPromise = copyTasksMain(config, compilerCtx, buildCtx, entryModules);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // bundle js modules and create each of the components's styles
    // these can run in parallel
    const results = await Promise.all([
      generateModuleMap(config, compilerCtx, buildCtx, entryModules),
      generateStyles(config, compilerCtx, buildCtx, entryModules)
    ]);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    const jsModules = results[0];

    // both styles and modules are done bundling
    // inject the styles into the modules and
    // generate each of the output bundles
    const cmpRegistry = await generateBundles(config, compilerCtx, buildCtx, entryModules, jsModules);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // generate the app files, such as app.js, app.core.js
    await generateAppFiles(config, compilerCtx, buildCtx, entryModules, cmpRegistry);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // build index file and service worker
    await generateIndexHtmls(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // await on the validate types build to finish
    // do this before we attempt to write build files
    await buildCtx.validateTypesBuild();

    // we started the copy tasks long ago
    // i'm sure it's done by now, but let's double check
    // make sure this finishes before the write build files
    // so they're not stepping on each other writing files
    await copyTaskPromise;
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // write all the files and copy asset files
    await writeBuildFiles(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

    // await on our other optional stuff like docs, service workers, etc.
    await buildAuxiliaries(config, compilerCtx, buildCtx, entryModules);
    if (buildCtx.shouldAbort()) return buildCtx.finish();

  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // return what we've learned today
  return buildCtx.finish();
}
