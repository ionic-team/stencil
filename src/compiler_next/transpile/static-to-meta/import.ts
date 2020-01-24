import * as d from '../../../declarations';
import { addExternalImport } from '../collections/add-external-import';
import { normalizePath } from '@utils';
import ts from 'typescript';


export const parseImport = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, moduleFile: d.Module, dirPath: string, importNode: ts.ImportDeclaration) => {
  if (importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
    let importPath = importNode.moduleSpecifier.text;

    if (!moduleFile.originalImports.includes(importPath)) {
      moduleFile.originalImports.push(importPath);
    }

    if (config.sys.path.isAbsolute(importPath)) {
      // absolute import
      importPath = normalizePath(importPath);
      moduleFile.localImports.push(importPath);

    } else if (importPath.startsWith('.')) {
      // relative import
      importPath = normalizePath(config.sys.path.resolve(dirPath, importPath));
      moduleFile.localImports.push(importPath);

    } else {
      // node resolve side effect import
      addExternalImport(config, compilerCtx, buildCtx, moduleFile, moduleFile.sourceFilePath, importPath);
    }
  }
};
