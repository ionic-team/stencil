import { catchError } from '../../util';
import { Diagnostic, MemberMeta, MembersMeta, PropOptions, AttributeTypeInfo } from '../../../util/interfaces';
import { MEMBER_TYPE, PROP_TYPE } from '../../../util/constants';
import * as ts from 'typescript';

const DEFINED_TYPE_REFERENCES = [
  'Array',
  'Date',
  'Function',
  'Number',
  'Object',
  'ReadonlyArray',
  'RegExp',
  'String'
];

export function getPropDecoratorMeta(tsFilePath: string, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile): MembersMeta {
  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  return decoratedMembers
    .filter((prop: ts.PropertyDeclaration) => (
      prop.decorators.some((decorator: ts.Decorator) => decorator.getFullText().indexOf('Prop(') !== -1) &&
      (EXCLUDE_PROP_NAMES.indexOf((<ts.Identifier>prop.name).text) === -1)
    ))
    .reduce((allMembers: MembersMeta, prop: ts.PropertyDeclaration) => {
      const memberData: MemberMeta = {};

      const propDecorator = prop.decorators.find((decorator: ts.Decorator) => (
        decorator.getFullText().indexOf('Prop(') !== -1)
      );
      const suppliedOptions = (<ts.CallExpression>propDecorator.expression).arguments
        .map(arg => {
          try {
            const fnStr = `return ${arg.getText()};`;
            return new Function(fnStr)();

          } catch (e) {
            const d = catchError(diagnostics, e);
            d.messageText = `parse prop options: ${e}`;
            d.absFilePath = tsFilePath;
          }
        });
      const propOptions: PropOptions = suppliedOptions[0];
      const attribName = (<ts.Identifier>prop.name).text;

      if (propOptions) {
        if (typeof propOptions.connect === 'string') {
          memberData.memberType = MEMBER_TYPE.PropConnect;
          memberData.ctrlId = propOptions.connect;
        }

        if (typeof propOptions.context === 'string') {
          memberData.memberType = MEMBER_TYPE.PropContext;
          memberData.ctrlId = propOptions.context;
        }

        if (typeof propOptions.state === 'boolean') {
          diagnostics.push({
            level: 'warn',
            type: 'build',
            header: '@Prop({ state: true }) option has been deprecated',
            messageText: `"state" has been renamed to @Prop({ mutable: true }) ${tsFilePath}`,
            absFilePath: tsFilePath
          });
          propOptions.mutable = propOptions.state;
        }

        if (typeof propOptions.mutable === 'boolean') {
          memberData.memberType = MEMBER_TYPE.PropMutable;
        }
      } else {
        let attribType;
        let typeWarning: Diagnostic;

        // If the @Prop() attribute does not have a defined type then infer it
        if (!prop.type) {
          let attribTypeText = inferPropType(prop.initializer);
          if (!attribTypeText) {
            attribTypeText = 'any';
            typeWarning = {
              level: 'warn',
              type: 'build',
              header: 'Prop type provided is not supported, defaulting to any',
              messageText: `'${prop.getFullText()}' from ${tsFilePath}`,
              absFilePath: tsFilePath
            };
          }
          attribType = {
            text: attribTypeText,
            isReferencedType: false
          };
        } else {
          [ attribType, typeWarning] = checkType(prop.type, sourceFile, tsFilePath);
        }

        if (typeWarning) {
          diagnostics.push(typeWarning);
        }

        memberData.memberType = MEMBER_TYPE.Prop;
        memberData.attribType = attribType;
        memberData.attribName = attribName;
        memberData.propType = propTypeFromTSType(attribType.text);
      }

      allMembers[attribName] = memberData;

      prop.decorators = undefined;
      return allMembers;
    }, {} as MembersMeta);
}



const EXCLUDE_PROP_NAMES = ['mode', 'color'];

function checkType(type: ts.TypeNode, sourceFile: ts.SourceFile, tsFilePath: string): [ AttributeTypeInfo, Diagnostic | undefined ] {
  const text = type.getFullText().trim();
  const isReferencedType = (ts.isTypeReferenceNode(type) && DEFINED_TYPE_REFERENCES.indexOf(text) === -1);

  if (isReferencedType) {
    return checkTypeRefencedNode(<ts.TypeReferenceNode>type, sourceFile, tsFilePath);
  }

  return [
    {
      text,
      isReferencedType
    },
    undefined
  ];
}

function checkTypeRefencedNode(type: ts.TypeReferenceNode, sourceFile: ts.SourceFile, tsFilePath: string): [ AttributeTypeInfo, Diagnostic | undefined ] {
  let typeName = type.typeName.getText();

  // Loop through all top level exports to find if any reference to the type
  const isExported = sourceFile.statements.some(st => {
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
    return [
      {
        text: typeName,
        isReferencedType: true,
      },
      undefined
    ];
  }

  // Loop through all top level imports to find any reference to the type
  const importTypeDeclaration = sourceFile.statements.find(st => {
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
    return [
      {
        text: typeName,
        isReferencedType: true,
        importedFrom: (<ts.StringLiteral>(<ts.ImportDeclaration>importTypeDeclaration).moduleSpecifier).text
      },
      undefined
    ];
  }

  return [
    {
      text: 'any',
      isReferencedType: false,
    },
    {
      level: 'warn',
      type: 'build',
      header: 'Prop has referenced interface that is not exported, defaulting type to any',
      messageText: `Interface '${typeName}' must be exported from ${tsFilePath}`,
      absFilePath: tsFilePath
    }
  ];
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
  default:
    return PROP_TYPE.Any;
  }
}
