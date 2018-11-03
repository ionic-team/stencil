import * as d from '../declarations';
import { DEFAULT_STYLE_MODE, ENCAPSULATION } from '../util/constants';
import { getScopeId } from '../util/scope';


export function initStyleTemplate(domApi: d.DomApi, cmpMeta: d.ComponentMeta, encapsulation: ENCAPSULATION, style: string, styleMode: string, perf: Performance) {
  if (style) {

    if (_BUILD_.profile) {
      perf.mark(`init_style_template_start:${cmpMeta.tagNameMeta}`);
    }

    // we got a style mode for this component, let's create an id for this style
    const styleModeId = cmpMeta.tagNameMeta + (styleMode || DEFAULT_STYLE_MODE);

    if (!(cmpMeta as any)[styleModeId]) {
      // we don't have this style mode id initialized yet
      if (_BUILD_.es5) {
        // ie11's template polyfill doesn't fully do the trick and there's still issues
        // so instead of trying to clone templates with styles in them, we'll just
        // keep a map of the style text as a string to create <style> elements for es5 builds
        (cmpMeta as any)[styleModeId] = style;

      } else {
        // use <template> elements to clone styles
        // create the template element which will hold the styles
        // adding it to the dom via <template> so that we can
        // clone this for each potential shadow root that will need these styles
        // otherwise it'll be cloned and added to document.body.head
        // but that's for the renderer to figure out later
        const templateElm = domApi.$createElement('template') as any;

        // keep a reference to this template element within the
        // Constructor using the style mode id as the key
        (cmpMeta as any)[styleModeId] = templateElm;

        // add the style text to the template element's innerHTML
        if (_BUILD_.hotModuleReplacement) {
          // hot module replacement enabled
          // add a style id attribute, but only useful during dev
          const styleContent: string[] = [`<style`, ` data-style-tag="${cmpMeta.tagNameMeta}"`];
          domApi.$setAttribute(templateElm, 'data-tmpl-style-tag', cmpMeta.tagNameMeta);

          if (styleMode) {
            styleContent.push(` data-style-mode="${styleMode}"`);
            domApi.$setAttribute(templateElm, 'data-tmpl-style-mode', styleMode);
          }

          if (encapsulation === ENCAPSULATION.ScopedCss || (encapsulation === ENCAPSULATION.ShadowDom && !domApi.$supportsShadowDom)) {
            styleContent.push(` data-style-scoped="true"`);
            domApi.$setAttribute(templateElm, 'data-tmpl-style-scoped', 'true');
          }
          styleContent.push(`>`);
          styleContent.push(style);
          styleContent.push(`</style>`);

          templateElm.innerHTML = styleContent.join('');

        } else {
          // prod mode, no style id data attributes
          templateElm.innerHTML = `<style>${style}</style>`;
        }

        // add our new template element to the head
        // so it can be cloned later
        domApi.$appendChild(domApi.$doc.head, templateElm);
      }
    }

    if (_BUILD_.profile) {
      perf.mark(`init_style_template_end:${cmpMeta.tagNameMeta}`);
      perf.measure(`init_style_template:${cmpMeta.tagNameMeta}`, `init_style_template_start:${cmpMeta.tagNameMeta}`, `init_style_template_end:${cmpMeta.tagNameMeta}`);
    }
  }
}


