import { ModuleFiles, ModuleFileMeta } from '../../interfaces';
import { HAS_SLOTS, HAS_NAMED_SLOTS, SLOT_TAG } from '../../../util/constants';
import * as ts from 'typescript';
import * as util from './util';


export function jsxToVNode(moduleFiles: ModuleFiles): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {

    function visit(moduleFile: ModuleFileMeta, node: ts.Node, parentNamespace: string): ts.VisitResult<ts.Node> {

      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const callNode = node as ts.CallExpression;

          if ((<ts.Identifier>callNode.expression).text === 'h') {
            const data: ParentData = { namespace: parentNamespace };

            node = convertJsxToVNode(moduleFile, callNode, data);

            if (data.namespace) {
              parentNamespace = data.namespace;
            }
          }

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(moduleFile, node, parentNamespace);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const moduleFile = moduleFiles[tsSourceFile.fileName];
      return visit(moduleFile, tsSourceFile, null) as ts.SourceFile;
    };
  };
}


function convertJsxToVNode(fileMeta: ModuleFileMeta, callNode: ts.CallExpression, data: ParentData) {
  const [tag, props, ...children] = callNode.arguments;
  const tagName = (<ts.StringLiteral>tag).text.trim().toLowerCase();
  let newArgs: ts.Expression[] = [];
  const vnodeData: VNodeData = {};

  if (tagName === 'slot') {
    // this is a slot element
    newArgs.push(ts.createNumericLiteral(SLOT_TAG.toString()));
    updateFileMetaWithSlots(fileMeta, props);

  } else {
    // normal html element
    newArgs.push(tag);
  }

  // check if there should be a namespace: <svg> or <math>
  if (data.namespace) {
    vnodeData.n = ts.createLiteral(data.namespace);

  } else {
    const namespace = NAMESPACE_MAP[tagName];
    if (namespace) {
      vnodeData.n = ts.createLiteral(namespace);
      data.namespace = namespace;
    }
  }

  // If call has props and it is an object -> h('div', {})
  if (props && props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    const jsxAttrs = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);

    parseJsxAttrs(vnodeData, jsxAttrs);
  }

  // create the vnode data arg, if there is any vnode data
  if (Object.keys(vnodeData).length) {
    newArgs.push(util.objectMapToObjectLiteral(vnodeData));

  } else {
    // If there are no props then set the value as a zero
    newArgs.push(ts.createLiteral(0));
  }


  // If there are children then add them to the end of the arg list.
  if (children && children.length > 0) {
    newArgs = newArgs.concat(
      updateVNodeChildren(children)
    );
  }

  return ts.updateCall(callNode, callNode.expression, null, newArgs);
}


