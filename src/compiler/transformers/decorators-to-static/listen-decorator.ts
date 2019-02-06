import * as d from '@declarations';
import { convertValueToLiteral, createStaticGetter, getDeclarationParameters, isDecoratorNamed } from '../transform-utils';
import ts from 'typescript';
import { buildError, buildWarn } from '@utils';


export function listenDecoratorsToStatic(diagnostics: d.Diagnostic[], decoratedMembers: ts.ClassElement[], newMembers: ts.ClassElement[]) {
  const listeners = decoratedMembers
    .filter(ts.isMethodDeclaration)
    .flatMap(method => parseListenDecorator(diagnostics, method))
    .filter(listener => !!listener);

  if (listeners.length > 0) {
    newMembers.push(createStaticGetter('listeners', convertValueToLiteral(listeners)));
  }
}


function parseListenDecorator(diagnostics: d.Diagnostic[], method: ts.MethodDeclaration) {
  const listenDecorator = method.decorators.find(isDecoratorNamed('Listen'));
  if (listenDecorator == null) {
    return [];
  }

  const [ listenText, listenOptions ] = getDeclarationParameters<string, d.ListenOptions>(listenDecorator);

  const eventNames = listenText.split(',');
  if (eventNames.length > 1) {
    const warn = buildWarn(diagnostics);
    warn.messageText = 'Deprecated @Listen() feature. Use multiple @Listen() decorators instead of comma-separated names.';
  }

  return eventNames.map(eventName => validateListener(diagnostics, eventName.trim(), listenOptions, method.name.getText()));
}


export function validateListener(diagnostics: d.Diagnostic[], eventName: string, opts: d.ListenOptions = {}, methodName: string): d.ComponentCompilerListener {
  let rawEventName = eventName;
  let target = opts.target;

  // DEPRECATED: handle old syntax (`TARGET:event`)
  if (!target) {
    const splt = eventName.split(':');
    const prefix = splt[0].toLowerCase().trim();
    if (splt.length > 1 && isValidTargetValue(prefix)) {
      rawEventName = splt[1].trim();
      target = prefix;
      const warn = buildWarn(diagnostics);
      warn.messageText = `Deprecated @Listen() feature. Use @Listen('${rawEventName}', { target: '${prefix}' }) instead.`;
    }
  }

  // DEPRECATED: handle keycode syntax (`event:KEY`)
  const [finalEvent, keycode, rest] = rawEventName.split('.');
  if (rest === undefined && isValidKeycodeSuffix(keycode)) {
    rawEventName = finalEvent;
    const warn = buildError(diagnostics);
    warn.messageText = `Deprecated @Listen() feature. Using key is not longer supported, use "event.key" instead.`;
  }

  return {
    name: rawEventName,
    method: methodName,
    target,
    capture: (typeof opts.capture === 'boolean') ? opts.capture : false,
    passive: (typeof opts.passive === 'boolean') ? opts.passive :
      // if the event name is kown to be a passive event then set it to true
      (PASSIVE_TRUE_DEFAULTS.indexOf(rawEventName.toLowerCase()) > -1),
    disabled: (opts.enabled === false)
  };
}

export function isValidTargetValue(prefix: string): prefix is d.ListenTargetOptions  {
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
  'parent', 'body', 'document', 'window'
];

const VALID_KEYCODE_SUFFIX = [
  'enter', 'escape', 'space', 'tab', 'up', 'right', 'down', 'left'
];
