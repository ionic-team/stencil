import { augmentDiagnosticWithNode, buildError, validateComponentTag } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { getDeclarationParameters } from './decorator-utils';
import { styleToStatic } from './style-to-static';

export const componentDecoratorToStatic = (
  config: d.Config,
  typeChecker: ts.TypeChecker,
  diagnostics: d.Diagnostic[],
  cmpNode: ts.ClassDeclaration,
  newMembers: ts.ClassElement[],
  componentDecorator: ts.Decorator
) => {
  const [componentOptions] = getDeclarationParameters<d.ComponentOptions>(componentDecorator);
  if (!componentOptions) {
    return;
  }

  if (!validateComponent(config, diagnostics, typeChecker, componentOptions, cmpNode, componentDecorator)) {
    return;
  }

  newMembers.push(createStaticGetter('is', convertValueToLiteral(componentOptions.tag.trim())));

  if (componentOptions.shadow) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('shadow')));

    if (typeof componentOptions.shadow !== 'boolean') {
      if (componentOptions.shadow.delegatesFocus === true) {
        newMembers.push(createStaticGetter('delegatesFocus', convertValueToLiteral(true)));
      }
    }
  } else if (componentOptions.scoped) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('scoped')));
  }

  styleToStatic(newMembers, componentOptions);

  const assetsDirs = componentOptions.assetsDirs || [];

  if (assetsDirs.length > 0) {
    newMembers.push(createStaticGetter('assetsDirs', convertValueToLiteral(assetsDirs)));
  }
};

const validateComponent = (
  config: d.Config,
  diagnostics: d.Diagnostic[],
  typeChecker: ts.TypeChecker,
  componentOptions: d.ComponentOptions,
  cmpNode: ts.ClassDeclaration,
  componentDecorator: ts.Node
) => {
  const extendNode =
    cmpNode.heritageClauses && cmpNode.heritageClauses.find((c) => c.token === ts.SyntaxKind.ExtendsKeyword);
  if (extendNode) {
    const err = buildError(diagnostics);
    err.messageText = `Classes decorated with @Component can not extend from a base class.
    Stencil needs to be able to switch between different base classes in order to implement the different output targets such as: lazy and raw web components.`;
    augmentDiagnosticWithNode(err, extendNode);
    return false;
  }

  if (componentOptions.shadow && componentOptions.scoped) {
    const err = buildError(diagnostics);
    err.messageText = `Components cannot be "scoped" and "shadow" at the same time, they are mutually exclusive configurations.`;
    augmentDiagnosticWithNode(err, findTagNode('scoped', componentDecorator));
    return false;
  }

  const constructor = cmpNode.members.find(ts.isConstructorDeclaration);
  if (constructor && constructor.parameters.length > 0) {
    const err = buildError(diagnostics);
    err.messageText = `Classes decorated with @Component can not have a "constructor" that takes arguments.
    All data required by a component must be passed by using class properties decorated with @Prop()`;
    augmentDiagnosticWithNode(err, constructor.parameters[0]);
    return false;
  }

  // check if class has more than one decorator
  const otherDecorator = retrieveTsDecorators(cmpNode)?.find((d) => d !== componentDecorator);
  if (otherDecorator) {
    const err = buildError(diagnostics);
    err.messageText = `Classes decorated with @Component can not be decorated with more decorators.
    Stencil performs extensive static analysis on top of your components in order to generate the necessary metadata, runtime decorators at the components level make this task very hard.`;
    augmentDiagnosticWithNode(err, otherDecorator);
    return false;
  }

  const tag = componentOptions.tag;
  if (typeof tag !== 'string' || tag.trim().length === 0) {
    const err = buildError(diagnostics);
    err.messageText = `tag missing in component decorator`;
    augmentDiagnosticWithNode(err, componentDecorator);
    return false;
  }

  const tagError = validateComponentTag(tag);
  if (tagError) {
    const err = buildError(diagnostics);
    err.messageText = `${tagError}. Please refer to https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name for more info.`;
    augmentDiagnosticWithNode(err, findTagNode('tag', componentDecorator));
    return false;
  }

  if (!config._isTesting) {
    const nonTypeExports = typeChecker
      .getExportsOfModule(typeChecker.getSymbolAtLocation(cmpNode.getSourceFile()))
      .filter((symbol) => (symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) === 0)
      .filter((symbol) => symbol.name !== cmpNode.name.text);

    nonTypeExports.forEach((symbol) => {
      const err = buildError(diagnostics);
      err.messageText = `To allow efficient bundling, modules using @Component() can only have a single export which is the component class itself.
      Any other exports should be moved to a separate file.
      For further information check out: https://stenciljs.com/docs/module-bundling`;
      const errorNode = symbol.valueDeclaration ? symbol.valueDeclaration : symbol.declarations[0];

      augmentDiagnosticWithNode(err, errorNode);
    });
    if (nonTypeExports.length > 0) {
      return false;
    }
  }
  return true;
};

const findTagNode = (propName: string, node: ts.Node) => {
  if (ts.isDecorator(node) && ts.isCallExpression(node.expression)) {
    const arg = node.expression.arguments[0];
    if (ts.isObjectLiteralExpression(arg)) {
      arg.properties.forEach((p) => {
        if (ts.isPropertyAssignment(p)) {
          if (p.name.getText() === propName) {
            node = p.initializer;
          }
        }
      });
    }
  }
  return node;
};