export function attachStyles(plt: d.PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta, hostElm: d.HostElement) {
  // first see if we've got a style for a specific mode
  // either this host element should use scoped css
  // or it wants to use shadow dom but the browser doesn't support it
  // create a scope id which is useful for scoped css
  // and add the scope attribute to the host

  // create the style id w/ the host element's mode
  let styleId = cmpMeta.tagNameMeta + hostElm.mode;
  let styleTemplate = (cmpMeta as any)[styleId];

  const shouldScopeCss = (cmpMeta.encapsulationMeta === ENCAPSULATION.ScopedCss || (cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom && !plt.domApi.$supportsShadowDom));
  if (shouldScopeCss) {
    hostElm['s-sc'] = styleTemplate
      ? getScopeId(cmpMeta, hostElm.mode)
      : getScopeId(cmpMeta);
  }

  if (!styleTemplate) {
    // doesn't look like there's a style template with the mode
    // create the style id using the default style mode and try again
    styleId = cmpMeta.tagNameMeta + DEFAULT_STYLE_MODE;
    styleTemplate = (cmpMeta as any)[styleId];
  }

  if (styleTemplate) {
    // cool, we found a style template element for this component
    let styleContainerNode: HTMLElement = domApi.$doc.head;

    // if this browser supports shadow dom, then let's climb up
    // the dom and see if we're within a shadow dom
    if (_BUILD_.shadowDom && domApi.$supportsShadowDom) {
      if (cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom) {
        // we already know we're in a shadow dom
        // so shadow root is the container for these styles
        styleContainerNode = hostElm.shadowRoot as any;

      } else {
        // climb up the dom and see if we're in a shadow dom
        let root: d.HostElement = hostElm;
        while (root = domApi.$parentNode(root) as d.HostElement) {
          if (root.host && root.host.shadowRoot) {
            // looks like we are in shadow dom, let's use
            // this shadow root as the container for these styles
            styleContainerNode = (root.host.shadowRoot) as any;
            break;
          }
        }
      }
    }

    // if this container element already has these styles
    // then there's no need to apply them again
    // create an object to keep track if we'ready applied this component style
    let appliedStyles = plt.componentAppliedStyles.get(styleContainerNode);
    if (!appliedStyles) {
      plt.componentAppliedStyles.set(styleContainerNode, appliedStyles = {});
    }

    // check if we haven't applied these styles to this container yet
    if (!appliedStyles[styleId]) {
      let styleElm: HTMLStyleElement;
      if (_BUILD_.es5) {
        // es5 builds are not usig <template> because of ie11 issues
        // instead the "template" is just the style text as a string
        // create a new style element and add as innerHTML

        if (_BUILD_.cssVarShim && plt.customStyle) {
          styleElm = plt.customStyle.createHostStyle(hostElm, styleId, styleTemplate);

        } else {
          styleElm = domApi.$createElement('style');
          styleElm.innerHTML = styleTemplate;

          // remember we don't need to do this again for this element
          appliedStyles[styleId] = true;
        }

        if (styleElm) {
          if (_BUILD_.hotModuleReplacement) {
            // add a style attributes, but only useful during dev
            domApi.$setAttribute(styleElm, 'data-style-tag', cmpMeta.tagNameMeta);
            if (hostElm.mode) {
              domApi.$setAttribute(styleElm, 'data-style-mode', cmpMeta.tagNameMeta);
            }
            if (hostElm['s-sc']) {
              domApi.$setAttribute(styleElm, 'data-style-scoped', 'true');
            }
          }
          const dataStyles = styleContainerNode.querySelectorAll('[data-styles]');
          domApi.$insertBefore(styleContainerNode, styleElm, (dataStyles.length && dataStyles[dataStyles.length - 1].nextSibling) || styleContainerNode.firstChild);
        }

      } else {
        // this browser supports the <template> element
        // and all its native content.cloneNode() goodness
        // clone the template element to create a new <style> element
        styleElm = styleTemplate.content.cloneNode(true);

        // remember we don't need to do this again for this element
        appliedStyles[styleId] = true;

        // let's make sure we put the styles below the <style data-styles> element
        // so any visibility css overrides the default
        const dataStyles = styleContainerNode.querySelectorAll('[data-styles]');
        domApi.$insertBefore(styleContainerNode, styleElm, (dataStyles.length && dataStyles[dataStyles.length - 1].nextSibling) || styleContainerNode.firstChild);
      }
    }
  }
}
