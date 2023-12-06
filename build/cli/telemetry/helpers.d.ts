import type * as d from '../../declarations';
import { ConfigFlags } from '../config-flags';
export declare const tryFn: <T extends (...args: any[]) => Promise<R>, R>(fn: T, ...args: any[]) => Promise<R>;
export declare const isInteractive: (sys: d.CompilerSystem, flags: ConfigFlags, object?: d.TerminalInfo) => boolean;
export declare const UUID_REGEX: RegExp;
export declare function uuidv4(): string;
/**
 * Reads and parses a JSON file from the given `path`
 * @param sys The system where the command is invoked
 * @param path the path on the file system to read and parse
 * @returns the parsed JSON
 */
export declare function readJson(sys: d.CompilerSystem, path: string): Promise<any>;
/**
 * Does the command have the debug flag?
 * @param flags The configuration flags passed into the Stencil command
 * @returns true if --debug has been passed, otherwise false
 */
export declare function hasDebug(flags: ConfigFlags): boolean;
/**
 * Does the command have the verbose and debug flags?
 * @param flags The configuration flags passed into the Stencil command
 * @returns true if both --debug and --verbose have been passed, otherwise false
 */
export declare function hasVerbose(flags: ConfigFlags): boolean;
