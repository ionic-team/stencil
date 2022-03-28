import type * as d from '../../declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from './stencil-types';
import { join, relative } from 'path';
import { generateAppTypes } from './generate-app-types';
import { generateCustomElementsBundleTypes } from '../output-targets/dist-custom-elements-bundle/custom-elements-bundle-types';
import { generateCustomElementsTypes } from '../output-targets/dist-custom-elements/custom-elements-types';
import { isDtsFile } from '@utils';

/**
 * For a single output target, generate types, then copy the Stencil core type declaration file
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param outputTarget the output target to generate types for
 */
export const generateTypes = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistTypes
): Promise<void> => {
  if (!buildCtx.hasError) {
    await generateTypesOutput(config, compilerCtx, buildCtx, outputTarget);
    await copyStencilCoreDts(config, compilerCtx);
  }
};

/**
 * Generate type definition files and write them to a dist directory
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param outputTarget the output target to generate types for
 */
const generateTypesOutput = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  outputTarget: d.OutputTargetDistTypes
): Promise<void> => {
  // get all type declaration files in a project's src/ directory
  const srcDirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: false });
  const srcDtsFiles = srcDirItems.filter((srcItem) => srcItem.isFile && isDtsFile(srcItem.absPath));

  // Copy .d.ts files from src to dist
  // In addition, all references to @stencil/core are replaced
  let distDtsFilePath: string;
  await Promise.all(
    srcDtsFiles.map(async (srcDtsFile) => {
      const relPath = relative(config.srcDir, srcDtsFile.absPath);
      const distPath = join(outputTarget.typesDir, relPath);

      const originalDtsContent = await compilerCtx.fs.readFile(srcDtsFile.absPath);
      const distDtsContent = updateStencilTypesImports(outputTarget.typesDir, distPath, originalDtsContent);

      await compilerCtx.fs.writeFile(distPath, distDtsContent);
      distDtsFilePath = distPath;
    })
  );

  const distPath = outputTarget.typesDir;
  await generateAppTypes(config, compilerCtx, buildCtx, distPath);

  if (distDtsFilePath) {
    await generateCustomElementsTypes(config, compilerCtx, buildCtx, distDtsFilePath);
    await generateCustomElementsBundleTypes(config, compilerCtx, buildCtx, distDtsFilePath);
  }
};
