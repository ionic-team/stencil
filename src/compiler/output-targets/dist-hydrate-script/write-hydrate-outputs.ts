import { join } from '@utils';
import { basename } from 'path';
import type { RollupOutput } from 'rollup';

import type * as d from '../../../declarations';
import { relocateHydrateContextConst } from './relocate-hydrate-context';

export const writeHydrateOutputs = (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTargets: d.OutputTargetHydrate[],
  rollupCjsOutput: RollupOutput,
  rollupEsmOutput: RollupOutput,
) => {
  return Promise.all(
    outputTargets.map((outputTarget) => {
      return writeHydrateOutput(config, compilerCtx, buildCtx, outputTarget, rollupCjsOutput, rollupEsmOutput);
    }),
  );
};

const writeHydrateOutput = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetHydrate,
  rollupCjsOutput: RollupOutput,
  rollupEsmOutput: RollupOutput,
) => {
  const hydratePackageName = await getHydratePackageName(config, compilerCtx);

  const hydrateAppDirPath = outputTarget.dir;

  const hydrateCoreIndexCjsPath = join(hydrateAppDirPath, 'index.js');
  const hydrateCoreIndexEsmPath = join(hydrateAppDirPath, 'index.mjs');
  const hydrateCoreIndexDtsFilePath = join(hydrateAppDirPath, 'index.d.ts');

  const pkgJsonPath = join(hydrateAppDirPath, 'package.json');
  const pkgJsonCode = getHydratePackageJson(
    config,
    hydrateCoreIndexCjsPath,
    hydrateCoreIndexEsmPath,
    hydrateCoreIndexDtsFilePath,
    hydratePackageName,
  );

  await Promise.all([
    copyHydrateRunnerDts(config, compilerCtx, hydrateAppDirPath),
    compilerCtx.fs.writeFile(pkgJsonPath, pkgJsonCode),
  ]);

  // always remember a path to the hydrate app that the prerendering may need later on
  buildCtx.hydrateAppFilePath = hydrateCoreIndexCjsPath;

  await Promise.all(
    [...rollupCjsOutput.output, ...rollupEsmOutput.output].map(async (output) => {
      if (output.type === 'chunk') {
        output.code = relocateHydrateContextConst(config, compilerCtx, output.code);
        const filePath = join(hydrateAppDirPath, output.fileName);
        await compilerCtx.fs.writeFile(filePath, output.code, { immediateWrite: true });
      }
    }),
  );
};

const getHydratePackageJson = (
  config: d.ValidatedConfig,
  hydrateAppCjsFilePath: string,
  hydrateAppEsmFilePath: string,
  hydrateDtsFilePath: string,
  hydratePackageName: string,
) => {
  const pkg: d.PackageJsonData = {
    name: hydratePackageName,
    description: `${config.namespace} component hydration app.`,
    main: basename(hydrateAppCjsFilePath),
    module: basename(hydrateAppEsmFilePath),
    types: basename(hydrateDtsFilePath),
  };
  return JSON.stringify(pkg, null, 2);
};

const getHydratePackageName = async (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => {
  try {
    const rootPkgFilePath = join(config.rootDir, 'package.json');
    const pkgStr = await compilerCtx.fs.readFile(rootPkgFilePath);
    const pkgData = JSON.parse(pkgStr) as d.PackageJsonData;
    return `${pkgData.name}/hydrate`;
  } catch (e) {}

  return `${config.fsNamespace}/hydrate`;
};

const copyHydrateRunnerDts = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  hydrateAppDirPath: string,
) => {
  const packageDir = join(config.sys.getCompilerExecutingPath(), '..', '..');
  const srcHydrateDir = join(packageDir, 'internal', 'hydrate', 'runner.d.ts');

  const runnerDtsDestPath = join(hydrateAppDirPath, 'index.d.ts');

  await compilerCtx.fs.copyFile(srcHydrateDir, runnerDtsDestPath);
};
