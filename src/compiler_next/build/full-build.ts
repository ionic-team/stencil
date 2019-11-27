import * as d from '../../declarations';
import { build } from './build';
import { BuildContext } from '../../compiler/build/build-ctx';
import ts from 'typescript';
import { createTsBuildProgram } from '../transpile/create-build-program';


export const createFullBuild = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  return new Promise<d.CompilerBuildResults>(resolve => {

    let tsWatchProgram: ts.WatchOfConfigFile<ts.BuilderProgram> = null;

    compilerCtx.events.on('fileUpdate', p => {
      compilerCtx.fs.clearFileCache(p);
    });

    const onBuild = async (tsBuilder: ts.BuilderProgram) => {
      const buildCtx = new BuildContext(config, compilerCtx);
      buildCtx.isRebuild = false;
      buildCtx.requiresFullBuild = true;
      buildCtx.start();

      const result = await build(config, compilerCtx, buildCtx, tsBuilder);
      if (result !== null) {
        tsWatchProgram.close();
        tsWatchProgram = null;
        resolve(result);
      }
    };
    createTsBuildProgram(config, onBuild).then(program => {
      tsWatchProgram = program;
    });
  });
};
