import type * as d from '../../declarations';
import { dirname, join, relative } from 'path';
import { isOutputTargetDistTypes } from '../output-targets/output-utils';
import { normalizePath } from '@utils';

export const updateStencilTypesImports = (typesDir: string, dtsFilePath: string, dtsContent: string) => {
  const dir = dirname(dtsFilePath);
  const relPath = relative(dir, typesDir);

  let coreDtsPath = join(relPath, CORE_FILENAME);
  if (!coreDtsPath.startsWith('.')) {
    coreDtsPath = `./${coreDtsPath}`;
  }

  coreDtsPath = normalizePath(coreDtsPath);
  if (dtsContent.includes('@stencil/core')) {
    dtsContent = dtsContent.replace(/(from\s*(:?'|"))@stencil\/core\/internal('|")/g, `$1${coreDtsPath}$2`);
    dtsContent = dtsContent.replace(/(from\s*(:?'|"))@stencil\/core('|")/g, `$1${coreDtsPath}$2`);
  }
  return dtsContent;
};

export const copyStencilCoreDts = async (config: d.Config, compilerCtx: d.CompilerCtx) => {
  const typesOutputTargets = config.outputTargets.filter(isOutputTargetDistTypes).filter((o) => o.typesDir);

  const srcStencilDtsPath = join(config.sys.getCompilerExecutingPath(), '..', '..', 'internal', CORE_DTS);
  const srcStencilCoreDts = await compilerCtx.fs.readFile(srcStencilDtsPath);

  return Promise.all(
    typesOutputTargets.map((o) => {
      const coreDtsFilePath = join(o.typesDir, CORE_DTS);
      return compilerCtx.fs.writeFile(coreDtsFilePath, srcStencilCoreDts, { outputTargetType: o.type });
    })
  );
};

const CORE_FILENAME = `stencil-public-runtime`;
const CORE_DTS = `${CORE_FILENAME}.d.ts`;
