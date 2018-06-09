import { addGlobalLink, loadDocument } from './load-link-styles';
import { executeTemplate } from './template';
import { CSSScope } from './interfaces';
import { addGlobalStyle, parseCSS, reScope, updateGlobalScopes } from './scope';
import { getActiveSelectors, resolveValues } from './selectors';
import { getHostScopeAttribute } from '../../../util/scope';

export function supportsCssVars(win: Window) {
  return !!((win as any).CSS && (win as any).CSS.supports && (win as any).CSS.supports('color', 'var(--c)'));
}

export class CustomStyle {

  private count = 0;
  private hostStyleMap = new WeakMap<HTMLElement, HTMLStyleElement>();
  private hostScopeMap = new WeakMap<HTMLElement, CSSScope>();

  private globalScopes: CSSScope[] = [];
  private scopesMap = new Map<string, CSSScope>();
  public supportsCssVars: boolean;

  constructor(
    private win: Window,
    private doc: Document,
  ) {
    this.supportsCssVars = supportsCssVars(win);
  }

  init() {
    return new Promise(resolve => {
      if (this.supportsCssVars) {
        resolve();
      } else {
        this.win.requestAnimationFrame(() => {
          loadDocument(this.doc, this.globalScopes).then(() => resolve());
        });
      }
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
    cssScopeId?: string,
  ) {
    const baseScope = this.registerHostTemplate(cssText, templateName, cssScopeId);

    const needStyleEl = baseScope.isDynamic || !baseScope.styleEl;
    if (!needStyleEl) {
      return null;
    }

    const styleEl = this.doc.createElement('style');
    if (baseScope.isDynamic) {
      this.hostStyleMap.set(hostEl, styleEl);
      const newScopeId = `${baseScope.cssScopeId}-${this.count}`;
      hostEl.removeAttribute(baseScope.cssScopeId);
      (hostEl as any)['s-sc'] = newScopeId;
      hostEl.setAttribute(getHostScopeAttribute(newScopeId), '');

      this.hostScopeMap.set(hostEl, reScope(baseScope, newScopeId));
      this.count++;

    } else {
      baseScope.styleEl = styleEl;
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
    if (scope && scope.isDynamic) {
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
      scope = parseCSS(cssText, !!cssScopeId);
      scope.cssScopeId = cssScopeId;
      this.scopesMap.set(scopeName, scope);
    }
    return scope;
  }
}
