
export interface CssVarSim {
  initShim(): Promise<void>;
  addLink(linkEl: HTMLLinkElement): HTMLLinkElement;
  addGlobalStyle(styleEl: HTMLStyleElement): void;

  createHostStyle(
    hostEl: HTMLElement,
    templateName: string,
    cssText: string,
  ): HTMLStyleElement;

  removeHost(hostEl: HTMLElement): void;
  updateHost(hostEl: HTMLElement): void;
  updateGlobal(): void;
}
