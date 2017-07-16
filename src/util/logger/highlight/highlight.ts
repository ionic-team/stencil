/**
 * Ported from highlight.js
 * Syntax highlighting with language autodetection.
 * https://highlightjs.org/
 * Copyright (c) 2006, Ivan Sagalaev
 * https://github.com/isagalaev/highlight.js/blob/master/LICENSE
 */

var hljs: any = {};
// Convenience variables for build-in objects
var objectKeys: any = Object.keys;

// Global internal variables used within the highlight.js library.
var languages: any = {},
    aliases: any   = {};

var spanEndTag = '</span>';

// Global options used when within external APIs. This is modified when
// calling the `hljs.configure` function.
var options: any = {
  classPrefix: 'hljs-',
  tabReplace: null,
  useBR: false,
  languages: undefined
};

// Object map that is used to escape some common HTML characters.
var escapeRegexMap: any = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

/* Utility functions */

function escape(value: string) {
  return value.replace(/[&<>]/gm, function(character: any) {
    return escapeRegexMap[character];
  });
}

function testRe(re: any, lexeme: any) {
  var match = re && re.exec(lexeme);
  return match && match.index === 0;
}

function inherit(parent: any, obj: any) {
  var key: any;
  var result: any = {};

  for (key in parent)
    result[key] = parent[key];
  if (obj)
    for (key in obj)
      result[key] = obj[key];
  return result;
}

/* Initialization */

function compileLanguage(language: any) {

  function reStr(re: any) {
      return (re && re.source) || re;
  }

  function langRe(value: any, global?: any) {
    return new RegExp(
      reStr(value),
      'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
    );
  }

  function compileMode(mode: any, parent?: any): any {
    if (mode.compiled)
      return;
    mode.compiled = true;

    mode.keywords = mode.keywords || mode.beginKeywords;
    if (mode.keywords) {
      var compiled_keywords: any = {};

      var flatten = function(className: any, str: any) {
        if (language.case_insensitive) {
          str = str.toLowerCase();
        }
        str.split(' ').forEach(function(kw: any) {
          var pair = kw.split('|');
          compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
        });
      };

      if (typeof mode.keywords === 'string') { // string
        flatten('keyword', mode.keywords);
      } else {
        objectKeys(mode.keywords).forEach(function (className: any) {
          flatten(className, mode.keywords[className]);
        });
      }
      mode.keywords = compiled_keywords;
    }
    mode.lexemesRe = langRe(mode.lexemes || /\w+/, true);

    if (parent) {
      if (mode.beginKeywords) {
        mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
      }
      if (!mode.begin)
        mode.begin = /\B|\b/;
      mode.beginRe = langRe(mode.begin);
      if (!mode.end && !mode.endsWithParent)
        mode.end = /\B|\b/;
      if (mode.end)
        mode.endRe = langRe(mode.end);
      mode.terminator_end = reStr(mode.end) || '';
      if (mode.endsWithParent && parent.terminator_end)
        mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
    }
    if (mode.illegal)
      mode.illegalRe = langRe(mode.illegal);
    if (mode.relevance == null)
      mode.relevance = 1;
    if (!mode.contains) {
      mode.contains = [];
    }
    var expanded_contains: any = [];
    mode.contains.forEach(function(c: any) {
      if (c.variants) {
        c.variants.forEach(function(v: any) {expanded_contains.push(inherit(c, v)); });
      } else {
        expanded_contains.push(c === 'self' ? mode : c);
      }
    });
    mode.contains = expanded_contains;
    mode.contains.forEach(function(c: any) {compileMode(c, mode); });

    if (mode.starts) {
      compileMode(mode.starts, parent);
    }

    var terminators =
      mode.contains.map(function(c: any) {
        return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
      })
      .concat([mode.terminator_end, mode.illegal])
      .map(reStr)
      .filter(Boolean);
    mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(/*s*/): any {return null; }};
  }

  compileMode(language);
}


