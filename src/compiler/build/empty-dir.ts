import * as d from '../../declarations';


export async function emptyOutputTargetDirs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.isRebuild) {
    // only empty the directories on the first build
    return;
  }

  // let's empty out the build dest directory
  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.empty === true);

  await Promise.all(outputTargets.map(async outputTarget => {
    config.logger.debug(`empty dir: ${outputTarget.dir}`);

    // Check if there is a .gitkeep file
    // We want to keep it so people don't have to readd manually
    // to their projects each time.
    const gitkeepPath = config.sys.path.join(outputTarget.dir, '.gitkeep');
    const existsGitkeep = await compilerCtx.fs.access(gitkeepPath);

    await compilerCtx.fs.emptyDir(outputTarget.dir);

    // If there was a .gitkeep file, add it again.
    if (existsGitkeep) {
      await compilerCtx.fs.writeFile(gitkeepPath, '', { immediateWrite: true });
    }
  }));
}
