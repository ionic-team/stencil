
export interface CssVarShim {
  i(): Promise<any>;
  addLink(linkEl: HTMLLinkElement): Promise<any>;
  addGlobalStyle(styleEl: HTMLStyleElement): void;

  createHostStyle(
    hostEl: HTMLElement,
    templateName: string,
    cssText: string,
    isScoped: boolean
  ): HTMLStyleElement;

  removeHost(hostEl: HTMLElement): void;
  updateHost(hostEl: HTMLElement): void;
  updateGlobal(): void;
}
