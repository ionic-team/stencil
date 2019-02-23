import * as d from '@declarations';
import { catchError } from '@utils';
import { copyTasksMain } from '../copy/copy-tasks-main';
import { emptyOutputTargetDirs } from './empty-dir';
import { generateEntryModules } from '../entries/entry-modules';
import { generateOutputTargets } from '../output-targets';
import { initIndexHtmls } from './init-index-html';
import { sys } from '@sys';
import { transpileApp } from '../transpile/transpile-app';
import { writeBuildFiles } from './write-build';
import { generateStyles } from '../style/generate-styles';


export async function build(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  try {
    // ensure any existing worker tasks are not running
    // and we've got a clean slate
    sys.cancelWorkerTasks();

    if (!config.devServer || !config.flags.serve) {
      // create an initial index.html file if one doesn't already exist
      await initIndexHtmls(config, compilerCtx, buildCtx);
      if (buildCtx.shouldAbort) return buildCtx.abort();
    }

    // empty the directories on the first build
    await emptyOutputTargetDirs(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort) return buildCtx.abort();

    // async scan the src directory for ts files
    // then transpile them all in one go
    // buildCtx.moduleFiles is populated here
    await transpileApp(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort) return buildCtx.abort();

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    generateEntryModules(config, buildCtx);
    if (buildCtx.shouldAbort) return buildCtx.abort();

    // start copy tasks from the config.copy and component assets
    // but don't wait right now (running in worker)
    const copyTaskPromise = copyTasksMain(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort) return buildCtx.abort();

    // preprocess and generate styles before any outputTarget starts
    buildCtx.stylesPromise = generateStyles(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort) return buildCtx.abort();

    // generate the core app files
    await generateOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort) return buildCtx.abort();

    // wait on some promises we kicked off earlier
    await Promise.all([
      // await on the validate types build to finish
      // do this before we attempt to write build files
      buildCtx.validateTypesBuild(),

      // we started the copy tasks a long long time ago
      // i'm sure it's done by now, but let's double check
      // make sure this finishes before the write build files
      // so they're not stepping on each other writing files
      copyTaskPromise
    ]);
    if (buildCtx.shouldAbort) return buildCtx.abort();

    // write all the files and copy asset files
    await writeBuildFiles(config, compilerCtx, buildCtx);
    if (buildCtx.shouldAbort) return buildCtx.abort();

  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // return what we've learned today
  return buildCtx.finish();
}
