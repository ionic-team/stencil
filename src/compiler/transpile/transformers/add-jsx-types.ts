import { ModuleFiles, ComponentMeta } from '../../../util/interfaces';
import * as ts from 'typescript';

/*
    namespace JSX {
      interface IntrinsicElements {
        'stencil-router-redirect': JSXElements.StencilRouterRedirectAttributes;
      }
    }
*/
function createJSXNamespace() {
  const members = ['url'].map(p => {
    const type = ts.createTypeReferenceNode(ts.createIdentifier('string'), []);
      return ts.createPropertySignature(
        undefined,
        p,
        ts.createToken(ts.SyntaxKind.QuestionToken),
        type,
        undefined
      );
    }
  );

  const namespaceBlock = ts.createInterfaceDeclaration(
    undefined,
    undefined,
    'IntrinsicElements',
    undefined,
    undefined,
    members
  );
  return ts.createModuleDeclaration(
    undefined,
    undefined,
    ts.createLiteral('JSX'),
    ts.createModuleBlock([namespaceBlock]),
    ts.NodeFlags.Namespace
  );
}

/*
    namespace JSXElements {
      export interface StencilRouterRedirectAttributes extends HTMLAttributes {
        url?: string;
      }
    }
  */
function createJSXElementsNamespace() {
  const type = ts.createTypeReferenceNode(ts.createIdentifier('JSXElements.StencilRouterRedirectAttributes'), []);
  const member = ts.createPropertySignature(
    undefined,
    'stencil-router-redirect',
    undefined,
    type,
    undefined
  );
  const namespaceBlock = ts.createInterfaceDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    'StencilRouterRedirectAttributes',
    undefined,
    [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier('HTMLAttributes'))])],
    [member]
  );

  return ts.createModuleDeclaration(
    undefined,
    undefined,
    ts.createLiteral('JSXElements'),
    ts.createModuleBlock([namespaceBlock]),
    ts.NodeFlags.Namespace
  );
}

/*
    interface HTMLElementTagNameMap {
      'stencil-router-redirect': HTMLRedirectElement
    }
*/
function createHTMLElementTagNameMap() {
  const type = ts.createTypeReferenceNode(ts.createIdentifier('HTMLRedirectElement'), []);
  const member = ts.createPropertySignature(
    undefined,
    'stencil-router-redirect',
    undefined,
    type,
    undefined
  );
  return ts.createInterfaceDeclaration(
    undefined,
    undefined,
    'HTMLElementTagNameMap',
    undefined,
    undefined,
    [member]
  );
}

/*
    interface ElementTagNameMap {
      'stencil-router-redirect': HTMLRedirectElement
    }
*/
function createElementTagNameMap() {
  const type = ts.createTypeReferenceNode(ts.createIdentifier('HTMLRedirectElement'), []);
  const member = ts.createPropertySignature(
    undefined,
    'stencil-router-redirect',
    undefined,
    type,
    undefined
  );
  return ts.createInterfaceDeclaration(
    undefined,
    undefined,
    'HTMLElementTagNameMap',
    undefined,
    undefined,
    [member]
  );
}

/*
  declare var HTMLRedirectElement: {
    prototype: HTMLRedirectElement;
    new(): HTMLRedirectElement;
  }
function createDeclareHTMLElement() {
  const type = ts.createTypeReferenceNode(ts.createIdentifier('HTMLRedirectElement'), []);
  const member = ts.createPropertySignature(
    undefined,
    'prototype',
    undefined,
    type,
    undefined
  );
  const member2 = ts.createPropertySignature(
    undefined,
    'new()',
    undefined,
    type,
    undefined
  );

  return ts.createVariableStatement(
    [ts.createToken(ts.SyntaxKind.DeclareKeyword)],
    [ts.createVariableDeclaration(
      'HTMLRedirectElement',
      ts.createType,
      undefined
    )]
  );
}
*/
/*
  interface HTMLRedirectElement extends Redirect, HTMLElement {}
*/

function createHTMLElementInterface() {
  return ts.createInterfaceDeclaration(
    undefined,
    undefined,
    'HTMLRedirectElement',
    undefined,
    [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier('Redirect')),
      ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier('HTMLElement'))
    ])],
    undefined
  );
}


export default function addJsxTypes(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
      const tagName = cmpMeta.tagNameMeta;
      tagName;
      // const memberMeta = moduleFile.cmpMeta.membersMeta;
      // const pascalCaseTagName = dashToPascalCase(tagName);

      const moduleBlock = ts.createModuleBlock([
        createHTMLElementTagNameMap(),
        createElementTagNameMap(),
        createJSXNamespace(),
        createJSXElementsNamespace()
      ]);

      const globalBlock = ts.createModuleDeclaration(
        undefined,
        undefined,
        undefined,
        moduleBlock,
        ts.NodeFlags.GlobalAugmentation
      );

      return [
        classNode,
        createHTMLElementInterface(),
        // createDeclareHTMLElement(),
        globalBlock
      ];
    }

    function visit(node: ts.Node, cmpMeta: ComponentMeta): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          return visitClass(node as ts.ClassDeclaration, cmpMeta);
        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node, cmpMeta);
          }, transformContext);
      }
    }

    return (tsSourceFile): ts.SourceFile => {
      const moduleFile = moduleFiles[tsSourceFile.fileName];
      if (moduleFile) {
        return visit(tsSourceFile, moduleFile.cmpMeta) as ts.SourceFile;
      }
      return tsSourceFile;
    };
  };
}

