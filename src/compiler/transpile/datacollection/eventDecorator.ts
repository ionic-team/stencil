import { ComponentOptions, EventMeta, EventOptions } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import { getDeclarationParameters } from './utils';
import ts from 'typescript';
import { isCallExpression } from 'babel-types';

export function getEventDecoratorMeta(node: ts.ClassDeclaration): EventMeta[] {
  return node.members
    .filter(member => {
      return (ts.isPropertyDeclaration(member) && Array.isArray(member.decorators));
    })
    .reduce((membersMeta, member) => {
      const elementDecorator = member.decorators.find(dec => {
        return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === 'Event');
      });

      const [ eventOptions ] = getDeclarationParameters(elementDecorator);

      if (eventOptions) {
        membersMeta.push(convertOptionsToMeta(<EventOptions>eventOptions, member.name.getText()));
      }

      return membersMeta;
    }, [] as EventMeta[]);
}

function convertOptionsToMeta(rawEventOpts: EventOptions, methodName: string): EventMeta | null {

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
