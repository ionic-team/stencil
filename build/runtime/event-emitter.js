import { BUILD } from '@app-data';
import { consoleDevWarn, plt } from '@platform';
import { getElement } from './element';
export const createEvent = (ref, name, flags) => {
    const elm = getElement(ref);
    return {
        emit: (detail) => {
            if (BUILD.isDev && !elm.isConnected) {
                consoleDevWarn(`The "${name}" event was emitted, but the dispatcher node is no longer connected to the dom.`);
            }
            return emitEvent(elm, name, {
                bubbles: !!(flags & 4 /* EVENT_FLAGS.Bubbles */),
                composed: !!(flags & 2 /* EVENT_FLAGS.Composed */),
                cancelable: !!(flags & 1 /* EVENT_FLAGS.Cancellable */),
                detail,
            });
        },
    };
};
/**
 * Helper function to create & dispatch a custom Event on a provided target
 * @param elm the target of the Event
 * @param name the name to give the custom Event
 * @param opts options for configuring a custom Event
 * @returns the custom Event
 */
export const emitEvent = (elm, name, opts) => {
    const ev = plt.ce(name, opts);
    elm.dispatchEvent(ev);
    return ev;
};
//# sourceMappingURL=event-emitter.js.map