function parseJsxAttrs(vnodeData: VNodeData, jsxAttrs: util.ObjectMap) {
  let classNameStr = '';
  let styleStr = '';
  let eventListeners: any = null;
  let attrs: any = null;
  let props: any = null;

  for (var jsxAttrName in jsxAttrs) {
    var exp: ts.Expression = <any>jsxAttrs[jsxAttrName];

    var jsxAttrNameSplit = jsxAttrName.split('-');

    if (isClassName(jsxAttrName)) {
      // class
      if (exp.kind === ts.SyntaxKind.StringLiteral) {
        classNameStr += ' ' + exp.getText().trim();
      } else {
        if (util.isInstanceOfObjectMap(exp)) {
          vnodeData.c = util.objectMapToObjectLiteral(exp);
        } else {
          vnodeData.c = exp;
        }
      }

    } else if (isStyle(jsxAttrName)) {
      // style
      if (exp.kind === ts.SyntaxKind.StringLiteral) {
        styleStr += ';' + exp.getText().trim();
      } else {
        if (util.isInstanceOfObjectMap(exp)) {
          vnodeData.s = util.objectMapToObjectLiteral(exp);
        } else {
          vnodeData.s = exp;
        }
      }

    } else if (isKey(jsxAttrName)) {
      // key
      vnodeData.k = exp;

    } else if (isHyphenedEventListener(jsxAttrNameSplit, exp)) {
      // on-click
      eventListeners = eventListeners || {};
      eventListeners[jsxAttrNameSplit.slice(1).join('-')] = exp;

    } else if (isStandardizedEventListener(jsxAttrName, exp)) {
      // onClick
      eventListeners = eventListeners || {};
      eventListeners[jsxAttrName.toLowerCase().substring(2)] = exp;

    } else if (isAttr(jsxAttrName, vnodeData, exp)) {
      // attrs
      attrs = attrs || {};

      var attrName = jsxAttrName;

      attrs[attrName] = exp;

    } else if (isPropsName(jsxAttrName)) {
      // passed an actual "props" attribute
      // probably containing an object of props data
      if (util.isInstanceOfObjectMap(exp)) {
        vnodeData.p = util.objectMapToObjectLiteral(exp);
      } else {
        vnodeData.p = exp;
      }

    } else {
      // props
      props = props || {};
      props[jsxAttrName] = exp;
    }
  }

  classNameStr = classNameStr.replace(/['"]+/g, '').trim();
  if (classNameStr.length) {
    vnodeData.c = classStringToClassObj(classNameStr);
  }

  styleStr = styleStr.replace(/['"]+/g, '').trim();
  if (styleStr.length) {
    vnodeData.s = styleStringToStyleObj(styleStr);
  }

  if (eventListeners) {
    vnodeData.o = util.objectMapToObjectLiteral(eventListeners);
  }

  if (attrs) {
    vnodeData.a = util.objectMapToObjectLiteral(attrs);
  }

  if (props) {
    vnodeData.p = util.objectMapToObjectLiteral(props);
  }
}


function updateFileMetaWithSlots(fileMeta: ModuleFileMeta, props: ts.Expression) {
  // checking if there is a default slot and/or named slots in the compiler
  // so that during runtime there is less work to do

  if (!fileMeta || !fileMeta.hasCmpClass) {
    return;
  }

  if (fileMeta.cmpMeta.slotMeta === undefined) {
    fileMeta.cmpMeta.slotMeta = HAS_SLOTS;
  }

  if (props && props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    const jsxAttrs = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);

    for (var attrName in jsxAttrs) {
      if (attrName.toLowerCase().trim() === 'name') {
        var attrValue: string = (<any>jsxAttrs[attrName]).text.trim();

        if (attrValue.length > 0) {
          fileMeta.cmpMeta.slotMeta = HAS_NAMED_SLOTS;
          break;
        }
      }
    }
  }
}


function updateVNodeChildren(items: ts.Expression[]): ts.Expression[] {
  return items.map(node => {
    switch (node.kind) {
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
    case ts.SyntaxKind.NullKeyword:
      return ts.createCall(ts.createIdentifier('t'), null, [ts.createLiteral('')]);
    case ts.SyntaxKind.NumericLiteral:
      return ts.createCall(ts.createIdentifier('t'), null, [ts.createLiteral((<ts.NumericLiteral>node).text)]);
    case ts.SyntaxKind.StringLiteral:
      return ts.createCall(ts.createIdentifier('t'), null, [node]);
    }

    return node;
  });
}


function isClassName(attrName: string) {
  attrName = attrName.toLowerCase();
  return (attrName === 'class' || attrName === 'classname');
}


function isStyle(attrName: string) {
  return (attrName.toLowerCase() === 'style');
}


function isKey(attrName: string) {
  return (attrName.toLowerCase() === 'key');
}


function isHyphenedEventListener(attrNameSplit: string[], exp: ts.Expression) {
  if (exp.kind !== ts.SyntaxKind.FunctionExpression && exp.kind !== ts.SyntaxKind.CallExpression) {
    return false;
  }

  return (attrNameSplit.length > 1 && attrNameSplit[0].toLowerCase() === 'on');
}


function isStandardizedEventListener(attrName: string, exp: ts.Expression) {
  if (exp.kind !== ts.SyntaxKind.FunctionExpression && exp.kind !== ts.SyntaxKind.CallExpression) {
    return false;
  }

  attrName = attrName.toLowerCase();

  if (attrName.substr(0, 2) !== 'on') {
    return false;
  }

  return (KNOWN_EVENT_LISTENERS.indexOf(attrName) > -1);
}


function isAttr(attrName: string, vnodeData: VNodeData, exp: ts.Expression) {
  if (vnodeData.n) {
    // always use attributes when the element is namespaced
    return true;
  }
  if (exp.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    return false;
  }
  if (exp.kind === ts.SyntaxKind.CallExpression) {
    return false;
  }
  if (exp.kind === ts.SyntaxKind.ArrayLiteralExpression) {
    return false;
  }
  if (exp.kind === ts.SyntaxKind.FunctionExpression) {
    return false;
  }
  if (attrName.indexOf('-') > -1) {
    return true;
  }
  if (KNOWN_ATTR_NAMES.indexOf(attrName) > -1) {
    return true;
  }
  if (/[A-Z]/.test(attrName)) {
    return false;
  }
  if (exp.kind === ts.SyntaxKind.StringLiteral) {
    return true;
  }
  return false;
}


function isPropsName(attrName: string) {
  attrName = attrName.toLowerCase();
  return (attrName === 'props');
}


function classStringToClassObj(className: string) {
  const obj = className
    .split(' ')
    .reduce((obj: {[key: string]: ts.BooleanLiteral}, className: string): {[key: string]: ts.BooleanLiteral} => {
      const o = Object.assign({}, obj);
      o[className] = ts.createTrue();
      return o;
    }, <{[key: string]: ts.BooleanLiteral}>{});

  return util.objectMapToObjectLiteral(obj);
}

function styleStringToStyleObj(styles: string) {
  styles;
  // TODO
  // const obj = styles
  //   .split(';')
  //   .reduce((obj: {[key: string]: ts.BooleanLiteral}, style: string): {[key: string]: ts.BooleanLiteral} => {
  //     const o = Object.assign({}, obj);
  //     o[className] = ts.createTrue();
  //     return o;
  //   }, <{[key: string]: ts.BooleanLiteral}>{});

  return util.objectMapToObjectLiteral({});
}

const KNOWN_EVENT_LISTENERS = ['onabort', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onauxclick', 'onbeforecopy', 'onbeforecut', 'onbeforepaste', 'onbeforeunload', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncopy', 'oncuechange', 'oncut', 'ondblclick', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'onpopstate', 'onprogress', 'onratechange', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onselectstart', 'onshow', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvolumechange', 'onwaiting', 'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkitfullscreenchange', 'onwebkitfullscreenerror', 'onwebkittransitionend', 'onwheel'];

const KNOWN_ATTR_NAMES = ['slot', 'hidden', 'disabled'];

const NAMESPACE_MAP: {[tag: string]: string} = {
  'svg': 'http://www.w3.org/2000/svg',
  'math': 'http://www.w3.org/1998/Math/MathML'
};


interface VNodeData {
  /**
   * classes
   */
  c?: any;

  /**
   * props
   */
  p?: any;

  /**
   * attrs
   */
  a?: any;

  /**
   * on (event listeners)
   */
  o?: any;

  /**
   * styles
   */
  s?: any;

  /**
   * key
   */
  k?: any;

  /**
   * namespace
   */
  n?: any;
}

interface ParentData {
  namespace?: string;
}
