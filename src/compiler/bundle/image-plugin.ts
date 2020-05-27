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

    async transform(code, importPath) {
      if (/\0/.test(importPath)) {
        return null;
      }

      const pathParts = importPath.split('?');
      const filePath = normalizePath(pathParts[0]);
      const mime = svgMimeTypes[extname(filePath)];
      if (!mime) {
        return null;
      }

      try {
        const varName = createJsVarName(basename(filePath));

        if (pathParts.length > 1) {
          const urlParams = new URLSearchParams(pathParts[1]);
          const format = urlParams.get('format');
          if (format === 'dataurl') {
            // ?format=dataurl
            const base64 = config.sys.encodeToBase64(code);

            if (config.devMode && base64.length > SVG_MAX_IMAGE_SIZE) {
              const warn = buildWarn(buildCtx.diagnostics);
              warn.messageText = 'Importing big images will bloat your bundle, please use assets instead.';
              warn.absFilePath = filePath;
            }

            return `const ${varName} = 'data:${mime};base64,${base64}';export default ${varName};`;
          }
        }

        // plain text as the default
        return `const ${varName} = '${code}';export default ${varName};`;
      } catch (e) {
        catchError(buildCtx.diagnostics, e);
      }

      return null;
    },
  };
};

const SVG_MAX_IMAGE_SIZE = 4 * 1024; // 4KiB
