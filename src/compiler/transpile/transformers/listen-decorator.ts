import { catchError } from '../../util';
import { Diagnostic, ListenMeta, ListenOptions, ModuleFile } from '../../../util/interfaces';
import * as ts from 'typescript';


export function getListenDecoratorMeta(moduleFile: ModuleFile, diagnostics: Diagnostic[], classNode: ts.ClassDeclaration) {
  moduleFile.cmpMeta.listenersMeta = [];

  const decoratedMembers = classNode.members.filter(n => n.decorators && n.decorators.length);

  decoratedMembers.forEach(memberNode => {
    let isListen = false;
    let methodName: string = null;
    let eventName: string = null;
    let rawListenOpts: ListenOptions = {};

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
              Object.assign(rawListenOpts, new Function(fnStr)());

            } catch (e) {
              const d = catchError(diagnostics, e);
              d.messageText = `parse listener options: ${e}`;
              d.absFilePath = moduleFile.tsFilePath;
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
        validateListener(moduleFile, evName, rawListenOpts, methodName, memberNode);
      });
    }
  });

  moduleFile.cmpMeta.listenersMeta = moduleFile.cmpMeta.listenersMeta.sort((a, b) => {
    if (a.eventName.toLowerCase() < b.eventName.toLowerCase()) return -1;
    if (a.eventName.toLowerCase() > b.eventName.toLowerCase()) return 1;
    if (a.eventMethodName.toLowerCase() < b.eventMethodName.toLowerCase()) return -1;
    if (a.eventMethodName.toLowerCase() > b.eventMethodName.toLowerCase()) return 1;
    return 0;
  });
}


function validateListener(fileMeta: ModuleFile, eventName: string, rawListenOpts: ListenOptions, methodName: string, memberNode: ts.ClassElement) {
  eventName = eventName.trim();
  if (!eventName) return;

  let rawEventName = eventName;

  let splt = eventName.split(':');
  if (splt.length > 2) {
    throw `@Listen can only contain one colon: ${eventName} in ${fileMeta.tsFilePath}`;
  }
  if (splt.length > 1) {
    if (VALID_ELEMENT_REF_PREFIXES.indexOf(splt[0]) === -1) {
      throw `invalid @Listen prefix "${splt[0]}" for "${eventName}" in ${fileMeta.tsFilePath}`;
    }
    rawEventName = splt[1];
  }

  splt = rawEventName.split('.');
  if (splt.length > 2) {
    throw `@Listen can only contain one period: ${eventName} in ${fileMeta.tsFilePath}`;
  }
  if (splt.length > 1) {
    if (VALID_KEYCODE_SUFFIX.indexOf(splt[1]) === -1) {
      throw `invalid @Listen suffix "${splt[1]}" for "${eventName}" in ${fileMeta.tsFilePath}`;
    }
    rawEventName = splt[0];
  }

  const listenMeta: ListenMeta = {
    eventName: eventName,
    eventMethodName: methodName
  };

  if (rawListenOpts.capture === undefined) {
    // default to not use capture if it wasn't provided
    listenMeta.eventCapture = false;
  }
  listenMeta.eventCapture = !!listenMeta.eventCapture;

  if (rawListenOpts.passive === undefined) {
    // they didn't set if it should be passive or not
    // so let's figure out some good defaults depending
    // on what type of event this is

    if (PASSIVE_TRUE_DEFAULTS.indexOf(rawEventName.toLowerCase()) > -1) {
      // good list of known events that we should default to passive
      listenMeta.eventPassive = true;

    } else {
      // play it safe and have all others default to NOT be passive
      listenMeta.eventPassive = false;
    }
  }
  listenMeta.eventPassive = !!listenMeta.eventPassive;

  // default to enabled=true if it wasn't provided
  listenMeta.eventDisabled = (rawListenOpts.enabled === false);

  fileMeta.cmpMeta.listenersMeta.push(listenMeta);

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
