import ts from 'typescript';

import { getDeclarationParameters } from '../decorators-to-static/decorator-utils';

describe('decorator utils', () => {
  describe('getDeclarationParameters', () => {
    it('should return an empty array for decorator with no arguments', () => {
      const decorator: ts.Decorator = {
        expression: ts.factory.createIdentifier('DecoratorName'),
      } as unknown as ts.Decorator;

      const typeCheckerMock = {} as ts.TypeChecker;
      const result = getDeclarationParameters(decorator, typeCheckerMock);

      expect(result).toEqual([]);
    });

    it('should return correct parameters for decorator with multiple string arguments', () => {
      const decorator: ts.Decorator = {
        expression: ts.factory.createCallExpression(ts.factory.createIdentifier('DecoratorName'), undefined, [
          ts.factory.createStringLiteral('arg1'),
          ts.factory.createStringLiteral('arg2'),
        ]),
      } as unknown as ts.Decorator;

      const typeCheckerMock = {} as ts.TypeChecker;
      const result = getDeclarationParameters(decorator, typeCheckerMock);

      expect(result).toEqual(['arg1', 'arg2']);
    });

    it('should return enum value for enum member used in decorator', () => {
      const typeCheckerMock = {
        getTypeAtLocation: jest.fn(() => ({
          value: 'arg1',
          isLiteral: () => true,
        })),
      } as unknown as ts.TypeChecker;

      const decorator: ts.Decorator = {
        expression: ts.factory.createCallExpression(ts.factory.createIdentifier('DecoratorName'), undefined, [
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier('EnumName'),
            ts.factory.createIdentifier('EnumMemberName'),
          ),
        ]),
      } as unknown as ts.Decorator;

      const result = getDeclarationParameters(decorator, typeCheckerMock);

      expect(result).toEqual(['arg1']);
    });
  });
});
