import { convertValueToLiteral, createStaticGetter } from './transform-utils';
/**
 * Add a getter to a class for a static representation of the watchers
 * registered on the Stencil component.
 *
 * *Note*: this will conditionally mutate the `classMembers` param, adding a
 * new element.
 *
 * @param classMembers a list of class members
 * @param cmp metadata about the stencil component of interest
 */
export const addWatchers = (classMembers, cmp) => {
    if (cmp.watchers.length > 0) {
        const watcherObj = {};
        cmp.watchers.forEach(({ propName, methodName }) => {
            watcherObj[propName] = watcherObj[propName] || [];
            watcherObj[propName].push(methodName);
        });
        classMembers.push(createStaticGetter('watchers', convertValueToLiteral(watcherObj)));
    }
};
//# sourceMappingURL=watcher-meta-transform.js.map