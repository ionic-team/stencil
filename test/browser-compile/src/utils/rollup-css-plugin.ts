

export const styleImports = new Map<string, string>();
styleImports.set(`/style-import.css`, `
:host { padding: 20px; background: #ddd; }

:host::before { content: "style-import.css"; position: absolute; left: 0; top: 0; }

button { font-size: 24px; background: purple; color: white; font-weight: bold; }
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
