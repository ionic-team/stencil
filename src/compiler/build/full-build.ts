import type * as d from '../../declarations';
import { build } from './build';
import { BuildContext } from './build-ctx';
import { createTsBuildProgram } from '../transpile/create-build-program';
import ts from 'typescript';
import { getStencilCompilerContext } from '@utils';

export const createFullBuild = async (config: d.Config) => {
  return new Promise<d.CompilerBuildResults>((resolve) => {
    let tsWatchProgram: ts.WatchOfConfigFile<ts.BuilderProgram> = null;

    getStencilCompilerContext().events.on('fileUpdate', (p) => {
      config.logger.debug(`fileUpdate: ${p}`);
      getStencilCompilerContext().fs.clearFileCache(p);
    });

    const onBuild = async (tsBuilder: ts.BuilderProgram) => {
      const buildCtx = new BuildContext(config);
      buildCtx.isRebuild = false;
      buildCtx.requiresFullBuild = true;
      buildCtx.start();

      const result = await build(config, buildCtx, tsBuilder);
      if (result !== null) {
        if (tsWatchProgram) {
          tsWatchProgram.close();
          tsWatchProgram = null;
        }
        resolve(result);
      }
    };

    createTsBuildProgram(config, onBuild).then((program) => {
      tsWatchProgram = program;
    });
  });
};
