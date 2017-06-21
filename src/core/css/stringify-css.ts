/**
 * CSS stringify adopted from rework/css by
 * TJ Holowaychuk (@tj)
 * Licensed under the MIT License
 * https://github.com/reworkcss/css/blob/master/LICENSE
 */

import { ActiveSelectors } from './active-selectors';


export class StringifyCss {
  activeSelectors: ActiveSelectors;

  constructor(activeSelectors: ActiveSelectors) {
    this.activeSelectors = activeSelectors;
  }

  /**
   * Visit `node`.
   */

  visit(node: any) {
    return (<any>this)[node.type](node);
  }

  /**
   * Map visit over array of `nodes`, optionally using a `delim`
   */

  mapVisit(nodes: any, delim?: any) {
    var buf = '';
    delim = delim || '';

    for (var i = 0, length = nodes.length; i < length; i++) {
      buf += this.visit(nodes[i]);
      if (delim && i < length - 1) buf += delim;
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
    return '@media ' + node.media + '{' + this.mapVisit(node.rules) + '}';
  }

  /**
   * Visit document node.
   */

  document(node: any) {
    var doc = '@' + (node.vendor || '') + 'document ' + node.document;
    return doc + '{' + this.mapVisit(node.rules) + '}';
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
    return '@supports ' + node.supports + '{' + this.mapVisit(node.rules) + '}';
  }

  /**
   * Visit keyframes node.
   */

  keyframes(node: any) {
    return '@'
      + (node.vendor || '')
      + 'keyframes '
      + node.name
      + '{'
      + this.mapVisit(node.keyframes)
      + '}';
  }

  /**
   * Visit keyframe node.
   */

  keyframe(node: any) {
    var decls = node.declarations;

    return node.values.join(',') + '{' + this.mapVisit(decls) + '}';
  }

  /**
   * Visit page node.
   */

  page(node: any) {
    var sel = node.selectors.length
      ? node.selectors.join(', ')
      : '';

    return '@page ' + sel + '{' + this.mapVisit(node.declarations) + '}';
  }

  /**
   * Visit font-face node.
   */

  ['font-face'](node: any) {
    return '@font-face{' + this.mapVisit(node.declarations) + '}';
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
    var decls = node.declarations;
    if (!decls.length) return '';

    var j: number;
    for (var i = node.selectors.length - 1; i >= 0; i--) {
      var sel = getSelectors(node.selectors[i]);
      var include = true;

      // classes
      var jlen = sel.classNames.length;
      if (jlen > 0) {
        for (j = 0; j < jlen; j++) {
          if (this.activeSelectors.classNames.indexOf(sel.classNames[j]) === -1) {
            include = false;
            break;
          }
        }
      }

      // tags
      if (include) {
        jlen = sel.tags.length;
        if (jlen > 0) {
          for (j = 0; j < jlen; j++) {
            if (this.activeSelectors.tags.indexOf(sel.tags[j]) === -1) {
              include = false;
              break;
            }
          }
        }
      }

      // attrs
      if (include) {
        jlen = sel.attrs.length;
        if (jlen > 0) {
          for (j = 0; j < jlen; j++) {
            if (this.activeSelectors.attrs.indexOf(sel.attrs[j]) === -1) {
              include = false;
              break;
            }
          }
        }
      }

      // ids
      if (include) {
        jlen = sel.ids.length;
        if (jlen > 0) {
          for (j = 0; j < jlen; j++) {
            if (this.activeSelectors.ids.indexOf(sel.ids[j]) === -1) {
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

    if (node.selectors.length === 0) return '';

    return node.selectors + '{' + this.mapVisit(decls) + '}';
  }

  /**
   * Visit declaration node.
   */

  declaration(node: any) {
    return node.property + ':' + node.value + ';';
  }

}

const SELECTORS: { tags: string[], classNames: string[], ids: string[], attrs: string[] } = {
  tags: [],
  classNames: [],
  ids: [],
  attrs: []
};


export function getSelectors(sel: string) {
  SELECTORS.tags.length = SELECTORS.classNames.length = SELECTORS.ids.length = SELECTORS.attrs.length = 0;

  sel = sel.replace(/\./g, ' .')
           .replace(/\#/g, ' #')
           .replace(/\[/g, ' [')
           .replace(/\>/g, ' > ')
           .replace(/\+/g, ' + ')
           .replace(/\~/g, ' ~ ')
           .replace(/\*/g, ' * ')
           .replace(/\:not\((.*?)\)/g, ' ');

  const items = sel.split(' ');

  for (var i = 0; i < items.length; i++) {
    items[i] = items[i].split(':')[0];

    if (items[i].length === 0) continue;

    if (items[i].charAt(0) === '.') {
      SELECTORS.classNames.push(items[i].substr(1));

    } else if (items[i].charAt(0) === '#') {
      SELECTORS.ids.push(items[i].substr(1));

    } else if (items[i].charAt(0) === '[') {
      items[i] = items[i].substr(1).split('=')[0].split(']')[0].trim();
      SELECTORS.attrs.push(items[i].toLowerCase());

    } else if (/[a-z]/g.test(items[i].charAt(0))) {
      SELECTORS.tags.push(items[i].toLowerCase());
    }
  }

  SELECTORS.classNames = SELECTORS.classNames.sort((a, b) => {
    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    return 0;
  });

  return SELECTORS;
}
