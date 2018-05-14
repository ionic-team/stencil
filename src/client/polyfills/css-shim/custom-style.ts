import { loadLinkStyles } from './load-link-styles';
import { StyleInfo, StyleNode } from './css-parse';
import { StyleProperties } from './style-properties';
import * as StyleUtil from './style-util';


export class CustomStyle {
  private customStyles: StyleElement[] = [];
  private documentOwner: HTMLElement;
  private documentOwnerStyleInfo: any;
  private enqueued = false;
  private flushCallbacks: Function[] = [];
  private styleProperties: StyleProperties;
  supportsCssVars: boolean;


  constructor(private win: Window, private doc: Document) {
    this.supportsCssVars = !!((win as any).CSS && (win as any).CSS.supports && (win as any).CSS.supports('color', 'var(--c)'));

    if (!this.supportsCssVars) {
      this.documentOwner = doc.documentElement;
      const ast = new StyleNode();
      ast.rules = [];
      this.documentOwnerStyleInfo = StyleInfo.set(this.documentOwner, new StyleInfo(ast));
      this.styleProperties = new StyleProperties(win);
    }
  }

  init(cb?: Function) {
    if (this.supportsCssVars) {
      cb && cb();

    } else {
      this.win.requestAnimationFrame(() => {
        const promises: Promise<any>[] = [];

        const linkElms = this.doc.querySelectorAll('link[rel="stylesheet"][href]');
        for (var i = 0; i < linkElms.length; i++) {
          promises.push(loadLinkStyles(this.doc, this, linkElms[i] as any));
        }

        const styleElms = this.doc.querySelectorAll('style');
        for (i = 0; i < styleElms.length; i++) {
          promises.push(this.addStyle(styleElms[i]));
        }

        Promise.all(promises).then(() => {
          cb && cb();
        });
      });
    }
  }

  private flushCustomStyles() {
    const customStyles = this.processStyles();

    // early return if custom-styles don't need validation
    if (!this.enqueued) {
      return;
    }

    this.updateProperties(this.documentOwner, this.documentOwnerStyleInfo);
    this.applyCustomStyles(customStyles);
    this.enqueued = false;

    while (this.flushCallbacks.length) {
      this.flushCallbacks.shift()();
    }
  }

  private applyCustomStyles(customStyles: any) {
    for (let i = 0; i < customStyles.length; i++) {
      const c = customStyles[i];
      const s = this.getStyleForCustomStyle(c);
      if (s) {
        this.styleProperties.applyCustomStyle(s, this.documentOwnerStyleInfo.styleProperties);
      }
    }
  }

  private updateProperties(host: any, styleInfo: any) {
    const owner = this.documentOwner;
    const ownerStyleInfo = StyleInfo.get(owner);
    const ownerProperties = ownerStyleInfo.styleProperties;
    const props = Object.create(ownerProperties || null);
    const propertyData = this.styleProperties.propertyDataFromStyles(ownerStyleInfo.styleRules, host);
    const propertiesMatchingHost = propertyData.properties;

    Object.assign(
      props,
      propertiesMatchingHost
    );

    this.styleProperties.reify(props);

    styleInfo.styleProperties = props;
  }

  addStyle(style: any) {
    return new Promise(resolve => {
      if (!(style as StyleElement).__seen) {
        (style as StyleElement).__seen = true;

        this.customStyles.push(style);
        this.flushCallbacks.push(resolve);

        if (!this.enqueued) {
          this.enqueued = true;

          this.win.requestAnimationFrame(() => {
            if (this.enqueued) {
              this.flushCustomStyles();
            }
          });
        }

      } else {
        resolve();
      }
    });
  }

  private getStyleForCustomStyle(customStyle: StyleElement) {
    if (customStyle.__cached) {
      return customStyle.__cached;
    }

    return (customStyle.getStyle) ? customStyle.getStyle() : customStyle;
  }

  private processStyles() {
    const cs = this.customStyles;

    for (let i = 0; i < cs.length; i++) {
      const customStyle = cs[i];

      if (customStyle.__cached) {
        continue;
      }

      const style: any = this.getStyleForCustomStyle(customStyle);
      if (style) {
        this.transformCustomStyleForDocument(style);
        customStyle.__cached = style;
      }
    }
    return cs;
  }

  private transformCustomStyleForDocument(style: StyleElement) {
    const ast = StyleUtil.rulesForStyle(style);
    this.documentOwnerStyleInfo.styleRules.rules.push(ast);
  }
}


export interface StyleElement extends HTMLStyleElement {
  __seen: boolean;
  __cached: string;
  __cssRules: StyleNode;
  getStyle: () => string;
}
