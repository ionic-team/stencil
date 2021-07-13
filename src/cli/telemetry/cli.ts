import envPaths from 'env-paths';
import { Logger } from 'src/declarations';

import { isFatal } from './errors';

export const ENV_PATHS = envPaths('capacitor', { suffix: '' });

export type CommanderAction = (...args: any[]) => void | Promise<void>;

export function wrapAction(action: CommanderAction, logger: Logger): CommanderAction {
	return async (...args: any[]) => {
		try {
			await action(...args);
		} catch (e) {
			if (isFatal(e)) {
				process.exitCode = e.exitCode;
				logger.error(e.message);
			} else {
				throw e;
			}
		}
	};
}