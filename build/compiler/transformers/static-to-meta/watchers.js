import { getStaticValue } from '../transform-utils';
export const parseStaticWatchers = (staticMembers) => {
    const parsedWatchers = getStaticValue(staticMembers, 'watchers');
    if (!parsedWatchers || parsedWatchers.length === 0) {
        return [];
    }
    return parsedWatchers.map((parsedWatch) => {
        return {
            propName: parsedWatch.propName,
            methodName: parsedWatch.methodName,
        };
    });
};
//# sourceMappingURL=watchers.js.map