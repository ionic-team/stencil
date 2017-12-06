import { StyleNode, StyleInfo } from './css-parse';
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


  constructor(private win: Window, doc: Document) {
    this.supportsCssVars = !!((win as any).CSS && (win as any).CSS.supports && (win as any).CSS.supports('color', 'var(--c)'));

    if (!this.supportsCssVars) {
      this.documentOwner = doc.documentElement;
      let ast = new StyleNode();
      ast.rules = [];
      this.documentOwnerStyleInfo = StyleInfo.set(this.documentOwner, new StyleInfo(ast));
      this.styleProperties = new StyleProperties(win);
    }
  }

  private flushCustomStyles() {
    let customStyles = this.processStyles();

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
      let c = customStyles[i];
      let s = this.getStyleForCustomStyle(c);
      if (s) {
        this.styleProperties.applyCustomStyle(s, this.documentOwnerStyleInfo.styleProperties);
      }
    }
  }

  private updateProperties(host: any, styleInfo: any) {
    let owner = this.documentOwner;
    let ownerStyleInfo = StyleInfo.get(owner);
    let ownerProperties = ownerStyleInfo.styleProperties;
    let props = Object.create(ownerProperties || null);
    let propertyData = this.styleProperties.propertyDataFromStyles(ownerStyleInfo.styleRules, host);
    let propertiesMatchingHost = propertyData.properties;

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

    let style;
    if (customStyle.getStyle) {
      style = customStyle.getStyle();
    } else {
      style = customStyle;
    }

    return style;
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
    let ast = StyleUtil.rulesForStyle(style);
    this.documentOwnerStyleInfo.styleRules.rules.push(ast);
  }
}


export interface StyleElement extends HTMLStyleElement {
  __seen: boolean;
  __cached: string;
  __cssRules: StyleNode;
  getStyle: () => string;
}
