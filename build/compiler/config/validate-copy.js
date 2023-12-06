import { unique } from '@utils';
/**
 * Validate a series of {@link d.CopyTask}s
 * @param copy the copy tasks to validate, or a boolean to specify if copy tasks are enabled
 * @param defaultCopy default copy tasks to add to the returned validated list if not present in the first argument
 * @returns the validated copy tasks
 */
export const validateCopy = (copy, defaultCopy = []) => {
    if (copy === null || copy === false) {
        return [];
    }
    if (!Array.isArray(copy)) {
        copy = [];
    }
    copy = copy.slice();
    for (const task of defaultCopy) {
        if (copy.every((t) => t.src !== task.src)) {
            copy.push(task);
        }
    }
    return unique(copy, (task) => `${task.src}:${task.dest}:${task.keepDirStructure}`);
};
//# sourceMappingURL=validate-copy.js.map