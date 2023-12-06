export class TestingLogger {
    constructor() {
        this.isEnabled = false;
    }
    enable() {
        this.isEnabled = true;
    }
    setLevel(_level) { }
    getLevel() {
        return 'info';
    }
    enableColors(_useColors) { }
    emoji(_) {
        return '';
    }
    info(...msg) {
        if (this.isEnabled) {
            console.log(...msg);
        }
    }
    warn(...msg) {
        if (this.isEnabled) {
            console.warn(...msg);
        }
    }
    error(...msg) {
        if (this.isEnabled) {
            console.error(...msg);
        }
    }
    debug(...msg) {
        if (this.isEnabled) {
            console.log(...msg);
        }
    }
    color(_msg, _color) { }
    red(msg) {
        return msg;
    }
    green(msg) {
        return msg;
    }
    yellow(msg) {
        return msg;
    }
    blue(msg) {
        return msg;
    }
    magenta(msg) {
        return msg;
    }
    cyan(msg) {
        return msg;
    }
    gray(msg) {
        return msg;
    }
    bold(msg) {
        return msg;
    }
    dim(msg) {
        return msg;
    }
    bgRed(msg) {
        return msg;
    }
    createTimeSpan(_startMsg, _debug = false) {
        return {
            duration() {
                return 0;
            },
            finish() {
                return 0;
            },
        };
    }
    printDiagnostics(_diagnostics) { }
}
//# sourceMappingURL=testing-logger.js.map