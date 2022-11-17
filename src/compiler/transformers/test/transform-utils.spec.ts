import * as ts from 'typescript';

import { isMemberPrivate, mapJSDocTagInfo } from '../transform-utils';

describe('transform utils', () => {
  it('flattens TypeScript JSDocTagInfo to Stencil JSDocTagInfo', () => {
    // tags corresponds to the following JSDoc
    /*
     * @param foo the first parameter
     * @param bar
     * @returns
     * @see {@link https://example.com}
     */
    const tags = [
      {
        name: 'param',
        text: [
          { text: 'foo', kind: 'parameterName' },
          { text: ' ', kind: 'space' },
          { text: 'the first parameter', kind: 'text' },
        ],
      },
      { name: 'param', text: [{ text: 'bar', kind: 'text' }] },
      { name: 'returns', text: undefined },
      {
        name: 'see',
        text: [
          { text: '', kind: 'text' },
          { text: '{@link ', kind: 'link' },
          { text: 'https://example.com', kind: 'linkText' },
          { text: '}', kind: 'link' },
        ],
      },
    ];

    expect(mapJSDocTagInfo(tags)).toEqual([
      { name: 'param', text: 'foo the first parameter' },
      { name: 'param', text: 'bar' },
      { name: 'returns', text: undefined },
      { name: 'see', text: '{@link https://example.com}' },
    ]);
  });

  describe('isMemberPrivate', () => {
    /**
     * Helper method for creating an empty method named 'myMethod' with the provided modifier's.
     *
     * @example
     * // By default, no modifier will be applied, and the following will be returned:
     * createMemberWithModifier(); // myMethod() {}
     *
     * // Otherwise, the provided modifier will be applied to the method:
     * createMemberWithModifier(ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)); // private myMethod() {}
     *
     * @param modifier the modifier to apply to the method. Defaults to applying no modifier if none is provided
     * @returns a new empty method
     */
    const createMemberWithModifier = (modifier: ts.Modifier | undefined = undefined): ts.MethodDeclaration => {
      const modifiers = modifier ? [modifier] : [];
      return ts.factory.createMethodDeclaration(
        undefined,
        modifiers,
        undefined,
        ts.factory.createIdentifier('myMethod'),
        undefined,
        undefined,
        [],
        undefined,
        ts.factory.createBlock([], false)
      );
    };

    it('returns false when the member has no modifiers', () => {
      const methodDeclaration = createMemberWithModifier();

      expect(isMemberPrivate(methodDeclaration)).toBe(false);
    });

    it('returns false when the member has a non-private modifier', () => {
      const methodDeclaration = createMemberWithModifier(ts.factory.createModifier(ts.SyntaxKind.PublicKeyword));

      expect(isMemberPrivate(methodDeclaration)).toBe(false);
    });

    it.each<[string, ts.ModifierSyntaxKind]>([
      ['private', ts.SyntaxKind.PrivateKeyword],
      ['protected', ts.SyntaxKind.ProtectedKeyword],
    ])('returns true when the member has a (%s) modifier', (_name, modifier) => {
      const methodDeclaration = createMemberWithModifier(ts.factory.createModifier(modifier));

      expect(isMemberPrivate(methodDeclaration)).toBe(true);
    });
  });
});
