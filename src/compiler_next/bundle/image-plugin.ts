import * as d from '../../declarations';
import { basename, extname } from 'path';
import { buildWarn, catchError, createJsVarName, normalizePath } from '@utils';
import { Plugin } from 'rollup';

const svgMimeTypes: any = {
  '.svg': 'image/svg+xml',
};

export const imagePlugin = (config: d.Config, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'image',

    async transform(code, id) {
      if (/\0/.test(id)) {
        return null;
      }

      const mime = svgMimeTypes[extname(id)];
      if (!mime) {
        return null;
      }

      try {
        const varName = createJsVarName(basename(id));
        const base64 = config.sys.encodeToBase64(code);

        if (config.devMode && base64.length > SVG_MAX_IMAGE_SIZE) {
          const warn = buildWarn(buildCtx.diagnostics);
          warn.messageText = 'Importing big images will bloat your bundle, please use assets instead.';
          warn.absFilePath = normalizePath(id);
        }
        return `const ${varName} = 'data:${mime};base64,${base64}';export default ${varName};`;
      } catch (e) {
        catchError(buildCtx.diagnostics, e);
      }

      return null;
    },
  };
};

const SVG_MAX_IMAGE_SIZE = 4 * 1024; // 4KiB
