import * as d from '@declarations';
import { getStyleIdPlaceholder, getStyleTextPlaceholder } from '../app-core/register-app-styles';
import ts from 'typescript';


export function registerStyle(tsSourceFile: ts.SourceFile, cmps: d.ComponentCompilerMeta[]) {
  if (!cmps.some(cmp => cmp.hasStyle)) {
    return tsSourceFile;
  }

  const registerStyleCalls = cmps.map(createRegisterStyleCall);

  return ts.updateSourceFileNode(tsSourceFile, [
    ...tsSourceFile.statements,
    ...registerStyleCalls
  ]);
}


function createRegisterStyleCall(cmp: d.ComponentCompilerMeta) {
  const registerStyleMethodArgs = [
    ts.createStringLiteral(getStyleIdPlaceholder(cmp)),
    ts.createStringLiteral(getStyleTextPlaceholder(cmp))
  ];

  const registerStyleMethod = ts.createCall(
    ts.createIdentifier('__stencil_registerStyle'),
    undefined,
    registerStyleMethodArgs
  );

  return ts.createExpressionStatement(registerStyleMethod);
}
