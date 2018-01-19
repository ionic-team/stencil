/*
Extremely simple css parser. Intended to be not more than what we need
and definitely not necessarily correct =).
*/
/* tslint:disable */

export class StyleNode {
  propertyInfo: { [key: string]: any };
  rules: StyleNode[] = null;
  start = 0;
  end = 0;
  parent: StyleNode = null;
  previous: StyleNode = null;
  parsedCssText = '';
  cssText = '';
  parsedSelector = '';
  atRule = false;
  selector = '';
  type = 0;
  keyframesName = '';
  transformedSelector: string;
  index: number;
}

// given a string of css, return a simple rule tree
export function parse(text: string) {
  text = clean(text);
  return parseCss(lex(text), text);
}

// remove stuff we don't care about that may hinder parsing
function clean(cssText: string) {
  return cssText.replace(COMMENTS_RX, '').replace(PORT_RX, '');
}

// super simple {...} lexer that returns a node tree
function lex(text: string) {
  let root = new StyleNode();
  root.start = 0;
  root.end = text.length;
  let n = root;
  for (let i = 0, l = text.length; i < l; i++) {
    if (text[i] === OPEN_BRACE) {
      if (!n.rules) {
        n.rules = [];
      }
      let p = n;
      let previous = p.rules[p.rules.length - 1] || null;
      n = new StyleNode();
      n.start = i + 1;
      n.parent = p;
      n.previous = previous;
      p.rules.push(n);
    } else if (text[i] === CLOSE_BRACE) {
      n.end = i + 1;
      n = n.parent || root;
    }
  }
  return root;
}

// add selectors/cssText to node tree
function parseCss(node: StyleNode, text: string) {
  let t = text.substring(node.start, node.end - 1);
  node.parsedCssText = node.cssText = t.trim();

  if (node.parent) {
    let ss = node.previous ? node.previous.end : node.parent.start;
    t = text.substring(ss, node.start - 1);
    t = _expandUnicodeEscapes(t);
    t = t.replace(MULTI_SPACES_RX, ' ');

    t = t.substring(t.lastIndexOf(';') + 1);
    let s = node.parsedSelector = node.selector = t.trim();
    node.atRule = (s.indexOf(AT_START) === 0);
    // note, support a subset of rule types...
    if (node.atRule) {
      if (s.indexOf(MEDIA_START) === 0) {
        node.type = types.MEDIA_RULE;
      } else if (s.match(KEYFRAMES_RULE_RX)) {
        node.type = types.KEYFRAMES_RULE;
        node.keyframesName = node.selector.split(MULTI_SPACES_RX).pop();
      }

    } else {
      if (s.indexOf(VAR_START) === 0) {
        node.type = types.MIXIN_RULE;
      } else {
        node.type = types.STYLE_RULE;
      }
    }
  }

  let r$ = node.rules;
  if (r$) {
    for (let i = 0, l = r$.length, r;
      (i < l) && (r = r$[i]); i++) {
      parseCss(r, text);
    }
  }

  return node;
}

/**
 * conversion of sort unicode escapes with spaces like `\33 ` (and longer) into
 * expanded form that doesn't require trailing space `\000033`
 */
function _expandUnicodeEscapes(s: string) {
  return s.replace(/\\([0-9a-f]{1,6})\s/gi, function() {
    let code = arguments[1],
      repeat = 6 - code.length;
    while (repeat--) {
      code = '0' + code;
    }
    return '\\' + code;
  });
}

/**
 * stringify parsed css.
 */
export function stringify(node: StyleNode, preserveProperties?: boolean, text = '') {
  // calc rule cssText
  let cssText = '';
  if (node.cssText || node.rules) {
    let r$ = node.rules;
    if (r$) {
      for (let i = 0, l = r$.length, r;
        (i < l) && (r = r$[i]); i++) {
        cssText = stringify(r, preserveProperties, cssText);
      }

    } else {
      cssText = preserveProperties ? node.cssText :
        removeCustomProps(node.cssText);
      cssText = cssText.trim();
      if (cssText) {
        cssText = '  ' + cssText + '\n';
      }
    }
  }

  // emit rule if there is cssText
  if (cssText) {
    if (node.selector) {
      text += node.selector + ' ' + OPEN_BRACE + '\n';
    }
    text += cssText;
    if (node.selector) {
      text += CLOSE_BRACE + '\n\n';
    }
  }

  return text;
}

function removeCustomProps(cssText: string) {
  cssText = removeCustomPropAssignment(cssText);
  return removeCustomPropApply(cssText);
}

export function removeCustomPropAssignment(cssText: string) {
  return cssText.replace(CUSTOM_PROP_RX, '');
}

function removeCustomPropApply(cssText: string) {
  return cssText.replace(VAR_APPLY_RX, '');
}


export class StyleInfo {

  static get(node: any): StyleInfo {
    if (node) {
      return node[infoKey];
    } else {
      return null;
    }
  }

  static set(node: any, styleInfo: StyleInfo) {
    node[infoKey] = styleInfo;
    return styleInfo;
  }

  styleRules: StyleNode;
  styleProperties: { [key: string]: string };

  constructor(ast: any) {
    this.styleRules = ast || null;
    this.styleProperties = null;
  }

}


export const enum types {
  STYLE_RULE = 1,
  KEYFRAMES_RULE = 7,
  MEDIA_RULE = 4,
  MIXIN_RULE = 1000
}

const OPEN_BRACE = '{';
const CLOSE_BRACE = '}';

// helper regexp's
const COMMENTS_RX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim;
const PORT_RX = /@import[^;]*;/gim;
const CUSTOM_PROP_RX = /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim;
const VAR_APPLY_RX = /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim;
const KEYFRAMES_RULE_RX = /^@[^\s]*keyframes/;
const MULTI_SPACES_RX = /\s+/g;

const VAR_START = '--';
const MEDIA_START = '@media';
const AT_START = '@';
const infoKey = '__styleInfo';
