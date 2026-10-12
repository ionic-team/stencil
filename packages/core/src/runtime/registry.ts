let _registry: CustomElementRegistry | undefined;

export const setRegistry = (registry: CustomElementRegistry): void => {
  _registry = registry;
};

export const getRegistry = (): CustomElementRegistry => _registry ?? customElements;

/**
 * @param elm a defined component host
 * @returns the registry the host's class was defined in, else the active registry
 */
export const getHostRegistry = (elm: Element): CustomElementRegistry =>
  (elm.constructor as { _registry?: CustomElementRegistry })._registry ?? getRegistry();
