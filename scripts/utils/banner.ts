import { BuildOptions } from './options';


export function getBanner(opts: BuildOptions, fileName: string) {
  return [
    `/*!`,
    ` ${fileName} v${opts.version} | MIT Licensed | https://stenciljs.com`,
    `*/`
  ].join('\n');
}
