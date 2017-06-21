/**
 * CSS parser adopted from rework/css by
 * TJ Holowaychuk (@tj)
 * Licensed under the MIT License
 * https://github.com/reworkcss/css/blob/master/LICENSE
 */


// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;


export function parseCss(css: string) {

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    var rulesList = rules();

    return {
      type: 'stylesheet',
      stylesheet: {
        rules: rulesList
      }
    };
  }

  /**
   * Opening brace.
   */

  function open() {
    return match(/^{\s*/);
  }

  /**
   * Closing brace.
   */

  function close() {
    return match(/^}/);
  }

  /**
   * Parse ruleset.
   */

  function rules() {
    var node;
    var rules: any[] = [];

    whitespace();
    comments(rules);

    while (css.length && css.charAt(0) !== '}' && (node = atrule() || rule())) {
      if (node !== false) {
        rules.push(node);
        comments(rules);
      }
    }
    return rules;
  }

  /**
   * Match `re` and return captures.
   */

  function match(re: any) {
    var m = re.exec(css);
    if (!m) return;
    var str = m[0];
    css = css.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments(rules?: any) {
    var c;
    rules = rules || [];
    while (c = comment()) {
      if (c !== false) {
        rules.push(c);
      }
    }
    return rules;
  }

  /**
   * Parse comment.
   */

  function comment() {
    if ('/' !== css.charAt(0) || '*' !== css.charAt(1)) return false;

    var i = 2;
    while ('' !== css.charAt(i) && ('*' !== css.charAt(i) || '/' !== css.charAt(i + 1))) ++i;
    i += 2;

    if ('' === css.charAt(i - 1)) {
      return false;
    }

    var str = css.slice(2, i - 2);
    css = css.slice(i);

    return {
      type: 'comment',
      comment: str
    };
  }

  /**
   * Parse selector.
   */

  function selector(): any {
    var m: any = match(/^([^{]+)/);
    if (!m) return;
    /* @fix Remove all comments from selectors
     * http://ostermiller.org/findcomment.html */
    return m[0].trim()
      .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
      .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(m: string) {
        return m.replace(/,/g, '\u200C');
      })
      .split(/\s*(?![^(]*\)),\s*/)
      .map(function(s: string) {
        return s.replace(/\u200C/g, ',');
      });
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    // prop
    var prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!prop) return false;
    prop = prop[0].trim();

    // :
    if (!match(/^:\s*/)) return false;

    // val
    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);

    var ret = {
      type: 'declaration',
      property: prop.replace(commentre, ''),
      value: val ? val[0].trim().replace(commentre, '') : ''
    };

    // ;
    match(/^[;\s]*/);

    return ret;
  }

  /**
   * Parse declarations.
   */

  function declarations() {
    var decls: any[] = [];

    if (!open()) return false;
    comments(decls);

    // declarations
    var decl;
    while (decl = declaration()) {
      if (decl !== false) {
        decls.push(decl);
        comments(decls);
      }
    }

    if (!close()) return false;
    return decls;
  }

  /**
   * Parse keyframe.
   */

  function keyframe() {
    var m;
    var vals = [];

    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }

    if (!vals.length) return false;

    return {
      type: 'keyframe',
      values: vals,
      declarations: declarations()
    };
  }

  /**
   * Parse keyframes.
   */

  function atkeyframes() {
    var m = match(/^@([-\w]+)?keyframes\s*/);

    if (!m) return false;
    var vendor = m[1];

    // identifier
    m = match(/^([-\w]+)\s*/);
    if (!m) return false;
    var name = m[1];

    if (!open()) return false;

    var frame;
    var frames = comments();
    while (frame = keyframe()) {
      frames.push(frame);
      frames = frames.concat(comments());
    }

    if (!close()) return false;

    return {
      type: 'keyframes',
      name: name,
      vendor: vendor,
      keyframes: frames
    };
  }

  /**
   * Parse supports.
   */

  function atsupports() {
    var m = match(/^@supports *([^{]+)/);

    if (!m) return false;
    var supports = m[1].trim();

    if (!open()) return false;

    var style = comments().concat(rules());

    if (!close()) return false;

    return {
      type: 'supports',
      supports: supports,
      rules: style
    };
  }

  /**
   * Parse host.
   */

  function athost() {
    var m = match(/^@host\s*/);

    if (!m) return false;

    if (!open()) return false;

    var style = comments().concat(rules());

    if (!close()) return false;

    return {
      type: 'host',
      rules: style
    };
  }

  /**
   * Parse media.
   */

  function atmedia() {
    var m = match(/^@media *([^{]+)/);

    if (!m) return false;
    var media = m[1].trim();

    if (!open()) return false;

    var style = comments().concat(rules());

    if (!close()) return false;

    return {
      type: 'media',
      media: media,
      rules: style
    };
  }


  /**
   * Parse custom-media.
   */

  function atcustommedia() {
    var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
    if (!m) return false;

    return {
      type: 'custom-media',
      name: m[1].trim(),
      media: m[2].trim()
    };
  }

  /**
   * Parse paged media.
   */

  function atpage() {
    var m = match(/^@page */);
    if (!m) return false;

    var sel = selector() || [];

    if (!open()) return false;
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return false;

    return {
      type: 'page',
      selectors: sel,
      declarations: decls
    };
  }

  /**
   * Parse document.
   */

  function atdocument() {
    var m = match(/^@([-\w]+)?document *([^{]+)/);
    if (!m) return false;

    var vendor = m[1].trim();
    var doc = m[2].trim();

    if (!open()) return false;

    var style = comments().concat(rules());

    if (!close()) return false;

    return {
      type: 'document',
      document: doc,
      vendor: vendor,
      rules: style
    };
  }

  /**
   * Parse font-face.
   */

  function atfontface() {
    var m = match(/^@font-face\s*/);
    if (!m) return false;

    if (!open()) return false;
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return false;

    return {
      type: 'font-face',
      declarations: decls
    };
  }

  /**
   * Parse import
   */

  var atimport = _compileAtrule('import');

  /**
   * Parse charset
   */

  var atcharset = _compileAtrule('charset');

  /**
   * Parse namespace
   */

  var atnamespace = _compileAtrule('namespace');

  /**
   * Parse non-block at-rules
   */


  function _compileAtrule(name: any) {
    var re = new RegExp('^@' + name + '\\s*([^;]+);');
    return function() {
      var m = match(re);
      if (!m) return;
      var ret: any = { type: name };
      ret[name] = m[1].trim();
      return ret;
    };
  }

  /**
   * Parse at rule.
   */

  function atrule() {
    if (css[0] !== '@') return;

    return atkeyframes()
      || atmedia()
      || atcustommedia()
      || atsupports()
      || atimport()
      || atcharset()
      || atnamespace()
      || atdocument()
      || atpage()
      || athost()
      || atfontface();
  }

  /**
   * Parse rule.
   */

  function rule() {
    var sel = selector();

    if (!sel) return false;
    comments();

    return {
      type: 'rule',
      selectors: sel,
      declarations: declarations()
    };
  }

  return addParent(stylesheet());
}


/**
 * Adds non-enumerable parent node reference to each node.
 */

function addParent(obj?: any, parent?: any) {
  var isNode = obj && typeof obj.type === 'string';
  var childParent = isNode ? obj : parent;

  for (var k in obj) {
    var value = obj[k];
    if (Array.isArray(value)) {
      value.forEach(function(v) { addParent(v, childParent); });
    } else if (value && typeof value === 'object') {
      addParent(value, childParent);
    }
  }

  if (isNode) {
    Object.defineProperty(obj, 'parent', {
      configurable: true,
      writable: true,
      enumerable: false,
      value: parent || null
    });
  }

  return obj;
}
