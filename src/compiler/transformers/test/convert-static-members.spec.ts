import ts from 'typescript';

import { hasStaticInitializerInClass } from '../decorators-to-static/convert-static-members';

describe('convert-static-members', () => {
  describe('hasStaticInitializerInClass', () => {
    it('returns true for a static property with an initializer', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithStaticMember'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            [ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            ts.factory.createStringLiteral('initial value')
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(true);
    });

    it('returns true for a private static property with an initializer', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithStaticMember'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            [ts.factory.createToken(ts.SyntaxKind.PrivateKeyword), ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            ts.factory.createStringLiteral('initial value')
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(true);
    });

    it('returns true for a decorated (non-Stencil) static property with an initializer', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithStaticMember'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            [
              ts.factory.createDecorator(
                ts.factory.createCallExpression(
                  ts.factory.createIdentifier('SomeDecorator'), // Imaginary decorator
                  undefined,
                  []
                )
              ),
              ts.factory.createToken(ts.SyntaxKind.StaticKeyword),
            ],
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            ts.factory.createStringLiteral('initial value')
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(true);
    });

    it.each(['Prop', 'State'])(
      'returns false for a static property decorated with @%s with an initializer',
      (decoratorName) => {
        const classWithStaticMembers = ts.factory.createClassDeclaration(
          [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
          ts.factory.createIdentifier('ClassWithStaticMember'),
          undefined,
          undefined,
          [
            ts.factory.createPropertyDeclaration(
              [
                ts.factory.createDecorator(
                  ts.factory.createCallExpression(
                    ts.factory.createIdentifier(decoratorName), // Stencil decorator
                    undefined,
                    []
                  )
                ),
                ts.factory.createToken(ts.SyntaxKind.StaticKeyword),
              ],
              ts.factory.createIdentifier('propertyName'),
              undefined,
              undefined,
              ts.factory.createStringLiteral('initial value')
            ),
          ]
        );
        expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(false);
      }
    );

    it('returns true for a static property with an initializer with multiple members', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithStaticAndNonStaticMembers'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            undefined,
            ts.factory.createIdentifier('nonStaticProperty'),
            undefined,
            undefined,
            ts.factory.createStringLiteral('some value')
          ),
          ts.factory.createPropertyDeclaration(
            [ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            ts.factory.createStringLiteral('initial value')
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(true);
    });

    it('returns false for a class without any members', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithNoMembers'),
        undefined,
        undefined,
        [] // no members for this class
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(false);
    });

    it('returns false for a static property without an initializer', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithUninitializedStaticMember'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            [ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            undefined // the initializer is false
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(false);
    });

    it('returns false for a private static property without an initializer', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithUninitializedStaticMember'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            [ts.factory.createToken(ts.SyntaxKind.PrivateKeyword), ts.factory.createToken(ts.SyntaxKind.StaticKeyword)],
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            undefined // the initializer is false
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(false);
    });

    it('returns false for a modified property with an initializer', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithNonStaticMember'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            [ts.factory.createToken(ts.SyntaxKind.PrivateKeyword)], // the property  is declared as private
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            ts.factory.createStringLiteral('initial value')
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(false);
    });

    it('returns false for an unmodified property with an initializer', () => {
      const classWithStaticMembers = ts.factory.createClassDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier('ClassWithUnmodifiedMembers'),
        undefined,
        undefined,
        [
          ts.factory.createPropertyDeclaration(
            undefined, // the property declaration has no modifiers
            ts.factory.createIdentifier('propertyName'),
            undefined,
            undefined,
            ts.factory.createStringLiteral('initial value')
          ),
        ]
      );
      expect(classWithStaticMembers.members.some(hasStaticInitializerInClass)).toBe(false);
    });
  });
});
