// postcss esm build from 7.0.18
import supportsColor from 'supports-color';
import chalk from 'chalk';
import path from 'path';
import mozilla from 'source-map';
import fs from 'fs';

const SINGLE_QUOTE = '\''.charCodeAt(0);
const DOUBLE_QUOTE = '"'.charCodeAt(0);
const BACKSLASH = '\\'.charCodeAt(0);
const SLASH = '/'.charCodeAt(0);
const NEWLINE = '\n'.charCodeAt(0);
const SPACE = ' '.charCodeAt(0);
const FEED = '\f'.charCodeAt(0);
const TAB = '\t'.charCodeAt(0);
const CR = '\r'.charCodeAt(0);
const OPEN_SQUARE = '['.charCodeAt(0);
const CLOSE_SQUARE = ']'.charCodeAt(0);
const OPEN_PARENTHESES = '('.charCodeAt(0);
const CLOSE_PARENTHESES = ')'.charCodeAt(0);
const OPEN_CURLY = '{'.charCodeAt(0);
const CLOSE_CURLY = '}'.charCodeAt(0);
const SEMICOLON = ';'.charCodeAt(0);
const ASTERISK = '*'.charCodeAt(0);
const COLON = ':'.charCodeAt(0);
const AT = '@'.charCodeAt(0);

const RE_AT_END = /[ \n\t\r\f{}()'"\\;/[\]#]/g;
const RE_WORD_END = /[ \n\t\r\f(){}:;@!'"\\\][#]|\/(?=\*)/g;
const RE_BAD_BRACKET = /.[\\/("'\n]/;
const RE_HEX_ESCAPE = /[a-f0-9]/i;

function tokenizer (input, options = {}) {
  let css = input.css.valueOf();
  let ignore = options.ignoreErrors;

  let code, next, quote, lines, last, content, escape;
  let nextLine, nextOffset, escaped, escapePos, prev, n, currentToken;

  let length = css.length;
  let offset = -1;
  let line = 1;
  let pos = 0;
  let buffer = [];
  let returned = [];

  function position () {
    return pos
  }

  function unclosed (what) {
    throw input.error('Unclosed ' + what, line, pos - offset)
  }

  function endOfFile () {
    return returned.length === 0 && pos >= length
  }

  function nextToken (opts) {
    if (returned.length) return returned.pop()
    if (pos >= length) return

    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;

    code = css.charCodeAt(pos);
    if (
      code === NEWLINE || code === FEED ||
      (code === CR && css.charCodeAt(pos + 1) !== NEWLINE)
    ) {
      offset = pos;
      line += 1;
    }

    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED:
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
          if (code === NEWLINE) {
            offset = next;
            line += 1;
          }
        } while (
          code === SPACE ||
          code === NEWLINE ||
          code === TAB ||
          code === CR ||
          code === FEED
        )

        currentToken = ['space', css.slice(pos, next)];
        pos = next - 1;
        break

      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES:
        let controlChar = String.fromCharCode(code);
        currentToken = [controlChar, controlChar, line, pos - offset];
        break

      case OPEN_PARENTHESES:
        prev = buffer.length ? buffer.pop()[1] : '';
        n = css.charCodeAt(pos + 1);
        if (
          prev === 'url' &&
          n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE &&
          n !== SPACE && n !== NEWLINE && n !== TAB &&
          n !== FEED && n !== CR
        ) {
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(')', next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos;
                break
              } else {
                unclosed('bracket');
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped)

          currentToken = ['brackets', css.slice(pos, next + 1),
            line, pos - offset,
            line, next - offset
          ];

          pos = next;
        } else {
          next = css.indexOf(')', pos + 1);
          content = css.slice(pos, next + 1);

          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ['(', '(', line, pos - offset];
          } else {
            currentToken = ['brackets', content,
              line, pos - offset,
              line, next - offset
            ];
            pos = next;
          }
        }

        break

      case SINGLE_QUOTE:
      case DOUBLE_QUOTE:
        quote = code === SINGLE_QUOTE ? '\'' : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1;
              break
            } else {
              unclosed('string');
            }
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped)

        content = css.slice(pos, next + 1);
        lines = content.split('\n');
        last = lines.length - 1;

        if (last > 0) {
          nextLine = line + last;
          nextOffset = next - lines[last].length;
        } else {
          nextLine = line;
          nextOffset = offset;
        }

        currentToken = ['string', css.slice(pos, next + 1),
          line, pos - offset,
          nextLine, next - nextOffset
        ];

        offset = nextOffset;
        line = nextLine;
        pos = next;
        break

      case AT:
        RE_AT_END.lastIndex = pos + 1;
        RE_AT_END.test(css);
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = RE_AT_END.lastIndex - 2;
        }

        currentToken = ['at-word', css.slice(pos, next + 1),
          line, pos - offset,
          line, next - offset
        ];

        pos = next;
        break

      case BACKSLASH:
        next = pos;
        escape = true;
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1;
          escape = !escape;
        }
        code = css.charCodeAt(next + 1);
        if (
          escape &&
          code !== SLASH &&
          code !== SPACE &&
          code !== NEWLINE &&
          code !== TAB &&
          code !== CR &&
          code !== FEED
        ) {
          next += 1;
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1;
            }
            if (css.charCodeAt(next + 1) === SPACE) {
              next += 1;
            }
          }
        }

        currentToken = ['word', css.slice(pos, next + 1),
          line, pos - offset,
          line, next - offset
        ];

        pos = next;
        break

      default:
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf('*/', pos + 2) + 1;
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length;
            } else {
              unclosed('comment');
            }
          }

          content = css.slice(pos, next + 1);
          lines = content.split('\n');
          last = lines.length - 1;

          if (last > 0) {
            nextLine = line + last;
            nextOffset = next - lines[last].length;
          } else {
            nextLine = line;
            nextOffset = offset;
          }

          currentToken = ['comment', content,
            line, pos - offset,
            nextLine, next - nextOffset
          ];

          offset = nextOffset;
          line = nextLine;
          pos = next;
        } else {
          RE_WORD_END.lastIndex = pos + 1;
          RE_WORD_END.test(css);
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_WORD_END.lastIndex - 2;
          }

          currentToken = ['word', css.slice(pos, next + 1),
            line, pos - offset,
            line, next - offset
          ];

          buffer.push(currentToken);

          pos = next;
        }

        break
    }

    pos++;
    return currentToken
  }

  function back (token) {
    returned.push(token);
  }

  return {
    back,
    nextToken,
    endOfFile,
    position
  }
}

function fromBase64 (str) {
  if (Buffer) {
    return Buffer.from(str, 'base64').toString()
  } else {
    return window.atob(str)
  }
}

/**
 * Source map information from input CSS.
 * For example, source map after Sass compiler.
 *
 * This class will automatically find source map in input CSS or in file system
 * near input file (according `from` option).
 *
 * @example
 * const root = postcss.parse(css, { from: 'a.sass.css' })
 * root.input.map //=> PreviousMap
 */
class PreviousMap {
  /**
   * @param {string}         css    Input CSS source.
   * @param {processOptions} [opts] {@link Processor#process} options.
   */
  constructor (css, opts) {
    this.loadAnnotation(css);
    /**
     * Was source map inlined by data-uri to input CSS.
     *
     * @type {boolean}
     */
    this.inline = this.startWith(this.annotation, 'data:');

    let prev = opts.map ? opts.map.prev : undefined;
    let text = this.loadMap(opts.from, prev);
    if (text) this.text = text;
  }

  /**
   * Create a instance of `SourceMapGenerator` class
   * from the `source-map` library to work with source map information.
   *
   * It is lazy method, so it will create object only on first call
   * and then it will use cache.
   *
   * @return {SourceMapGenerator} Object with source map information.
   */
  consumer () {
    if (!this.consumerCache) {
      this.consumerCache = new mozilla.SourceMapConsumer(this.text);
    }
    return this.consumerCache
  }

  /**
   * Does source map contains `sourcesContent` with input source text.
   *
   * @return {boolean} Is `sourcesContent` present.
   */
  withContent () {
    return !!(this.consumer().sourcesContent &&
              this.consumer().sourcesContent.length > 0)
  }

  startWith (string, start) {
    if (!string) return false
    return string.substr(0, start.length) === start
  }

  loadAnnotation (css) {
    let match = css.match(/\/\*\s*# sourceMappingURL=(.*)\s*\*\//);
    if (match) this.annotation = match[1].trim();
  }

  decodeInline (text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
    let baseUri = /^data:application\/json;base64,/;
    let uri = 'data:application/json,';

    if (this.startWith(text, uri)) {
      return decodeURIComponent(text.substr(uri.length))
    }

    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64(text.substr(RegExp.lastMatch.length))
    }

    let encoding = text.match(/data:application\/json;([^,]+),/)[1];
    throw new Error('Unsupported source map encoding ' + encoding)
  }

  loadMap (file, prev) {
    if (prev === false) return false

    if (prev) {
      if (typeof prev === 'string') {
        return prev
      } else if (typeof prev === 'function') {
        let prevPath = prev(file);
        if (prevPath && fs.existsSync && fs.existsSync(prevPath)) {
          return fs.readFileSync(prevPath, 'utf-8').toString().trim()
        } else {
          throw new Error(
            'Unable to load previous source map: ' + prevPath.toString())
        }
      } else if (prev instanceof mozilla.SourceMapConsumer) {
        return mozilla.SourceMapGenerator.fromSourceMap(prev).toString()
      } else if (prev instanceof mozilla.SourceMapGenerator) {
        return prev.toString()
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev)
      } else {
        throw new Error(
          'Unsupported previous source map format: ' + prev.toString())
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation)
    } else if (this.annotation) {
      let map = this.annotation;
      if (file) map = path.join(path.dirname(file), map);

      this.root = path.dirname(map);
      if (fs.existsSync && fs.existsSync(map)) {
        return fs.readFileSync(map, 'utf-8').toString().trim()
      } else {
        return false
      }
    }
  }

  isMap (map) {
    if (typeof map !== 'object') return false
    return typeof map.mappings === 'string' || typeof map._mappings === 'string'
  }
}

let sequence = 0;

/**
 * Represents the source CSS.
 *
 * @example
 * const root  = postcss.parse(css, { from: file })
 * const input = root.source.input
 */
class Input {
  /**
   * @param {string} css    Input CSS source.
   * @param {object} [opts] {@link Processor#process} options.
   */
  constructor (css, opts = { }) {
    if (css === null || (typeof css === 'object' && !css.toString)) {
      throw new Error(`PostCSS received ${ css } instead of CSS string`)
    }

    /**
     * Input CSS source
     *
     * @type {string}
     *
     * @example
     * const input = postcss.parse('a{}', { from: file }).input
     * input.css //=> "a{}"
     */
    this.css = css.toString();

    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
      this.hasBOM = true;
      this.css = this.css.slice(1);
    } else {
      this.hasBOM = false;
    }

    if (opts.from) {
      if (/^\w+:\/\//.test(opts.from)) {
        /**
         * The absolute path to the CSS source file defined
         * with the `from` option.
         *
         * @type {string}
         *
         * @example
         * const root = postcss.parse(css, { from: 'a.css' })
         * root.source.input.file //=> '/home/ai/a.css'
         */
        this.file = opts.from;
      } else {
        this.file = path.resolve(opts.from);
      }
    }

    let map = new PreviousMap(this.css, opts);
    if (map.text) {
      /**
       * The input source map passed from a compilation step before PostCSS
       * (for example, from Sass compiler).
       *
       * @type {PreviousMap}
       *
       * @example
       * root.source.input.map.consumer().sources //=> ['a.sass']
       */
      this.map = map;
      let file = map.consumer().file;
      if (!this.file && file) this.file = this.mapResolve(file);
    }

    if (!this.file) {
      sequence += 1;
      /**
       * The unique ID of the CSS source. It will be created if `from` option
       * is not provided (because PostCSS does not know the file path).
       *
       * @type {string}
       *
       * @example
       * const root = postcss.parse(css)
       * root.source.input.file //=> undefined
       * root.source.input.id   //=> "<input css 1>"
       */
      this.id = '<input css ' + sequence + '>';
    }
    if (this.map) this.map.file = this.from;
  }

  error (message, line, column, opts = { }) {
    let result;
    let origin = this.origin(line, column);
    if (origin) {
      result = new CssSyntaxError(
        message, origin.line, origin.column,
        origin.source, origin.file, opts.plugin
      );
    } else {
      result = new CssSyntaxError(
        message, line, column, this.css, this.file, opts.plugin);
    }

    result.input = { line, column, source: this.css };
    if (this.file) result.input.file = this.file;

    return result
  }

  /**
   * Reads the input source map and returns a symbol position
   * in the input source (e.g., in a Sass file that was compiled
   * to CSS before being passed to PostCSS).
   *
   * @param {number} line   Line in input CSS.
   * @param {number} column Column in input CSS.
   *
   * @return {filePosition} Position in input source.
   *
   * @example
   * root.source.input.origin(1, 1) //=> { file: 'a.css', line: 3, column: 1 }
   */
  origin (line, column) {
    if (!this.map) return false
    let consumer = this.map.consumer();

    let from = consumer.originalPositionFor({ line, column });
    if (!from.source) return false

    let result = {
      file: this.mapResolve(from.source),
      line: from.line,
      column: from.column
    };

    let source = consumer.sourceContentFor(from.source);
    if (source) result.source = source;

    return result
  }

  mapResolve (file) {
    if (/^\w+:\/\//.test(file)) {
      return file
    }
    return path.resolve(this.map.consumer().sourceRoot || '.', file)
  }

  /**
   * The CSS source identifier. Contains {@link Input#file} if the user
   * set the `from` option, or {@link Input#id} if they did not.
   *
   * @type {string}
   *
   * @example
   * const root = postcss.parse(css, { from: 'a.css' })
   * root.source.input.from //=> "/home/ai/a.css"
   *
   * const root = postcss.parse(css)
   * root.source.input.from //=> "<input css 1>"
   */
  get from () {
    return this.file || this.id
  }
}

/**
 * @typedef  {object} filePosition
 * @property {string} file   Path to file.
 * @property {number} line   Source line in file.
 * @property {number} column Source column in file.
 */

