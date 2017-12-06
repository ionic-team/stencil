import { EventMeta, EventOptions } from '../../../util/interfaces';
import { getDeclarationParameters, isPropertyWithDecorators, isDecoratorNamed } from './utils';
import * as ts from 'typescript';
import { serializeSymbol } from './utils';

export function getEventDecoratorMeta(checker: ts.TypeChecker, node: ts.ClassDeclaration): EventMeta[] {
  return node.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Event'));
      if (elementDecorator == null) {
        return membersMeta;
      }

      const [ eventOptions ] = getDeclarationParameters<EventOptions>(elementDecorator);
      const metadata: EventMeta = convertOptionsToMeta(eventOptions, member.name.getText());

      if (metadata) {
        const symbol = checker.getSymbolAtLocation(member.name);
        metadata.jsdoc = serializeSymbol(checker, symbol);

        membersMeta.push(metadata);
      }

      return membersMeta;
    }, [] as EventMeta[]);
}

function convertOptionsToMeta(rawEventOpts: EventOptions = {}, methodName: string): EventMeta | null {

  if (!methodName) {
    return null;
  }

  const eventMeta: EventMeta = {
    eventMethodName: methodName,
    eventName: methodName
  };

  if (typeof rawEventOpts.eventName === 'string') {
    eventMeta.eventName = rawEventOpts.eventName;
  }

  eventMeta.eventBubbles = typeof rawEventOpts.bubbles === 'boolean' ? rawEventOpts.bubbles : true;
  eventMeta.eventCancelable = typeof rawEventOpts.cancelable === 'boolean' ? rawEventOpts.cancelable : true;
  eventMeta.eventComposed = typeof rawEventOpts.composed === 'boolean' ? rawEventOpts.composed : true;

  return eventMeta;
}
