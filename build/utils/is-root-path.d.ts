/**
 * Checks if the path is the Operating System (OS) root path, such as "/" or "C:\". This function does not take the OS
 * the code is running on into account when performing this evaluation.
 * @param p the path to check
 * @returns `true` if the path is an OS root path, `false` otherwise
 */
export declare const isRootPath: (p: string) => boolean;
