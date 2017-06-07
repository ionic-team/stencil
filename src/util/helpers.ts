
export function isDef(v: any): boolean { return v !== undefined && v !== null; }

export function isUndef(v: any): boolean { return v === undefined || v === null; }

export function isTrue (v: any): boolean { return v === true; }

export function isFalse (v: any): boolean { return v === false; }

export function isArray(v: any): v is Array<any> { return Array.isArray(v); }

export function isObject(v: any): v is Object { return v !== null && typeof v === 'object'; }

export function isBoolean(v: any): v is (boolean) { return typeof v === 'boolean'; }

export function isString(v: any): v is (string) { return typeof v === 'string'; }

export function isNumber(v: any): v is (number) { return typeof v === 'number'; }

export function isPrimitive (v: any): boolean { return typeof v === 'string' || typeof v === 'number'; }

export function isFunction(v: any): v is (Function) { return typeof v === 'function'; }

export function isStringOrNumber(v: any): v is (string | number) { return isString(v) || isNumber(v); }

export function makeMap(str: string, expectsLowerCase?: boolean): (key: string) => true | void {
  const map = Object.create(null);
  const list: Array<string> = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val];
}

export function toDashCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => '-' + g[0].toLowerCase());
}

export function noop() {}

export function pointerCoordX(ev: any): number {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientX;
    }
    if (ev.pageX !== undefined) {
      return ev.pageX;
    }
  }
  return 0;
}

export function pointerCoordY(ev: any): number {
  // get Y coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientY;
    }
    if (ev.pageY !== undefined) {
      return ev.pageY;
    }
  }
  return 0;
}

export function getElementReference(elm: any, ref: string) {
  if (ref === 'child') {
    return elm.firstElementChild;
  }
  if (ref === 'parent') {
    return getParentElement(elm) || elm;
  }
  if (ref === 'body') {
    return elm.ownerDocument.body;
  }
  if (ref === 'document') {
    return elm.ownerDocument;
  }
  if (ref === 'window') {
    return elm.ownerDocument.defaultView;
  }
  return elm;
}

export function getParentElement(elm: any) {
  if (elm.parentElement ) {
    // normal element with a parent element
    return elm.parentElement;
  }
  if (elm.parentNode && elm.parentNode.host) {
    // shadow dom's document fragment
    return elm.parentNode.host;
  }
  return null;
}

export function applyStyles(elm: HTMLElement, styles: {[styleProp: string]: string|number}) {
  const styleProps = Object.keys(styles);

  if (elm) {
    for (var i = 0; i < styleProps.length; i++) {
      (<any>elm.style)[styleProps[i]] = styles[styleProps[i]];
    }
  }
}

export function once (fn: Function) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

/**
 * Create a cached version of a pure function.
 */
export function cached(fn: Function) {
  var cache = Object.create(null);
  return (function cachedFn(str: string) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  });
}


/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
export const hyphenate = cached(function (str: string) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase();
});

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
export const camelize = cached(function (str: string) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; });
});

/**
 * Capitalize a string.
 */
export const capitalize = cached(function (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

var hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn (obj: any, key: any) {
  return hasOwnProperty.call(obj, key);
}

export function remove (arr: any[], item: any) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
  return false;
}
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options: any,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }
  const assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id];
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) return assets[camelizedId];
  const PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    console.warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res;
}

export function isNative (Ctor: any) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

export const hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);
