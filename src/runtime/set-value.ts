import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, writeTask } from '@platform';
import { parsePropertyValue } from './parse-property-value';
import { update } from './update';


export const setValue = (hostRef: d.HostRef, propName: string, newVal: any, cmpMeta: d.ComponentRuntimeMeta, oldVal?: any) => {
  // check our new property value against our internal value
  oldVal = hostRef.instanceValues.get(propName);
  newVal = parsePropertyValue(newVal, cmpMeta.members[propName][1]);

  if (newVal !== oldVal) {
    // gadzooks! the property's value has changed!!

    if (!hostRef.isConstructingInstance || (hostRef.isConstructingInstance && oldVal === undefined)) {
      // set our new value!
      hostRef.instanceValues.set(propName, newVal);

      if (hostRef.instance) {
        // get an array of method names of watch functions to call
        if (BUILD.watchCallback) {
          const watchMethods = hostRef.watchCallbacks.get(propName);

          if (watchMethods) {
            // this instance is watching for when this property changed
            watchMethods.forEach(watchMethodName => {
              try {
                // fire off each of the watch methods that are watching this property
                hostRef.instance[watchMethodName].call(hostRef.instance, newVal, oldVal, propName);
              } catch (e) {
                consoleError(e);
              }
            });
          }
        }

        if (BUILD.updatable && !hostRef.isActiveRender && hostRef.hasRendered && !hostRef.isQueuedForUpdate) {
          // looks like this value actually changed, so we've got work to do!
          // but only if we've already rendered, otherwise just chill out
          // queue that we need to do an update, but don't worry about queuing
          // up millions cuz this function ensures it only runs once
          hostRef.isQueuedForUpdate = true;

          writeTask(() => update(hostRef.elm, hostRef.instance, hostRef, cmpMeta));
        }
      }
    }
  }
};
