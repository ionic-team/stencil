import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, removeDecorator } from '../transform-utils';
import ts from 'typescript';


export function componentDecoratorToStatic(cmpNode: ts.ClassDeclaration, newMembers: ts.ClassElement[], componentDecorator: ts.Decorator) {
  removeDecorator(cmpNode, 'Component');

  const [ componentOptions ] = getDeclarationParameters<d.ComponentOptions>(componentDecorator);
  if (!componentOptions) {
    return;
  }

  if (typeof componentOptions.tag !== 'string' || componentOptions.tag.trim().length === 0) {
    return;
  }

  newMembers.push(createStaticGetter('is', convertValueToLiteral(componentOptions.tag.trim())));

  if (componentOptions.shadow) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('shadow')));

  } else if (componentOptions.scoped) {
    newMembers.push(createStaticGetter('encapsulation', convertValueToLiteral('scoped')));
  }

  if (typeof componentOptions.styleUrl === 'string' && componentOptions.styleUrl.length > 0) {
    newMembers.push(createStaticGetter('styleUrl', convertValueToLiteral(componentOptions.styleUrl)));
  }

  if (componentOptions.styleUrls) {
    newMembers.push(createStaticGetter('styleUrls', convertValueToLiteral(componentOptions.styleUrls)));
  }

  if (typeof componentOptions.styles === 'string') {
    const styles = componentOptions.styles.trim();
    if (styles.length > 0) {
      newMembers.push(createStaticGetter('styles', convertValueToLiteral(styles)));
    }
  }
}

