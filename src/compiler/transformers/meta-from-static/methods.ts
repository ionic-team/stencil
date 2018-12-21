import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticMethods(staticMembers: ts.ClassElement[], cmpMeta: d.ComponentCompilerMeta) {
  const parsedMethods = getStaticValue(staticMembers, 'methods');
  if (!parsedMethods) {
    return;
  }

  const methodNames = Object.keys(parsedMethods);
  if (methodNames.length === 0) {
    return;
  }

  methodNames.forEach(methodName => {
    const p: d.ComponentCompilerMethod = {
      name: methodName
    };

    cmpMeta.methods.push(p);
  });
}
