const fs = require('fs');
const path = require('path');

function reEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function isRelativeModuleId(id) {
  return /^\.+\//.test(id);
}

const exts = ['.js', '.json'];

export function resolvePaths(options) {
  options = options || {};

  let compilerOptions;
  if (options.tsconfig) {
    compilerOptions = JSON.parse(fs.readFileSync('tsconfig.json')).compilerOptions;
  }

  const paths = compilerOptions && compilerOptions.paths || options.paths;
  const baseUrl = compilerOptions && compilerOptions.baseUrl || options.baseUrl;
  const outDir = compilerOptions && compilerOptions.outDir || options.outDir;
  const rootDir = compilerOptions && compilerOptions.rootDir || options.rootDir;

  if (!(paths && baseUrl && outDir && rootDir)) {
    throw new Error('rollup-plugin-typescript-path-mapping: both `paths`, `baseUrl`, `outDir`, `rootDir` are required, in plugin\'s options or tsconfig\'s compilerOptions.');
  }

  const rootDirPrefixRe = new RegExp(reEscape(path.resolve(rootDir)));

  console.log(rootDirPrefixRe);

  function redirecToDir(modulePath) {
    return modulePath.replace(rootDirPrefixRe, path.resolve(outDir));
  }

  return {
    name: 'resolve-paths',
    resolveId: function (id) {
      if (isRelativeModuleId(id)) {
        return null;
      } else {
        let mappedModuleId;
        for (const rule in paths) {
          const prefixRule = rule.replace(/\*$/, '');
          if (id.indexOf(prefixRule) === 0) {
            const wildCardPart = id.slice(prefixRule.length);
            for (const mapTo of paths[rule]) {
              mappedModuleId = baseUrl + mapTo.replace(/\*$/, wildCardPart);
              const absoluteModulePath = path.resolve(mappedModuleId);
              const redirectedModulePath = redirecToDir(absoluteModulePath);
              for (const ext of exts) {
                if (fs.existsSync(redirectedModulePath + ext)) {
                  return redirectedModulePath + ext;
                }
              }
            }
          }
        }
      }
      return null;
    }
  };
}
