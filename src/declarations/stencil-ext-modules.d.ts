
declare module '*.css' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.txt' {
  const src: string;
  export default src;
}

declare module '*.frag' {
  const src: string;
  export default src;
}

declare module '*.vert' {
  const src: string;
  export default src;
}

declare module '*?worker' {
  export const worker: Worker;
  export const fileName: string;
}

type WasmExports = Record<string, (...args: any[]) => any>;

declare module '*.wasm' {
  const wasmExports: WasmExports;
  export = wasmExports;
}

declare module '*.rs' {
  const wasmExports: WasmExports;
  export = wasmExports;
}
