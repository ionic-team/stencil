import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticListeners(staticMembers: ts.ClassElement[], cmpMeta: d.ComponentCompilerMeta) {
  const parsedListeners: d.ComponentCompilerListener[] = getStaticValue(staticMembers, 'listeners');
  if (!parsedListeners || parsedListeners.length === 0) {
    return;
  }

  parsedListeners.forEach(parsedListener => {
    const p: d.ComponentCompilerListener = {
      name: parsedListener.name,
      method: parsedListener.method,
      capture: !!parsedListener.capture,
      passive: !!parsedListener.passive,
      disabled: !!parsedListener.disabled
    };

    cmpMeta.listeners.push(p);
  });
}
