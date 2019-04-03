import { setMode } from "@stencil/core";


export default function() {
  setMode((elm: any) => elm.mode || elm.getAttribute('mode'));
}
