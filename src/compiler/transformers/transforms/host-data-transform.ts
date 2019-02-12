import ts from 'typescript';

export function transformHostData(classElements: ts.ClassElement[]) {
  const hasHostData = !!classElements.find(e => ts.isMethodDeclaration(e) && e.name.getText() === 'hostData');
  if (hasHostData) {
    const renderIndex = classElements.findIndex(e => ts.isMethodDeclaration(e) && e.name.getText() === 'render');
    if (renderIndex >= 0) {
      const renderMethod = classElements[renderIndex] as ts.MethodDeclaration;
      classElements[renderIndex] = ts.updateMethod(
        renderMethod,
        renderMethod.decorators,
        renderMethod.modifiers,
        renderMethod.asteriskToken,
        ts.createIdentifier(INTERNAL_RENDER),
        renderMethod.questionToken,
        renderMethod.typeParameters,
        renderMethod.parameters,
        renderMethod.type,
        renderMethod.body
      );
    }
    classElements.push(syntheticRender(renderIndex >= 0));
  }
}

function syntheticRender(hasRender: boolean) {
  const hArguments = [
    ts.createLiteral('host'),
    ts.createCall(
      ts.createPropertyAccess(ts.createThis(), 'hostData'),
      undefined,
      undefined
    )
  ];
  if (hasRender) {
    hArguments.push(
      ts.createCall(
        ts.createPropertyAccess(ts.createThis(), INTERNAL_RENDER),
        undefined,
        undefined
      )
    );
  }
  return ts.createMethod(
    undefined,
    undefined,
    undefined,
    'render',
    undefined,
    undefined,
    undefined,
    undefined,
    ts.createBlock([
      ts.createReturn(
        ts.createCall(
          ts.createIdentifier('__stencil_h'),
          undefined,
          hArguments
        )
      )
    ])
  );
}

const INTERNAL_RENDER = '__internalRender_';
