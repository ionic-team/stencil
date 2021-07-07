import type * as d from '../../../declarations';
import { addCreateEvents } from '../create-event';
import { addLegacyProps } from '../legacy-props';
import { REGISTER_INSTANCE, RUNTIME_APIS, addCoreRuntimeApi } from '../core-runtime-apis';
import ts from 'typescript';

export const updateLazyComponentConstructor = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta,
) => {
  const cstrMethodArgs = [ts.createParameter(undefined, undefined, undefined, ts.createIdentifier(HOST_REF_ARG))];

  const cstrMethodIndex = classMembers.findIndex(m => m.kind === ts.SyntaxKind.Constructor);
  if (cstrMethodIndex >= 0) {
    // add to the existing constructor()
    const cstrMethod = classMembers[cstrMethodIndex] as ts.ConstructorDeclaration;

    const body = ts.updateBlock(cstrMethod.body, [
      registerInstanceStatement(moduleFile),
      ...addCreateEvents(moduleFile, cmp),
      ...cstrMethod.body.statements,
      ...addLegacyProps(moduleFile, cmp),
    ]);

    classMembers[cstrMethodIndex] = ts.updateConstructor(
      cstrMethod,
      cstrMethod.decorators,
      cstrMethod.modifiers,
      cstrMethodArgs,
      body,
    );
  } else {
    // create a constructor()
    const cstrMethod = ts.createConstructor(
      undefined,
      undefined,
      cstrMethodArgs,
      ts.createBlock(
        [
          registerInstanceStatement(moduleFile),
          ...addCreateEvents(moduleFile, cmp),
          ...addLegacyProps(moduleFile, cmp),
        ],
        true,
      ),
    );
    classMembers.unshift(cstrMethod);
  }
};

const registerInstanceStatement = (moduleFile: d.Module) => {
  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.registerInstance);

  return ts.createStatement(
    ts.createCall(ts.createIdentifier(REGISTER_INSTANCE), undefined, [
      ts.createThis(),
      ts.createIdentifier(HOST_REF_ARG),
    ]),
  );
};

const HOST_REF_ARG = 'hostRef';