const HIGHLIGHT_THEME = {
  'brackets': chalk.cyan,
  'at-word': chalk.cyan,
  'comment': chalk.gray,
  'string': chalk.green,
  'class': chalk.yellow,
  'call': chalk.cyan,
  'hash': chalk.magenta,
  '(': chalk.cyan,
  ')': chalk.cyan,
  '{': chalk.yellow,
  '}': chalk.yellow,
  '[': chalk.yellow,
  ']': chalk.yellow,
  ':': chalk.yellow,
  ';': chalk.yellow
};

function getTokenType ([type, value], processor) {
  if (type === 'word') {
    if (value[0] === '.') {
      return 'class'
    }
    if (value[0] === '#') {
      return 'hash'
    }
  }

  if (!processor.endOfFile()) {
    let next = processor.nextToken();
    processor.back(next);
    if (next[0] === 'brackets' || next[0] === '(') return 'call'
  }

  return type
}

function terminalHighlight (css) {
  let processor = tokenizer(new Input(css), { ignoreErrors: true });
  let result = '';
  while (!processor.endOfFile()) {
    let token = processor.nextToken();
    let color = HIGHLIGHT_THEME[getTokenType(token, processor)];
    if (color) {
      result += token[1].split(/\r?\n/)
        .map(i => color(i))
        .join('\n');
    } else {
      result += token[1];
    }
  }
  return result
}

/**
 * The CSS parser throws this error for broken CSS.
 *
 * Custom parsers can throw this error for broken custom syntax using
 * the {@link Node#error} method.
 *
 * PostCSS will use the input source map to detect the original error location.
 * If you wrote a Sass file, compiled it to CSS and then parsed it with PostCSS,
 * PostCSS will show the original position in the Sass file.
 *
 * If you need the position in the PostCSS input
 * (e.g., to debug the previous compiler), use `error.input.file`.
 *
 * @example
 * // Catching and checking syntax error
 * try {
 *   postcss.parse('a{')
 * } catch (error) {
 *   if (error.name === 'CssSyntaxError') {
 *     error //=> CssSyntaxError
 *   }
 * }
 *
 * @example
 * // Raising error from plugin
 * throw node.error('Unknown variable', { plugin: 'postcss-vars' })
 */
class CssSyntaxError extends Error {
  /**
   * @param {string} message  Error message.
   * @param {number} [line]   Source line of the error.
   * @param {number} [column] Source column of the error.
   * @param {string} [source] Source code of the broken file.
   * @param {string} [file]   Absolute path to the broken file.
   * @param {string} [plugin] PostCSS plugin name, if error came from plugin.
   */
  constructor (message, line, column, source, file, plugin) {
    super(message);

    /**
     * Always equal to `'CssSyntaxError'`. You should always check error type
     * by `error.name === 'CssSyntaxError'`
     * instead of `error instanceof CssSyntaxError`,
     * because npm could have several PostCSS versions.
     *
     * @type {string}
     *
     * @example
     * if (error.name === 'CssSyntaxError') {
     *   error //=> CssSyntaxError
     * }
     */
    this.name = 'CssSyntaxError';
    /**
     * Error message.
     *
     * @type {string}
     *
     * @example
     * error.message //=> 'Unclosed block'
     */
    this.reason = message;

    if (file) {
      /**
       * Absolute path to the broken file.
       *
       * @type {string}
       *
       * @example
       * error.file       //=> 'a.sass'
       * error.input.file //=> 'a.css'
       */
      this.file = file;
    }
    if (source) {
      /**
       * Source code of the broken file.
       *
       * @type {string}
       *
       * @example
       * error.source       //=> 'a { b {} }'
       * error.input.column //=> 'a b { }'
       */
      this.source = source;
    }
    if (plugin) {
      /**
       * Plugin name, if error came from plugin.
       *
       * @type {string}
       *
       * @example
       * error.plugin //=> 'postcss-vars'
       */
      this.plugin = plugin;
    }
    if (typeof line !== 'undefined' && typeof column !== 'undefined') {
      /**
       * Source line of the error.
       *
       * @type {number}
       *
       * @example
       * error.line       //=> 2
       * error.input.line //=> 4
       */
      this.line = line;
      /**
       * Source column of the error.
       *
       * @type {number}
       *
       * @example
       * error.column       //=> 1
       * error.input.column //=> 4
       */
      this.column = column;
    }

    this.setMessage();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError);
    }
  }

  setMessage () {
    /**
     * Full error text in the GNU error format
     * with plugin, file, line and column.
     *
     * @type {string}
     *
     * @example
     * error.message //=> 'a.css:1:1: Unclosed block'
     */
    this.message = this.plugin ? this.plugin + ': ' : '';
    this.message += this.file ? this.file : '<css input>';
    if (typeof this.line !== 'undefined') {
      this.message += ':' + this.line + ':' + this.column;
    }
    this.message += ': ' + this.reason;
  }

  /**
   * Returns a few lines of CSS source that caused the error.
   *
   * If the CSS has an input source map without `sourceContent`,
   * this method will return an empty string.
   *
   * @param {boolean} [color] Whether arrow will be colored red by terminal
   *                          color codes. By default, PostCSS will detect
   *                          color support by `process.stdout.isTTY`
   *                          and `process.env.NODE_DISABLE_COLORS`.
   *
   * @example
   * error.showSourceCode() //=> "  4 | }
   *                        //      5 | a {
   *                        //    > 6 |   bad
   *                        //        |   ^
   *                        //      7 | }
   *                        //      8 | b {"
   *
   * @return {string} Few lines of CSS source that caused the error.
   */
  showSourceCode (color) {
    if (!this.source) return ''

    let css = this.source;
    if (terminalHighlight) {
      if (typeof color === 'undefined') color = supportsColor.stdout;
      if (color) css = terminalHighlight(css);
    }

    let lines = css.split(/\r?\n/);
    let start = Math.max(this.line - 3, 0);
    let end = Math.min(this.line + 2, lines.length);

    let maxWidth = String(end).length;

    function mark (text) {
      if (color && chalk.red) {
        return chalk.red.bold(text)
      }
      return text
    }
    function aside (text) {
      if (color && chalk.gray) {
        return chalk.gray(text)
      }
      return text
    }

    return lines.slice(start, end).map((line, index) => {
      let number = start + 1 + index;
      let gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | ';
      if (number === this.line) {
        let spacing = aside(gutter.replace(/\d/g, ' ')) +
          line.slice(0, this.column - 1).replace(/[^\t]/g, ' ');
        return mark('>') + aside(gutter) + line + '\n ' + spacing + mark('^')
      }
      return ' ' + aside(gutter) + line
    }).join('\n')
  }

  /**
   * Returns error position, message and source code of the broken part.
   *
   * @example
   * error.toString() //=> "CssSyntaxError: app.css:1:1: Unclosed block
   *                  //    > 1 | a {
   *                  //        | ^"
   *
   * @return {string} Error position, message and source code.
   */
  toString () {
    let code = this.showSourceCode();
    if (code) {
      code = '\n\n' + code + '\n';
    }
    return this.name + ': ' + this.message + code
  }

  /**
   * @memberof CssSyntaxError#
   * @member {Input} input Input object with PostCSS internal information
   *                       about input file. If input has source map
   *                       from previous tool, PostCSS will use origin
   *                       (for example, Sass) source. You can use this
   *                       object to get PostCSS input source.
   *
   * @example
   * error.input.file //=> 'a.css'
   * error.file       //=> 'a.sass'
   */
}

const DEFAULT_RAW = {
  colon: ': ',
  indent: '    ',
  beforeDecl: '\n',
  beforeRule: '\n',
  beforeOpen: ' ',
  beforeClose: '\n',
  beforeComment: '\n',
  after: '\n',
  emptyBody: '',
  commentLeft: ' ',
  commentRight: ' ',
  semicolon: false
};

function capitalize (str) {
  return str[0].toUpperCase() + str.slice(1)
}

class Stringifier {
  constructor (builder) {
    this.builder = builder;
  }

  stringify (node, semicolon) {
    this[node.type](node, semicolon);
  }

  root (node) {
    this.body(node);
    if (node.raws.after) this.builder(node.raws.after);
  }

  comment (node) {
    let left = this.raw(node, 'left', 'commentLeft');
    let right = this.raw(node, 'right', 'commentRight');
    this.builder('/*' + left + node.text + right + '*/', node);
  }

  decl (node, semicolon) {
    let between = this.raw(node, 'between', 'colon');
    let string = node.prop + between + this.rawValue(node, 'value');

    if (node.important) {
      string += node.raws.important || ' !important';
    }

    if (semicolon) string += ';';
    this.builder(string, node);
  }

  rule (node) {
    this.block(node, this.rawValue(node, 'selector'));
    if (node.raws.ownSemicolon) {
      this.builder(node.raws.ownSemicolon, node, 'end');
    }
  }

  atrule (node, semicolon) {
    let name = '@' + node.name;
    let params = node.params ? this.rawValue(node, 'params') : '';

    if (typeof node.raws.afterName !== 'undefined') {
      name += node.raws.afterName;
    } else if (params) {
      name += ' ';
    }

    if (node.nodes) {
      this.block(node, name + params);
    } else {
      let end = (node.raws.between || '') + (semicolon ? ';' : '');
      this.builder(name + params + end, node);
    }
  }

  body (node) {
    let last = node.nodes.length - 1;
    while (last > 0) {
      if (node.nodes[last].type !== 'comment') break
      last -= 1;
    }

    let semicolon = this.raw(node, 'semicolon');
    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];
      let before = this.raw(child, 'before');
      if (before) this.builder(before);
      this.stringify(child, last !== i || semicolon);
    }
  }

  block (node, start) {
    let between = this.raw(node, 'between', 'beforeOpen');
    this.builder(start + between + '{', node, 'start');

    let after;
    if (node.nodes && node.nodes.length) {
      this.body(node);
      after = this.raw(node, 'after');
    } else {
      after = this.raw(node, 'after', 'emptyBody');
    }

    if (after) this.builder(after);
    this.builder('}', node, 'end');
  }

  raw (node, own, detect) {
    let value;
    if (!detect) detect = own;

    // Already had
    if (own) {
      value = node.raws[own];
      if (typeof value !== 'undefined') return value
    }

    let parent = node.parent;

    // Hack for first rule in CSS
    if (detect === 'before') {
      if (!parent || (parent.type === 'root' && parent.first === node)) {
        return ''
      }
    }

    // Floating child without parent
    if (!parent) return DEFAULT_RAW[detect]

    // Detect style by other nodes
    let root = node.root();
    if (!root.rawCache) root.rawCache = { };
    if (typeof root.rawCache[detect] !== 'undefined') {
      return root.rawCache[detect]
    }

    if (detect === 'before' || detect === 'after') {
      return this.beforeAfter(node, detect)
    } else {
      let method = 'raw' + capitalize(detect);
      if (this[method]) {
        value = this[method](root, node);
      } else {
        root.walk(i => {
          value = i.raws[own];
          if (typeof value !== 'undefined') return false
        });
      }
    }

    if (typeof value === 'undefined') value = DEFAULT_RAW[detect];

    root.rawCache[detect] = value;
    return value
  }

  rawSemicolon (root) {
    let value;
    root.walk(i => {
      if (i.nodes && i.nodes.length && i.last.type === 'decl') {
        value = i.raws.semicolon;
        if (typeof value !== 'undefined') return false
      }
    });
    return value
  }

  rawEmptyBody (root) {
    let value;
    root.walk(i => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after;
        if (typeof value !== 'undefined') return false
      }
    });
    return value
  }

  rawIndent (root) {
    if (root.raws.indent) return root.raws.indent
    let value;
    root.walk(i => {
      let p = i.parent;
      if (p && p !== root && p.parent && p.parent === root) {
        if (typeof i.raws.before !== 'undefined') {
          let parts = i.raws.before.split('\n');
          value = parts[parts.length - 1];
          value = value.replace(/[^\s]/g, '');
          return false
        }
      }
    });
    return value
  }

  rawBeforeComment (root, node) {
    let value;
    root.walkComments(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before;
        if (value.indexOf('\n') !== -1) {
          value = value.replace(/[^\n]+$/, '');
        }
        return false
      }
    });
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeDecl');
    } else if (value) {
      value = value.replace(/[^\s]/g, '');
    }
    return value
  }

  rawBeforeDecl (root, node) {
    let value;
    root.walkDecls(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before;
        if (value.indexOf('\n') !== -1) {
          value = value.replace(/[^\n]+$/, '');
        }
        return false
      }
    });
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeRule');
    } else if (value) {
      value = value.replace(/[^\s]/g, '');
    }
    return value
  }

  rawBeforeRule (root) {
    let value;
    root.walk(i => {
      if (i.nodes && (i.parent !== root || root.first !== i)) {
        if (typeof i.raws.before !== 'undefined') {
          value = i.raws.before;
          if (value.indexOf('\n') !== -1) {
            value = value.replace(/[^\n]+$/, '');
          }
          return false
        }
      }
    });
    if (value) value = value.replace(/[^\s]/g, '');
    return value
  }

  rawBeforeClose (root) {
    let value;
    root.walk(i => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== 'undefined') {
          value = i.raws.after;
          if (value.indexOf('\n') !== -1) {
            value = value.replace(/[^\n]+$/, '');
          }
          return false
        }
      }
    });
    if (value) value = value.replace(/[^\s]/g, '');
    return value
  }

  rawBeforeOpen (root) {
    let value;
    root.walk(i => {
      if (i.type !== 'decl') {
        value = i.raws.between;
        if (typeof value !== 'undefined') return false
      }
    });
    return value
  }

  rawColon (root) {
    let value;
    root.walkDecls(i => {
      if (typeof i.raws.between !== 'undefined') {
        value = i.raws.between.replace(/[^\s:]/g, '');
        return false
      }
    });
    return value
  }

  beforeAfter (node, detect) {
    let value;
    if (node.type === 'decl') {
      value = this.raw(node, null, 'beforeDecl');
    } else if (node.type === 'comment') {
      value = this.raw(node, null, 'beforeComment');
    } else if (detect === 'before') {
      value = this.raw(node, null, 'beforeRule');
    } else {
      value = this.raw(node, null, 'beforeClose');
    }

    let buf = node.parent;
    let depth = 0;
    while (buf && buf.type !== 'root') {
      depth += 1;
      buf = buf.parent;
    }

    if (value.indexOf('\n') !== -1) {
      let indent = this.raw(node, null, 'indent');
      if (indent.length) {
        for (let step = 0; step < depth; step++) value += indent;
      }
    }

    return value
  }

  rawValue (node, prop) {
    let value = node[prop];
    let raw = node.raws[prop];
    if (raw && raw.value === value) {
      return raw.raw
    }

    return value
  }
}

