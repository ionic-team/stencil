import ts from 'typescript';

import { retrieveTsModifiers } from './transform-utils';

export const removeStaticMetaProperties = (classNode: ts.ClassDeclaration): ts.ClassElement[] => {
  if (classNode.members == null) {
    return [];
  }
  return classNode.members.filter((classMember) => {
    if (retrieveTsModifiers(classMember)?.some((m) => m.kind === ts.SyntaxKind.StaticKeyword)) {
      const memberName = (classMember.name as any).escapedText;
      if (REMOVE_STATIC_GETTERS.has(memberName)) {
        return false;
      }
    }
    return true;
  });
};

const REMOVE_STATIC_GETTERS = new Set([
  'is',
  'properties',
  'encapsulation',
  'elementRef',
  'events',
  'listeners',
  'methods',
  'states',
  'originalStyleUrls',
  'styleMode',
  'style',
  'styles',
  'styleUrl',
  'watchers',
  'styleUrls',
  'contextProps',
  'connectProps',
]);
