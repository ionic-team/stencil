import { catchError } from '../../util';
import { Diagnostic, EventMeta, EventOptions, ModuleFile } from '../../../util/interfaces';
import * as ts from 'typescript';


export function getEventDecoratorMeta(moduleFile: ModuleFile, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration) {
  moduleFile.cmpMeta.eventsMeta = [];

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isEvent = false;
    let methodName: string = null;
    let rawEventMeta: EventMeta = {};

    memberNode.forEachChild(n => {

      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Event') {
        isEvent = true;

        n.getChildAt(1).forEachChild(n => {

          if (n.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            try {
              const fnStr = `return ${n.getText()};`;
              Object.assign(rawEventMeta, new Function(fnStr)());

            } catch (e) {
              const d = catchError(diagnostics, e);
              d.messageText = `parse event options: ${e}`;
              d.absFilePath = moduleFile.tsFilePath;
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
      validateEvent(moduleFile, rawEventMeta, methodName, memberNode);
    }
  });
}


function validateEvent(fileMeta: ModuleFile, rawEventOpts: EventOptions, methodName: string, memberNode: ts.ClassElement) {
  methodName = methodName.trim();
  if (!methodName) return;

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

  fileMeta.cmpMeta.eventsMeta.push(eventMeta);

  // gathered valid meta data
  // remove decorator entirely
  memberNode.decorators = undefined;
}
