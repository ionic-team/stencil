
import * as d from './declarations/index';
export {
  ComponentDidLoad,
  ComponentDidUnload,
  ComponentDidUpdate,
  ComponentWillLoad,
  ComponentWillUpdate,
  StencilConfig as Config,
  EventEmitter,
  EventListenerEnable,
  FunctionalComponent,
  QueueApi,
  JSXElements
} from './declarations/index';

export { h } from './renderer/vdom';

export namespace h {
  export declare namespace JSX {
    export interface Element {}
    export interface IntrinsicElements {
      // Stencil elements
      slot: d.JSXElements.SlotAttributes;

      // HTML
      a: d.JSXElements.AnchorHTMLAttributes<HTMLAnchorElement>;
      abbr: d.JSXElements.HTMLAttributes;
      address: d.JSXElements.HTMLAttributes;
      area: d.JSXElements.AreaHTMLAttributes<HTMLAreaElement>;
      article: d.JSXElements.HTMLAttributes;
      aside: d.JSXElements.HTMLAttributes;
      audio: d.JSXElements.AudioHTMLAttributes<HTMLAudioElement>;
      b: d.JSXElements.HTMLAttributes;
      base: d.JSXElements.BaseHTMLAttributes<HTMLBaseElement>;
      bdi: d.JSXElements.HTMLAttributes;
      bdo: d.JSXElements.HTMLAttributes;
      big: d.JSXElements.HTMLAttributes;
      blockquote: d.JSXElements.BlockquoteHTMLAttributes<HTMLQuoteElement>;
      body: d.JSXElements.HTMLAttributes<HTMLBodyElement>;
      br: d.JSXElements.HTMLAttributes<HTMLBRElement>;
      button: d.JSXElements.ButtonHTMLAttributes<HTMLButtonElement>;
      canvas: d.JSXElements.CanvasHTMLAttributes<HTMLCanvasElement>;
      caption: d.JSXElements.HTMLAttributes<HTMLTableCaptionElement>;
      cite: d.JSXElements.HTMLAttributes;
      code: d.JSXElements.HTMLAttributes;
      col: d.JSXElements.ColHTMLAttributes<HTMLTableColElement>;
      colgroup: d.JSXElements.ColgroupHTMLAttributes<HTMLTableColElement>;
      data: d.JSXElements.HTMLAttributes<HTMLDataElement>;
      datalist: d.JSXElements.HTMLAttributes<HTMLDataListElement>;
      dd: d.JSXElements.HTMLAttributes;
      del: d.JSXElements.DelHTMLAttributes<HTMLModElement>;
      details: d.JSXElements.DetailsHTMLAttributes<HTMLElement>;
      dfn: d.JSXElements.HTMLAttributes;
      dialog: d.JSXElements.DialogHTMLAttributes<HTMLDialogElement>;
      div: d.JSXElements.HTMLAttributes<HTMLDivElement>;
      dl: d.JSXElements.HTMLAttributes<HTMLDListElement>;
      dt: d.JSXElements.HTMLAttributes;
      em: d.JSXElements.HTMLAttributes;
      embed: d.JSXElements.EmbedHTMLAttributes<HTMLEmbedElement>;
      fieldset: d.JSXElements.FieldsetHTMLAttributes<HTMLFieldSetElement>;
      figcaption: d.JSXElements.HTMLAttributes;
      figure: d.JSXElements.HTMLAttributes;
      footer: d.JSXElements.HTMLAttributes;
      form: d.JSXElements.FormHTMLAttributes<HTMLFormElement>;
      h1: d.JSXElements.HTMLAttributes<HTMLHeadingElement>;
      h2: d.JSXElements.HTMLAttributes<HTMLHeadingElement>;
      h3: d.JSXElements.HTMLAttributes<HTMLHeadingElement>;
      h4: d.JSXElements.HTMLAttributes<HTMLHeadingElement>;
      h5: d.JSXElements.HTMLAttributes<HTMLHeadingElement>;
      h6: d.JSXElements.HTMLAttributes<HTMLHeadingElement>;
      head: d.JSXElements.HTMLAttributes<HTMLHeadElement>;
      header: d.JSXElements.HTMLAttributes;
      hgroup: d.JSXElements.HTMLAttributes;
      hr: d.JSXElements.HTMLAttributes<HTMLHRElement>;
      html: d.JSXElements.HTMLAttributes<HTMLHtmlElement>;
      i: d.JSXElements.HTMLAttributes;
      iframe: d.JSXElements.IframeHTMLAttributes<HTMLIFrameElement>;
      img: d.JSXElements.ImgHTMLAttributes<HTMLImageElement>;
      input: d.JSXElements.InputHTMLAttributes<HTMLInputElement>;
      ins: d.JSXElements.InsHTMLAttributes<HTMLModElement>;
      kbd: d.JSXElements.HTMLAttributes;
      keygen: d.JSXElements.KeygenHTMLAttributes<HTMLElement>;
      label: d.JSXElements.LabelHTMLAttributes<HTMLLabelElement>;
      legend: d.JSXElements.HTMLAttributes<HTMLLegendElement>;
      li: d.JSXElements.LiHTMLAttributes<HTMLLIElement>;
      link: d.JSXElements.LinkHTMLAttributes<HTMLLinkElement>;
      main: d.JSXElements.HTMLAttributes;
      map: d.JSXElements.MapHTMLAttributes<HTMLMapElement>;
      mark: d.JSXElements.HTMLAttributes;
      menu: d.JSXElements.MenuHTMLAttributes<HTMLMenuElement>;
      menuitem: d.JSXElements.HTMLAttributes;
      meta: d.JSXElements.MetaHTMLAttributes<HTMLMetaElement>;
      meter: d.JSXElements.MeterHTMLAttributes<HTMLMeterElement>;
      nav: d.JSXElements.HTMLAttributes;
      noscript: d.JSXElements.HTMLAttributes;
      object: d.JSXElements.ObjectHTMLAttributes<HTMLObjectElement>;
      ol: d.JSXElements.OlHTMLAttributes<HTMLOListElement>;
      optgroup: d.JSXElements.OptgroupHTMLAttributes<HTMLOptGroupElement>;
      option: d.JSXElements.OptionHTMLAttributes<HTMLOptionElement>;
      output: d.JSXElements.OutputHTMLAttributes<HTMLOutputElement>;
      p: d.JSXElements.HTMLAttributes<HTMLParagraphElement>;
      param: d.JSXElements.ParamHTMLAttributes<HTMLParamElement>;
      picture: d.JSXElements.HTMLAttributes<HTMLPictureElement>;
      pre: d.JSXElements.HTMLAttributes<HTMLPreElement>;
      progress: d.JSXElements.ProgressHTMLAttributes<HTMLProgressElement>;
      q: d.JSXElements.QuoteHTMLAttributes<HTMLQuoteElement>;
      rp: d.JSXElements.HTMLAttributes;
      rt: d.JSXElements.HTMLAttributes;
      ruby: d.JSXElements.HTMLAttributes;
      s: d.JSXElements.HTMLAttributes;
      samp: d.JSXElements.HTMLAttributes;
      script: d.JSXElements.ScriptHTMLAttributes<HTMLScriptElement>;
      section: d.JSXElements.HTMLAttributes;
      select: d.JSXElements.SelectHTMLAttributes<HTMLSelectElement>;
      small: d.JSXElements.HTMLAttributes;
      source: d.JSXElements.SourceHTMLAttributes<HTMLSourceElement>;
      span: d.JSXElements.HTMLAttributes<HTMLSpanElement>;
      strong: d.JSXElements.HTMLAttributes;
      style: d.JSXElements.StyleHTMLAttributes<HTMLStyleElement>;
      sub: d.JSXElements.HTMLAttributes;
      summary: d.JSXElements.HTMLAttributes;
      sup: d.JSXElements.HTMLAttributes;
      table: d.JSXElements.TableHTMLAttributes<HTMLTableElement>;
      tbody: d.JSXElements.HTMLAttributes<HTMLTableSectionElement>;
      td: d.JSXElements.TdHTMLAttributes<HTMLTableDataCellElement>;
      textarea: d.JSXElements.TextareaHTMLAttributes<HTMLTextAreaElement>;
      tfoot: d.JSXElements.HTMLAttributes<HTMLTableSectionElement>;
      th: d.JSXElements.ThHTMLAttributes<HTMLTableHeaderCellElement>;
      thead: d.JSXElements.HTMLAttributes<HTMLTableSectionElement>;
      time: d.JSXElements.TimeHTMLAttributes<HTMLTimeElement>;
      title: d.JSXElements.HTMLAttributes<HTMLTitleElement>;
      tr: d.JSXElements.HTMLAttributes<HTMLTableRowElement>;
      track: d.JSXElements.TrackHTMLAttributes<HTMLTrackElement>;
      u: d.JSXElements.HTMLAttributes;
      ul: d.JSXElements.HTMLAttributes<HTMLUListElement>;
      'var': d.JSXElements.HTMLAttributes;
      video: d.JSXElements.VideoHTMLAttributes<HTMLVideoElement>;
      wbr: d.JSXElements.HTMLAttributes;

      // catch all
      [tagName: string]: d.JSXElements.HTMLAttributes;
    }
  }
}

/**
 * Build
 */
export declare const Build: d.UserBuildConditionals;

/**
 * Component
 */
export declare const Component: d.ComponentDecorator;

/**
 * Element
 */
export declare const Element: d.ElementDecorator;

/**
 * Event
 */
export declare const Event: d.EventDecorator;

/**
 * Listen
 */
export declare const Listen: d.ListenDecorator;

/**
 * Method
 */
export declare const Method: d.MethodDecorator;

/**
 * Prop
 */
export declare const Prop: d.PropDecorator;

/**
 * State
 */
export declare const State: d.StateDecorator;

/**
 * Watch
 */
export declare const Watch: d.WatchDecorator;

/**
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropWillChange: d.WatchDecorator;

/**
 * Deprecated: Please use @Watch decorator instead
 */
export declare const PropDidChange: d.WatchDecorator;

export interface HostElement extends HTMLElement {}
