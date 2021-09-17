import type * as d from '../../declarations';
import { buildAbort, buildFinish } from './build-finish';
import { catchError, isString, readPackageJson } from '@utils';
import { createDocument } from '@stencil/core/mock-doc';
import { emptyOutputTargets } from '../output-targets/empty-dir';
import { generateGlobalStyles } from '../style/global-styles';
import { generateOutputTargets } from '../output-targets';
import { runTsProgram } from '../transpile/run-program';
import { writeBuild } from './write-build';
import ts from 'typescript';

export const build = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  tsBuilder: ts.BuilderProgram
) => {
  try {
    console.log('build::entered')
    // reset process.cwd() for 3rd-party plugins
    process.chdir(config.rootDir);
    console.log('build::passed chdir')
    // empty the directories on the first build
    await emptyOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (config.srcIndexHtml) {
      const indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);
      if (isString(indexSrcHtml)) {
        buildCtx.indexDoc = createDocument(indexSrcHtml);
      }
    }

    await readPackageJson(config, compilerCtx, buildCtx);
    console.log("build::Did we fail to read package.json", buildCtx.hasError)
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // run typescript program
    const tsTimeSpan = buildCtx.createTimeSpan('transpile started');
    const componentDtsChanged = await runTsProgram(config, compilerCtx, buildCtx, tsBuilder);
    tsTimeSpan.finish('transpile finished');
    console.log("build::Did we fail to transpile", buildCtx.hasError)
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (config.watch && componentDtsChanged) {
      // silent abort for watch mode only
      console.log("build::Silent abort for watch mode only", buildCtx.hasError)
      return null;
    }

    // preprocess and generate styles before any outputTarget starts
    buildCtx.stylesPromise = generateGlobalStyles(config, compilerCtx, buildCtx);
    console.log("build::Did we fail to generate global styles", buildCtx.hasError)
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // create outputs
    await generateOutputTargets(config, compilerCtx, buildCtx);
    console.log("build::Did we fail to generateOutputTargets", buildCtx.hasError)
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // write outputs
    await buildCtx.stylesPromise;
    await writeBuild(config, compilerCtx, buildCtx);
  } catch (e) {
    // ¯\_(ツ)_/¯
    console.log("build::shruggie man")
    catchError(buildCtx.diagnostics, e);
  }

  // TODO
  // clear changed files
  compilerCtx.changedFiles.clear();

  console.log('build::done!!!')
  // return what we've learned today
  return buildFinish(buildCtx);
};
