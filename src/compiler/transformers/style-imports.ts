import ts from 'typescript';

import type * as d from '../../declarations';
import { serializeImportPath } from './stencil-import-path';
import { getIdentifierFromResourceUrl, retrieveTsModifiers } from './transform-utils';

/**
 * This function adds imports (either in ESM or CJS syntax) for styles that are
 * imported from the component's styleUrls option. For example, if a component
 * has the following:
 *
 * ```ts
 * @Component({
 *  styleUrls: ['my-component.css', 'my-component.ios.css']
 * })
 * export class MyComponent {
 *   // ...
 * }
 * ```
 *
 * then this function will add the following import statement:
 *
 * ```ts
 * import _myComponentCssStyle from './my-component.css';
 * import _myComponentIosCssStyle from './my-component.ios.css';
 * ```
 *
 * Note that import identifier are used in [`addStaticStyleGetterWithinClass`](src/compiler/transformers/add-static-style.ts)
 * to attach them to a components static style property.
 *
 * @param transformOpts transform options configured for the current output target transpilation
 * @param tsSourceFile the TypeScript source file that is being updated
 * @param moduleFile component file to update
 * @returns an updated source file with the added import statements
 */
export const updateStyleImports = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  moduleFile: d.Module,
) => {
  // add style imports built from @Component() styleUrl option
  if (transformOpts.module === 'cjs') {
    return updateCjsStyleRequires(transformOpts, tsSourceFile, moduleFile);
  }

  return updateEsmStyleImports(transformOpts, tsSourceFile, moduleFile);
};

/**
 * Iterate over all components defined in given module, collect import
 * statements to be added and update source file with them.
 * @param transformOpts transform options configured for the current output target transpilation
 * @param tsSourceFile the TypeScript source file that is being updated
 * @param moduleFile component file to update
 * @returns update source file with added import statements
 */
const updateEsmStyleImports = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  moduleFile: d.Module,
) => {
  const styleImports: ts.Statement[] = [];
  let statements = tsSourceFile.statements.slice();
  let updateSourceFile = false;

  moduleFile.cmps.forEach((cmp) => {
    cmp.styles.forEach((style) => {
      updateSourceFile = true;
      if (typeof style.styleIdentifier === 'string') {
        statements = updateEsmStyleImportPath(transformOpts, tsSourceFile, statements, cmp, style);
      } else if (style.externalStyles.length > 0) {
        // add style imports built from @Component() styleUrl option
        styleImports.push(...createEsmStyleImport(transformOpts, tsSourceFile, cmp, style));
      }
    });
  });

  if (updateSourceFile) {
    let lastImportIndex = -1;

    for (let i = 0; i < statements.length; i++) {
      if (ts.isImportDeclaration(statements[i])) {
        lastImportIndex = i;
      }
    }

    statements.splice(lastImportIndex + 1, 0, ...styleImports);

    return ts.factory.updateSourceFile(tsSourceFile, statements);
  }

  return tsSourceFile;
};

const updateEsmStyleImportPath = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  statements: ts.Statement[],
  cmp: d.ComponentCompilerMeta,
  style: d.StyleCompiler,
): ts.Statement[] => {
  for (let i = 0; i < statements.length; i++) {
    const n = statements[i];
    if (ts.isImportDeclaration(n) && n.importClause && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
      if (n.importClause.name && n.importClause.name.escapedText === style.styleIdentifier) {
        const orgImportPath = n.moduleSpecifier.text;
        const importPath = getStyleImportPath(transformOpts, tsSourceFile, cmp, style, orgImportPath);

        statements[i] = ts.factory.updateImportDeclaration(
          n,
          retrieveTsModifiers(n),
          n.importClause,
          ts.factory.createStringLiteral(importPath),
          undefined,
        );
        break;
      }
    }
  }
  return statements;
};

const createEsmStyleImport = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  cmp: d.ComponentCompilerMeta,
  style: d.StyleCompiler,
) => {
  const imports: ts.ImportDeclaration[] = [];
  for (const externalStyle of style.externalStyles) {
    /**
     * Add import statement for each style
     * e.g. `const _ImportPathStyle = require('./import-path.css');`
     *
     * Attention: if you make changes to the import identifier (e.g. `_ImportPathStyle`),
     * you also need to update the identifier in [`createStyleIdentifierFromUrl`](`src/compiler/transformers/add-static-style.ts`).
     */
    const importIdentifier = ts.factory.createIdentifier(getIdentifierFromResourceUrl(externalStyle.absolutePath));
    const importPath = getStyleImportPath(transformOpts, tsSourceFile, cmp, style, externalStyle.absolutePath);

    imports.push(
      ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(false, importIdentifier, undefined),
        ts.factory.createStringLiteral(importPath),
      ),
    );
  }

  return imports;
};

/**
 * Iterate over all components defined in given module, collect require
 * statements to be added and update source file with them.
 * @param transformOpts transform options configured for the current output target transpilation
 * @param tsSourceFile the TypeScript source file that is being updated
 * @param moduleFile component file to update
 * @returns update source file with added import statements
 */
const updateCjsStyleRequires = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  moduleFile: d.Module,
) => {
  const styleRequires: ts.Statement[] = [];

  moduleFile.cmps.forEach((cmp) => {
    cmp.styles.forEach((style) => {
      if (style.externalStyles.length > 0) {
        // add style imports built from @Component() styleUrl option
        styleRequires.push(...createCjsStyleRequire(transformOpts, tsSourceFile, cmp, style));
      }
    });
  });

  if (styleRequires.length > 0) {
    return ts.factory.updateSourceFile(tsSourceFile, [...styleRequires, ...tsSourceFile.statements]);
  }

  return tsSourceFile;
};

const createCjsStyleRequire = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  cmp: d.ComponentCompilerMeta,
  style: d.StyleCompiler,
) => {
  const imports: ts.VariableStatement[] = [];
  for (const externalStyle of style.externalStyles) {
    /**
     * Add import statement for each style
     * e.g. `import _ImportPathStyle from './import-path.css';`
     *
     * Attention: if you make changes to the import identifier (e.g. `_ImportPathStyle`),
     * you also need to update the identifier in [`createStyleIdentifierFromUrl`](`src/compiler/transformers/add-static-style.ts`).
     */
    const importIdentifier = ts.factory.createIdentifier(getIdentifierFromResourceUrl(externalStyle.absolutePath));
    const importPath = getStyleImportPath(transformOpts, tsSourceFile, cmp, style, externalStyle.absolutePath);

    imports.push(
      ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              importIdentifier,
              undefined,
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier('require'),
                [],
                [ts.factory.createStringLiteral(importPath)],
              ),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
    );
  }

  return imports;
};

const getStyleImportPath = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  cmp: d.ComponentCompilerMeta,
  style: d.StyleCompiler,
  importPath: string,
) => {
  const importData: d.SerializeImportData = {
    importeePath: importPath,
    importerPath: tsSourceFile.fileName,
    tag: cmp.tagName,
    encapsulation: cmp.encapsulation,
    mode: style.modeName,
  };
  return serializeImportPath(importData, transformOpts.styleImportData, transformOpts.module);
};
