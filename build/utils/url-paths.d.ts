/**
 * Determines whether a string should be considered a remote url or not.
 *
 * This helper only checks the provided string to evaluate is one of a few pre-defined schemes, and should not be
 * considered all-encompassing
 *
 * @param p the string to evaluate
 * @returns `true` if the provided string is a remote url, `false` otherwise
 */
export declare const isRemoteUrl: (p: string) => boolean;
