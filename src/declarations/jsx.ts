/**
 * This file gets copied to all distributions of stencil component collections.
 * - no imports
 */

declare global {
  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;
    forceUpdate(): void;
  }
  interface StencilIntrinsicElements {}
  interface StencilElementInterfaces {}
  interface StencilGlobalHTMLAttributes {}
}

export namespace JSXElements {
  export interface DefaultIntrinsicElements {
    // Stencil elements
    slot: SlotAttributes;

    // HTML
    a: AnchorHTMLAttributes<HTMLAnchorElement>;
    abbr: HTMLAttributes;
    address: HTMLAttributes;
    area: AreaHTMLAttributes<HTMLAreaElement>;
    article: HTMLAttributes;
    aside: HTMLAttributes;
    audio: AudioHTMLAttributes<HTMLAudioElement>;
    b: HTMLAttributes;
    base: BaseHTMLAttributes<HTMLBaseElement>;
    bdi: HTMLAttributes;
    bdo: HTMLAttributes;
    big: HTMLAttributes;
    blockquote: BlockquoteHTMLAttributes<HTMLQuoteElement>;
    body: HTMLAttributes<HTMLBodyElement>;
    br: HTMLAttributes<HTMLBRElement>;
    button: ButtonHTMLAttributes<HTMLButtonElement>;
    canvas: CanvasHTMLAttributes<HTMLCanvasElement>;
    caption: HTMLAttributes<HTMLTableCaptionElement>;
    cite: HTMLAttributes;
    code: HTMLAttributes;
    col: ColHTMLAttributes<HTMLTableColElement>;
    colgroup: ColgroupHTMLAttributes<HTMLTableColElement>;
    data: HTMLAttributes<HTMLDataElement>;
    datalist: HTMLAttributes<HTMLDataListElement>;
    dd: HTMLAttributes;
    del: DelHTMLAttributes<HTMLModElement>;
    details: DetailsHTMLAttributes<HTMLElement>;
    dfn: HTMLAttributes;
    dialog: DialogHTMLAttributes<HTMLDialogElement>;
    div: HTMLAttributes<HTMLDivElement>;
    dl: HTMLAttributes<HTMLDListElement>;
    dt: HTMLAttributes;
    em: HTMLAttributes;
    embed: EmbedHTMLAttributes<HTMLEmbedElement>;
    fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>;
    figcaption: HTMLAttributes;
    figure: HTMLAttributes;
    footer: HTMLAttributes;
    form: FormHTMLAttributes<HTMLFormElement>;
    h1: HTMLAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes<HTMLHeadingElement>;
    h4: HTMLAttributes<HTMLHeadingElement>;
    h5: HTMLAttributes<HTMLHeadingElement>;
    h6: HTMLAttributes<HTMLHeadingElement>;
    head: HTMLAttributes<HTMLHeadElement>;
    header: HTMLAttributes;
    hgroup: HTMLAttributes;
    hr: HTMLAttributes<HTMLHRElement>;
    html: HTMLAttributes<HTMLHtmlElement>;
    i: HTMLAttributes;
    iframe: IframeHTMLAttributes<HTMLIFrameElement>;
    img: ImgHTMLAttributes<HTMLImageElement>;
    input: InputHTMLAttributes<HTMLInputElement>;
    ins: InsHTMLAttributes<HTMLModElement>;
    kbd: HTMLAttributes;
    keygen: KeygenHTMLAttributes<HTMLElement>;
    label: LabelHTMLAttributes<HTMLLabelElement>;
    legend: HTMLAttributes<HTMLLegendElement>;
    li: LiHTMLAttributes<HTMLLIElement>;
    link: LinkHTMLAttributes<HTMLLinkElement>;
    main: HTMLAttributes;
    map: MapHTMLAttributes<HTMLMapElement>;
    mark: HTMLAttributes;
    menu: MenuHTMLAttributes<HTMLMenuElement>;
    menuitem: HTMLAttributes;
    meta: MetaHTMLAttributes<HTMLMetaElement>;
    meter: MeterHTMLAttributes<HTMLMeterElement>;
    nav: HTMLAttributes;
    noscript: HTMLAttributes;
    object: ObjectHTMLAttributes<HTMLObjectElement>;
    ol: OlHTMLAttributes<HTMLOListElement>;
    optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>;
    option: OptionHTMLAttributes<HTMLOptionElement>;
    output: OutputHTMLAttributes<HTMLOutputElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    param: ParamHTMLAttributes<HTMLParamElement>;
    picture: HTMLAttributes<HTMLPictureElement>;
    pre: HTMLAttributes<HTMLPreElement>;
    progress: ProgressHTMLAttributes<HTMLProgressElement>;
    q: QuoteHTMLAttributes<HTMLQuoteElement>;
    rp: HTMLAttributes;
    rt: HTMLAttributes;
    ruby: HTMLAttributes;
    s: HTMLAttributes;
    samp: HTMLAttributes;
    script: ScriptHTMLAttributes<HTMLScriptElement>;
    section: HTMLAttributes;
    select: SelectHTMLAttributes<HTMLSelectElement>;
    small: HTMLAttributes;
    source: SourceHTMLAttributes<HTMLSourceElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    strong: HTMLAttributes;
    style: StyleHTMLAttributes<HTMLStyleElement>;
    sub: HTMLAttributes;
    summary: HTMLAttributes;
    sup: HTMLAttributes;
    table: TableHTMLAttributes<HTMLTableElement>;
    tbody: HTMLAttributes<HTMLTableSectionElement>;
    td: TdHTMLAttributes<HTMLTableDataCellElement>;
    textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
    tfoot: HTMLAttributes<HTMLTableSectionElement>;
    th: ThHTMLAttributes<HTMLTableHeaderCellElement>;
    thead: HTMLAttributes<HTMLTableSectionElement>;
    time: TimeHTMLAttributes<HTMLTimeElement>;
    title: HTMLAttributes<HTMLTitleElement>;
    tr: HTMLAttributes<HTMLTableRowElement>;
    track: TrackHTMLAttributes<HTMLTrackElement>;
    u: HTMLAttributes;
    ul: HTMLAttributes<HTMLUListElement>;
    'var': HTMLAttributes;
    video: VideoHTMLAttributes<HTMLVideoElement>;
    wbr: HTMLAttributes;

