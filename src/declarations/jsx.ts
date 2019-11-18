
declare namespace LocalJSX {
  export interface Element {}
  export interface IntrinsicElements {}
}
export { LocalJSX as JSX };

export namespace JSXBase {
  export interface IntrinsicElements {
    // Stencil elements
    slot: JSXBase.SlotAttributes;

    // HTML
    a: JSXBase.AnchorHTMLAttributes<HTMLAnchorElement>;
    abbr: JSXBase.HTMLAttributes;
    address: JSXBase.HTMLAttributes;
    area: JSXBase.AreaHTMLAttributes<HTMLAreaElement>;
    article: JSXBase.HTMLAttributes;
    aside: JSXBase.HTMLAttributes;
    audio: JSXBase.AudioHTMLAttributes<HTMLAudioElement>;
    b: JSXBase.HTMLAttributes;
    base: JSXBase.BaseHTMLAttributes<HTMLBaseElement>;
    bdi: JSXBase.HTMLAttributes;
    bdo: JSXBase.HTMLAttributes;
    big: JSXBase.HTMLAttributes;
    blockquote: JSXBase.BlockquoteHTMLAttributes<HTMLQuoteElement>;
    body: JSXBase.HTMLAttributes<HTMLBodyElement>;
    br: JSXBase.HTMLAttributes<HTMLBRElement>;
    button: JSXBase.ButtonHTMLAttributes<HTMLButtonElement>;
    canvas: JSXBase.CanvasHTMLAttributes<HTMLCanvasElement>;
    caption: JSXBase.HTMLAttributes<HTMLTableCaptionElement>;
    cite: JSXBase.HTMLAttributes;
    code: JSXBase.HTMLAttributes;
    col: JSXBase.ColHTMLAttributes<HTMLTableColElement>;
    colgroup: JSXBase.ColgroupHTMLAttributes<HTMLTableColElement>;
    data: JSXBase.HTMLAttributes<HTMLDataElement>;
    datalist: JSXBase.HTMLAttributes<HTMLDataListElement>;
    dd: JSXBase.HTMLAttributes;
    del: JSXBase.DelHTMLAttributes<HTMLModElement>;
    details: JSXBase.DetailsHTMLAttributes<HTMLElement>;
    dfn: JSXBase.HTMLAttributes;
    dialog: JSXBase.DialogHTMLAttributes<HTMLDialogElement>;
    div: JSXBase.HTMLAttributes<HTMLDivElement>;
    dl: JSXBase.HTMLAttributes<HTMLDListElement>;
    dt: JSXBase.HTMLAttributes;
    em: JSXBase.HTMLAttributes;
    embed: JSXBase.EmbedHTMLAttributes<HTMLEmbedElement>;
    fieldset: JSXBase.FieldsetHTMLAttributes<HTMLFieldSetElement>;
    figcaption: JSXBase.HTMLAttributes;
    figure: JSXBase.HTMLAttributes;
    footer: JSXBase.HTMLAttributes;
    form: JSXBase.FormHTMLAttributes<HTMLFormElement>;
    h1: JSXBase.HTMLAttributes<HTMLHeadingElement>;
    h2: JSXBase.HTMLAttributes<HTMLHeadingElement>;
    h3: JSXBase.HTMLAttributes<HTMLHeadingElement>;
    h4: JSXBase.HTMLAttributes<HTMLHeadingElement>;
    h5: JSXBase.HTMLAttributes<HTMLHeadingElement>;
    h6: JSXBase.HTMLAttributes<HTMLHeadingElement>;
    head: JSXBase.HTMLAttributes<HTMLHeadElement>;
    header: JSXBase.HTMLAttributes;
    hgroup: JSXBase.HTMLAttributes;
    hr: JSXBase.HTMLAttributes<HTMLHRElement>;
    html: JSXBase.HTMLAttributes<HTMLHtmlElement>;
    i: JSXBase.HTMLAttributes;
    iframe: JSXBase.IframeHTMLAttributes<HTMLIFrameElement>;
    img: JSXBase.ImgHTMLAttributes<HTMLImageElement>;
    input: JSXBase.InputHTMLAttributes<HTMLInputElement>;
    ins: JSXBase.InsHTMLAttributes<HTMLModElement>;
    kbd: JSXBase.HTMLAttributes;
    keygen: JSXBase.KeygenHTMLAttributes<HTMLElement>;
    label: JSXBase.LabelHTMLAttributes<HTMLLabelElement>;
    legend: JSXBase.HTMLAttributes<HTMLLegendElement>;
    li: JSXBase.LiHTMLAttributes<HTMLLIElement>;
    link: JSXBase.LinkHTMLAttributes<HTMLLinkElement>;
    main: JSXBase.HTMLAttributes;
    map: JSXBase.MapHTMLAttributes<HTMLMapElement>;
    mark: JSXBase.HTMLAttributes;
    menu: JSXBase.MenuHTMLAttributes<HTMLMenuElement>;
    menuitem: JSXBase.HTMLAttributes;
    meta: JSXBase.MetaHTMLAttributes<HTMLMetaElement>;
    meter: JSXBase.MeterHTMLAttributes<HTMLMeterElement>;
    nav: JSXBase.HTMLAttributes;
    noscript: JSXBase.HTMLAttributes;
    object: JSXBase.ObjectHTMLAttributes<HTMLObjectElement>;
    ol: JSXBase.OlHTMLAttributes<HTMLOListElement>;
    optgroup: JSXBase.OptgroupHTMLAttributes<HTMLOptGroupElement>;
    option: JSXBase.OptionHTMLAttributes<HTMLOptionElement>;
    output: JSXBase.OutputHTMLAttributes<HTMLOutputElement>;
    p: JSXBase.HTMLAttributes<HTMLParagraphElement>;
    param: JSXBase.ParamHTMLAttributes<HTMLParamElement>;
    picture: JSXBase.HTMLAttributes<HTMLPictureElement>;
    pre: JSXBase.HTMLAttributes<HTMLPreElement>;
    progress: JSXBase.ProgressHTMLAttributes<HTMLProgressElement>;
    q: JSXBase.QuoteHTMLAttributes<HTMLQuoteElement>;
    rp: JSXBase.HTMLAttributes;
    rt: JSXBase.HTMLAttributes;
    ruby: JSXBase.HTMLAttributes;
    s: JSXBase.HTMLAttributes;
    samp: JSXBase.HTMLAttributes;
    script: JSXBase.ScriptHTMLAttributes<HTMLScriptElement>;
    section: JSXBase.HTMLAttributes;
    select: JSXBase.SelectHTMLAttributes<HTMLSelectElement>;
    small: JSXBase.HTMLAttributes;
    source: JSXBase.SourceHTMLAttributes<HTMLSourceElement>;
    span: JSXBase.HTMLAttributes<HTMLSpanElement>;
    strong: JSXBase.HTMLAttributes;
    style: JSXBase.StyleHTMLAttributes<HTMLStyleElement>;
    sub: JSXBase.HTMLAttributes;
    summary: JSXBase.HTMLAttributes;
    sup: JSXBase.HTMLAttributes;
    table: JSXBase.TableHTMLAttributes<HTMLTableElement>;
    tbody: JSXBase.HTMLAttributes<HTMLTableSectionElement>;
    td: JSXBase.TdHTMLAttributes<HTMLTableDataCellElement>;
    textarea: JSXBase.TextareaHTMLAttributes<HTMLTextAreaElement>;
    tfoot: JSXBase.HTMLAttributes<HTMLTableSectionElement>;
    th: JSXBase.ThHTMLAttributes<HTMLTableHeaderCellElement>;
    thead: JSXBase.HTMLAttributes<HTMLTableSectionElement>;
    time: JSXBase.TimeHTMLAttributes<HTMLTimeElement>;
    title: JSXBase.HTMLAttributes<HTMLTitleElement>;
    tr: JSXBase.HTMLAttributes<HTMLTableRowElement>;
    track: JSXBase.TrackHTMLAttributes<HTMLTrackElement>;
    u: JSXBase.HTMLAttributes;
    ul: JSXBase.HTMLAttributes<HTMLUListElement>;
    'var': JSXBase.HTMLAttributes;
    video: JSXBase.VideoHTMLAttributes<HTMLVideoElement>;
    wbr: JSXBase.HTMLAttributes;


