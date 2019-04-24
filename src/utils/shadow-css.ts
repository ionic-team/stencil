/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * This file is a port of shadowCSS from webcomponents.js to TypeScript.
 * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
 * https://github.com/angular/angular/blob/master/packages/compiler/src/shadow_css.ts
 */
export function scopeCss(cssText: string, scopeId: string, commentOriginalSelector: boolean) {
  const sc = new ShadowCss();
  return sc.shimCssText(cssText, scopeId, scopeId + '-h', scopeId + '-s', commentOriginalSelector);
}

export class ShadowCss {
  strictStyling = true;

  shimCssText(cssText: string, scopeId: string, hostScopeId = '', slotScopeId = '', commentOriginalSelector = false): string {
    const commentsWithHash = extractCommentsWithHash(cssText);
    cssText = stripComments(cssText);
    const orgSelectors: {
      placeholder: string,
      comment: string,
    }[] = [];

    if (commentOriginalSelector) {
      const processCommentedSelector = (rule: CssRule) => {
        const placeholder = `/*!@___${orgSelectors.length}___*/`;
        const comment = `/*!@${rule.selector}*/`;

        orgSelectors.push({ placeholder, comment });
        rule.selector = placeholder + rule.selector;
        return rule;
      };

      cssText = processRules(cssText, rule => {
        if (rule.selector[0] !== '@') {
          return processCommentedSelector(rule);

        } else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
        rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
          rule.content = processRules(rule.content, processCommentedSelector);
          return rule;
        }
        return rule;
      });
    }

    const scopedCssText = this._scopeCssText(cssText, scopeId, hostScopeId, slotScopeId, commentOriginalSelector);
    cssText = [scopedCssText, ...commentsWithHash].join('\n');

    if (commentOriginalSelector) {
      orgSelectors.forEach(({placeholder, comment}) => {
        cssText = cssText.replace(placeholder, comment);
      });
    }

