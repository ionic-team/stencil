import ts from 'typescript';
import * as d from '@declarations';
import { GET_CONNECT, GET_CONTEXT } from './exports';

export function addLegacyProps(cmp: d.ComponentCompilerMeta) {
  return [
    ...(cmp.legacyConnect || []).map(c => getStatement(c.name, GET_CONNECT, c.connect)),
    ...(cmp.legacyContext || []).map(c => getStatement(c.name, GET_CONTEXT, c.context))
  ];
}

function getStatement(propName: string, method: string, arg: string) {
  return ts.createExpressionStatement(
    ts.createAssignment(
      ts.createPropertyAccess(
        ts.createThis(),
        propName
      ),
      ts.createCall(
        ts.createIdentifier(method),
        undefined,
        [
          ts.createThis(),
          ts.createLiteral(arg)
        ]
      )
    )
  );
}
