import * as d from '../../declarations';
import { buildWarn, normalizePath } from '@utils';
import { Plugin } from 'rollup';

const mimeTypes: any = {
  '.svg': 'image/svg+xml',
};

export function imagePlugin(config: d.Config, buildCtx: d.BuildCtx): Plugin {

  return {
    name: 'image',

    async load(id) {
      if (/\0/.test(id)) {
        return null;
      }

      id = normalizePath(id);
      const mime = mimeTypes[config.sys.path.extname(id)];
      if (!mime) {
        return null;
      }

      try {
        const data = await config.sys.fs.readFile(id, 'base64');
        if (config.devMode && data.length > MAX_IMAGE_SIZE) {
          const warn = buildWarn(buildCtx.diagnostics);
          warn.messageText = 'Importing big images will bloat your bundle, please use assets instead.';
          warn.absFilePath = id;
        }
        return `const img = 'data:${mime};base64,${data}'; export default img;`;
      } catch (e) {}
      return null;
    }
  };
}

const MAX_IMAGE_SIZE = 4 * 1024; // 4KiB
