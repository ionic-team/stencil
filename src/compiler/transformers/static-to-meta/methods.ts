import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticMethods(staticMembers: ts.ClassElement[]): d.ComponentCompilerMethod[] {
  const parsedMethods = getStaticValue(staticMembers, 'methods');
  if (!parsedMethods) {
    return [];
  }

  const methodNames = Object.keys(parsedMethods);
  if (methodNames.length === 0) {
    return [];
  }

  return methodNames.map(methodName => {
    return {
      name: methodName
    };
  });
}
