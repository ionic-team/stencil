import * as d from '@declarations';
import { isOutputTargetHydrate } from '../output-targets/output-utils';
import { normalizePath } from '@utils';
import { sys } from '@sys';
import { writeAngularOutputs } from './write-hydrate-angular-module';


export async function writeHydrateOutputs(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetHydrate[], code: string) {
  // no matter what, we need to write at least one hydrate app file to disk
  // so it can be used later for prerendering
  // find at least one good place to save to disk
  // and later on we'll copy this hydrate app to all the output targets needed
  const hydrateOutputTarget = outputTargets.find(isOutputTargetHydrate);
  const hydrateAppDirPath = hydrateOutputTarget.dir;
  const hydrateAppFilePath = sys.path.join(hydrateAppDirPath, HYDRATE_JS_FILE_NAME);

  await Promise.all([
    writeHydrateOutputFiles(config, compilerCtx, outputTargets, code)
  ]);

  await writeAngularOutputs(config, compilerCtx, config.outputTargets, hydrateAppFilePath);

  buildCtx.hydrateAppFilePath = hydrateAppFilePath;
}

function writeHydrateOutputFiles(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTargetHydrate[], hydrateAppCode: string) {
  return Promise.all(outputTargets.map(outputTarget => {
    return writeHydrateOutput(config, compilerCtx, outputTarget, hydrateAppCode);
  }));
}


function writeHydrateOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, hydrateAppCode: string) {
  const hydrateAppDirPath = outputTarget.dir;

  const hydrateAppFilePath = sys.path.join(hydrateAppDirPath, HYDRATE_JS_FILE_NAME);
  const hydrateAppDtsFilePath = sys.path.join(hydrateAppDirPath, HYDRATE_DTS_FILE_NAME);

  const indexPath = sys.path.join(hydrateAppDirPath, 'index.js');
  const indexCode = getServerIndexCode(indexPath, hydrateAppFilePath);

  const pkgJsonPath = sys.path.join(hydrateAppDirPath, 'package.json');
  const pkgJsonCode = getServerPackageJson(config);

  return Promise.all([
    compilerCtx.fs.writeFile(hydrateAppFilePath, hydrateAppCode),
    compilerCtx.fs.writeFile(hydrateAppDtsFilePath, HYDRATE_DTS_CODE),
    compilerCtx.fs.writeFile(indexPath, indexCode),
    compilerCtx.fs.writeFile(pkgJsonPath, pkgJsonCode)
  ]);
}


function getServerPackageJson(config: d.Config) {
  const pkg: d.PackageJsonData = {
    name: `${config.fsNamespace}/server`,
    main: 'index.js'
  };
  return JSON.stringify(pkg, null, 2);
}


function getServerIndexCode(indexPath: string, hydrateAppFilePath: string) {
  const serverModuleFileDir = sys.path.dirname(indexPath);

  let requirePath = normalizePath(sys.path.relative(serverModuleFileDir, hydrateAppFilePath));
  if (!requirePath.startsWith('/') && !requirePath.startsWith('.')) {
    requirePath = './' + requirePath;
  }

  return `
const hydrate = require('${requirePath}');
exports.hydrateDocumentSync = hydrate.hydrateDocumentSync;
exports.renderToStringSync = hydrate.renderToStringSync;
`.trim();
}


const HYDRATE_JS_FILE_NAME = `hydrate.js`;
const HYDRATE_DTS_FILE_NAME = `hydrate.d.ts`;

const HYDRATE_DTS_CODE = `
export declare function renderToStringSync(html: string, opts?: any): any;
export declare function hydrateDocumentSync(doc: any, opts?: any): any;
`.trim();
