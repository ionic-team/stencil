import * as d from '../../declarations';
import { buildAbort, buildFinish } from './build-finish';
import { catchError, isString, readPackageJson } from '@utils';
import { emptyOutputTargets } from '../../compiler/output-targets/empty-dir';
import { generateGlobalStyles } from '../../compiler/style/global-styles';
import { generateOutputTargets } from '../output-targets';
import { runTsProgram } from '../transpile/run-program';
import { writeBuild } from './write-build';
import ts from 'typescript';


export const build = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => {
  try {
    // empty the directories on the first build
    await emptyOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (config.srcIndexHtml) {
      const indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);
      if (isString(indexSrcHtml)) {
        buildCtx.indexDoc = config.sys.createDocument(indexSrcHtml);
      }
    }

    buildCtx.packageJson = await readPackageJson(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // run typescript program
    const tsTimeSpan = buildCtx.createTimeSpan('transpile started');
    const componentDtsChanged = await runTsProgram(config, compilerCtx, buildCtx, tsBuilder);
    tsTimeSpan.finish('transpile finished');
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (componentDtsChanged) {
      // silent abort
      return null;
    }

    // preprocess and generate styles before any outputTarget starts
    buildCtx.stylesPromise = generateGlobalStyles(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // create outputs
    await generateOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    /// write outputs
    await buildCtx.stylesPromise;
    await writeBuild(config, compilerCtx, buildCtx);
    // await copyPromise;

  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // TODO
  // clear changed files
  compilerCtx.changedFiles.clear();

  // return what we've learned today
  return buildFinish(buildCtx);
};
