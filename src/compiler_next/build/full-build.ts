import * as d from '../../declarations';
import { build } from './build';
import { BuildContext } from './build-ctx';
import { createTsBuildProgram } from '../transpile/create-build-program';
import ts from 'typescript';

export const createFullBuild = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  return new Promise<d.CompilerBuildResults>(resolve => {
    let tsWatchProgram: ts.WatchOfConfigFile<ts.BuilderProgram> = null;

    compilerCtx.events.on('fileUpdate', p => {
      config.logger.debug(`fileUpdate: ${p}`);
      compilerCtx.fs.clearFileCache(p);
    });

    const onBuild = async (tsBuilder: ts.BuilderProgram) => {
      const buildCtx = new BuildContext(config, compilerCtx);
      buildCtx.isRebuild = false;
      buildCtx.requiresFullBuild = true;
      buildCtx.start();

      const result = await build(config, compilerCtx, buildCtx, tsBuilder);
      if (result !== null) {
        if (tsWatchProgram) {
          tsWatchProgram.close();
          tsWatchProgram = null;
        }
        resolve(result);
      }
    };

    createTsBuildProgram(config, onBuild).then(program => {
      tsWatchProgram = program;
    });
  });
};
