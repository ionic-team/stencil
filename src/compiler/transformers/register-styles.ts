import * as d from '@declarations';
import { addImports } from './transform-utils';
import ts from 'typescript';


export function registerStyle(transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile, cmps: d.ComponentCompilerMeta[]) {
  if (cmps.length === 0) {
    return tsSourceFile;
  }

  tsSourceFile = addImports(transformCtx, tsSourceFile,
    [REGISTER_STYLE_METHOD],
    '@stencil/core/app',
  );

  const registerStyleCalls = cmps.map(cmp => {
    const registerStyleMethodArgs: any = [
      ts.createStringLiteral(`STYLE_ID_PLACEHOLDER:${cmp.tagName}`),
      ts.createStringLiteral(`STYLE_TEXT_PLACEHOLDER:${cmp.tagName}`)
    ];

    const registerStyleMethod = ts.createCall(
      ts.createIdentifier(REGISTER_STYLE_METHOD),
      undefined,
      registerStyleMethodArgs
    );

    return ts.createExpressionStatement(registerStyleMethod);
  });

  return ts.updateSourceFileNode(tsSourceFile, [
    ...tsSourceFile.statements,
    ...registerStyleCalls
  ]);
}


const REGISTER_STYLE_METHOD = `registerStyle`;
