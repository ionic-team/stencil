export declare class DynamicCssVariables {
  bgColor: string;
  getBackgroundStyle(): {
    background: string;
    '--font-color': string;
  } | {
    background?: undefined;
    '--font-color'?: undefined;
  };
  changeColor(): void;
  render(): any[];
}