    // SVG
    animate: JSXBase.SVGAttributes;
    circle: JSXBase.SVGAttributes;
    clipPath: JSXBase.SVGAttributes;
    defs: JSXBase.SVGAttributes;
    desc: JSXBase.SVGAttributes;
    ellipse: JSXBase.SVGAttributes;
    feBlend: JSXBase.SVGAttributes;
    feColorMatrix: JSXBase.SVGAttributes;
    feComponentTransfer: JSXBase.SVGAttributes;
    feComposite: JSXBase.SVGAttributes;
    feConvolveMatrix: JSXBase.SVGAttributes;
    feDiffuseLighting: JSXBase.SVGAttributes;
    feDisplacementMap: JSXBase.SVGAttributes;
    feDistantLight: JSXBase.SVGAttributes;
    feDropShadow: JSXBase.SVGAttributes;
    feFlood: JSXBase.SVGAttributes;
    feFuncA: JSXBase.SVGAttributes;
    feFuncB: JSXBase.SVGAttributes;
    feFuncG: JSXBase.SVGAttributes;
    feFuncR: JSXBase.SVGAttributes;
    feGaussianBlur: JSXBase.SVGAttributes;
    feImage: JSXBase.SVGAttributes;
    feMerge: JSXBase.SVGAttributes;
    feMergeNode: JSXBase.SVGAttributes;
    feMorphology: JSXBase.SVGAttributes;
    feOffset: JSXBase.SVGAttributes;
    fePointLight: JSXBase.SVGAttributes;
    feSpecularLighting: JSXBase.SVGAttributes;
    feSpotLight: JSXBase.SVGAttributes;
    feTile: JSXBase.SVGAttributes;
    feTurbulence: JSXBase.SVGAttributes;
    filter: JSXBase.SVGAttributes;
    foreignObject: JSXBase.SVGAttributes;
    g: JSXBase.SVGAttributes;
    image: JSXBase.SVGAttributes;
    line: JSXBase.SVGAttributes;
    linearGradient: JSXBase.SVGAttributes;
    marker: JSXBase.SVGAttributes;
    mask: JSXBase.SVGAttributes;
    metadata: JSXBase.SVGAttributes;
    path: JSXBase.SVGAttributes;
    pattern: JSXBase.SVGAttributes;
    polygon: JSXBase.SVGAttributes;
    polyline: JSXBase.SVGAttributes;
    radialGradient: JSXBase.SVGAttributes;
    rect: JSXBase.SVGAttributes;
    stop: JSXBase.SVGAttributes;
    svg: JSXBase.SVGAttributes;
    switch: JSXBase.SVGAttributes;
    symbol: JSXBase.SVGAttributes;
    text: JSXBase.SVGAttributes;
    textPath: JSXBase.SVGAttributes;
    tspan: JSXBase.SVGAttributes;
    use: JSXBase.SVGAttributes;
    view: JSXBase.SVGAttributes;
  }