function stringify (node, builder) {
  let str = new Stringifier(builder);
  str.stringify(node);
}

function cloneNode (obj, parent) {
  let cloned = new obj.constructor();

  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue
    let value = obj[i];
    let type = typeof value;

    if (i === 'parent' && type === 'object') {
      if (parent) cloned[i] = parent;
    } else if (i === 'source') {
      cloned[i] = value;
    } else if (value instanceof Array) {
      cloned[i] = value.map(j => cloneNode(j, cloned));
    } else {
      if (type === 'object' && value !== null) value = cloneNode(value);
      cloned[i] = value;
    }
  }

  return cloned
}

/**
 * All node classes inherit the following common methods.
 *
 * @abstract
 */
class Node {
  /**
   * @param {object} [defaults] Value for node properties.
   */
  constructor (defaults = { }) {
    this.raws = { };
    if (process.env.NODE_ENV !== 'production') {
      if (typeof defaults !== 'object' && typeof defaults !== 'undefined') {
        throw new Error(
          'PostCSS nodes constructor accepts object, not ' +
          JSON.stringify(defaults)
        )
      }
    }
    for (let name in defaults) {
      this[name] = defaults[name];
    }
  }

  /**
   * Returns a `CssSyntaxError` instance containing the original position
   * of the node in the source, showing line and column numbers and also
   * a small excerpt to facilitate debugging.
   *
   * If present, an input source map will be used to get the original position
   * of the source, even from a previous compilation step
   * (e.g., from Sass compilation).
   *
   * This method produces very useful error messages.
   *
   * @param {string} message     Error description.
   * @param {object} [opts]      Options.
   * @param {string} opts.plugin Plugin name that created this error.
   *                             PostCSS will set it automatically.
   * @param {string} opts.word   A word inside a node’s string that should
   *                             be highlighted as the source of the error.
   * @param {number} opts.index  An index inside a node’s string that should
   *                             be highlighted as the source of the error.
   *
   * @return {CssSyntaxError} Error object to throw it.
   *
   * @example
   * if (!variables[name]) {
   *   throw decl.error('Unknown variable ' + name, { word: name })
   *   // CssSyntaxError: postcss-vars:a.sass:4:3: Unknown variable $black
   *   //   color: $black
   *   // a
   *   //          ^
   *   //   background: white
   * }
   */
  error (message, opts = { }) {
    if (this.source) {
      let pos = this.positionBy(opts);
      return this.source.input.error(message, pos.line, pos.column, opts)
    }
    return new CssSyntaxError(message)
  }

  /**
   * This method is provided as a convenience wrapper for {@link Result#warn}.
   *
   * @param {Result} result      The {@link Result} instance
   *                             that will receive the warning.
   * @param {string} text        Warning message.
   * @param {object} [opts]      Options
   * @param {string} opts.plugin Plugin name that created this warning.
   *                             PostCSS will set it automatically.
   * @param {string} opts.word   A word inside a node’s string that should
   *                             be highlighted as the source of the warning.
   * @param {number} opts.index  An index inside a node’s string that should
   *                             be highlighted as the source of the warning.
   *
   * @return {Warning} Created warning object.
   *
   * @example
   * const plugin = postcss.plugin('postcss-deprecated', () => {
   *   return (root, result) => {
   *     root.walkDecls('bad', decl => {
   *       decl.warn(result, 'Deprecated property bad')
   *     })
   *   }
   * })
   */
  warn (result, text, opts) {
    let data = { node: this };
    for (let i in opts) data[i] = opts[i];
    return result.warn(text, data)
  }

  /**
   * Removes the node from its parent and cleans the parent properties
   * from the node and its children.
   *
   * @example
   * if (decl.prop.match(/^-webkit-/)) {
   *   decl.remove()
   * }
   *
   * @return {Node} Node to make calls chain.
   */
  remove () {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = undefined;
    return this
  }

  /**
   * Returns a CSS string representing the node.
   *
   * @param {stringifier|syntax} [stringifier] A syntax to use
   *                                           in string generation.
   *
   * @return {string} CSS string of this node.
   *
   * @example
   * postcss.rule({ selector: 'a' }).toString() //=> "a {}"
   */
  toString (stringifier = stringify) {
    if (stringifier.stringify) stringifier = stringifier.stringify;
    let result = '';
    stringifier(this, i => {
      result += i;
    });
    return result
  }

  /**
   * Returns an exact clone of the node.
   *
   * The resulting cloned node and its (cloned) children will retain
   * code style properties.
   *
   * @param {object} [overrides] New properties to override in the clone.
   *
   * @example
   * decl.raws.before    //=> "\n  "
   * const cloned = decl.clone({ prop: '-moz-' + decl.prop })
   * cloned.raws.before  //=> "\n  "
   * cloned.toString()   //=> -moz-transform: scale(0)
   *
   * @return {Node} Clone of the node.
   */
  clone (overrides = { }) {
    let cloned = cloneNode(this);
    for (let name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned
  }

  /**
   * Shortcut to clone the node and insert the resulting cloned node
   * before the current node.
   *
   * @param {object} [overrides] Mew properties to override in the clone.
   *
   * @example
   * decl.cloneBefore({ prop: '-moz-' + decl.prop })
   *
   * @return {Node} New node
   */
  cloneBefore (overrides = { }) {
    let cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned
  }

  /**
   * Shortcut to clone the node and insert the resulting cloned node
   * after the current node.
   *
   * @param {object} [overrides] New properties to override in the clone.
   *
   * @return {Node} New node.
   */
  cloneAfter (overrides = { }) {
    let cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned
  }

  /**
   * Inserts node(s) before the current node and removes the current node.
   *
   * @param {...Node} nodes Mode(s) to replace current one.
   *
   * @example
   * if (atrule.name === 'mixin') {
   *   atrule.replaceWith(mixinRules[atrule.params])
   * }
   *
   * @return {Node} Current node to methods chain.
   */
  replaceWith (...nodes) {
    if (this.parent) {
      for (let node of nodes) {
        this.parent.insertBefore(this, node);
      }

      this.remove();
    }

    return this
  }

  /**
   * Returns the next child of the node’s parent.
   * Returns `undefined` if the current node is the last child.
   *
   * @return {Node|undefined} Next node.
   *
   * @example
   * if (comment.text === 'delete next') {
   *   const next = comment.next()
   *   if (next) {
   *     next.remove()
   *   }
   * }
   */
  next () {
    if (!this.parent) return undefined
    let index = this.parent.index(this);
    return this.parent.nodes[index + 1]
  }

  /**
   * Returns the previous child of the node’s parent.
   * Returns `undefined` if the current node is the first child.
   *
   * @return {Node|undefined} Previous node.
   *
   * @example
   * const annotation = decl.prev()
   * if (annotation.type === 'comment') {
   *   readAnnotation(annotation.text)
   * }
   */
  prev () {
    if (!this.parent) return undefined
    let index = this.parent.index(this);
    return this.parent.nodes[index - 1]
  }

  /**
   * Insert new node before current node to current node’s parent.
   *
   * Just alias for `node.parent.insertBefore(node, add)`.
   *
   * @param {Node|object|string|Node[]} add New node.
   *
   * @return {Node} This node for methods chain.
   *
   * @example
   * decl.before('content: ""')
   */
  before (add) {
    this.parent.insertBefore(this, add);
    return this
  }

  /**
   * Insert new node after current node to current node’s parent.
   *
   * Just alias for `node.parent.insertAfter(node, add)`.
   *
   * @param {Node|object|string|Node[]} add New node.
   *
   * @return {Node} This node for methods chain.
   *
   * @example
   * decl.after('color: black')
   */
  after (add) {
    this.parent.insertAfter(this, add);
    return this
  }

  toJSON () {
    let fixed = { };

    for (let name in this) {
      if (!this.hasOwnProperty(name)) continue
      if (name === 'parent') continue
      let value = this[name];

      if (value instanceof Array) {
        fixed[name] = value.map(i => {
          if (typeof i === 'object' && i.toJSON) {
            return i.toJSON()
          } else {
            return i
          }
        });
      } else if (typeof value === 'object' && value.toJSON) {
        fixed[name] = value.toJSON();
      } else {
        fixed[name] = value;
      }
    }

    return fixed
  }

  /**
   * Returns a {@link Node#raws} value. If the node is missing
   * the code style property (because the node was manually built or cloned),
   * PostCSS will try to autodetect the code style property by looking
   * at other nodes in the tree.
   *
   * @param {string} prop          Name of code style property.
   * @param {string} [defaultType] Name of default value, it can be missed
   *                               if the value is the same as prop.
   *
   * @example
   * const root = postcss.parse('a { background: white }')
   * root.nodes[0].append({ prop: 'color', value: 'black' })
   * root.nodes[0].nodes[1].raws.before   //=> undefined
   * root.nodes[0].nodes[1].raw('before') //=> ' '
   *
   * @return {string} Code style value.
   */
  raw (prop, defaultType) {
    let str = new Stringifier();
    return str.raw(this, prop, defaultType)
  }

  /**
   * Finds the Root instance of the node’s tree.
   *
   * @example
   * root.nodes[0].nodes[0].root() === root
   *
   * @return {Root} Root parent.
   */
  root () {
    let result = this;
    while (result.parent) result = result.parent;
    return result
  }

  /**
   * Clear the code style properties for the node and its children.
   *
   * @param {boolean} [keepBetween] Keep the raws.between symbols.
   *
   * @return {undefined}
   *
   * @example
   * node.raws.before  //=> ' '
   * node.cleanRaws()
   * node.raws.before  //=> undefined
   */
  cleanRaws (keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween) delete this.raws.between;
  }

  positionInside (index) {
    let string = this.toString();
    let column = this.source.start.column;
    let line = this.source.start.line;

    for (let i = 0; i < index; i++) {
      if (string[i] === '\n') {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }

    return { line, column }
  }

  positionBy (opts) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index);
    } else if (opts.word) {
      let index = this.toString().indexOf(opts.word);
      if (index !== -1) pos = this.positionInside(index);
    }
    return pos
  }

  /**
   * @memberof Node#
   * @member {string} type String representing the node’s type.
   *                       Possible values are `root`, `atrule`, `rule`,
   *                       `decl`, or `comment`.
   *
   * @example
   * postcss.decl({ prop: 'color', value: 'black' }).type //=> 'decl'
   */

  /**
   * @memberof Node#
   * @member {Container} parent The node’s parent node.
   *
   * @example
   * root.nodes[0].parent === root
   */

  /**
   * @memberof Node#
   * @member {source} source The input source of the node.
   *
   * The property is used in source map generation.
   *
   * If you create a node manually (e.g., with `postcss.decl()`),
   * that node will not have a `source` property and will be absent
   * from the source map. For this reason, the plugin developer should
   * consider cloning nodes to create new ones (in which case the new node’s
   * source will reference the original, cloned node) or setting
   * the `source` property manually.
   *
   * ```js
   * // Bad
   * const prefixed = postcss.decl({
   *   prop: '-moz-' + decl.prop,
   *   value: decl.value
   * })
   *
   * // Good
   * const prefixed = decl.clone({ prop: '-moz-' + decl.prop })
   * ```
   *
   * ```js
   * if (atrule.name === 'add-link') {
   *   const rule = postcss.rule({ selector: 'a', source: atrule.source })
   *   atrule.parent.insertBefore(atrule, rule)
   * }
   * ```
   *
   * @example
   * decl.source.input.from //=> '/home/ai/a.sass'
   * decl.source.start      //=> { line: 10, column: 2 }
   * decl.source.end        //=> { line: 10, column: 12 }
   */

  /**
   * @memberof Node#
   * @member {object} raws Information to generate byte-to-byte equal
   *                       node string as it was in the origin input.
   *
   * Every parser saves its own properties,
   * but the default CSS parser uses:
   *
   * * `before`: the space symbols before the node. It also stores `*`
   *   and `_` symbols before the declaration (IE hack).
   * * `after`: the space symbols after the last child of the node
   *   to the end of the node.
   * * `between`: the symbols between the property and value
   *   for declarations, selector and `{` for rules, or last parameter
   *   and `{` for at-rules.
   * * `semicolon`: contains true if the last child has
   *   an (optional) semicolon.
   * * `afterName`: the space between the at-rule name and its parameters.
   * * `left`: the space symbols between `/*` and the comment’s text.
   * * `right`: the space symbols between the comment’s text
   *   and <code>*&#47;</code>.
   * * `important`: the content of the important statement,
   *   if it is not just `!important`.
   *
   * PostCSS cleans selectors, declaration values and at-rule parameters
   * from comments and extra spaces, but it stores origin content in raws
   * properties. As such, if you don’t change a declaration’s value,
   * PostCSS will use the raw value with comments.
   *
   * @example
   * const root = postcss.parse('a {\n  color:black\n}')
   * root.first.first.raws //=> { before: '\n  ', between: ':' }
   */
}

/**
 * @typedef {object} position
 * @property {number} line   Source line in file.
 * @property {number} column Source column in file.
 */

/**
 * @typedef {object} source
 * @property {Input} input    {@link Input} with input file
 * @property {position} start The starting position of the node’s source.
 * @property {position} end   The ending position of the node’s source.
 */

/**
 * Represents a CSS declaration.
 *
 * @extends Node
 *
 * @example
 * const root = postcss.parse('a { color: black }')
 * const decl = root.first.first
 * decl.type       //=> 'decl'
 * decl.toString() //=> ' color: black'
 */
class Declaration extends Node {
  constructor (defaults) {
    super(defaults);
    this.type = 'decl';
  }

  /**
   * @memberof Declaration#
   * @member {string} prop The declaration’s property name.
   *
   * @example
   * const root = postcss.parse('a { color: black }')
   * const decl = root.first.first
   * decl.prop //=> 'color'
   */

  /**
   * @memberof Declaration#
   * @member {string} value The declaration’s value.
   *
   * @example
   * const root = postcss.parse('a { color: black }')
   * const decl = root.first.first
   * decl.value //=> 'black'
   */

  /**
   * @memberof Declaration#
   * @member {boolean} important `true` if the declaration
   *                             has an !important annotation.
   *
   * @example
   * const root = postcss.parse('a { color: black !important; color: red }')
   * root.first.first.important //=> true
   * root.first.last.important  //=> undefined
   */

