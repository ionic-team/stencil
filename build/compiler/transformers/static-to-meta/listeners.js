import { getStaticValue } from '../transform-utils';
export const parseStaticListeners = (staticMembers) => {
    const parsedListeners = getStaticValue(staticMembers, 'listeners');
    if (!parsedListeners || parsedListeners.length === 0) {
        return [];
    }
    return parsedListeners.map((parsedListener) => {
        return {
            name: parsedListener.name,
            method: parsedListener.method,
            capture: !!parsedListener.capture,
            passive: !!parsedListener.passive,
            target: parsedListener.target,
        };
    });
};
//# sourceMappingURL=listeners.js.map