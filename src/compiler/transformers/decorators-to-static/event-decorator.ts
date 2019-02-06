import * as d from '@declarations';
import { buildWarn } from '@utils';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, isDecoratorNamed, serializeSymbol } from '../transform-utils';
import ts from 'typescript';


export function eventDecoratorsToStatic(diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const events = decoratedProps
    .filter(ts.isPropertyDeclaration)
    .map(prop => parseEventDecorator(diagnostics, sourceFile, typeChecker, prop))
    .filter(ev => !!ev);

  if (events.length > 0) {
    newMembers.push(createStaticGetter('events', convertValueToLiteral(events)));
  }
}


function parseEventDecorator(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration): d.ComponentCompilerEvent {
  const eventDecorator = prop.decorators.find(isDecoratorNamed('Event'));

  if (eventDecorator == null) {
    return null;
  }

  const [ opts ] = getDeclarationParameters<d.EventOptions>(eventDecorator);

  const memberName = prop.name.getText();
  if (!memberName) {
    return null;
  }

  const symbol = typeChecker.getSymbolAtLocation(prop.name);
  return {
    method: memberName,
    name: getEventName(diagnostics, opts, memberName),
    bubbles: opts && typeof opts.bubbles === 'boolean' ? opts.bubbles : true,
    cancelable: opts && typeof opts.cancelable === 'boolean' ? opts.cancelable : true,
    composed: opts && typeof opts.composed === 'boolean' ? opts.composed : true,
    docs: serializeSymbol(typeChecker, symbol)
  };
}


export function getEventName(diagnostics: d.Diagnostic[], eventOptions: d.EventOptions, memberName: string) {
  if (eventOptions && typeof eventOptions.eventName === 'string' && eventOptions.eventName.trim().length > 0) {
    // always use the event name if given
    return eventOptions.eventName.trim();
  }

  // event name wasn't provided
  // so let's default to use the member name
  validateEventEmitterMemeberName(diagnostics, memberName);

  return memberName;
}


export function validateEventEmitterMemeberName(diagnostics: d.Diagnostic[], memberName: string) {
  const firstChar = memberName.charAt(0);

  if (/[A-Z]/.test(firstChar)) {
    const diagnostic = buildWarn(diagnostics);
    diagnostic.messageText = [
      `In order to be compatible with all event listeners on elements, the `,
      `@Event() "${memberName}" cannot start with a capital letter. `,
      `Please lowercase the first character for the event to best work with all listeners.`
    ].join('');
  }
}
