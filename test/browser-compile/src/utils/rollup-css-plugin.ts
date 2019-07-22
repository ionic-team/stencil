

export const styleImports = new Map<string, string>();
styleImports.set(`/style-import.css`, `
my-button { display: block; padding: 40px; background: #ddd; }

my-button::before { content: "style-import.css"; position: absolute; left: 0; top: 0; }

button { font-size: 24px; background: purple; color: white; font-weight: bold; }
`);

styleImports.set(`/scoped-style-import.css`, `
:host { display: block; padding: 40px; background: #ddd; }

:host::before { content: "scoped-style-import.css"; position: absolute; left: 0; top: 0; }

button { font-size: 24px; background: maroon; color: white; font-weight: bold; }
`);


export const cssPlugin = () => {
  return {

    load(id: string) {
      const css = styleImports.get(id);
      if (typeof css !== 'string') {
        return null;
      }

      return `export default ${JSON.stringify(css)}`;
    }

  }
};
