import { ComponentOptions, ListenMeta, ListenOptions } from '../../../util/interfaces';
import { MEMBER_TYPE } from '../../../util/constants';
import { getDeclarationParameters } from './utils';
import ts from 'typescript';
import { isCallExpression } from 'babel-types';

export function getListenDecoratorMeta(node: ts.ClassDeclaration): ListenMeta[] {
  return node.members
    .filter(member => {
      return (ts.isMethodDeclaration(member) && Array.isArray(member.decorators));
    })
    .reduce((listenMetaList, member) => {
      const elementDecorator = member.decorators.find(dec => {
        return (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === 'Listen');
      });

      const [ eventName, listenOptions ] = getDeclarationParameters(elementDecorator);

      return eventName.split(',').reduce((lml, eventName) => {
        if (eventName) {
          lml.push(validateListener(eventName.trim(), <ListenOptions>listenOptions, member.name.getText()));
        }
      }, listenMetaList);
    }, [] as ListenMeta[]);
}


export function validateListener(eventName: string, rawListenOpts: ListenOptions, methodName: string): ListenMeta | null {
  let rawEventName = eventName;

  let splt = eventName.split(':');

  if (splt.length > 2) {
    throw `@Listen can only contain one colon: ${eventName}`;
  }

  if (splt.length > 1) {
    let prefix = splt[0].toLowerCase().trim();
    if (!isValidElementRefPrefix(prefix)) {
      throw `invalid @Listen prefix "${prefix}" for "${eventName}"`;
    }
    rawEventName = splt[1].toLowerCase().trim();
  }

  splt = rawEventName.split('.');
  if (splt.length > 2) {
    throw `@Listen can only contain one period: ${eventName}`;
  }
  if (splt.length > 1) {
    let suffix = splt[1].toLowerCase().trim();
    if (!isValidKeycodeSuffix(suffix)) {
      throw `invalid @Listen suffix "${suffix}" for "${eventName}"`;
    }
    rawEventName = splt[0].toLowerCase().trim();
  }

  const listenMeta: ListenMeta = {
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
