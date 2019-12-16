
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
  const workerProxy: {[method: string]: (...args: any[]) => Promise<any>}
  export const worker: Worker;
  export const fileName: string;
  export default workerProxy;
}