  export interface SlotAttributes {
    name?: string;
    slot?: string;
  }

  export interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    download?: any;
    href?: string;
    hrefLang?: string;
    hreflang?: string;
    media?: string;
    rel?: string;
    target?: string;
  }

  export interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

  export interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string;
    coords?: string;
    download?: any;
    href?: string;
    hrefLang?: string;
    hreflang?: string;
    media?: string;
    rel?: string;
    shape?: string;
    target?: string;
  }

  export interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string;
    target?: string;
  }

  export interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
  }

  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formaction?: string;
    formEncType?: string;
    formenctype?: string;
    formMethod?: string;
    formmethod?: string;
    formNoValidate?: boolean;
    formnovalidate?: boolean;
    formTarget?: string;
    formtarget?: string;
    name?: string;
    type?: string;
    value?: string | string[] | number;
  }

  export interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string;
    width?: number | string;
  }

  export interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number;
  }

  export interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number;
  }

  export interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
    open?: boolean;
  }

  export interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
    dateTime?: string;
    datetime?: string;
  }

  export interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    onClose?: (event: Event) => void;
    open?: boolean;
    returnValue?: string;
  }

  export interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string;
    src?: string;
    type?: string;
    width?: number | string;
  }

  export interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    form?: string;
    name?: string;
  }

  export interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    acceptCharset?: string;
    acceptcharset?: string;
    action?: string;
    autoComplete?: string;
    autocomplete?: string;
    encType?: string;
    enctype?: string;
    method?: string;
    name?: string;
    noValidate?: boolean;
    novalidate?: boolean | string;
    target?: string;
  }

  export interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
    manifest?: string;
  }

  export interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
    allowFullScreen?: boolean;
    allowfullScreen?: string | boolean;
    allowTransparency?: boolean;
    allowtransparency?: string | boolean;
    frameBorder?: number | string;
    frameborder?: number | string;
    importance?: 'low' | 'auto' | 'high';
    height?: number | string;
    loading?: 'lazy' | 'auto' | 'eager';
    marginHeight?: number;
    marginheight?: string | number;
    marginWidth?: number;
    marginwidth?: string | number;
    name?: string;
    referrerPolicy?: ReferrerPolicy;
    sandbox?: string;
    scrolling?: string;
    seamless?: boolean;
    src?: string;
    srcDoc?: string;
    srcdoc?: string;
    width?: number | string;
  }

  export interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string;
    decoding?: 'async' | 'auto' | 'sync';
    importance?: 'low' | 'auto' | 'high';
    height?: number | string;
    loading?: 'lazy' | 'auto' | 'eager';
    sizes?: string;
    src?: string;
    srcSet?: string;
    srcset?: string;
    useMap?: string;
    usemap?: string;
    width?: number | string;
  }

  export interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
    dateTime?: string;
    datetime?: string;
  }

  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    autocomplete?: string;
    autoFocus?: boolean;
    autofocus?: boolean | string;
    capture?: string; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    checked?: boolean;
    crossOrigin?: string;
    crossorigin?: string;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formaction?: string;
    formEncType?: string;
    formenctype?: string;
    formMethod?: string;
    formmethod?: string;
    formNoValidate?: boolean;
    formnovalidate?: boolean;
    formTarget?: string;
    formtarget?: string;
    height?: number | string;
    list?: string;
    max?: number | string;
    maxLength?: number;
    maxlength?: number | string;
    min?: number | string;
    minLength?: number;
    minlength?: number | string;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    readonly?: boolean | string;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | string[] | number;
    width?: number | string;
  }

  export interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    autofocus?: boolean | string;
    challenge?: string;
    disabled?: boolean;
    form?: string;
    keyType?: string;
    keytype?: string;
    keyParams?: string;
    keyparams?: string;
    name?: string;
  }

  export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    htmlFor?: string;
    htmlfor?: string;
  }

  export interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | string[] | number;
  }

  export interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string;
    hrefLang?: string;
    hreflang?: string;
    importance?: 'low' | 'auto' | 'high';
    integrity?: string;
    media?: string;
    rel?: string;
    sizes?: string;
    type?: string;
  }

  export interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string;
  }

  export interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
  }

  export interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoPlay?: boolean;
    autoplay?: boolean | string;
    controls?: boolean;
    crossOrigin?: string;
    crossorigin?: string;
    loop?: boolean;
    mediaGroup?: string;
    mediagroup?: string;
    muted?: boolean;
    preload?: string;
    src?: string;

    // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
    onAbort?: (event: Event) => void;
    onCanPlay?: (event: Event) => void;
    onCanPlayThrough?: (event: Event) => void;
    onDurationChange?: (event: Event) => void;
    onEmptied?: (event: Event) => void;
    onEnded?: (event: Event) => void;
    onError?: (event: Event) => void;
    onInterruptBegin?: (event: Event) => void;
    onInterruptEnd?: (event: Event) => void;
    onLoadedData?: (event: Event) => void;
    onLoadedMetaData?: (event: Event) => void;
    onLoadStart?: (event: Event) => void;
    onMozAudioAvailable?: (event: Event) => void;
    onPause?: (event: Event) => void;
    onPlay?: (event: Event) => void;
    onPlaying?: (event: Event) => void;
    onProgress?: (event: Event) => void;
    onRateChange?: (event: Event) => void;
    onSeeked?: (event: Event) => void;
    onSeeking?: (event: Event) => void;
    onStalled?: (event: Event) => void;
    onSuspend?: (event: Event) => void;
    onTimeUpdate?: (event: Event) => void;
    onVolumeChange?: (event: Event) => void;
    onWaiting?: (event: Event) => void;
  }

  export interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
    charSet?: string;
    charset?: string;
    content?: string;
    httpEquiv?: string;
    httpequiv?: string;
    name?: string;
  }

  export interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    high?: number;
    low?: number;
    max?: number | string;
    min?: number | string;
    optimum?: number;
    value?: string | string[] | number;
  }

  export interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string;
  }

  export interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
    classID?: string;
    classid?: string;
    data?: string;
    form?: string;
    height?: number | string;
    name?: string;
    type?: string;
    useMap?: string;
    usemap?: string;
    width?: number | string;
    wmode?: string;
  }

  export interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
    reversed?: boolean;
    start?: number;
  }

  export interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    label?: string;
  }

  export interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string | string[] | number;
  }

  export interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    htmlFor?: string;
    htmlfor?: string;
    name?: string;
  }

  export interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string;
    value?: string | string[] | number;
  }

  export interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
    max?: number | string;
    value?: string | string[] | number;
  }

  export interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
    async?: boolean;
    charSet?: string;
    charset?: string;
    crossOrigin?: string;
    crossorigin?: string;
    defer?: boolean;
    importance?: 'low' | 'auto' | 'high';
    integrity?: string;
    nonce?: string;
    src?: string;
    type?: string;
  }

  export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
  }

  export interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
    media?: string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    type?: string;
  }

  export interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    media?: string;
    nonce?: string;
    scoped?: boolean;
    type?: string;
  }

  export interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    cellPadding?: number | string;
    cellpadding?: number | string;
    cellSpacing?: number | string;
    cellspacing?: number | string;
    summary?: string;
  }

  export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    autofocus?: boolean | string;
    cols?: number;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    maxlength?: number | string;
    minLength?: number;
    minlength?: number | string;
    name?: string;
    placeholder?: string;
    readOnly?: boolean;
    readonly?: boolean | string;
    required?: boolean;
    rows?: number;
    value?: string | string[] | number;
    wrap?: string;
  }

  export interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
  }

  export interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    rowspan?: number | string;
    scope?: string;
  }

  export interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
    dateTime?: string;
  }

  export interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
    default?: boolean;
    kind?: string;
    label?: string;
    src?: string;
    srcLang?: string;
    srclang?: string;
  }

  export interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    height?: number | string;
    playsInline?: boolean;
    playsinline?: boolean | string;
    poster?: string;
    width?: number | string;
  }

  export interface HTMLAttributes<T = HTMLElement> extends DOMAttributes<T> {
    // vdom specific
    innerHTML?: string;
    key?: string | number;

    // Standard HTML Attributes
    accessKey?: string;
    class?: string | { [className: string]: boolean };
    contentEditable?: boolean | string;
    contenteditable?: boolean | string;
    contextMenu?: string;
    contextmenu?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    id?: string;
    lang?: string;
    spellCheck?: boolean;
    spellcheck?: boolean | string;
    style?: { [key: string]: string | undefined };
    tabIndex?: number;
    tabindex?: number | string;
    title?: string;

    // Unknown
    inputMode?: string;
    inputmode?: string;
    is?: string;
    radioGroup?: string; // <command>, <menuitem>
    radiogroup?: string;
    part?: string;

    // WAI-ARIA
    role?: string;

    // RDFa Attributes
    about?: string;
    datatype?: string;
    inlist?: any;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

    // Non-standard Attributes
    autoCapitalize?: string;
    autocapitalize?: string;
    autoCorrect?: string;
    autocorrect?: string;
    autoSave?: string;
    autosave?: string;
    color?: string;
    itemProp?: string;
    itemprop?: string;
    itemScope?: boolean;
    itemscope?: boolean;
    itemType?: string;
    itemtype?: string;
    itemID?: string;
    itemid?: string;
    itemRef?: string;
    itemref?: string;
    results?: number;
    security?: string;
    unselectable?: boolean;
  }

  export interface SVGAttributes<T = SVGElement> extends DOMAttributes<T> {
    // Attributes which also defined in HTMLAttributes
    // See comment in SVGDOMPropertyConfig.js
    class?: string | { [className: string]: boolean };
    color?: string;
    height?: number | string;
    id?: string;
    lang?: string;
    max?: number | string;
    media?: string;
    method?: string;
    min?: number | string;
    name?: string;
    style?: { [key: string]: string | undefined };
    target?: string;
    type?: string;
    width?: number | string;

    // Other HTML properties supported by SVG elements in browsers
    role?: string;
    tabindex?: number;

    // SVG Specific attributes
    'accent-height'?: number | string;
    'accumulate'?: 'none' | 'sum';
    'additive'?: 'replace' | 'sum';
    'alignment-baseline'?: 'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' | 'central' | 'after-edge' |
    'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | 'inherit';
    'allow-reorder'?: 'no' | 'yes';
    'alphabetic'?: number | string;
    'amplitude'?: number | string;
    'arabic-form'?: 'initial' | 'medial' | 'terminal' | 'isolated';
    'ascent'?: number | string;
    'attribute-name'?: string;
    'attribute-type'?: string;
    'auto-reverse'?: number | string;
    'azimuth'?: number | string;
    'base-frequency'?: number | string;
    'baseline-shift'?: number | string;
    'base-profile'?: number | string;
    'bbox'?: number | string;
    'begin'?: number | string;
    'bias'?: number | string;
    'by'?: number | string;
    'calc-mode'?: number | string;
    'cap-height'?: number | string;
    'clip'?: number | string;
    'clip-path'?: string;
    'clip-path-units'?: number | string;
    'clip-rule'?: number | string;
    'color-interpolation'?: number | string;
    'color-interpolation-filters'?: 'auto' | 's-rGB' | 'linear-rGB' | 'inherit';
    'color-profile'?: number | string;
    'color-rendering'?: number | string;
    'content-script-type'?: number | string;
    'content-style-type'?: number | string;
    'cursor'?: number | string;
    'cx'?: number | string;
    'cy'?: number | string;
    'd'?: string;
    'decelerate'?: number | string;
    'descent'?: number | string;
    'diffuse-constant'?: number | string;
    'direction'?: number | string;
    'display'?: number | string;
    'divisor'?: number | string;
    'dominant-baseline'?: number | string;
    'dur'?: number | string;
    'dx'?: number | string;
    'dy'?: number | string;
    'edge-mode'?: number | string;
    'elevation'?: number | string;
    'enable-background'?: number | string;
    'end'?: number | string;
    'exponent'?: number | string;
    'external-resources-required'?: number | string;
    'fill'?: string;
    'fill-opacity'?: number | string;
    'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit';
    'filter'?: string;
    'filter-res'?: number | string;
    'filter-units'?: number | string;
    'flood-color'?: number | string;
    'flood-opacity'?: number | string;
    'focusable'?: number | string;
    'font-family'?: string;
    'font-size'?: number | string;
    'font-size-adjust'?: number | string;
    'font-stretch'?: number | string;
    'font-style'?: number | string;
    'font-variant'?: number | string;
    'font-weight'?: number | string;
    'format'?: number | string;
    'from'?: number | string;
    'fx'?: number | string;
    'fy'?: number | string;
    'g1'?: number | string;
    'g2'?: number | string;
    'glyph-name'?: number | string;
    'glyph-orientation-horizontal'?: number | string;
    'glyph-orientation-vertical'?: number | string;
    'glyph-ref'?: number | string;
    'gradient-transform'?: string;
    'gradient-units'?: string;
    'hanging'?: number | string;
    'horiz-adv-x'?: number | string;
    'horiz-origin-x'?: number | string;
    'ideographic'?: number | string;
    'image-rendering'?: number | string;
    'in2'?: number | string;
    'in'?: string;
    'intercept'?: number | string;
    'k1'?: number | string;
    'k2'?: number | string;
    'k3'?: number | string;
    'k4'?: number | string;
    'k'?: number | string;
    'kernel-matrix'?: number | string;
    'kernel-unit-length'?: number | string;
    'kerning'?: number | string;
    'key-points'?: number | string;
    'key-splines'?: number | string;
    'key-times'?: number | string;
    'length-adjust'?: number | string;
    'letter-spacing'?: number | string;
    'lighting-color'?: number | string;
    'limiting-cone-angle'?: number | string;
    'local'?: number | string;
    'marker-end'?: string;
    'marker-height'?: number | string;
    'marker-mid'?: string;
    'marker-start'?: string;
    'marker-units'?: number | string;
    'marker-width'?: number | string;
    'mask'?: string;
    'mask-content-units'?: number | string;
    'mask-units'?: number | string;
    'mathematical'?: number | string;
    'mode'?: number | string;
    'num-octaves'?: number | string;
    'offset'?: number | string;
    'opacity'?: number | string;
    'operator'?: number | string;
    'order'?: number | string;
    'orient'?: number | string;
    'orientation'?: number | string;
    'origin'?: number | string;
    'overflow'?: number | string;
    'overline-position'?: number | string;
    'overline-thickness'?: number | string;
    'paint-order'?: number | string;
    'panose1'?: number | string;
    'path-length'?: number | string;
    'pattern-content-units'?: string;
    'pattern-transform'?: number | string;
    'pattern-units'?: string;
    'pointer-events'?: number | string;
    'points'?: string;
    'points-at-x'?: number | string;
    'points-at-y'?: number | string;
    'points-at-z'?: number | string;
    'preserve-alpha'?: number | string;
    'preserve-aspect-ratio'?: string;
    'primitive-units'?: number | string;
    'r'?: number | string;
    'radius'?: number | string;
    'ref-x'?: number | string;
    'ref-y'?: number | string;
    'rendering-intent'?: number | string;
    'repeat-count'?: number | string;
    'repeat-dur'?: number | string;
    'required-extensions'?: number | string;
    'required-features'?: number | string;
    'restart'?: number | string;
    'result'?: string;
    'rotate'?: number | string;
    'rx'?: number | string;
    'ry'?: number | string;
    'scale'?: number | string;
    'seed'?: number | string;
    'shape-rendering'?: number | string;
    'slope'?: number | string;
    'spacing'?: number | string;
    'specular-constant'?: number | string;
    'specular-exponent'?: number | string;
    'speed'?: number | string;
    'spread-method'?: string;
    'start-offset'?: number | string;
    'std-deviation'?: number | string;
    'stemh'?: number | string;
    'stemv'?: number | string;
    'stitch-tiles'?: number | string;
    'stop-color'?: string;
    'stop-opacity'?: number | string;
    'strikethrough-position'?: number | string;
    'strikethrough-thickness'?: number | string;
    'string'?: number | string;
    'stroke'?: string;
    'stroke-dasharray'?: string | number;
    'stroke-dashoffset'?: string | number;
    'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit';
    'stroke-linejoin'?: 'miter' | 'round' | 'bevel' | 'inherit';
    'stroke-miterlimit'?: string;
    'stroke-opacity'?: number | string;
    'stroke-width'?: number | string;
    'surface-scale'?: number | string;
    'system-language'?: number | string;
    'table-values'?: number | string;
    'target-x'?: number | string;
    'target-y'?: number | string;
    'text-anchor'?: string;
    'text-decoration'?: number | string;
    'text-length'?: number | string;
    'text-rendering'?: number | string;
    'to'?: number | string;
    'transform'?: string;
    'u1'?: number | string;
    'u2'?: number | string;
    'underline-position'?: number | string;
    'underline-thickness'?: number | string;
    'unicode'?: number | string;
    'unicode-bidi'?: number | string;
    'unicode-range'?: number | string;
    'units-per-em'?: number | string;
    'v-alphabetic'?: number | string;
    'values'?: string;
    'vector-effect'?: number | string;
    'version'?: string;
    'vert-adv-y'?: number | string;
    'vert-origin-x'?: number | string;
    'vert-origin-y'?: number | string;
    'v-hanging'?: number | string;
    'v-ideographic'?: number | string;
    'view-box'?: string;
    'view-target'?: number | string;
    'visibility'?: number | string;
    'v-mathematical'?: number | string;
    'widths'?: number | string;
    'word-spacing'?: number | string;
    'writing-mode'?: number | string;
    'x1'?: number | string;
    'x2'?: number | string;
    'x'?: number | string;
    'x-channel-selector'?: string;
    'x-height'?: number | string;
    'xlink-actuate'?: string;
    'xlink-arcrole'?: string;
    'xlink-href'?: string;
    'xlink-role'?: string;
    'xlink-show'?: string;
    'xlink-title'?: string;
    'xlink-type'?: string;
    'xml-base'?: string;
    'xml-lang'?: string;
    'xmlns'?: string;
    'xmlns-xlink'?: string;
    'xml-space'?: string;
    'y1'?: number | string;
    'y2'?: number | string;
    'y'?: number | string;
    'y-channel-selector'?: string;
    'z'?: number | string;
    'zoom-and-pan'?: string;
  }

  export interface DOMAttributes<T = Element> {
    ref?: (elm?: T) => void;
    slot?: string;

    // Clipboard Events
    onCopy?: (event: ClipboardEvent) => void;
    onCopyCapture?: (event: ClipboardEvent) => void;
    onCut?: (event: ClipboardEvent) => void;
    onCutCapture?: (event: ClipboardEvent) => void;
    onPaste?: (event: ClipboardEvent) => void;
    onPasteCapture?: (event: ClipboardEvent) => void;

    // Composition Events
    onCompositionEnd?: (event: CompositionEvent) => void;
    onCompositionEndCapture?: (event: CompositionEvent) => void;
    onCompositionStart?: (event: CompositionEvent) => void;
    onCompositionStartCapture?: (event: CompositionEvent) => void;
    onCompositionUpdate?: (event: CompositionEvent) => void;
    onCompositionUpdateCapture?: (event: CompositionEvent) => void;

    // Focus Events
    onFocus?: (event: FocusEvent) => void;
    onFocusCapture?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onBlurCapture?: (event: FocusEvent) => void;

    // Form Events
    onChange?: (event: Event) => void;
    onChangeCapture?: (event: Event) => void;
    onInput?: (event: Event) => void;
    onInputCapture?: (event: Event) => void;
    onReset?: (event: Event) => void;
    onResetCapture?: (event: Event) => void;
    onSubmit?: (event: Event) => void;
    onSubmitCapture?: (event: Event) => void;
    onInvalid?: (event: Event) => void;
    onInvalidCapture?: (event: Event) => void;

    // Image Events
    onLoad?: (event: Event) => void;
    onLoadCapture?: (event: Event) => void;
    onError?: (event: Event) => void; // also a Media Event
    onErrorCapture?: (event: Event) => void; // also a Media Event

    // Keyboard Events
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyDownCapture?: (event: KeyboardEvent) => void;
    onKeyPress?: (event: KeyboardEvent) => void;
    onKeyPressCapture?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onKeyUpCapture?: (event: KeyboardEvent) => void;

    // MouseEvents
    onAuxClick?: (event: MouseEvent) => void;
    onClick?: (event: MouseEvent) => void;
    onClickCapture?: (event: MouseEvent) => void;
    onContextMenu?: (event: MouseEvent) => void;
    onContextMenuCapture?: (event: MouseEvent) => void;
    onDblClick?: (event: MouseEvent) => void;
    onDblClickCapture?: (event: MouseEvent) => void;
    onDrag?: (event: DragEvent) => void;
    onDragCapture?: (event: DragEvent) => void;
    onDragEnd?: (event: DragEvent) => void;
    onDragEndCapture?: (event: DragEvent) => void;
    onDragEnter?: (event: DragEvent) => void;
    onDragEnterCapture?: (event: DragEvent) => void;
    onDragExit?: (event: DragEvent) => void;
    onDragExitCapture?: (event: DragEvent) => void;
    onDragLeave?: (event: DragEvent) => void;
    onDragLeaveCapture?: (event: DragEvent) => void;
    onDragOver?: (event: DragEvent) => void;
    onDragOverCapture?: (event: DragEvent) => void;
    onDragStart?: (event: DragEvent) => void;
    onDragStartCapture?: (event: DragEvent) => void;
    onDrop?: (event: DragEvent) => void;
    onDropCapture?: (event: DragEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseDownCapture?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseMoveCapture?: (event: MouseEvent) => void;
    onMouseOut?: (event: MouseEvent) => void;
    onMouseOutCapture?: (event: MouseEvent) => void;
    onMouseOver?: (event: MouseEvent) => void;
    onMouseOverCapture?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onMouseUpCapture?: (event: MouseEvent) => void;

    // Touch Events
    onTouchCancel?: (event: TouchEvent) => void;
    onTouchCancelCapture?: (event: TouchEvent) => void;
    onTouchEnd?: (event: TouchEvent) => void;
    onTouchEndCapture?: (event: TouchEvent) => void;
    onTouchMove?: (event: TouchEvent) => void;
    onTouchMoveCapture?: (event: TouchEvent) => void;
    onTouchStart?: (event: TouchEvent) => void;
    onTouchStartCapture?: (event: TouchEvent) => void;

    // Pointer Events
    onPointerDown?: (event: PointerEvent) => void;
    onPointerDownCapture?: (event: PointerEvent) => void;
    onPointerMove?: (event: PointerEvent) => void;
    onPointerMoveCapture?: (event: PointerEvent) => void;
    onPointerUp?: (event: PointerEvent) => void;
    onPointerUpCapture?: (event: PointerEvent) => void;
    onPointerCancel?: (event: PointerEvent) => void;
    onPointerCancelCapture?: (event: PointerEvent) => void;
    onPointerEnter?: (event: PointerEvent) => void;
    onPointerEnterCapture?: (event: PointerEvent) => void;
    onPointerLeave?: (event: PointerEvent) => void;
    onPointerLeaveCapture?: (event: PointerEvent) => void;
    onPointerOver?: (event: PointerEvent) => void;
    onPointerOverCapture?: (event: PointerEvent) => void;
    onPointerOut?: (event: PointerEvent) => void;
    onPointerOutCapture?: (event: PointerEvent) => void;
    onGotPointerCapture?: (event: PointerEvent) => void;
    onGotPointerCaptureCapture?: (event: PointerEvent) => void;
    onLostPointerCapture?: (event: PointerEvent) => void;
    onLostPointerCaptureCapture?: (event: PointerEvent) => void;

    // UI Events
    onScroll?: (event: UIEvent) => void;
    onScrollCapture?: (event: UIEvent) => void;

    // Wheel Events
    onWheel?: (event: WheelEvent) => void;
    onWheelCapture?: (event: WheelEvent) => void;

    // Animation Events
    onAnimationStart?: (event: AnimationEvent) => void;
    onAnimationStartCapture?: (event: AnimationEvent) => void;
    onAnimationEnd?: (event: AnimationEvent) => void;
    onAnimationEndCapture?: (event: AnimationEvent) => void;
    onAnimationIteration?: (event: AnimationEvent) => void;
    onAnimationIterationCapture?: (event: AnimationEvent) => void;

    // Transition Events
    onTransitionEnd?: (event: TransitionEvent) => void;
    onTransitionEndCapture?: (event: TransitionEvent) => void;
  }
}
