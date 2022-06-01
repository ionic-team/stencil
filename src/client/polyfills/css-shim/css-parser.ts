/*
Extremely simple css parser. Intended to be not more than what we need
and definitely not necessarily correct =).
*/

'use strict';

/** @unrestricted */
export class StyleNode {
  start = 0;
  end = 0;
  previous: StyleNode | null = null;
  parent: StyleNode | null = null;
  rules: StyleNode[] | null = null;
  parsedCssText = '';
  cssText = '';
  atRule = false;
  type = 0;
  keyframesName: string | undefined = '';
  selector = '';
  parsedSelector = '';
}

/**
 * Given a string of CSS, return a simple rule tree
 * @param text the CSS to generate a tree from
 * @returns the generated tree
 */
export function parse(text: string): StyleNode {
  text = clean(text);
  return parseCss(lex(text), text);
}

/**
 * Remove text that may hinder parsing, such as comments and `@import` statements
 * @param cssText the CSS to remove unnecessary bit from
 * @return the 'cleaned' css string
 */
function clean(cssText: string): string {
  return cssText.replace(RX.comments, '').replace(RX.port, '');
}

/**
 * Create a `StyleNode` for the given text. This function is a super simple lexer against the provided text to capture
 * CSS rules between curly braces.
 * @param text the text to parse containing CSS rules
 * @returns a new `StyleNode` with the parsed styles attached to it
 */
function lex(text: string): StyleNode {
  const root = new StyleNode();
  root['start'] = 0;
  root['end'] = text.length;
  let n = root;
  for (let i = 0, l = text.length; i < l; i++) {
    if (text[i] === OPEN_BRACE) {
      if (!n['rules']) {
        n['rules'] = [];
      }
      const p = n;
      const previous = p['rules'][p['rules'].length - 1] || null;
      n = new StyleNode();
      n['start'] = i + 1;
      n['parent'] = p;
      n['previous'] = previous;
      p['rules'].push(n);
    } else if (text[i] === CLOSE_BRACE) {
      n['end'] = i + 1;
      n = n['parent'] || root;
    }
  }
  return root;
}

/**
 * Add selectors/cssText to a style node
 * @param node the CSS node to add styles to
 * @param text the selectors to add to the style node
 * @returns the updated style node
 */
function parseCss(node: StyleNode, text: string): StyleNode {
  let t = text.substring(node['start'], node['end'] - 1);
  node['parsedCssText'] = node['cssText'] = t.trim();
  if (node.parent) {
    const ss = node.previous ? node.previous['end'] : node.parent['start'];
    t = text.substring(ss, node['start'] - 1);
    t = _expandUnicodeEscapes(t);
    t = t.replace(RX.multipleSpaces, ' ');
    // TODO(sorvell): ad hoc; make selector include only after last ;
    // helps with mixin syntax
    t = t.substring(t.lastIndexOf(';') + 1);
    const s = (node['parsedSelector'] = node['selector'] = t.trim());
    node['atRule'] = s.indexOf(AT_START) === 0;
    // note, support a subset of rule types...
    if (node['atRule']) {
      if (s.indexOf(MEDIA_START) === 0) {
        node['type'] = types.MEDIA_RULE;
      } else if (s.match(RX.keyframesRule)) {
        node['type'] = types.KEYFRAMES_RULE;
        node['keyframesName'] = node['selector'].split(RX.multipleSpaces).pop();
      }
    } else {
      if (s.indexOf(VAR_START) === 0) {
        node['type'] = types.MIXIN_RULE;
      } else {
        node['type'] = types.STYLE_RULE;
      }
    }
  }
  const r$ = node['rules'];
  if (r$) {
    for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
      parseCss(r, text);
    }
  }
  return node;
}

/**
 * Conversion of unicode escapes with spaces like `\33 ` (and longer) into
 * expanded form that doesn't require trailing space -> `\000033`
 * @param s the unicode escape sequence to expand
 * @return the expanded escape sequence
 */
function _expandUnicodeEscapes(s: string): string {
  return s.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
    // eslint-disable-next-line prefer-rest-params -- We need to use this here for browser support
    let code = arguments[1],
      repeat = 6 - code.length;
    while (repeat--) {
      code = '0' + code;
    }
    return '\\' + code;
  });
}

/**
 * Stringify some parsed CSS.
 * @param node the CSS root node to stringify
 * @param  preserveProperties if `false`, custom CSS properties will be removed from the CSS. If `true`, they will be
 * preserved.
 * @param  text an optional string to append the stringified CSS to
 * @return the stringified CSS.
 */
export function stringify(node: StyleNode, preserveProperties: boolean, text = ''): string {
  // calc rule cssText
  let cssText = '';
  if (node['cssText'] || node['rules']) {
    const r$ = node['rules'];
    if (r$ && !_hasMixinRules(r$)) {
      for (let i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
        cssText = stringify(r, preserveProperties, cssText);
      }
    } else {
      cssText = preserveProperties ? node['cssText'] : removeCustomProps(node['cssText']);
      cssText = cssText.trim();
      if (cssText) {
        cssText = '  ' + cssText + '\n';
      }
    }
  }
  // emit rule if there is cssText
  if (cssText) {
    if (node['selector']) {
      text += node['selector'] + ' ' + OPEN_BRACE + '\n';
    }
    text += cssText;
    if (node['selector']) {
      text += CLOSE_BRACE + '\n\n';
    }
  }
  return text;
}

/**
 * Determines if a parsed CSS node has a selector that begins with '--' or not
 * @param rules the rules to evaluate. only the first rule in the provided list will be tested.
 * @return `true` if a selector that begins with '--' is found, `false` otherwise.
 */
function _hasMixinRules(rules: ReadonlyArray<StyleNode>): boolean {
  const r = rules[0];
  return Boolean(r) && Boolean(r['selector']) && r['selector'].indexOf(VAR_START) === 0;
}

/**
 * Helper function to remove custom properties from CSS
 * @param cssText the stringified CSS to remove custom properties from
 * @return the sanitized CSS
 */
function removeCustomProps(cssText: string): string {
  cssText = removeCustomPropAssignment(cssText);
  return removeCustomPropApply(cssText);
}

/**
 *
 * @param cssText the stringified CSS to remove custom properties from
 * @return the sanitized CSS
 */
export function removeCustomPropAssignment(cssText: string): string {
  return cssText.replace(RX.customProp, '').replace(RX.mixinProp, '');
}

/**
 *
 * @param cssText the stringified CSS to remove custom properties from
 * @return the sanitized CSS
 */
function removeCustomPropApply(cssText: string): string {
  return cssText.replace(RX.mixinApply, '').replace(RX.varApply, '');
}

/** @enum {number} */
export const types = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7,
  MEDIA_RULE: 4,
  MIXIN_RULE: 1000,
};

const OPEN_BRACE = '{';
const CLOSE_BRACE = '}';

// helper regexp's
const RX = {
  comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  port: /@import[^;]*;/gim,
  customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
  mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
  mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
  varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
  keyframesRule: /^@[^\s]*keyframes/,
  multipleSpaces: /\s+/g,
};

const VAR_START = '--';
const MEDIA_START = '@media';
const AT_START = '@';
