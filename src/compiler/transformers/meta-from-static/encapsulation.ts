import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticEncapsulation(staticMembers: ts.ClassElement[]) {
  const encapsulation: string = getStaticValue(staticMembers, 'encapsulation');

  if (encapsulation === 'shadow' || encapsulation === 'scoped') {
    return encapsulation;
  }

  return null;
}
