import * as d from '../../declarations';
import { basename } from 'path';
import { buildWarn, catchError, createJsVarName, normalizeFsPathQuery } from '@utils';
import { Plugin } from 'rollup';
import {} from '@rollup/pluginutils';

export const extFormatPlugin = (config: d.Config, buildCtx: d.BuildCtx): Plugin => {
  return {
    name: 'extFormatPlugin',

    transform(code, importPath) {
      if (/\0/.test(importPath)) {
        return null;
      }

      try {
        const { ext, filePath, format } = normalizeFsPathQuery(importPath);

        // ?format= param takes precedence before file extension
        switch (format) {
          case 'url':
            return formatUrl(config, buildCtx, code, filePath, ext);
          case 'text':
            return formatText(code, filePath);
        }

        // didn't provide a ?format= param
        // check if it's a known extension we should format
        if (FORMAT_TEXT_EXTS.includes(ext)) {
          return formatText(code, filePath);
        }

        if (FORMAT_URL_MIME[ext]) {
          return formatUrl(config, buildCtx, code, filePath, ext);
        }
      } catch (e) {
        catchError(buildCtx.diagnostics, e);
      }

      return null;
    },
  };
};

const FORMAT_TEXT_EXTS = ['txt', 'frag', 'vert'];

const FORMAT_URL_MIME: any = {
  svg: 'image/svg+xml',
};

const DATAURL_MAX_IMAGE_SIZE = 4 * 1024; // 4KiB

const formatText = (code: string, filePath: string) => {
  const varName = createJsVarName(basename(filePath));
  return `const ${varName} = ${JSON.stringify(code)};export default ${varName};`;
};

const formatUrl = (config: d.Config, buildCtx: d.BuildCtx, code: string, filePath: string, ext: string) => {
  const varName = createJsVarName(basename(filePath));
  const mime = FORMAT_URL_MIME[ext];
  const base64 = config.sys.encodeToBase64(code);

  if (config.devMode && base64.length > DATAURL_MAX_IMAGE_SIZE) {
    const warn = buildWarn(buildCtx.diagnostics);
    warn.messageText = 'Importing large images will bloat your bundle size, please use assets instead.';
    warn.absFilePath = filePath;
  }

  return `const ${varName} = 'data:${mime};base64,${base64}';export default ${varName};`;
};
