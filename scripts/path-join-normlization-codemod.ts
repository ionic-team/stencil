import { Project, ImportDeclaration } from "ts-morph";

const project = new Project({
 tsConfigFilePath: "./tsconfig.json",
});

function isFsImport(importDecl: ImportDeclaration): boolean {
  return importDecl.getModuleSpecifier().getText() === "fs";
}

// function 


for (const sourceFile of project.getSourceFiles()) {
  console.log(`checking ${sourceFile.getFilePath()}`);
  const fsImport = sourceFile.getImportDeclaration("path");

  if (!fsImport) {
    continue;
  }

  const imports = fsImport.getNamedImports();
  const joinImport = imports.find(importSpecifier => importSpecifier.getName() === "join");

  if (joinImport) {
    joinImport.remove();

    sourceFile.addImportDeclaration({
      moduleSpecifier: "@utils",
      namedImports: ["join"]
    })
  }
}

project.save();
