import * as d from '../../declarations';

export async function generateHashedCopy(config: d.Config, compilerCtx: d.CompilerCtx, path: string) {
  try {
    const content = await compilerCtx.fs.readFile(path);
    const hash = await config.sys.generateContentHash(content, config.hashedFileNameLength);
    const hashedFileName = `p-${hash}${config.sys.path.extname(path)}`;
    await compilerCtx.fs.writeFile(
      config.sys.path.join(config.sys.path.dirname(path), hashedFileName),
      content
    );
    return hashedFileName;
  } catch (e) {}
  return undefined;
}