  /**
   * @memberof Declaration#
   * @member {object} raws Information to generate byte-to-byte equal
   *                       node string as it was in the origin input.
   *
   * Every parser saves its own properties,
   * but the default CSS parser uses:
   *
   * * `before`: the space symbols before the node. It also stores `*`
   *   and `_` symbols before the declaration (IE hack).
   * * `between`: the symbols between the property and value
   *   for declarations.
   * * `important`: the content of the important statement,
   *   if it is not just `!important`.
   *
   * PostCSS cleans declaration from comments and extra spaces,
   * but it stores origin content in raws properties.
   * As such, if you don’t change a declaration’s value,
   * PostCSS will use the raw value with comments.
   *
   * @example
   * const root = postcss.parse('a {\n  color:black\n}')
   * root.first.first.raws //=> { before: '\n  ', between: ':' }
   */
}

class MapGenerator {
  constructor (stringify, root, opts) {
    this.stringify = stringify;
    this.mapOpts = opts.map || { };
    this.root = root;
    this.opts = opts;
  }

  isMap () {
    if (typeof this.opts.map !== 'undefined') {
      return !!this.opts.map
    }
    return this.previous().length > 0
  }

  previous () {
    if (!this.previousMaps) {
      this.previousMaps = [];
      this.root.walk(node => {
        if (node.source && node.source.input.map) {
          let map = node.source.input.map;
          if (this.previousMaps.indexOf(map) === -1) {
            this.previousMaps.push(map);
          }
        }
      });
    }

    return this.previousMaps
  }

  isInline () {
    if (typeof this.mapOpts.inline !== 'undefined') {
      return this.mapOpts.inline
    }

    let annotation = this.mapOpts.annotation;
    if (typeof annotation !== 'undefined' && annotation !== true) {
      return false
    }

    if (this.previous().length) {
      return this.previous().some(i => i.inline)
    }
    return true
  }

  isSourcesContent () {
    if (typeof this.mapOpts.sourcesContent !== 'undefined') {
      return this.mapOpts.sourcesContent
    }
    if (this.previous().length) {
      return this.previous().some(i => i.withContent())
    }
    return true
  }

  clearAnnotation () {
    if (this.mapOpts.annotation === false) return

    let node;
    for (let i = this.root.nodes.length - 1; i >= 0; i--) {
      node = this.root.nodes[i];
      if (node.type !== 'comment') continue
      if (node.text.indexOf('# sourceMappingURL=') === 0) {
        this.root.removeChild(i);
      }
    }
  }

  setSourcesContent () {
    let already = { };
    this.root.walk(node => {
      if (node.source) {
        let from = node.source.input.from;
        if (from && !already[from]) {
          already[from] = true;
          let relative = this.relative(from);
          this.map.setSourceContent(relative, node.source.input.css);
        }
      }
    });
  }

  applyPrevMaps () {
    for (let prev of this.previous()) {
      let from = this.relative(prev.file);
      let root = prev.root || path.dirname(prev.file);
      let map;

      if (this.mapOpts.sourcesContent === false) {
        map = new mozilla.SourceMapConsumer(prev.text);
        if (map.sourcesContent) {
          map.sourcesContent = map.sourcesContent.map(() => null);
        }
      } else {
        map = prev.consumer();
      }

      this.map.applySourceMap(map, from, this.relative(root));
    }
  }

  isAnnotation () {
    if (this.isInline()) {
      return true
    }
    if (typeof this.mapOpts.annotation !== 'undefined') {
      return this.mapOpts.annotation
    }
    if (this.previous().length) {
      return this.previous().some(i => i.annotation)
    }
    return true
  }

  toBase64 (str) {
    if (Buffer) {
      return Buffer.from(str).toString('base64')
    }
    return window.btoa(unescape(encodeURIComponent(str)))
  }

  addAnnotation () {
    let content;

    if (this.isInline()) {
      content = 'data:application/json;base64,' +
                this.toBase64(this.map.toString());
    } else if (typeof this.mapOpts.annotation === 'string') {
      content = this.mapOpts.annotation;
    } else {
      content = this.outputFile() + '.map';
    }

    let eol = '\n';
    if (this.css.indexOf('\r\n') !== -1) eol = '\r\n';

    this.css += eol + '/*# sourceMappingURL=' + content + ' */';
  }

  outputFile () {
    if (this.opts.to) {
      return this.relative(this.opts.to)
    }
    if (this.opts.from) {
      return this.relative(this.opts.from)
    }
    return 'to.css'
  }

  generateMap () {
    this.generateString();
    if (this.isSourcesContent()) this.setSourcesContent();
    if (this.previous().length > 0) this.applyPrevMaps();
    if (this.isAnnotation()) this.addAnnotation();

    if (this.isInline()) {
      return [this.css]
    }
    return [this.css, this.map]
  }

  relative (file) {
    if (file.indexOf('<') === 0) return file
    if (/^\w+:\/\//.test(file)) return file

    let from = this.opts.to ? path.dirname(this.opts.to) : '.';

    if (typeof this.mapOpts.annotation === 'string') {
      from = path.dirname(path.resolve(from, this.mapOpts.annotation));
    }

    file = path.relative(from, file);
    if (path.sep === '\\') {
      return file.replace(/\\/g, '/')
    }
    return file
  }

  sourcePath (node) {
    if (this.mapOpts.from) {
      return this.mapOpts.from
    }
    return this.relative(node.source.input.from)
  }

  generateString () {
    this.css = '';
    this.map = new mozilla.SourceMapGenerator({ file: this.outputFile() });

    let line = 1;
    let column = 1;

    let lines, last;
    this.stringify(this.root, (str, node, type) => {
      this.css += str;

      if (node && type !== 'end') {
        if (node.source && node.source.start) {
          this.map.addMapping({
            source: this.sourcePath(node),
            generated: { line, column: column - 1 },
            original: {
              line: node.source.start.line,
              column: node.source.start.column - 1
            }
          });
        } else {
          this.map.addMapping({
            source: '<no source>',
            original: { line: 1, column: 0 },
            generated: { line, column: column - 1 }
          });
        }
      }

      lines = str.match(/\n/g);
      if (lines) {
        line += lines.length;
        last = str.lastIndexOf('\n');
        column = str.length - last;
      } else {
        column += str.length;
      }

      if (node && type !== 'start') {
        let p = node.parent || { raws: { } };
        if (node.type !== 'decl' || node !== p.last || p.raws.semicolon) {
          if (node.source && node.source.end) {
            this.map.addMapping({
              source: this.sourcePath(node),
              generated: { line, column: column - 2 },
              original: {
                line: node.source.end.line,
                column: node.source.end.column - 1
              }
            });
          } else {
            this.map.addMapping({
              source: '<no source>',
              original: { line: 1, column: 0 },
              generated: { line, column: column - 1 }
            });
          }
        }
      }
    });
  }

  generate () {
    this.clearAnnotation();

    if (this.isMap()) {
      return this.generateMap()
    }

    let result = '';
    this.stringify(this.root, i => {
      result += i;
    });
    return [result]
  }
}

let printed = { };

function warnOnce (message) {
  if (printed[message]) return
  printed[message] = true;

  if (typeof console !== 'undefined' && console.warn) {
    console.warn(message);
  }
}

/**
 * Represents a plugin’s warning. It can be created using {@link Node#warn}.
 *
 * @example
 * if (decl.important) {
 *   decl.warn(result, 'Avoid !important', { word: '!important' })
 * }
 */
class Warning {
  /**
   * @param {string} text        Warning message.
   * @param {Object} [opts]      Warning options.
   * @param {Node}   opts.node   CSS node that caused the warning.
   * @param {string} opts.word   Word in CSS source that caused the warning.
   * @param {number} opts.index  Index in CSS node string that caused
   *                             the warning.
   * @param {string} opts.plugin Name of the plugin that created
   *                             this warning. {@link Result#warn} fills
   *                             this property automatically.
   */
  constructor (text, opts = { }) {
    /**
     * Type to filter warnings from {@link Result#messages}.
     * Always equal to `"warning"`.
     *
     * @type {string}
     *
     * @example
     * const nonWarning = result.messages.filter(i => i.type !== 'warning')
     */
    this.type = 'warning';
    /**
     * The warning message.
     *
     * @type {string}
     *
     * @example
     * warning.text //=> 'Try to avoid !important'
     */
    this.text = text;

    if (opts.node && opts.node.source) {
      let pos = opts.node.positionBy(opts);
      /**
       * Line in the input file with this warning’s source.
       * @type {number}
       *
       * @example
       * warning.line //=> 5
       */
      this.line = pos.line;
      /**
       * Column in the input file with this warning’s source.
       *
       * @type {number}
       *
       * @example
       * warning.column //=> 6
       */
      this.column = pos.column;
    }

    for (let opt in opts) this[opt] = opts[opt];
  }

  /**
   * Returns a warning position and message.
   *
   * @example
   * warning.toString() //=> 'postcss-lint:a.css:10:14: Avoid !important'
   *
   * @return {string} Warning position and message.
   */
  toString () {
    if (this.node) {
      return this.node.error(this.text, {
        plugin: this.plugin,
        index: this.index,
        word: this.word
      }).message
    }

    if (this.plugin) {
      return this.plugin + ': ' + this.text
    }

    return this.text
  }

  /**
   * @memberof Warning#
   * @member {string} plugin The name of the plugin that created
   *                         it will fill this property automatically.
   *                         this warning. When you call {@link Node#warn}
   *
   * @example
   * warning.plugin //=> 'postcss-important'
   */

  /**
   * @memberof Warning#
   * @member {Node} node Contains the CSS node that caused the warning.
   *
   * @example
   * warning.node.toString() //=> 'color: white !important'
   */
}

/**
 * Provides the result of the PostCSS transformations.
 *
 * A Result instance is returned by {@link LazyResult#then}
 * or {@link Root#toResult} methods.
 *
 * @example
 * postcss([autoprefixer]).process(css).then(result => {
 *  console.log(result.css)
 * })
 *
 * @example
 * const result2 = postcss.parse(css).toResult()
 */
class Result {
  /**
   * @param {Processor} processor Processor used for this transformation.
   * @param {Root}      root      Root node after all transformations.
   * @param {processOptions} opts Options from the {@link Processor#process}
   *                              or {@link Root#toResult}.
   */
  constructor (processor, root, opts) {
    /**
     * The Processor instance used for this transformation.
     *
     * @type {Processor}
     *
     * @example
     * for (const plugin of result.processor.plugins) {
     *   if (plugin.postcssPlugin === 'postcss-bad') {
     *     throw 'postcss-good is incompatible with postcss-bad'
     *   }
     * })
     */
    this.processor = processor;
    /**
     * Contains messages from plugins (e.g., warnings or custom messages).
     * Each message should have type and plugin properties.
     *
     * @type {Message[]}
     *
     * @example
     * postcss.plugin('postcss-min-browser', () => {
     *   return (root, result) => {
     *     const browsers = detectMinBrowsersByCanIUse(root)
     *     result.messages.push({
     *       type: 'min-browser',
     *       plugin: 'postcss-min-browser',
     *       browsers
     *     })
     *   }
     * })
     */
    this.messages = [];
    /**
     * Root node after all transformations.
     *
     * @type {Root}
     *
     * @example
     * root.toResult().root === root
     */
    this.root = root;
    /**
     * Options from the {@link Processor#process} or {@link Root#toResult} call
     * that produced this Result instance.
     *
     * @type {processOptions}
     *
     * @example
     * root.toResult(opts).opts === opts
     */
    this.opts = opts;
    /**
     * A CSS string representing of {@link Result#root}.
     *
     * @type {string}
     *
     * @example
     * postcss.parse('a{}').toResult().css //=> "a{}"
     */
    this.css = undefined;
    /**
     * An instance of `SourceMapGenerator` class from the `source-map` library,
     * representing changes to the {@link Result#root} instance.
     *
     * @type {SourceMapGenerator}
     *
     * @example
     * result.map.toJSON() //=> { version: 3, file: 'a.css', … }
     *
     * @example
     * if (result.map) {
     *   fs.writeFileSync(result.opts.to + '.map', result.map.toString())
     * }
     */
    this.map = undefined;
  }

  /**
   * Returns for @{link Result#css} content.
   *
   * @example
   * result + '' === result.css
   *
   * @return {string} String representing of {@link Result#root}.
   */
  toString () {
    return this.css
  }

  /**
   * Creates an instance of {@link Warning} and adds it
   * to {@link Result#messages}.
   *
   * @param {string} text        Warning message.
   * @param {Object} [opts]      Warning options.
   * @param {Node}   opts.node   CSS node that caused the warning.
   * @param {string} opts.word   Word in CSS source that caused the warning.
   * @param {number} opts.index  Index in CSS node string that caused
   *                             the warning.
   * @param {string} opts.plugin Name of the plugin that created
   *                             this warning. {@link Result#warn} fills
   *                             this property automatically.
   *
   * @return {Warning} Created warning.
   */
  warn (text, opts = { }) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }

    let warning = new Warning(text, opts);
    this.messages.push(warning);

    return warning
  }

  /**
     * Returns warnings from plugins. Filters {@link Warning} instances
     * from {@link Result#messages}.
     *
     * @example
     * result.warnings().forEach(warn => {
     *   console.warn(warn.toString())
     * })
     *
     * @return {Warning[]} Warnings from plugins.
     */
  warnings () {
    return this.messages.filter(i => i.type === 'warning')
  }

  /**
   * An alias for the {@link Result#css} property.
   * Use it with syntaxes that generate non-CSS output.
   *
   * @type {string}
   *
   * @example
   * result.css === result.content
   */
  get content () {
    return this.css
  }
}

/**
 * @typedef  {object} Message
 * @property {string} type   Message type.
 * @property {string} plugin Source PostCSS plugin name.
 */

/**
 * Represents a comment between declarations or statements (rule and at-rules).
 *
 * Comments inside selectors, at-rule parameters, or declaration values
 * will be stored in the `raws` properties explained above.
 *
 * @extends Node
 */
class Comment extends Node {
  constructor (defaults) {
    super(defaults);
    this.type = 'comment';
  }

  /**
   * @memberof Comment#
   * @member {string} text The comment’s text.
   */

  /**
   * @memberof Comment#
   * @member {object} raws Information to generate byte-to-byte equal
   *                       node string as it was in the origin input.
   *
   * Every parser saves its own properties,
   * but the default CSS parser uses:
   *
   * * `before`: the space symbols before the node.
   * * `left`: the space symbols between `/*` and the comment’s text.
   * * `right`: the space symbols between the comment’s text.
   */
}

