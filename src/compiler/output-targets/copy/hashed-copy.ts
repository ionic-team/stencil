import * as d from '../../../declarations';
import { dirname, extname, join } from 'path';

export const generateHashedCopy = async (config: d.Config, compilerCtx: d.CompilerCtx, path: string) => {
  try {
    const content = await compilerCtx.fs.readFile(path);
    const hash = await config.sys.generateContentHash(content, config.hashedFileNameLength);
    const hashedFileName = `p-${hash}${extname(path)}`;
    await compilerCtx.fs.writeFile(join(dirname(path), hashedFileName), content);
    return hashedFileName;
  } catch (e) {}
  return undefined;
};
