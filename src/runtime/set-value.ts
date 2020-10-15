import type * as d from '../declarations';
import { BUILD } from '@app-data';
import { consoleDevWarn, consoleError, getHostRef } from '@platform';
import { HOST_FLAGS } from '@utils';
import { parsePropertyValue } from './parse-property-value';
import { scheduleUpdate } from './update-component';

export const getValue = (ref: d.RuntimeRef, propName: string) => getHostRef(ref).$instanceValues$.get(propName);

export const setValue = (ref: d.RuntimeRef, propName: string, newVal: any, cmpMeta: d.ComponentRuntimeMeta) => {
  // check our new property value against our internal value
  const hostRef = getHostRef(ref);
  const elm = BUILD.lazyLoad ? hostRef.$hostElement$ : (ref as d.HostElement);
  const oldVal = hostRef.$instanceValues$.get(propName);
  const flags = hostRef.$flags$;
  const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : (elm as any);
  newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);

  if ((!BUILD.lazyLoad || !(flags & HOST_FLAGS.isConstructingInstance) || oldVal === undefined) && newVal !== oldVal) {
    // gadzooks! the property's value has changed!!
    // set our new value!
    hostRef.$instanceValues$.set(propName, newVal);

    if (BUILD.isDev) {
      if (hostRef.$flags$ & HOST_FLAGS.devOnRender) {
        consoleDevWarn(
          `The state/prop "${propName}" changed during rendering. This can potentially lead to infinite-loops and other bugs.`,
          '\nElement',
          elm,
          '\nNew value',
          newVal,
          '\nOld value',
          oldVal,
        );
      } else if (hostRef.$flags$ & HOST_FLAGS.devOnDidLoad) {
        consoleDevWarn(
          `The state/prop "${propName}" changed during "componentDidLoad()", this triggers extra re-renders, try to setup on "componentWillLoad()"`,
          '\nElement',
          elm,
          '\nNew value',
          newVal,
          '\nOld value',
          oldVal,
        );
      }
    }

    if (!BUILD.lazyLoad || instance) {
      // get an array of method names of watch functions to call
      if (BUILD.watchCallback && cmpMeta.$watchers$ && flags & HOST_FLAGS.isWatchReady) {
        const watchMethods = cmpMeta.$watchers$[propName];

        if (watchMethods) {
          // this instance is watching for when this property changed
          watchMethods.map(watchMethodName => {
            try {
              // fire off each of the watch methods that are watching this property
              instance[watchMethodName](newVal, oldVal, propName);
            } catch (e) {
              consoleError(e, elm);
            }
          });
        }
      }

      if (BUILD.updatable && (flags & (HOST_FLAGS.hasRendered | HOST_FLAGS.isQueuedForUpdate)) === HOST_FLAGS.hasRendered) {
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
