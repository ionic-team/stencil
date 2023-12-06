import { augmentDiagnosticWithNode, buildError, flatOne } from '@utils';
import ts from 'typescript';
import { convertValueToLiteral, createStaticGetter, retrieveTsDecorators } from '../transform-utils';
import { getDecoratorParameters, isDecoratorNamed } from './decorator-utils';
export const listenDecoratorsToStatic = (diagnostics, typeChecker, decoratedMembers, newMembers) => {
    const listeners = decoratedMembers
        .filter(ts.isMethodDeclaration)
        .map((method) => parseListenDecorators(diagnostics, typeChecker, method));
    const flatListeners = flatOne(listeners);
    if (flatListeners.length > 0) {
        newMembers.push(createStaticGetter('listeners', convertValueToLiteral(flatListeners)));
    }
};
const parseListenDecorators = (diagnostics, typeChecker, method) => {
    var _a;
    const listenDecorators = ((_a = retrieveTsDecorators(method)) !== null && _a !== void 0 ? _a : []).filter(isDecoratorNamed('Listen'));
    if (listenDecorators.length === 0) {
        return [];
    }
    return listenDecorators.map((listenDecorator) => {
        const methodName = method.name.getText();
        const [listenText, listenOptions] = getDecoratorParameters(listenDecorator, typeChecker);
        const eventNames = listenText.split(',');
        if (eventNames.length > 1) {
            const err = buildError(diagnostics);
            err.messageText = 'Please use multiple @Listen() decorators instead of comma-separated names.';
            augmentDiagnosticWithNode(err, listenDecorator);
        }
        const listener = parseListener(eventNames[0], listenOptions, methodName);
        if (listener.target === 'parent') {
            const err = buildError(diagnostics);
            err.messageText =
                'The "parent" target is no longer available as of Stencil 2. Please use "window", "document" or "body" instead.';
            augmentDiagnosticWithNode(err, listenDecorator);
        }
        return listener;
    });
};
export const parseListener = (eventName, opts = {}, methodName) => {
    const rawEventName = eventName.trim();
    const listener = {
        name: rawEventName,
        method: methodName,
        target: opts.target,
        capture: typeof opts.capture === 'boolean' ? opts.capture : false,
        passive: typeof opts.passive === 'boolean'
            ? opts.passive
            : // if the event name is known to be a passive event then set it to true
                PASSIVE_TRUE_DEFAULTS.has(rawEventName.toLowerCase()),
    };
    return listener;
};
const PASSIVE_TRUE_DEFAULTS = new Set([
    'dragstart',
    'drag',
    'dragend',
    'dragenter',
    'dragover',
    'dragleave',
    'drop',
    'mouseenter',
    'mouseover',
    'mousemove',
    'mousedown',
    'mouseup',
    'mouseleave',
    'mouseout',
    'mousewheel',
    'pointerover',
    'pointerenter',
    'pointerdown',
    'pointermove',
    'pointerup',
    'pointercancel',
    'pointerout',
    'pointerleave',
    'resize',
    'scroll',
    'touchstart',
    'touchmove',
    'touchend',
    'touchenter',
    'touchleave',
    'touchcancel',
    'wheel',
]);
//# sourceMappingURL=listen-decorator.js.map