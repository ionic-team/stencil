

export const styleImports = new Map<string, string>();
styleImports.set(`/shared.css`, `
button {
  font-size: 24px;
  color: white;
  font-weight: bold;
}
`);

styleImports.set(`/style-import.css`, `
@import "./shared.css";

my-button { display: block; padding: 20px; background: #ddd; }

my-button::before { content: "style-import.css"; position: absolute; left: 0; top: 0; }

button { background: purple; }
`);

styleImports.set(`/scoped-style-import.css`, `
@import "./shared.css";

:host { display: block; padding: 20px; background: #ddd; }

:host::before { content: "scoped-style-import.css"; position: absolute; left: 0; top: 0; }

button { background: maroon; }
`);

styleImports.set(`/ios.css`, `
@import "shared.css";

:host { display: block; padding: 20px; background: #ddd; }

:host::before { content: "ios.css"; position: absolute; left: 0; top: 0; }

button { background: blue; }
`);

styleImports.set(`/md.css`, `
@import "/shared.css";

:host { display: block; padding: 20px; background: #ddd; }

:host::before { content: "md.css"; position: absolute; left: 50px; top: 0; }

button { background: green; }
`);

styleImports.set(`/my-counter.css`, `
.large {
  font-size: 200%;
}

.value {
  width: 4rem;
  display: inline-block;
  text-align: center;
}

.btn {
  width: 64px;
  height: 64px;
  border: none;
  border-radius: 10px;
  background-color: seagreen;
  color: white;
}
`);

export const cssTemplatePlugin = {
  name: 'cssTemplatePlugin',

  load(id: string) {
    return styleImports.get(id.split('?')[0]);
  }
};
