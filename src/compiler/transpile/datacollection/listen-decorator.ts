import * as d from '../../../declarations';
import { getDeclarationParameters, isDecoratorNamed, isMethodWithDecorators, serializeSymbol } from './utils';
import * as ts from 'typescript';


export function getListenDecoratorMeta(checker: ts.TypeChecker, classNode: ts.ClassDeclaration) {
  const listeners: d.ListenMeta[] = [];

  classNode.members
    .filter(isMethodWithDecorators)
    .forEach(member => {
      member.decorators
        .filter(isDecoratorNamed('Listen'))
        .map(dec => getDeclarationParameters<string, d.ListenOptions>(dec))
        .forEach(([listenText, listenOptions]) => {
          listenText.split(',').forEach(eventName => {
            const symbol = checker.getSymbolAtLocation(member.name);
            const jsdoc = serializeSymbol(checker, symbol);

            listeners.push({
              ...validateListener(eventName.trim(), listenOptions, member.name.getText()),
              jsdoc
            });
          });
        });
    });

  return listeners;
}


export function validateListener(eventName: string, rawListenOpts: d.ListenOptions = {}, methodName: string): d.ListenMeta | null {
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

  const listenMeta: d.ListenMeta = {
    eventName: eventName,
    eventMethodName: methodName
  };


  listenMeta.eventCapture = (typeof rawListenOpts.capture === 'boolean') ? rawListenOpts.capture : false;

  listenMeta.eventPassive = (typeof rawListenOpts.passive === 'boolean') ? rawListenOpts.passive :
    // if the event name is kown to be a passive event then set it to true
    (PASSIVE_TRUE_DEFAULTS.indexOf(rawEventName.toLowerCase()) > -1);

  // default to enabled=true if it wasn't provided
  listenMeta.eventDisabled = (rawListenOpts.enabled === false);

  return listenMeta;
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
