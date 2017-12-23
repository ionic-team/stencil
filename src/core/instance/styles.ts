import { Build } from '../../util/build-conditionals';
import { ComponentConstructor, DomApi, HostElement } from '../../util/interfaces';


export function initStyleTemplate(domApi: DomApi, cmpConstructor: ComponentConstructor) {
  const style = cmpConstructor.style;
  if (style) {
    // we got a style mode for this component, let's create an id for this style
    const styleModeId = 's-' + cmpConstructor.is + (cmpConstructor.styleMode || '');

    if (!(cmpConstructor as any)[styleModeId]) {
      // we don't have this style mode id initialized yet

      if (Build.es5) {
        // ie11's template polyfill doesn't fully do the trick and there's still issues
        // so instead of trying to clone templates with styles in them, we'll just
        // keep a map of the style text as a string to create <style> elements for es5 builds
        (cmpConstructor as any)[styleModeId] = style;

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
        (cmpConstructor as any)[styleModeId] = templateElm;

        // add the style text to the template element's innerHTML
        templateElm.innerHTML = '<style>' + style + '</style>';

        // add our new template element to the head
        // so it can be cloned later
        domApi.$appendChild(domApi.$head, templateElm);
      }
    }
  }
}


export function attachStyles(domApi: DomApi, cmpConstructor: ComponentConstructor, modeName: string, elm: HostElement, styleElm?: HTMLStyleElement) {
  // first see if we've got a style for a specific mode
  let styleModeId = 's-' + cmpConstructor.is + (modeName || '');
  let styleTemplate = (cmpConstructor as any)[styleModeId];

  if (!styleTemplate) {
    // didn't find a style for this mode
    // now let's check if there's a default style for this component
    styleModeId = 's-' + cmpConstructor.is;
    styleTemplate = (cmpConstructor as any)[styleModeId];
  }

  if (styleTemplate) {
    // cool, we found a style template element for this component
    let styleContainerNode: HTMLElement = domApi.$head;

    // if this browser supports shadow dom, then let's climb up
    // the dom and see if we're within a shadow dom
    if (domApi.$supportsShadowDom) {
      if (cmpConstructor.encapsulation === 'shadow') {
        // we already know we're in a shadow dom
        // so shadow root is the container for these styles
        styleContainerNode = (elm.shadowRoot as any);

      } else {
        // climb up the dom and see if we're in a shadow dom
        while ((elm as Node) = domApi.$parentNode(elm)) {
          if ((elm as any).host && (elm as any).host.shadowRoot) {
            // looks like we are in shadow dom, let's use
            // this shadow root as the container for these styles
            styleContainerNode = (elm as any).host.shadowRoot;
            break;
          }
        }
      }
    }

    // if this container element already has these styles
    // then there's no need to apply them again
    // create an object to keep track if we'ready applied this component style
    const appliedStyles = ((styleContainerNode as HostElement)._appliedStyles = (styleContainerNode as HostElement)._appliedStyles || {});

    if (!appliedStyles[styleModeId]) {
      // looks like we haven't applied these styles to this container yet

      if (Build.es5) {
        // es5 builds are not usig <template> because of ie11 issues
        // instead the "template" is just the style text as a string
        // create a new style element and add as innerHTML
        styleElm = domApi.$createElement('style');
        styleElm.innerHTML = styleTemplate;

      } else {
        // clone the template element to create a new <style> element
        styleElm = styleTemplate.content.cloneNode(true);
      }

      // let's make sure we put the styles below the <style data-visibility> element
      // so any visibility css overrides the default
      const insertReferenceNode = styleContainerNode.querySelector('[data-visibility]');
      domApi.$insertBefore(styleContainerNode, styleElm, (insertReferenceNode && insertReferenceNode.nextSibling) || styleContainerNode.firstChild);

      // remember we don't need to do this again for this element
      appliedStyles[styleModeId] = true;
    }
  }
}
