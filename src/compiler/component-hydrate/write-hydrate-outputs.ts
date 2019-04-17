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
    compilerCtx.fs.writeFile(hydrateCoreIndexDtsFilePath, HYDRATE_DTS_CODE),
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


const HYDRATE_DTS_CODE = `
export declare function renderToString(html: string, opts?: any): Promise<any>;
export declare function hydrateDocument(doc: any, opts?: any): Promise<any>;
`.trim();
