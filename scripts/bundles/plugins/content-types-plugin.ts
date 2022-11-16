import fs from 'fs-extra';
import { join } from 'path';
import type { Plugin } from 'rollup';

import type { BuildOptions } from '../../utils/options';

export function contentTypesPlugin(opts: BuildOptions): Plugin {
  return {
    name: 'contentTypesPlugin',
    resolveId(id) {
      if (id.endsWith('content-types-db.json')) {
        return id;
      }
      return null;
    },
    load(id) {
      if (id.endsWith('content-types-db.json')) {
        return createContentTypeData(opts);
      }
      return null;
    },
  };
}

async function createContentTypeData(opts: BuildOptions) {
  // create a focused content-type lookup object from
  // the mime db json file
  const mimeDbSrcPath = join(opts.nodeModulesDir, 'mime-db', 'db.json');
  const mimeDbJson = await fs.readJson(mimeDbSrcPath);

  const extData: { ext: string; mimeType: string }[] = [];

  Object.keys(mimeDbJson).forEach((mimeType) => {
    const mimeTypeData = mimeDbJson[mimeType];
    if (Array.isArray(mimeTypeData.extensions)) {
      mimeTypeData.extensions.forEach((ext) => {
        extData.push({
          ext,
          mimeType,
        });
      });
    }
  });

  const exts = {};
  extData
    .sort((a, b) => {
      if (a.ext < b.ext) return -1;
      if (a.ext > b.ext) return 1;
      return 0;
    })
    .forEach((x) => (exts[x.ext] = x.mimeType));

  return `export default ${JSON.stringify(exts)}`;
}
