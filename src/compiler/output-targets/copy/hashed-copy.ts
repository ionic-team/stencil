import { dirname, extname } from 'path';
import { join } from '@utils';

import type * as d from '../../../declarations';

export const generateHashedCopy = async (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, path: string) => {
  try {
    const content = await compilerCtx.fs.readFile(path);
    const hash = await config.sys.generateContentHash(content, config.hashedFileNameLength);
    const hashedFileName = `p-${hash}${extname(path)}`;
    await compilerCtx.fs.writeFile(join(dirname(path), hashedFileName), content);
    return hashedFileName;
  } catch (e) {}
  return undefined;
};
