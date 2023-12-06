import type * as d from '../../declarations';
/**
 * Validate a series of {@link d.CopyTask}s
 * @param copy the copy tasks to validate, or a boolean to specify if copy tasks are enabled
 * @param defaultCopy default copy tasks to add to the returned validated list if not present in the first argument
 * @returns the validated copy tasks
 */
export declare const validateCopy: (copy: d.CopyTask[] | boolean | null | undefined, defaultCopy?: d.CopyTask[]) => d.CopyTask[];
