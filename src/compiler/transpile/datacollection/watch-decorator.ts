import * as d from '../../../declarations';
import { buildWarn } from '../../util';
import { getDeclarationParameters, isDecoratorNamed, isMethodWithDecorators } from './utils';
import * as ts from 'typescript';


export function getWatchDecoratorMeta(diagnostics: d.Diagnostic[], classNode: ts.ClassDeclaration, cmpMeta: d.ComponentMeta) {
  const methods = classNode.members.filter(isMethodWithDecorators);

  getChangeMetaByName(diagnostics, methods, cmpMeta, 'Watch');
  getChangeMetaByName(diagnostics, methods, cmpMeta, 'PropWillChange');
  getChangeMetaByName(diagnostics, methods, cmpMeta, 'PropDidChange');
}


function getChangeMetaByName(diagnostics: d.Diagnostic[], methods: ts.ClassElement[], cmpMeta: d.ComponentMeta, decoratorName: string) {
  methods.forEach(({decorators, name}) => {
    decorators
      .filter(isDecoratorNamed(decoratorName))
      .forEach(propChangeDecorator => {
        const [propName] = getDeclarationParameters<string>(propChangeDecorator);
        if (propName) {
          updateWatchCallback(diagnostics, cmpMeta, propName, name, decoratorName);
        }
      });
  });
}


function updateWatchCallback(diagnostics: d.Diagnostic[], cmpMeta: d.ComponentMeta, propName: string, decoratorData: ts.PropertyName, decoratorName: string) {
  cmpMeta.membersMeta = cmpMeta.membersMeta || {};
  cmpMeta.membersMeta[propName] = cmpMeta.membersMeta[propName] || {};

  cmpMeta.membersMeta[propName].watchCallbacks = cmpMeta.membersMeta[propName].watchCallbacks || [];
  cmpMeta.membersMeta[propName].watchCallbacks.push(decoratorData.getText());

  if (decoratorName === 'PropWillChange' || decoratorName === 'PropDidChange') {
    const diagnostic = buildWarn(diagnostics);
    diagnostic.messageText = `@${decoratorName}('${propName}') decorator within "${cmpMeta.tagNameMeta}" component has been deprecated. Please update to @Watch('${propName}').`;
  }
}
