import { StyleNode, parse, stringify, types } from './css-parse';
import { StyleElement } from './custom-style';


export function toCssText(win: Window, rules: any, callback?: (styleNode: StyleNode) => void) {
  if (!rules) {
    return '';
  }
  if (typeof rules === 'string') {
    rules = parse(rules);
  }
  if (callback) {
    forEachRule(win, rules, callback);
  }
  return stringify(rules, false);
}

export function rulesForStyle(style: StyleElement): StyleNode {
  if (!style.__cssRules && style.textContent) {
    style.__cssRules = parse(style.textContent);
  }
  return style.__cssRules || null;
}

export function forEachRule(win: Window, node: StyleNode, styleRuleCallback?: (styleNode: StyleNode) => void, keyframesRuleCallback?: Function, onlyActiveRules?: boolean) {
  if (!node) {
    return;
  }

  let skipRules = false;
  const type = node.type;

  if (onlyActiveRules) {
    if (type === types.MEDIA_RULE) {
      const matchMedia = node.selector.match(MEDIA_MATCH);
      if (matchMedia) {
        // if rule is a non matching @media rule, skip subrules
        if (!win.matchMedia(matchMedia[1]).matches) {
          skipRules = true;
        }
      }
    }
  }

  if (type === types.STYLE_RULE) {
    styleRuleCallback(node);

  } else if (keyframesRuleCallback &&
    type === types.KEYFRAMES_RULE) {
    keyframesRuleCallback(node);

  } else if (type === types.MIXIN_RULE) {
    skipRules = true;
  }

  const r$ = node.rules;
  if (r$ && !skipRules) {
    for (let i = 0, l = r$.length, r; (i < l) && (r = r$[i]); i++) {
      forEachRule(win, r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
    }
  }
}

/**
 * Walk from text[start] matching parens and
 * returns position of the outer end paren
 */
export function findMatchingParen(text: string, start: number) {
  let level = 0;
  for (let i = start, l = text.length; i < l; i++) {
    if (text[i] === '(') {
      level++;
    } else if (text[i] === ')') {
      if (--level === 0) {
        return i;
      }
    }
  }
  return -1;
}

export function processVariableAndFallback(str: string, callback: Function): Function {
  // find 'var('
  const start = str.indexOf('var(');
  if (start === -1) {
    // no var?, everything is prefix
    return callback(str, '', '', '');
  }
  // ${prefix}var(${inner})${suffix}
  const end = findMatchingParen(str, start + 3);
  const inner = str.substring(start + 4, end);
  const prefix = str.substring(0, start);

  // suffix may have other variables
  const suffix = processVariableAndFallback(str.substring(end + 1), callback);
  const comma = inner.indexOf(',');

  // value and fallback args should be trimmed to match in property lookup
  if (comma === -1) {
    // variable, no fallback
    return callback(prefix, inner.trim(), '', suffix);
  }

  // var(${value},${fallback})
  const value = inner.substring(0, comma).trim();
  const fallback = inner.substring(comma + 1).trim();

  return callback(prefix, value, fallback, suffix);
}

const MEDIA_MATCH = /@media\s(.*)/;