export function highlightError(htmlInput: string, errorCharStart: number, errorLength: number) {
  if (errorCharStart < 0 || errorLength < 1 || !htmlInput) return htmlInput;

  const chars = htmlInput.split('');
  let inTag = false;
  let textIndex = -1;
  for (var htmlIndex = 0; htmlIndex < chars.length; htmlIndex++) {
    if (chars[htmlIndex] === '<') {
      inTag = true;
      continue;

    } else if (chars[htmlIndex] === '>') {
      inTag = false;
      continue;

    } else if (inTag) {
      continue;

    } else if (chars[htmlIndex] === '&') {

      var isValidEscape = true;
      var escapeChars = '&';
      for (var i = htmlIndex + 1; i < chars.length; i++) {
        if (!chars[i] || chars[i] === ' ') {
          isValidEscape = false;
          break;
        } else if (chars[i] === ';') {
          escapeChars += ';';
          break;
        } else {
          escapeChars += chars[i];
        }
      }
      isValidEscape = (isValidEscape && escapeChars.length > 1 && escapeChars.length < 9 && escapeChars[escapeChars.length - 1] === ';');

      if (isValidEscape) {
        chars[htmlIndex] = escapeChars;
        for (let i = 0; i < escapeChars.length - 1; i++) {
          chars.splice(htmlIndex + 1, 1);
        }
      }
    }

    textIndex++;

    if (textIndex < errorCharStart || textIndex >= errorCharStart + errorLength) {
      continue;
    }

    chars[htmlIndex] = `<span class="ion-diagnostics-error-chr">${chars[htmlIndex]}</span>`;
  }

  return chars.join('');
}

/*
Core highlighting function. Accepts a language name, or an alias, and a
string with the code to highlight. Returns an object with the following
properties:

- relevance (int)
- value (an HTML string with highlighting markup)

*/
export function highlight(name: string, value: string, ignore_illegals?: boolean, continuation?: any): {value: string, relevance: number, language?: string, top?: any} {

  function subMode(lexeme: any, mode: any) {
    var i: any, length: any;

    for (i = 0, length = mode.contains.length; i < length; i++) {
      if (testRe(mode.contains[i].beginRe, lexeme)) {
        return mode.contains[i];
      }
    }
  }

  function endOfMode(mode: any, lexeme: any): any {
    if (testRe(mode.endRe, lexeme)) {
      while (mode.endsParent && mode.parent) {
        mode = mode.parent;
      }
      return mode;
    }
    if (mode.endsWithParent) {
      return endOfMode(mode.parent, lexeme);
    }
  }

  function isIllegal(lexeme: any, mode: any) {
    return !ignore_illegals && testRe(mode.illegalRe, lexeme);
  }

  function keywordMatch(mode: any, match: any) {
    var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
    return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
  }

  function buildSpan(classname: any, insideSpan: any, leaveOpen?: any, noPrefix?: any): any {
    var classPrefix = noPrefix ? '' : options.classPrefix,
        openSpan    = '<span class="' + classPrefix,
        closeSpan   = leaveOpen ? '' : spanEndTag;

    openSpan += classname + '">';

    return openSpan + insideSpan + closeSpan;
  }

  function processKeywords() {
    var keyword_match: any, last_index: any, match: any, result: any;

    if (!top.keywords)
      return escape(mode_buffer);

    result = '';
    last_index = 0;
    top.lexemesRe.lastIndex = 0;
    match = top.lexemesRe.exec(mode_buffer);

    while (match) {
      result += escape(mode_buffer.substr(last_index, match.index - last_index));
      keyword_match = keywordMatch(top, match);
      if (keyword_match) {
        relevance += keyword_match[1];
        result += buildSpan(keyword_match[0], escape(match[0]));
      } else {
        result += escape(match[0]);
      }
      last_index = top.lexemesRe.lastIndex;
      match = top.lexemesRe.exec(mode_buffer);
    }
    return result + escape(mode_buffer.substr(last_index));
  }

  function processSubLanguage() {
    var explicit = typeof top.subLanguage === 'string';
    if (explicit && !languages[top.subLanguage]) {
      return escape(mode_buffer);
    }

    var result = explicit ?
                  highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) :
                  highlightAuto(mode_buffer, top.subLanguage.length ? top.subLanguage : undefined);

    // Counting embedded language score towards the host language may be disabled
    // with zeroing the containing mode relevance. Usecase in point is Markdown that
    // allows XML everywhere and makes every XML snippet to have a much larger Markdown
    // score.
    if (top.relevance > 0) {
      relevance += result.relevance;
    }
    if (explicit) {
      continuations[top.subLanguage] = result.top;
    }
    return buildSpan(result.language, result.value, false, true);
  }

  function processBuffer() {
    result += (top.subLanguage != null ? processSubLanguage() : processKeywords());
    mode_buffer = '';
  }

  function startNewMode(mode: any) {
    result += mode.className ? buildSpan(mode.className, '', true) : '';
    top = Object.create(mode, {parent: {value: top}});
  }

  function processLexeme(buffer: any, lexeme?: any): any {

    mode_buffer += buffer;

    if (lexeme == null) {
      processBuffer();
      return 0;
    }

    var new_mode = subMode(lexeme, top);
    if (new_mode) {
      if (new_mode.skip) {
        mode_buffer += lexeme;
      } else {
        if (new_mode.excludeBegin) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (!new_mode.returnBegin && !new_mode.excludeBegin) {
          mode_buffer = lexeme;
        }
      }
      startNewMode(new_mode);
      return new_mode.returnBegin ? 0 : lexeme.length;
    }

    var end_mode = endOfMode(top, lexeme);
    if (end_mode) {
      var origin = top;
      if (origin.skip) {
        mode_buffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          mode_buffer = lexeme;
        }
      }
      do {
        if (top.className) {
          result += spanEndTag;
        }
        if (!top.skip) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== end_mode.parent);
      if (end_mode.starts) {
        startNewMode(end_mode.starts);
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    if (isIllegal(lexeme, top))
      throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

    /*
    Parser should not reach this point as all types of lexemes should be caught
    earlier, but if it does due to some bug make sure it advances at least one
    character forward to prevent infinite looping.
    */
    mode_buffer += lexeme;
    return lexeme.length || 1;
  }

  var language = getLanguage(name);
  if (!language) {
    throw new Error('Unknown language: "' + name + '"');
  }

  compileLanguage(language);
  var top: any = continuation || language;
  var continuations: any = {}; // keep continuations for sub-languages
  var result = '', current: any;
  for (current = top; current !== language; current = current.parent) {
    if (current.className) {
      result = buildSpan(current.className, '', true) + result;
    }
  }
  var mode_buffer = '';
  var relevance = 0;
  try {
    var match: any, count: any, index = 0;
    while (true) {
      top.terminators.lastIndex = index;
      match = top.terminators.exec(value);
      if (!match)
        break;
      count = processLexeme(value.substr(index, match.index - index), match[0]);
      index = match.index + count;
    }
    processLexeme(value.substr(index));
    for (current = top; current.parent; current = current.parent) { // close dangling modes
      if (current.className) {
        result += spanEndTag;
      }
    }
    return {
      relevance: relevance,
      value: result,
      language: name,
      top: top
    };
  } catch (e) {
    if (e.message && e.message.indexOf('Illegal') !== -1) {
      return {
        relevance: 0,
        value: escape(value)
      };
    } else {
      throw e;
    }
  }
}