    // SVG
    svg: SVGAttributes;
    animate: SVGAttributes;
    circle: SVGAttributes;
    clipPath: SVGAttributes;
    defs: SVGAttributes;
    ellipse: SVGAttributes;
    feBlend: SVGAttributes;
    feColorMatrix: SVGAttributes;
    feComponentTransfer: SVGAttributes;
    feComposite: SVGAttributes;
    feConvolveMatrix: SVGAttributes;
    feDiffuseLighting: SVGAttributes;
    feDisplacementMap: SVGAttributes;
    feFlood: SVGAttributes;
    feGaussianBlur: SVGAttributes;
    feImage: SVGAttributes;
    feMerge: SVGAttributes;
    feMergeNode: SVGAttributes;
    feMorphology: SVGAttributes;
    feOffset: SVGAttributes;
    feSpecularLighting: SVGAttributes;
    feTile: SVGAttributes;
    feTurbulence: SVGAttributes;
    filter: SVGAttributes;
    foreignObject: SVGAttributes;
    g: SVGAttributes;
    image: SVGAttributes;
    line: SVGAttributes;
    linearGradient: SVGAttributes;
    marker: SVGAttributes;
    mask: SVGAttributes;
    path: SVGAttributes;
    pattern: SVGAttributes;
    polygon: SVGAttributes;
    polyline: SVGAttributes;
    radialGradient: SVGAttributes;
    rect: SVGAttributes;
    stop: SVGAttributes;
    symbol: SVGAttributes;
    text: SVGAttributes;
    tspan: SVGAttributes;
    use: SVGAttributes;
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
    height?: number | string;
    marginHeight?: number;
    marginheight?: string | number;
    marginWidth?: number;
    marginwidth?: string | number;
    name?: string;
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
    height?: number | string;
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

  export interface HTMLAttributes<T = HTMLElement> extends StencilGlobalHTMLAttributes, DOMAttributes {
    // vdom specific
    innerHTML?: string;
    ref?: (elm?: T) => void;
    key?: string | number;

    // Standard HTML Attributes
    accessKey?: string;
    class?: string |  { [className: string]: boolean };
    contentEditable?: boolean | string;
    contenteditable?: boolean | string;
    contextMenu?: string;
    contextmenu?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    id?: string;
    lang?: string;
    slot?: string;
    spellCheck?: boolean;
    spellcheck?: boolean | string;
    style?: { [key: string]: string };
    tabIndex?: number;
    tabindex?: number | string;
    title?: string;

    // Unknown
    inputMode?: string;
    inputmode?: string;
    is?: string;
    radioGroup?: string; // <command>, <menuitem>
    radiogroup?: string;

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

  export interface SVGAttributes extends StencilGlobalHTMLAttributes, DOMAttributes {
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
    style?: { [key: string]: any; };
    target?: string;
    type?: string;
    width?: number | string;

    // Other HTML properties supported by SVG elements in browsers
    role?: string;
    tabIndex?: number;

