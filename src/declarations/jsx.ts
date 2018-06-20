export type CssClassMap = { [className: string]: boolean };


declare global {

  namespace JSX {

    interface Element {}

    export interface IntrinsicElements {
      // Stencil elements
      slot: JSXElements.SlotAttributes;

      // HTML
      a: JSXElements.AnchorHTMLAttributes;
      abbr: JSXElements.HTMLAttributes;
      address: JSXElements.HTMLAttributes;
      area: JSXElements.AreaHTMLAttributes;
      article: JSXElements.HTMLAttributes;
      aside: JSXElements.HTMLAttributes;
      audio: JSXElements.AudioHTMLAttributes;
      b: JSXElements.HTMLAttributes;
      base: JSXElements.BaseHTMLAttributes;
      bdi: JSXElements.HTMLAttributes;
      bdo: JSXElements.HTMLAttributes;
      big: JSXElements.HTMLAttributes;
      blockquote: JSXElements.BlockquoteHTMLAttributes;
      body: JSXElements.HTMLAttributes;
      br: JSXElements.HTMLAttributes;
      button: JSXElements.ButtonHTMLAttributes;
      canvas: JSXElements.CanvasHTMLAttributes;
      caption: JSXElements.HTMLAttributes;
      cite: JSXElements.HTMLAttributes;
      code: JSXElements.HTMLAttributes;
      col: JSXElements.ColHTMLAttributes;
      colgroup: JSXElements.ColgroupHTMLAttributes;
      data: JSXElements.HTMLAttributes;
      datalist: JSXElements.HTMLAttributes;
      dd: JSXElements.HTMLAttributes;
      del: JSXElements.DelHTMLAttributes;
      details: JSXElements.DetailsHTMLAttributes;
      dfn: JSXElements.HTMLAttributes;
      dialog: JSXElements.DialogHTMLAttributes;
      div: JSXElements.HTMLAttributes;
      dl: JSXElements.HTMLAttributes;
      dt: JSXElements.HTMLAttributes;
      em: JSXElements.HTMLAttributes;
      embed: JSXElements.EmbedHTMLAttributes;
      fieldset: JSXElements.FieldsetHTMLAttributes;
      figcaption: JSXElements.HTMLAttributes;
      figure: JSXElements.HTMLAttributes;
      footer: JSXElements.HTMLAttributes;
      form: JSXElements.FormHTMLAttributes;
      h1: JSXElements.HTMLAttributes;
      h2: JSXElements.HTMLAttributes;
      h3: JSXElements.HTMLAttributes;
      h4: JSXElements.HTMLAttributes;
      h5: JSXElements.HTMLAttributes;
      h6: JSXElements.HTMLAttributes;
      head: JSXElements.HTMLAttributes;
      header: JSXElements.HTMLAttributes;
      hgroup: JSXElements.HTMLAttributes;
      hr: JSXElements.HTMLAttributes;
      html: JSXElements.HTMLAttributes;
      i: JSXElements.HTMLAttributes;
      iframe: JSXElements.IframeHTMLAttributes;
      img: JSXElements.ImgHTMLAttributes;
      input: JSXElements.InputHTMLAttributes;
      ins: JSXElements.InsHTMLAttributes;
      kbd: JSXElements.HTMLAttributes;
      keygen: JSXElements.KeygenHTMLAttributes;
      label: JSXElements.LabelHTMLAttributes;
      legend: JSXElements.HTMLAttributes;
      li: JSXElements.LiHTMLAttributes;
      link: JSXElements.LinkHTMLAttributes;
      main: JSXElements.HTMLAttributes;
      map: JSXElements.MapHTMLAttributes;
      mark: JSXElements.HTMLAttributes;
      menu: JSXElements.MenuHTMLAttributes;
      menuitem: JSXElements.HTMLAttributes;
      meta: JSXElements.MetaHTMLAttributes;
      meter: JSXElements.MeterHTMLAttributes;
      nav: JSXElements.HTMLAttributes;
      noscript: JSXElements.HTMLAttributes;
      object: JSXElements.ObjectHTMLAttributes;
      ol: JSXElements.OlHTMLAttributes;
      optgroup: JSXElements.OptgroupHTMLAttributes;
      option: JSXElements.OptionHTMLAttributes;
      output: JSXElements.OutputHTMLAttributes;
      p: JSXElements.HTMLAttributes;
      param: JSXElements.ParamHTMLAttributes;
      picture: JSXElements.HTMLAttributes;
      pre: JSXElements.HTMLAttributes;
      progress: JSXElements.ProgressHTMLAttributes;
      q: JSXElements.QuoteHTMLAttributes;
      rp: JSXElements.HTMLAttributes;
      rt: JSXElements.HTMLAttributes;
      ruby: JSXElements.HTMLAttributes;
      s: JSXElements.HTMLAttributes;
      samp: JSXElements.HTMLAttributes;
      script: JSXElements.ScriptHTMLAttributes;
      section: JSXElements.HTMLAttributes;
      select: JSXElements.SelectHTMLAttributes;
      small: JSXElements.HTMLAttributes;
      source: JSXElements.SourceHTMLAttributes;
      span: JSXElements.HTMLAttributes;
      strong: JSXElements.HTMLAttributes;
      style: JSXElements.StyleHTMLAttributes;
      sub: JSXElements.HTMLAttributes;
      summary: JSXElements.HTMLAttributes;
      sup: JSXElements.HTMLAttributes;
      table: JSXElements.TableHTMLAttributes;
      tbody: JSXElements.HTMLAttributes;
      td: JSXElements.TdHTMLAttributes;
      textarea: JSXElements.TextareaHTMLAttributes;
      tfoot: JSXElements.HTMLAttributes;
      th: JSXElements.ThHTMLAttributes;
      thead: JSXElements.HTMLAttributes;
      time: JSXElements.TimeHTMLAttributes;
      title: JSXElements.HTMLAttributes;
      tr: JSXElements.HTMLAttributes;
      track: JSXElements.TrackHTMLAttributes;
      u: JSXElements.HTMLAttributes;
      ul: JSXElements.HTMLAttributes;
      'var': JSXElements.HTMLAttributes;
      video: JSXElements.VideoHTMLAttributes;
      wbr: JSXElements.HTMLAttributes;

      // catch all
      [tagName: string]: any;
    }
  }


  namespace JSXElements {

    export interface SlotAttributes {
      name?: string;
    }

    export interface AnchorHTMLAttributes extends HTMLAttributes {
      download?: any;
      href?: string;
      hrefLang?: string;
      hreflang?: string;
      media?: string;
      rel?: string;
      target?: string;
    }

    export interface AreaHTMLAttributes extends HTMLAttributes {
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

    export interface AudioHTMLAttributes extends MediaHTMLAttributes {}

    export interface AreaHTMLAttributes extends HTMLAttributes {
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

    export interface BaseHTMLAttributes extends HTMLAttributes {
      href?: string;
      target?: string;
    }

    export interface BlockquoteHTMLAttributes extends HTMLAttributes {
      cite?: string;
    }

    export interface ButtonHTMLAttributes extends HTMLAttributes {
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

    export interface CanvasHTMLAttributes extends HTMLAttributes {
      height?: number | string;
      width?: number | string;
    }

    export interface ColHTMLAttributes extends HTMLAttributes {
      span?: number;
    }

    export interface ColgroupHTMLAttributes extends HTMLAttributes {
      span?: number;
    }

    export interface DetailsHTMLAttributes extends HTMLAttributes {
      open?: boolean;
    }

    export interface DelHTMLAttributes extends HTMLAttributes {
      cite?: string;
      dateTime?: string;
      datetime?: string;
    }

    export interface DialogHTMLAttributes extends HTMLAttributes {
      open?: boolean;
      returnValue?: string;
    }

    export interface EmbedHTMLAttributes extends HTMLAttributes {
      height?: number | string;
      src?: string;
      type?: string;
      width?: number | string;
    }

    export interface FieldsetHTMLAttributes extends HTMLAttributes {
      disabled?: boolean;
      form?: string;
      name?: string;
    }

    export interface FormHTMLAttributes extends HTMLAttributes {
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

    export interface HtmlHTMLAttributes extends HTMLAttributes {
      manifest?: string;
    }

    export interface IframeHTMLAttributes extends HTMLAttributes {
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

    export interface ImgHTMLAttributes extends HTMLAttributes {
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

    export interface InsHTMLAttributes extends HTMLAttributes {
      cite?: string;
      dateTime?: string;
      datetime?: string;
    }

    export interface InputHTMLAttributes extends HTMLAttributes {
      accept?: string;
      alt?: string;
      autoComplete?: string;
      autocomplete?: string;
      autoFocus?: boolean;
      autofocus?: boolean | string;
      capture?: boolean; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
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

    export interface KeygenHTMLAttributes extends HTMLAttributes {
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

    export interface LabelHTMLAttributes extends HTMLAttributes {
      form?: string;
      htmlFor?: string;
      htmlfor?: string;
    }

    export interface LiHTMLAttributes extends HTMLAttributes {
      value?: string | string[] | number;
    }

    export interface LinkHTMLAttributes extends HTMLAttributes {
      href?: string;
      hrefLang?: string;
      hreflang?: string;
      integrity?: string;
      media?: string;
      rel?: string;
      sizes?: string;
      type?: string;
    }

    export interface MapHTMLAttributes extends HTMLAttributes {
      name?: string;
    }

    export interface MenuHTMLAttributes extends HTMLAttributes {
      type?: string;
    }

    export interface MediaHTMLAttributes extends HTMLAttributes {
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

    export interface MetaHTMLAttributes extends HTMLAttributes {
      charSet?: string;
      charset?: string;
      content?: string;
      httpEquiv?: string;
      httpequiv?: string;
      name?: string;
    }

    export interface MeterHTMLAttributes extends HTMLAttributes {
      form?: string;
      high?: number;
      low?: number;
      max?: number | string;
      min?: number | string;
      optimum?: number;
      value?: string | string[] | number;
    }

    export interface QuoteHTMLAttributes extends HTMLAttributes {
      cite?: string;
    }

    export interface ObjectHTMLAttributes extends HTMLAttributes {
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

    export interface OlHTMLAttributes extends HTMLAttributes {
      reversed?: boolean;
      start?: number;
    }

    export interface OptgroupHTMLAttributes extends HTMLAttributes {
      disabled?: boolean;
      label?: string;
    }

    export interface OptionHTMLAttributes extends HTMLAttributes {
      disabled?: boolean;
      label?: string;
      selected?: boolean;
      value?: string | string[] | number;
    }

    export interface OutputHTMLAttributes extends HTMLAttributes {
      form?: string;
      htmlFor?: string;
      htmlfor?: string;
      name?: string;
    }

    export interface ParamHTMLAttributes extends HTMLAttributes {
      name?: string;
      value?: string | string[] | number;
    }

    export interface ProgressHTMLAttributes extends HTMLAttributes {
      max?: number | string;
      value?: string | string[] | number;
    }

    export interface ScriptHTMLAttributes extends HTMLAttributes {
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

    export interface SelectHTMLAttributes extends HTMLAttributes {
      autoFocus?: boolean;
      disabled?: boolean;
      form?: string;
      multiple?: boolean;
      name?: string;
      required?: boolean;
      size?: number;
    }

    export interface SourceHTMLAttributes extends HTMLAttributes {
      media?: string;
      sizes?: string;
      src?: string;
      srcSet?: string;
      type?: string;
    }

    export interface StyleHTMLAttributes extends HTMLAttributes {
      media?: string;
      nonce?: string;
      scoped?: boolean;
      type?: string;
    }

    export interface TableHTMLAttributes extends HTMLAttributes {
      cellPadding?: number | string;
      cellpadding?: number | string;
      cellSpacing?: number | string;
      cellspacing?: number | string;
      summary?: string;
    }

    export interface TextareaHTMLAttributes extends HTMLAttributes {
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

    export interface TdHTMLAttributes extends HTMLAttributes {
      colSpan?: number;
      headers?: string;
      rowSpan?: number;
    }

    export interface ThHTMLAttributes extends HTMLAttributes {
      colSpan?: number;
      headers?: string;
      rowSpan?: number;
      rowspan?: number | string;
      scope?: string;
    }

    export interface TimeHTMLAttributes extends HTMLAttributes {
      dateTime?: string;
    }

    export interface TrackHTMLAttributes extends HTMLAttributes {
      default?: boolean;
      kind?: string;
      label?: string;
      src?: string;
      srcLang?: string;
      srclang?: string;
    }

    export interface VideoHTMLAttributes extends MediaHTMLAttributes {
      height?: number | string;
      playsInline?: boolean;
      playsinline?: boolean | string;
      poster?: string;
      width?: number | string;
    }

    export interface HTMLAttributes extends DOMAttributes {
      // vdom specific
      innerHTML?: string;
      ref?: (elm?: HTMLElement) => void;
      key?: string | number;

      // Standard HTML Attributes
      accessKey?: string;
      class?: string | CssClassMap;
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

    export interface SVGAttributes extends DOMAttributes {
      // Attributes which also defined in HTMLAttributes
      // See comment in SVGDOMPropertyConfig.js
      class?: string | CssClassMap;
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

      // MouseEvents
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

    // required for the compiler to avoid global JSX namespace collisions
    interface StencilJSX {}

  }

}