    return cssText;
  }

  private _scopeCssText(cssText: string, scopeId: string, hostScopeId: string, slotScopeId: string, commentOriginalSelector: boolean): string {
    // replace :host and :host-context -shadowcsshost and -shadowcsshost respectively
    cssText = this._insertPolyfillHostInCssText(cssText);
    cssText = this._convertColonHost(cssText);
    cssText = this._convertColonHostContext(cssText);
    cssText = this._convertColonSlotted(cssText, slotScopeId);
    cssText = this._convertShadowDOMSelectors(cssText);
    if (scopeId) {
      cssText = this._scopeSelectors(cssText, scopeId, hostScopeId, slotScopeId, commentOriginalSelector);
    }

    cssText = cssText.replace(/-shadowcsshost-no-combinator/g, `.${hostScopeId}`);
    cssText = cssText.replace(/>\s*\*\s+([^{, ]+)/gm, ' $1 ');
    return cssText.trim();
  }

  /*
   * convert a rule like :host(.foo) > .bar { }
   *
   * to
   *
   * .foo<scopeName> > .bar
  */
  private _convertColonHost(cssText: string): string {
    return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
  }

    /*
   * convert a rule like ::slotted(.foo) { }
  */
  private _convertColonSlotted(cssText: string, slotAttr: string): string {
    const regExp = _cssColonSlottedRe;

    return cssText.replace(regExp, function(...m: string[]) {
      if (m[2]) {
        const compound = m[2].trim();
        const suffix = m[3];

        const sel = '.' + slotAttr + ' > ' + compound + suffix;

        return sel;

      } else {
        return _polyfillHostNoCombinator + m[3];
      }
    });
  }

  /*
   * convert a rule like :host-context(.foo) > .bar { }
   *
   * to
   *
   * .foo<scopeName> > .bar, .foo scopeName > .bar { }
   *
   * and
   *
   * :host-context(.foo:host) .bar { ... }
   *
   * to
   *
   * .foo<scopeName> .bar { ... }
  */
  private _convertColonHostContext(cssText: string): string {
    return this._convertColonRule(
        cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
  }

  private _convertColonRule(cssText: string, regExp: RegExp, partReplacer: Function): string {
    // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
    return cssText.replace(regExp, function(...m: string[]) {
      if (m[2]) {
        const parts = m[2].split(',');
        const r: string[] = [];
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i].trim();
          if (!p) break;
          r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
        }
        return r.join(',');
      } else {
        return _polyfillHostNoCombinator + m[3];
      }
    });
  }

  private _colonHostContextPartReplacer(host: string, part: string, suffix: string): string {
    if (part.indexOf(_polyfillHost) > -1) {
      return this._colonHostPartReplacer(host, part, suffix);
    } else {
      return host + part + suffix + ', ' + part + ' ' + host + suffix;
    }
  }

  private _colonHostPartReplacer(host: string, part: string, suffix: string): string {
    return host + part.replace(_polyfillHost, '') + suffix;
  }

  /*
   * Convert combinators like ::shadow and pseudo-elements like ::content
   * by replacing with space.
  */
  private _convertShadowDOMSelectors(cssText: string): string {
    return _shadowDOMSelectorsRe.reduce((result, pattern) => result.replace(pattern, ' '), cssText);
  }

  // change a selector like 'div' to 'name div'
  private _scopeSelectors(cssText: string, scopeSelector: string, hostSelector: string, slotSelector: string, commentOriginalSelector: boolean): string {
    return processRules(cssText, (rule: CssRule) => {
      let selector = rule.selector;
      let content = rule.content;
      if (rule.selector[0] !== '@') {
        selector =
            this._scopeSelector(rule.selector, scopeSelector, hostSelector, slotSelector, this.strictStyling);
      } else if (
          rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
          rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
        content = this._scopeSelectors(rule.content, scopeSelector, hostSelector, slotSelector, commentOriginalSelector);
      }

      selector = selector.replace(/\s{2,}/g, ' ').trim();

      return new CssRule(selector, content);
    });
  }

  private _scopeSelector(
      selector: string, scopeSelector: string, hostSelector: string, slotSelector: string, strict: boolean) {

    return selector.split(',')
        .map(shallowPart => {
          if (slotSelector && shallowPart.indexOf('.' + slotSelector) > -1) {
            return shallowPart.trim();
          }

          if (this._selectorNeedsScoping(shallowPart, scopeSelector)) {
            return strict ?
                this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector).trim() :
                this._applySelectorScope(shallowPart, scopeSelector, hostSelector).trim();
          } else {
            return shallowPart.trim();
          }
        })
        .join(', ');
  }

  private _selectorNeedsScoping(selector: string, scopeSelector: string) {
    const re = this._makeScopeMatcher(scopeSelector);
    return !re.test(selector);
  }

  private _makeScopeMatcher(scopeSelector: string) {
    const lre = /\[/g;
    const rre = /\]/g;
    scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
    return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
  }

  private _applySelectorScope(selector: string, scopeSelector: string, hostSelector: string) {
    // Difference from webcomponents.js: scopeSelector could not be an array
    return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
  }

  // scope via name and [is=name]
  private _applySimpleSelectorScope(selector: string, scopeSelector: string, hostSelector: string) {
    // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
    _polyfillHostRe.lastIndex = 0;
    if (_polyfillHostRe.test(selector)) {
      const replaceBy = this.strictStyling ? `.${hostSelector}` : scopeSelector;
      return selector
          .replace(
              _polyfillHostNoCombinatorRe,
              (_, selector) => {
                return selector.replace(
                    /([^:]*)(:*)(.*)/,
                    (_: string, before: string, colon: string, after: string) => {
                      return before + replaceBy + colon + after;
                    });
              })
          .replace(_polyfillHostRe, replaceBy + ' ');
    }

    return scopeSelector + ' ' + selector;
  }

  private _applyStrictSelectorScope(selector: string, scopeSelector: string, hostSelector: string) {
    const isRe = /\[is=([^\]]*)\]/g;
    scopeSelector = scopeSelector.replace(isRe, (_: string, ...parts: string[]) => parts[0]);

    const className = '.' + scopeSelector;

    const _scopeSelectorPart = (p: string) => {
      let scopedP = p.trim();

      if (!scopedP) {
        return '';
      }

      if (p.indexOf(_polyfillHostNoCombinator) > -1) {
        scopedP = this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
      } else {
        // remove :host since it should be unnecessary
        const t = p.replace(_polyfillHostRe, '');
        if (t.length > 0) {
          const matches = t.match(/([^:]*)(:*)(.*)/);
          if (matches) {
            scopedP = matches[1] + className + matches[2] + matches[3];
          }
        }
      }

      return scopedP;
    };

    const safeContent = new SafeSelector(selector);
    selector = safeContent.content();

    let scopedSelector = '';
    let startIndex = 0;
    let res: RegExpExecArray|null;
    const sep = /( |>|\+|~(?!=))\s*/g;

    // If a selector appears before :host it should not be shimmed as it
    // matches on ancestor elements and not on elements in the host's shadow
    // `:host-context(div)` is transformed to
    // `-shadowcsshost-no-combinatordiv, div -shadowcsshost-no-combinator`
    // the `div` is not part of the component in the 2nd selectors and should not be scoped.
    // Historically `component-tag:host` was matching the component so we also want to preserve
    // this behavior to avoid breaking legacy apps (it should not match).
    // The behavior should be:
    // - `tag:host` -> `tag[h]` (this is to avoid breaking legacy apps, should not match anything)
    // - `tag :host` -> `tag [h]` (`tag` is not scoped because it's considered part of a
    //   `:host-context(tag)`)
    const hasHost = selector.indexOf(_polyfillHostNoCombinator) > -1;
    // Only scope parts after the first `-shadowcsshost-no-combinator` when it is present
    let shouldScope = !hasHost;

    while ((res = sep.exec(selector)) !== null) {
      const separator = res[1];
      const part = selector.slice(startIndex, res.index).trim();
      shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
      const scopedPart = shouldScope ? _scopeSelectorPart(part) : part;
      scopedSelector += `${scopedPart} ${separator} `;
      startIndex = sep.lastIndex;
    }

    const part = selector.substring(startIndex);
    shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
    scopedSelector += shouldScope ? _scopeSelectorPart(part) : part;

    // replace the placeholders with their original values
    return safeContent.restore(scopedSelector);
  }

  private _insertPolyfillHostInCssText(selector: string): string {
    selector = selector
      .replace(_colonHostContextRe, _polyfillHostContext)
      .replace(_colonHostRe, _polyfillHost)
      .replace(_colonSlottedRe, _polyfillSlotted);
    return selector;
  }
}