/*
Highlighting with language detection. Accepts a string with the code to
highlight. Returns an object with the following properties:

- language (detected language)
- relevance (int)
- value (an HTML string with highlighting markup)
- second_best (object with the same structure for second-best heuristically
  detected language, may be absent)

*/
function highlightAuto(text: any, languageSubset?: any) {
  languageSubset = languageSubset || options.languages || objectKeys(languages);
  var result: any = {
    relevance: 0,
    value: escape(text)
  };
  var second_best = result;
  languageSubset.filter(getLanguage).forEach(function(name: any) {
    var current = highlight(name, text, false);
    current.language = name;
    if (current.relevance > second_best.relevance) {
      second_best = current;
    }
    if (current.relevance > result.relevance) {
      second_best = result;
      result = current;
    }
  });
  if (second_best.language) {
    result.second_best = second_best;
  }
  return result;
}

/*
Updates highlight.js global options with values passed in the form of an object.
*/
function configure(user_options: any) {
  options = inherit(options, user_options);
}

function registerLanguage(name: any, language: any) {
  var lang = languages[name] = language(hljs);
  if (lang.aliases) {
    lang.aliases.forEach(function(alias: any) {aliases[alias] = name; });
  }
}

function listLanguages() {
  return objectKeys(languages);
}

function getLanguage(name: any) {
  name = (name || '').toLowerCase();
  return languages[name] || languages[aliases[name]];
}

/* Interface definition */

hljs.highlight = highlight;
hljs.highlightAuto = highlightAuto;
hljs.configure = configure;
hljs.registerLanguage = registerLanguage;
hljs.listLanguages = listLanguages;
hljs.getLanguage = getLanguage;
hljs.inherit = inherit;

// Common regexps
hljs.IDENT_RE = '[a-zA-Z]\\w*';
hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
hljs.C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

