import * as d from '../../declarations';
import { buildWarn, createVarName, normalizePath, catchError, isString, buildError } from '@utils';
import { Plugin } from 'rollup';


const mimeTypes: any = {
  '.svg': 'image/svg+xml',
};

export const imagePlugin = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Plugin => {

  return {
    name: 'image',

    async load(id) {
      if (/\0/.test(id)) {
        return null;
      }

      const mime = mimeTypes[config.sys.path.extname(id)];
      if (!mime) {
        return null;
      }

      try {
        const varName = createVarName(config.sys.path.basename(id));
        const content = await compilerCtx.fs.readFile(id);

        if (isString(content)) {
          const base64 = config.sys.encodeToBase64(content);

          if (config.devMode && base64.length > MAX_IMAGE_SIZE) {
            const warn = buildWarn(buildCtx.diagnostics);
            warn.messageText = 'Importing big images will bloat your bundle, please use assets instead.';
            warn.absFilePath = normalizePath(id);
          }
          return `const ${varName} = 'data:${mime};base64,${base64}';export default ${varName};`;

        } else {
          const err = buildError(buildCtx.diagnostics);
          err.header = `Error Loading SVG`;
          err.messageText = `Unable to load svg content.`;
          err.absFilePath = id;
        }

      } catch (e) {
        catchError(buildCtx.diagnostics, e);
      }

      return null;
    }
  };
};

const MAX_IMAGE_SIZE = 4 * 1024; // 4KiB