    // SVG Specific attributes
    accentHeight?: number | string;
    accumulate?: 'none' | 'sum';
    additive?: 'replace' | 'sum';
    alignmentBaseline?: 'auto' | 'baseline' | 'before-edge' | 'text-before-edge' | 'middle' | 'central' | 'after-edge' |
    'text-after-edge' | 'ideographic' | 'alphabetic' | 'hanging' | 'mathematical' | 'inherit';
    allowReorder?: 'no' | 'yes';
    alphabetic?: number | string;
    amplitude?: number | string;
    arabicForm?: 'initial' | 'medial' | 'terminal' | 'isolated';
    ascent?: number | string;
    attributeName?: string;
    attributeType?: string;
    autoReverse?: number | string;
    azimuth?: number | string;
    baseFrequency?: number | string;
    baselineShift?: number | string;
    baseProfile?: number | string;
    bbox?: number | string;
    begin?: number | string;
    bias?: number | string;
    by?: number | string;
    calcMode?: number | string;
    capHeight?: number | string;
    clip?: number | string;
    clipPath?: string;
    clipPathUnits?: number | string;
    clipRule?: number | string;
    colorInterpolation?: number | string;
    colorInterpolationFilters?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
    colorProfile?: number | string;
    colorRendering?: number | string;
    contentScriptType?: number | string;
    contentStyleType?: number | string;
    cursor?: number | string;
    cx?: number | string;
    cy?: number | string;
    d?: string;
    decelerate?: number | string;
    descent?: number | string;
    diffuseConstant?: number | string;
    direction?: number | string;
    display?: number | string;
    divisor?: number | string;
    dominantBaseline?: number | string;
    dur?: number | string;
    dx?: number | string;
    dy?: number | string;
    edgeMode?: number | string;
    elevation?: number | string;
    enableBackground?: number | string;
    end?: number | string;
    exponent?: number | string;
    externalResourcesRequired?: number | string;
    fill?: string;
    fillOpacity?: number | string;
    fillRule?: 'nonzero' | 'evenodd' | 'inherit';
    filter?: string;
    filterRes?: number | string;
    filterUnits?: number | string;
    floodColor?: number | string;
    floodOpacity?: number | string;
    focusable?: number | string;
    fontFamily?: string;
    fontSize?: number | string;
    fontSizeAdjust?: number | string;
    fontStretch?: number | string;
    fontStyle?: number | string;
    fontVariant?: number | string;
    fontWeight?: number | string;
    format?: number | string;
    from?: number | string;
    fx?: number | string;
    fy?: number | string;
    g1?: number | string;
    g2?: number | string;
    glyphName?: number | string;
    glyphOrientationHorizontal?: number | string;
    glyphOrientationVertical?: number | string;
    glyphRef?: number | string;
    gradientTransform?: string;
    gradientUnits?: string;
    hanging?: number | string;
    horizAdvX?: number | string;
    horizOriginX?: number | string;
    ideographic?: number | string;
    imageRendering?: number | string;
    in2?: number | string;
    in?: string;
    intercept?: number | string;
    k1?: number | string;
    k2?: number | string;
    k3?: number | string;
    k4?: number | string;
    k?: number | string;
    kernelMatrix?: number | string;
    kernelUnitLength?: number | string;
    kerning?: number | string;
    keyPoints?: number | string;
    keySplines?: number | string;
    keyTimes?: number | string;
    lengthAdjust?: number | string;
    letterSpacing?: number | string;
    lightingColor?: number | string;
    limitingConeAngle?: number | string;
    local?: number | string;
    markerEnd?: string;
    markerHeight?: number | string;
    markerMid?: string;
    markerStart?: string;
    markerUnits?: number | string;
    markerWidth?: number | string;
    mask?: string;
    maskContentUnits?: number | string;
    maskUnits?: number | string;
    mathematical?: number | string;
    mode?: number | string;
    numOctaves?: number | string;
    offset?: number | string;
    opacity?: number | string;
    operator?: number | string;
    order?: number | string;
    orient?: number | string;
    orientation?: number | string;
    origin?: number | string;
    overflow?: number | string;
    overlinePosition?: number | string;
    overlineThickness?: number | string;
    paintOrder?: number | string;
    panose1?: number | string;
    pathLength?: number | string;
    patternContentUnits?: string;
    patternTransform?: number | string;
    patternUnits?: string;
    pointerEvents?: number | string;
    points?: string;
    pointsAtX?: number | string;
    pointsAtY?: number | string;
    pointsAtZ?: number | string;
    preserveAlpha?: number | string;
    preserveAspectRatio?: string;
    primitiveUnits?: number | string;
    r?: number | string;
    radius?: number | string;
    refX?: number | string;
    refY?: number | string;
    renderingIntent?: number | string;
    repeatCount?: number | string;
    repeatDur?: number | string;
    requiredExtensions?: number | string;
    requiredFeatures?: number | string;
    restart?: number | string;
    result?: string;
    rotate?: number | string;
    rx?: number | string;
    ry?: number | string;
    scale?: number | string;
    seed?: number | string;
    shapeRendering?: number | string;
    slope?: number | string;
    spacing?: number | string;
    specularConstant?: number | string;
    specularExponent?: number | string;
    speed?: number | string;
    spreadMethod?: string;
    startOffset?: number | string;
    stdDeviation?: number | string;
    stemh?: number | string;
    stemv?: number | string;
    stitchTiles?: number | string;
    stopColor?: string;
    stopOpacity?: number | string;
    strikethroughPosition?: number | string;
    strikethroughThickness?: number | string;
    string?: number | string;
    stroke?: string;
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
    strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
    strokeMiterlimit?: string;
    strokeOpacity?: number | string;
    strokeWidth?: number | string;
    surfaceScale?: number | string;
    systemLanguage?: number | string;
    tableValues?: number | string;
    targetX?: number | string;
    targetY?: number | string;
    textAnchor?: string;
    textDecoration?: number | string;
    textLength?: number | string;
    textRendering?: number | string;
    to?: number | string;
    transform?: string;
    u1?: number | string;
    u2?: number | string;
    underlinePosition?: number | string;
    underlineThickness?: number | string;
    unicode?: number | string;
    unicodeBidi?: number | string;
    unicodeRange?: number | string;
    unitsPerEm?: number | string;
    vAlphabetic?: number | string;
    values?: string;
    vectorEffect?: number | string;
    version?: string;
    vertAdvY?: number | string;
    vertOriginX?: number | string;
    vertOriginY?: number | string;
    vHanging?: number | string;
    vIdeographic?: number | string;
    viewBox?: string;
    viewTarget?: number | string;
    visibility?: number | string;
    vMathematical?: number | string;
    widths?: number | string;
    wordSpacing?: number | string;
    writingMode?: number | string;
    x1?: number | string;
    x2?: number | string;
    x?: number | string;
    xChannelSelector?: string;
    xHeight?: number | string;
    xlinkActuate?: string;
    xlinkArcrole?: string;
    xlinkHref?: string;
    xlinkRole?: string;
    xlinkShow?: string;
    xlinkTitle?: string;
    xlinkType?: string;
    xmlBase?: string;
    xmlLang?: string;
    xmlns?: string;
    xmlnsXlink?: string;
    xmlSpace?: string;
    y1?: number | string;
    y2?: number | string;
    y?: number | string;
    yChannelSelector?: string;
    z?: number | string;
    zoomAndPan?: string;
  }

