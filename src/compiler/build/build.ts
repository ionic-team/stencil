import * as d from '../../declarations';
import { canSkipAssetsCopy } from '../copy/assets-copy-tasks';
import { catchError, readPackageJson } from '@utils';
import { emptyOutputTargets } from '../output-targets/empty-dir';
import { generateEntryModules } from '../entries/entry-modules';
import { generateOutputTargets } from '../output-targets';
import { generateStyles } from '../style/generate-styles';
import { initIndexHtmls } from './init-index-html';
import { ProgressTask } from './build-ctx';
import { transpileApp } from '../transpile/transpile-app';
import { waitForCopyTasks } from '../copy/copy-tasks';
import { writeBuildFiles } from './write-build';


export async function build(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  try {
    // ensure any existing worker tasks are not running
    // and we've got a clean slate
    config.sys.cancelWorkerTasks();

    buildCtx.packageJson = await readPackageJson(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildCtx.abort();

    if (!config.devServer || !config.flags.serve) {
      // create an initial index.html file if one doesn't already exist
      await initIndexHtmls(config, compilerCtx, buildCtx);
      if (buildCtx.hasError) return buildCtx.abort();
    }

    // empty the directories on the first build
    await emptyOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildCtx.abort();

    buildCtx.progress(ProgressTask.emptyOutputTargets);

    // async scan the src directory for ts files
    // then transpile them all in one go
    // buildCtx.moduleFiles is populated here
    buildCtx.hasScriptChanges = await transpileApp(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildCtx.abort();

    buildCtx.progress(ProgressTask.transpileApp);

    if (config.srcIndexHtml) {
      const hasIndex = await compilerCtx.fs.access(config.srcIndexHtml);
      if (hasIndex) {
        const indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);
        buildCtx.indexDoc = config.sys.createDocument(indexSrcHtml);
      }
    }

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    generateEntryModules(config, buildCtx);
    if (buildCtx.hasError) return buildCtx.abort();

    // start copy tasks from the config.copy and component assets
    // but don't wait right now (running in worker)
    buildCtx.skipAssetsCopy = canSkipAssetsCopy(config, compilerCtx, buildCtx.entryModules, buildCtx.filesChanged);

    // preprocess and generate styles before any outputTarget starts
    buildCtx.stylesPromise = generateStyles(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildCtx.abort();

    buildCtx.progress(ProgressTask.generateStyles);

    // generate the core app files
    await generateOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildCtx.abort();

    buildCtx.progress(ProgressTask.generateOutputTargets);

    // wait on some promises we kicked off earlier
    await Promise.all([
      // await on the validate types build to finish
      // do this before we attempt to write build files
      buildCtx.validateTypesBuild(),

      // we started the copy tasks a long long time ago
      // i'm sure it's done by now, but let's double check
      // make sure this finishes before the write build files
      // so they're not stepping on each other writing files
      waitForCopyTasks(buildCtx)
    ]);
    if (buildCtx.hasError) return buildCtx.abort();

    buildCtx.progress(ProgressTask.validateTypesBuild);

    // write all the files and copy asset files
    await writeBuildFiles(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildCtx.abort();

    buildCtx.progress(ProgressTask.writeBuildFiles);

  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // return what we've learned today
  return buildCtx.finish();
}
