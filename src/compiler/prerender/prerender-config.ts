import * as d from '../../declarations';
import { catchError, requireFunc, loadTypeScriptDiagnostics, IS_NODE_ENV } from '@utils';
import { resolve } from 'path';

export const getPrerenderConfig = (diagnostics: d.Diagnostic[], prerenderConfigPath: string) => {
  const prerenderConfig: d.PrerenderConfig = {};

  if (typeof prerenderConfigPath === 'string') {
    if (IS_NODE_ENV) {
      const userPrerenderConfig = nodeRequireTsConfig(diagnostics, prerenderConfigPath);
      if (userPrerenderConfig) {
        Object.assign(prerenderConfig, userPrerenderConfig);
      }
    }
  }

  return prerenderConfig;
};

const nodeRequireTsConfig = (diagnostics: d.Diagnostic[], prerenderConfigPath: string) => {
  let prerenderConfig: d.PrerenderConfig = {};

  try {
    const fs: typeof import('fs') = requireFunc('fs');
    const ts: typeof import('typescript') = requireFunc('typescript');

    // ensure we cleared out node's internal require() cache for this file
    delete require.cache[resolve(prerenderConfigPath)];

    // let's override node's require for a second
    // don't worry, we'll revert this when we're done
    require.extensions['.ts'] = (module: NodeModuleWithCompile, fileName: string) => {
      let sourceText = fs.readFileSync(fileName, 'utf8');

      if (prerenderConfigPath.endsWith('.ts')) {
        // looks like we've got a typed config file
        // let's transpile it to .js quick
        // const ts = require('typescript');
        const tsResults = ts.transpileModule(sourceText, {
          fileName,
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            esModuleInterop: true,
            target: ts.ScriptTarget.ES2017,
            allowJs: true,
          },
        });
        sourceText = tsResults.outputText;

        if (tsResults.diagnostics.length > 0) {
          diagnostics.push(...loadTypeScriptDiagnostics(tsResults.diagnostics));
        }
      } else {
        // quick hack to turn a modern es module
        // into and old school commonjs module
        sourceText = sourceText.replace(/export\s+\w+\s+(\w+)/gm, 'exports.$1');
      }

      module._compile(sourceText, fileName);
    };

    // let's do this!
    const m = requireFunc(prerenderConfigPath);
    if (m != null && typeof m === 'object') {
      if (m.config != null && typeof m.config === 'object') {
        prerenderConfig = m.config;
      } else {
        prerenderConfig = m;
      }
    }
  } catch (e) {
    catchError(diagnostics, e);
  }

  // all set, let's go ahead and reset the require back to the default
  require.extensions['.ts'] = undefined;

  return prerenderConfig;
};

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}
