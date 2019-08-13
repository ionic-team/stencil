import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE, normalizePath } from '@utils';
import { getScopeId } from '../style/scope-css';
import path from 'path';


export const createStencilImportPath = (type: d.StencilDataType, tagName: string, encapsulation: string, modeName: string, importPath: string) => {
  const pathData = serializeStencilImportPath(type, tagName, encapsulation, modeName);
  return `${pathData}!${importPath}`;
};


const serializeStencilImportPath = (type: d.StencilDataType, tagName: string, encapsulation: string, modeName: string) => {
  const data: d.StencilComponentData = {
    tag: tagName,
    scopeId: getScopeId(tagName, modeName)
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
        const paramsStr = dataParts[1];
        const params = new URLSearchParams(paramsStr);
        const type = params.get('type') as any;
        const data: d.StencilComponentData = {
          tag: params.get('tag'),
          scopeId: params.get('scopeId'),
          encapsulation: params.get('encapsulation') || 'none',
          mode: params.get('mode') || DEFAULT_STYLE_MODE,
        };

        importer = normalizePath(importer);
        const importerDir = path.dirname(importer);
        const filePath = normalizePath(path.resolve(importerDir, importPath));
        const fileName = path.basename(filePath);

        let resolvedId = filePath;
        if (data.encapsulation === 'scoped' && data.mode && data.mode !== DEFAULT_STYLE_MODE) {
          resolvedId += `?${paramsStr}`;
        }

        const r: d.ResolvedStencilData = {
          type,
          resolvedId,
          filePath,
          fileName,
          data,
          importee,
          importer,
        };

        return r;
      }
    }
  }
  return null;
};

const STENCIL_IMPORT_PREFIX = `\0stencil?`;
