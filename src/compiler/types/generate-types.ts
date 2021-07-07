import type * as d from '../../declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from './stencil-types';
import { join, relative } from 'path';
import { generateAppTypes } from './generate-app-types';
import { generateCustomElementsBundleTypes } from '../output-targets/dist-custom-elements-bundle/custom-elements-bundle-types';
import { generateCustomElementsTypes } from '../output-targets/dist-custom-elements/custom-elements-types';
import { isDtsFile } from '@utils';

export const generateTypes = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistTypes,
) => {
  if (!buildCtx.hasError) {
    await generateTypesOutput(config, compilerCtx, buildCtx, outputTarget);
    await copyStencilCoreDts(config, compilerCtx);
  }
};

const generateTypesOutput = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistTypes,
) => {
  const srcDirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: false });
  const srcDtsFiles = srcDirItems.filter(srcItem => srcItem.isFile && isDtsFile(srcItem.absPath));

  // Copy .d.ts files from src to dist
  // In addition, all references to @stencil/core are replaced
  let distDtsFilePath: string;
  await Promise.all(
    srcDtsFiles.map(async srcDtsFile => {
      const relPath = relative(config.srcDir, srcDtsFile.absPath);
      const distPath = join(outputTarget.typesDir, relPath);

      const originalDtsContent = await compilerCtx.fs.readFile(srcDtsFile.absPath);
      const distDtsContent = updateStencilTypesImports(outputTarget.typesDir, distPath, originalDtsContent);

      await compilerCtx.fs.writeFile(distPath, distDtsContent);
      distDtsFilePath = distPath;
    }),
  );

  const distPath = outputTarget.typesDir;
  await generateAppTypes(config, compilerCtx, buildCtx, distPath);

  if (distDtsFilePath) {
    await generateCustomElementsTypes(config, compilerCtx, buildCtx, distDtsFilePath);
    await generateCustomElementsBundleTypes(config, compilerCtx, buildCtx, distDtsFilePath);
  }
};
