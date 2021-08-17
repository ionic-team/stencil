import type * as d from '../../declarations';
import { buildAbort, buildFinish } from './build-finish';
import { catchError, getStencilCompilerContext, isString, readPackageJson } from '@utils';
import { createDocument } from '@stencil/core/mock-doc';
import { emptyOutputTargets } from '../output-targets/empty-dir';
import { generateGlobalStyles } from '../style/global-styles';
import { generateOutputTargets } from '../output-targets';
import { runTsProgram } from '../transpile/run-program';
import { writeBuild } from './write-build';
import ts from 'typescript';

export const build = async (config: d.Config, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => {
  try {
    // reset process.cwd() for 3rd-party plugins
    process.chdir(config.rootDir);

    // empty the directories on the first build
    await emptyOutputTargets(config, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (config.srcIndexHtml) {
      const indexSrcHtml = await getStencilCompilerContext().fs.readFile(config.srcIndexHtml);
      if (isString(indexSrcHtml)) {
        buildCtx.indexDoc = createDocument(indexSrcHtml);
      }
    }

    await readPackageJson(config, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // run typescript program
    const tsTimeSpan = buildCtx.createTimeSpan('transpile started');
    const componentDtsChanged = await runTsProgram(config, buildCtx, tsBuilder);
    tsTimeSpan.finish('transpile finished');
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (config.watch && componentDtsChanged) {
      // silent abort for watch mode only
      return null;
    }

    // preprocess and generate styles before any outputTarget starts
    buildCtx.stylesPromise = generateGlobalStyles(config, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // create outputs
    await generateOutputTargets(config, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // write outputs
    await buildCtx.stylesPromise;
    await writeBuild(config, buildCtx);
  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // TODO
  // clear changed files
  getStencilCompilerContext().changedFiles.clear();

  // return what we've learned today
  return buildFinish(buildCtx);
};