function cleanSource (nodes) {
  return nodes.map(i => {
    if (i.nodes) i.nodes = cleanSource(i.nodes);
    delete i.source;
    return i
  })
}

/**
 * The {@link Root}, {@link AtRule}, and {@link Rule} container nodes
 * inherit some common methods to help work with their children.
 *
 * Note that all containers can store any content. If you write a rule inside
 * a rule, PostCSS will parse it.
 *
 * @extends Node
 * @abstract
 */
class Container extends Node {
  push (child) {
    child.parent = this;
    this.nodes.push(child);
    return this
  }

  /**
   * Iterates through the container’s immediate children,
   * calling `callback` for each child.
   *
   * Returning `false` in the callback will break iteration.
   *
   * This method only iterates through the container’s immediate children.
   * If you need to recursively iterate through all the container’s descendant
   * nodes, use {@link Container#walk}.
   *
   * Unlike the for `{}`-cycle or `Array#forEach` this iterator is safe
   * if you are mutating the array of child nodes during iteration.
   * PostCSS will adjust the current index to match the mutations.
   *
   * @param {childIterator} callback Iterator receives each node and index.
   *
   * @return {false|undefined} Returns `false` if iteration was broke.
   *
   * @example
   * const root = postcss.parse('a { color: black; z-index: 1 }')
   * const rule = root.first
   *
   * for (const decl of rule.nodes) {
   *   decl.cloneBefore({ prop: '-webkit-' + decl.prop })
   *   // Cycle will be infinite, because cloneBefore moves the current node
   *   // to the next index
   * }
   *
   * rule.each(decl => {
   *   decl.cloneBefore({ prop: '-webkit-' + decl.prop })
   *   // Will be executed only for color and z-index
   * })
   */
  each (callback) {
    if (!this.lastEach) this.lastEach = 0;
    if (!this.indexes) this.indexes = { };

    this.lastEach += 1;
    let id = this.lastEach;
    this.indexes[id] = 0;

    if (!this.nodes) return undefined

    let index, result;
    while (this.indexes[id] < this.nodes.length) {
      index = this.indexes[id];
      result = callback(this.nodes[index], index);
      if (result === false) break

      this.indexes[id] += 1;
    }

    delete this.indexes[id];

    return result
  }

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each node.
   *
   * Like container.each(), this method is safe to use
   * if you are mutating arrays during iteration.
   *
   * If you only need to iterate through the container’s immediate children,
   * use {@link Container#each}.
   *
   * @param {childIterator} callback Iterator receives each node and index.
   *
   * @return {false|undefined} Returns `false` if iteration was broke.
   *
   * @example
   * root.walk(node => {
   *   // Traverses all descendant nodes.
   * })
   */
  walk (callback) {
    return this.each((child, i) => {
      let result;
      try {
        result = callback(child, i);
      } catch (e) {
        e.postcssNode = child;
        if (e.stack && child.source && /\n\s{4}at /.test(e.stack)) {
          let s = child.source;
          e.stack = e.stack.replace(/\n\s{4}at /,
            `$&${ s.input.from }:${ s.start.line }:${ s.start.column }$&`);
        }
        throw e
      }
      if (result !== false && child.walk) {
        result = child.walk(callback);
      }
      return result
    })
  }

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each declaration node.
   *
   * If you pass a filter, iteration will only happen over declarations
   * with matching properties.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {string|RegExp} [prop]   String or regular expression
   *                                 to filter declarations by property name.
   * @param {childIterator} callback Iterator receives each node and index.
   *
   * @return {false|undefined} Returns `false` if iteration was broke.
   *
   * @example
   * root.walkDecls(decl => {
   *   checkPropertySupport(decl.prop)
   * })
   *
   * root.walkDecls('border-radius', decl => {
   *   decl.remove()
   * })
   *
   * root.walkDecls(/^background/, decl => {
   *   decl.value = takeFirstColorFromGradient(decl.value)
   * })
   */
  walkDecls (prop, callback) {
    if (!callback) {
      callback = prop;
      return this.walk((child, i) => {
        if (child.type === 'decl') {
          return callback(child, i)
        }
      })
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'decl' && prop.test(child.prop)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'decl' && child.prop === prop) {
        return callback(child, i)
      }
    })
  }

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each rule node.
   *
   * If you pass a filter, iteration will only happen over rules
   * with matching selectors.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {string|RegExp} [selector] String or regular expression
   *                                   to filter rules by selector.
   * @param {childIterator} callback   Iterator receives each node and index.
   *
   * @return {false|undefined} returns `false` if iteration was broke.
   *
   * @example
   * const selectors = []
   * root.walkRules(rule => {
   *   selectors.push(rule.selector)
   * })
   * console.log(`Your CSS uses ${ selectors.length } selectors`)
   */
  walkRules (selector, callback) {
    if (!callback) {
      callback = selector;

      return this.walk((child, i) => {
        if (child.type === 'rule') {
          return callback(child, i)
        }
      })
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'rule' && selector.test(child.selector)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'rule' && child.selector === selector) {
        return callback(child, i)
      }
    })
  }

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each at-rule node.
   *
   * If you pass a filter, iteration will only happen over at-rules
   * that have matching names.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {string|RegExp} [name]   String or regular expression
   *                                 to filter at-rules by name.
   * @param {childIterator} callback Iterator receives each node and index.
   *
   * @return {false|undefined} Returns `false` if iteration was broke.
   *
   * @example
   * root.walkAtRules(rule => {
   *   if (isOld(rule.name)) rule.remove()
   * })
   *
   * let first = false
   * root.walkAtRules('charset', rule => {
   *   if (!first) {
   *     first = true
   *   } else {
   *     rule.remove()
   *   }
   * })
   */
  walkAtRules (name, callback) {
    if (!callback) {
      callback = name;
      return this.walk((child, i) => {
        if (child.type === 'atrule') {
          return callback(child, i)
        }
      })
    }
    if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'atrule' && name.test(child.name)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'atrule' && child.name === name) {
        return callback(child, i)
      }
    })
  }

  /**
   * Traverses the container’s descendant nodes, calling callback
   * for each comment node.
   *
   * Like {@link Container#each}, this method is safe
   * to use if you are mutating arrays during iteration.
   *
   * @param {childIterator} callback Iterator receives each node and index.
   *
   * @return {false|undefined} Returns `false` if iteration was broke.
   *
   * @example
   * root.walkComments(comment => {
   *   comment.remove()
   * })
   */
  walkComments (callback) {
    return this.walk((child, i) => {
      if (child.type === 'comment') {
        return callback(child, i)
      }
    })
  }

  /**
   * Inserts new nodes to the end of the container.
   *
   * @param {...(Node|object|string|Node[])} children New nodes.
   *
   * @return {Node} This node for methods chain.
   *
   * @example
   * const decl1 = postcss.decl({ prop: 'color', value: 'black' })
   * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' })
   * rule.append(decl1, decl2)
   *
   * root.append({ name: 'charset', params: '"UTF-8"' })  // at-rule
   * root.append({ selector: 'a' })                       // rule
   * rule.append({ prop: 'color', value: 'black' })       // declaration
   * rule.append({ text: 'Comment' })                     // comment
   *
   * root.append('a {}')
   * root.first.append('color: black; z-index: 1')
   */
  append (...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last);
      for (let node of nodes) this.nodes.push(node);
    }
    return this
  }

  /**
   * Inserts new nodes to the start of the container.
   *
   * @param {...(Node|object|string|Node[])} children New nodes.
   *
   * @return {Node} This node for methods chain.
   *
   * @example
   * const decl1 = postcss.decl({ prop: 'color', value: 'black' })
   * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' })
   * rule.prepend(decl1, decl2)
   *
   * root.append({ name: 'charset', params: '"UTF-8"' })  // at-rule
   * root.append({ selector: 'a' })                       // rule
   * rule.append({ prop: 'color', value: 'black' })       // declaration
   * rule.append({ text: 'Comment' })                     // comment
   *
   * root.append('a {}')
   * root.first.append('color: black; z-index: 1')
   */
  prepend (...children) {
    children = children.reverse();
    for (let child of children) {
      let nodes = this.normalize(child, this.first, 'prepend').reverse();
      for (let node of nodes) this.nodes.unshift(node);
      for (let id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length;
      }
    }
    return this
  }

  cleanRaws (keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (let node of this.nodes) node.cleanRaws(keepBetween);
    }
  }

  /**
   * Insert new node before old node within the container.
   *
   * @param {Node|number} exist             Child or child’s index.
   * @param {Node|object|string|Node[]} add New node.
   *
   * @return {Node} This node for methods chain.
   *
   * @example
   * rule.insertBefore(decl, decl.clone({ prop: '-webkit-' + decl.prop }))
   */
  insertBefore (exist, add) {
    exist = this.index(exist);

    let type = exist === 0 ? 'prepend' : false;
    let nodes = this.normalize(add, this.nodes[exist], type).reverse();
    for (let node of nodes) this.nodes.splice(exist, 0, node);

    let index;
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (exist <= index) {
        this.indexes[id] = index + nodes.length;
      }
    }

    return this
  }

  /**
   * Insert new node after old node within the container.
   *
   * @param {Node|number} exist             Child or child’s index.
   * @param {Node|object|string|Node[]} add New node.
   *
   * @return {Node} This node for methods chain.
   */
  insertAfter (exist, add) {
    exist = this.index(exist);

    let nodes = this.normalize(add, this.nodes[exist]).reverse();
    for (let node of nodes) this.nodes.splice(exist + 1, 0, node);

    let index;
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (exist < index) {
        this.indexes[id] = index + nodes.length;
      }
    }

    return this
  }

  /**
   * Removes node from the container and cleans the parent properties
   * from the node and its children.
   *
   * @param {Node|number} child Child or child’s index.
   *
   * @return {Node} This node for methods chain
   *
   * @example
   * rule.nodes.length  //=> 5
   * rule.removeChild(decl)
   * rule.nodes.length  //=> 4
   * decl.parent        //=> undefined
   */
  removeChild (child) {
    child = this.index(child);
    this.nodes[child].parent = undefined;
    this.nodes.splice(child, 1);

    let index;
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (index >= child) {
        this.indexes[id] = index - 1;
      }
    }

    return this
  }

  /**
   * Removes all children from the container
   * and cleans their parent properties.
   *
   * @return {Node} This node for methods chain.
   *
   * @example
   * rule.removeAll()
   * rule.nodes.length //=> 0
   */
  removeAll () {
    for (let node of this.nodes) node.parent = undefined;
    this.nodes = [];
    return this
  }

  /**
   * Passes all declaration values within the container that match pattern
   * through callback, replacing those values with the returned result
   * of callback.
   *
   * This method is useful if you are using a custom unit or function
   * and need to iterate through all values.
   *
   * @param {string|RegExp} pattern      Replace pattern.
   * @param {object} opts                Options to speed up the search.
   * @param {string|string[]} opts.props An array of property names.
   * @param {string} opts.fast           String that’s used to narrow down
   *                                     values and speed up the regexp search.
   * @param {function|string} callback   String to replace pattern or callback
   *                                     that returns a new value. The callback
   *                                     will receive the same arguments
   *                                     as those passed to a function parameter
   *                                     of `String#replace`.
   *
   * @return {Node} This node for methods chain.
   *
   * @example
   * root.replaceValues(/\d+rem/, { fast: 'rem' }, string => {
   *   return 15 * parseInt(string) + 'px'
   * })
   */
  replaceValues (pattern, opts, callback) {
    if (!callback) {
      callback = opts;
      opts = { };
    }

    this.walkDecls(decl => {
      if (opts.props && opts.props.indexOf(decl.prop) === -1) return
      if (opts.fast && decl.value.indexOf(opts.fast) === -1) return

      decl.value = decl.value.replace(pattern, callback);
    });

    return this
  }

  /**
   * Returns `true` if callback returns `true`
   * for all of the container’s children.
   *
   * @param {childCondition} condition Iterator returns true or false.
   *
   * @return {boolean} Is every child pass condition.
   *
   * @example
   * const noPrefixes = rule.every(i => i.prop[0] !== '-')
   */
  every (condition) {
    return this.nodes.every(condition)
  }

  /**
   * Returns `true` if callback returns `true` for (at least) one
   * of the container’s children.
   *
   * @param {childCondition} condition Iterator returns true or false.
   *
   * @return {boolean} Is some child pass condition.
   *
   * @example
   * const hasPrefix = rule.some(i => i.prop[0] === '-')
   */
  some (condition) {
    return this.nodes.some(condition)
  }

  /**
   * Returns a `child`’s index within the {@link Container#nodes} array.
   *
   * @param {Node} child Child of the current container.
   *
   * @return {number} Child index.
   *
   * @example
   * rule.index( rule.nodes[2] ) //=> 2
   */
  index (child) {
    if (typeof child === 'number') {
      return child
    }
    return this.nodes.indexOf(child)
  }

  /**
   * The container’s first child.
   *
   * @type {Node}
   *
   * @example
   * rule.first === rules.nodes[0]
   */
  get first () {
    if (!this.nodes) return undefined
    return this.nodes[0]
  }

  /**
   * The container’s last child.
   *
   * @type {Node}
   *
   * @example
   * rule.last === rule.nodes[rule.nodes.length - 1]
   */
  get last () {
    if (!this.nodes) return undefined
    return this.nodes[this.nodes.length - 1]
  }

  normalize (nodes, sample) {
    if (typeof nodes === 'string') {
      let parse = require('./parse');
      nodes = cleanSource(parse(nodes).nodes);
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0);
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore');
      }
    } else if (nodes.type === 'root') {
      nodes = nodes.nodes.slice(0);
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore');
      }
    } else if (nodes.type) {
      nodes = [nodes];
    } else if (nodes.prop) {
      if (typeof nodes.value === 'undefined') {
        throw new Error('Value field is missed in node creation')
      } else if (typeof nodes.value !== 'string') {
        nodes.value = String(nodes.value);
      }
      nodes = [new Declaration(nodes)];
    } else if (nodes.selector) {
      let Rule = require('./rule');
      nodes = [new Rule(nodes)];
    } else if (nodes.name) {
      let AtRule = require('./at-rule');
      nodes = [new AtRule(nodes)];
    } else if (nodes.text) {
      nodes = [new Comment(nodes)];
    } else {
      throw new Error('Unknown node type in node creation')
    }

    let processed = nodes.map(i => {
      if (i.parent) i.parent.removeChild(i);
      if (typeof i.raws.before === 'undefined') {
        if (sample && typeof sample.raws.before !== 'undefined') {
          i.raws.before = sample.raws.before.replace(/[^\s]/g, '');
        }
      }
      i.parent = this;
      return i
    });

    return processed
  }

  /**
   * @memberof Container#
   * @member {Node[]} nodes An array containing the container’s children.
   *
   * @example
   * const root = postcss.parse('a { color: black }')
   * root.nodes.length           //=> 1
   * root.nodes[0].selector      //=> 'a'
   * root.nodes[0].nodes[0].prop //=> 'color'
   */
}

