import * as d from '@declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from '../distribution/stencil-types';
import { isDtsFile } from '@utils';
// import { generateComponentTypes } from '../types/generate-component-types';
import { sys } from '@sys';
import { validateTypes, validateTypesExist } from '../distribution/validate-package-json';


export async function generateTypes(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData) {
  // Before generating the types, let's check if the package.json values are correct
  if (!validateTypes(config, outputTarget, buildCtx.diagnostics, pkgData)) {
    return;
  }

  const srcDirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: false });
  const srcDtsFiles = srcDirItems.filter(srcItem => srcItem.isFile && isDtsFile(srcItem.absPath));
  const distTypesDir = sys.path.dirname(pkgData.types);

  // Copy .d.ts files from src to dist
  // In addition, all references to @stencil/core are replaced
  await Promise.all(srcDtsFiles.map(async srcDtsFile => {
    const relPath = sys.path.relative(config.srcDir, srcDtsFile.absPath);
    const distPath = sys.path.join(config.rootDir, distTypesDir, relPath);

    const originalDtsContent = await compilerCtx.fs.readFile(srcDtsFile.absPath);
    const distDtsContent = updateStencilTypesImports(outputTarget.typesDir, distPath, originalDtsContent);

    await compilerCtx.fs.writeFile(distPath, distDtsContent);
  }));

  // const distPath = sys.path.join(config.rootDir, distTypesDir);
  // TODO
  // await generateComponentTypes(config, compilerCtx, buildCtx, distPath);

  // Final check, we make sure the generated types matches the path configured in the package.json
  const existsTypes = await validateTypesExist(config, compilerCtx, outputTarget, buildCtx.diagnostics, pkgData);
  if (existsTypes) {
    await copyStencilCoreDts(config, compilerCtx);
  }
}
