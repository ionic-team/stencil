import * as d from '../../../declarations';
import { buildWarn } from '../../util';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, isDecoratorNamed, removeDecorator } from '../transform-utils';
import ts from 'typescript';


export function eventDecoratorsToStatic(diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, cmpNode: ts.ClassDeclaration, typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const decoratedProps = cmpNode.members.filter(member => Array.isArray(member.decorators) && member.decorators.length > 0);

  if (decoratedProps.length === 0) {
    return;
  }

  const events = decoratedProps.map((prop: ts.PropertyDeclaration) => {
    return eventDecoratorToStatic(diagnostics, sourceFile, typeChecker, prop);
  }).filter(event => !!event);

  if (events.length > 0) {
    newMembers.push(createStaticGetter('events', ts.createArrayLiteral(events, true)));
  }
}


function eventDecoratorToStatic(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, _typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration) {
  const eventDecorator = prop.decorators.find(isDecoratorNamed('Event'));

  if (eventDecorator == null) {
    return null;
  }

  removeDecorator(prop, 'Event');

  const [ opts ] = getDeclarationParameters<d.EventOptions>(eventDecorator);

  const memberName = (prop.name as ts.Identifier).text;
  if (!memberName) {
    return null;
  }

  const eventMeta: d.ComponentCompilerEvent = {
    method: memberName,
    name: getEventName(diagnostics, opts, memberName),
    bubbles: opts && typeof opts.bubbles === 'boolean' ? opts.bubbles : true,
    cancelable: opts && typeof opts.cancelable === 'boolean' ? opts.cancelable : true,
    composed: opts && typeof opts.composed === 'boolean' ? opts.composed : true
  };
  return convertValueToLiteral(eventMeta);
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


function gatherEventEmitterGeneric(type: ts.TypeNode): ts.TypeNode | null {
  if (ts.isTypeReferenceNode(type) &&
    ts.isIdentifier(type.typeName) &&
    type.typeName.text === 'EventEmitter' &&
    type.typeArguments &&
    type.typeArguments.length > 0) {
      const eeGen = type.typeArguments[0];
      return eeGen as ts.TypeNode;
  }
  return null;
}
