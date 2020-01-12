import * as d from '../../../declarations';
import { RollupOutput, OutputChunk } from 'rollup';
import { basename, join } from 'path';
import { getGlobalScriptPaths } from '../../bundle/app-data-plugin';
import { HYDRATE_APP_CLOSURE_START } from './hydrate-factory-closure';


export const writeHydrateOutputs = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[], rollupOutput: RollupOutput) => {
  return Promise.all(outputTargets.map(outputTarget => {
    return writeHydrateOutput(config, compilerCtx, buildCtx, outputTarget, rollupOutput);
  }));
};


const writeHydrateOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetHydrate, rollupOutput: RollupOutput) => {
  const hydratePackageName = await getHydratePackageName(config, compilerCtx);

  const hydrateAppDirPath = outputTarget.dir;

  const hydrateCoreIndexPath = join(hydrateAppDirPath, 'index.js');
  const hydrateCoreIndexDtsFilePath = join(hydrateAppDirPath, 'index.d.ts');

  const pkgJsonPath = join(hydrateAppDirPath, 'package.json');
  const pkgJsonCode = getHydratePackageJson(config, hydrateCoreIndexPath, hydrateCoreIndexDtsFilePath, hydratePackageName);

  await Promise.all([
    copyHydrateRunnerDts(config, compilerCtx, hydrateAppDirPath),
    compilerCtx.fs.writeFile(pkgJsonPath, pkgJsonCode)
  ]);

  // always remember a path to the hydrate app that the prerendering may need later on
  buildCtx.hydrateAppFilePath = hydrateCoreIndexPath;

  await Promise.all(rollupOutput.output.map(async output => {
    if (output.type === 'chunk') {
      relocateHydrateContextConst(config, compilerCtx, output);
      const filePath = join(hydrateAppDirPath, output.fileName);
      await compilerCtx.fs.writeFile(filePath, output.code);
    }
  }));
};


const getHydratePackageJson = (config: d.Config, hydrateAppFilePath: string, hydrateDtsFilePath: string, hydratePackageName: string) => {
  const pkg: d.PackageJsonData = {
    name: hydratePackageName,
    description: `${config.namespace} component hydration app.`,
    main: basename(hydrateAppFilePath),
    types: basename(hydrateDtsFilePath)
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
  const packageDir = join(config.sys_next.getCompilerExecutingPath(), '..', '..');
  const srcHydrateDir = join(packageDir, 'internal', 'hydrate', 'runner.d.ts');

  const runnerDtsDestPath = join(hydrateAppDirPath, 'index.d.ts');

  await compilerCtx.fs.copyFile(srcHydrateDir, runnerDtsDestPath);
};

const relocateHydrateContextConst = (config: d.Config, compilerCtx: d.CompilerCtx, output: OutputChunk) => {
  // for whatever reason, const Context = {};
  // is not hoisted to the correct location when bundled,
  // so manually doing it here

  // /*hydrate context start*/export const Context = {};/*hydrate context end*/

  const globalPaths = getGlobalScriptPaths(config, compilerCtx);
  if (globalPaths.length > 0) {
    const startCode = output.code.indexOf('/*hydrate context start*/');
    const endCode = output.code.indexOf('/*hydrate context end*/') + '/*hydrate context end*/'.length;

    const hydrateContextCode = output.code.substring(startCode, endCode);
    output.code = output.code.replace(hydrateContextCode, '');

    output.code = output.code.replace(HYDRATE_APP_CLOSURE_START, HYDRATE_APP_CLOSURE_START + '\n  ' + hydrateContextCode);
  }
};
