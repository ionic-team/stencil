import { BuildCtx, CompilerCtx, Config, PackageJsonData } from '../../declarations';
import { buildError, isDtsFile, pathJoin } from '../util';


export async function generateTypes(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, pkgData: PackageJsonData) {
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

  await updateTypes(config, compilerCtx);
}


async function updateTypes(config: Config, compilerCtx: CompilerCtx) {
  const typeDirItems = await compilerCtx.fs.readdir(config.typesDir, { inMemoryOnly: true, recursive: true });
  const dtsFiles = typeDirItems.filter(dtsItem => dtsItem.isFile && isDtsFile(dtsItem.absPath));

  const updates = await Promise.all(dtsFiles.map(dtsFile => {
    return updateDtsContent(config, compilerCtx, dtsFile.absPath);
  }));

  if (updates.some(u => u)) {
    await copyCoreDts(config, compilerCtx);
  }
}


async function updateDtsContent(config: Config, compilerCtx: CompilerCtx, dtsFilePath: string) {
  let content = await compilerCtx.fs.readFile(dtsFilePath);

  let madeChanges = false;

  const relPath = config.sys.path.relative(config.sys.path.dirname(dtsFilePath), config.typesDir);

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


async function copyCoreDts(config: Config, compilerCtx: CompilerCtx) {
  const srcDts = await config.sys.getClientCoreFile({
   staticName: 'declarations/stencil.core.d.ts'
  });

  const coreDtsFilePath = config.sys.path.join(config.typesDir, CORE_DTS);
  await compilerCtx.fs.writeFile(coreDtsFilePath, srcDts);
}


const CORE_FILENAME = `stencil.core`;
const CORE_DTS = `${CORE_FILENAME}.d.ts`;
