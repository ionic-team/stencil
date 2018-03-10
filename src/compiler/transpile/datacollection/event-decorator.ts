import { EventMeta, EventOptions } from '../../../declarations';
import { getDeclarationParameters, isDecoratorNamed, isPropertyWithDecorators } from './utils';
import * as ts from 'typescript';
import { serializeSymbol } from './utils';

export function getEventDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration): EventMeta[] {
  return classNode.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Event'));
      if (elementDecorator == null) {
        return membersMeta;
      }

      const [ eventOptions ] = getDeclarationParameters<EventOptions>(elementDecorator);
      const metadata = convertOptionsToMeta(eventOptions, member.name.getText());

      if (metadata) {
        const symbol = checker.getSymbolAtLocation(member.name);
        metadata.jsdoc = serializeSymbol(checker, symbol);

        membersMeta.push(metadata);
      }

      return membersMeta;
    }, [] as EventMeta[]);
}

export function convertOptionsToMeta(rawEventOpts: EventOptions = {}, methodName: string): EventMeta | null {
  if (!methodName) {
    return null;
  }
  return {
    eventMethodName: methodName,
    eventName: typeof rawEventOpts.eventName === 'string' ? rawEventOpts.eventName : methodName,
    eventBubbles: typeof rawEventOpts.bubbles === 'boolean' ? rawEventOpts.bubbles : true,
    eventCancelable: typeof rawEventOpts.cancelable === 'boolean' ? rawEventOpts.cancelable : true,
    eventComposed: typeof rawEventOpts.composed === 'boolean' ? rawEventOpts.composed : true
  };
}
