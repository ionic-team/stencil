export declare class DynamicImport {
  value?: string;
  componentWillLoad(): Promise<void>;
  getResult(): Promise<string>;
  update(): Promise<void>;
  render(): any;
}
