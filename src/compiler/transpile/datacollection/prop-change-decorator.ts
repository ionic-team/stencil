import { ComponentMeta, PropChangeMeta } from '../../../util/interfaces';
import { PROP_CHANGE } from '../../../util/constants';
import { getDeclarationParameters, isDecoratorNamed, isMethodWithDecorators } from './utils';
import * as ts from 'typescript';


export function getPropChangeDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration): ComponentMeta {
  checker;
  const methods = classNode.members.filter(isMethodWithDecorators);
  return {
    propsWillChangeMeta: getPropChangeMetaByName(methods, 'PropWillChange'),
    propsDidChangeMeta: getPropChangeMetaByName(methods, 'PropDidChange')
  };
}

function getPropChangeMetaByName(methods: ts.ClassElement[], decoratorName: string): PropChangeMeta[] {
  const changeMeta: PropChangeMeta[] = [];
  methods.forEach(({decorators, name}) => {
    decorators
      .filter(isDecoratorNamed(decoratorName))
      .forEach(propChangeDecorator => {
        const [watchedName] = getDeclarationParameters<string>(propChangeDecorator);
        if (watchedName) {
          changeMeta.push({
            [PROP_CHANGE.PropName]: watchedName,
            [PROP_CHANGE.MethodName]: name.getText(),
          });
        }
      });
  });

  if (changeMeta.length === 0) {
    return undefined;
  }
  return changeMeta;
}
