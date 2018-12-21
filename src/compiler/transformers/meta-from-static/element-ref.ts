import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticElementRef(staticMembers: ts.ClassElement[]) {
  const parsedElementRef = getStaticValue(staticMembers, 'elementRef');

  if (typeof parsedElementRef === 'string') {
    return parsedElementRef;
  }

  return null;
}
