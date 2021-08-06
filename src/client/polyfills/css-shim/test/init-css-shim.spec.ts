import { fixRelativeUrls, hasCssVariables, hasRelativeUrls } from '../load-link-styles';

describe('hasCssVariables', () => {
  it('false for standard css', () => {
    const text = `
    .my-classname {
      color: brown;
    }
    #myid {
      color: brown;
    }
    [my='attr'] {
      color: brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('false for -- in classname or attribute', () => {
    const text = `
    .my--classname {
      color: brown;
    }
    [my='attr--ibute'] {
      color: brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('false for normal CSS with a pseudo class', () => {
    const text = `
      .test--el:hover {
        background-color: green
      }
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('false for minified CSS with a pseudo class', () => {
    const text = `
      .test--el:hover{background-color: green}
    `;
    expect(hasCssVariables(text)).toBe(false);
  });

  it('true for -- declaration w/ spaces', () => {
    const text = `
    element {
      --main-bg-color      : brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for -- declaration', () => {
    const text = `
    element {
      --main-bg-color: brown;
    }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for css var() and -- declaration', () => {
    const text = `
      element {
        background-color: var(--main-bg-color);
      }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for minified CSS with a semicolon', () => {
    const text = `element{background-color: green;--main-text-color: black}`;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for minified CSS without a semicolon', () => {
    const text = `element{--main-text-color: black}`;
    expect(hasCssVariables(text)).toBe(true);
  });

  it('true for var()', () => {
    const text = `
      element {
        background-color: var(derp);
      }
    `;
    expect(hasCssVariables(text)).toBe(true);
  });
});

describe('hasRelativeUrls', () => {
  it('false for absolute urls', () => {
    const text = `
      div {
        background-image: url('http://example.com/mytestimage.jpg');
      }
    `;

    expect(hasRelativeUrls(text)).toBe(false);
  });

  it('false for absolute https urls', () => {
    const text = `
      div {
        background-image: url('https://example.com/mytestimage.jpg');
      }
    `;

    expect(hasRelativeUrls(text)).toBe(false);
  });

  it('true for relative urls', () => {
    const text = `
      div {
        background-image: url('assets/images/mytestimage.jpg');
      }
    `;

    expect(hasRelativeUrls(text)).toBe(true);
  });

  it('false for relative urls without domain', () => {
    const text = `
      div {
        background-image: url('/assets/images/mytestimage.jpg');
      }
    `;

    expect(hasRelativeUrls(text)).toBe(false);
  });
});

describe('fixRelativeUrls', () => {
  it('should transform prepend relative urls with base path', () => {
    const text = `
      div {
        background-image: url('../images/mytestimage.jpg');
      }
    `;

    expect(fixRelativeUrls(text, '/assets/css/styles.css')).toBe(`
      div {
        background-image: url('/assets/css/../images/mytestimage.jpg');
      }
    `);
  });

  it('should keep absolute urls', () => {
    const text = `
      div {
        background-image: url('http://www.example.com/assets/images/mytestimage.jpg');
      }
    `;

    expect(fixRelativeUrls(text, '/assets/css/styles.css')).toBe(`
      div {
        background-image: url('http://www.example.com/assets/images/mytestimage.jpg');
      }
    `);
  });

  it('should keep absolute urls', () => {
    const text = `
      div {
        background-image: url('/assets/images/mytestimage.jpg');
      }
    `;

    expect(fixRelativeUrls(text, '/assets/css/styles.css')).toBe(`
      div {
        background-image: url('/assets/images/mytestimage.jpg');
      }
    `);
  });

  it('should transform prepend relative urls contains data folder with base path', () => {
    const text = `
      div {
        background-image: url('data/images/mytestimage.jpg');
      }
    `;

    expect(fixRelativeUrls(text, '/assets/css/styles.css')).toBe(`
      div {
        background-image: url('/assets/css/data/images/mytestimage.jpg');
      }
    `);
  });

  it.each(['data:,ABC123', 'data:text/plain,ABC123', 'data:text/plain;base64,ABC123'])(
    'should keep data url',
    (dataURL) => {
      const text = `
      div {
        background-image: url('${dataURL}');
      }
    `;

      expect(fixRelativeUrls(text, '/assets/css/styles.css')).toBe(`
      div {
        background-image: url('${dataURL}');
      }
    `);
    }
  );
});