/**
 * @callback childCondition
 * @param {Node} node    Container child.
 * @param {number} index Child index.
 * @param {Node[]} nodes All container children.
 * @return {boolean}
 */

/**
 * @callback childIterator
 * @param {Node} node    Container child.
 * @param {number} index Child index.
 * @return {false|undefined} Returning `false` will break iteration.
 */

/**
 * Represents an at-rule.
 *
 * If it’s followed in the CSS by a {} block, this node will have
 * a nodes property representing its children.
 *
 * @extends Container
 *
 * @example
 * const root = postcss.parse('@charset "UTF-8"; @media print {}')
 *
 * const charset = root.first
 * charset.type  //=> 'atrule'
 * charset.nodes //=> undefined
 *
 * const media = root.last
 * media.nodes   //=> []
 */
class AtRule extends Container {
  constructor (defaults) {
    super(defaults);
    this.type = 'atrule';
  }

  append (...children) {
    if (!this.nodes) this.nodes = [];
    return super.append(...children)
  }

  prepend (...children) {
    if (!this.nodes) this.nodes = [];
    return super.prepend(...children)
  }

  /**
   * @memberof AtRule#
   * @member {string} name The at-rule’s name immediately follows the `@`.
   *
   * @example
   * const root  = postcss.parse('@media print {}')
   * media.name //=> 'media'
   * const media = root.first
   */

  /**
   * @memberof AtRule#
   * @member {string} params The at-rule’s parameters, the values
   *                         that follow the at-rule’s name but precede
   *                         any {} block.
   *
   * @example
   * const root  = postcss.parse('@media print, screen {}')
   * const media = root.first
   * media.params //=> 'print, screen'
   */

  /**
   * @memberof AtRule#
   * @member {object} raws Information to generate byte-to-byte equal
   *                        node string as it was in the origin input.
   *
   * Every parser saves its own properties,
   * but the default CSS parser uses:
   *
   * * `before`: the space symbols before the node. It also stores `*`
   *   and `_` symbols before the declaration (IE hack).
   * * `after`: the space symbols after the last child of the node
   *   to the end of the node.
   * * `between`: the symbols between the property and value
   *   for declarations, selector and `{` for rules, or last parameter
   *   and `{` for at-rules.
   * * `semicolon`: contains true if the last child has
   *   an (optional) semicolon.
   * * `afterName`: the space between the at-rule name and its parameters.
   *
   * PostCSS cleans at-rule parameters from comments and extra spaces,
   * but it stores origin content in raws properties.
   * As such, if you don’t change a declaration’s value,
   * PostCSS will use the raw value with comments.
   *
   * @example
   * const root = postcss.parse('  @media\nprint {\n}')
   * root.first.first.raws //=> { before: '  ',
   *                       //     between: ' ',
   *                       //     afterName: '\n',
   *                       //     after: '\n' }
   */
}

/**
 * Represents a CSS file and contains all its parsed nodes.
 *
 * @extends Container
 *
 * @example
 * const root = postcss.parse('a{color:black} b{z-index:2}')
 * root.type         //=> 'root'
 * root.nodes.length //=> 2
 */
class Root extends Container {
  constructor (defaults) {
    super(defaults);
    this.type = 'root';
    if (!this.nodes) this.nodes = [];
  }

  removeChild (child, ignore) {
    let index = this.index(child);

    if (!ignore && index === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index].raws.before;
    }

    return super.removeChild(child)
  }

  normalize (child, sample, type) {
    let nodes = super.normalize(child);

    if (sample) {
      if (type === 'prepend') {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before;
        } else {
          delete sample.raws.before;
        }
      } else if (this.first !== sample) {
        for (let node of nodes) {
          node.raws.before = sample.raws.before;
        }
      }
    }

    return nodes
  }

  /**
   * Returns a {@link Result} instance representing the root’s CSS.
   *
   * @param {processOptions} [opts] Options with only `to` and `map` keys.
   *
   * @return {Result} Result with current root’s CSS.
   *
   * @example
   * const root1 = postcss.parse(css1, { from: 'a.css' })
   * const root2 = postcss.parse(css2, { from: 'b.css' })
   * root1.append(root2)
   * const result = root1.toResult({ to: 'all.css', map: true })
   */
  toResult (opts = { }) {
    let LazyResult = require('./lazy-result');
    let Processor = require('./processor');

    let lazy = new LazyResult(new Processor(), this, opts);
    return lazy.stringify()
  }

  /**
   * @memberof Root#
   * @member {object} raws Information to generate byte-to-byte equal
   *                       node string as it was in the origin input.
   *
   * Every parser saves its own properties,
   * but the default CSS parser uses:
   *
   * * `after`: the space symbols after the last child to the end of file.
   * * `semicolon`: is the last child has an (optional) semicolon.
   *
   * @example
   * postcss.parse('a {}\n').raws //=> { after: '\n' }
   * postcss.parse('a {}').raws   //=> { after: '' }
   */
}

/**
 * Contains helpers for safely splitting lists of CSS values,
 * preserving parentheses and quotes.
 *
 * @example
 * const list = postcss.list
 *
 * @namespace list
 */
let list = {

  split (string, separators, last) {
    let array = [];
    let current = '';
    let split = false;

    let func = 0;
    let quote = false;
    let escape = false;

    for (let i = 0; i < string.length; i++) {
      let letter = string[i];

      if (quote) {
        if (escape) {
          escape = false;
        } else if (letter === '\\') {
          escape = true;
        } else if (letter === quote) {
          quote = false;
        }
      } else if (letter === '"' || letter === '\'') {
        quote = letter;
      } else if (letter === '(') {
        func += 1;
      } else if (letter === ')') {
        if (func > 0) func -= 1;
      } else if (func === 0) {
        if (separators.indexOf(letter) !== -1) split = true;
      }

      if (split) {
        if (current !== '') array.push(current.trim());
        current = '';
        split = false;
      } else {
        current += letter;
      }
    }

    if (last || current !== '') array.push(current.trim());
    return array
  },

  /**
   * Safely splits space-separated values (such as those for `background`,
   * `border-radius`, and other shorthand properties).
   *
   * @param {string} string Space-separated values.
   *
   * @return {string[]} Split values.
   *
   * @example
   * postcss.list.space('1px calc(10% + 1px)') //=> ['1px', 'calc(10% + 1px)']
   */
  space (string) {
    let spaces = [' ', '\n', '\t'];
    return list.split(string, spaces)
  },

  /**
   * Safely splits comma-separated values (such as those for `transition-*`
   * and `background` properties).
   *
   * @param {string} string Comma-separated values.
   *
   * @return {string[]} Split values.
   *
   * @example
   * postcss.list.comma('black, linear-gradient(white, black)')
   * //=> ['black', 'linear-gradient(white, black)']
   */
  comma (string) {
    return list.split(string, [','], true)
  }

};

/**
 * Represents a CSS rule: a selector followed by a declaration block.
 *
 * @extends Container
 *
 * @example
 * const root = postcss.parse('a{}')
 * const rule = root.first
 * rule.type       //=> 'rule'
 * rule.toString() //=> 'a{}'
 */
class Rule extends Container {
  constructor (defaults) {
    super(defaults);
    this.type = 'rule';
    if (!this.nodes) this.nodes = [];
  }

  /**
   * An array containing the rule’s individual selectors.
   * Groups of selectors are split at commas.
   *
   * @type {string[]}
   *
   * @example
   * const root = postcss.parse('a, b { }')
   * const rule = root.first
   *
   * rule.selector  //=> 'a, b'
   * rule.selectors //=> ['a', 'b']
   *
   * rule.selectors = ['a', 'strong']
   * rule.selector //=> 'a, strong'
   */
  get selectors () {
    return list.comma(this.selector)
  }

  set selectors (values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null;
    let sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen');
    this.selector = values.join(sep);
  }

  /**
   * @memberof Rule#
   * @member {string} selector The rule’s full selector represented
   *                           as a string.
   *
   * @example
   * const root = postcss.parse('a, b { }')
   * const rule = root.first
   * rule.selector //=> 'a, b'
   */

  /**
   * @memberof Rule#
   * @member {object} raws Information to generate byte-to-byte equal
   *                       node string as it was in the origin input.
   *
   * Every parser saves its own properties,
   * but the default CSS parser uses:
   *
   * * `before`: the space symbols before the node. It also stores `*`
   *   and `_` symbols before the declaration (IE hack).
   * * `after`: the space symbols after the last child of the node
   *   to the end of the node.
   * * `between`: the symbols between the property and value
   *   for declarations, selector and `{` for rules, or last parameter
   *   and `{` for at-rules.
   * * `semicolon`: contains `true` if the last child has
   *   an (optional) semicolon.
   * * `ownSemicolon`: contains `true` if there is semicolon after rule.
   *
   * PostCSS cleans selectors from comments and extra spaces,
   * but it stores origin content in raws properties.
   * As such, if you don’t change a declaration’s value,
   * PostCSS will use the raw value with comments.
   *
   * @example
   * const root = postcss.parse('a {\n  color:black\n}')
   * root.first.first.raws //=> { before: '', between: ' ', after: '\n' }
   */
}

class Parser {
  constructor (input) {
    this.input = input;

    this.root = new Root();
    this.current = this.root;
    this.spaces = '';
    this.semicolon = false;

    this.createTokenizer();
    this.root.source = { input, start: { line: 1, column: 1 } };
  }

  createTokenizer () {
    this.tokenizer = tokenizer(this.input);
  }

