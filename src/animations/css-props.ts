

function getCss(docEle: HTMLElement) {
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
  var isWebkit = css.transitionProp.indexOf('webkit') > -1;

  // transition duration
  css.transitionDurationProp = (isWebkit ? '-webkit-' : '') + 'transition-duration';

  // transition timing function
  css.transitionTimingFnProp = (isWebkit ? '-webkit-' : '') + 'transition-timing-function';

  return css;
}


export const Css = getCss(document.documentElement);
