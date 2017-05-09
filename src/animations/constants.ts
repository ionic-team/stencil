

export const CSS_PROP = function(docEle: HTMLElement) {
  const css: {
    transformProp?: string;
    transitionProp?: string;
    transitionDurationProp?: string;
    transitionTimingFnProp?: string;
  } = {};

  // transform
  var i: number;
  var keys = ['webkitTransform', '-webkit-transform', 'webkit-transform', 'transform'];

  for (i = 0; i < keys.length; i++) {
    if ((<any>docEle.style)[keys[i]] !== undefined) {
      css.transformProp = keys[i];
      break;
    }
  }

  // transition
  keys = ['webkitTransition', 'transition'];
  for (i = 0; i < keys.length; i++) {
    if ((<any>docEle.style)[keys[i]] !== undefined) {
      css.transitionProp = keys[i];
      break;
    }
  }

  // The only prefix we care about is webkit for transitions.
  var prefix = css.transitionProp.indexOf('webkit') > -1 ? '-webkit-' : '';

  // transition duration
  css.transitionDurationProp = prefix + 'transition-duration';

  // transition timing function
  css.transitionTimingFnProp = prefix + 'transition-timing-function';

  return css;

}(document.documentElement);


export const TRANSFORM_PROPS: {[key: string]: number} = {
  'translateX': 1,
  'translateY': 1,
  'translateZ': 1,

  'scale': 1,
  'scaleX': 1,
  'scaleY': 1,
  'scaleZ': 1,

  'rotate': 1,
  'rotateX': 1,
  'rotateY': 1,
  'rotateZ': 1,

  'skewX': 1,
  'skewY': 1,
  'perspective': 1
};

export const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
export const DURATION_MIN = 32;
export const TRANSITION_END_FALLBACK_PADDING_MS = 400;
