import * as d from '../../declarations';
import { RollupOutput } from 'rollup';


export function writeHydrateOutputs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[], rollupOutput: RollupOutput) {
  return Promise.all(outputTargets.map(outputTarget => {
    return writeHydrateOutput(config, compilerCtx, buildCtx, outputTarget, rollupOutput);
  }));
}


async function writeHydrateOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetHydrate, rollupOutput: RollupOutput) {
  const hydrateAppFileName = getHydrateAppFileName(config);
  const hydratePackageName = await getHydratePackageName(config, compilerCtx);

  const hydrateAppDirPath = outputTarget.dir;

  const hydrateCoreIndexPath = config.sys.path.join(hydrateAppDirPath, 'index.js');
  const hydrateCoreIndexDtsFilePath = config.sys.path.join(hydrateAppDirPath, 'index.d.ts');

  const pkgJsonPath = config.sys.path.join(hydrateAppDirPath, 'package.json');
  const pkgJsonCode = getHydratePackageJson(config, hydrateCoreIndexPath, hydrateCoreIndexDtsFilePath, hydratePackageName);

  const writePromises: Promise<any>[] = [
    copyHydrateRunner(config, compilerCtx, hydrateAppDirPath, hydrateAppFileName, hydratePackageName),
    compilerCtx.fs.writeFile(pkgJsonPath, pkgJsonCode)
  ];

  rollupOutput.output.forEach(output => {
    const filePath = config.sys.path.join(hydrateAppDirPath, output.fileName);
    writePromises.push(compilerCtx.fs.writeFile(filePath, output.code));
  });

  // always remember a path to the hydrate app that the prerendering may need later on
  buildCtx.hydrateAppFilePath = hydrateCoreIndexPath;

  return Promise.all(writePromises);
}


function getHydratePackageJson(config: d.Config, hydrateAppFilePath: string, hydrateDtsFilePath: string, hydratePackageName: string) {
  const pkg: d.PackageJsonData = {
    name: hydratePackageName,
    description: `${config.namespace} component hydration app built for a NodeJS environment.`,
    main: config.sys.path.basename(hydrateAppFilePath),
    types: config.sys.path.basename(hydrateDtsFilePath)
  };
  return JSON.stringify(pkg, null, 2);
}


async function getHydratePackageName(config: d.Config, compilerCtx: d.CompilerCtx) {
  try {
    const rootPkgFilePath = config.sys.path.join(config.rootDir, 'package.json');
    const pkgStr = await compilerCtx.fs.readFile(rootPkgFilePath);
    const pkgData = JSON.parse(pkgStr) as d.PackageJsonData;
    return `${pkgData.name}/hydrate`;
  } catch (e) {}

  return `${config.fsNamespace}/hydrate`;
}


export function getHydrateAppFileName(config: d.Config) {
  return `${config.fsNamespace}-hydrate.js`;
}


async function copyHydrateRunner(config: d.Config, compilerCtx: d.CompilerCtx, hydrateAppDirPath: string, hydrateAppFileName: string, hydratePackageName: string) {
  const srcHydrateDir = config.sys.path.join(config.sys.compiler.distDir, 'hydrate');

  const runnerIndexFileName = 'index.js';
  const runnerDtsFileName = 'index.d.ts';

  const runnerSrcPath = config.sys.path.join(srcHydrateDir, runnerIndexFileName);
  const runnerDtsSrcPath = config.sys.path.join(srcHydrateDir, runnerDtsFileName);

  const runnerDestPath = config.sys.path.join(hydrateAppDirPath, runnerIndexFileName);
  const runnerDtsDestPath = config.sys.path.join(hydrateAppDirPath, runnerDtsFileName);

  let runnerSrcCode = await compilerCtx.fs.readFile(runnerSrcPath);

  runnerSrcCode = runnerSrcCode.replace('$$HYDRATE_APP_FILENAME$$', hydrateAppFileName);
  runnerSrcCode = runnerSrcCode.replace('$$HYDRATE_APP_PACKAGE_NAME$$', hydratePackageName);

  await Promise.all([
    compilerCtx.fs.writeFile(runnerDestPath, runnerSrcCode),
    compilerCtx.fs.copyFile(runnerDtsSrcPath, runnerDtsDestPath)
  ]);
}
