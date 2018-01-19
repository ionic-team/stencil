import { Config, ComponentMeta } from '../../../util/interfaces';
import { getDeclarationParameters, isDecoratorNamed, isMethodWithDecorators } from './utils';
import * as ts from 'typescript';


export function getWatchDecoratorMeta(config: Config, classNode: ts.ClassDeclaration, cmpMeta: ComponentMeta) {
  const methods = classNode.members.filter(isMethodWithDecorators);

  getChangeMetaByName(config, methods, cmpMeta, 'Watch');
  getChangeMetaByName(config, methods, cmpMeta, 'PropWillChange');
  getChangeMetaByName(config, methods, cmpMeta, 'PropDidChange');
}

function getChangeMetaByName(config: Config, methods: ts.ClassElement[], cmpMeta: ComponentMeta, decoratorName: string) {
  methods.forEach(({decorators, name}) => {
    decorators
      .filter(isDecoratorNamed(decoratorName))
      .forEach(propChangeDecorator => {
        const [propName] = getDeclarationParameters<string>(propChangeDecorator);
        if (propName) {
          updateWatchCallback(config, cmpMeta, propName, name, decoratorName);
        }
      });
  });
}

function updateWatchCallback(config: Config, cmpMeta: ComponentMeta, propName: string, decoratorData: ts.PropertyName, decoratorName: string) {
  cmpMeta.membersMeta = cmpMeta.membersMeta || {};
  cmpMeta.membersMeta[propName] = cmpMeta.membersMeta[propName] || {};

  cmpMeta.membersMeta[propName].watchCallbacks = cmpMeta.membersMeta[propName].watchCallbacks || [];
  cmpMeta.membersMeta[propName].watchCallbacks.push(decoratorData.getText());

  if (decoratorName === 'PropWillChange' || decoratorName === 'PropDidChange') {
    config.logger.warn(`@${decoratorName}('${propName}') decorator within "${cmpMeta.tagNameMeta}" component has been deprecated. Please update to @Watch('${propName}').`);
  }
}
