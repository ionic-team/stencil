import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, isDecoratorNamed, removeDecorator } from '../transform-utils';
import ts from 'typescript';


export function listenDecoratorsToStatic(diagnostics: d.Diagnostic[], _sourceFile: ts.SourceFile, decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, newMembers: ts.ClassElement[]) {
  const listeners: ts.ArrayLiteralExpression[] = [];

  decoratedProps.forEach((prop: ts.PropertyDeclaration) => {
    listenDecoratorToStatic(diagnostics, typeChecker, listeners, prop);
  });

  if (listeners.length > 0) {
    newMembers.push(createStaticGetter('listeners', ts.createArrayLiteral(listeners, true)));
  }
}


function listenDecoratorToStatic(_diagnostics: d.Diagnostic[], _typeChecker: ts.TypeChecker, listeners: any[], prop: ts.PropertyDeclaration) {
  const listenDecorator = prop.decorators && prop.decorators.find(isDecoratorNamed('Listen'));

  if (listenDecorator == null) {
    return;
  }

  removeDecorator(prop, 'Listen');

  const [ listenText, listenOptions ] = getDeclarationParameters<string, d.ListenOptions>(listenDecorator);

  listenText.split(',').forEach(eventName => {
    listeners.push(
      validateListener(eventName.trim(), listenOptions, prop.name.getText())
    );
  });
}


export function validateListener(eventName: string, opts: d.ListenOptions = {}, methodName: string) {
  let rawEventName = eventName;

  let splt = eventName.split(':');

  if (splt.length > 2) {
    throw new Error(`@Listen can only contain one colon: ${eventName}`);
  }

  if (splt.length > 1) {
    const prefix = splt[0].toLowerCase().trim();
    if (!isValidElementRefPrefix(prefix)) {
      throw new Error(`invalid @Listen prefix "${prefix}" for "${eventName}"`);
    }
    rawEventName = splt[1].toLowerCase().trim();
  }

  splt = rawEventName.split('.');
  if (splt.length > 2) {
    throw new Error(`@Listen can only contain one period: ${eventName}`);
  }
  if (splt.length > 1) {
    const suffix = splt[1].toLowerCase().trim();
    if (!isValidKeycodeSuffix(suffix)) {
      throw new Error(`invalid @Listen suffix "${suffix}" for "${eventName}"`);
    }
    rawEventName = splt[0].toLowerCase().trim();
  }

  const listenerMeta: d.ComponentCompilerListener = {
    name: eventName,
    method: methodName,
    capture: (typeof opts.capture === 'boolean') ? opts.capture : false,
    passive: (typeof opts.passive === 'boolean') ? opts.passive :
      // if the event name is kown to be a passive event then set it to true
      (PASSIVE_TRUE_DEFAULTS.indexOf(rawEventName.toLowerCase()) > -1),
    disabled: (opts.enabled === false)
  };

  return convertValueToLiteral(listenerMeta);
}

export function isValidElementRefPrefix(prefix: string) {
  return (VALID_ELEMENT_REF_PREFIXES.indexOf(prefix) > -1);
}

export function isValidKeycodeSuffix(prefix: string) {
  return (VALID_KEYCODE_SUFFIX.indexOf(prefix) > -1);
}

const PASSIVE_TRUE_DEFAULTS = [
  'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
  'mouseenter', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'mouseleave', 'mouseout', 'mousewheel',
  'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave',
  'resize',
  'scroll',
  'touchstart', 'touchmove', 'touchend', 'touchenter', 'touchleave', 'touchcancel',
  'wheel',
];

const VALID_ELEMENT_REF_PREFIXES = [
  'child', 'parent', 'body', 'document', 'window'
];

const VALID_KEYCODE_SUFFIX = [
  'enter', 'escape', 'space', 'tab', 'up', 'right', 'down', 'left'
];
