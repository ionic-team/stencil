import * as d from '@declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from './stencil-types';
import { generateAppTypes } from './generate-app-types';
import { isDtsFile } from '@utils';
import { sys } from '@sys';
import * as v from './validate-package-json';


export async function generateTypesAndValidate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDistCollection) {
  v.validatePackageFiles(config, outputTarget, buildCtx.diagnostics, pkgData);
  v.validateCollection(config, outputTarget, buildCtx.diagnostics, pkgData);
  v.validateNamespace(config, buildCtx.diagnostics);
  v.validateTypes(config, outputTarget, buildCtx.diagnostics, pkgData);

  if (!buildCtx.hasError) {
    await generateTypesOutput(config, compilerCtx, buildCtx, pkgData, outputTarget);

    const existsTypes = await v.validateTypesExist(config, compilerCtx, outputTarget, buildCtx.diagnostics, pkgData);
    if (existsTypes) {
      await copyStencilCoreDts(config, compilerCtx);
    }

    await v.validateModule(config, compilerCtx, outputTarget, buildCtx.diagnostics, pkgData);
    await v.validateMain(config, compilerCtx, outputTarget, buildCtx.diagnostics, pkgData);
    v.validateBrowser(buildCtx.diagnostics, pkgData);
  }
}

async function generateTypesOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDistCollection) {
  if (typeof pkgData.types !== 'string') {
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

  const distPath = sys.path.join(config.rootDir, distTypesDir);
  await generateAppTypes(config, compilerCtx, buildCtx, distPath);
}
