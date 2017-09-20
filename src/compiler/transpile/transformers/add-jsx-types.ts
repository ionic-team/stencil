/*
declare global  {
  namespace JSX {
    interface IntrinsicElements {
      'stencil-router-redirect': JSXElements.StencilRouterRedirectAttributes;
    }
  }
  namespace JSXElements {
    export interface StencilRouterRedirectAttributes extends HTMLAttributes {
      url?: string;
    }
  }
}
*/


/*
IdentifierObject 'global'
TokenObject kind 124
IdentifierObject 'global'
NodeObject kind 234
NodeObject kind 233
IdentifierObject
  escapedText: JSX
NodeObject kind 234
NodeObject kind 230
  IdentifierObject
    escaptedText: IntrinsicElements
TokenObject kind 148
  text: 'stencil-router-redirect'
NodeObject kind 159
NodeObject kind 143
IdentifierObject
  escaptedText: JSXElements
IdentifierObject
  escaptedText StencilRouterRedirectAttributes

IdentifierObject
  escaptedText JSXElements
NodeObject kind 234
NodeObject kind 230
  modifiers: [TokenObject kind 84]
  IdentifierObject
    escaptedText : StencilRouterRedirectAttributes
NodeObject kind 259
IdentifierObject
  escaptedText: HTMLAttributes
NodeObject kind 148
  questionToken: TokenObject kind 55
  symbol: escapedName: url
TokenObject kind 136
}
*/

import { ModuleFiles } from '../../../util/interfaces';
// import { dashToPascalCase } from '../../../util/helpers';
import * as ts from 'typescript';

export default function addJsxTypes(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {
    return (tsSourceFile) => {
      return visit(tsSourceFile.fileName, tsSourceFile) as ts.SourceFile;
    };

    function visit(fileName: string, node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ClassDeclaration:
          const moduleFile = moduleFiles[fileName];
          const tagName = moduleFile.cmpMeta.tagNameMeta;
          tagName;
          // const memberMeta = moduleFile.cmpMeta.membersMeta;
          // const pascalCaseTagName = dashToPascalCase(tagName);

          const jsxNamespaceBlock = ts.createInterfaceDeclaration(undefined, undefined, 'JSX', undefined, undefined, [
            // ts.createPropertySignature(undefined, tagName, undefined, ts.createIdentifier('JSXElements'))
          ]);

          const jsxElementsNamespaceBlock = ts.createInterfaceDeclaration(undefined, undefined, 'JSXElements', undefined, undefined, [

          ]);

          const moduleBlock = ts.createModuleBlock([
            ts.createModuleBlock([
              jsxNamespaceBlock,
              jsxElementsNamespaceBlock
            ])
          ]);
          const moduleName = ts.createLiteral('global');
          const globalBlock = ts.createModuleDeclaration(undefined, undefined, moduleName, moduleBlock, undefined);
          return [
            node,
            globalBlock
          ];

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileName, node);
          }, transformContext);
      }
    }
  };
}
