import { addGlobalLink, loadDocument } from './load-link-styles';
import { executeTemplate } from './template';
import { CSSScope } from './interfaces';
import { addGlobalStyle, parseCSS, reScope, updateGlobalScopes } from './scope';
import { getActiveSelectors, resolveValues } from './selectors';

export function supportsCssVars(win: Window) {
  return !!((win as any).CSS && (win as any).CSS.supports && (win as any).CSS.supports('color', 'var(--c)'));
}

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

  init() {
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
    templateName: string,
    cssText: string,
  ) {
    if (this.hostScopeMap.has(hostEl)) {
      return null;
    }
    const cssScopeId = (hostEl as any)['s-sc'];
    const baseScope = this.registerHostTemplate(cssText, templateName, cssScopeId);
    const isDynamicScoped = baseScope.isDynamic && baseScope.cssScopeId;
    const needStyleEl = isDynamicScoped || !baseScope.styleEl;
    if (!needStyleEl) {
      return null;
    }

    const styleEl = this.doc.createElement('style');
    if (isDynamicScoped) {
      const newScopeId = `${baseScope.cssScopeId}-${this.count}`;
      (hostEl as any)['s-sc'] = newScopeId;

      this.hostStyleMap.set(hostEl, styleEl);
      this.hostScopeMap.set(hostEl, reScope(baseScope, newScopeId));
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

  private registerHostTemplate(cssText: string, scopeName: string, cssScopeId: string) {
    let scope = this.scopesMap.get(scopeName);
    if (!scope) {
      scope = parseCSS(cssText);
      scope.cssScopeId = cssScopeId;
      this.scopesMap.set(scopeName, scope);
    }
    return scope;
  }
}
