import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export const parseStaticEncapsulation = (staticMembers: ts.ClassElement[]) => {
  let encapsulation: string = getStaticValue(staticMembers, 'encapsulation');

  if (typeof encapsulation === 'string') {
    encapsulation = encapsulation.toLowerCase().trim();
    if (encapsulation === 'shadow' || encapsulation === 'scoped') {
      return encapsulation;
    }
  }

  return 'none';
};


export const parseStaticShadowDelegatesFocus = (encapsulation: string, staticMembers: ts.ClassElement[]) => {
  if (encapsulation === 'shadow') {
    const delegatesFocus: boolean = getStaticValue(staticMembers, 'delegatesFocus');
    return !!delegatesFocus;
  }
  return null;
};
