import { EventMeta, EventOptions } from '../../../declarations';
import { getDeclarationParameters, isDecoratorNamed, isPropertyWithDecorators } from './utils';
import * as ts from 'typescript';
import { getAttributeTypeInfo, serializeSymbol } from './utils';

export function getEventDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile): EventMeta[] {
  sourceFile;
  return classNode.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member: ts.PropertyDeclaration) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Event'));
      if (elementDecorator == null) {
        return membersMeta;
      }

      const [ eventOptions ] = getDeclarationParameters<EventOptions>(elementDecorator);
      const metadata = convertOptionsToMeta(eventOptions, member.name.getText());

      if (member.type) {
        const genericType = gatherEventEmitterGeneric(member.type);
        if (genericType) {
          if (ts.isTypeReferenceNode(genericType)) {
            metadata.eventType = getAttributeTypeInfo(genericType, sourceFile);
          } else {
            metadata.eventType = {
              text: genericType.getText()
            };
          }
        }
      }

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
