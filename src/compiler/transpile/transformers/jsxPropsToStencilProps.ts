export function jsxPropsToStencilProps(obj: KeyValueProps, namespace: string = null) {
  const vNodeData: VNodeData = {};
  if (namespace) {
    vNodeData['n'] = namespace;
  }

  return Object.keys(obj).reduce((stencilProps, propName) => {
    let propValue = obj[propName];

    if (isClassName(propName)) {
      let classValue;
      if (typeof propValue === 'string') {
        classValue = propValue
          .replace(/['"]+/g, '')
          .trim()
          .split(' ')
          .reduce((obj, className) => {
            return {
              ...obj,
              [className]: true
            };
          }, <ClassObject>{});
      }
      if (typeof propValue === 'object') {
        classValue = propValue;
      }
      return {
        c: classValue,
        ...stencilProps
      };
    }

    if (isStyle(propName)) {
      let styleValue;
      if (typeof propValue === 'string') {
        styleValue = propValue
          .replace(/['"]+/g, '')
          .trim()
          .split(';')
          .reduce((obj, style) => {
            const [styleName, styleValue] = style.split(':');
            return {
              ...obj,
              [styleName.trim()]: styleValue.trim()
            };
          }, <StyleObject>{});
      }
      if (typeof propValue === 'object') {
        styleValue = propValue;
      }
      return {
        s: styleValue,
        ...stencilProps
      };
    }

    if (isKey(propName)) {
      return {
        k: propValue,
        ...stencilProps
      };
    }

    if (isHyphenedEventListener(propName, propValue)) {
      return {
        o: {
          [propName.replace(/^.*?-/, '')]: propValue,
          ...stencilProps.o
        },
        ...stencilProps
      };
    }

    if (isStandardizedEventListener(propName, propValue)) {
      return {
        o: {
          [propName.substring(2)]: propValue,
          ...stencilProps.o
        },
        ...stencilProps
      };
    }

    if (namespace || isAttr(propName, propValue)) {
      return {
        a: {
          [propName]: propValue,
          ...stencilProps.a
        },
        ...stencilProps
      };
    }

    if (isPropsName(propName)) {
      return {
        p: propValue,
        ...stencilProps
      };
    }

    // Its a prop
    return {
      p: {
        [propName]: propValue,
        ...stencilProps.p
      },
      ...stencilProps
    };
  }, vNodeData);
}


function isClassName(propName: string) {
  propName = propName.toLowerCase();
  return (propName === 'class' || propName === 'classname');
}

function isStyle(propName: string) {
  propName = propName.toLowerCase();
  return (propName === 'style');
}

function isKey(propName: string) {
  propName = propName.toLowerCase();
  return (propName === 'key');
}

function isPropsName(propName: string) {
  propName = propName.toLowerCase();
  return (propName === 'props');
}

function isHyphenedEventListener(propName: string, propValue: any) {
  propName = propName.toLowerCase();
  if (typeof propValue !== 'function') {
    return false;
  }
  return propName.match(/^on-/) !== null;
}

function isStandardizedEventListener(propName: string, propValue: any) {
  propName = propName.toLowerCase();
  if (typeof propValue !== 'function') {
    return false;
  }
  if (propName.match(/^on/) !== null) {
    return false;
  }
  return (KNOWN_EVENT_LISTENERS.indexOf(propName) > -1);
}

function isAttr(propName: string, propValue: any) {
  if (typeof propValue !== 'string' ||
    typeof propValue !== 'boolean' ||
    typeof propValue !== 'number'
  ) {
    return false;
  }
  if (propName.indexOf('-') > -1) {
    return true;
  }
  if (KNOWN_ATTR_NAMES.indexOf(propName) > -1) {
    return true;
  }
  if (/[A-Z]/.test(propName)) {
    return false;
  }
  if (typeof propValue === 'string') {
    return true;
  }
  return false;
}


const KNOWN_EVENT_LISTENERS = [
  'onabort', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onauxclick', 'onbeforecopy', 'onbeforecut', 'onbeforepaste', 'onbeforeunload', 'onblur',
  'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncopy', 'oncuechange', 'oncut', 'ondblclick', 'ondevicemotion',
  'ondeviceorientation', 'ondeviceorientationabsolute', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange',
  'onemptied', 'onended', 'onerror', 'onfocus', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange',
  'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove',
  'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying',
  'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'onpopstate', 'onprogress',
  'onratechange', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onselectstart', 'onshow', 'onstalled',
  'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvolumechange', 'onwaiting',
  'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkitfullscreenchange', 'onwebkitfullscreenerror', 'onwebkittransitionend', 'onwheel'];

const KNOWN_ATTR_NAMES = ['slot', 'hidden', 'disabled', 'autoFocus', 'autoComplete', 'contenteditable'];

export interface KeyValueProps {
  [key: string]: any;
}
export interface ClassObject {
  [key: string]: boolean;
}
export interface StyleObject {
  [key: string]: string;
}
export interface EventObject {
  [key: string]: Function;
}

export interface VNodeData {
  /**
   * classes
   */
  c?: ClassObject;

  /**
   * styles
   */
  s?: KeyValueProps;

  /**
   * props
   */
  p?: KeyValueProps;

  /**
   * attrs
   */
  a?: KeyValueProps;

  /**
   * on (event listeners)
   */
  o?: EventObject;

  /**
   * key
   */
  k?: string | number;

  /**
   * namespace
   */
  n?: string;
}
