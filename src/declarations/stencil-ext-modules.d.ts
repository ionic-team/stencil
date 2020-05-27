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

declare module '*?format=url' {
  const src: string;
  export default src;
}

declare module '*?format=text' {
  const content: string;
  export default content;
}
