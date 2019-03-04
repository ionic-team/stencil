import ts from 'typescript';
import { H, HOST } from '../exports';

export function transformHostData(classElements: ts.ClassElement[]) {
  const hasHostData = classElements.some(e => ts.isMethodDeclaration(e) && (e.name as any).escapedText === 'hostData');
  if (hasHostData) {
    const renderIndex = classElements.findIndex(e => ts.isMethodDeclaration(e) && (e.name as any).escapedText === 'render');
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
    // __stencil_Host
    ts.createIdentifier(HOST),
    // this.hostData()
    ts.createCall(
      ts.createPropertyAccess(ts.createThis(), 'hostData'),
      undefined,
      undefined
    )
  ];
  if (hasRender) {
    hArguments.push(
      // this.render()
      ts.createCall(
        ts.createPropertyAccess(ts.createThis(), INTERNAL_RENDER),
        undefined,
        undefined
      )
    );
  }

  /**
   * render() {
   *   return h(arguments);
   * }
   */
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
          ts.createIdentifier(H),
          undefined,
          hArguments
        )
      )
    ])
  );
}

const INTERNAL_RENDER = '__stencil_render';
