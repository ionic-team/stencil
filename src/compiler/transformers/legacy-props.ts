import ts from 'typescript';

import type * as d from '../../declarations';
import { addCoreRuntimeApi, GET_CONNECT, GET_CONTEXT, RUNTIME_APIS } from './core-runtime-apis';

export const addLegacyProps = (moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  if (cmp.legacyConnect.length > 0) {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.getConnect);
  }

  if (cmp.legacyContext.length > 0) {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.getContext);
  }

  return [
    ...cmp.legacyConnect.map((c) => getStatement(c.name, GET_CONNECT, c.connect)),
    ...cmp.legacyContext.map((c) => getStatement(c.name, GET_CONTEXT, c.context)),
  ];
};

const getStatement = (propName: string, method: string, arg: string) => {
  return ts.factory.createExpressionStatement(
    ts.factory.createAssignment(
      ts.factory.createPropertyAccessExpression(ts.factory.createThis(), propName),
      ts.factory.createCallExpression(ts.factory.createIdentifier(method), undefined, [
        ts.factory.createThis(),
        ts.factory.createStringLiteral(arg),
      ])
    )
  );
};
