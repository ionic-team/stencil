import * as d from '@declarations';
import { buildWarn, normalizePath } from '@utils';
import { ModuleKind, getBuildScriptTarget } from '../transformers/transform-utils';
import ts from 'typescript';


export function globalScriptsPlugin(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const paths: string[] = [];

  if (typeof config.globalScript === 'string') {
    const mod = compilerCtx.moduleMap.get(config.globalScript);
    if (mod && mod.jsFilePath) {
      paths.push(mod.jsFilePath);
    }
  }
  // TODO: dependencies
  // paths.push(
  //   ...compilerCtx.collections.map(collection => collection.global.jsFilePath)
  // );
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/global-scripts') {
        return id;
      }
      return null;
    },

    transform(code: string, id: string) {
      id = normalizePath(id);

      if (!paths.includes(id)) {
        // not a global script, don't bother
        return null;
      }

      if (code.includes('export default') || code.includes('export { default }')) {
        // shortcut cuz we know it's good to go and has a default export already
        return null;
      }

      const data: GlobalTransformData = {
        hasDefaultExport: false
      };

      // parse open the script and make sure it has a default export
      ts.transpileModule(code, {
        compilerOptions: {
          module: ModuleKind,
          target: getBuildScriptTarget(build)
        },
        fileName: id,
        reportDiagnostics: false,
        transformers: {
          before: [
            globalScriptTransform(data)
          ]
        }
      });

      if (!data.hasDefaultExport) {
        const diagnostic = buildWarn(buildCtx.diagnostics);
        diagnostic.header = `Global Script`;
        diagnostic.messageText = `Global scripts must export a default function.`;
        diagnostic.absFilePath = id;

        compilerCtx.moduleMap.forEach(moduleFile => {
          if (moduleFile.jsFilePath === id) {
            diagnostic.absFilePath = moduleFile.sourceFilePath;
          }
        });

        // let's auto add a default export since it doesn't have one
        code += `\nexport default function(){}`;
      }

      return code;
    },

    load(id: string) {
      if (id !== '@stencil/core/global-scripts') {
        return null;
      }

      if (paths.length === 0) {
        // no global scripts
        // so just create a bogus default noop export
        return `export default function(){}`;
      }

      const output: string[] = [];

      paths.forEach((path, index) => {
        output.push(`import global${index} from '${normalizePath(path)}';`);
      });

      output.push(
        `export default function(win) {`
      );

      output.push(
        `  const doc = win.document;`
      );

      paths.forEach((_, index) => {
        output.push(
          `  global${index}(win, doc);`
        );
      });

      output.push(
        `}`
      );

      return output.join('\n');
    },

    name: 'globalScriptsPlugin'
  };
}


function globalScriptTransform(data: GlobalTransformData): ts.TransformerFactory<ts.SourceFile> {

  return () => {

    return tsSourceFile => {

      data.hasDefaultExport = tsSourceFile.statements.some(statement => {
        if (statement.kind === ts.SyntaxKind.FunctionDeclaration) {
          const modifiers = statement.modifiers;
          if (modifiers != null) {
            const hasExport = modifiers.some(modifier => {
              return modifier.kind === ts.SyntaxKind.ExportKeyword;
            });

            if (!hasExport) {
              return false;
            }

            const hasDefault = modifiers.some(modifier => {
              return modifier.kind === ts.SyntaxKind.DefaultKeyword;
            });

            if (!hasDefault) {
              return false;
            }

            return true;
          }
        }
        return false;
      });

      return tsSourceFile;
    };
  };
}

interface GlobalTransformData {
  hasDefaultExport: boolean;
}
