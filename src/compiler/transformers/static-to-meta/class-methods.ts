import type * as d from '../../../declarations';
import ts from 'typescript';
import { isMethod } from '../transform-utils';

export const parseClassMethods = (cmpNode: ts.ClassDeclaration, cmpMeta: d.ComponentCompilerMeta) => {
  const classMembers = cmpNode.members;
  if (!classMembers) {
    return;
  }

  const classMethods = classMembers.filter(m => ts.isMethodDeclaration(m) || ts.isPropertyDeclaration(m));
  const hasHostData = classMethods.some(m => isMethod(m, 'hostData'));

  const ctrs = classMembers.find(m => ts.isConstructorDeclaration(m)) as ts.ConstructorDeclaration;
  const assignments = ctrs?.body?.statements?.filter(st => (
    ts.isExpressionStatement(st) &&
    ts.isBinaryExpression(st.expression) &&
    st.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
    ts.isPropertyAccessExpression(st.expression.left) &&
    st.expression.left.expression.kind === ts.SyntaxKind.ThisKeyword &&
    ts.isIdentifier(st.expression.left.name)
  ))
  .map(st => (st as any).expression.left.name.escapedText) ?? [];

  const hasMethodOrProp = (prop: string) => {
    return assignments.includes(prop) || classMethods.some(m => isMethod(m, prop))
  };
  cmpMeta.hasAttributeChangedCallbackFn = hasMethodOrProp('attributeChangedCallback');
  cmpMeta.hasConnectedCallbackFn = hasMethodOrProp('connectedCallback');
  cmpMeta.hasDisconnectedCallbackFn = hasMethodOrProp('disconnectedCallback');
  cmpMeta.hasComponentWillLoadFn = hasMethodOrProp('componentWillLoad');
  cmpMeta.hasComponentWillUpdateFn = hasMethodOrProp('componentWillUpdate');
  cmpMeta.hasComponentWillRenderFn = hasMethodOrProp('componentWillRender');
  cmpMeta.hasComponentDidRenderFn = hasMethodOrProp('componentDidRender');
  cmpMeta.hasComponentDidLoadFn = hasMethodOrProp('componentDidLoad');
  cmpMeta.hasComponentShouldUpdateFn = hasMethodOrProp('componentShouldUpdate');
  cmpMeta.hasComponentDidUpdateFn = hasMethodOrProp('componentDidUpdate');
  cmpMeta.hasComponentDidUnloadFn = hasMethodOrProp('componentDidUnload');

  cmpMeta.hasLifecycle = cmpMeta.hasComponentWillLoadFn || cmpMeta.hasComponentDidLoadFn || cmpMeta.hasComponentWillUpdateFn || cmpMeta.hasComponentDidUpdateFn;
  cmpMeta.hasRenderFn = hasMethodOrProp('render') || hasHostData;
  cmpMeta.hasVdomRender = cmpMeta.hasVdomRender || hasHostData;
};
