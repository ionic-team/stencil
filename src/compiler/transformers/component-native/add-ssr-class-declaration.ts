import ts from 'typescript';
import { HTML_ELEMENT } from '../core-runtime-apis';

/**
 * const HTMLElementSSR = (
 *  typeof HTMLElement !== 'undefined'
 *  ? HTMLElement
 *  : class {});
 */

export const addHTMLElementSSRClassDeclaration = (): ts.TransformerFactory<ts.SourceFile> => {
  return () => {
    return (tsSourceFile: ts.SourceFile): ts.SourceFile => {

      const newStatements: ts.Statement[] = [];

      const HTMLElementSSRDecration = ts.factory.createVariableDeclaration(
        HTML_ELEMENT_SSR,
        undefined,
        undefined,
        ts.factory.createParenthesizedExpression(
          ts.factory.createConditionalExpression(
            // condition
            ts.factory.createStrictInequality(
              ts.factory.createTypeOfExpression(
                ts.factory.createIdentifier(HTML_ELEMENT)
              ),
              ts.factory.createStringLiteral('undefined')
            ),
            // question token
            null,
            // when true
            ts.factory.createIdentifier(HTML_ELEMENT),
            // colon token,
            null,
            // when false
            ts.factory.createClassExpression(
              undefined,
              undefined,
              '',
              undefined,
              undefined,
              undefined
            )
          )
        )
      );

      newStatements.push(ts.factory.createVariableStatement(undefined, [HTMLElementSSRDecration]));

      tsSourceFile = ts.factory.updateSourceFile(tsSourceFile, [...tsSourceFile.statements, ...newStatements]);

      return tsSourceFile;
    }
  }
}

export const HTML_ELEMENT_SSR = "HTMLElementSSR";

