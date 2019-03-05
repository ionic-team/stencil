import * as d from '../../../declarations';
import { getDeclarationParameters, isDecoratorNamed, isMethodWithDecorators, serializeSymbol } from './utils';
import ts from 'typescript';
import { buildWarn, normalizePath } from '../../util';


export function getListenDecoratorMeta(config: d.Config, diagnostics: d.Diagnostic[], checker: ts.TypeChecker, classNode: ts.ClassDeclaration, sourceFile: ts.SourceFile) {
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
              ...validateListener(config, diagnostics, sourceFile, eventName.trim(), listenOptions, member.name.getText()),
              jsdoc
            });
          });
        });
    });

  return listeners;
}


export function validateListener(config: d.Config, diagnostics: d.Diagnostic[], sourceFile: ts.SourceFile, eventName: string, rawListenOpts: d.ListenOptions = {}, methodName: string): d.ListenMeta | null {
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
    const warn = buildWarn(diagnostics);
    warn.header = `@Listen('eventName.KEY') is deprecated`;
    warn.messageText = `Future versions of Stencil will REMOVE the possibility of listening to specific keys, since the Web platform already provides a built-in alternative using "event.key". Check out the docs are https://www.w3.org/TR/uievents-key/#named-key-attribute-values`;
    warn.absFilePath = normalizePath(sourceFile.fileName);
    warn.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, sourceFile.fileName));

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

  if (rawListenOpts.eventName !== undefined) {
    const warn = buildWarn(diagnostics);
    warn.header = '@Listen(event, {eventName}) is deprecated';
    warn.messageText = `Future versions of Stencil will the "eventName" option of the @Listen() decorator`;
    warn.absFilePath = normalizePath(sourceFile.fileName);
    warn.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, sourceFile.fileName));
  }
  if (rawListenOpts.enabled !== undefined) {
    const warn = buildWarn(diagnostics);
    warn.header = '@Listen(event, {enabled}) is deprecated';
    warn.messageText = `Future versions of Stencil will REMOVE the possibility of disabling events created with the @Listen() decorator.`;
    warn.absFilePath = normalizePath(sourceFile.fileName);
    warn.relFilePath = normalizePath(config.sys.path.relative(config.rootDir, sourceFile.fileName));
  }
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
