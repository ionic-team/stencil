import * as d from '@declarations';
import { EVENT_FLAGS } from '@utils';
import ts from 'typescript';
import { CREATE_EVENT } from './exports';


export function addCreateEvents(cmp: d.ComponentCompilerMeta) {
  return cmp.events.map(ev => {
    return ts.createStatement(ts.createAssignment(
      ts.createPropertyAccess(
        ts.createThis(),
        ts.createIdentifier(ev.method)
      ),
      ts.createCall(
        ts.createIdentifier(CREATE_EVENT),
        undefined,
        [
          ts.createThis(),
          ts.createLiteral(ev.name),
          ts.createLiteral(computeFlags(ev))
        ]
      )
    ));
  });
}


function computeFlags(eventMeta: d.ComponentCompilerEvent) {
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
}
