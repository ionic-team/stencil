import { createDocument } from '@stencil/core/mock-doc';
import { catchError, isString, readPackageJson } from '@utils';
import ts from 'typescript';

import type * as d from '../../declarations';
import { generateOutputTargets } from '../output-targets';
import { emptyOutputTargets } from '../output-targets/empty-dir';
import { generateGlobalStyles } from '../style/global-styles';
import { runTsProgram } from '../transpile/run-program';
import { buildAbort, buildFinish } from './build-finish';
import { writeBuild } from './write-build';

export const build = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  tsBuilder: ts.BuilderProgram
) => {
  console.log('build function::1');
  try {
    // reset process.cwd() for 3rd-party plugins
    process.chdir(config.rootDir);

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
    if (buildCtx.hasError) return buildAbort(buildCtx);

    // run typescript program
    const tsTimeSpan = buildCtx.createTimeSpan('transpile started');
    const componentDtsChanged = await runTsProgram(config, compilerCtx, buildCtx, tsBuilder);
    tsTimeSpan.finish('transpile finished');
    if (buildCtx.hasError) return buildAbort(buildCtx);

    if (config.watch && componentDtsChanged) {
      // silent abort for watch mode only
      return null;
    }

  console.log('build function::2');
    // preprocess and generate styles before any outputTarget starts
    buildCtx.stylesPromise = generateGlobalStyles(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

  console.log('build function::3');
    // create outputs
    await generateOutputTargets(config, compilerCtx, buildCtx);
    if (buildCtx.hasError) return buildAbort(buildCtx);

  console.log('build function::4');
    // write outputs
    await buildCtx.stylesPromise;
    await writeBuild(config, compilerCtx, buildCtx);
  console.log('build function::5');
  } catch (e: any) {
  console.log('build function::6');
    console.log('caught error in the build');
    console.log(e);
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // TODO
  // clear changed files
  compilerCtx.changedFiles.clear();

  // return what we've learned today
  console.log('build function::4');
  return buildFinish(buildCtx);
};
