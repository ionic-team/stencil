import { BuildContext, FileMeta } from '../interfaces';
import * as ts from 'typescript';
import * as util from './util';


export function jsxToVNode(ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext: ts.TransformationContext) => {

    function visit(fileMeta: FileMeta, node: ts.Node): ts.VisitResult<ts.Node> {

      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          const callNode = node as ts.CallExpression;
          if ((<ts.Identifier>callNode.expression).text === 'h') {
            node = <any>convertJsxToVNode(fileMeta, callNode.arguments);
          }

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(fileMeta, node);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const fileMeta = ctx.files.get(tsSourceFile.fileName);
      if (fileMeta && fileMeta.hasCmpClass) {
        return visit(fileMeta, tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    };
  };
}


function convertJsxToVNode(fileMeta: FileMeta, args: ts.NodeArray<ts.Expression>) {
  const [tag, props, ...children] = args;
  const vnodeInfo: VNodeInfo = {};

  vnodeInfo.tagName = tag;

  parseNamespace(vnodeInfo);

  parseSlots(fileMeta, vnodeInfo, props);

  if (props && props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    const jsxAttrs = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);

    parseJsxAttrs(vnodeInfo, jsxAttrs);
  }

  parseChildren(vnodeInfo, children);

  return generateVNode(vnodeInfo);
}


function parseNamespace(vnodeInfo: VNodeInfo) {
  const tag = (<any>vnodeInfo.tagName).text.toLowerCase();

  if (tag === 'svg') {
    vnodeInfo.namespace = ts.createLiteral('http://www.w3.org/2000/svg');
  }
}


function parseSlots(fileMeta: FileMeta, vnodeInfo: VNodeInfo, props: ts.Expression) {
  const tag = (<any>vnodeInfo.tagName).text.toLowerCase();

  if (tag !== 'slot') {
    return;
  }

  fileMeta.hasSlots = true;

  if (props && props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    const jsxAttrs = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);

    for (var attrName in jsxAttrs) {
      if (attrName.toLowerCase() === 'name') {
        fileMeta.namedSlots = fileMeta.namedSlots || [];
        fileMeta.namedSlots.push((<any>jsxAttrs[attrName]).text);
      }
    }
  }
}


function parseJsxAttrs(vnodeInfo: VNodeInfo, jsxAttrs: util.ObjectMap) {
  let classNameStr = '';
  let styleStr = '';
  let eventListeners: any = null;
  let attrs: any = null;
  let props: any = null;

  for (var attrName in jsxAttrs) {
    var exp: ts.Expression = <any>jsxAttrs[attrName];

    var attrNameSplit = attrName.split('-');

    if (isClassName(attrName)) {
      // class
      if (exp.kind === ts.SyntaxKind.StringLiteral) {
        classNameStr += ' ' + exp.getText().trim();
      } else {
        if (util.isInstanceOfObjectMap(exp)) {
          vnodeInfo.class = util.objectMapToObjectLiteral(exp);
        } else {
          vnodeInfo.class = exp;
        }
      }

    } else if (isStyle(attrName)) {
      // style
      if (exp.kind === ts.SyntaxKind.StringLiteral) {
        styleStr += ';' + exp.getText().trim();
      } else {
        if (util.isInstanceOfObjectMap(exp)) {
          vnodeInfo.style = util.objectMapToObjectLiteral(exp);
        } else {
          vnodeInfo.style = exp;
        }
      }

    } else if (isKey(attrName)) {
      // key
      vnodeInfo.key = exp;

    } else if (isHyphenedEventListener(attrNameSplit, exp)) {
      // on-click
      eventListeners = eventListeners || {};
      eventListeners[attrNameSplit.slice(1).join('-')] = exp;

    } else if (isStandardizedEventListener(attrName, exp)) {
      // onClick
      eventListeners = eventListeners || {};
      eventListeners[attrName.toLowerCase().substring(2)] = exp;

    } else if (isAttr(attrName, exp)) {
      // attrs
      attrs = attrs || {};
      attrs[attrName] = exp;

    } else {
      // props
      props = props || {};
      props[attrName] = exp;
    }
  }

  classNameStr = classNameStr.replace(/['"]+/g, '').trim();
  if (classNameStr.length) {
    vnodeInfo.class = classStringToClassObj(classNameStr);
  }

  styleStr = styleStr.replace(/['"]+/g, '').trim();
  if (styleStr.length) {
    vnodeInfo.style = styleStringToStyleObj(styleStr);
  }

  if (eventListeners) {
    vnodeInfo.on = util.objectMapToObjectLiteral(eventListeners);
  }

  if (attrs) {
    vnodeInfo.attrs = util.objectMapToObjectLiteral(attrs);
  }

  if (props) {
    vnodeInfo.props = util.objectMapToObjectLiteral(props);
  }
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


function isAttr(attrName: string, exp: ts.Expression) {
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


function parseChildren(vnodeInfo: VNodeInfo, children: ts.Expression[]) {
  if (!children || !children.length) {
    return;
  }

  // for (var i = 0; i < children.length; i++) {
  //   var child = children[i];

  //   if (child.kind === ts.SyntaxKind.CallExpression && (<ts.Identifier>child).text === 'h') {
  //     continue;
  //   }

  //   var textArray: ts.Expression[] = [
  //     ts.createNumericLiteral(IS_TEXT_NODE.toString()),
  //     child
  //   ];

  //   children[i] = ts.createArrayLiteral(textArray);
  // }

  vnodeInfo.children = ts.createArrayLiteral(children);
}


function generateVNode(vnodeInfo: VNodeInfo) {

  const vnodeKeys: ts.ObjectLiteralElementLike[] = [];

  if (vnodeInfo.textValue) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('t'), vnodeInfo.textValue));
  }

  if (vnodeInfo.tagName) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('e'), vnodeInfo.tagName));
  }

  if (vnodeInfo.children) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('h'), vnodeInfo.children));
  }

  if (vnodeInfo.class) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('c'), vnodeInfo.class));
  }

  if (vnodeInfo.props) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('p'), vnodeInfo.props));
  }

  if (vnodeInfo.attrs) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('a'), vnodeInfo.attrs));
  }

  if (vnodeInfo.on) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('o'), vnodeInfo.on));
  }

  if (vnodeInfo.style) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('s'), vnodeInfo.style));
  }

  if (vnodeInfo.key) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('k'), vnodeInfo.key));
  }

  if (vnodeInfo.namespace) {
    vnodeKeys.push(ts.createPropertyAssignment(ts.createLiteral('m'), vnodeInfo.namespace));
  }

  return ts.createObjectLiteral(vnodeKeys);
}


interface VNodeInfo {
  tagName?: ts.Expression;
  children?: ts.Expression;
  textValue?: ts.Expression;
  class?: any;
  props?: any;
  attrs?: any;
  on?: any;
  style?: any;
  key?: any;
  namespace?: any;
}


const KNOWN_EVENT_LISTENERS = ['onabort', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onauxclick', 'onbeforecopy', 'onbeforecut', 'onbeforepaste', 'onbeforeunload', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncopy', 'oncuechange', 'oncut', 'ondblclick', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'onpopstate', 'onprogress', 'onratechange', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onselectstart', 'onshow', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvolumechange', 'onwaiting', 'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkitfullscreenchange', 'onwebkitfullscreenerror', 'onwebkittransitionend', 'onwheel'];
const KNOWN_ATTR_NAMES = ['slot', 'hidden', 'disabled'];
