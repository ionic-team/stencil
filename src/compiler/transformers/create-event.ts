import { EVENT_FLAGS } from '@utils';
import ts from 'typescript';

import type * as d from '../../declarations';
import { addCoreRuntimeApi, CREATE_EVENT, RUNTIME_APIS } from './core-runtime-apis';

export const addCreateEvents = (moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  return cmp.events.map((ev) => {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.createEvent);

    return ts.factory.createExpressionStatement(
      ts.factory.createAssignment(
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier(ev.method)),
        ts.factory.createCallExpression(ts.factory.createIdentifier(CREATE_EVENT), undefined, [
          ts.factory.createThis(),
          ts.factory.createStringLiteral(ev.name),
          ts.factory.createNumericLiteral(computeFlags(ev)),
        ])
      )
    );
  });
};

const computeFlags = (eventMeta: d.ComponentCompilerEvent) => {
  let flags = 0;
  if (eventMeta.bubbles) {
    flags |= EVENT_FLAGS.Bubbles;
  }
  if (eventMeta.composed) {
    flags |= EVENT_FLAGS.Composed;
  }
  if (eventMeta.cancelable) {
    flags |= EVENT_FLAGS.Cancellable;
  }
  return flags;
};
