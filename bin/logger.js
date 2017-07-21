'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var CommandLineLogger = (function () {
    function CommandLineLogger(opts) {
        this._level = 'info';
        this.chalk = opts.chalk;
        this.process = opts.process;
        this.width = Math.max(MIN_LEN, Math.min(opts.process.stdout.columns || 0, MAX_LEN));
        this.level = opts.level;
    }
    Object.defineProperty(CommandLineLogger.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (l) {
            var _this = this;
            if (typeof l === 'string') {
                l = l.toLowerCase().trim();
                if (LOG_LEVELS.indexOf(l) === -1) {
                    this.error("Invalid log level '" + this.chalk.bold(l) + "' (choose from: " + LOG_LEVELS.map(function (l) { return _this.chalk.bold(l); }).join(', ') + ")");
                }
                else {
                    this._level = l;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    CommandLineLogger.prototype.info = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (this.shouldLog('info')) {
            var lines = wordWrap(msg);
            this.infoPrefix(lines);
            console.log(lines.join('\n'));
        }
    };
    CommandLineLogger.prototype.infoPrefix = function (lines) {
        if (lines.length) {
            var d = new Date();
            var prefix = '[' +
                ('0' + d.getMinutes()).slice(-2) + ':' +
                ('0' + d.getSeconds()).slice(-2) + '.' +
                Math.floor((d.getMilliseconds() / 1000) * 10) + ']';
            lines[0] = this.dim(prefix) + lines[0].substr(prefix.length);
        }
    };
    CommandLineLogger.prototype.warn = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (this.shouldLog('warn')) {
            var lines = wordWrap(msg);
            this.warnPrefix(lines);
            console.warn(lines.join('\n'));
        }
    };
    CommandLineLogger.prototype.warnPrefix = function (lines) {
        if (lines.length) {
            var prefix = '[ WARN  ]';
            lines[0] = this.bold(this.chalk.yellow(prefix)) + lines[0].substr(prefix.length);
        }
    };
    CommandLineLogger.prototype.error = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (this.shouldLog('error')) {
            var lines = wordWrap(msg);
            this.errorPrefix(lines);
            console.error(lines.join('\n'));
        }
    };
    CommandLineLogger.prototype.errorPrefix = function (lines) {
        if (lines.length) {
            var prefix = '[ ERROR ]';
            lines[0] = this.bold(this.chalk.red(prefix)) + lines[0].substr(prefix.length);
        }
    };
    CommandLineLogger.prototype.debug = function () {
        var msg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            msg[_i] = arguments[_i];
        }
        if (this.shouldLog('debug')) {
            msg.push(this.memoryUsage());
            var lines = wordWrap(msg);
            this.debugPrefix(lines);
            console.log(lines.join('\n'));
        }
    };
    CommandLineLogger.prototype.debugPrefix = function (lines) {
        if (lines.length) {
            var prefix = '[ DEBUG ]';
            lines[0] = this.chalk.cyan(prefix) + lines[0].substr(prefix.length);
        }
    };
    CommandLineLogger.prototype.color = function (msg, color) {
        return this.chalk[color](msg);
    };
    CommandLineLogger.prototype.bold = function (msg) {
        return this.chalk.bold(msg);
    };
    CommandLineLogger.prototype.dim = function (msg) {
        return this.chalk.dim(msg);
    };
    CommandLineLogger.prototype.memoryUsage = function () {
        return this.dim(" MEM: " + (this.process.memoryUsage().rss / 1000000).toFixed(1) + "MB");
    };
    CommandLineLogger.prototype.shouldLog = function (level) {
        return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.level);
    };
    CommandLineLogger.prototype.createTimeSpan = function (startMsg, debug) {
        if (debug === void 0) { debug = false; }
        return new CmdTimeSpan(this, startMsg, debug);
    };
    CommandLineLogger.prototype.printDiagnostics = function (diagnostics) {
        var _this = this;
        if (!diagnostics.length)
            return;
        var outputLines = [''];
        diagnostics.forEach(function (d) {
            outputLines = outputLines.concat(_this.printDiagnostic(d));
        });
        console.log(outputLines.join('\n'));
    };
    CommandLineLogger.prototype.printDiagnostic = function (d) {
        var _this = this;
        var outputLines = wordWrap([d.messageText]);
        if (d.header && d.header !== 'build error' && d.header !== 'build warn') {
            outputLines.unshift(INDENT + d.header);
        }
        outputLines.push('');
        if (d.lines && d.lines.length) {
            var lines = prepareLines(d.lines, 'text');
            lines.forEach(function (l) {
                if (!isMeaningfulLine(l.text)) {
                    return;
                }
                var msg = "L" + l.lineNumber + ":  ";
                while (msg.length < INDENT.length) {
                    msg = ' ' + msg;
                }
                var text = l.text;
                if (l.errorCharStart > -1) {
                    text = _this.highlightError(text, l.errorCharStart, l.errorLength);
                }
                msg = _this.dim(msg);
                if (d.language === 'javascript') {
                    msg += _this.jsSyntaxHighlight(text);
                }
                else if (d.language === 'scss' || d.language === 'css') {
                    msg += _this.cssSyntaxHighlight(text);
                }
                else {
                    msg += text;
                }
                outputLines.push(msg);
            });
            outputLines.push('');
        }
        if (d.level === 'warn') {
            this.warnPrefix(outputLines);
        }
        else if (d.level === 'info') {
            this.infoPrefix(outputLines);
        }
        else {
            this.errorPrefix(outputLines);
        }
        return outputLines;
    };
    CommandLineLogger.prototype.highlightError = function (errorLine, errorCharStart, errorLength) {
        var rightSideChars = errorLine.length - errorCharStart + errorLength - 1;
        while (errorLine.length + INDENT.length > MAX_LEN) {
            if (errorCharStart > (errorLine.length - errorCharStart + errorLength) && errorCharStart > 5) {
                // larger on left side
                errorLine = errorLine.substr(1);
                errorCharStart--;
            }
            else if (rightSideChars > 1) {
                // larger on right side
                errorLine = errorLine.substr(0, errorLine.length - 1);
                rightSideChars--;
            }
            else {
                break;
            }
        }
        var lineChars = [];
        var lineLength = Math.max(errorLine.length, errorCharStart + errorLength);
        for (var i = 0; i < lineLength; i++) {
            var chr = errorLine.charAt(i);
            if (i >= errorCharStart && i < errorCharStart + errorLength) {
                chr = this.chalk.bgRed(chr === '' ? ' ' : chr);
            }
            lineChars.push(chr);
        }
        return lineChars.join('');
    };
    CommandLineLogger.prototype.jsSyntaxHighlight = function (text) {
        var _this = this;
        if (text.trim().startsWith('//')) {
            return this.dim(text);
        }
        var words = text.split(' ').map(function (word) {
            if (JS_KEYWORDS.indexOf(word) > -1) {
                return _this.chalk.cyan(word);
            }
            return word;
        });
        return words.join(' ');
    };
    CommandLineLogger.prototype.cssSyntaxHighlight = function (text) {
        var cssProp = true;
        var safeChars = 'abcdefghijklmnopqrstuvwxyz-_';
        var notProp = '.#,:}@$[]/*';
        var chars = [];
        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            if (c === ';' || c === '{') {
                cssProp = true;
            }
            else if (notProp.indexOf(c) > -1) {
                cssProp = false;
            }
            if (cssProp && safeChars.indexOf(c.toLowerCase()) > -1) {
                chars.push(this.chalk.cyan(c));
                continue;
            }
            chars.push(c);
        }
        return chars.join('');
    };
    return CommandLineLogger;
}());
var CmdTimeSpan = (function () {
    function CmdTimeSpan(logger, startMsg, debug) {
        this.debug = debug;
        this.logger = logger;
        this.start = Date.now();
        var msg = startMsg + " " + logger.dim('...');
        if (this.debug) {
            this.logger.debug(msg);
        }
        else {
            this.logger.info(msg);
        }
    }
    CmdTimeSpan.prototype.finish = function (msg, color, bold, newLineSuffix) {
        if (color) {
            msg = this.logger.color(msg, color);
        }
        if (bold) {
            msg = this.logger.bold(msg);
        }
        msg += ' ' + this.logger.dim(this.timeSuffix());
        if (this.debug) {
            this.logger.debug(msg);
        }
        else {
            this.logger.info(msg);
        }
        if (newLineSuffix) {
            console.log('');
        }
    };
    CmdTimeSpan.prototype.timeSuffix = function () {
        var duration = Date.now() - this.start;
        var time;
        if (duration > 1000) {
            time = 'in ' + (duration / 1000).toFixed(2) + ' s';
        }
        else {
            var ms = parseFloat((duration).toFixed(3));
            if (ms > 0) {
                time = 'in ' + duration + ' ms';
            }
            else {
                time = 'in less than 1 ms';
            }
        }
        return time;
    };
    return CmdTimeSpan;
}());
var LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
function wordWrap(msg) {
    var lines = [];
    var words = [];
    msg.forEach(function (m) {
        if (m === null) {
            words.push('null');
        }
        else if (typeof m === 'undefined') {
            words.push('undefined');
        }
        else if (typeof m === 'string') {
            m.replace(/\s/gm, ' ').split(' ').forEach(function (strWord) {
                if (strWord.trim().length) {
                    words.push(strWord.trim());
                }
            });
        }
        else if (typeof m === 'number' || typeof m === 'boolean' || typeof m === 'function') {
            words.push(m.toString());
        }
        else if (Array.isArray(m)) {
            words.push(function () {
                return m.toString();
            });
        }
        else if (Object(m) === m) {
            words.push(function () {
                return m.toString();
            });
        }
        else {
            words.push(m.toString());
        }
    });
    var line = INDENT;
    words.forEach(function (word) {
        if (lines.length > 25) {
            return;
        }
        if (typeof word === 'function') {
            if (line.trim().length) {
                lines.push(line);
            }
            lines.push(word());
            line = INDENT;
        }
        else if (INDENT.length + word.length > MAX_LEN) {
            // word is too long to play nice, just give it its own line
            if (line.trim().length) {
                lines.push(line);
            }
            lines.push(INDENT + word);
            line = INDENT;
        }
        else if ((word.length + line.length) > MAX_LEN) {
            // this word would make the line too long
            // print the line now, then start a new one
            lines.push(line);
            line = INDENT + word + ' ';
        }
        else {
            line += word + ' ';
        }
    });
    if (line.trim().length) {
        lines.push(line);
    }
    return lines;
}
function prepareLines(orgLines, code) {
    var lines = JSON.parse(JSON.stringify(orgLines));
    for (var i = 0; i < 100; i++) {
        if (!eachLineHasLeadingWhitespace(lines, code)) {
            return lines;
        }
        for (var i_1 = 0; i_1 < lines.length; i_1++) {
            lines[i_1][code] = lines[i_1][code].substr(1);
            lines[i_1].errorCharStart--;
            if (!lines[i_1][code].length) {
                return lines;
            }
        }
    }
    return lines;
}
function eachLineHasLeadingWhitespace(lines, code) {
    if (!lines.length) {
        return false;
    }
    for (var i = 0; i < lines.length; i++) {
        if (!lines[i][code] || lines[i][code].length < 1) {
            return false;
        }
        var firstChar = lines[i][code].charAt(0);
        if (firstChar !== ' ' && firstChar !== '\t') {
            return false;
        }
    }
    return true;
}
function isMeaningfulLine(line) {
    if (line) {
        line = line.trim();
        if (line.length) {
            return (MEH_LINES.indexOf(line) < 0);
        }
    }
    return false;
}
var MEH_LINES = [';', ':', '{', '}', '(', ')', '/**', '/*', '*/', '*', '({', '})'];
var JS_KEYWORDS = [
    'abstract', 'any', 'as', 'break', 'boolean', 'case', 'catch', 'class',
    'console', 'const', 'continue', 'debugger', 'declare', 'default', 'delete',
    'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from',
    'function', 'get', 'if', 'import', 'in', 'implements', 'Infinity',
    'instanceof', 'let', 'module', 'namespace', 'NaN', 'new', 'number', 'null',
    'public', 'private', 'protected', 'require', 'return', 'static', 'set',
    'string', 'super', 'switch', 'this', 'throw', 'try', 'true', 'type',
    'typeof', 'undefined', 'var', 'void', 'with', 'while', 'yield',
];
var INDENT = '           ';
var MIN_LEN = 80;
var MAX_LEN = 120;

exports.CommandLineLogger = CommandLineLogger;
