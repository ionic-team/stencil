import type * as d from '../../../declarations';
import { dirname, extname, join } from 'path';
import { getStencilCompilerContext } from '@utils';

export const generateHashedCopy = async (config: d.Config, path: string) => {
  try {
    const content = await getStencilCompilerContext().fs.readFile(path);
    const hash = await config.sys.generateContentHash(content, config.hashedFileNameLength);
    const hashedFileName = `p-${hash}${extname(path)}`;
    await getStencilCompilerContext().fs.writeFile(join(dirname(path), hashedFileName), content);
    return hashedFileName;
  } catch (e) {}
  return undefined;
};
