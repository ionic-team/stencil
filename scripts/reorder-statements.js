const ts = require('typescript');

exports.reorderCoreStatements = function(options, bundles) {
  if (options.format === 'es') {
    Object.keys(bundles).forEach(fileName => {
      const bundle = bundles[fileName];
      if (bundle.isEntry) {
        bundle.code = reorderStatements(bundle.code);
      }
    });
  }
};


function reorderStatements(code) {

  function transform() {
    return () => {
      return tsSourceFile => {
        const letStatements = tsSourceFile.statements.filter(n => {
          return isLet(n);
        });
        const importStatements = tsSourceFile.statements.filter(n => {
          return isImport(n);
        });
        let statements = tsSourceFile.statements.filter(n => {
          return !isLet(n) && !isImport(n);
        });
        return ts.updateSourceFileNode(tsSourceFile, [
          ...importStatements,
          ...letStatements,
          ...statements
        ]);
      };
    };
  };

  function isLet(n) {
    if (n.kind === ts.SyntaxKind.VariableStatement && n.declarationList) {
      if (n.declarationList.kind === ts.SyntaxKind.VariableDeclarationList) {
        if (n.declarationList.flags === ts.NodeFlags.Let) {
          return true;
        }
      }
    }
    return false;
  }

  function isImport(n) {
    if (n.kind === ts.SyntaxKind.ImportDeclaration) {
      return true;
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
