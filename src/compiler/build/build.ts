import * as d from '../../declarations';
import { buildAbort, buildFinish } from './build-finish';
import { catchError, readPackageJson } from '@utils';
import { emptyOutputTargets } from '../output-targets/empty-dir';
import { generateEntryModules } from '../entries/entry-modules';
import { generateOutputTargets } from '../output-targets';
import { generateStyles } from '../style/generate-styles';
import { initIndexHtmls } from './init-index-html';
import { outputCopy } from '../output-targets/output-copy';
import { ProgressTask } from './build-ctx';
import { writeBuildFiles } from './write-build';


export async function build(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  try {
    // ensure any existing worker tasks are not running
    // and we've got a clean slate
    config.sys.cancelWorkerTasks();

    buildCtx.packageJson = await readPackageJson(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (!config.devServer || !config.flags.serve) {
      // create an initial index.html file if one doesn't already exist
      await initIndexHtmls(config, compilerCtx, buildCtx);
      if (buildCtx.hasError) return buildAbort(buildCtx);
    }

    // empty the directories on the first build
    await emptyOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    buildCtx.progress(ProgressTask.emptyOutputTargets);

    if (config.srcIndexHtml) {
      const hasIndex = await compilerCtx.fs.access(config.srcIndexHtml);
      if (hasIndex) {
        const indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);
        buildCtx.indexDoc = config.sys.createDocument(indexSrcHtml);
      }
    }

    const copyPromise = outputCopy(config, compilerCtx, buildCtx);

    // we've got the compiler context filled with app modules and collection dependency modules
    // figure out how all these components should be connected
    generateEntryModules(config, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // preprocess and generate styles before any outputTarget starts
    buildCtx.stylesPromise = generateStyles(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    buildCtx.progress(ProgressTask.generateStyles);

    // generate the core app files
    await generateOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    buildCtx.progress(ProgressTask.generateOutputTargets);

    // wait on some promises we kicked off earlier
    await copyPromise;
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // write all the files and copy asset files
    await writeBuildFiles(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    buildCtx.progress(ProgressTask.writeBuildFiles);

  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // return what we've learned today
  return buildFinish(buildCtx);
}
