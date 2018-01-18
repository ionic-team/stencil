import { Config } from '../../util/interfaces';


export function buildExpressionReplacer(config: Config, input: string) {
  return input
          .replace(
            /process.env.NODE_ENV(\s*)(===|==)(\s*)['"`]production['"`]/g,
            (!config.devMode).toString()
          )
          .replace(
            /process.env.NODE_ENV(\s*)(!==|!=)(\s*)['"`]development['"`]/g,
            (!config.devMode).toString()
          )
          .replace(
            /process.env.NODE_ENV(\s*)(===|==)(\s*)['"`]development['"`]/g,
            (config.devMode).toString()
          )
          .replace(
            /process.env.NODE_ENV(\s*)(!==|!=)(\s*)['"`]production['"`]/g,
            (config.devMode).toString()
          );
}
