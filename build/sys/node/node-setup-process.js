import { shouldIgnoreError } from '@utils';
export function setupNodeProcess(c) {
    c.process.on(`unhandledRejection`, (e) => {
        if (!shouldIgnoreError(e)) {
            let msg = 'unhandledRejection';
            if (e != null) {
                if (typeof e === 'string') {
                    msg += ': ' + e;
                }
                else if (e.stack) {
                    msg += ': ' + e.stack;
                }
                else if (e.message) {
                    msg += ': ' + e.message;
                }
            }
            c.logger.error(msg);
        }
    });
}
//# sourceMappingURL=node-setup-process.js.map