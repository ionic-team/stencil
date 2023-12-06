import { BUILD } from '@app-data';
import { consoleDevWarn, consoleError, getHostRef } from '@platform';
import { parsePropertyValue } from './parse-property-value';
import { scheduleUpdate } from './update-component';
export const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
export const setValue = (ref, propName, newVal, cmpMeta) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const elm = BUILD.lazyLoad ? hostRef.$hostElement$ : ref;
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    // explicitly check for NaN on both sides, as `NaN === NaN` is always false
    const areBothNaN = Number.isNaN(oldVal) && Number.isNaN(newVal);
    const didValueChange = newVal !== oldVal && !areBothNaN;
    if ((!BUILD.lazyLoad || !(flags & 8 /* HOST_FLAGS.isConstructingInstance */) || oldVal === undefined) && didValueChange) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        if (BUILD.isDev) {
            if (hostRef.$flags$ & 1024 /* HOST_FLAGS.devOnRender */) {
                consoleDevWarn(`The state/prop "${propName}" changed during rendering. This can potentially lead to infinite-loops and other bugs.`, '\nElement', elm, '\nNew value', newVal, '\nOld value', oldVal);
            }
            else if (hostRef.$flags$ & 2048 /* HOST_FLAGS.devOnDidLoad */) {
                consoleDevWarn(`The state/prop "${propName}" changed during "componentDidLoad()", this triggers extra re-renders, try to setup on "componentWillLoad()"`, '\nElement', elm, '\nNew value', newVal, '\nOld value', oldVal);
            }
        }
        if (!BUILD.lazyLoad || instance) {
            // get an array of method names of watch functions to call
            if (BUILD.watchCallback && cmpMeta.$watchers$ && flags & 128 /* HOST_FLAGS.isWatchReady */) {
                const watchMethods = cmpMeta.$watchers$[propName];
                if (watchMethods) {
                    // this instance is watching for when this property changed
                    watchMethods.map((watchMethodName) => {
                        try {
                            // fire off each of the watch methods that are watching this property
                            instance[watchMethodName](newVal, oldVal, propName);
                        }
                        catch (e) {
                            consoleError(e, elm);
                        }
                    });
                }
            }
            if (BUILD.updatable &&
                (flags & (2 /* HOST_FLAGS.hasRendered */ | 16 /* HOST_FLAGS.isQueuedForUpdate */)) === 2 /* HOST_FLAGS.hasRendered */) {
                if (BUILD.cmpShouldUpdate && instance.componentShouldUpdate) {
                    if (instance.componentShouldUpdate(newVal, oldVal, propName) === false) {
                        return;
                    }
                }
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(hostRef, false);
            }
        }
    }
};
//# sourceMappingURL=set-value.js.map