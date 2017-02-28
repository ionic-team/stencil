import { Config } from '../config/config';


export function initTheme(theme: ComponentTheme, componentName: string, config: Config) {
  theme.cmpName = componentName;
  config;
  theme.mode = config.get('mode');
  theme.color = 'primary';
  theme.host = {};

  updateThemeHost(theme);
}


export function setColor(theme: ComponentTheme, color: string) {
  theme.color = color;
  updateThemeHost(theme);
}


export function setMode(theme: ComponentTheme, mode: string) {
  theme.mode = mode;
  updateThemeHost(theme);
}


function updateThemeHost(theme: ComponentTheme) {
  const keys = Object.keys(theme.host);
  let i = keys.length;
  while (i--) {
    delete theme.host[keys[i]];
  }

  theme.host[`${theme.cmpName}-${theme.mode}`] = true;
  theme.host[`${theme.cmpName}-${theme.mode}-${theme.color}`] = true;
}


export interface ComponentTheme {
  cmpName?: string;
  mode?: string;
  color?: string;
  host?: {[cssClassName: string]: boolean};
}
