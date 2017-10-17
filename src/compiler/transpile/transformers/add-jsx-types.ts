import { dashToPascalCase } from '../../../util/helpers';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import { ModuleFiles, ComponentMeta, MembersMeta } from '../../../util/interfaces';
import * as ts from 'typescript';


export function createTypesAsString(cmpMeta: ComponentMeta) {
  const tagName = cmpMeta.tagNameMeta;
  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
  const interfaceName = `HTML${tagNameAsPascal}Element`;
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;
  const interfaceOptions = membersToInterfaceOptions(cmpMeta.membersMeta);

  return `
interface ${interfaceName} extends ${tagNameAsPascal}, HTMLElement {
}
declare var ${interfaceName}: {
  prototype: ${interfaceName};
  new (): ${interfaceName};
};
declare global {
  interface HTMLElementTagNameMap {
      "${tagName}": ${interfaceName};
  }
  interface ElementTagNameMap {
      "${tagName}": ${interfaceName};
  }
  namespace JSX {
      interface IntrinsicElements {
          "${tagName}": JSXElements.${jsxInterfaceName};
      }
  }
  namespace JSXElements {
      export interface ${jsxInterfaceName} extends HTMLAttributes {
          mode?: string,
          color?: string,
        ${Object.keys(interfaceOptions).map((key: string) => `
          ${key}?: ${interfaceOptions[key]}`
        )}
      }
  }
}
`;
}

function membersToInterfaceOptions(membersMeta: MembersMeta): { [key: string]: string } {
  const memberTypes = {
    [PROP_TYPE.Any]: 'any',
    [PROP_TYPE.String]: 'string',
    [PROP_TYPE.Boolean]: 'boolean',
    [PROP_TYPE.Number]: 'number',
  };
  return Object.keys(membersMeta)
    .filter((memberName) => {
      return [MEMBER_TYPE.Method, MEMBER_TYPE.Prop, MEMBER_TYPE.PropConnect, MEMBER_TYPE.PropMutable].indexOf(membersMeta[memberName].memberType) !== -1;
    })
    .reduce((obj, memberName) => {
      const member = membersMeta[memberName];
      obj[memberName] = memberTypes[member.propType || PROP_TYPE.Any];
      return obj;
    }, <{ [key: string]: string }>{});
}

/*
    namespace JSX {
      interface IntrinsicElements {
        'stencil-router-redirect': JSXElements.StencilRouterRedirectAttributes;
      }
    }
*/
function createJSXNamespace(tagName: string, tagNameAsPascal: string) {
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;
  const type = ts.createTypeReferenceNode(ts.createIdentifier(`JSXElements.${jsxInterfaceName}`), []);
  const member = ts.createPropertySignature(
    undefined,
    ts.createLiteral(tagName),
    undefined,
    type,
    undefined
  );
  const namespaceBlock = ts.createInterfaceDeclaration(
    undefined,
    undefined,
    'IntrinsicElements',
    undefined,
    undefined,
    [member]
  );
  return ts.createModuleDeclaration(
    undefined,
    undefined,
    ts.createIdentifier('JSX'),
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
function createJSXElementsNamespace(cmpMeta: ComponentMeta) {
  const memberTypes = {
    [PROP_TYPE.Any]: 'any',
    [PROP_TYPE.String]: 'string',
    [PROP_TYPE.Boolean]: 'boolean | "true" | "false"',
    [PROP_TYPE.Number]: 'number',
  };
  const members = Object.keys(cmpMeta.membersMeta)
    .filter((memberName) => {
      return [MEMBER_TYPE.Method, MEMBER_TYPE.Prop, MEMBER_TYPE.PropConnect, MEMBER_TYPE.PropMutable].indexOf(cmpMeta.membersMeta[memberName].memberType) !== -1;
    })
    .map((memberName) => {
      const member = cmpMeta.membersMeta[memberName];
      const type = ts.createIdentifier(memberTypes[member.propType || PROP_TYPE.Any]);
      return ts.createPropertySignature(
        undefined,
        memberName,
        ts.createToken(ts.SyntaxKind.QuestionToken),
        ts.createTypeReferenceNode(type, []),
        undefined
      );
    });

  const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
  const jsxInterfaceName = `${tagNameAsPascal}Attributes`;
  const namespaceBlock = ts.createInterfaceDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    jsxInterfaceName,
    undefined,
    [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier('HTMLAttributes'))])],
    members
  );

  return ts.createModuleDeclaration(
    undefined,
    undefined,
    ts.createIdentifier('JSXElements'),
    ts.createModuleBlock([namespaceBlock]),
    ts.NodeFlags.Namespace
  );
}

/*
    interface HTMLElementTagNameMap {
      'stencil-router-redirect': HTMLRedirectElement
    }
*/
function createHTMLElementTagNameMap(tagName: string, interfaceName: string) {
  const type = ts.createTypeReferenceNode(ts.createIdentifier(interfaceName), []);
  const member = ts.createPropertySignature(
    undefined,
    ts.createLiteral(tagName),
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
function createElementTagNameMap(tagName: string, interfaceName: string) {
  const type = ts.createTypeReferenceNode(ts.createIdentifier(interfaceName), []);
  const member = ts.createPropertySignature(
    undefined,
    ts.createLiteral(tagName),
    undefined,
    type,
    undefined
  );
  return ts.createInterfaceDeclaration(
    undefined,
    undefined,
    'ElementTagNameMap',
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
*/
function createDeclareHTMLElement(interfaceName: string) {
  const type = ts.createTypeReferenceNode(ts.createIdentifier(interfaceName), []);
  const prototypeMember = ts.createPropertySignature(
    undefined,
    'prototype',
    undefined,
    type,
    undefined
  );
  const constructorMember = ts.createConstructSignature(
    undefined,
    undefined,
    type
  );

  return ts.createVariableStatement(
    [ts.createToken(ts.SyntaxKind.DeclareKeyword)],
    [ts.createVariableDeclaration(
      interfaceName,
      ts.createTypeLiteralNode([prototypeMember, constructorMember]),
      undefined
    )]
  );
}
/*
  interface HTMLRedirectElement extends Redirect, HTMLElement {}
*/

function createHTMLElementInterface(interfaceName: string, className: string) {
  return ts.createInterfaceDeclaration(
    undefined,
    undefined,
    interfaceName,
    undefined,
    [ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier(className)),
      ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier('HTMLElement'))
    ])],
    undefined
  );
}

export default function addJsxTypes(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {
    function visitClass(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
      const tagName = cmpMeta.tagNameMeta;
      const className = cmpMeta.componentClass;
      const tagNameAsPascal = dashToPascalCase(cmpMeta.tagNameMeta);
      const interfaceName = `HTML${tagNameAsPascal}Element`;
      // const memberMeta = moduleFile.cmpMeta.membersMeta;

      const moduleBlock = ts.createModuleBlock([
        createHTMLElementTagNameMap(tagName, interfaceName),
        createElementTagNameMap(tagName, interfaceName),
        createJSXNamespace(tagName, tagNameAsPascal),
        createJSXElementsNamespace(cmpMeta)
      ]);

      const globalBlock = ts.createModuleDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.DeclareKeyword)],
        ts.createIdentifier('global'),
        moduleBlock,
        ts.NodeFlags.GlobalAugmentation
      );

      return [
        classNode,
        createHTMLElementInterface(interfaceName, className),
        createDeclareHTMLElement(interfaceName),
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

