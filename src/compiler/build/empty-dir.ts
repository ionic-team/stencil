import * as d from '../../declarations';


export async function emptyOutputTargetDirs(config: d.Config, compilerCtx: d.CompilerCtx) {
  if (compilerCtx.isRebuild) {
    // only empty the directories on the first build
    return;
  }

  // let's empty out the build dest directory
  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.empty === true);

  await Promise.all(outputTargets.map(async outputTarget => {
    config.logger.debug(`empty dir: ${outputTarget.dir}`);

    await compilerCtx.fs.emptyDir(outputTarget.dir);
  }));
}
