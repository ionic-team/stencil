import ts from 'typescript';

import { retrieveTsModifiers } from './transform-utils';

/**
 * Creates a new collection of class members that belong to the provided class node and that do not exist in
 * {@link REMOVE_STATIC_GETTERS}
 * @param classNode the class node in the syntax tree to inspect
 * @returns a new collection of class members belonging to the provided class node, less those found in
 * {@link REMOVE_STATIC_GETTERS}
 */
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

/**
 * A list of static getter names that are specific to Stencil to exclude from a class's member list
 */
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
