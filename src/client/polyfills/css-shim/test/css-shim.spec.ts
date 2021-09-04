import { CustomStyle } from '../custom-style';
import { mockWindow } from '@stencil/core/testing';

describe('css-shim', () => {
  it('should set value in second addCustomStyle with async tick', async () => {
    const customStyle = new CustomStyle(window, document);

    const rootElm = style(`
    html {
      --custom-a: red;
    }
    `);
    customStyle.addGlobalStyle(rootElm);

    const styleElm = style(`
    p {
      color: var(--custom-a);
    }
    `);
    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        p {
          color: red;
        }
      `)
    );
  });

  it('should set value in second addCustomStyle w/out async tick', async () => {
    const customStyle = new CustomStyle(window, document);

    const rootElm = style(`
    html {
      --custom-a: red;
    }
    `);
    customStyle.addGlobalStyle(rootElm);

    const styleElm = style(`
    p {
      color: var(--custom-a);
    }
    `);
    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        p {
          color: red;
        }
      `)
    );
  });

  it('should set value in same script in different rule', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
    html {
      --custom-a: red;
      background: yellow;
    }
    p {
      color: var(--custom-a);
    }
    `);
    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          background: yellow;
        }
        p {
          color: red;
        }
      `)
    );
  });

  it('should set value in from fallback', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --custom-a: green;
        color: var(--invalid, var(--custom-a));
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          color: green;
        }
      `)
    );
  });

  it('should set data uri value', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --stencil-logo: url('data:image/png;base64,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');
        background-image: var(--stencil-logo);
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          background-image: url('data:image/png;base64,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');
        }
      `)
    );
  });

  it('should set data uri value in same script in different rule', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
    html {
      --stencil-logo: url('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
      background: yellow;
    }
    div {
      background-image: var(--stencil-logo);
    }
    `);
    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          background: yellow;
        }
        div {
          background-image: url('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        }
      `)
    );
  });

  it('should set a base64 value in from fallback', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --stencil-logo: url('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        background-image: var(--invalid, var(--stencil-logo));
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          background-image: url('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        }
      `)
    );
  });

  it('should set a base64 value in from fallback svg', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        background-image: var(--invalid, url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMC4xMjEiPg0KICAgIDxwYXRoIGQ9Ik04LjU5OSA5LjkwNWEuNzUuNzUgMCAwIDEtMS4wNTMtLjAwMmwtNy4yMy03LjIzYS43NDUuNzQ1IDAgMCAxIDAtMS4wNTJsMS40LTEuNGMuMjktLjI5Ljc2LS4yOSAxLjA1IDBMNy41NTQgNS4wMWMuMjkuMjkuNzYyLjI5MiAxLjA1MyAwbDQuODMtNC43OTRhLjc0Ny43NDcgMCAwIDEgMS4wNS4wMDRsMS40IDEuNDA2YS43NDcuNzQ3IDAgMCAxLS4wMDcgMS4wNUw4LjU5OSA5LjkwNHoiLz4NCjwvc3ZnPg0K'));
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMC4xMjEiPg0KICAgIDxwYXRoIGQ9Ik04LjU5OSA5LjkwNWEuNzUuNzUgMCAwIDEtMS4wNTMtLjAwMmwtNy4yMy03LjIzYS43NDUuNzQ1IDAgMCAxIDAtMS4wNTJsMS40LTEuNGMuMjktLjI5Ljc2LS4yOSAxLjA1IDBMNy41NTQgNS4wMWMuMjkuMjkuNzYyLjI5MiAxLjA1MyAwbDQuODMtNC43OTRhLjc0Ny43NDcgMCAwIDEgMS4wNS4wMDRsMS40IDEuNDA2YS43NDcuNzQ3IDAgMCAxLS4wMDcgMS4wNUw4LjU5OSA5LjkwNHoiLz4NCjwvc3ZnPg0K');
        }
      `)
    );
  });

  it('should not stackoverflow with multiple base64 rules', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        background-image: var(--invalid, url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMC4xMjEiPg0KICAgIDxwYXRoIGQ9Ik04LjU5OSA5LjkwNWEuNzUuNzUgMCAwIDEtMS4wNTMtLjAwMmwtNy4yMy03LjIzYS43NDUuNzQ1IDAgMCAxIDAtMS4wNTJsMS40LTEuNGMuMjktLjI5Ljc2LS4yOSAxLjA1IDBMNy41NTQgNS4wMWMuMjkuMjkuNzYyLjI5MiAxLjA1MyAwbDQuODMtNC43OTRhLjc0Ny43NDcgMCAwIDEgMS4wNS4wMDRsMS40IDEuNDA2YS43NDcuNzQ3IDAgMCAxLS4wMDcgMS4wNUw4LjU5OSA5LjkwNHoiLz4NCjwvc3ZnPg0K'));
        background: var(--invalid2, url('data:image/svg+xml;base64,ZPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMC4xMjEiPg0KICAgIDxwYXRoIGQ9Ik04LjU5OSA5LjkwNWEuNzUuNzUgMCAwIDEtMS4wNTMtLjAwMmwtNy4yMy03LjIzYS43NDUuNzQ1IDAgMCAxIDAtMS4wNTJsMS40LTEuNGMuMjktLjI5Ljc2LS4yOSAxLjA1IDBMNy41NTQgNS4wMWMuMjkuMjkuNzYyLjI5MiAxLjA1MyAwbDQuODMtNC43OTRhLjc0Ny43NDcgMCAwIDEgMS4wNS4wMDRsMS40IDEuNDA2YS43NDcuNzQ3IDAgMCAxLS4wMDcgMS4wNUw4LjU5OSA5LjkwNHoiLz4NCjwvc3ZnPg0K'));
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMC4xMjEiPg0KICAgIDxwYXRoIGQ9Ik04LjU5OSA5LjkwNWEuNzUuNzUgMCAwIDEtMS4wNTMtLjAwMmwtNy4yMy03LjIzYS43NDUuNzQ1IDAgMCAxIDAtMS4wNTJsMS40LTEuNGMuMjktLjI5Ljc2LS4yOSAxLjA1IDBMNy41NTQgNS4wMWMuMjkuMjkuNzYyLjI5MiAxLjA1MyAwbDQuODMtNC43OTRhLjc0Ny43NDcgMCAwIDEgMS4wNS4wMDRsMS40IDEuNDA2YS43NDcuNzQ3IDAgMCAxLS4wMDcgMS4wNUw4LjU5OSA5LjkwNHoiLz4NCjwvc3ZnPg0K');
          background: url('data:image/svg+xml;base64,ZPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxMC4xMjEiPg0KICAgIDxwYXRoIGQ9Ik04LjU5OSA5LjkwNWEuNzUuNzUgMCAwIDEtMS4wNTMtLjAwMmwtNy4yMy03LjIzYS43NDUuNzQ1IDAgMCAxIDAtMS4wNTJsMS40LTEuNGMuMjktLjI5Ljc2LS4yOSAxLjA1IDBMNy41NTQgNS4wMWMuMjkuMjkuNzYyLjI5MiAxLjA1MyAwbDQuODMtNC43OTRhLjc0Ny43NDcgMCAwIDEgMS4wNS4wMDRsMS40IDEuNDA2YS43NDcuNzQ3IDAgMCAxLS4wMDcgMS4wNUw4LjU5OSA5LjkwNHoiLz4NCjwvc3ZnPg0K');
        }
      `)
    );
  });

  it('should set value in same script in different rule and remove var only rule', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --custom-a: red;
      }
      p {
        color: var(--custom-a);
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html{}
        p {
          color: red;
        }
      `)
    );
  });

  it('should set value in same script in same rule', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --custom-a: red;
        --custom-b: blue;
        color: var(--custom-a);
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html {
          color: red;
        }
      `)
    );
  });

  it('should set value in transform', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --custom: 88px;
      }
      .transform {
        transform: translate3d(0, var(--custom), 0);
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html{}
        .transform {
          transform: translate3d(0, 88px, 0);
        }
      `)
    );
  });

  it('should set value in keyframe animation', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --custom-a: 0.3;
        --custom-b: 0.8;
      }
      @keyframes animation {
        0% { opacity: var(--custom-a); }
        100% { opacity: var(--custom-b); }
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html{}
        @keyframes animation {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `)
    );
  });

  it('should set value in @media', async () => {
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --custom: red;
      }
      @media only screen {
        body {
          color: var(--custom);
        }
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html{}
        @media only screen {
          body {
            color: red;
          }
        }
      `)
    );
  });

  it('should set value in animation', async () => {
    (window as any).matchMedia = () => {
      return { matches: true };
    };
    const customStyle = new CustomStyle(window, document);

    const styleElm = style(`
      html {
        --ani-name: slidein;
        --ani-dur: 3s;
      }
      div {
        animation-name: var(--ani-name);
        animation-duration: var(--ani-dur);
      }
    `);

    customStyle.addGlobalStyle(styleElm);

    expect(css(styleElm.textContent)).toBe(
      css(`
        html{}
        div {
          animation-name: slidein;
          animation-duration: 3s;
        }
      `)
    );
  });

  var window: Window;
  var document: Document;

  function style(text: string) {
    const elm = document.createElement('style');
    elm.textContent = text;
    return elm;
  }

  function css(c: string) {
    return c.replace(/\s/g, '').toLowerCase();
  }

  beforeEach(() => {
    window = mockWindow();
    document = window.document;
  });
});
