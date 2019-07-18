import ts from 'typescript';


export const removeStaticMetaProperties = (classNode: ts.ClassDeclaration) => {
  if (classNode.members == null) {
    return [];
  }
  return classNode.members.filter(classMember => {
    if (classMember.modifiers) {
      if (classMember.modifiers.some(m => m.kind === ts.SyntaxKind.StaticKeyword)) {
        const memberName = (classMember.name as any).escapedText;
        if (REMOVE_STATIC_GETTERS.has(memberName)) {
          return false;
        }
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
  'connectProps'
]);
