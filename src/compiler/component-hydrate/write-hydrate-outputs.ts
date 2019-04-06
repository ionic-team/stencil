import * as d from '../../declarations';


export function writeHydrateOutputs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[], hydrateAppCode: string) {
  return Promise.all(outputTargets.map(outputTarget => {
    return writeHydrateOutput(config, compilerCtx, buildCtx, outputTarget, hydrateAppCode);
  }));
}


async function writeHydrateOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetHydrate, hydrateAppCode: string) {
  const hydrateAppDirPath = outputTarget.dir;

  const hydrateAppFilePath = config.sys.path.join(hydrateAppDirPath, 'index.js');
  const hydrateAppDtsFilePath = config.sys.path.join(hydrateAppDirPath, 'index.d.ts');

  // always remember a path to the hydrate app that the prerendering may need later on
  buildCtx.hydrateAppFilePath = hydrateAppFilePath;

  const pkgJsonPath = config.sys.path.join(hydrateAppDirPath, 'package.json');
  const pkgJsonCode = await getHydratePackageJson(config, compilerCtx, hydrateAppFilePath, hydrateAppDtsFilePath);

  // dirty hack to make sure patchNodeGlobal(global) runs immediately before everything else
  hydrateAppCode = hydrateAppCode.replace(`patchNodeGlobal(global);`, ``);
  hydrateAppCode = hydrateAppCode.replace(`'use strict';`, `'use strict'; patchNodeGlobal(global);`);

  return Promise.all([
    compilerCtx.fs.writeFile(hydrateAppFilePath, hydrateAppCode),
    compilerCtx.fs.writeFile(hydrateAppDtsFilePath, HYDRATE_DTS_CODE),
    compilerCtx.fs.writeFile(pkgJsonPath, pkgJsonCode)
  ]);
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


const HYDRATE_DTS_CODE = `
export declare function renderToString(html: string, opts?: any): Promise<any>;
export declare function hydrateDocument(doc: any, opts?: any): Promise<any>;
`.trim();
