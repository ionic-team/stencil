declare module 'https://deno.land/std/fs/mod.ts' {
  export interface WalkEntry {
    name: string;
    isFile: boolean;
    isDirectory: boolean;
    isSymlink: boolean;
    path: string;
  }
  export function ensureDirSync(dir: string): Promise<void>;
  export function expandGlob(
    glob: string,
    opts?: {
      root?: string;
      exclude?: string[];
      includeDirs?: boolean;
      extended?: boolean;
      globstar?: boolean;
    },
  ): AsyncIterableIterator<WalkEntry>;
}

declare module 'https://deno.land/std/path/mod.ts' {
  export function isGlob(p: string): boolean;
  export function normalize(p: string): string;
  export function join(...paths: string[]): string;
  export function resolve(...pathSegments: string[]): string;
  export function isAbsolute(p: string): boolean;
  export function relative(from: string, to: string): string;
  export function dirname(p: string): string;
  export function basename(p: string, ext?: string): string;
  export function extname(p: string): string;
  export function parse(p: string): any;
  export const sep: string;
  export const delimiter: string;
  export const posix: any;
  export const win32: any;
}

declare module 'https://deno.land/std/node/fs.ts' {
  export default function nodeFs(): any;
}

declare module 'https://deno.land/std/fmt/colors.ts' {
  export function bgRed(str: string): string;
  export function blue(str: string): string;
  export function bold(str: string): string;
  export function cyan(str: string): string;
  export function dim(str: string): string;
  export function gray(str: string): string;
  export function green(str: string): string;
  export function magenta(str: string): string;
  export function red(str: string): string;
  export function yellow(str: string): string;
}

declare module 'https://deno.land/std/node/module.ts' {
  export const builtinModules: string[];
  export function createRequire(filename: string | URL): any;
}