// Common modes
hljs.BACKSLASH_ESCAPE = {
  begin: '\\\\[\\s\\S]', relevance: 0
};
hljs.APOS_STRING_MODE = {
  className: 'string',
  begin: '\'', end: '\'',
  illegal: '\\n',
  contains: [hljs.BACKSLASH_ESCAPE]
};
hljs.QUOTE_STRING_MODE = {
  className: 'string',
  begin: '"', end: '"',
  illegal: '\\n',
  contains: [hljs.BACKSLASH_ESCAPE]
};
hljs.PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/
};
hljs.COMMENT = function (begin: any, end: any, inherits: any) {
  var mode = hljs.inherit(
    {
      className: 'comment',
      begin: begin, end: end,
      contains: []
    },
    inherits || {}
  );
  mode.contains.push(hljs.PHRASAL_WORDS_MODE);
  mode.contains.push({
    className: 'doctag',
    begin: '(?:TODO|FIXME|NOTE|BUG|XXX):',
    relevance: 0
  });
  return mode;
};
hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
hljs.NUMBER_MODE = {
  className: 'number',
  begin: hljs.NUMBER_RE,
  relevance: 0
};
hljs.C_NUMBER_MODE = {
  className: 'number',
  begin: hljs.C_NUMBER_RE,
  relevance: 0
};
hljs.BINARY_NUMBER_MODE = {
  className: 'number',
  begin: hljs.BINARY_NUMBER_RE,
  relevance: 0
};
hljs.CSS_NUMBER_MODE = {
  className: 'number',
  begin: hljs.NUMBER_RE + '(' +
    '%|em|ex|ch|rem'  +
    '|vw|vh|vmin|vmax' +
    '|cm|mm|in|pt|pc|px' +
    '|deg|grad|rad|turn' +
    '|s|ms' +
    '|Hz|kHz' +
    '|dpi|dpcm|dppx' +
    ')?',
  relevance: 0
};
hljs.REGEXP_MODE = {
  className: 'regexp',
  begin: /\//, end: /\/[gimuy]*/,
  illegal: /\n/,
  contains: [
    hljs.BACKSLASH_ESCAPE,
    {
      begin: /\[/, end: /\]/,
      relevance: 0,
      contains: [hljs.BACKSLASH_ESCAPE]
    }
  ]
};
hljs.TITLE_MODE = {
  className: 'title',
  begin: hljs.IDENT_RE,
  relevance: 0
};
hljs.UNDERSCORE_TITLE_MODE = {
  className: 'title',
  begin: hljs.UNDERSCORE_IDENT_RE,
  relevance: 0
};
hljs.METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: '\\.\\s*' + hljs.UNDERSCORE_IDENT_RE,
  relevance: 0
};

hljs.registerLanguage('typescript', typescript);