  export interface DOMAttributes {
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

    // Media Events
    onAbort?: (event: Event) => void;
    onAbortCapture?: (event: Event) => void;
    onCanPlay?: (event: Event) => void;
    onCanPlayCapture?: (event: Event) => void;
    onCanPlayThrough?: (event: Event) => void;
    onCanPlayThroughCapture?: (event: Event) => void;
    onDurationChange?: (event: Event) => void;
    onDurationChangeCapture?: (event: Event) => void;
    onEmptied?: (event: Event) => void;
    onEmptiedCapture?: (event: Event) => void;
    onEncrypted?: (event: Event) => void;
    onEncryptedCapture?: (event: Event) => void;
    onEnded?: (event: Event) => void;
    onEndedCapture?: (event: Event) => void;
    onLoadedData?: (event: Event) => void;
    onLoadedDataCapture?: (event: Event) => void;
    onLoadedMetadata?: (event: Event) => void;
    onLoadedMetadataCapture?: (event: Event) => void;
    onLoadStart?: (event: Event) => void;
    onLoadStartCapture?: (event: Event) => void;
    onPause?: (event: Event) => void;
    onPauseCapture?: (event: Event) => void;
    onPlay?: (event: Event) => void;
    onPlayCapture?: (event: Event) => void;
    onPlaying?: (event: Event) => void;
    onPlayingCapture?: (event: Event) => void;
    onProgress?: (event: Event) => void;
    onProgressCapture?: (event: Event) => void;
    onRateChange?: (event: Event) => void;
    onRateChangeCapture?: (event: Event) => void;
    onSeeked?: (event: Event) => void;
    onSeekedCapture?: (event: Event) => void;
    onSeeking?: (event: Event) => void;
    onSeekingCapture?: (event: Event) => void;
    onStalled?: (event: Event) => void;
    onStalledCapture?: (event: Event) => void;
    onSuspend?: (event: Event) => void;
    onSuspendCapture?: (event: Event) => void;
    onTimeUpdate?: (event: Event) => void;
    onTimeUpdateCapture?: (event: Event) => void;
    onVolumeChange?: (event: Event) => void;
    onVolumeChangeCapture?: (event: Event) => void;
    onWaiting?: (event: Event) => void;
    onWaitingCapture?: (event: Event) => void;

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
