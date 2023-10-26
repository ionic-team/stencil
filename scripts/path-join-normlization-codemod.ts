import { Project, ImportDeclaration } from "ts-morph";

const project = new Project({
 tsConfigFilePath: "./tsconfig.json",
});

function isFsImport(importDecl: ImportDeclaration): boolean {
  return importDecl.getModuleSpecifier().getText() === "fs";
}


for (const sourceFile of project.getSourceFiles()) {
  console.log(`checking ${sourceFile.getFilePath()}`);
  const pathImport = sourceFile.getImportDeclaration("path");

  if (!pathImport) {
    continue;
  }

  const imports = pathImport.getNamedImports();
  const joinImport = imports.find(importSpecifier => importSpecifier.getName() === "join");
  const relativeImport = imports.find(importSpecifier => importSpecifier.getName() === "relative");

  const utilImports = []

  if (joinImport) {
    joinImport.remove();
    utilImports.push("join");
  }

  if (relativeImport) {
    relativeImport.remove();
    utilImports.push("relative");
  }

  if (pathImport.getNamedImports().length === 0) {
    pathImport.remove();
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: "@utils",
    namedImports: utilImports
  })

  sourceFile.fixUnusedIdentifiers();
}

project.save();
