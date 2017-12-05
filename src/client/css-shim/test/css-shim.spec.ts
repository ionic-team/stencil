import { CustomStyle } from '../custom-style';
import { mockWindow } from '../../../testing/mocks';


describe('css-shim', () => {

  it('should set value in second addCustomStyle with async tick', async () => {
    const customStyle = new CustomStyle(window, document);

    const rootElm = style(`
    html {
      --custom-a: red;
    }
    `);
    await customStyle.addStyle(rootElm);

    const styleElm = style(`
    p {
      color: var(--custom-a);
    }
    `);
    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
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
    customStyle.addStyle(rootElm);

    const styleElm = style(`
    p {
      color: var(--custom-a);
    }
    `);
    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
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
    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
      css(`
        html {
          color: green;
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
      css(`
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
      css(`
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
      css(`
        @keyframes animation {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `)
    );
  });

  it('should set value in @media when matchMedia doesnt match', async () => {
    (window as any).matchMedia = () => {
      return { matches: false
      };
    };
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe('');
  });

  it('should set value in @media when matchMedia matches', async () => {
    (window as any).matchMedia = () => {
      return { matches: true
      };
    };
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
      css(`
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
      return { matches: true
      };
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

    await customStyle.addStyle(styleElm);

    expect(css(styleElm.innerHTML)).toBe(
      css(`
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
    elm.innerHTML = text;
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
