import ts from 'typescript';


export const addImports = (transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile, importFnNames: string[], importPath: string) => {
  if (importFnNames.length === 0) {
    return tsSourceFile;
  }

  const { module } = transformCtx.getCompilerOptions();

  if (module === ts.ModuleKind.CommonJS) {
    // CommonJS require()
    return addCjsRequires(tsSourceFile, importFnNames, importPath);
  }

  // ESM Imports
  return addEsmImports(tsSourceFile, importFnNames, importPath);
};


const addEsmImports = (tsSourceFile: ts.SourceFile, importFnNames: string[], importPath: string) => {
  // ESM Imports
  // import { importNames } from 'importPath';

  let importSpecifiers = importFnNames.map(importKey => {
    const splt = importKey.split(' as ');
    let importAs = importKey;
    let importFnName = importKey;

    if (splt.length > 1) {
      importAs = splt[1];
      importFnName = splt[0];
    }

    return ts.createImportSpecifier(
      typeof importFnName === 'string' && importFnName !== importAs ? ts.createIdentifier(importFnName) : undefined,
      ts.createIdentifier(importAs)
    );
  });

  const statements = tsSourceFile.statements.slice();

  const existingImportIndex = statements.findIndex(s => {
    return ts.isImportDeclaration(s) &&
           s.moduleSpecifier &&
           (s.moduleSpecifier as ts.StringLiteral).text === importPath;
  });

  if (existingImportIndex > -1) {
    const existingImport = statements[existingImportIndex] as ts.ImportDeclaration;

    importSpecifiers = [
      ...(existingImport.importClause.namedBindings as ts.NamedImports).elements.map(elm => elm),
      ...importSpecifiers
    ];

    statements[existingImportIndex] = ts.updateImportDeclaration(
      existingImport,
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports(importSpecifiers)
      ),
      ts.createLiteral(importPath)
    );

  } else {
    const newImport = ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports(importSpecifiers)
      ),
      ts.createLiteral(importPath)
    );
    statements.unshift(newImport);
  }

  return ts.updateSourceFileNode(tsSourceFile, statements);
};


const addCjsRequires = (tsSourceFile: ts.SourceFile, importFnNames: string[], importPath: string) => {
  // CommonJS require()
  // const { a, b, c } = require(importPath);

  const importBinding = ts.createObjectBindingPattern(importFnNames.map(importKey => {
    const splt = importKey.split(' as ');
    let importAs = importKey;
    let importFnName = importKey;

    if (splt.length > 1) {
      importAs = splt[1];
      importFnName = splt[0];
    }
    return ts.createBindingElement(
      undefined,
      importFnName,
      importAs
    );
  }));

  const requireStatement = ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [
        ts.createVariableDeclaration(
          importBinding,
          undefined,
          ts.createCall(
            ts.createIdentifier('require'),
            [],
            [ts.createLiteral(importPath)]
          )
        )
      ],
      ts.NodeFlags.Const
    )
  );

  const statements = tsSourceFile.statements.slice();

  statements.splice(2, 0, requireStatement);

  return ts.updateSourceFileNode(tsSourceFile, statements);
};
