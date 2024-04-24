import vm from 'node:vm';

import { MockWindow, serializeNodeToHtml } from '@stencil/core/mock-doc';

import { generateHydrateResults } from '../../hydrate/runner/render-utils';
import { initializeWindow } from '../../hydrate/runner/window-initialize';
export { RenderResultReadable } from './render-result.js'

const win = new MockWindow() as any;

export function renderToString(html: string, options: any = {}) {
  const results = generateHydrateResults(options);
  initializeWindow(win, win.document, options, results);

  const context = vm.createContext({
    window: win,
    document: win.document,
    customElements: win.customElements,
    HTMLElement: win.HTMLElement,
    Node: win.Node,
    Element: win.Element,
    Text: win.Text,
    Comment: win.Comment,
    Event: win.Event,
    CustomEvent: win.CustomEvent,
    MouseEvent: win.MouseEvent,
    KeyboardEvent: win.KeyboardEvent,
    FocusEvent: win.FocusEvent,
    PointerEvent: win.PointerEvent,
    TouchEvent: win.TouchEvent,
    AnimationEvent: win.AnimationEvent,
    TransitionEvent: win.TransitionEvent,
    EventTarget: win.EventTarget,
    EventListener: win.EventListener,
    requestAnimationFrame: win.requestAnimationFrame,
    cancelAnimationFrame: win.cancelAnimationFrame,
    fetch: win.fetch,
    URL: win.URL,
    URLSearchParams: win.URLSearchParams,
    Headers: win.Headers,
    FormData: win.FormData,
    Blob: win.Blob,
    File: win.File,
    FileReader: win.FileReader,
    Image: win.Image,
    MutationObserver: win.MutationObserver,
    IntersectionObserver: win.IntersectionObserver,
    ResizeObserver: win.ResizeObserver,
    setTimeout: win.setTimeout,
    clearTimeout: win.clearTimeout,
    setInterval: win.setInterval,
    clearInterval: win.clearInterval,
    console: console,
    location: win.location,
    history: win.history,
    navigator: win.navigator,
    screen: win.screen,
    performance: win.performance,
    addEventListener: win.addEventListener,
    removeEventListener: win.removeEventListener,
    dispatchEvent: win.dispatchEvent,
    CustomElementRegistry: win.CustomElementRegistry,
    ShadowRoot: win.ShadowRoot,
    TextEncoder: win.TextEncoder,
  });

  const code = `
    document.body.innerHTML = \`${html}\`;
  `

  vm.runInContext(code, context);

  if (options.stream) {
    return serializeNodeToHtml(win.document.body, {
      serializeShadowRoot: 'declarative-shadow-dom',
      stream: true
    });
  }

  return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
    return serializeNodeToHtml(win.document.body, {
      serializeShadowRoot: 'declarative-shadow-dom'
    }) as string;
  });
}

export function streamToString (html: string, options: any = {}) {
  return renderToString(html, { ...options, stream: true });
}

if (typeof globalThis.customElements === 'undefined') {
  globalThis.customElements = win.customElements;
  globalThis.window = win;
  globalThis.requestAnimationFrame = win.requestAnimationFrame.bind(win);
  globalThis.cancelAnimationFrame = win.cancelAnimationFrame.bind(win);
  globalThis.setTimeout = win.setTimeout.bind(win);
}