function typescript(hljs: any) {
  var KEYWORDS = {
    keyword:
      'in if for while finally var new function do return void else break catch ' +
      'instanceof with throw case default try this switch continue typeof delete ' +
      'let yield const class public private protected get set super ' +
      'static implements enum export import declare type namespace abstract',
    literal:
      'true false null undefined NaN Infinity',
    built_in:
      'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
      'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
      'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
      'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
      'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
      'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
      'module console window document any number boolean string void'
  };

  return {
    aliases: ['ts'],
    keywords: KEYWORDS,
    contains: [
      {
        className: 'meta',
        begin: /^\s*['"]use strict['"]/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      { // template string
        className: 'string',
        begin: '`', end: '`',
        contains: [
          hljs.BACKSLASH_ESCAPE,
          {
            className: 'subst',
            begin: '\\$\\{', end: '\\}'
          }
        ]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'number',
        variants: [
          { begin: '\\b(0[bB][01]+)' },
          { begin: '\\b(0[oO][0-7]+)' },
          { begin: hljs.C_NUMBER_RE }
        ],
        relevance: 0
      },
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE
        ],
        relevance: 0
      },
      {
        className: 'function',
        begin: 'function', end: /[\{;]/, excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          'self',
          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            excludeBegin: true,
            excludeEnd: true,
            keywords: KEYWORDS,
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ],
            illegal: /["'\(]/
          }
        ],
        illegal: /%/,
        relevance: 0 // () => {} is more typical in TypeScript
      },
      {
        beginKeywords: 'constructor', end: /\{/, excludeEnd: true
      },
      { // prevent references like module.id from being higlighted as module definitions
        begin: /module\./,
        keywords: {built_in: 'module'},
        relevance: 0
      },
      {
        beginKeywords: 'module', end: /\{/, excludeEnd: true
      },
      {
        beginKeywords: 'interface', end: /\{/, excludeEnd: true,
        keywords: 'interface extends'
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      {
        begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
      }
    ]
  };
}


hljs.registerLanguage('scss', scss);

function scss(hljs: any) {
  var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
  var VARIABLE = {
    className: 'variable',
    begin: '(\\$' + IDENT_RE + ')\\b'
  };
  var HEXCOLOR = {
    className: 'number', begin: '#[0-9A-Fa-f]+'
  };
  // var DEF_INTERNALS = {
  //   className: 'attribute',
  //   begin: '[A-Z\\_\\.\\-]+', end: ':',
  //   excludeEnd: true,
  //   illegal: '[^\\s]',
  //   starts: {
  //     endsWithParent: true, excludeEnd: true,
  //     contains: [
  //       HEXCOLOR,
  //       hljs.CSS_NUMBER_MODE,
  //       hljs.QUOTE_STRING_MODE,
  //       hljs.APOS_STRING_MODE,
  //       hljs.C_BLOCK_COMMENT_MODE,
  //       {
  //         className: 'meta', begin: '!important'
  //       }
  //     ]
  //   }
  // };
  return {
    case_insensitive: true,
    illegal: '[=/|\']',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'selector-id', begin: '\\#[A-Za-z0-9_-]+',
        relevance: 0
      },
      {
        className: 'selector-class', begin: '\\.[A-Za-z0-9_-]+',
        relevance: 0
      },
      {
        className: 'selector-attr', begin: '\\[', end: '\\]',
        illegal: '$'
      },
      {
        className: 'selector-tag', // begin: IDENT_RE, end: '[,|\\s]'
        begin: '\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b',
        relevance: 0
      },
      {
        begin: ':(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)'
      },
      {
        begin: '::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)'
      },
      VARIABLE,
      {
        className: 'attribute',
        begin: '\\b(z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b',
        illegal: '[^\\s]'
      },
      {
        begin: '\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b'
      },
      {
        begin: ':', end: ';',
        contains: [
          VARIABLE,
          HEXCOLOR,
          hljs.CSS_NUMBER_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          {
            className: 'meta', begin: '!important'
          }
        ]
      },
      {
        begin: '@', end: '[{;]',
        keywords: 'mixin include extend for if else each while charset import debug media page content font-face namespace warn',
        contains: [
          VARIABLE,
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          HEXCOLOR,
          hljs.CSS_NUMBER_MODE,
          {
            begin: '\\s[A-Za-z0-9_.-]+',
            relevance: 0
          }
        ]
      }
    ]
  };
}


hljs.registerLanguage('xml', xml);

function xml(hljs: any) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      {
        className: 'attr',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: /=\s*/,
        relevance: 0,
        contains: [
          {
            className: 'string',
            endsParent: true,
            variants: [
              {begin: /"/, end: /"/},
              {begin: /'/, end: /'/},
              {begin: /[^\s"'=<>`]+/}
            ]
          }
        ]
      }
    ]
  };
  return {
    aliases: ['html', 'xhtml', 'rss', 'atom', 'xjb', 'xsd', 'xsl', 'plist'],
    case_insensitive: true,
    contains: [
      {
        className: 'meta',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      hljs.COMMENT(
        '<!--',
        '-->',
        {
          relevance: 10
        }
      ),
      {
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        begin: /<\?(php)?/, end: /\?>/,
        subLanguage: 'php',
        contains: [{begin: '/\\*', end: '\\*/', skip: true}]
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexeme to be recognized
        by hljs.subMode() that tests lexemes outside the stream.
        */
        begin: '<style(?=\\s|>|$)', end: '>',
        keywords: {name: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: ['css', 'xml']
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>|$)', end: '>',
        keywords: {name: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '\<\/script\>', returnEnd: true,
          subLanguage: ['actionscript', 'javascript', 'handlebars', 'xml']
        }
      },
      {
        className: 'meta',
        variants: [
          {begin: /<\?xml/, end: /\?>/, relevance: 10},
          {begin: /<\?\w+/, end: /\?>/}
        ]
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'name', begin: /[^\/><\s]+/, relevance: 0
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
}
