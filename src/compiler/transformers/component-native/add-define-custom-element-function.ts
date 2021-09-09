import type * as d from '../../../declarations';
import { createImportStatement, getModuleFromSourceFile } from '../transform-utils';
import { dashToPascalCase, formatComponentRuntimeMeta, stringifyRuntimeData } from '@utils';
import ts from 'typescript';
import { creeateComponentMetadataProxy } from '../add-component-meta-proxy';
import { addCoreRuntimeApi, RUNTIME_APIS } from '../core-runtime-apis';


export const addDefineCustomElementFunctions = (
  compilerCtx: d.CompilerCtx,
  components: d.ComponentCompilerMeta[]
): ts.TransformerFactory<ts.SourceFile> => {
  return () => {
    return (tsSourceFile) => {
      const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
      const newStatements: ts.Statement[] = [];
      const caseStatements: ts.CaseClause[] = [];
      addCoreRuntimeApi(moduleFile, RUNTIME_APIS.proxyCustomElement);

      if (moduleFile.cmps.length) {
        // console.log(`I Am ${tsSourceFile.fileName} and I have ${moduleFile.cmps.length} components`);
        const cmpName = dashToPascalCase(moduleFile.cmps[0].tagName);

        // wraps the initial component class in a `proxyCustomElement` wrapper.
        // This is what will be exported and called from the `defineCustomElement` call.
        const metaExpression = ts.factory.createExpressionStatement(
          ts.factory.createBinaryExpression(
            ts.factory.createIdentifier(cmpName),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            creeateComponentMetadataProxy(moduleFile.cmps[0])
          )
        )
        newStatements.push(metaExpression);

        // define the current component - `customElements.define(tagName, MyProxiedComponent);`
        const callExpression = ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier('customElements'),
            'define'
          ),
          undefined,
          [
            ts.factory.createIdentifier('tagName'),
            ts.factory.createIdentifier(cmpName)
          ]
        )
        // create a `case` block that defines the current component. We'll add them to our switch statement later.
        caseStatements.push(createCaseBlock(moduleFile.cmps[0].tagName, callExpression));

        setupComponentDependencies(moduleFile, components, newStatements, caseStatements);
        addDefineCustomElementFunction(moduleFile.cmps[0], newStatements, caseStatements);
      }

      tsSourceFile = ts.factory.updateSourceFile(tsSourceFile, [...tsSourceFile.statements, ...newStatements]);

      const printer = ts.createPrinter({ newLine: 0 });
      const mouse = printer.printNode(ts.EmitHint.Unspecified, tsSourceFile, tsSourceFile);
      console.log(mouse);

      return tsSourceFile;
    };
  };
}

// adds dependent component import statements and sets up and case blocks
const setupComponentDependencies = (
  moduleFile: d.Module,
  components: d.ComponentCompilerMeta[],
  newStatements: ts.Statement[],
  caseStatements: ts.CaseClause[]
) => {
  moduleFile.cmps.forEach(cmp => {
    cmp.dependencies.forEach(dCmp => {
      const foundDep = components.find(dComp => dComp.tagName === dCmp);
      const exportName = dashToPascalCase(foundDep.tagName);
      const importAs = `$${exportName}DefineCustomElement`;

      // Will add `import { defineCustomElement as  $ComponentDefineCustomElement } from 'mycomponent.tsx';`
      newStatements.push(createImportStatement([`defineCustomElement as ${importAs}`], foundDep.sourceFilePath));

      // define a dependent component by recursively calling their own `defineCustomElement()`
      const callExpression = ts.factory.createCallExpression(
        ts.factory.createIdentifier(importAs),
        undefined,
        [ts.factory.createIdentifier('tagRename')]
      );
      // `case` blocks that define the dependent components. We'll add them to our switch statement later.
      caseStatements.push(createCaseBlock(foundDep.tagName, callExpression));
    });
  })
}

/**
 * Creates a case block which will be used to define components. e.g.
 * ```
 case "nested-component":
    tagName = "nested-component";
    if (tagRename) {
        tagName = tagRename(tagName);
      }
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MyProxiedComponent);
        // OR for dependent components
        defineCustomElement(tagRename);
      }
      break;
  } });
  ```
 * @param tagName
 * @param actionExpression
 * @returns ts AST CaseClause
 */
const createCaseBlock = (tagName: string, actionExpression: ts.Expression) => {
  return ts.factory.createCaseClause(
    ts.factory.createStringLiteral(tagName),
    [
      ts.factory.createExpressionStatement(
        ts.factory.createBinaryExpression(
          ts.factory.createIdentifier('tagName'),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createStringLiteral(tagName)
        )
      ),
      ts.factory.createIfStatement(
        ts.factory.createIdentifier('tagRename'),
        ts.factory.createBlock([
          ts.factory.createExpressionStatement(
            ts.factory.createBinaryExpression(
              ts.factory.createIdentifier('tagName'),
              ts.factory.createToken(ts.SyntaxKind.EqualsToken),
              ts.factory.createCallExpression(
                ts.factory.createIdentifier('tagRename'),
                undefined,
                [ts.factory.createIdentifier('tagName')]
              )
            )
          )
        ])
      ),
      ts.factory.createIfStatement(
        ts.factory.createPrefixUnaryExpression(
          ts.SyntaxKind.ExclamationToken,
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier('customElements'),
              'get'
            ),
            undefined,
            [ts.factory.createIdentifier('tagName')]
          )
        ),
        ts.factory.createBlock([
          ts.factory.createExpressionStatement(actionExpression)
        ])
      ),
      ts.factory.createBreakStatement(),
    ]
  )
}

/**
 * Add the main `defineCustomElement` function e.g.
 * ```
 function defineCustomElement(tagRename) {
   var tagName;
   components.forEach(origTagName => { switch (cmp) {
     case "nested-component":
       tagName = "nested-component";
       if (tagRename) {
         tagName = tagRename(tagName);
       }
       if (!customElements.get(tagName)) {
        customElements.define(tagName, MyProxiedComponent);
        // OR for dependent components
        defineCustomElement(tagRename);
       }
       break;
   } });
 }
 ```
 * @param cmp
 * @param newStatements
 * @param caseStatements
 */
const addDefineCustomElementFunction = (cmp: d.ComponentCompilerMeta, newStatements: ts.Statement[], caseStatements: ts.CaseClause[]) => {
  const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));
  console.log(meta);

  const newExpression = ts.factory.createFunctionDeclaration(
    undefined,
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    ts.factory.createIdentifier('defineCustomElement'),
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        ts.factory.createIdentifier('tagRename')
      )
    ],
    undefined,
    ts.factory.createBlock(
      [
        ts.factory.createVariableStatement(
          undefined,
          [ts.factory.createVariableDeclaration('tagName')]
        ),
        ts.factory.createExpressionStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier('components'),
              'forEach'
            ),
            undefined,
            [
              ts.factory.createArrowFunction(
                undefined,
                undefined,
                [ts.factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  ts.factory.createIdentifier('origTagName'),
                  undefined,
                  undefined
                )],
                undefined,
                ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                ts.factory.createBlock([
                  ts.factory.createSwitchStatement(
                    ts.factory.createIdentifier('cmp'),
                    ts.factory.createCaseBlock(caseStatements)
                  )
                ])
              )
            ]
          )
        )
      ],
      true
    )
  );

  newStatements.push(newExpression);
};
