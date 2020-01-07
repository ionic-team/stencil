/**
 * CSS stringify adopted from rework/css by
 * TJ Holowaychuk (@tj)
 * Licensed under the MIT License
 * https://github.com/reworkcss/css/blob/master/LICENSE
 */
import { getSelectors } from './get-selectors';
import { UsedSelectors } from './used-selectors';


export class StringifyCss {
  usedSelectors: UsedSelectors;
  hasUsedAttrs: boolean;
  hasUsedClassNames: boolean;
  hasUsedIds: boolean;
  hasUsedTags: boolean;
  removeWhitespace: boolean;
  removeTrailingSemicolon: boolean;

  constructor(opts: StringifyCssOptions) {
    this.usedSelectors = opts.usedSelectors;
    this.removeWhitespace = !!opts.removeWhitespace;
    this.removeTrailingSemicolon = !!opts.removeTrailingSemicolon;

    if (this.usedSelectors) {
      this.hasUsedAttrs = this.usedSelectors.attrs.size > 0;
      this.hasUsedClassNames = this.usedSelectors.classNames.size > 0;
      this.hasUsedIds = this.usedSelectors.ids.size > 0;
      this.hasUsedTags = this.usedSelectors.tags.size > 0;
    }
  }

  /**
   * Visit `node`.
   */
  visit(node: any, index: number, len: number) {
    return (<any>this)[node.type](node, index, len);
  }

  /**
   * Map visit over array of `nodes`, optionally using a `delim`
   */
  mapVisit(nodes: any, delim?: any) {
    let buf = '';
    delim = delim || '';

    for (let i = 0, len = nodes.length; i < len; i++) {
      buf += this.visit(nodes[i], i, len);
      if (delim && i < len - 1) buf += delim;
    }

    return buf;
  }

  /**
   * Compile `node`.
   */
  compile(node: any) {
    return node.stylesheet
      .rules.map(this.visit, this)
      .join('');
  }

  comment() {
    return '';
  }

  /**
   * Visit import node.
   */
  import(node: any) {
    return '@import ' + node.import + ';';
  }

  /**
   * Visit media node.
   */
  media(node: any) {
    const mediaCss = this.mapVisit(node.rules);
    if (mediaCss === '') {
      return '';
    }
    return '@media ' + node.media + '{' + this.mapVisit(node.rules) + '}';
  }

  /**
   * Visit document node.
   */
  document(node: any) {
    const documentCss = this.mapVisit(node.rules);
    if (documentCss === '') {
      return '';
    }
    const doc = '@' + (node.vendor || '') + 'document ' + node.document;
    return doc + '{' + documentCss + '}';
  }

  /**
   * Visit charset node.
   */
  charset(node: any) {
    return '@charset ' + node.charset + ';';
  }

  /**
   * Visit namespace node.
   */
  namespace(node: any) {
    return '@namespace ' + node.namespace + ';';
  }

  /**
   * Visit supports node.
   */
  supports(node: any) {
    const supportsCss = this.mapVisit(node.rules);
    if (supportsCss === '') {
      return '';
    }
    return '@supports ' + node.supports + '{' + supportsCss + '}';
  }

  /**
   * Visit keyframes node.
   */
  keyframes(node: any) {
    const keyframesCss = this.mapVisit(node.keyframes);
    if (keyframesCss === '') {
      return '';
    }

    return '@' + (node.vendor || '') + 'keyframes ' + node.name + '{' + keyframesCss + '}';
  }

  /**
   * Visit keyframe node.
   */
  keyframe(node: any) {
    const decls = node.declarations;

    return node.values.join(',') + '{' + this.mapVisit(decls) + '}';
  }

  /**
   * Visit page node.
   */
  page(node: any) {
    const sel = node.selectors.length
      ? node.selectors.join(', ')
      : '';

    return '@page ' + sel + '{' + this.mapVisit(node.declarations) + '}';
  }

  /**
   * Visit font-face node.
   */
  ['font-face'](node: any) {
    const fontCss = this.mapVisit(node.declarations);
    if (fontCss === '') {
      return '';
    }

    return '@font-face{' + fontCss + '}';
  }

  /**
   * Visit host node.
   */
  host(node: any) {
    return '@host{' + this.mapVisit(node.rules) + '}';
  }

  /**
   * Visit custom-media node.
   */
  ['custom-media'](node: any) {
    return '@custom-media ' + node.name + ' ' + node.media + ';';
  }

  /**
   * Visit rule node.
   */
  rule(node: any) {
    const decls = node.declarations;
    if (decls == null || decls.length === 0) {
      return '';
    }

    const usedSelectors = this.usedSelectors;

    if (usedSelectors) {
      let i: number;
      let j: number;
      let include = true;

      for (i = node.selectors.length - 1; i >= 0; i--) {
        const sel = getSelectors(node.selectors[i]);
        include = true

        // classes
        let jlen = sel.classNames.length;
        if (jlen > 0 && this.hasUsedClassNames) {
          for (j = 0; j < jlen; j++) {
            if (!usedSelectors.classNames.has(sel.classNames[j])) {
              include = false;
              break;
            }
          }
        }

        // tags
        if (include && this.hasUsedTags) {
          jlen = sel.tags.length;
          if (jlen > 0) {
            for (j = 0; j < jlen; j++) {
              if (!usedSelectors.tags.has(sel.tags[j])) {
                include = false;
                break;
              }
            }
          }
        }

        // attrs
        if (include && this.hasUsedAttrs) {
          jlen = sel.attrs.length;
          if (jlen > 0) {
            for (j = 0; j < jlen; j++) {
              if (!usedSelectors.attrs.has(sel.attrs[j])) {
                include = false;
                break;
              }
            }
          }
        }

        // ids
        if (include && this.hasUsedIds) {
          jlen = sel.ids.length;
          if (jlen > 0) {
            for (j = 0; j < jlen; j++) {
              if (!usedSelectors.ids.has(sel.ids[j])) {
                include = false;
                break;
              }
            }
          }
        }

        if (!include) {
          node.selectors.splice(i, 1);
        }
      }
    }

    if (node.selectors.length === 0) {
      return '';
    }

    if (this.removeWhitespace) {
      node.selectors = node.selectors.map(removeSelectorWhitespace);
    }

    return `${node.selectors}{${this.mapVisit(decls)}}`;
  }

  /**
   * Visit declaration node.
   */
  declaration(node: any, index: number, len: number) {
    if (len - 1 === index && this.removeTrailingSemicolon) {
      return node.property + ':' + node.value;
    }
    return node.property + ':' + node.value + ';';
  }

}

const removeSelectorWhitespace = (selector: string) => {
  let rtn = '';
  let sel = '';
  let nextSel = '';
  let prev = '';
  let inAttr = false;
  selector = selector.trim();

  for (let i = 0, l = selector.length; i < l; i++) {
    sel = selector[i];
    nextSel = selector[i + 1];
    prev = rtn[rtn.length - 1];

    if (!inAttr && /\s/.test(sel)) {
      if (prev === '*') {
        rtn += sel;
        continue;
      }

      if (!/[\*\:\.\#]/g.test(nextSel)) {
        continue;
      }

      if (/[\(]/g.test(prev)) {
        continue;
      }

    } else if (sel === '[') {
      inAttr = true;
    } else if (sel === ']' && prev !== '\\' && inAttr) {
      inAttr = false;
    }
    rtn += sel;
  }

  return rtn;
};

export interface StringifyCssOptions {
  removeWhitespace?: boolean;
  removeTrailingSemicolon?: boolean;
  usedSelectors?: UsedSelectors;
}
