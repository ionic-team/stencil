import * as d from '../../../declarations';
import { getDeclarationParameters, isDecoratorNamed, isPropertyWithDecorators } from './utils';
import * as ts from 'typescript';
import { getAttributeTypeInfo, serializeSymbol } from './utils';


export function getEventDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile) {
  sourceFile;
  return classNode.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member: ts.PropertyDeclaration) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Event'));
      if (elementDecorator == null) {
        return membersMeta;
      }

      const [ eventOptions ] = getDeclarationParameters<d.EventOptions>(elementDecorator);
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

        metadata.jsdoc.name = metadata.eventName;

        membersMeta.push(metadata);
      }

      return membersMeta;
    }, [] as d.EventMeta[]);
}


export function convertOptionsToMeta(rawEventOpts: d.EventOptions = {}, methodName: string): d.EventMeta | null {
  if (!methodName) {
    return null;
  }
  return {
    eventMethodName: methodName,
    eventName: getEventName(rawEventOpts, methodName),
    eventBubbles: typeof rawEventOpts.bubbles === 'boolean' ? rawEventOpts.bubbles : true,
    eventCancelable: typeof rawEventOpts.cancelable === 'boolean' ? rawEventOpts.cancelable : true,
    eventComposed: typeof rawEventOpts.composed === 'boolean' ? rawEventOpts.composed : true
  };
}


export function getEventName(rawEventOpts: d.EventOptions, methodName: string) {
  if (typeof rawEventOpts.eventName === 'string' && rawEventOpts.eventName.trim().length > 0) {
    // always use the event name if given
    return rawEventOpts.eventName.trim();
  }

  // event name wasn't provided
  // so let's default it to be an all lowercased
  // version of the method name
  return methodName.toLowerCase().trim();
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
