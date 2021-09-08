import type * as d from '../../declarations';
import { convertValueToLiteral } from './transform-utils';
import { formatComponentRuntimeMeta } from '@utils';
import { PROXY_CUSTOM_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import ts from 'typescript';

export const addDefineCustomElementFunctions = (tsSourceFile: ts.SourceFile, moduleFile: d.Module) => {
  const statements = tsSourceFile.statements.slice();

  // addCoreRuntimeApi(moduleFile, RUNTIME_APIS.proxyCustomElement);

  statements.push(...moduleFile.cmps.map(addDefineCustomElementFunction));

  moduleFile.cmps[0].dependencies

  return ts.factory.updateSourceFile(tsSourceFile, statements);
};

const addDefineCustomElementFunction = (compilerMeta: d.ComponentCompilerMeta) => {

  // compilerMeta.compo

  const meta = stringifyRuntimeData(formatComponentRuntimeMeta(cmp, false));

  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('defineCustomElement'),
      undefined,
      [
        ts.factory.createConditionalExpression(
          ts.factory.createIdentifier('tagRename'),
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          undefined,
          undefined,
          ts.factory.createArrowFunction(
            undefined,
            undefined,
            [
              ts.factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                ts.factory.createIdentifier('origTagName'),
                undefined,
                ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
              )
            ],
            undefined,
            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            ts.factory.createIdentifier('string')
          )
        )
      ]
    )
  );
};



function stringifyRuntimeData(arg0: any) {
  throw new Error('Function not implemented.');
}
//