class SafeSelector {
  private placeholders: string[] = [];
  private index = 0;
  private _content: string;

  constructor(selector: string) {
    // Replaces attribute selectors with placeholders.
    // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
    selector = selector.replace(/(\[[^\]]*\])/g, (_, keep) => {
      const replaceBy = `__ph-${this.index}__`;
      this.placeholders.push(keep);
      this.index++;
      return replaceBy;
    });

    // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
    // WS and "+" would otherwise be interpreted as selector separators.
    this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, (_, pseudo, exp) => {
      const replaceBy = `__ph-${this.index}__`;
      this.placeholders.push(exp);
      this.index++;
      return pseudo + replaceBy;
    });
  }

  restore(content: string): string {
    return content.replace(/__ph-(\d+)__/g, (_, index) => this.placeholders[+index]);
  }

  content(): string { return this._content; }
}

const _polyfillHost = '-shadowcsshost';
const _polyfillSlotted = '-shadowcssslotted';
// note: :host-context pre-processed to -shadowcsshostcontext.
const _polyfillHostContext = '-shadowcsscontext';
const _parenSuffix = ')(?:\\((' +
    '(?:\\([^)(]*\\)|[^)(]*)+?' +
    ')\\))?([^,{]*)';
const _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
const _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
const _cssColonSlottedRe = new RegExp('(' + _polyfillSlotted + _parenSuffix, 'gim');
const _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
const _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
const _shadowDOMSelectorsRe = [
  /::shadow/g,
  /::content/g
];

const _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
const _polyfillHostRe = /-shadowcsshost/gim;
const _colonHostRe = /:host/gim;
const _colonSlottedRe = /::slotted/gim;
const _colonHostContextRe = /:host-context/gim;

const _commentRe = /\/\*\s*[\s\S]*?\*\//g;

function stripComments(input: string): string {
  return input.replace(_commentRe, '');
}

const _commentWithHashRe = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g;

function extractCommentsWithHash(input: string): string[] {
  return input.match(_commentWithHashRe) || [];
}

const _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
const _curlyRe = /([{}])/g;
const OPEN_CURLY = '{';
const CLOSE_CURLY = '}';
const BLOCK_PLACEHOLDER = '%BLOCK%';

class CssRule {
  constructor(public selector: string, public content: string) {}
}

function processRules(input: string, ruleCallback: (rule: CssRule) => CssRule): string {
  const inputWithEscapedBlocks = escapeBlocks(input);
  let nextBlockIndex = 0;
  return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function(...m: string[]) {
    const selector = m[2];
    let content = '';
    let suffix = m[4];
    let contentPrefix = '';
    if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
      content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
      suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
      contentPrefix = '{';
    }
    const rule = ruleCallback(new CssRule(selector, content));
    return `${m[1]}${rule.selector}${m[3]}${contentPrefix}${rule.content}${suffix}`;
  });
}

class StringWithEscapedBlocks {
  constructor(public escapedString: string, public blocks: string[]) {}
}

function escapeBlocks(input: string): StringWithEscapedBlocks {
  const inputParts = input.split(_curlyRe);
  const resultParts: string[] = [];
  const escapedBlocks: string[] = [];
  let bracketCount = 0;
  let currentBlockParts: string[] = [];
  for (let partIndex = 0; partIndex < inputParts.length; partIndex++) {
    const part = inputParts[partIndex];
    if (part === CLOSE_CURLY) {
      bracketCount--;
    }
    if (bracketCount > 0) {
      currentBlockParts.push(part);
    } else {
      if (currentBlockParts.length > 0) {
        escapedBlocks.push(currentBlockParts.join(''));
        resultParts.push(BLOCK_PLACEHOLDER);
        currentBlockParts = [];
      }
      resultParts.push(part);
    }
    if (part === OPEN_CURLY) {
      bracketCount++;
    }
  }
  if (currentBlockParts.length > 0) {
    escapedBlocks.push(currentBlockParts.join(''));
    resultParts.push(BLOCK_PLACEHOLDER);
  }
  return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
}
