import * as d from '@declarations';
import { addImports } from './transform-utils';
import ts from 'typescript';


export function registerStyle(transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile, cmps: d.ComponentCompilerMeta[]) {
  if (!cmps.some(cmp => cmp.hasStyle)) {
    return tsSourceFile;
  }

  tsSourceFile = addImports(transformCtx, tsSourceFile,
    ['registerStyle'],
    '@stencil/core/app',
  );

  const registerStyleCalls = cmps.map(createRegisterStyleCall);

  return ts.updateSourceFileNode(tsSourceFile, [
    ...tsSourceFile.statements,
    ...registerStyleCalls
  ]);
}


function createRegisterStyleCall(cmp: d.ComponentCompilerMeta) {
  const registerStyleMethodArgs: any = [
    ts.createStringLiteral(`STYLE_ID_PLACEHOLDER:${cmp.tagName}`),
    ts.createStringLiteral(`STYLE_TEXT_PLACEHOLDER:${cmp.tagName}`)
  ];

  const registerStyleMethod = ts.createCall(
    ts.createIdentifier('registerStyle'),
    undefined,
    registerStyleMethodArgs
  );

  return ts.createExpressionStatement(registerStyleMethod);
}
