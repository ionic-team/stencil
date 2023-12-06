import type { Logger } from '@stencil/core/declarations';
import { TerminalLoggerSys } from './terminal-logger';
/**
 * Create a logger to run in a Node environment
 *
 * @returns the created logger
 */
export declare const createNodeLogger: () => Logger;
/**
 * Create a logger sys object for use in a Node.js environment
 *
 * The `TerminalLoggerSys` interface basically abstracts away some
 * environment-specific details so that the terminal logger can deal with
 * things in a (potentially) platform-agnostic way.
 *
 * @returns a configured logger sys object
 */
export declare function createNodeLoggerSys(): TerminalLoggerSys;
