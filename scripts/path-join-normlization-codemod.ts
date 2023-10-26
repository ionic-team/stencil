import { ImportDeclaration, Project, SourceFile } from 'ts-morph';

function* pathImportingSourceFiles(project: Project) {
  for (const sourceFile of project.getSourceFiles()) {
    const importDecl = sourceFile.getImportDeclaration('path');
    if (importDecl) {
      yield [importDecl, sourceFile] as [ImportDeclaration, SourceFile];
    }
  }
}

const PROBLEMATIC_PATH_FUNCTIONS = ['join', 'relative'];

function addOrUpdateImports(sourceFile: SourceFile, moduleSpecifier: string, namedImports: string[]) {
  const utilsIimport = sourceFile.getImportDeclaration(moduleSpecifier);
  if (utilsIimport) {
    utilsIimport.addNamedImports(namedImports);
  } else {
    sourceFile.addImportDeclaration({
      moduleSpecifier,
      namedImports,
    });
  }
}

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

for (const [pathImportDecl, sourceFile] of pathImportingSourceFiles(project)) {
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

  addOrUpdateImports(sourceFile, '@utils', toImportFromUtilModule);
}

project.save();
