import * as d from '../../declarations';
import { buildAbort, buildFinish } from './build-finish';
import { catchError } from '@utils';
import { emptyOutputTargets } from '../../compiler/output-targets/empty-dir';
import { generateOutputTargets } from '../output-targets/generate-output-targets';
import { runTsProgram } from '../transpile/run-program';
import { writeBuild } from './write-build';
import ts from 'typescript';


export const build = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => {
  try {
    // empty the directories on the first build
    await emptyOutputTargets(config, compilerCtx, buildCtx);
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

    // create outputs
    await generateOutputTargets(config, compilerCtx, buildCtx, tsBuilder);
    if (buildCtx.hasError) return buildAbort(buildCtx);

    /// write outputs
    await writeBuild(config, compilerCtx, buildCtx);

  } catch (e) {
    // ¯\_(ツ)_/¯
    catchError(buildCtx.diagnostics, e);
  }

  // return what we've learned today
  return buildFinish(buildCtx);
};
