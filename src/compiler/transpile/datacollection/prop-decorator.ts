import { AttributeTypeInfo, AttributeTypeReference, Diagnostic, MemberMeta, MembersMeta, PropOptions } from '../../../declarations';
import { catchError } from '../../util';
import { isDecoratorNamed, serializeSymbol } from './utils';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import * as ts from 'typescript';


export function getPropDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile, diagnostics: Diagnostic[]): MembersMeta {
  return classNode.members
    .filter(member => Array.isArray(member.decorators) && member.decorators.length > 0)
    .reduce((allMembers: MembersMeta, prop: ts.PropertyDeclaration) => {
      const memberData: MemberMeta = {};
      const propDecorator = prop.decorators.find(isDecoratorNamed('Prop'));
      if (propDecorator == null) {
        return allMembers;
      }

      const suppliedOptions = (<ts.CallExpression>propDecorator.expression).arguments
        .map(arg => {
          try {
            const fnStr = `return ${arg.getText()};`;
            return new Function(fnStr)();

          } catch (e) {
            const d = catchError(diagnostics, e);
            d.messageText = `parse prop options: ${e}`;
          }
        });
      const propOptions: PropOptions = suppliedOptions[0];
      const memberName = (<ts.Identifier>prop.name).text;
      const symbol = checker.getSymbolAtLocation(prop.name);

      if (propOptions && typeof propOptions.connect === 'string') {
        memberData.memberType = MEMBER_TYPE.PropConnect;
        memberData.ctrlId = propOptions.connect;

      } else if (propOptions && typeof propOptions.context === 'string') {
        memberData.memberType = MEMBER_TYPE.PropContext;
        memberData.ctrlId = propOptions.context;

      } else {
        let attribType: AttributeTypeInfo;

        // If the @Prop() attribute does not have a defined type then infer it
        if (!prop.type) {
          let attribTypeText = inferPropType(prop.initializer);

          if (!attribTypeText) {
            attribTypeText = 'any';
            diagnostics.push({
              level: 'warn',
              type: 'build',
              header: 'Prop type provided is not supported, defaulting to any',
              messageText: `'${prop.getFullText()}'`,
            });
          }
          attribType = {
            text: attribTypeText,
          };
        } else {
          attribType = getAttributeTypeInfo(prop.type, sourceFile);
        }

        if (propOptions && typeof propOptions.state === 'boolean') {
          diagnostics.push({
            level: 'warn',
            type: 'build',
            header: '@Prop({ state: true }) option has been deprecated',
            messageText: `"state" has been renamed to @Prop({ mutable: true })`,
          });
          propOptions.mutable = propOptions.state;
        }

        if (propOptions && typeof propOptions.mutable === 'boolean') {
          memberData.memberType = MEMBER_TYPE.PropMutable;
        } else {
          memberData.memberType = MEMBER_TYPE.Prop;
        }

        memberData.attribName = memberName;
        memberData.attribType = attribType;
        memberData.propType = propTypeFromTSType(attribType.text);
        memberData.jsdoc = serializeSymbol(checker, symbol);
      }

      allMembers[memberName] = memberData;
      return allMembers;
    }, {} as MembersMeta);
}




function getAttributeTypeInfo(type: ts.TypeNode, sourceFile: ts.SourceFile): AttributeTypeInfo {
  const typeInfo: AttributeTypeInfo = {
    text: type.getFullText().trim()
  };
  const typeReferences = getAllTypeReferences(type)
    .reduce((allReferences, rt)  => {
      allReferences[rt] = getTypeReferenceLocation(rt, sourceFile);
      return allReferences;
    }, {} as { [key: string]: AttributeTypeReference});

  if (Object.keys(typeReferences).length > 0) {
    typeInfo.typeReferences = typeReferences;
  }
  return typeInfo;
}

function getAllTypeReferences(node: ts.TypeNode): string[] {
  const referencedTypes: string[] = [];

  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    switch (node.kind) {
    case ts.SyntaxKind.TypeReference:
      referencedTypes.push((<ts.TypeReferenceNode>node).typeName.getText().trim());
      if ((<ts.TypeReferenceNode>node).typeArguments) {
        (<ts.TypeReferenceNode>node).typeArguments
          .filter(ta => ts.isTypeReferenceNode(ta))
          .forEach(tr => referencedTypes.push((<ts.TypeReferenceNode>tr).typeName.getText().trim()));
      }
    /* tslint:disable */
    default:
      return ts.forEachChild(node, (node) => {
        return visit(node);
      });
    }
    /* tslint:enable */
  }

  visit(node);

  return referencedTypes;
}

function getTypeReferenceLocation(typeName: string, sourceFile: ts.SourceFile): AttributeTypeReference {

  const sourceFileObj = sourceFile.getSourceFile();

  // Loop through all top level imports to find any reference to the type for 'import' reference location
  const importTypeDeclaration = sourceFileObj.statements.find(st => {
    const statement = ts.isImportDeclaration(st) &&
      ts.isImportClause(st.importClause) &&
      st.importClause.namedBindings &&  ts.isNamedImports(st.importClause.namedBindings) &&
      Array.isArray(st.importClause.namedBindings.elements) &&
      st.importClause.namedBindings.elements.find(nbe => nbe.name.getText() === typeName);
    if (!statement) {
      return false;
    }
    return true;
  });

  if (importTypeDeclaration) {
    const localImportPath = (<ts.StringLiteral>(<ts.ImportDeclaration>importTypeDeclaration).moduleSpecifier).text;
    return {
      referenceLocation: 'import',
      importReferenceLocation: localImportPath
    };
  }

  // Loop through all top level exports to find if any reference to the type for 'local' reference location
  const isExported = sourceFileObj.statements.some(st => {
    // Is the interface defined in the file and exported
    const isInterfaceDeclarationExported = ((ts.isInterfaceDeclaration(st) &&
      (<ts.Identifier>st.name).getText() === typeName) &&
      Array.isArray(st.modifiers) &&
      st.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword));

    // Is the interface exported through a named export
    const isTypeInExportDeclaration = ts.isExportDeclaration(st) &&
      ts.isNamedExports(st.exportClause) &&
      st.exportClause.elements.some(nee => nee.name.getText() === typeName);

    return isInterfaceDeclarationExported || isTypeInExportDeclaration;
  });

  if (isExported) {
    return {
      referenceLocation: 'local'
    };
  }


  // This is most likely a global type, if it is a local that is not exported then typescript will inform the dev
  return {
    referenceLocation: 'global',
  };
}

function inferPropType(expression: ts.Expression | undefined) {
  if (expression == null) {
    return undefined;
  }
  if (ts.isStringLiteral(expression)) {
    return 'string';
  }
  if (ts.isNumericLiteral(expression)) {
    return 'number';
  }
  if ([ ts.SyntaxKind.BooleanKeyword, ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword ].indexOf(expression.kind) !== -1) {
    return 'boolean';
  }
  if ((ts.SyntaxKind.NullKeyword === expression.kind) ||
      (ts.SyntaxKind.UndefinedKeyword === expression.kind) ||
      (ts.isRegularExpressionLiteral(expression)) ||
      (ts.isArrayLiteralExpression(expression)) ||
      (ts.isObjectLiteralExpression(expression))) {
    return 'any';
  }
  return undefined;
}

function propTypeFromTSType(type: string) {
  switch (type) {
    case 'string':
      return PROP_TYPE.String;
    case 'number':
      return PROP_TYPE.Number;
    case 'boolean':
      return PROP_TYPE.Boolean;
    case 'any':
      return PROP_TYPE.Any;
    default:
      return PROP_TYPE.Unknown;
  }
}
