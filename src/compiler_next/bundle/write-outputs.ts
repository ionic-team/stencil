import * as d from '../../declarations';
import { normalizePath } from '@utils';
import { OutputChunk, RollupOutput } from 'rollup';
import path from 'path';


export const writeBuildOutputs = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetBaseNext[], rollupOutput: RollupOutput) => {
  const promises = outputTargets.map(outputTarget => {
    return writeBuildOutput(compilerCtx, buildCtx, outputTarget, rollupOutput);
  });
  return Promise.all(promises);
};


const writeBuildOutput = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetBaseNext, rollupOutput: RollupOutput) => {
  const buildOutputTarget: d.BuildOutput = {
    type: outputTarget.type,
    files: []
  };
  buildCtx.outputs.push(buildOutputTarget);

  const promises: Promise<any>[] = [];

  rollupOutput.output.forEach(output => {
    const outputFilePath = normalizePath(path.join(outputTarget.dir, output.fileName));
    promises.push(
      compilerCtx.fs.writeFile(outputFilePath, (output as OutputChunk).code)
    );
    buildOutputTarget.files.push(outputFilePath);

    const map = (output as OutputChunk).map;
    if (map) {
      const outputMapFilePath = outputFilePath + '.map';
      const mapCode = map.toString();
      promises.push(
        compilerCtx.fs.writeFile(outputMapFilePath, mapCode)
      );
      buildOutputTarget.files.push(outputMapFilePath);
    }
  });

  return Promise.all(promises);
};
