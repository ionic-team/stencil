import { shouldIgnoreError } from '@utils';

import { Logger } from '../../compiler/sys/logger';

export function setupNodeProcess(c: { process: any; logger: Logger }) {
  c.process.on(`unhandledRejection`, (e: any) => {
    if (!shouldIgnoreError(e)) {
      let msg = 'unhandledRejection';
      if (e != null) {
        if (typeof e === 'string') {
          msg += ': ' + e;
        } else if (e.stack) {
          msg += ': ' + e.stack;
        } else if (e.message) {
          msg += ': ' + e.message;
        }
      }
      c.logger.error(msg);
    }
  });
}
