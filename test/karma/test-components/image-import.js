import { h, proxyCustomElement } from '@stencil/core/internal/client';

const stencilLogoSvg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTMzNi40LDBIMTc1LjZDNzksMCwwLDc5LDAsMTc1LjZ2MTYwLjhDMCw0MzMsNzksNTEyLDE3NS42LDUxMmgxNjAuOEM0MzMsNTEyLDUxMiw0MzMsNTEyLDMzNi40VjE3NS42CgkJQzUxMiw3OSw0MzMsMCwzMzYuNCwweiBNMzc1LjksMzM4LjFjMCwyNi45LTM5LDQ4LjgtNjUuOSw0OC44SDIwMmMtMjYuOSwwLTY1LjktMjEuOS02NS45LTQ4Ljh2LTIuNmgyMzkuOFYzMzguMXogTTM3NS45LDI4MS43CgkJSDIwMmMtMjYuOSwwLTY1LjktMjEuOS02NS45LTQ4Ljh2LTIuNkgzMTBjMjYuOSwwLDY1LjksMjEuOSw2NS45LDQ4LjhWMjgxLjd6IE0zNzUuOSwxNzYuNUgxMzYuMXYtMi42YzAtMjYuOSwzOS00OC44LDY1LjktNDguOAoJCWgxMDhjMjYuOSwwLDY1LjksMjEuOSw2NS45LDQ4LjhWMTc2LjV6Ii8+CjwvZz4KPC9zdmc+Cg==';

const ImageImport$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("div", null, h("img", { src: stencilLogoSvg })));
  }
};

const ImageImport = /*@__PURE__*/proxyCustomElement(ImageImport$1, [0,"image-import"]);
const components = ['image-import', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'image-import':
        tagName = 'image-import';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ImageImport);
        }
        break;

    }
  });
};

export { ImageImport, defineCustomElement };
