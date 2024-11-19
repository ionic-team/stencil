import { SomeTypes } from '../util';
export declare class AttributeComplex {
  nu0: number;
  nu1?: number;
  nu2?: SomeTypes.Number;
  bool0: boolean;
  bool1?: boolean;
  bool2?: boolean;
  str0: string;
  str1?: string;
  str2?: SomeTypes.String;
  private _obj;
  get obj(): string;
  set obj(newVal: string);
  getInstance(): Promise<this>;
}
