import { setMode } from "@stencil/core";


export default function() {
  setMode((elm: any) => elm.mode || elm.getAttribute('mode') || document.documentElement.getAttribute('mode') || 'buford');
}
