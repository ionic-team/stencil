import * as d from '../../declarations';
import { ENCAPSULATION } from '../../util/constants';
import { getComponentsEsmBuildPath } from '../../compiler/app/app-file-naming';

export async function generateCustomElements(config: d.Config, cmpRegistry: d.ComponentRegistry) {

  function thing(styleMode: string, fileName: string, isScoped: boolean, className: string) {
    if (styleMode === '$' && isScoped) {
      return `
    if (opts.scoped) {
      return import('./${fileName}.sc.js').then(function(m) {
        return m.${className};
      });
    } else {
      return import('./${fileName}.js').then(function(m) {
        return m.${className};
      });
    }
      `;
    }

    if (styleMode === '$') {
      return `
    return import('./${fileName}.js').then(function(m) {
        return m.${className};
      });
`;
    }

    if (isScoped) {
    return `
    if (opts.mode === '${styleMode}' && opts.scoped) {
      return import('./${fileName}.sc.js').then(function(m) {
        return m.${className};
      });
    } else if (opts.mode === '${styleMode}') {
      return import('./${fileName}.js').then(function(m) {
        return m.${className};
      });
    }
    `;
    }

    return `
    if (opts.mode === '${styleMode}') {
      return import('./${fileName}.js').then(function(m) {
        return m.${className};
      });
    }
    `;
  }

  const componentClassList: string[] = [];

  let fileContents = Object.entries(cmpRegistry).map(([tagName, cmpMeta]) => {
    const isScoped = cmpMeta.encapsulation === ENCAPSULATION.ScopedCss;
    componentClassList.push(cmpMeta.componentClass);

    return `
var ${cmpMeta.componentClass}Component = /** @class **/ (function() {
  function ${cmpMeta.componentClass}() {
  }
  ${cmpMeta.componentClass}.is = '${tagName}';
  ${cmpMeta.componentClass}.getModule = function(opts) {
    ${Object.entries(cmpMeta.bundleIds).map(([styleMode, fileName]) => {
      return thing(styleMode, fileName, isScoped, cmpMeta.componentClass);
    }).join('')}
  }
});
`;
  }).join('');

  fileContents += `
export {
  ${componentClassList.map(className => {
    return `
  ${className},`;
  }).join('')}
};
  `;

  const fileName = getComponentsEsmBuildPath(config, outputTarget);

  return config.sys.fs.writeFile(fileName, fileContents);
}
