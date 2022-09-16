/**
 * Decorators on class declarations that we remove as part of the compilation
 * process
 */
export const CLASS_DECORATORS_TO_REMOVE = ['Component'] as const;

/**
 * Decorators on class members that we remove as part of the compilation
 * process
 */
export const MEMBER_DECORATORS_TO_REMOVE = [
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'PropDidChange',
  'PropWillChange',
  'State',
  'Watch',
] as const;
