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

            const convertedArgs = convertJsxToVNode(fileMeta, callNode.arguments);
            node = ts.updateCall(callNode, callNode.expression, null, convertedArgs);
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


function convertJsxToVNode(fileMeta: FileMeta, args: ts.NodeArray<ts.Expression>): ts.Expression[] {
  const [tag, props, ...children] = args;
  const tagName = (<ts.StringLiteral>tag).text;
  const namespace = getNamespace(tagName);
  let newProps: ts.ObjectLiteralExpression;
  let newArgs: ts.Expression[] = [tag];

  updateFileMetaWithSlots(fileMeta, tagName, props);

  // If call has props and it is an object -> h('div', {})
  if (props && props.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    const jsxAttrs = util.objectLiteralToObjectMap(props as ts.ObjectLiteralExpression);

    newProps = parseJsxAttrs(jsxAttrs);
  }

  // If there is a namespace
  if (namespace !== undefined) {
    newProps = newProps || ts.createObjectLiteral();
    ts.updateObjectLiteral(newProps, [
      ts.createPropertyAssignment('n', ts.createLiteral(namespace))
    ]);
  }

  // If there are no props then set the value as a zero
  newArgs.push(newProps || ts.createLiteral(0));

  // If there are children then add them to the end of the arg list.
  if (children && children.length > 0) {
    newArgs = newArgs.concat(
      updateVNodeChildren(children)
    );
  }

  return newArgs;
}


function getNamespace(tagName: string): ts.StringLiteral | undefined {
  const tag = tagName.toLowerCase();

  if (tag === 'svg') {
    ts.createLiteral('http://www.w3.org/2000/svg');
  }

  return undefined;
}


function updateFileMetaWithSlots(fileMeta: FileMeta, tagName: string, props: ts.Expression) {
  const tag = tagName.toLowerCase();

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


function parseJsxAttrs(jsxAttrs: util.ObjectMap): ts.ObjectLiteralExpression {
  let vnodeInfo: util.ObjectMap = {};
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
          vnodeInfo.c = util.objectMapToObjectLiteral(exp);
        } else {
          vnodeInfo.c = exp;
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
      vnodeInfo.k = exp;

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
    vnodeInfo.c = classStringToClassObj(classNameStr);
  }

  styleStr = styleStr.replace(/['"]+/g, '').trim();
  if (styleStr.length) {
    vnodeInfo.s = styleStringToStyleObj(styleStr);
  }

  if (eventListeners) {
    vnodeInfo.o = util.objectMapToObjectLiteral(eventListeners);
  }

  if (attrs) {
    vnodeInfo.a = util.objectMapToObjectLiteral(attrs);
  }

  if (props) {
    vnodeInfo.p = util.objectMapToObjectLiteral(props);
  }

  return util.objectMapToObjectLiteral(vnodeInfo);
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

const KNOWN_EVENT_LISTENERS = ['onabort', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onauxclick', 'onbeforecopy', 'onbeforecut', 'onbeforepaste', 'onbeforeunload', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncopy', 'oncuechange', 'oncut', 'ondblclick', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'onpopstate', 'onprogress', 'onratechange', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onselectstart', 'onshow', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvolumechange', 'onwaiting', 'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkitfullscreenchange', 'onwebkitfullscreenerror', 'onwebkittransitionend', 'onwheel'];
const KNOWN_ATTR_NAMES = ['slot', 'hidden', 'disabled'];
