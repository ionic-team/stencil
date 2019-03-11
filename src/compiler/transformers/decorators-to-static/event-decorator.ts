import * as d from '../../../declarations';
import { buildWarn } from '@utils';
import { convertValueToLiteral, createStaticGetter, getAttributeTypeInfo, getDeclarationParameters, isDecoratorNamed, resolveType, serializeSymbol } from '../transform-utils';
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


function parseEventDecorator(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker, prop: ts.PropertyDeclaration): d.ComponentCompilerStaticEvent {
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
    docs: serializeSymbol(typeChecker, symbol),
    complexType: getComplexType(typeChecker, prop)
  };
}

export function getEventName(diagnostics: d.Diagnostic[], eventOptions: d.EventOptions, memberName: string) {
  if (eventOptions && typeof eventOptions.eventName === 'string' && eventOptions.eventName.trim().length > 0) {
    // always use the event name if given
    return eventOptions.eventName.trim();
  }

  // event name wasn't provided
  // so let's default to use the member name
  validateEventEmitterMemberName(diagnostics, memberName);

  return memberName;
}

function getComplexType(typeChecker: ts.TypeChecker, node: ts.PropertyDeclaration): d.ComponentCompilerPropertyComplexType {
  const sourceFile = node.getSourceFile();
  const eventType = node.type ? getEventType(node.type) : null;
  return {
    original: eventType ? eventType.getText() : 'any',
    resolved: eventType ? resolveType(typeChecker, typeChecker.getTypeFromTypeNode(eventType)) : 'any',
    references: eventType ? getAttributeTypeInfo(eventType, sourceFile) : {}
  };
}

function getEventType(type: ts.TypeNode): ts.TypeNode | null {
  if (ts.isTypeReferenceNode(type) &&
    ts.isIdentifier(type.typeName) &&
    type.typeName.text === 'EventEmitter' &&
    type.typeArguments &&
    type.typeArguments.length > 0) {
      return type.typeArguments[0];
  }
  return null;
}

function validateEventEmitterMemberName(diagnostics: d.Diagnostic[], memberName: string) {
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
