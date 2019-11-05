import * as d from '../../declarations';
import { isOutputTargetDist } from '../output-targets/output-utils';
import { normalizePath } from '@utils';


export function updateStencilTypesImports(path: d.Path, typesDir: string, dtsFilePath: string, dtsContent: string) {
  const dir = path.dirname(dtsFilePath);
  const relPath = path.relative(dir, typesDir);

  let coreDtsPath = path.join(relPath, CORE_FILENAME);
  if (!coreDtsPath.startsWith('.')) {
    coreDtsPath = `./${coreDtsPath}`;
  }

  coreDtsPath = normalizePath(coreDtsPath);
  if (dtsContent.includes('@stencil/core')) {
    dtsContent = dtsContent.replace(/(from\s*(:?'|"))@stencil\/core\/internal('|")/g, `$1${coreDtsPath}$2`);
    dtsContent = dtsContent.replace(/(from\s*(:?'|"))@stencil\/core('|")/g, `$1${coreDtsPath}$2`);
  }
  return dtsContent;
}


export async function copyStencilCoreDts(config: d.Config, compilerCtx: d.CompilerCtx) {
  const typesOutputTargets = config.outputTargets
    .filter(isOutputTargetDist)
    .filter(o => o.typesDir);

  const srcStencilCoreDts = await config.sys.getClientCoreFile({
    staticName: 'declarations/stencil.core.d.ts'
  });

  return Promise.all(typesOutputTargets.map(outputTarget => {
    const coreDtsFilePath = config.sys.path.join(outputTarget.typesDir, CORE_DTS);
    return compilerCtx.fs.writeFile(coreDtsFilePath, srcStencilCoreDts);
  }));
}


const CORE_FILENAME = `stencil.core`;
const CORE_DTS = `${CORE_FILENAME}.d.ts`;
