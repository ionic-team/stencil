import * as d from '../../declarations';
import { buildError, isDtsFile, pathJoin } from '../util';


export async function generateTypes(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pkgData: d.PackageJsonData) {
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
  }

  const outputTargets = (config.outputTargets as d.OutputTargetDist[]).filter(o => o.typesDir);

  await Promise.all(outputTargets.map(outputTarget => {
    return updateTypes(config, compilerCtx, outputTarget);
  }));
}


async function updateTypes(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const typeDirItems = await compilerCtx.fs.readdir(outputTarget.typesDir, { inMemoryOnly: true, recursive: true });
  const dtsFiles = typeDirItems.filter(dtsItem => dtsItem.isFile && isDtsFile(dtsItem.absPath));

  const updates = await Promise.all(dtsFiles.map(dtsFile => {
    return updateDtsContent(config, compilerCtx, outputTarget, dtsFile.absPath);
  }));

  if (updates.some(u => u)) {
    await copyCoreDts(config, compilerCtx, outputTarget);
  }
}


async function updateDtsContent(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, dtsFilePath: string) {
  let content = await compilerCtx.fs.readFile(dtsFilePath);

  let madeChanges = false;

  const relPath = config.sys.path.relative(config.sys.path.dirname(dtsFilePath), outputTarget.typesDir);

  let coreDtsPath = pathJoin(config, relPath, CORE_FILENAME);
  if (!coreDtsPath.startsWith('.')) {
    coreDtsPath = `./${coreDtsPath}`;
  }

  if (content.includes('JSX')) {
    content = `import '${coreDtsPath}';\n${content}`;
    madeChanges = true;
  }

  if (content.includes('@stencil/core')) {
    content = content.replace(/\@stencil\/core/g, coreDtsPath);
    madeChanges = true;
  }

  if (madeChanges) {
    await compilerCtx.fs.writeFile(dtsFilePath, content);
  }

  return madeChanges;
}


async function copyCoreDts(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const srcDts = await config.sys.getClientCoreFile({
   staticName: 'declarations/stencil.core.d.ts'
  });

  const coreDtsFilePath = config.sys.path.join(outputTarget.typesDir, CORE_DTS);
  await compilerCtx.fs.writeFile(coreDtsFilePath, srcDts);
}


const CORE_FILENAME = `stencil.core`;
const CORE_DTS = `${CORE_FILENAME}.d.ts`;
