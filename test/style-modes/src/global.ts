import { setMode } from "@stencil/core";

setMode((elm: any) => elm.mode || elm.getAttribute('mode'));