  parse () {
    let token;
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();

      switch (token[0]) {
        case 'space':
          this.spaces += token[1];
          break

        case ';':
          this.freeSemicolon(token);
          break

        case '}':
          this.end(token);
          break

        case 'comment':
          this.comment(token);
          break

        case 'at-word':
          this.atrule(token);
          break

        case '{':
          this.emptyRule(token);
          break

        default:
          this.other(token);
          break
      }
    }
    this.endFile();
  }

  comment (token) {
    let node = new Comment();
    this.init(node, token[2], token[3]);
    node.source.end = { line: token[4], column: token[5] };

    let text = token[1].slice(2, -2);
    if (/^\s*$/.test(text)) {
      node.text = '';
      node.raws.left = text;
      node.raws.right = '';
    } else {
      let match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
      node.text = match[2];
      node.raws.left = match[1];
      node.raws.right = match[3];
    }
  }

  emptyRule (token) {
    let node = new Rule();
    this.init(node, token[2], token[3]);
    node.selector = '';
    node.raws.between = '';
    this.current = node;
  }

  other (start) {
    let end = false;
    let type = null;
    let colon = false;
    let bracket = null;
    let brackets = [];

    let tokens = [];
    let token = start;
    while (token) {
      type = token[0];
      tokens.push(token);

      if (type === '(' || type === '[') {
        if (!bracket) bracket = token;
        brackets.push(type === '(' ? ')' : ']');
      } else if (brackets.length === 0) {
        if (type === ';') {
          if (colon) {
            this.decl(tokens);
            return
          } else {
            break
          }
        } else if (type === '{') {
          this.rule(tokens);
          return
        } else if (type === '}') {
          this.tokenizer.back(tokens.pop());
          end = true;
          break
        } else if (type === ':') {
          colon = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0) bracket = null;
      }

      token = this.tokenizer.nextToken();
    }

    if (this.tokenizer.endOfFile()) end = true;
    if (brackets.length > 0) this.unclosedBracket(bracket);

    if (end && colon) {
      while (tokens.length) {
        token = tokens[tokens.length - 1][0];
        if (token !== 'space' && token !== 'comment') break
        this.tokenizer.back(tokens.pop());
      }
      this.decl(tokens);
    } else {
      this.unknownWord(tokens);
    }
  }

  rule (tokens) {
    tokens.pop();

    let node = new Rule();
    this.init(node, tokens[0][2], tokens[0][3]);

    node.raws.between = this.spacesAndCommentsFromEnd(tokens);
    this.raw(node, 'selector', tokens);
    this.current = node;
  }

  decl (tokens) {
    let node = new Declaration();
    this.init(node);

    let last = tokens[tokens.length - 1];
    if (last[0] === ';') {
      this.semicolon = true;
      tokens.pop();
    }
    if (last[4]) {
      node.source.end = { line: last[4], column: last[5] };
    } else {
      node.source.end = { line: last[2], column: last[3] };
    }

    while (tokens[0][0] !== 'word') {
      if (tokens.length === 1) this.unknownWord(tokens);
      node.raws.before += tokens.shift()[1];
    }
    node.source.start = { line: tokens[0][2], column: tokens[0][3] };

    node.prop = '';
    while (tokens.length) {
      let type = tokens[0][0];
      if (type === ':' || type === 'space' || type === 'comment') {
        break
      }
      node.prop += tokens.shift()[1];
    }

    node.raws.between = '';

    let token;
    while (tokens.length) {
      token = tokens.shift();

      if (token[0] === ':') {
        node.raws.between += token[1];
        break
      } else {
        if (token[0] === 'word' && /\w/.test(token[1])) {
          this.unknownWord([token]);
        }
        node.raws.between += token[1];
      }
    }

    if (node.prop[0] === '_' || node.prop[0] === '*') {
      node.raws.before += node.prop[0];
      node.prop = node.prop.slice(1);
    }
    node.raws.between += this.spacesAndCommentsFromStart(tokens);
    this.precheckMissedSemicolon(tokens);

    for (let i = tokens.length - 1; i > 0; i--) {
      token = tokens[i];
      if (token[1].toLowerCase() === '!important') {
        node.important = true;
        let string = this.stringFrom(tokens, i);
        string = this.spacesFromEnd(tokens) + string;
        if (string !== ' !important') node.raws.important = string;
        break
      } else if (token[1].toLowerCase() === 'important') {
        let cache = tokens.slice(0);
        let str = '';
        for (let j = i; j > 0; j--) {
          let type = cache[j][0];
          if (str.trim().indexOf('!') === 0 && type !== 'space') {
            break
          }
          str = cache.pop()[1] + str;
        }
        if (str.trim().indexOf('!') === 0) {
          node.important = true;
          node.raws.important = str;
          tokens = cache;
        }
      }

      if (token[0] !== 'space' && token[0] !== 'comment') {
        break
      }
    }

    this.raw(node, 'value', tokens);

    if (node.value.indexOf(':') !== -1) this.checkMissedSemicolon(tokens);
  }

  atrule (token) {
    let node = new AtRule();
    node.name = token[1].slice(1);
    if (node.name === '') {
      this.unnamedAtrule(node, token);
    }
    this.init(node, token[2], token[3]);

    let prev;
    let shift;
    let last = false;
    let open = false;
    let params = [];

    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();

      if (token[0] === ';') {
        node.source.end = { line: token[2], column: token[3] };
        this.semicolon = true;
        break
      } else if (token[0] === '{') {
        open = true;
        break
      } else if (token[0] === '}') {
        if (params.length > 0) {
          shift = params.length - 1;
          prev = params[shift];
          while (prev && prev[0] === 'space') {
            prev = params[--shift];
          }
          if (prev) {
            node.source.end = { line: prev[4], column: prev[5] };
          }
        }
        this.end(token);
        break
      } else {
        params.push(token);
      }

      if (this.tokenizer.endOfFile()) {
        last = true;
        break
      }
    }

    node.raws.between = this.spacesAndCommentsFromEnd(params);
    if (params.length) {
      node.raws.afterName = this.spacesAndCommentsFromStart(params);
      this.raw(node, 'params', params);
      if (last) {
        token = params[params.length - 1];
        node.source.end = { line: token[4], column: token[5] };
        this.spaces = node.raws.between;
        node.raws.between = '';
      }
    } else {
      node.raws.afterName = '';
      node.params = '';
    }

    if (open) {
      node.nodes = [];
      this.current = node;
    }
  }

  end (token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.semicolon = false;

    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
    this.spaces = '';

    if (this.current.parent) {
      this.current.source.end = { line: token[2], column: token[3] };
      this.current = this.current.parent;
    } else {
      this.unexpectedClose(token);
    }
  }

  endFile () {
    if (this.current.parent) this.unclosedBlock();
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
  }

  freeSemicolon (token) {
    this.spaces += token[1];
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1];
      if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces;
        this.spaces = '';
      }
    }
  }

  // Helpers

  init (node, line, column) {
    this.current.push(node);

    node.source = { start: { line, column }, input: this.input };
    node.raws.before = this.spaces;
    this.spaces = '';
    if (node.type !== 'comment') this.semicolon = false;
  }

  raw (node, prop, tokens) {
    let token, type;
    let length = tokens.length;
    let value = '';
    let clean = true;
    let next, prev;
    let pattern = /^([.|#])?([\w])+/i;

    for (let i = 0; i < length; i += 1) {
      token = tokens[i];
      type = token[0];

      if (type === 'comment' && node.type === 'rule') {
        prev = tokens[i - 1];
        next = tokens[i + 1];

        if (
          prev[0] !== 'space' &&
          next[0] !== 'space' &&
          pattern.test(prev[1]) &&
          pattern.test(next[1])
        ) {
          value += token[1];
        } else {
          clean = false;
        }

        continue
      }

      if (type === 'comment' || (type === 'space' && i === length - 1)) {
        clean = false;
      } else {
        value += token[1];
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i) => all + i[1], '');
      node.raws[prop] = { value, raw };
    }
    node[prop] = value;
  }

  spacesAndCommentsFromEnd (tokens) {
    let lastTokenType;
    let spaces = '';
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== 'space' && lastTokenType !== 'comment') break
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces
  }

  spacesAndCommentsFromStart (tokens) {
    let next;
    let spaces = '';
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== 'space' && next !== 'comment') break
      spaces += tokens.shift()[1];
    }
    return spaces
  }

  spacesFromEnd (tokens) {
    let lastTokenType;
    let spaces = '';
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== 'space') break
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces
  }

  stringFrom (tokens, from) {
    let result = '';
    for (let i = from; i < tokens.length; i++) {
      result += tokens[i][1];
    }
    tokens.splice(from, tokens.length - from);
    return result
  }

  colon (tokens) {
    let brackets = 0;
    let token, type, prev;
    for (let i = 0; i < tokens.length; i++) {
      token = tokens[i];
      type = token[0];

      if (type === '(') {
        brackets += 1;
      }
      if (type === ')') {
        brackets -= 1;
      }
      if (brackets === 0 && type === ':') {
        if (!prev) {
          this.doubleColon(token);
        } else if (prev[0] === 'word' && prev[1] === 'progid') {
          continue
        } else {
          return i
        }
      }

      prev = token;
    }
    return false
  }

  // Errors

  unclosedBracket (bracket) {
    throw this.input.error('Unclosed bracket', bracket[2], bracket[3])
  }

  unknownWord (tokens) {
    throw this.input.error('Unknown word', tokens[0][2], tokens[0][3])
  }

  unexpectedClose (token) {
    throw this.input.error('Unexpected }', token[2], token[3])
  }

  unclosedBlock () {
    let pos = this.current.source.start;
    throw this.input.error('Unclosed block', pos.line, pos.column)
  }

  doubleColon (token) {
    throw this.input.error('Double colon', token[2], token[3])
  }

  unnamedAtrule (node, token) {
    throw this.input.error('At-rule without name', token[2], token[3])
  }

  precheckMissedSemicolon (/* tokens */) {
    // Hook for Safe Parser
  }

  checkMissedSemicolon (tokens) {
    let colon = this.colon(tokens);
    if (colon === false) return

    let founded = 0;
    let token;
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== 'space') {
        founded += 1;
        if (founded === 2) break
      }
    }
    throw this.input.error('Missed semicolon', token[2], token[3])
  }
}

function parse (css, opts) {
  let input = new Input(css, opts);
  let parser = new Parser(input);
  try {
    parser.parse();
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      if (e.name === 'CssSyntaxError' && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e.message += '\nYou tried to parse SCSS with ' +
                       'the standard CSS parser; ' +
                       'try again with the postcss-scss parser';
        } else if (/\.sass/i.test(opts.from)) {
          e.message += '\nYou tried to parse Sass with ' +
                       'the standard CSS parser; ' +
                       'try again with the postcss-sass parser';
        } else if (/\.less$/i.test(opts.from)) {
          e.message += '\nYou tried to parse Less with ' +
                       'the standard CSS parser; ' +
                       'try again with the postcss-less parser';
        }
      }
    }
    throw e
  }

  return parser.root
}

function isPromise (obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}

/**
 * A Promise proxy for the result of PostCSS transformations.
 *
 * A `LazyResult` instance is returned by {@link Processor#process}.
 *
 * @example
 * const lazy = postcss([autoprefixer]).process(css)
 */
class LazyResult {
  constructor (processor, css, opts) {
    this.stringified = false;
    this.processed = false;

    let root;
    if (typeof css === 'object' && css !== null && css.type === 'root') {
      root = css;
    } else if (css instanceof LazyResult || css instanceof Result) {
      root = css.root;
      if (css.map) {
        if (typeof opts.map === 'undefined') opts.map = { };
        if (!opts.map.inline) opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser = parse;
      if (opts.syntax) parser = opts.syntax.parse;
      if (opts.parser) parser = opts.parser;
      if (parser.parse) parser = parser.parse;

      try {
        root = parser(css, opts);
      } catch (error) {
        this.error = error;
      }
    }

    this.result = new Result(processor, root, opts);
  }

  /**
   * Returns a {@link Processor} instance, which will be used
   * for CSS transformations.
   *
   * @type {Processor}
   */
  get processor () {
    return this.result.processor
  }

  /**
   * Options from the {@link Processor#process} call.
   *
   * @type {processOptions}
   */
  get opts () {
    return this.result.opts
  }

  /**
   * Processes input CSS through synchronous plugins, converts `Root`
   * to a CSS string and returns {@link Result#css}.
   *
   * This property will only work with synchronous plugins.
   * If the processor contains any asynchronous plugins
   * it will throw an error. This is why this method is only
   * for debug purpose, you should always use {@link LazyResult#then}.
   *
   * @type {string}
   * @see Result#css
   */
  get css () {
    return this.stringify().css
  }

  /**
   * An alias for the `css` property. Use it with syntaxes
   * that generate non-CSS output.
   *
   * This property will only work with synchronous plugins.
   * If the processor contains any asynchronous plugins
   * it will throw an error. This is why this method is only
   * for debug purpose, you should always use {@link LazyResult#then}.
   *
   * @type {string}
   * @see Result#content
   */
  get content () {
    return this.stringify().content
  }

  /**
   * Processes input CSS through synchronous plugins
   * and returns {@link Result#map}.
   *
   * This property will only work with synchronous plugins.
   * If the processor contains any asynchronous plugins
   * it will throw an error. This is why this method is only
   * for debug purpose, you should always use {@link LazyResult#then}.
   *
   * @type {SourceMapGenerator}
   * @see Result#map
   */
  get map () {
    return this.stringify().map
  }

  /**
   * Processes input CSS through synchronous plugins
   * and returns {@link Result#root}.
   *
   * This property will only work with synchronous plugins. If the processor
   * contains any asynchronous plugins it will throw an error.
   *
   * This is why this method is only for debug purpose,
   * you should always use {@link LazyResult#then}.
   *
   * @type {Root}
   * @see Result#root
   */
  get root () {
    return this.sync().root
  }

  /**
   * Processes input CSS through synchronous plugins
   * and returns {@link Result#messages}.
   *
   * This property will only work with synchronous plugins. If the processor
   * contains any asynchronous plugins it will throw an error.
   *
   * This is why this method is only for debug purpose,
   * you should always use {@link LazyResult#then}.
   *
   * @type {Message[]}
   * @see Result#messages
   */
  get messages () {
    return this.sync().messages
  }

  /**
   * Processes input CSS through synchronous plugins
   * and calls {@link Result#warnings()}.
   *
   * @return {Warning[]} Warnings from plugins.
   */
  warnings () {
    return this.sync().warnings()
  }

  /**
   * Alias for the {@link LazyResult#css} property.
   *
   * @example
   * lazy + '' === lazy.css
   *
   * @return {string} Output CSS.
   */
  toString () {
    return this.css
  }

  /**
   * Processes input CSS through synchronous and asynchronous plugins
   * and calls `onFulfilled` with a Result instance. If a plugin throws
   * an error, the `onRejected` callback will be executed.
   *
   * It implements standard Promise API.
   *
   * @param {onFulfilled} onFulfilled Callback will be executed
   *                                  when all plugins will finish work.
   * @param {onRejected}  onRejected  Callback will be executed on any error.
   *
   * @return {Promise} Promise API to make queue.
   *
   * @example
   * postcss([autoprefixer]).process(css, { from: cssPath }).then(result => {
   *   console.log(result.css)
   * })
   */
  then (onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== 'production') {
      if (!('from' in this.opts)) {
        warnOnce(
          'Without `from` option PostCSS could generate wrong source map ' +
          'and will not find Browserslist config. Set it to CSS file path ' +
          'or to `undefined` to prevent this warning.'
        );
      }
    }
    return this.async().then(onFulfilled, onRejected)
  }

  /**
   * Processes input CSS through synchronous and asynchronous plugins
   * and calls onRejected for each error thrown in any plugin.
   *
   * It implements standard Promise API.
   *
   * @param {onRejected} onRejected Callback will be executed on any error.
   *
   * @return {Promise} Promise API to make queue.
   *
   * @example
   * postcss([autoprefixer]).process(css).then(result => {
   *   console.log(result.css)
   * }).catch(error => {
   *   console.error(error)
   * })
   */
  catch (onRejected) {
    return this.async().catch(onRejected)
  }
  /**
   * Processes input CSS through synchronous and asynchronous plugins
   * and calls onFinally on any error or when all plugins will finish work.
   *
   * It implements standard Promise API.
   *
   * @param {onFinally} onFinally Callback will be executed on any error or
   *                              when all plugins will finish work.
   *
   * @return {Promise} Promise API to make queue.
   *
   * @example
   * postcss([autoprefixer]).process(css).finally(() => {
   *   console.log('processing ended')
   * })
   */
  finally (onFinally) {
    return this.async().then(onFinally, onFinally)
  }

  handleError (error, plugin) {
    try {
      this.error = error;
      if (error.name === 'CssSyntaxError' && !error.plugin) {
        error.plugin = plugin.postcssPlugin;
        error.setMessage();
      } else if (plugin.postcssVersion) {
        if (process.env.NODE_ENV !== 'production') {
          let pluginName = plugin.postcssPlugin;
          let pluginVer = plugin.postcssVersion;
          let runtimeVer = this.result.processor.version;
          let a = pluginVer.split('.');
          let b = runtimeVer.split('.');

          if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
            console.error(
              'Unknown error from PostCSS plugin. Your current PostCSS ' +
              'version is ' + runtimeVer + ', but ' + pluginName + ' uses ' +
              pluginVer + '. Perhaps this is the source of the error below.'
            );
          }
        }
      }
    } catch (err) {
      if (console && console.error) console.error(err);
    }
  }

  asyncTick (resolve, reject) {
    if (this.plugin >= this.processor.plugins.length) {
      this.processed = true;
      return resolve()
    }

    try {
      let plugin = this.processor.plugins[this.plugin];
      let promise = this.run(plugin);
      this.plugin += 1;

      if (isPromise(promise)) {
        promise.then(() => {
          this.asyncTick(resolve, reject);
        }).catch(error => {
          this.handleError(error, plugin);
          this.processed = true;
          reject(error);
        });
      } else {
        this.asyncTick(resolve, reject);
      }
    } catch (error) {
      this.processed = true;
      reject(error);
    }
  }

  async () {
    if (this.processed) {
      return new Promise((resolve, reject) => {
        if (this.error) {
          reject(this.error);
        } else {
          resolve(this.stringify());
        }
      })
    }
    if (this.processing) {
      return this.processing
    }

    this.processing = new Promise((resolve, reject) => {
      if (this.error) return reject(this.error)
      this.plugin = 0;
      this.asyncTick(resolve, reject);
    }).then(() => {
      this.processed = true;
      return this.stringify()
    });

    return this.processing
  }

  sync () {
    if (this.processed) return this.result
    this.processed = true;

    if (this.processing) {
      throw new Error(
        'Use process(css).then(cb) to work with async plugins')
    }

    if (this.error) throw this.error

    for (let plugin of this.result.processor.plugins) {
      let promise = this.run(plugin);
      if (isPromise(promise)) {
        throw new Error(
          'Use process(css).then(cb) to work with async plugins')
      }
    }

    return this.result
  }

  run (plugin) {
    this.result.lastPlugin = plugin;

    try {
      return plugin(this.result.root, this.result)
    } catch (error) {
      this.handleError(error, plugin);
      throw error
    }
  }

  stringify () {
    if (this.stringified) return this.result
    this.stringified = true;

    this.sync();

    let opts = this.result.opts;
    let str = stringify;
    if (opts.syntax) str = opts.syntax.stringify;
    if (opts.stringifier) str = opts.stringifier;
    if (str.stringify) str = str.stringify;

    let map = new MapGenerator(str, this.result.root, this.result.opts);
    let data = map.generate();
    this.result.css = data[0];
    this.result.map = data[1];

    return this.result
  }
}

