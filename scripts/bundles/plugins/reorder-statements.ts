import ts from 'typescript';
import type { NormalizedOutputOptions, OutputBundle, OutputChunk, Plugin } from 'rollup';

export function reorderCoreStatementsPlugin(): Plugin {
  return {
    name: 'internalClient',
    generateBundle(options, bundles) {
      reorderCoreStatements(options, bundles);
    },
  };
}

function reorderCoreStatements(options: NormalizedOutputOptions, bundles: OutputBundle) {
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
        const s = tsSourceFile.statements;

        const importStatements = s.filter(ts.isImportDeclaration);
        const exportStatements = s.filter(ts.isExportDeclaration);
        const letNoInitializerStatements = s.filter(isLetNoInitializer);
        const letWithInitializer = s.filter(isLetWithInitializer);

        const otherStatements = s.filter(n => !isLet(n) && !ts.isImportDeclaration(n) && !ts.isExportDeclaration(n));

        return ts.updateSourceFileNode(tsSourceFile, [
          ...letNoInitializerStatements,
          ...letWithInitializer,
          ...importStatements,
          ...otherStatements,
          ...exportStatements,
        ]);
      };
    };
  }

  function isLet(n: ts.Statement): n is ts.VariableStatement {
    if (ts.isVariableStatement(n) && n.declarationList) {
      if (n.declarationList.kind === ts.SyntaxKind.VariableDeclarationList) {
        if (n.declarationList.flags === ts.NodeFlags.Let) {
          return true;
        }
      }
    }
    return false;
  }

  function isLetNoInitializer(n: ts.Statement) {
    return isLet(n) && !isLetWithInitializer(n);
  }

  function isLetWithInitializer(n: ts.Statement) {
    if (isLet(n) && n.declarationList.declarations) {
      return n.declarationList.declarations.some(d => {
        return !!d.initializer;
      });
    }
    return false;
  }

  const output = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2017,
    },
    transformers: {
      after: [transform()],
    },
  });

  return output.outputText;
}
