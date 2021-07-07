import type * as d from '../../declarations';
import { CREATE_EVENT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import { EVENT_FLAGS } from '@utils';
import ts from 'typescript';

export const addCreateEvents = (moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => {
  return cmp.events.map(ev => {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.createEvent);

    return ts.createStatement(
      ts.createAssignment(
        ts.createPropertyAccess(ts.createThis(), ts.createIdentifier(ev.method)),
        ts.createCall(ts.createIdentifier(CREATE_EVENT), undefined, [
          ts.createThis(),
          ts.createLiteral(ev.name),
          ts.createLiteral(computeFlags(ev)),
        ]),
      ),
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
