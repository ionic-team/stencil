import { catchError } from '../../util';
import { Diagnostic, EventMeta, EventOptions } from '../../../util/interfaces';
import * as ts from 'typescript';


export function getEventDecoratorMeta(tsFilePath: string, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration): EventMeta[] {
  let eventsMeta: EventMeta[] = [];
  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isEvent = false;
    let methodName: string = null;
    let rawEventMeta: EventMeta = {};

    memberNode.forEachChild(n => {
      if (n.kind === ts.SyntaxKind.Decorator &&
          n.getChildCount() > 1 &&
          n.getChildAt(1).getFirstToken() &&
          n.getChildAt(1).getFirstToken().getText() === 'Event') {
        isEvent = true;

        n.getChildAt(1).forEachChild(n => {

          if (n.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            try {
              const fnStr = `return ${n.getText()};`;
              Object.assign(rawEventMeta, new Function(fnStr)());

            } catch (e) {
              const d = catchError(diagnostics, e);
              d.messageText = `parse event options: ${e}`;
              d.absFilePath = tsFilePath;
            }
          }
        });

      } else if (isEvent) {
        if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
          methodName = n.getText().trim();
        }
      }
    });


    if (isEvent && methodName) {
      let eventMeta = validateEvent(rawEventMeta, methodName, memberNode);
      if (eventsMeta) {
        memberNode.decorators = undefined;
        eventsMeta.push(eventMeta);
      }
    }
  });

  return eventsMeta;
}


function validateEvent(rawEventOpts: EventOptions, methodName: string, memberNode: ts.ClassElement): EventMeta | null {

  methodName = methodName.trim();
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
