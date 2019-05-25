import * as d from '../../declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from './stencil-types';
import { generateAppTypes } from './generate-app-types';
import { isDtsFile } from '@utils';


export async function generateTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDist) {
  if (!buildCtx.hasError) {
    await generateTypesOutput(config, compilerCtx, buildCtx, pkgData, outputTarget);

    if (typeof pkgData.types === 'string') {
      const pkgFile = config.sys.path.join(config.rootDir, pkgData.types);
      const fileExists = await compilerCtx.fs.access(pkgFile);
      if (fileExists) {
        await copyStencilCoreDts(config, compilerCtx);
      }
    }
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
