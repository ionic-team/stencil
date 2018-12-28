import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticEncapsulation(staticMembers: ts.ClassElement[]) {
  let encapsulation: string = getStaticValue(staticMembers, 'encapsulation');

  if (typeof encapsulation === 'string') {
    encapsulation = encapsulation.toLowerCase().trim();
    if (encapsulation === 'shadow' || encapsulation === 'scoped') {
      return encapsulation;
    }
  }

  return 'none';
}
