import * as d from '@declarations';
import { isOutputTargetDist } from '../output-targets/output-utils';
import { normalizePath } from '@utils';
import { sys } from '@sys';


export function writeDistOutputs(config: d.Config, compilerCtx: d.CompilerCtx, outputTargets: d.OutputTarget[], hydrateAppFilePath: string) {
  const distOutputTargets = outputTargets.filter(isOutputTargetDist);

  return Promise.all(distOutputTargets.map(outputTarget => {
    return writeDistOutput(config, compilerCtx, outputTarget, hydrateAppFilePath);
  }));
}


function writeDistOutput(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, hydrateAppFilePath: string) {
  const indexPath = sys.path.join(outputTarget.buildDir, 'server', 'index.js');
  const indexCode = getServerDistIndex(indexPath, hydrateAppFilePath);

  const pkgJsonPath = sys.path.join(sys.path.dirname(indexPath), 'package.json');
  const pkgJsonCode = getServerPackageJson(config);

  return Promise.all([
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


function getServerDistIndex(indexPath: string, hydrateAppFilePath: string) {
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
