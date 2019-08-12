import * as d from '../../declarations';
import { createStencilImportPath } from '../transformers/stencil-import-path';
import { DEFAULT_STYLE_MODE, dashToPascalCase, normalizePath } from '@utils';
import { getScopeId } from '../style/scope-css';
import { scopeCss } from '../../utils/shadow-css';
import { stripComments } from './style-utils';
import path from 'path';


export const transformCssToEsm = (config: d.Config, cssText: string, filePath: string, tagName: string, encapsulation: string, modeName: string) => {
  if (encapsulation === 'scoped') {
    const scopeId = getScopeId(tagName, modeName);
    cssText = scopeCss(cssText, scopeId, false);
  }

  const defaultVarName = createVarName(filePath, modeName);
  const varNames = new Set([defaultVarName]);

  const esmImports: string[] = [];

  const cssImports = getCssImports(config, varNames, cssText, filePath, modeName);
  cssImports.forEach(cssImport => {
    // remove the original css @imports
    cssText = cssText = cssText.replace(cssImport.srcImportText, '');

    const importPath = createStencilImportPath('css', tagName, encapsulation, modeName, cssImport.filePath);
    esmImports.push(`import ${cssImport.varName} from '${importPath}';`);
  });

  const output: string[] = [
    esmImports.join('\n')
  ];

  output.push(`const ${defaultVarName} = `);

  cssImports.forEach(cssImport => {
    output.push(`${cssImport.varName} + `);
  });

  output.push(`${JSON.stringify(cssText)};`);

  output.push(`\nexport default ${defaultVarName};`);

  return {
    code: output.join(''),
    map: null as any
  };
};


const getCssImports = (config: d.Config, varNames: Set<string>, cssText: string, filePath: string, modeName: string) => {
  const cssImports: d.CssToEsmImportData[] = [];

  if (!cssText.includes('@import')) {
    // no @import at all, so don't bother
    return cssImports;
  }

  cssText = stripComments(cssText);

  const dir = path.dirname(filePath);

  let r: RegExpExecArray;
  while (r = CSS_IMPORT_RE.exec(cssText)) {
    const cssImportData: d.CssToEsmImportData = {
      srcImportText: r[0],
      url: r[4].replace(/[\"\'\)]/g, ''),
      filePath: null,
      varName: null
    };

    if (!isLocalCssImport(cssImportData.srcImportText)) {
      // do nothing for @import url(http://external.css)
      config.logger.debug(`did not resolve external css @import: ${cssImportData.srcImportText}`);
      continue;

    } else if (isCssNodeModule(cssImportData.url)) {
      // do not resolve this path cuz it starts with node resolve id ~
      continue;

    } else if (path.isAbsolute(cssImportData.url)) {
      // absolute path already
      cssImportData.filePath = normalizePath(cssImportData.url);

    } else {
      // relative path
      cssImportData.filePath = normalizePath(path.resolve(dir, cssImportData.url));
    }

    cssImportData.varName = createVarName(filePath, modeName);

    if (varNames.has(cssImportData.varName)) {
      cssImportData.varName += (varNames.size);
    }
    varNames.add(cssImportData.varName);

    cssImports.push(cssImportData);
  }

  return cssImports;
};

const CSS_IMPORT_RE = /(@import)\s+(url\()?\s?(.*?)\s?\)?([^;]*);?/gi;

const isCssNodeModule = (url: string) => {
  return url.startsWith('~');
};

const isLocalCssImport = (srcImport: string) => {
  srcImport = srcImport.toLowerCase();

  if (srcImport.includes('url(')) {
    srcImport = srcImport.replace(/\"/g, '');
    srcImport = srcImport.replace(/\'/g, '');
    srcImport = srcImport.replace(/\s/g, '');
    if (srcImport.includes('url(http') || srcImport.includes('url(//')) {
      return false;
    }
  }

  return true;
};

const createVarName = (filePath: string, modeName: string) => {
  let varName = path.basename(filePath).toLowerCase();
  varName = varName.replace(/[|&;$%@"<>()+,.{}_]/g, '-');
  if (modeName && modeName !== DEFAULT_STYLE_MODE && !varName.includes(modeName)) {
    varName = modeName + '-' + varName;
  }
  varName = dashToPascalCase(varName);
  return varName.trim();
};
