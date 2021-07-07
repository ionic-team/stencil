import type * as d from '../../../declarations';
import { addCreateEvents } from '../create-event';
import { addLegacyProps } from '../legacy-props';
import { ATTACH_SHADOW, RUNTIME_APIS, addCoreRuntimeApi } from '../core-runtime-apis';
import ts from 'typescript';

export const updateNativeConstructor = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta,
  ensureSuper: boolean,
) => {
  if (cmp.isPlain) {
    return;
  }
  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);

  if (cstrMethodIndex >= 0) {
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    let statements: ts.Statement[] = [
      ...nativeInit(moduleFile, cmp),
      ...addCreateEvents(moduleFile, cmp),
      ...cstrMethod.body.statements,
      ...addLegacyProps(moduleFile, cmp),
    ];

    if (ensureSuper) {
      const hasSuper = cstrMethod.body.statements.some(s => s.kind === ts.SyntaxKind.SuperKeyword);
      if (!hasSuper) {
        statements = [createNativeConstructorSuper(), ...statements];
      }
    }

    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethod.parameters,
      ts.updateBlock(cstrMethod.body, statements),
    );
  } else {
    // create a constructor()
    let statements: ts.Statement[] = [
      ...nativeInit(moduleFile, cmp),
      ...addCreateEvents(moduleFile, cmp),
      ...addLegacyProps(moduleFile, cmp),
    ];

    if (ensureSuper) {
      statements = [createNativeConstructorSuper(), ...statements];
    }

    const cstrMethod = ts.createConstructor(undefined, undefined, undefined, ts.createBlock(statements, true));
    classMembers.unshift(cstrMethod);
  }
};

const nativeInit = (moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  const initStatements = [nativeRegisterHostStatement()];
  if (cmp.encapsulation === 'shadow') {
    initStatements.push(nativeAttachShadowStatement(moduleFile));
  }
  return initStatements;
};

const nativeRegisterHostStatement = () => {
  return ts.createStatement(
    ts.createCall(
      ts.createPropertyAccess(ts.createThis(), ts.createIdentifier('__registerHost')),
      undefined,
      undefined,
    ),
  );
};

const nativeAttachShadowStatement = (moduleFile: d.Module) => {
  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.attachShadow);

  return ts.createStatement(ts.createCall(ts.createIdentifier(ATTACH_SHADOW), undefined, [ts.createThis()]));
};

const createNativeConstructorSuper = () => {
  return ts.createExpressionStatement(ts.createCall(ts.createIdentifier('super'), undefined, undefined));
};
