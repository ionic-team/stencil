import { ComponentMeta } from '../../../util/interfaces';
import { getDeclarationParameters, isDecoratorNamed, isMethodWithDecorators } from './utils';
import * as ts from 'typescript';


export function getChangeDecoratorMeta(classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
  const methods = classNode.members.filter(isMethodWithDecorators);

  getChangeMetaByName(methods, cmpMeta, 'PropWillChange');
  getChangeMetaByName(methods, cmpMeta, 'PropDidChange');
}

function getChangeMetaByName(methods: ts.ClassElement[], cmpMeta: ComponentMeta, decoratorName: string) {
  methods.forEach(({decorators, name}) => {
    decorators
      .filter(isDecoratorNamed(decoratorName))
      .forEach(propChangeDecorator => {
        const [propName] = getDeclarationParameters<string>(propChangeDecorator);
        if (propName) {
          cmpMeta.membersMeta = cmpMeta.membersMeta || {};
          cmpMeta.membersMeta[propName] = cmpMeta.membersMeta[propName] || {};

          if (decoratorName === 'PropWillChange') {
            updateWillChange(cmpMeta, propName, name);
          }

          if (decoratorName === 'PropDidChange') {
            updateDidChange(cmpMeta, propName, name);
          }
        }
      });
  });
}

function updateWillChange(cmpMeta: ComponentMeta, propName: string, decoratorData: ts.PropertyName) {
  cmpMeta.membersMeta[propName].willChangeMethodNames = cmpMeta.membersMeta[propName].willChangeMethodNames || [];
  cmpMeta.membersMeta[propName].willChangeMethodNames.push(decoratorData.getText());
}

function updateDidChange(cmpMeta: ComponentMeta, propName: string, decoratorData: ts.PropertyName) {
  cmpMeta.membersMeta[propName].didChangeMethodNames = cmpMeta.membersMeta[propName].didChangeMethodNames || [];
  cmpMeta.membersMeta[propName].didChangeMethodNames.push(decoratorData.getText());
}
