import * as d from '../declarations';


export const propagateComponentReady = (elm: d.HostElement, elmData: d.ElementData, index?: number, ancestorsActivelyLoadingChildren?: d.HostElement[]) => {
  // load events fire from bottom to top
  // the deepest elements load first then bubbles up
  if (elmData.ancestorHostElement) {
    // ok so this element already has a known ancestor host element
    // let's make sure we remove this element from its ancestor's
    // known list of child elements which are actively loading
    ancestorsActivelyLoadingChildren = elmData.ancestorHostElement['s-ld'];

    if (ancestorsActivelyLoadingChildren) {
      index = ancestorsActivelyLoadingChildren.indexOf(elm);
      if (index > -1) {
        // yup, this element is in the list of child elements to wait on
        // remove it so we can work to get the length down to 0
        ancestorsActivelyLoadingChildren.splice(index, 1);
      }

      // the ancestor's initLoad method will do the actual checks
      // to see if the ancestor is actually loaded or not
      // then let's call the ancestor's initLoad method if there's no length
      // (which actually ends up as this method again but for the ancestor)
      if (!ancestorsActivelyLoadingChildren.length) {
        elmData.ancestorHostElement['s-init'] && elmData.ancestorHostElement['s-init']();
      }
    }

    elmData.ancestorHostElement = undefined;
  }

  // if (plt.onAppReadyCallbacks.length && !plt.processingCmp.size) {
  //   // we've got some promises waiting on the entire app to be done processing
  //   // so it should have an empty queue and no longer rendering
  //   while ((cb = plt.onAppReadyCallbacks.shift())) {
  //     cb();
  //   }
  // }
};
