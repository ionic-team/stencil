import * as d from '../../../declarations';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, removeDecorator } from '../transform-utils';
import ts from 'typescript';


export function componentDecoratorToStatic(cmpNode: ts.ClassDeclaration, newMembers: ts.ClassElement[], componentDecorator: ts.Decorator) {
  removeDecorator(cmpNode, 'Component');

  const [ componentOptions ] = getDeclarationParameters<d.ComponentOptions>(componentDecorator);
  if (!componentOptions) {
    return;
  }

  if (typeof componentOptions.tag !== 'string') {
    return;
  }

  newMembers.push(createStaticGetter('is', convertValueToLiteral(componentOptions.tag)));

  if (componentOptions.shadow) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('shadow')));

  } else if (componentOptions.scoped) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('scoped')));
  }

  if (componentOptions.styleUrl) {
    newMembers.push(createStaticGetter('styleUrl', convertValueToLiteral(componentOptions.styleUrl)));

  } else if (componentOptions.styleUrls) {
    newMembers.push(createStaticGetter('styleUrls', convertValueToLiteral(componentOptions.styleUrls)));

  } else if (componentOptions.styles) {
    newMembers.push(createStaticGetter('styles', convertValueToLiteral(componentOptions.styles)));
  }
}

