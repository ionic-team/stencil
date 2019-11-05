import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE, isString } from '@utils';
import path from 'path';


export const createStencilImportPath = (tagName: string, encapsulation: string, modeName: string, importeePath: string, importerPath: string) => {
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

  let p = importeePath;
  if (path.isAbsolute(importeePath)) {
    const importerDir = path.dirname(importerPath);
    p = path.relative(importerDir, importeePath);
  }
  if (!p.startsWith('.')) {
    p = './' + p;
  }

  return p + '?' + params.toString();
};


export const parseStencilImportPathData = (importee: string) => {
  if (isString(importee)) {
    const dataParts = importee.split('?');
    if (dataParts.length === 2) {
      const params = dataParts[1];
      const urlParams = new URLSearchParams(params);
      const data: d.StencilComponentData = {
        tag: urlParams.get('tag'),
        encapsulation: urlParams.get('encapsulation') || 'none',
        mode: urlParams.get('mode') || DEFAULT_STYLE_MODE,
      };
      return data;
    }
  }
  return null;
};
