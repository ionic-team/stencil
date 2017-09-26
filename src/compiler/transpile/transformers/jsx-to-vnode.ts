import { SLOT_TAG } from '../../../util/constants';
import * as ts from 'typescript';
import * as util from './util';


export function jsxToVNode(transformContext: ts.TransformationContext) {

  return (tsSourceFile: ts.SourceFile) => {
    return visit(tsSourceFile, null) as ts.SourceFile;

    function visit(node: ts.Node, parentNamespace: string): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const callNode = node as ts.CallExpression;
          let parentNamespaceResponse;

          if ((<ts.Identifier>callNode.expression).text === 'h') {
            const tag = callNode.arguments[0];
            if (tag && typeof (tag as ts.StringLiteral).text === 'string') {
              [node, parentNamespaceResponse] = convertJsxToVNode(callNode, parentNamespace);

              if (parentNamespaceResponse) {
                parentNamespace = parentNamespaceResponse;
              }
            }
          }

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node, parentNamespace);
          }, transformContext);
      }
    }
  };
}


function convertJsxToVNode(callNode: ts.CallExpression, parentNamespace: string | null): [ts.CallExpression, string | null] {
  const [tag, props, ...children] = callNode.arguments;
  const tagName = (<ts.StringLiteral>tag).text.trim().toLowerCase();
  let newArgs: ts.Expression[] = [];
  let vnodeData: VNodeData = {};
  let namespace: string = null;

  if (tagName === 'slot') {
    // this is a slot element
    newArgs.push(ts.createNumericLiteral(SLOT_TAG.toString()));

  } else {
    // normal html element
    newArgs.push(tag);
  }

  // check if there should be a namespace: <svg> or <math>
  namespace = parentNamespace || NAMESPACE_MAP[tagName];

  // If call has props and it is an object -> h('div', {})
  if (props && props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    const jsxAttrs = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);

    vnodeData = alterJsxAttrs(jsxAttrs, namespace);

    // create the vnode data arg, if there is any vnode data
    if (Object.keys(vnodeData).length) {
      newArgs.push(util.objectMapToObjectLiteral(vnodeData));

    } else {
      // If there are no props then set the value as a zero
      newArgs.push(ts.createLiteral(0));
    }
  } else if (props && props.kind === ts.SyntaxKind.CallExpression) {
    newArgs.push(props);
  } else {
    newArgs.push(ts.createLiteral(0));
  }

  // If there are children then add them to the end of the arg list.
  if (children && children.length > 0) {
    newArgs = newArgs.concat(
      updateVNodeChildren(children)
    );
  }

  return [
    ts.updateCall(callNode, callNode.expression, null, newArgs),
    namespace
  ];
}


function alterJsxAttrs(jsxAttrs: util.ObjectMap, namespace: string | null): VNodeData {
  let classNameStr = '';
  let styleStr = '';
  let eventListeners: any = null;
  let attrs: any = null;
  let props: any = null;
  const vnodeData: VNodeData = {};

  if (namespace) {
    vnodeData.n = ts.createLiteral(namespace);
  }

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

  return vnodeData;
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

const KNOWN_ATTR_NAMES = ['slot', 'hidden', 'disabled', 'autoFocus', 'autoComplete', 'contenteditable'];

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
