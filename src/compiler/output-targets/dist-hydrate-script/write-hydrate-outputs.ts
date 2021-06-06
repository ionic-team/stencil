import type * as d from '../../../declarations';
import { basename, join } from 'path';
import { relocateHydrateContextConst } from './relocate-hydrate-context';
import type { RollupOutput } from 'rollup';

export const writeHydrateOutputs = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[], rollupOutput: RollupOutput) => {
  return Promise.all(
    outputTargets.map(outputTarget => {
      return writeHydrateOutput(config, compilerCtx, buildCtx, outputTarget, rollupOutput);
    }),
  );
};

const writeHydrateOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetHydrate, rollupOutput: RollupOutput) => {
  const hydratePackageName = await getHydratePackageName(config, compilerCtx);

  const hydrateAppDirPath = outputTarget.dir;

  const hydrateCoreIndexPath = join(hydrateAppDirPath, 'index.js');
  const hydrateCoreIndexDtsFilePath = join(hydrateAppDirPath, 'index.d.ts');

  const pkgJsonPath = join(hydrateAppDirPath, 'package.json');
  const pkgJsonCode = getHydratePackageJson(config, hydrateCoreIndexPath, hydrateCoreIndexDtsFilePath, hydratePackageName);

  await Promise.all([copyHydrateRunnerDts(config, compilerCtx, hydrateAppDirPath), compilerCtx.fs.writeFile(pkgJsonPath, pkgJsonCode)]);

  // always remember a path to the hydrate app that the prerendering may need later on
  buildCtx.hydrateAppFilePath = hydrateCoreIndexPath;

  await Promise.all(
    rollupOutput.output.map(async output => {
      if (output.type === 'chunk') {
        output.code = relocateHydrateContextConst(config, compilerCtx, output.code);
        const filePath = join(hydrateAppDirPath, output.fileName);
        await compilerCtx.fs.writeFile(filePath, output.code, { immediateWrite: true });
      }
    }),
  );
};

const getHydratePackageJson = (config: d.Config, hydrateAppFilePath: string, hydrateDtsFilePath: string, hydratePackageName: string) => {
  const pkg: d.PackageJsonData = {
    name: hydratePackageName,
    description: `${config.namespace} component hydration app.`,
    main: basename(hydrateAppFilePath),
    types: basename(hydrateDtsFilePath),
  };
  return JSON.stringify(pkg, null, 2);
};

const getHydratePackageName = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  try {
    const rootPkgFilePath = join(config.rootDir, 'package.json');
    const pkgStr = await compilerCtx.fs.readFile(rootPkgFilePath);
    const pkgData = JSON.parse(pkgStr) as d.PackageJsonData;
    return `${pkgData.name}/hydrate`;
  } catch (e) {}

  return `${config.fsNamespace}/hydrate`;
};

const copyHydrateRunnerDts = async (config: d.Config, compilerCtx: d.CompilerCtx, hydrateAppDirPath: string) => {
  const packageDir = join(config.sys.getCompilerExecutingPath(), '..', '..');
  const srcHydrateDir = join(packageDir, 'internal', 'hydrate', 'runner.d.ts');

  const runnerDtsDestPath = join(hydrateAppDirPath, 'index.d.ts');

  await compilerCtx.fs.copyFile(srcHydrateDir, runnerDtsDestPath);
};
