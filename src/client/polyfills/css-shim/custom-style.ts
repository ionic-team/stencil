import { addGlobalLink, loadDocument, startWatcher } from './load-link-styles';
import { executeTemplate } from './template';
import { CSSScope } from './interfaces';
import { addGlobalStyle, parseCSS, reScope, updateGlobalScopes } from './scope';
import { getActiveSelectors, resolveValues } from './selectors';
import { CssVarShim } from '../../../declarations';

export class CustomStyle implements CssVarShim {
  private count = 0;
  private hostStyleMap = new WeakMap<HTMLElement, HTMLStyleElement>();
  private hostScopeMap = new WeakMap<HTMLElement, CSSScope>();

  private globalScopes: CSSScope[] = [];
  private scopesMap = new Map<string, CSSScope>();
  private didInit = false;

  constructor(private win: Window, private doc: Document) {}

  i() {
    if (this.didInit || !this.win.requestAnimationFrame) {
      return Promise.resolve();
    }

    this.didInit = true;
    return new Promise<void>(resolve => {
      this.win.requestAnimationFrame(() => {
        startWatcher(this.doc, this.globalScopes);
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
    if (addGlobalStyle(this.globalScopes, styleEl)) {
      this.updateGlobal();
    }
  }

  createHostStyle(hostEl: HTMLElement, cssScopeId: string, cssText: string, isScoped: boolean) {
    if (this.hostScopeMap.has(hostEl)) {
      throw new Error('host style already created');
    }
    const baseScope = this.registerHostTemplate(cssText, cssScopeId, isScoped);
    const styleEl = this.doc.createElement('style');
    styleEl.setAttribute('data-no-shim', '');

    if (!baseScope.usesCssVars) {
      // This component does not use (read) css variables
      styleEl.textContent = cssText;
    } else if (isScoped) {
      // This component is dynamic: uses css var and is scoped
      (styleEl as any)['s-sc'] = cssScopeId = `${baseScope.scopeId}-${this.count}`;
      styleEl.textContent = '/*needs update*/';
      this.hostStyleMap.set(hostEl, styleEl);
      this.hostScopeMap.set(hostEl, reScope(baseScope, cssScopeId));
      this.count++;
    } else {
      // This component uses css vars, but it's no-encapsulation (global static)
      baseScope.styleEl = styleEl;
      if (!baseScope.usesCssVars) {
        styleEl.textContent = executeTemplate(baseScope.template, {});
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
    if (scope && scope.usesCssVars && scope.isScoped) {
      const styleEl = this.hostStyleMap.get(hostEl);
      if (styleEl) {
        const selectors = getActiveSelectors(hostEl, this.hostScopeMap, this.globalScopes);
        const props = resolveValues(selectors);
        styleEl.textContent = executeTemplate(scope.template, props);
      }
    }
  }

  updateGlobal() {
    updateGlobalScopes(this.globalScopes);
  }

  private registerHostTemplate(cssText: string, scopeId: string, isScoped: boolean) {
    let scope = this.scopesMap.get(scopeId);
    if (!scope) {
      scope = parseCSS(cssText);
      scope.scopeId = scopeId;
      scope.isScoped = isScoped;
      this.scopesMap.set(scopeId, scope);
    }
    return scope;
  }
}
