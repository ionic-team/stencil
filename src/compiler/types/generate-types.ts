import * as d from '../../declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from './stencil-types';
import { generateAppTypes } from './generate-app-types';
import { isDtsFile, isString } from '@utils';


export const generateTypes = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDistTypes) => {
  if (!buildCtx.hasError && isString(pkgData.types)) {
    await generateTypesOutput(config, compilerCtx, buildCtx, pkgData, outputTarget);
    await copyStencilCoreDts(config, compilerCtx);
  }
};

const generateTypesOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDistTypes) => {
  const srcDirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: false });
  const srcDtsFiles = srcDirItems.filter(srcItem => srcItem.isFile && isDtsFile(srcItem.absPath));
  const distTypesDir = config.sys.path.dirname(pkgData.types);

  // Copy .d.ts files from src to dist
  // In addition, all references to @stencil/core are replaced
  await Promise.all(srcDtsFiles.map(async srcDtsFile => {
    const relPath = config.sys.path.relative(config.srcDir, srcDtsFile.absPath);
    const distPath = config.sys.path.join(config.rootDir, distTypesDir, relPath);

    const originalDtsContent = await compilerCtx.fs.readFile(srcDtsFile.absPath);
    const distDtsContent = updateStencilTypesImports(config.sys.path, outputTarget.typesDir, distPath, originalDtsContent);

    await compilerCtx.fs.writeFile(distPath, distDtsContent);
  }));

  const distPath = config.sys.path.join(config.rootDir, distTypesDir);
  await generateAppTypes(config, compilerCtx, buildCtx, distPath);
};
