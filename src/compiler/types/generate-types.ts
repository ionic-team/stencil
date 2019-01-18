import * as d from '@declarations';
import { copyStencilCoreDts, updateStencilTypesImports } from './stencil-types';
import { generateComponentTypes } from './generate-component-types';
import { isDtsFile, pathJoin } from '@utils';
import * as v from './validate-package-json';


export async function generateTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => {
    return o.type === 'dist';
  });

  if (outputTargets.length === 0) {
    return;
  }

  const pkgData = await readPackageJson(config, compilerCtx);

  const promises = outputTargets.map(async outputTarget => {
    await generateTypesAndValidate(config, compilerCtx, buildCtx, pkgData, outputTarget);
  });

  await Promise.all(promises);
}


async function generateTypesAndValidate(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDist) {
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


async function generateTypesOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData, outputTarget: d.OutputTargetDist) {
  const srcDirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: false });
  const srcDtsFiles = srcDirItems.filter(srcItem => srcItem.isFile && isDtsFile(srcItem.absPath));
  const distTypesDir = config.sys.path.dirname(pkgData.types);

  // Copy .d.ts files from src to dist
  // In addition, all references to @stencil/core are replaced
  await Promise.all(srcDtsFiles.map(async srcDtsFile => {
    const relPath = config.sys.path.relative(config.srcDir, srcDtsFile.absPath);
    const distPath = pathJoin(config, config.rootDir, distTypesDir, relPath);

    const originalDtsContent = await compilerCtx.fs.readFile(srcDtsFile.absPath);
    const distDtsContent = updateStencilTypesImports(config, outputTarget.typesDir, distPath, originalDtsContent);

    await compilerCtx.fs.writeFile(distPath, distDtsContent);
  }));

  const distPath = pathJoin(config, config.rootDir, distTypesDir);
  await generateComponentTypes(config, compilerCtx, buildCtx, distPath);
}


async function readPackageJson(config: d.Config, compilerCtx: d.CompilerCtx) {
  const pkgJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await compilerCtx.fs.readFile(pkgJsonPath);

  } catch (e) {
    throw new Error(`Missing "package.json" file for distribution: ${pkgJsonPath}`);
  }

  let pkgData: d.PackageJsonData;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    throw new Error(`Error parsing package.json: ${pkgJsonPath}, ${e}`);
  }

  return pkgData;
}
