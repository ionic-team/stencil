import { addGlobalLink, loadDocument } from './load-link-styles';
import { executeTemplate } from './template';
import { CSSScope } from './interfaces';
import { addGlobalStyle, parseCSS, reScope, updateGlobalScopes } from './scope';
import { getActiveSelectors, resolveValues } from './selectors';

export class CustomStyle {

  private count = 0;
  private hostStyleMap = new WeakMap<HTMLElement, HTMLStyleElement>();
  private hostScopeMap = new WeakMap<HTMLElement, CSSScope>();

  private globalScopes: CSSScope[] = [];
  private scopesMap = new Map<string, CSSScope>();

  constructor(
    private win: Window,
    private doc: Document,
  ) {}

  initShim() {
    return new Promise(resolve => {
      this.win.requestAnimationFrame(() => {
        loadDocument(this.doc, this.globalScopes).then(() => resolve());
      });
    });
  }

  addLink(linkEl: HTMLLinkElement) {
    return addGlobalLink(this.doc, this.globalScopes, linkEl).then(() => {
      this.updateGlobal();
    });
  }

  addGlobalStyle(styleEl: HTMLStyleElement) {
    addGlobalStyle(this.globalScopes, styleEl);
    this.updateGlobal();
  }

  createHostStyle(
    hostEl: HTMLElement,
    cssScopeId: string,
    cssText: string,
  ) {
    if (this.hostScopeMap.has(hostEl)) {
      throw new Error('host style already created');
    }
    const baseScope = this.registerHostTemplate(cssText, cssScopeId);
    const isDynamicScoped = !!(baseScope.isDynamic && baseScope.cssScopeId);
    const needStyleEl = isDynamicScoped || !baseScope.styleEl;
    const styleEl = this.doc.createElement('style');

    if (!needStyleEl) {
      styleEl.innerHTML = cssText;
    } else {
      if (isDynamicScoped) {
        cssScopeId = `${baseScope.cssScopeId}-${this.count}`;
        styleEl.innerHTML = '/*needs update*/';
        this.hostStyleMap.set(hostEl, styleEl);
        this.hostScopeMap.set(hostEl, reScope(baseScope, cssScopeId));
        this.count++;
      } else {
        baseScope.styleEl = styleEl;
        if (!baseScope.isDynamic) {
          styleEl.innerHTML = executeTemplate(baseScope.template, {});
        }
        this.globalScopes.push(baseScope);
        this.updateGlobal();
        this.hostScopeMap.set(hostEl, baseScope);
      }
    }

    (styleEl as any)['s-sc'] = cssScopeId;
    return styleEl;
  }

  removeHost(hostEl: HTMLElement) {
    const css = this.hostStyleMap.get(hostEl);
    if (css) {
      css.remove();
    }
    this.hostStyleMap.delete(hostEl);
    this.hostScopeMap.delete(hostEl);
  }

  updateHost(hostEl: HTMLElement) {
    const scope = this.hostScopeMap.get(hostEl);
    if (scope && scope.isDynamic && scope.cssScopeId) {
      const styleEl = this.hostStyleMap.get(hostEl);
      if (styleEl) {
        const selectors = getActiveSelectors(hostEl, this.hostScopeMap, this.globalScopes);
        const props = resolveValues(selectors);
        styleEl.innerHTML = executeTemplate(scope.template, props);
      }
    }
  }

  updateGlobal() {
    updateGlobalScopes(this.globalScopes);
  }

  private registerHostTemplate(cssText: string, scopeId: string) {
    let scope = this.scopesMap.get(scopeId);
    if (!scope) {
      scope = parseCSS(cssText);
      scope.cssScopeId = scopeId;
      this.scopesMap.set(scopeId, scope);
    }
    return scope;
  }
}
