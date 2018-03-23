import * as d from '../../../declarations';
import { getDeclarationParameters, isDecoratorNamed, isPropertyWithDecorators } from './utils';
import * as ts from 'typescript';
import { getAttributeTypeInfo, serializeSymbol } from './utils';


export function getEventDecoratorMeta(config: d.Config, checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile) {
  sourceFile;
  return classNode.members
    .filter(isPropertyWithDecorators)
    .reduce((membersMeta, member: ts.PropertyDeclaration) => {
      const elementDecorator = member.decorators.find(isDecoratorNamed('Event'));
      if (elementDecorator == null) {
        return membersMeta;
      }

      const [ eventOptions ] = getDeclarationParameters<d.EventOptions>(elementDecorator);
      const metadata = convertOptionsToMeta(config, eventOptions, member.name.getText());

      if (member.type) {
        const genericType = gatherEventEmitterGeneric(member.type);
        if (genericType) {
          metadata.eventType = {
            text: genericType.getText()
          };
          if (ts.isTypeReferenceNode(genericType)) {
            metadata.eventType.typeReferences = getAttributeTypeInfo(member, sourceFile);
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


export function convertOptionsToMeta(config: d.Config, rawEventOpts: d.EventOptions = {}, memberName: string) {
  if (!memberName) {
    return null;
  }
  return {
    eventMethodName: memberName,
    eventName: getEventName(config, rawEventOpts, memberName),
    eventBubbles: typeof rawEventOpts.bubbles === 'boolean' ? rawEventOpts.bubbles : true,
    eventCancelable: typeof rawEventOpts.cancelable === 'boolean' ? rawEventOpts.cancelable : true,
    eventComposed: typeof rawEventOpts.composed === 'boolean' ? rawEventOpts.composed : true
  } as d.EventMeta;
}


export function getEventName(config: d.Config, rawEventOpts: d.EventOptions, memberName: string) {
  if (typeof rawEventOpts.eventName === 'string' && rawEventOpts.eventName.trim().length > 0) {
    // always use the event name if given
    return rawEventOpts.eventName.trim();
  }

  // event name wasn't provided
  // so let's default to use the member name
  validateEventEmitterMemeberName(config, memberName);

  return memberName;
}


export function validateEventEmitterMemeberName(config: d.Config, memberName: string) {
  const firstChar = memberName.charAt(0);

  if (/[A-Z]/.test(firstChar)) {
    config.logger.warn([
      `In order to be compatible with all event listeners on elements, the `,
      `@Event() "${memberName}" cannot start with a capital letter. `,
      `Please lowercase the first character for the event to best work with all listeners.`
    ].join(''));
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
