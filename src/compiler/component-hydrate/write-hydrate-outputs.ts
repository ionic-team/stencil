import * as d from '../../declarations';
import { RollupOutput } from 'rollup';


export function writeHydrateOutputs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[], rollupOutput: RollupOutput) {
  return Promise.all(outputTargets.map(outputTarget => {
    return writeHydrateOutput(config, compilerCtx, buildCtx, outputTarget, rollupOutput);
  }));
}


async function writeHydrateOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetHydrate, rollupOutput: RollupOutput) {
  const hydrateAppDirPath = outputTarget.dir;

  const hydrateCoreIndexPath = config.sys.path.join(hydrateAppDirPath, 'index.js');
  const hydrateCoreIndexDtsFilePath = config.sys.path.join(hydrateAppDirPath, 'index.d.ts');

  const pkgJsonPath = config.sys.path.join(hydrateAppDirPath, 'package.json');
  const pkgJsonCode = await getHydratePackageJson(config, compilerCtx, hydrateCoreIndexPath, hydrateCoreIndexDtsFilePath);

  const writePromises: Promise<any>[] = [
    copyHydrateRunner(config, hydrateAppDirPath),
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


async function getHydratePackageJson(config: d.Config, compilerCtx: d.CompilerCtx, hydrateAppFilePath: string, hydrateDtsFilePath: string) {
  let pkgName: string;
  try {
    const rootPkgFilePath = config.sys.path.join(config.rootDir, 'package.json');
    const pkgStr = await compilerCtx.fs.readFile(rootPkgFilePath);
    const pkgData = JSON.parse(pkgStr) as d.PackageJsonData;
    pkgName = `${pkgData.name}/hydrate`;

  } catch (e) {
    pkgName = `${config.fsNamespace}/hydrate`;
  }

  const pkg: d.PackageJsonData = {
    name: pkgName,
    main: config.sys.path.basename(hydrateAppFilePath),
    types: config.sys.path.basename(hydrateDtsFilePath)
  };
  return JSON.stringify(pkg, null, 2);
}


async function copyHydrateRunner(config: d.Config, hydrateAppDirPath: string) {
  const srcHydrateDir = config.sys.path.join(config.sys.compiler.distDir, 'hydrate');

  const runnerIndexFileName = 'index.js';
  const runnerDtsFileName = 'index.d.ts';

  const runnerSrcPath = config.sys.path.join(srcHydrateDir, runnerIndexFileName);
  const runnerDtsSrcPath = config.sys.path.join(srcHydrateDir, runnerDtsFileName);

  const runnerDestPath = config.sys.path.join(hydrateAppDirPath, runnerIndexFileName);
  const runnerDtsDestPath = config.sys.path.join(hydrateAppDirPath, runnerDtsFileName);

  await Promise.all([
    config.sys.fs.copyFile(runnerSrcPath, runnerDestPath),
    config.sys.fs.copyFile(runnerDtsSrcPath, runnerDtsDestPath)
  ]);
}
