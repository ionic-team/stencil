import { FileMeta, ListenMeta } from '../interfaces';
import * as ts from 'typescript';


export function getListenDecoratorMeta(fileMeta: FileMeta, classNode: ts.ClassDeclaration) {
  fileMeta.cmpMeta.listenersMeta = [];

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isListen = false;
    let methodName: string = null;
    let eventName: string = null;
    let rawListenMeta: ListenMeta = {};

    memberNode.forEachChild(n => {

      if (n.kind === ts.SyntaxKind.Decorator && n.getChildCount() > 1 && n.getChildAt(1).getFirstToken().getText() === 'Listen') {
        isListen = true;

        n.getChildAt(1).forEachChild(n => {

          if (n.kind === ts.SyntaxKind.StringLiteral && !eventName) {
            eventName = n.getText().replace(/\s/g, '');
            eventName = eventName.replace(/\'/g, '');
            eventName = eventName.replace(/\"/g, '');
            eventName = eventName.replace(/\`/g, '');

          } else if (n.kind === ts.SyntaxKind.ObjectLiteralExpression && eventName) {
            try {
              const fnStr = `return ${n.getText()};`;

              Object.assign(rawListenMeta, new Function(fnStr)());

            } catch (e) {
              console.log(`parse listener options: ${e}`);
            }
          }
        });

      } else if (isListen) {
        if (n.kind === ts.SyntaxKind.Identifier && !methodName) {
          methodName = n.getText().trim();
        }
      }

    });


    if (isListen && eventName && methodName) {
      eventName.split(',').forEach(evName => {
        validateListener(fileMeta, evName, rawListenMeta, methodName, memberNode);
      });
    }
  });

  fileMeta.cmpMeta.listenersMeta = fileMeta.cmpMeta.listenersMeta.sort((a, b) => {
    if (a.eventName < b.eventName) return -1;
    if (a.eventName > b.eventName) return 1;
    if (a.methodName < b.methodName) return -1;
    if (a.methodName > b.methodName) return 1;
    return 0;
  });
}


function validateListener(fileMeta: FileMeta, eventName: string, rawListenMeta: ListenMeta, methodName: string, memberNode: ts.ClassElement) {
  eventName = eventName.trim();
  if (!eventName) return;

  let rawEventName = eventName;

  let splt = eventName.split(':');
  if (splt.length > 2) {
    throw `@Listen can only contain one colon: ${eventName} in ${fileMeta.filePath}`;
  }
  if (splt.length > 1) {
    if (VALID_ELEMENT_REF_PREFIXES.indexOf(splt[0]) === -1) {
      throw `invalid @Listen prefix "${splt[0]}" for "${eventName}" in ${fileMeta.filePath}`;
    }
    rawEventName = splt[1];
  }

  splt = rawEventName.split('.');
  if (splt.length > 2) {
    throw `@Listen can only contain one period: ${eventName} in ${fileMeta.filePath}`;
  }
  if (splt.length > 1) {
    if (VALID_KEYCODE_SUFFIX.indexOf(splt[1]) === -1) {
      throw `invalid @Listen suffix "${splt[1]}" for "${eventName}" in ${fileMeta.filePath}`;
    }
    rawEventName = splt[0];
  }

  const listener: ListenMeta = Object.assign({}, rawListenMeta);

  listener.eventName = eventName;
  listener.methodName = methodName;

  if (listener.capture === undefined) {
    // default to not use capture if it wasn't provided
    listener.capture = false;
  }
  listener.capture = !!listener.capture;

  if (listener.passive === undefined) {
    // they didn't set if it should be passive or not
    // so let's figure out some good defaults depending
    // on what type of event this is

    if (PASSIVE_TRUE_DEFAULTS.indexOf(rawEventName.toLowerCase()) > -1) {
      // good list of known events that we should default to passive
      listener.passive = true;

    } else {
      // play it safe and have all others default to NOT be passive
      listener.passive = false;
    }
  }
  listener.passive = !!listener.passive;

  if (listener.enabled === undefined) {
    // default to enabled if it wasn't provided
    listener.enabled = true;
  }
  listener.enabled = !!listener.enabled;

  fileMeta.cmpMeta.listenersMeta.push(listener);

  // gathered valid meta data
  // remove decorator entirely
  memberNode.decorators = undefined;
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
  'enter', 'escape', 'space', 'tab'
];
