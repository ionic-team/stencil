import { Project, ImportDeclaration, SourceFile } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

function* pathImportingSourceFiles() {
  for (const sourceFile of project.getSourceFiles()) {
    const importDecl = sourceFile.getImportDeclaration('path');
    if (importDecl) {
      yield [importDecl, sourceFile] as [ImportDeclaration, SourceFile];
    }
  }
}

const PROBLEMATIC_PATH_FUNCTIONS = ['join', 'relative'];

for (const [pathImportDecl, sourceFile] of pathImportingSourceFiles()) {
  console.log(`found path imports in ${sourceFile.getFilePath()}`);

  const toImportFromUtilModule: string[] = [];

  for (const problematicFn of PROBLEMATIC_PATH_FUNCTIONS) {
    const importSpecifier = pathImportDecl.getNamedImports().find((specifier) => specifier.getName() === problematicFn);

    if (importSpecifier) {
      importSpecifier.remove();
      toImportFromUtilModule.push(problematicFn);
    }
  }

  if (toImportFromUtilModule.length === 0) {
    // didn't remove any import specifiers from path import, get outta here!
    continue;
  }

  // remove the path import entirely if it's now empty
  if (pathImportDecl.getNamedImports().length === 0) {
    pathImportDecl.remove();
  }

  // add an import for our `@utils` dir
  sourceFile.addImportDeclaration({
    moduleSpecifier: '@utils',
    namedImports: toImportFromUtilModule,
  });
}

project.save();
