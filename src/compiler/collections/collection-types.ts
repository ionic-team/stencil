import * as d from '../../declarations';
import { buildError, isDtsFile, pathJoin } from '../util';
import { copyStencilCoreDts } from '../distribution/stencil-types';
import { validateTypes } from '../distribution/validate-package-json';


export async function generateTypes(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData) {

  const isValid = await validateTypes(config, compilerCtx, outputTarget, buildCtx.diagnostics, pkgData);
  if (!isValid) {
    return;
  }

  const srcDirItems = await compilerCtx.fs.readdir(config.srcDir, { recursive: false });
  const srcDtsFiles = srcDirItems.filter(srcItem => srcItem.isFile && isDtsFile(srcItem.absPath));

  const distTypesDir = config.sys.path.dirname(pkgData.types);

  await Promise.all(srcDtsFiles.map(async srcDtsFile => {
    const relPath = config.sys.path.relative(config.srcDir, srcDtsFile.absPath);
    const distPath = pathJoin(config, config.rootDir, distTypesDir, relPath);

    const dtsContent = await compilerCtx.fs.readFile(srcDtsFile.absPath);
    await compilerCtx.fs.writeFile(distPath, dtsContent);
  }));

  const dtsEntryFilePath = config.sys.path.join(config.rootDir, pkgData.types);
  const dtsFileExists = await compilerCtx.fs.access(dtsEntryFilePath);
  if (!dtsFileExists) {
    const err = buildError(buildCtx.diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" file does not exist: ${dtsEntryFilePath}`;

  } else {
    await copyStencilCoreDts(config, compilerCtx);
  }
}
