import * as d from '../declarations';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../util/constants';
import { getScopeId } from '../util/scope';


export function serverInitStyle(domApi: d.DomApi, appliedStyleIds: Set<string>, cmpCtr: d.ComponentConstructor) {
  if (!cmpCtr || !cmpCtr.style) {
    // no styles
    return;
  }

  const styleId = cmpCtr.is + (cmpCtr.styleMode || DEFAULT_STYLE_MODE);

  if (appliedStyleIds.has(styleId)) {
    // already initialized
    return;
  }

  appliedStyleIds.add(styleId);

  const styleElm = domApi.$createElement('style');
  styleElm.setAttribute('data-styles', '');
  styleElm.innerHTML = cmpCtr.style;

  domApi.$appendChild(domApi.$doc.head, styleElm);
}


export function serverAttachStyles(plt: d.PlatformApi, appliedStyleIds: Set<string>, cmpMeta: d.ComponentMeta, hostElm: d.HostElement) {
  const shouldScopeCss = (cmpMeta.encapsulationMeta === ENCAPSULATION.ScopedCss || (cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom && !plt.domApi.$supportsShadowDom));

  // create the style id w/ the host element's mode
  const styleModeId = cmpMeta.tagNameMeta + hostElm.mode;

  if (shouldScopeCss) {
    hostElm['s-sc'] = getScopeId(cmpMeta, hostElm.mode);
  }

  if (!appliedStyleIds.has(styleModeId)) {
    // doesn't look like there's a style template with the mode
    // create the style id using the default style mode and try again
    if (shouldScopeCss) {
      hostElm['s-sc'] = getScopeId(cmpMeta);
    }
  }
}
