import * as d from '../../declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from './stencil-types';
import { generateAppTypes } from './generate-app-types';
import { isDtsFile } from '@utils';
import * as v from './validate-package-json';


export async function generateTypesAndValidate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDist) {
  v.validatePackageFiles(config, outputTarget, buildCtx.diagnostics, pkgData);
  v.validateCollection(config, outputTarget, buildCtx.diagnostics, pkgData);
  v.validateTypes(config, outputTarget, buildCtx.diagnostics, pkgData);

  if (!buildCtx.hasError) {
    await generateTypesOutput(config, compilerCtx, buildCtx, pkgData, outputTarget);

    const existsTypes = await v.validateTypesExist(config, compilerCtx, outputTarget, buildCtx.diagnostics, pkgData);
    if (existsTypes) {
      await copyStencilCoreDts(config, compilerCtx);
    }

    v.validateModule(config, outputTarget, buildCtx.diagnostics, pkgData);
    v.validateMain(config, outputTarget, buildCtx.diagnostics, pkgData);
    // v.validateCollectionMain(config, outputTarget, buildCtx.diagnostics, pkgData);
    v.validateBrowser(buildCtx.diagnostics, pkgData);
  }
}

async function generateTypesOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDist) {
  if (typeof pkgData.types !== 'string') {
    return;
  }

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
}
