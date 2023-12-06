import type { Logger } from '../../declarations';
export declare function checkVersion(logger: Logger, currentVersion: string): Promise<() => void>;
