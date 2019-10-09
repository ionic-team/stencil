import ts from 'typescript';
import { OutputOptions, OutputBundle, OutputChunk, Plugin } from 'rollup';


export function reorderCoreStatementsPlugin(): Plugin {
  return {
    name: 'internalClient',
    generateBundle(options, bundles) {
      reorderCoreStatements(options, bundles);
    }
  };
}

function reorderCoreStatements(options: OutputOptions, bundles: OutputBundle) {
  if (options.format === 'es') {
    Object.keys(bundles).forEach(fileName => {
      const bundle = bundles[fileName];
      if ((bundle as OutputChunk).isEntry) {
        (bundle as OutputChunk).code = reorderStatements((bundle as OutputChunk).code);
      }
    });
  }
}


function reorderStatements(code: string) {

  function transform() {
    return () => {
      return (tsSourceFile: ts.SourceFile) => {
        const letStatements = tsSourceFile.statements.filter(n => {
          return isLet(n);
        });
        const importStatements = tsSourceFile.statements.filter(n => {
          return ts.isImportDeclaration(n);
        });
        let statements = tsSourceFile.statements.filter(n => {
          return !isLet(n) && !ts.isImportDeclaration(n);
        });
        return ts.updateSourceFileNode(tsSourceFile, [
          ...importStatements,
          ...letStatements,
          ...statements
        ]);
      };
    };
  };

  function isLet(n: ts.Statement) {
    if (ts.isVariableStatement(n)) {
      if (n.declarationList.kind === ts.SyntaxKind.VariableDeclarationList) {
        if (n.declarationList.flags === ts.NodeFlags.Let) {
          return true;
        }
      }
    }
    return false;
  }

  const output = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2017
    },
    transformers: {
      after: [transform()]
    }
  });

  return output.outputText;
};
