import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE, getFileExt, normalizePath } from '@utils';
import path from 'path';


export const createStencilImportPath = (type: d.StencilDataType, tagName: string, encapsulation: string, modeName: string, importPath: string) => {
  const pathData = serializeStencilImportPath(type, tagName, encapsulation, modeName);
  return `${pathData}!${importPath}`;
};


const serializeStencilImportPath = (type: d.StencilDataType, tagName: string, encapsulation: string, modeName: string) => {
  const data: d.StencilComponentData = {
    tag: tagName,
  };
  if (modeName && modeName !== DEFAULT_STYLE_MODE) {
    data.mode = modeName;
  }
  if (encapsulation !== 'none') {
    data.encapsulation = encapsulation;
  }

  const params = new URLSearchParams(Object.entries(data));
  params.set('type', type);
  return STENCIL_IMPORT_PREFIX + params.toString();
};


export const parseStencilImportPath = (importee: string, importer: string) => {
  if (typeof importee === 'string' && typeof importee === 'string') {

    if (importee.startsWith(STENCIL_IMPORT_PREFIX) && importee.includes('!')) {
      const importeeParts = importee.split('!');
      const importData = importeeParts[0];
      const importPath = importeeParts[importeeParts.length - 1];

      const dataParts = importData.split('?');
      if (dataParts.length === 2) {
        const params = dataParts[1];
        const urlParams = new URLSearchParams(params);
        const type = urlParams.get('type') as any;
        const data: d.StencilComponentData = {
          tag: urlParams.get('tag'),
          encapsulation: urlParams.get('encapsulation') || 'none',
          mode: urlParams.get('mode') || DEFAULT_STYLE_MODE,
        };

        importer = normalizePath(importer);
        const importerDir = path.dirname(importer);
        const importerExt = getFileExt(importer.split('?')[0]);

        const resolvedFilePath = normalizePath(path.resolve(importerDir, importPath));
        const resolvedFileName = path.basename(resolvedFilePath);
        const resolvedFileExt = getFileExt(resolvedFileName);

        let resolvedId = resolvedFilePath;
        if (data.encapsulation === 'scoped' && data.mode && data.mode !== DEFAULT_STYLE_MODE) {
          resolvedId += `?${params}`;
        }

        const r: d.ResolvedStencilData = {
          type,
          resolvedId,
          resolvedFilePath,
          resolvedFileName,
          resolvedFileExt,
          params,
          data,
          importee,
          importer,
          importerExt,
        };

        return r;
      }
    }
  }
  return null;
};

const STENCIL_IMPORT_PREFIX = `\0stencil?`;