/**
 * @callback onFulfilled
 * @param {Result} result
 */

/**
 * @callback onRejected
 * @param {Error} error
 */

/**
 * Contains plugins to process CSS. Create one `Processor` instance,
 * initialize its plugins, and then use that instance on numerous CSS files.
 *
 * @example
 * const processor = postcss([autoprefixer, precss])
 * processor.process(css1).then(result => console.log(result.css))
 * processor.process(css2).then(result => console.log(result.css))
 */
class Processor {
  /**
   * @param {Array.<Plugin|pluginFunction>|Processor} plugins PostCSS plugins.
   *        See {@link Processor#use} for plugin format.
   */
  constructor (plugins = []) {
    /**
     * Current PostCSS version.
     *
     * @type {string}
     *
     * @example
     * if (result.processor.version.split('.')[0] !== '6') {
     *   throw new Error('This plugin works only with PostCSS 6')
     * }
     */
    this.version = '7.0.21';
    /**
     * Plugins added to this processor.
     *
     * @type {pluginFunction[]}
     *
     * @example
     * const processor = postcss([autoprefixer, precss])
     * processor.plugins.length //=> 2
     */
    this.plugins = this.normalize(plugins);
  }

  /**
   * Adds a plugin to be used as a CSS processor.
   *
   * PostCSS plugin can be in 4 formats:
   * * A plugin created by {@link postcss.plugin} method.
   * * A function. PostCSS will pass the function a @{link Root}
   *   as the first argument and current {@link Result} instance
   *   as the second.
   * * An object with a `postcss` method. PostCSS will use that method
   *   as described in #2.
   * * Another {@link Processor} instance. PostCSS will copy plugins
   *   from that instance into this one.
   *
   * Plugins can also be added by passing them as arguments when creating
   * a `postcss` instance (see [`postcss(plugins)`]).
   *
   * Asynchronous plugins should return a `Promise` instance.
   *
   * @param {Plugin|pluginFunction|Processor} plugin PostCSS plugin
   *                                                 or {@link Processor}
   *                                                 with plugins.
   *
   * @example
   * const processor = postcss()
   *   .use(autoprefixer)
   *   .use(precss)
   *
   * @return {Processes} Current processor to make methods chain.
   */
  use (plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]));
    return this
  }

  /**
   * Parses source CSS and returns a {@link LazyResult} Promise proxy.
   * Because some plugins can be asynchronous it doesn’t make
   * any transformations. Transformations will be applied
   * in the {@link LazyResult} methods.
   *
   * @param {string|toString|Result} css String with input CSS or any object
   *                                     with a `toString()` method,
   *                                     like a Buffer. Optionally, send
   *                                     a {@link Result} instance
   *                                     and the processor will take
   *                                     the {@link Root} from it.
   * @param {processOptions} [opts]      Options.
   *
   * @return {LazyResult} Promise proxy.
   *
   * @example
   * processor.process(css, { from: 'a.css', to: 'a.out.css' })
   *   .then(result => {
   *      console.log(result.css)
   *   })
   */
  process (css, opts = { }) {
    if (this.plugins.length === 0 && opts.parser === opts.stringifier) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn(
            'You did not set any plugins, parser, or stringifier. ' +
            'Right now, PostCSS does nothing. Pick plugins for your case ' +
            'on https://www.postcss.parts/ and use them in postcss.config.js.'
          );
        }
      }
    }
    return new LazyResult(this, css, opts)
  }

  normalize (plugins) {
    let normalized = [];
    for (let i of plugins) {
      if (i.postcss) i = i.postcss;

      if (typeof i === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins);
      } else if (typeof i === 'function') {
        normalized.push(i);
      } else if (typeof i === 'object' && (i.parse || i.stringify)) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            'PostCSS syntaxes cannot be used as plugins. Instead, please use ' +
            'one of the syntax/parser/stringifier options as outlined ' +
            'in your PostCSS runner documentation.'
          )
        }
      } else {
        throw new Error(i + ' is not a PostCSS plugin')
      }
    }
    return normalized
  }
}

/**
 * @callback builder
 * @param {string} part          Part of generated CSS connected to this node.
 * @param {Node}   node          AST node.
 * @param {"start"|"end"} [type] Node’s part type.
 */

/**
 * @callback parser
 *
 * @param {string|toString} css   String with input CSS or any object
 *                                with toString() method, like a Buffer.
 * @param {processOptions} [opts] Options with only `from` and `map` keys.
 *
 * @return {Root} PostCSS AST
 */

/**
 * @callback stringifier
 *
 * @param {Node} node       Start node for stringifing. Usually {@link Root}.
 * @param {builder} builder Function to concatenate CSS from node’s parts
 *                          or generate string and source map.
 *
 * @return {void}
 */

/**
 * @typedef {object} syntax
 * @property {parser} parse          Function to generate AST by string.
 * @property {stringifier} stringify Function to generate string by AST.
 */

/**
 * @typedef {object} toString
 * @property {function} toString
 */

/**
 * @callback pluginFunction
 * @param {Root} root     Parsed input CSS.
 * @param {Result} result Result to set warnings or check other plugins.
 */

/**
 * @typedef {object} Plugin
 * @property {function} postcss PostCSS plugin function.
 */

/**
 * @typedef {object} processOptions
 * @property {string} from             The path of the CSS source file.
 *                                     You should always set `from`,
 *                                     because it is used in source map
 *                                     generation and syntax error messages.
 * @property {string} to               The path where you’ll put the output
 *                                     CSS file. You should always set `to`
 *                                     to generate correct source maps.
 * @property {parser} parser           Function to generate AST by string.
 * @property {stringifier} stringifier Class to generate string by AST.
 * @property {syntax} syntax           Object with `parse` and `stringify`.
 * @property {object} map              Source map options.
 * @property {boolean} map.inline                    Does source map should
 *                                                   be embedded in the output
 *                                                   CSS as a base64-encoded
 *                                                   comment.
 * @property {string|object|false|function} map.prev Source map content
 *                                                   from a previous
 *                                                   processing step
 *                                                   (for example, Sass).
 *                                                   PostCSS will try to find
 *                                                   previous map automatically,
 *                                                   so you could disable it by
 *                                                   `false` value.
 * @property {boolean} map.sourcesContent            Does PostCSS should set
 *                                                   the origin content to map.
 * @property {string|false} map.annotation           Does PostCSS should set
 *                                                   annotation comment to map.
 * @property {string} map.from                       Override `from` in map’s
 *                                                   sources`.
 */

/**
 * Contains helpers for working with vendor prefixes.
 *
 * @example
 * const vendor = postcss.vendor
 *
 * @namespace vendor
 */
let vendor = {

  /**
   * Returns the vendor prefix extracted from an input string.
   *
   * @param {string} prop String with or without vendor prefix.
   *
   * @return {string} vendor prefix or empty string
   *
   * @example
   * postcss.vendor.prefix('-moz-tab-size') //=> '-moz-'
   * postcss.vendor.prefix('tab-size')      //=> ''
   */
  prefix (prop) {
    let match = prop.match(/^(-\w+-)/);
    if (match) {
      return match[0]
    }

    return ''
  },

  /**
     * Returns the input string stripped of its vendor prefix.
     *
     * @param {string} prop String with or without vendor prefix.
     *
     * @return {string} String name without vendor prefixes.
     *
     * @example
     * postcss.vendor.unprefixed('-moz-tab-size') //=> 'tab-size'
     */
  unprefixed (prop) {
    return prop.replace(/^-\w+-/, '')
  }

};

/**
 * Create a new {@link Processor} instance that will apply `plugins`
 * as CSS processors.
 *
 * @param {Array.<Plugin|pluginFunction>|Processor} plugins PostCSS plugins.
 *        See {@link Processor#use} for plugin format.
 *
 * @return {Processor} Processor to process multiple CSS.
 *
 * @example
 * import postcss from 'postcss'
 *
 * postcss(plugins).process(css, { from, to }).then(result => {
 *   console.log(result.css)
 * })
 *
 * @namespace postcss
 */
function postcss (...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor(plugins)
}

/**
 * Creates a PostCSS plugin with a standard API.
 *
 * The newly-wrapped function will provide both the name and PostCSS
 * version of the plugin.
 *
 * ```js
 * const processor = postcss([replace])
 * processor.plugins[0].postcssPlugin  //=> 'postcss-replace'
 * processor.plugins[0].postcssVersion //=> '6.0.0'
 * ```
 *
 * The plugin function receives 2 arguments: {@link Root}
 * and {@link Result} instance. The function should mutate the provided
 * `Root` node. Alternatively, you can create a new `Root` node
 * and override the `result.root` property.
 *
 * ```js
 * const cleaner = postcss.plugin('postcss-cleaner', () => {
 *   return (root, result) => {
 *     result.root = postcss.root()
 *   }
 * })
 * ```
 *
 * As a convenience, plugins also expose a `process` method so that you can use
 * them as standalone tools.
 *
 * ```js
 * cleaner.process(css, processOpts, pluginOpts)
 * // This is equivalent to:
 * postcss([ cleaner(pluginOpts) ]).process(css, processOpts)
 * ```
 *
 * Asynchronous plugins should return a `Promise` instance.
 *
 * ```js
 * postcss.plugin('postcss-import', () => {
 *   return (root, result) => {
 *     return new Promise( (resolve, reject) => {
 *       fs.readFile('base.css', (base) => {
 *         root.prepend(base)
 *         resolve()
 *       })
 *     })
 *   }
 * })
 * ```
 *
 * Add warnings using the {@link Node#warn} method.
 * Send data to other plugins using the {@link Result#messages} array.
 *
 * ```js
 * postcss.plugin('postcss-caniuse-test', () => {
 *   return (root, result) => {
 *     root.walkDecls(decl => {
 *       if (!caniuse.support(decl.prop)) {
 *         decl.warn(result, 'Some browsers do not support ' + decl.prop)
 *       }
 *     })
 *   }
 * })
 * ```
 *
 * @param {string} name          PostCSS plugin name. Same as in `name`
 *                               property in `package.json`. It will be saved
 *                               in `plugin.postcssPlugin` property.
 * @param {function} initializer Will receive plugin options
 *                               and should return {@link pluginFunction}
 *
 * @return {Plugin} PostCSS plugin.
 */
postcss.plugin = function plugin (name, initializer) {
  function creator (...args) {
    let transformer = initializer(...args);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = (new Processor()).version;
    return transformer
  }

  let cache;
  Object.defineProperty(creator, 'postcss', {
    get () {
      if (!cache) cache = creator();
      return cache
    }
  });

  creator.process = function (css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts)
  };

  return creator
};

/**
 * Default function to convert a node tree into a CSS string.
 *
 * @param {Node} node       Start node for stringifing. Usually {@link Root}.
 * @param {builder} builder Function to concatenate CSS from node’s parts
 *                          or generate string and source map.
 *
 * @return {void}
 *
 * @function
 */
postcss.stringify = stringify;

/**
 * Parses source css and returns a new {@link Root} node,
 * which contains the source CSS nodes.
 *
 * @param {string|toString} css   String with input CSS or any object
 *                                with toString() method, like a Buffer
 * @param {processOptions} [opts] Options with only `from` and `map` keys.
 *
 * @return {Root} PostCSS AST.
 *
 * @example
 * // Simple CSS concatenation with source map support
 * const root1 = postcss.parse(css1, { from: file1 })
 * const root2 = postcss.parse(css2, { from: file2 })
 * root1.append(root2).toResult().css
 *
 * @function
 */
postcss.parse = parse;

/**
 * Contains the {@link vendor} module.
 *
 * @type {vendor}
 *
 * @example
 * postcss.vendor.unprefixed('-moz-tab') //=> ['tab']
 */
postcss.vendor = vendor;

/**
 * Contains the {@link list} module.
 *
 * @member {list}
 *
 * @example
 * postcss.list.space('5px calc(10% + 5px)') //=> ['5px', 'calc(10% + 5px)']
 */
postcss.list = list;

/**
 * Creates a new {@link Comment} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Comment} New comment node
 *
 * @example
 * postcss.comment({ text: 'test' })
 */
postcss.comment = defaults => new Comment(defaults);

/**
 * Creates a new {@link AtRule} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {AtRule} new at-rule node
 *
 * @example
 * postcss.atRule({ name: 'charset' }).toString() //=> "@charset"
 */
postcss.atRule = defaults => new AtRule(defaults);

/**
 * Creates a new {@link Declaration} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Declaration} new declaration node
 *
 * @example
 * postcss.decl({ prop: 'color', value: 'red' }).toString() //=> "color: red"
 */
postcss.decl = defaults => new Declaration(defaults);

/**
 * Creates a new {@link Rule} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Rule} new rule node
 *
 * @example
 * postcss.rule({ selector: 'a' }).toString() //=> "a {\n}"
 */
postcss.rule = defaults => new Rule(defaults);

/**
 * Creates a new {@link Root} node.
 *
 * @param {object} [defaults] Properties for the new node.
 *
 * @return {Root} new root node.
 *
 * @example
 * postcss.root({ after: '\n' }).toString() //=> "\n"
 */
postcss.root = defaults => new Root(defaults);

export default postcss;
